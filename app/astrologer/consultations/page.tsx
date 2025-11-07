"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Phone, Video, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConsultationsPage() {
  const router = useRouter()

  const activeConsultations = [
    {
      id: 1,
      user: "Priya Sharma",
      type: "chat",
      duration: "12 mins",
      amount: "₹120",
      status: "ongoing",
    },
    {
      id: 2,
      user: "Rahul Kumar",
      type: "call",
      duration: "8 mins",
      amount: "₹120",
      status: "ongoing",
    },
  ]

  const pendingConsultations = [
    {
      id: 3,
      user: "Anjali Verma",
      type: "video",
      scheduledTime: "3:00 PM",
      amount: "₹400",
    },
    {
      id: 4,
      user: "Vikram Singh",
      type: "chat",
      scheduledTime: "4:30 PM",
      amount: "₹200",
    },
  ]

  const completedConsultations = [
    {
      id: 5,
      user: "Meera Patel",
      type: "call",
      duration: "25 mins",
      amount: "₹375",
      rating: 5,
      completedAt: "2 hours ago",
    },
    {
      id: 6,
      user: "Arjun Reddy",
      type: "chat",
      duration: "18 mins",
      amount: "₹180",
      rating: 4,
      completedAt: "5 hours ago",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="h-5 w-5" />
      case "call":
        return <Phone className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chat":
        return "bg-orange-100 text-orange-600"
      case "call":
        return "bg-blue-100 text-blue-600"
      case "video":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

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
            <h1 className="text-2xl font-extrabold text-gray-900">Consultations</h1>
            <p className="text-sm text-gray-600">Manage your sessions</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 bg-white/80 p-1">
            <TabsTrigger value="active" className="rounded-lg font-bold">
              Active
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg font-bold">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg font-bold">
              Completed
            </TabsTrigger>
          </TabsList>

          {/* Active Consultations */}
          <TabsContent value="active" className="space-y-4">
            {activeConsultations.map((consultation) => (
              <GlassmorphicCard key={consultation.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{consultation.user}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{consultation.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                    {getTypeIcon(consultation.type)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">{consultation.amount}</span>
                  <Button className="h-10 rounded-lg bg-green-500 px-6 font-bold text-white hover:bg-green-600">
                    Join Now
                  </Button>
                </div>
              </GlassmorphicCard>
            ))}
          </TabsContent>

          {/* Pending Consultations */}
          <TabsContent value="pending" className="space-y-4">
            {pendingConsultations.map((consultation) => (
              <GlassmorphicCard key={consultation.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{consultation.user}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Scheduled: {consultation.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                    {getTypeIcon(consultation.type)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">{consultation.amount}</span>
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg border-2 border-orange-500 px-6 font-bold text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    View Details
                  </Button>
                </div>
              </GlassmorphicCard>
            ))}
          </TabsContent>

          {/* Completed Consultations */}
          <TabsContent value="completed" className="space-y-4">
            {completedConsultations.map((consultation) => (
              <GlassmorphicCard key={consultation.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{consultation.user}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{consultation.duration}</span>
                        <span>•</span>
                        <span>{consultation.completedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                    {getTypeIcon(consultation.type)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-600">{consultation.amount}</span>
                    <div className="mt-1 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < consultation.rating ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" className="h-10 rounded-lg px-6 font-bold text-gray-600 hover:bg-gray-100">
                    View Details
                  </Button>
                </div>
              </GlassmorphicCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
