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
        const res = await fetch("http://localhost:3000/api/investor/me", {
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
  const diffDays = Math.floor(
    (today.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const dailyInterestRate = annualInterest / 365
  const earnedInterest =
    investedAmount * (dailyInterestRate / 100) * diffDays

  // ---------- WITHDRAWAL REQUEST ----------
  const handleWithdrawalRequest = () => {
    const withdraw = Number(withdrawalAmount)
    if (!withdraw || withdraw <= 0) return

    // Calculate total already requested/withdrawn
    const totalRequested = requests.reduce(
      (sum, r) => sum + r.amount,
      0
    )

    // Check if new request exceeds available earned interest
    if (withdraw + totalRequested > earnedInterest) {
      alert(
        `❌ You cannot withdraw more than your available earned interest.\nAvailable: LKR ${(earnedInterest - totalRequested).toFixed(2)}`
      )
      return
    }

    const newRequest = {
      id: Date.now(),
      amount: withdraw,
      status: "pending",
      date: new Date().toLocaleDateString(),
    }

    setRequests([...requests, newRequest])
    setWithdrawalAmount("")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <InvestorSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {investor.fullName}
            </h1>
            <p className="text-muted-foreground">
              Manage your investments and track your returns
            </p>
          </div>

          {/* ----------- SUMMARY CARDS (6 CARDS) ----------- */}
          <div className="grid md:grid-cols-6 gap-4 mb-8">

            {/* Invested Amount */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Invested Amount</p>
              <p className="text-2xl font-bold">LKR {investedAmount.toLocaleString()}</p>
              <Wallet className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            {/* Monthly Interest Rate */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Monthly Interest Rate</p>
              <p className="text-2xl font-bold">{monthlyInterestRate.toFixed(2)}%</p>
              <TrendingUp className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            {/* Monthly Interest Amount */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Monthly Interest Amount</p>
              <p className="text-2xl font-bold">LKR {monthlyInterestAmount.toFixed(2)}</p>
              <TrendingUp className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            {/* Annual Interest */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Interest Earned (Annual)</p>
              <p className="text-2xl font-bold">LKR {interestEarnedYearly.toLocaleString()}</p>
              <DollarSign className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            {/* Total Value After 1 Year */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Value After 1 Year</p>
              <p className="text-2xl font-bold">LKR {totalValue.toLocaleString()}</p>
              <Wallet className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

            {/* ⭐ New Card: Interest Earned So Far */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Interest Earned So Far</p>
              <p className="text-2xl font-bold">LKR {earnedInterest.toFixed(2)}</p>
              <TrendingUp className="w-8 h-8 text-primary opacity-50 mt-2" />
            </Card>

          </div>

          {/* ----------- PROFILE + WITHDRAWAL SECTION ----------- */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            {/* Profile Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {investor.fullName}</p>
                <p><strong>NIC:</strong> {investor.nic}</p>
                <p><strong>Address:</strong> {investor.address}</p>
                <p><strong>District:</strong> {investor.district}</p>
                <p><strong>Province:</strong> {investor.province}</p>
                <p><strong>Postal Code:</strong> {investor.postalCode}</p>
                <p><strong>Phone:</strong> {investor.phone}</p>
                <p><strong>Email:</strong> {investor.email}</p>
                <p><strong>Plan:</strong> {investor.plan} Months</p>
                <p><strong>Bank:</strong> {investor.bankName}</p>
                <p><strong>Account:</strong> {investor.accountNo}</p>
                <p><strong>Branch:</strong> {investor.branchName}</p>
              </div>
            </Card>

            {/* Withdrawal Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Request Withdrawal</h2>
              <p className="text-sm mb-2 text-muted-foreground">
                Maximum withdrawable interest: <strong>LKR {(earnedInterest - requests.reduce((sum, r) => sum + r.amount, 0)).toFixed(2)}</strong>
              </p>

              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />

              <Button
                onClick={handleWithdrawalRequest}
                disabled={!withdrawalAmount}
                className="w-full mt-4 flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Request
              </Button>
            </Card>
          </div>

          {/* ----------- WITHDRAWAL HISTORY ----------- */}
          {requests.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Withdrawal History</h2>
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
                      <tr key={req.id} className="border-b border-border">
                        <td className="py-3 px-2 text-foreground">{req.date}</td>
                        <td className="py-3 px-2 text-foreground font-medium">
                          LKR {req.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                              : "bg-green-500/20 text-green-700 dark:text-green-400"
                            }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <button
                            className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 rounded text-white transition"
                            onClick={() => {
                              // Refund amount to investor
                              setInvestor((prev: any) => ({
                                ...prev,
                                amount: Number(prev.amount) + req.amount,
                              }));
                              // Remove request from table
                              setRequests((prev) => prev.filter((r) => r.id !== req.id));
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}


        </div>
      </main>
    </div>
  )
}
