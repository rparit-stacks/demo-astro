"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ArrowLeft, Filter, Star, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { LoadingSpinner } from "@/components/loading-spinner"

const allAstrologers = [
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
  },
  {
    id: 4,
    name: "Kavita Singh",
    specialty: "Palmistry",
    experience: "8 years",
    rating: 4.6,
    reviews: 1230,
    price: 18,
    image: "/indian-astrologer-female-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English"],
  },
]

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredResults, setFilteredResults] = useState(allAstrologers)

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allAstrologers.filter(
        (astrologer) =>
          astrologer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          astrologer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          astrologer.languages.some((lang) => lang.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredResults(results)
    } else {
      setFilteredResults(allAstrologers)
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search astrologers, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <h3 className="mb-2 text-lg font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((astrologer) => (
              <GlassmorphicCard
                key={astrologer.id}
                className="cursor-pointer p-4 transition-all hover:shadow-xl"
                onClick={() => router.push(`/astrologer/${astrologer.id}`)}
              >
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
                    <div className="mt-1 flex gap-1">
                      {astrologer.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge variant="secondary" className="text-xs">
                      ₹{astrologer.price}/min
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  )
}
