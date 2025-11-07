"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Star, Phone, MessageCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

const favoriteAstrologers = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    rating: 4.9,
    reviews: 2340,
    price: 25,
    image: "/indian-astrologer-male.jpg",
    isOnline: true,
  },
  {
    id: 2,
    name: "Priya Mehta",
    specialty: "Tarot Reading",
    rating: 4.8,
    reviews: 1890,
    price: 20,
    image: "/indian-astrologer-female.jpg",
    isOnline: true,
  },
]

export default function FavoritesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Favorite Astrologers</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {favoriteAstrologers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <h3 className="mb-2 text-lg font-semibold">No favorites yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Add astrologers to your favorites for quick access</p>
            <Button onClick={() => router.push("/astrologers")}>Browse Astrologers</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteAstrologers.map((astrologer) => (
              <GlassmorphicCard key={astrologer.id} className="p-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={astrologer.image || "/placeholder.svg"} alt={astrologer.name} />
                      <AvatarFallback>{astrologer.name[0]}</AvatarFallback>
                    </Avatar>
                    {astrologer.isOnline && (
                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{astrologer.name}</h3>
                    <p className="text-sm text-muted-foreground">{astrologer.specialty}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{astrologer.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{astrologer.reviews} reviews</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      ₹{astrologer.price}/min
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => router.push(`/consultation/call/${astrologer.id}`)}
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => router.push(`/consultation/chat/${astrologer.id}`)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
