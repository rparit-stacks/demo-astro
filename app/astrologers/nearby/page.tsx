"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Phone, MessageCircle, MapPin, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Random astrologers data for nearby location
const nearbyAstrologers = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    experience: "15 years",
    rating: 4.9,
    reviews: 2340,
    price: 25,
    image: "/indian-astrologer-male.jpg",
    isOnline: true,
    languages: ["Hindi", "English"],
    consultations: 5000,
    distance: "2.5 km",
    location: "Nearby Temple",
  },
  {
    id: 2,
    name: "Priya Mehta",
    specialty: "Tarot Reading",
    experience: "10 years",
    rating: 4.8,
    reviews: 1890,
    price: 20,
    image: "/indian-astrologer-female.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Gujarati"],
    consultations: 3500,
    distance: "3.2 km",
    location: "City Center",
  },
  {
    id: 3,
    name: "Amit Patel",
    specialty: "Numerology",
    experience: "12 years",
    rating: 4.7,
    reviews: 1560,
    price: 22,
    image: "/indian-astrologer-male-2.jpg",
    isOnline: false,
    languages: ["Hindi", "English"],
    consultations: 2800,
    distance: "4.1 km",
    location: "East Area",
  },
  {
    id: 4,
    name: "Sunita Verma",
    specialty: "KP Astrology",
    experience: "18 years",
    rating: 4.9,
    reviews: 3120,
    price: 30,
    image: "/indian-astrologer-female-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Marathi"],
    consultations: 6200,
    distance: "5.3 km",
    location: "West Side",
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    specialty: "Palmistry",
    experience: "20 years",
    rating: 4.8,
    reviews: 4200,
    price: 28,
    image: "/indian-astrologer-male.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Punjabi"],
    consultations: 8500,
    distance: "6.7 km",
    location: "North Zone",
  },
  {
    id: 6,
    name: "Kavita Desai",
    specialty: "Vastu Shastra",
    experience: "14 years",
    rating: 4.6,
    reviews: 2100,
    price: 24,
    image: "/indian-astrologer-female.jpg",
    isOnline: false,
    languages: ["Hindi", "English", "Gujarati"],
    consultations: 3800,
    distance: "7.8 km",
    location: "South Area",
  },
  {
    id: 7,
    name: "Ramesh Kumar",
    specialty: "Gemstone Consultation",
    experience: "16 years",
    rating: 4.7,
    reviews: 2900,
    price: 26,
    image: "/indian-astrologer-male-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English"],
    consultations: 5100,
    distance: "8.2 km",
    location: "Central Plaza",
  },
  {
    id: 8,
    name: "Meera Joshi",
    specialty: "Birth Chart Analysis",
    experience: "13 years",
    rating: 4.9,
    reviews: 3600,
    price: 27,
    image: "/indian-astrologer-female-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Marathi"],
    consultations: 5900,
    distance: "9.1 km",
    location: "Temple Street",
  },
  {
    id: 9,
    name: "Anil Gupta",
    specialty: "Remedial Astrology",
    experience: "11 years",
    rating: 4.5,
    reviews: 1800,
    price: 21,
    image: "/indian-astrologer-male.jpg",
    isOnline: false,
    languages: ["Hindi", "English"],
    consultations: 3200,
    distance: "9.8 km",
    location: "Market Area",
  },
  {
    id: 10,
    name: "Sneha Reddy",
    specialty: "Muhurat Selection",
    experience: "17 years",
    rating: 4.8,
    reviews: 4100,
    price: 29,
    image: "/indian-astrologer-female.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Telugu"],
    consultations: 7200,
    distance: "10.0 km",
    location: "Residential Complex",
  },
]

export default function NearbyAstrologersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [userLocation, setUserLocation] = useState("Your Location")

  useEffect(() => {
    // Get location from localStorage
    const updateLocation = () => {
      if (typeof window !== "undefined") {
        const storedLocation = localStorage.getItem("user_location")
        if (storedLocation) {
          setUserLocation(storedLocation)
        } else {
          // If no location stored, show default
          setUserLocation("Select Location")
        }
      }
    }

    // Initial load
    updateLocation()

    // Listen for storage changes (when location is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_location") {
        updateLocation()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom event (for same-window updates)
    const handleCustomStorage = () => {
      updateLocation()
    }
    window.addEventListener("locationUpdated", handleCustomStorage)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("locationUpdated", handleCustomStorage)
    }
  }, [])

  const filteredAstrologers = nearbyAstrologers.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    if (filter === "online") return a.isOnline && matchesSearch
    if (filter === "top-rated") return a.rating >= 4.8 && matchesSearch
    return matchesSearch
  })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="mb-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Nearby Astrologers</h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{userLocation} • 10km radius</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({nearbyAstrologers.length})</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Astrologers List */}
      <div className="space-y-3 px-4 py-4">
        {filteredAstrologers.length === 0 ? (
          <GlassmorphicCard className="p-8 text-center">
            <p className="text-muted-foreground">No astrologers found matching your criteria.</p>
          </GlassmorphicCard>
        ) : (
          filteredAstrologers.map((astrologer) => (
            <GlassmorphicCard
              key={astrologer.id}
              className="cursor-pointer p-4 transition-all hover:shadow-xl"
              onClick={() => router.push(`/astrologer/${astrologer.id}`)}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={astrologer.image || "/placeholder.svg"} alt={astrologer.name} />
                    <AvatarFallback>{astrologer.name[0]}</AvatarFallback>
                  </Avatar>
                  {astrologer.isOnline && (
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{astrologer.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {astrologer.distance}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{astrologer.specialty}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{astrologer.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{astrologer.reviews} reviews</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{astrologer.location}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {astrologer.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <div className="text-sm">
                  <span className="font-semibold text-primary">₹{astrologer.price}/min</span>
                  <span className="text-muted-foreground"> • {astrologer.consultations}+ consultations</span>
                </div>
                <Button 
                  size="sm" 
                  className="gap-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/astrologer/${astrologer.id}`)
                  }}
                >
                  View Now
                </Button>
              </div>
            </GlassmorphicCard>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}

