"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"

export default function WalletPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Set a maximum timeout for loading (30 seconds)
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        console.log('⏰ Iframe loading timeout reached')
        setIsLoading(false)
        setLoadError(true)
      }
    }, 30000)

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [isLoading])

  const handleIframeLoad = () => {
    console.log('✅ Iframe loaded successfully')
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }
    setIsLoading(false)
    setLoadError(false)
  }

  const handleIframeError = () => {
    console.log('❌ Iframe load error')
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }
    setIsLoading(false)
    setLoadError(true)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Ecommerce Store</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* WebView Container */}
      <div className="relative h-[calc(100vh-120px)] w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-md z-20">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 mx-auto h-12 w-12 animate-ping rounded-full border-2 border-primary opacity-20" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">Loading store...</p>
                <p className="text-sm text-muted-foreground">Please wait while we load the ecommerce store</p>
              </div>
              <div className="flex justify-center space-x-1 pt-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {loadError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center space-y-4 p-6">
              <p className="text-sm text-muted-foreground">Store is taking longer than usual to load</p>
              <Button
                onClick={() => {
                  setIsLoading(true)
                  setLoadError(false)
                  if (iframeRef.current) {
                    iframeRef.current.src = iframeRef.current.src
                  }
                }}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="https://anytime-pooja.vercel.app/"
          className="h-full w-full border-0"
          title="Anytime Pooja Ecommerce Store"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="geolocation; camera; microphone"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      <BottomNav />
    </div>
  )
}
