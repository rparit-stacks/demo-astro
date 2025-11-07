"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState<string>("")
  const [isChecking, setIsChecking] = useState(true)

  // Memoize location data processing
  const data = useMemo(() => locationData as LocationData, [])
  
  const allStates = useMemo(() => {
    return [
      ...Object.keys(data.India.states),
      ...Object.keys(data.India.union_territories),
    ].sort()
  }, [data])

  const getCitiesForState = useCallback((state: string): string[] => {
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
  }, [data])

  // Function to check if we should show the popup
  const shouldShowPopup = useCallback(() => {
    // Only show on home page
    if (pathname !== "/home") {
      return false
    }
    
    // Check if location is already stored
    const storedLocation = localStorage.getItem("user_location")
    if (storedLocation) {
      setLocation(storedLocation)
      return false
    }
    
    // Check if user is logged in
    const userData = localStorage.getItem("astro_user")
    if (!userData) {
      return false
    }
    
    return true
  }, [pathname])

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initial check - only on home page
      setIsChecking(true)
      const checkLocation = () => {
        if (shouldShowPopup()) {
          // User is on home page, logged in, and no location - show popup after delay
          setTimeout(() => {
            setIsOpen(true)
          }, 800)
        } else {
          const storedLocation = localStorage.getItem("user_location")
          if (storedLocation) {
            setLocation(storedLocation)
          }
        }
        setIsChecking(false)
      }
      
      // Initial check
      checkLocation()
      
      // Listen for login events - only show if on home page
      const handleLogin = () => {
        // Wait a bit for navigation to home page
        setTimeout(() => {
          if (shouldShowPopup()) {
            setIsOpen(true)
          }
        }, 1000)
      }
      
      // Listen for custom login event
      window.addEventListener("userLoggedIn", handleLogin)
      
      // Also listen for route changes to home page
      const handleRouteChange = () => {
        if (pathname === "/home") {
          setTimeout(() => {
            if (shouldShowPopup()) {
              setIsOpen(true)
            }
          }, 500)
        } else {
          // Close popup if not on home page
          setIsOpen(false)
        }
      }
      
      // Check when pathname changes
      handleRouteChange()
      
      return () => {
        window.removeEventListener("userLoggedIn", handleLogin)
      }
    }
  }, [pathname, shouldShowPopup])

  // Memoize filtered states and cities to prevent unnecessary recalculations
  const filteredStates = useMemo(() => {
    if (!searchQuery) return allStates
    const query = searchQuery.toLowerCase()
    return allStates.filter((state) => state.toLowerCase().includes(query))
  }, [allStates, searchQuery])

  const cities = useMemo(() => {
    return selectedState ? getCitiesForState(selectedState) : []
  }, [selectedState, getCitiesForState])

  const filteredCities = useMemo(() => {
    if (!searchQuery) return cities
    const query = searchQuery.toLowerCase()
    return cities.filter((city) => city.toLowerCase().includes(query))
  }, [cities, searchQuery])

  const handleStateSelect = useCallback((state: string) => {
    setSelectedState(state)
    setSelectedCity("")
    setSearchQuery("")
  }, [])

  const handleCitySelect = useCallback((city: string) => {
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
  }, [selectedState])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <>
      <Dialog open={isOpen && !isChecking && pathname === "/home"} onOpenChange={(open) => {
        setIsOpen(open)
        // If dialog is closed and no location is set, keep it open (only on home page)
        if (!open && !location && pathname === "/home" && typeof window !== "undefined") {
          const stored = localStorage.getItem("user_location")
          if (!stored) {
            // Check if user is logged in and on home page before forcing it open
            const userData = localStorage.getItem("astro_user")
            if (userData) {
              setTimeout(() => {
                if (pathname === "/home") {
                  setIsOpen(true)
                }
              }, 100)
            }
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

