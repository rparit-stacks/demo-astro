"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, MessageSquare, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const clients = [
    {
      id: 1,
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      totalConsultations: 12,
      lastConsultation: "2 days ago",
      rating: 5,
      totalSpent: "₹2,400",
    },
    {
      id: 2,
      name: "Rahul Kumar",
      phone: "+91 98765 43211",
      totalConsultations: 8,
      lastConsultation: "1 week ago",
      rating: 4,
      totalSpent: "₹1,600",
    },
    {
      id: 3,
      name: "Anjali Verma",
      phone: "+91 98765 43212",
      totalConsultations: 15,
      lastConsultation: "3 days ago",
      rating: 5,
      totalSpent: "₹3,000",
    },
    {
      id: 4,
      name: "Vikram Singh",
      phone: "+91 98765 43213",
      totalConsultations: 5,
      lastConsultation: "1 day ago",
      rating: 4,
      totalSpent: "₹1,000",
    },
  ]

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
            <h1 className="text-2xl font-extrabold text-gray-900">My Clients</h1>
            <p className="text-sm text-gray-600">{clients.length} total clients</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-0 bg-white pl-10 shadow-md"
            />
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <GlassmorphicCard key={client.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/generic-placeholder-icon.png?height=48&width=48`} />
                    <AvatarFallback className="bg-orange-200 text-orange-700">{client.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    <p className="text-xs text-gray-600">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{client.rating}</span>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg bg-white/50 p-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Consultations</p>
                  <p className="font-bold text-gray-900">{client.totalConsultations}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Total Spent</p>
                  <p className="font-bold text-green-600">{client.totalSpent}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Last Visit</p>
                  <p className="text-xs font-medium text-gray-900">{client.lastConsultation}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2 rounded-lg bg-orange-500 hover:bg-orange-600">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>
            </GlassmorphicCard>
          ))}
        </div>
      </div>
    </div>
  )
}
