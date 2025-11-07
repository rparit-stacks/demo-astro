"use client"

import { useEffect } from "react"

export function LocationSelector() {
  useEffect(() => {
    // Auto-set Jaipur as default location if not set
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("user_location")
      if (!storedLocation) {
        const defaultLocation = "Jaipur, Rajasthan"
        localStorage.setItem("user_location", defaultLocation)
        localStorage.setItem("user_state", "Rajasthan")
        localStorage.setItem("user_city", "Jaipur")
        window.dispatchEvent(new Event("locationUpdated"))
      }
    }
  }, [])

  // Return null - no UI component needed
  return null
}

