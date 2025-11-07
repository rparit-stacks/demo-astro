"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, MessageCircle, Phone, Video, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

const consultationHistory = [
  {
    id: 1,
    astrologer: "Dr. Rajesh Sharma",
    image: "/indian-astrologer-male.jpg",
    type: "chat",
    date: "Today, 10:30 AM",
    duration: "15 min",
    amount: 150,
    rating: 5,
  },
  {
    id: 2,
    astrologer: "Priya Mehta",
    image: "/indian-astrologer-female.jpg",
    type: "call",
    date: "Yesterday, 3:45 PM",
    duration: "20 min",
    amount: 200,
    rating: 5,
  },
  {
    id: 3,
    astrologer: "Amit Patel",
    image: "/indian-astrologer-male-2.jpg",
    type: "video",
    date: "3 days ago",
    duration: "30 min",
    amount: 300,
    rating: 4,
  },
]

export default function ConsultationHistoryPage() {
  const router = useRouter()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Consultation History</h1>
            <p className="text-sm text-muted-foreground">{consultationHistory.length} consultations</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3 px-4 py-4">
        {consultationHistory.map((consultation) => (
          <GlassmorphicCard key={consultation.id} className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={consultation.image || "/placeholder.svg"} />
                <AvatarFallback>{consultation.astrologer[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{consultation.astrologer}</h3>
                <p className="text-xs text-muted-foreground">{consultation.date}</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                {getTypeIcon(consultation.type)}
                {consultation.type}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{consultation.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium text-foreground">₹{consultation.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(consultation.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        ))}
      </div>
    </div>
  )
}
