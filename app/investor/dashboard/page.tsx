"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import InvestorSidebar from "@/components/investor-sidebar"
import { DollarSign, TrendingUp, Wallet, Send } from "lucide-react"

export default function InvestorDashboard() {
  const router = useRouter()
  const [investor, setInvestor] = useState<any>(null)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [requests, setRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)

  // Interest Rates for plans
  const planInterestMap: any = {
    "3": 5,
    "6": 7,
    "12": 9,
    "24": 12,
  }

  // Load investor from API
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    const fetchInvestor = async () => {
      try {
        // Debug: log what the browser resolves the relative API path to
        try {
          // eslint-disable-next-line no-console
          console.log('Resolved /api/investor/me URL:', new URL('/api/investor/me', window.location.href).href)
        } catch (e) {}

        const res = await fetch("/api/investor/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          router.push("/auth/login")
          return
        }

        const data = await res.json()
        setInvestor(data)
      } catch (err) {
        console.error("Fetch investor error:", err)
        router.push("/auth/login")
      }
    }

    fetchInvestor()
  }, [router])

  // Fetch investor's withdrawal requests from server whenever investor changes
  useEffect(() => {
    if (!investor?._id) return

    const loadRequests = async () => {
      setLoadingRequests(true)
      try {
        // Debug: log resolved absolute URL for withdrawals API
        try {
          // eslint-disable-next-line no-console
          console.log('Resolved withdrawals URL:', new URL(`/api/investor/withdrawals?investorId=${investor._id}`, window.location.href).href)
        } catch (e) {}

        const res = await fetch(`/api/investor/withdrawals?investorId=${investor._id}`)
        if (!res.ok) {
          console.error("Failed to load withdrawals:", res.status)
          setRequests([])
          setLoadingRequests(false)
          return
        }
        const data = await res.json()
        // ensure amounts are numbers
        setRequests(data.map((r: any) => ({ ...r, amount: Number(r.amount) })))
      } catch (err) {
        console.error("Withdrawal fetch error:", err)
        setRequests([])
      } finally {
        setLoadingRequests(false)
      }
    }

    loadRequests()

    // Poll investor withdrawals every 5 seconds so admin actions show up for the investor
    const interval = setInterval(() => {
      loadRequests()
    }, 5000)

    return () => clearInterval(interval)
  }, [investor?._id])

  if (!investor) return null

  // ---------- INTEREST CALCULATIONS ----------
  const investedAmount = Number(investor.amount)
  const annualInterest = planInterestMap?.[investor.plan] || 0

  // Monthly interest
  const monthlyInterestRate = annualInterest / 12
  const monthlyInterestAmount = (investedAmount * monthlyInterestRate) / 100

  // Annual interest
  const interestEarnedYearly = (investedAmount * annualInterest) / 100
  const totalValue = investedAmount + interestEarnedYearly

  // Interest from signup date (daily interest calculation)
  const signupDate = new Date(investor.createdAt)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))

  const dailyInterestRate = annualInterest / 365
  const earnedInterest = investedAmount * (dailyInterestRate / 100) * diffDays

  // ---------- WITHDRAWAL REQUEST ----------
  const handleWithdrawalRequest = async () => {
    const withdraw = Number(withdrawalAmount)
    if (!withdraw || withdraw <= 0) return

    // total already requested (pending + approved) from server-side requests
    // Exclude rejected requests so rejected amounts are returned to available interest
    const totalRequested = requests
      .filter((r) => r.status !== "rejected")
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

    if (withdraw + totalRequested > earnedInterest) {
      alert(
        `❌ You cannot withdraw more than your available earned interest.\nAvailable: LKR ${(earnedInterest - totalRequested).toFixed(2)}`
      )
      return
    }

    try {
      const res = await fetch("/api/investor/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorId: investor._id, amount: withdraw }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }))
        alert("Failed to create withdrawal request: " + (err.message || res.status))
        return
      }

      const result = await res.json()
      // Append new request (server returned the created withdrawal)
      const newReq = result.withdrawal
      // Ensure amount is number
      newReq.amount = Number(newReq.amount)
      setRequests((prev) => [newReq, ...prev])
      setWithdrawalAmount("")
    } catch (err) {
      console.error("Create withdrawal error:", err)
      alert("Failed to create withdrawal request.")
    }
  }

  // Cancel / delete a request (client calls DELETE endpoint)
  const handleCancelRequest = async (reqId: string) => {
    if (!confirm("Cancel this withdrawal request?")) return
    try {
      const res = await fetch("/api/investor/withdrawals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reqId }),
      })
      if (!res.ok) {
        alert("Failed to cancel request")
        return
      }
      // remove from local list
      setRequests((prev) => prev.filter((r) => String(r._id || r.id) !== String(reqId)))
    } catch (err) {
      console.error("Cancel request error:", err)
      alert("Failed to cancel request")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <InvestorSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {investor.fullName}</h1>
            <p className="text-muted-foreground">Manage your investments and track your returns</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-6 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Invested Amount</p>
              <p className="text-2xl font-bold">LKR {investedAmount.toLocaleString()}</p>
              <Wallet className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Monthly Interest Rate</p>
              <p className="text-2xl font-bold">{monthlyInterestRate.toFixed(2)}%</p>
              <TrendingUp className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Monthly Interest Amount</p>
              <p className="text-2xl font-bold">LKR {monthlyInterestAmount.toFixed(2)}</p>
              <TrendingUp className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Interest Earned (Annual)</p>
              <p className="text-2xl font-bold">LKR {interestEarnedYearly.toLocaleString()}</p>
              <DollarSign className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Value After 1 Year</p>
              <p className="text-2xl font-bold">LKR {totalValue.toLocaleString()}</p>
              <Wallet className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Interest Earned So Far</p>
              <p className="text-2xl font-bold">LKR {earnedInterest.toFixed(2)}</p>
              <TrendingUp className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>
          </div>

          {/* Profile & Withdraw */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {investor.fullName}</p>
                <p><strong>NIC:</strong> {investor.nic}</p>
                <p><strong>Address:</strong> {investor.address}</p>
                <p><strong>Phone:</strong> {investor.phone}</p>
                <p><strong>Email:</strong> {investor.email}</p>
                <p><strong>Plan:</strong> {investor.plan} Months</p>
                <p><strong>Bank:</strong> {investor.bankName}</p>
                <p><strong>Account:</strong> {investor.accountNo}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Request Withdrawal</h2>
              <p className="text-sm mb-2 text-muted-foreground">
                Maximum withdrawable interest: <strong>LKR {(earnedInterest - requests.filter((r) => r.status !== "rejected").reduce((sum, r) => sum + (Number(r.amount) || 0), 0)).toFixed(2)}</strong>
              </p>

              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />

              <Button onClick={handleWithdrawalRequest} disabled={!withdrawalAmount} className="w-full mt-4 flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Request
              </Button>
            </Card>
          </div>

          {/* Withdrawal History */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Withdrawal History</h2>

            {loadingRequests ? (
              <p>Loading...</p>
            ) : requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No withdrawal requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Date</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Amount</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={String(req._id || req.id)} className="border-b border-border">
                        <td className="py-3 px-2 text-foreground">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2 text-foreground font-medium">LKR {Number(req.amount).toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === "pending" ? "bg-yellow-500/20 text-yellow-700" : req.status === "approved" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {req.status === "pending" && (req._id || req.id) ? (
                            <button
                              className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 rounded text-white transition"
                              onClick={() => handleCancelRequest(String(req._id || req.id))}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
