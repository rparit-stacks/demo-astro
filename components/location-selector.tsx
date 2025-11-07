"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import locationData from "@/lib/location.json"

interface LocationData {
  India: {
    states: Record<string, { capital: string; major_cities?: string[] }>
    union_territories: Record<string, { capital?: string; capitals?: string[] }>
  }
}

export function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState<string>("")

  useEffect(() => {
    // Check if location is already stored
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("user_location")
      if (storedLocation) {
        setLocation(storedLocation)
      } else {
        // Show modal if no location is stored
        setIsOpen(true)
      }
    }
  }, [])

  const data = locationData as LocationData
  const allStates = [
    ...Object.keys(data.India.states),
    ...Object.keys(data.India.union_territories),
  ].sort()

  const getCitiesForState = (state: string): string[] => {
    if (data.India.states[state]) {
      const stateData = data.India.states[state]
      const cities: string[] = []
      if (stateData.capital) cities.push(stateData.capital)
      if (stateData.major_cities) cities.push(...stateData.major_cities)
      return cities.sort()
    }
    if (data.India.union_territories[state]) {
      const utData = data.India.union_territories[state]
      const cities: string[] = []
      if (utData.capital) cities.push(utData.capital)
      if (utData.capitals) cities.push(...utData.capitals)
      return cities.sort()
    }
    return []
  }

  const filteredStates = allStates.filter((state) =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const cities = selectedState ? getCitiesForState(selectedState) : []
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    setSelectedCity("")
    setSearchQuery("")
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    const fullLocation = `${city}, ${selectedState}`
    setLocation(fullLocation)
    
    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user_location", fullLocation)
      localStorage.setItem("user_state", selectedState)
      localStorage.setItem("user_city", city)
      
      // Dispatch custom event to update other components
      window.dispatchEvent(new Event("locationUpdated"))
    }
    
    setIsOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!selectedState) {
      // If searching and no state selected, search in states
      return
    }
    // If state selected, search in cities
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        // If dialog is closed and no location is set, keep it open
        if (!open && !location && typeof window !== "undefined") {
          const stored = localStorage.getItem("user_location")
          if (!stored) {
            setTimeout(() => setIsOpen(true), 100)
          }
        }
      }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col" showCloseButton={!!location}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Select Your Location
            </DialogTitle>
            <DialogDescription>
              Choose your city to find nearby astrologers
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={selectedState ? "Search cities..." : "Search states..."}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* States List */}
            {!selectedState && (
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredStates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No states found
                  </p>
                ) : (
                  filteredStates.map((state) => (
                    <div
                      key={state}
                      onClick={() => handleStateSelect(state)}
                      className="cursor-pointer"
                    >
                      <GlassmorphicCard className="p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{state}</span>
                          <span className="text-xs text-muted-foreground">
                            {getCitiesForState(state).length} cities
                          </span>
                        </div>
                      </GlassmorphicCard>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Cities List */}
            {selectedState && (
              <div className="flex-1 overflow-y-auto space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedState("")
                      setSelectedCity("")
                      setSearchQuery("")
                    }}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Back
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    {selectedState}
                  </span>
                </div>
                {filteredCities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No cities found
                  </p>
                ) : (
                  filteredCities.map((city) => (
                    <div
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="cursor-pointer"
                    >
                      <GlassmorphicCard className="p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{city}</span>
                        </div>
                      </GlassmorphicCard>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

