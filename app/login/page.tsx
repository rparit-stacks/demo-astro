"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  // Redirect to user login by default
  React.useEffect(() => {
    router.push('/user/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  )
}
