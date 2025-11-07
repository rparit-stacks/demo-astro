"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, ArrowDownToLine, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WalletPage() {
  const router = useRouter()

  const earnings = [
    { id: 1, user: "Priya Sharma", amount: "₹120", type: "Chat", date: "Today, 2:30 PM" },
    { id: 2, user: "Rahul Kumar", amount: "₹375", type: "Call", date: "Today, 11:15 AM" },
    { id: 3, user: "Anjali Verma", amount: "₹400", type: "Video", date: "Yesterday, 5:45 PM" },
    { id: 4, user: "Vikram Singh", amount: "₹180", type: "Chat", date: "Yesterday, 3:20 PM" },
  ]

  const withdrawals = [
    { id: 1, amount: "₹5,000", status: "completed", date: "Jan 15, 2025", account: "****1234" },
    { id: 2, amount: "₹3,500", status: "pending", date: "Jan 10, 2025", account: "****1234" },
    { id: 3, amount: "₹4,200", status: "completed", date: "Jan 5, 2025", account: "****1234" },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <StarsBackground />

      <div className="relative z-10 p-6 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-md">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Wallet</h1>
            <p className="text-sm text-gray-600">Manage your earnings</p>
          </div>
        </div>

        {/* Balance Card */}
        <GlassmorphicCard className="mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 p-6 text-white">
          <p className="mb-2 text-sm font-medium opacity-90">Available Balance</p>
          <h2 className="mb-4 text-4xl font-extrabold">₹12,450</h2>
          <Button className="h-12 w-full rounded-xl bg-white font-bold text-orange-600 hover:bg-gray-100">
            <ArrowDownToLine className="mr-2 h-5 w-5" />
            Withdraw Money
          </Button>
        </GlassmorphicCard>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">₹45,230</p>
            <p className="text-sm text-gray-600">This Month</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">₹1,24,500</p>
            <p className="text-sm text-gray-600">Total Earned</p>
          </GlassmorphicCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-white/80 p-1">
            <TabsTrigger value="earnings" className="rounded-lg font-bold">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="rounded-lg font-bold">
              Withdrawals
            </TabsTrigger>
          </TabsList>

          {/* Earnings */}
          <TabsContent value="earnings" className="space-y-3">
            {earnings.map((earning) => (
              <GlassmorphicCard key={earning.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{earning.user}</h3>
                    <p className="text-sm text-gray-600">
                      {earning.type} • {earning.date}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">+{earning.amount}</span>
                </div>
              </GlassmorphicCard>
            ))}
          </TabsContent>

          {/* Withdrawals */}
          <TabsContent value="withdrawals" className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <GlassmorphicCard key={withdrawal.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{withdrawal.amount}</h3>
                    <p className="text-sm text-gray-600">
                      {withdrawal.account} • {withdrawal.date}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      withdrawal.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {withdrawal.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>
              </GlassmorphicCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
