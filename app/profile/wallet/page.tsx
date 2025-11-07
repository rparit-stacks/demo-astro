"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const transactions = [
  {
    id: 1,
    type: "debit",
    description: "Chat with Dr. Rajesh Sharma",
    amount: 150,
    date: "Today, 10:30 AM",
    status: "completed",
  },
  {
    id: 2,
    type: "credit",
    description: "Wallet Recharge",
    amount: 500,
    date: "Yesterday, 3:45 PM",
    status: "completed",
  },
  {
    id: 3,
    type: "credit",
    description: "Referral Bonus",
    amount: 100,
    date: "2 days ago",
    status: "completed",
  },
  {
    id: 4,
    type: "debit",
    description: "Call with Priya Mehta",
    amount: 200,
    date: "3 days ago",
    status: "completed",
  },
  {
    id: 5,
    type: "debit",
    description: "Video Call with Amit Patel",
    amount: 300,
    date: "5 days ago",
    status: "completed",
  },
]

const rechargeOptions = [100, 250, 500, 1000, 2000, 5000]

export default function ProfileWalletPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [balance] = useState(() => {
    // Get from profile or localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('astro_user')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          return data.profile?.wallet_balance || profile?.wallet_balance || 850
        } catch (e) {
          return profile?.wallet_balance || 850
        }
      }
    }
    return profile?.wallet_balance || 850
  })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">My Wallet</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Wallet Balance Card */}
        <GlassmorphicCard gradient className="mb-6 overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-primary via-secondary to-accent p-6">
            <div className="absolute right-4 top-4">
              <Wallet className="h-16 w-16 text-white/20" />
            </div>
            <div className="relative z-10">
              <p className="mb-1 text-sm text-white/80">Available Balance</p>
              <h1 className="mb-4 text-4xl font-bold text-white">₹{balance}</h1>
              <Button
                size="lg"
                className="gap-2 bg-white text-primary hover:bg-white/90"
                onClick={() => router.push("/wallet/recharge")}
              >
                <Plus className="h-5 w-5" />
                Add Money
              </Button>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <GlassmorphicCard
            className="cursor-pointer p-4 transition-all hover:shadow-xl"
            onClick={() => router.push("/wallet/offers")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
              <Gift className="h-5 w-5 text-secondary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Offers</h3>
            <p className="text-xs text-muted-foreground">View all offers</p>
          </GlassmorphicCard>

          <GlassmorphicCard
            className="cursor-pointer p-4 transition-all hover:shadow-xl"
            onClick={() => router.push("/wallet/history")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">History</h3>
            <p className="text-xs text-muted-foreground">Transaction history</p>
          </GlassmorphicCard>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Recent Transactions</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
              <TabsTrigger value="debit">Debit</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {transactions.map((transaction) => (
                <GlassmorphicCard key={transaction.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === "credit" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{transaction.description}</h3>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </GlassmorphicCard>
              ))}
            </TabsContent>

            <TabsContent value="credit" className="space-y-3">
              {transactions
                .filter((t) => t.type === "credit")
                .map((transaction) => (
                  <GlassmorphicCard key={transaction.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{transaction.description}</h3>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <p className="font-semibold text-green-600">+₹{transaction.amount}</p>
                    </div>
                  </GlassmorphicCard>
                ))}
            </TabsContent>

            <TabsContent value="debit" className="space-y-3">
              {transactions
                .filter((t) => t.type === "debit")
                .map((transaction) => (
                  <GlassmorphicCard key={transaction.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{transaction.description}</h3>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <p className="font-semibold text-red-600">-₹{transaction.amount}</p>
                    </div>
                  </GlassmorphicCard>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

