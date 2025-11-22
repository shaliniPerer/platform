"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"
import { Check, X, Users } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [investors, setInvestors] = useState<any[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])

  // -----------------------------
  // CHECK ADMIN LOGIN
  // -----------------------------
  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/auth/admin-login")
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  // -----------------------------
  // FETCH INVESTORS FROM DATABASE
  // -----------------------------
  async function loadInvestors() {
    try {
      const res = await fetch("/api/admin/investors")
      const data = await res.json()
      setInvestors(data)
    } catch (error) {
      console.log("Investor fetch error:", error)
    }
  }

  // -----------------------------
  // FETCH WITHDRAW REQUESTS
  // -----------------------------
  async function loadWithdrawals() {
    try {
      const res = await fetch("/api/admin/withdrawals")
      const data = await res.json()
      setWithdrawalRequests(data)
    } catch (error) {
      console.log("Withdrawal fetch error:", error)
    }
  }

  // -----------------------------
  // LOAD BOTH TABLES AND POLLING
  // -----------------------------
  useEffect(() => {
    loadInvestors()
    loadWithdrawals()

    // Polling withdrawal requests every 5 seconds
    const interval = setInterval(() => {
      loadWithdrawals()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // -----------------------------
  // APPROVE/REJECT WITHDRAWAL
  // -----------------------------
  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/withdrawals/${id}/approve`, { method: "POST" })
    loadWithdrawals()
  }

  const handleReject = async (id: string) => {
    await fetch(`/api/admin/withdrawals/${id}/reject`, { method: "POST" })
    loadWithdrawals()
  }

  if (!admin) return null

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage investors and withdrawal requests</p>
          </div>

          {/* Admin Profile */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Admin Profile
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Admin Name</p>
                <p className="font-medium">{admin.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{admin.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">+94 71 234 5678</p>
              </div>
            </div>
          </Card>

          {/* Investors Table */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">All Investors</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                     <th className="py-3 px-2">Full Name</th>
                     <th className="py-3 px-2">NIC</th>
                     <th className="py-3 px-2">Address</th>
                     <th className="py-3 px-2">District</th>
                     <th className="py-3 px-2">Province</th>
                     <th className="py-3 px-2">Postal Code</th>
                     <th className="py-3 px-2">Phone</th>
                     <th className="py-3 px-2">Email</th>
                     <th className="py-3 px-2">Plan</th>
                     <th className="py-3 px-2">Amount</th>
                     <th className="py-3 px-2">Bank Name</th>
                     <th className="py-3 px-2">Account No</th>
                     <th className="py-3 px-2">Branch</th>
                     <th className="py-3 px-2">NIC File</th>
                     <th className="py-3 px-2">Bank Book</th>
                  </tr>
                </thead>
                <tbody>
                   {investors.map((inv: any) => (
          <tr key={inv._id} className="border-b border-border hover:bg-secondary/50 transition">
            <td className="py-3 px-2">{inv.fullName}</td>
            <td className="py-3 px-2">{inv.nic}</td>
            <td className="py-3 px-2">{inv.address}</td>
            <td className="py-3 px-2">{inv.district}</td>
            <td className="py-3 px-2">{inv.province}</td>
            <td className="py-3 px-2">{inv.postalCode}</td>
            <td className="py-3 px-2">{inv.phone}</td>
            <td className="py-3 px-2">{inv.email}</td>
            <td className="py-3 px-2">{inv.plan} months</td>
            <td className="py-3 px-2">{inv.amount}</td>
            <td className="py-3 px-2">{inv.bankName}</td>
            <td className="py-3 px-2">{inv.accountNo}</td>
            <td className="py-3 px-2">{inv.branchName}</td>
            <td className="py-3 px-2">
              <a href={inv.nicFile} target="_blank" className="text-primary underline">View</a>
            </td>
            <td className="py-3 px-2">
              <a href={inv.bankBookFile} target="_blank" className="text-primary underline">View</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Card>

          {/* Withdrawal Requests */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Withdrawal Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-2">Investor</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((req) => (
                    <tr key={req._id} className="border-b hover:bg-secondary/50">
                      <td className="py-3 px-2">{req.investorName}</td>
                      <td className="py-3 px-2">{req.email}</td>
                      <td className="py-3 px-2 font-medium">LKR {req.amount}</td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${req.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-700"
                            : req.status === "approved"
                              ? "bg-green-500/20 text-green-700"
                              : "bg-red-500/20 text-red-700"
                          }
                        `}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 flex gap-2">
                        {req.status === "pending" ? (
                          <>
                            <Button size="sm" onClick={() => handleApprove(req._id)}>
                              <Check className="w-4 h-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(req._id)}>
                              <X className="w-4 h-4" /> Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
