"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  Settings,
  Heart,
  Clock,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Edit,
  Gift,
  Share2,
  Store,
  Loader2,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"

const menuItems = [
  { icon: Edit, label: "Edit Profile", href: "/profile/edit" },
  { icon: Clock, label: "Consultation History", href: "/profile/history" },
  { icon: Heart, label: "Favorite Astrologers", href: "/profile/favorites" },
  { icon: Gift, label: "Refer & Earn", href: "/profile/referral" },
  { icon: Store, label: "Check Our Store", href: "https://anytime-pooja.vercel.app/", external: true },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/profile/support" },
  { icon: FileText, label: "Terms & Conditions", href: "/profile/terms" },
  { icon: Shield, label: "Privacy Policy", href: "/profile/privacy" },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, userType, loading, logout, isAuthenticated, forceRefreshSession } = useAuth()
  const [initialLoad, setInitialLoad] = useState(true)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [localStorageData, setLocalStorageData] = useState<any>(null)

  // Direct localStorage check for debugging
  const directStorageCheck = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('astro_user')
      console.log('🔍 Direct localStorage check:', stored ? 'Found' : 'Not found')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          console.log('📱 Direct localStorage data:', {
            hasUser: !!parsed.user,
            hasProfile: !!parsed.profile,
            email: parsed.user?.email,
            name: parsed.profile?.full_name
          })
        } catch (e) {
          console.log('❌ Error parsing stored data:', e)
        }
      }
    }
  }
  
  // Run direct check
  directStorageCheck()

  console.log('🔍 Profile Page Debug:', {
    user: !!user,
    profile: !!profile,
    loading,
    isAuthenticated,
    userEmail: user?.email,
    profileName: profile?.full_name,
    localStorageEmail: localStorageData?.user?.email,
    localStorageName: localStorageData?.profile?.full_name,
    initialLoad,
    sessionLoaded
  })

  // Give some time for session to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false)
    }, 1000) // Wait 1 second for session to load

    return () => clearTimeout(timer)
  }, [])

  // Check localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionLoaded) {
      const stored = localStorage.getItem('astro_user')
      console.log('🔍 Checking localStorage on profile load...')

      if (stored) {
        try {
          const parsedData = JSON.parse(stored)
          console.log('📱 Found session data:', {
            hasUser: !!parsedData.user,
            hasProfile: !!parsedData.profile,
            email: parsedData.user?.email,
            name: parsedData.profile?.full_name
          })

          setLocalStorageData(parsedData)
          setSessionLoaded(true)

          // If useAuth hook doesn't have data but localStorage does, force refresh
          if (!user && !profile && parsedData.user && parsedData.profile) {
            console.log('🔄 Auto-loading session from localStorage')
            forceRefreshSession()
          }
        } catch (e) {
          console.log('❌ Error parsing localStorage:', e)
        }
      } else {
        console.log('❌ No session found in localStorage')
        setSessionLoaded(true)
      }
    }
  }, [user, profile, sessionLoaded, forceRefreshSession])

  // Show loading while checking authentication or during initial load
  if (loading || initialLoad) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            {initialLoad ? 'Checking session...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    )
  }

  // Temporarily disable redirect for debugging
  if (!isAuthenticated && !loading && !initialLoad) {
    console.log('❌ Not authenticated after initial load')
    // Temporarily comment out redirect
    // router.push("/user/login")
    // return null
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }



  // Get user display data with localStorage fallback
  const displayName = profile?.full_name ||
    user?.user_metadata?.full_name ||
    localStorageData?.profile?.full_name ||
    localStorageData?.user?.user_metadata?.full_name ||
    "User"

  const displayPhone = profile?.phone ||
    localStorageData?.profile?.phone ||
    "Not provided"

  const displayEmail = user?.email ||
    localStorageData?.user?.email ||
    "Not provided"

  const walletBalance = profile?.wallet_balance ||
    localStorageData?.profile?.wallet_balance ||
    0

  const totalConsultations = profile?.total_consultations ||
    localStorageData?.profile?.total_consultations ||
    0

  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()

  console.log('👤 Display Data Debug:', {
    displayName,
    displayPhone,
    displayEmail,
    walletBalance,
    totalConsultations,
    hasProfile: !!profile,
    hasLocalStorage: !!localStorageData
  })



  // Debug functions
  const checkSession = () => {
    const stored = localStorage.getItem('astro_user')
    console.log('📱 LocalStorage check:', stored ? JSON.parse(stored) : 'No session found')
  }

  const handleForceRefresh = async () => {
    console.log('🔄 Manually refreshing session...')
    await forceRefreshSession()
  }

  const checkAndLoadSession = () => {
    const stored = localStorage.getItem('astro_user')
    if (stored) {
      try {
        const userData = JSON.parse(stored)
        console.log('🔍 Manual session check:', userData)
        handleForceRefresh()
      } catch (e) {
        console.log('❌ Invalid session data')
      }
    } else {
      console.log('❌ No session found in localStorage')
    }
  }

  const handleMenuClick = (href: string, label: string, external?: boolean) => {
    console.log("[v0] Navigating to:", href, "Label:", label, "External:", external)
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      router.push(href)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      <div className="px-4 py-6">
        {/* Profile Header */}
        <GlassmorphicCard gradient className="mb-6 overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-primary via-secondary to-accent p-6">
            <div className="relative z-10 flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-2xl text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="mb-1 text-xl font-bold text-white">{displayName}</h1>
                <p className="mb-1 text-sm text-white/80">{displayPhone}</p>
                <p className="mb-2 text-xs text-white/60">{displayEmail}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 bg-white/20 text-white hover:bg-white/30"
                  onClick={() => handleMenuClick("/profile/edit", "Edit Profile")}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-primary">{totalConsultations}</p>
            <p className="text-xs text-muted-foreground">Consultations</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </GlassmorphicCard>
        </div>

        {/* Wallet Section */}
        <div
          className="mb-6 cursor-pointer transition-all hover:shadow-xl"
          onClick={() => router.push("/profile/wallet")}
        >
          <GlassmorphicCard className="overflow-hidden p-0">
            <div className="relative bg-gradient-to-r from-orange-500/20 to-orange-600/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/30">
                  <Wallet className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Wallet Balance</h3>
                  <p className="text-lg font-bold text-orange-600">₹{walletBalance.toFixed(0)}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Referral Banner */}
        <div
          className="mb-6 cursor-pointer transition-all hover:shadow-xl"
          onClick={() => handleMenuClick("/profile/referral", "Refer & Earn")}
        >
          <GlassmorphicCard className="overflow-hidden p-0">
            <div className="relative bg-gradient-to-r from-secondary/20 to-primary/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Refer & Earn ₹100</h3>
                  <p className="text-xs text-muted-foreground">Invite friends and get rewards</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.href}
                className="cursor-pointer transition-all hover:shadow-xl"
                onClick={() => handleMenuClick(item.href, item.label, item.external)}
              >
                <GlassmorphicCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="flex-1 font-medium text-foreground">{item.label}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </GlassmorphicCard>
              </div>
            )
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="mt-6 w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
          size="lg"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>


        {/* Debug Info - Remove in production */}
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-xs">
          <p className="font-semibold mb-2 text-yellow-800">Auth Debug:</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Initial Load: {initialLoad ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? 'Present' : 'Missing'}</p>
          <p>Profile: {profile ? 'Present' : 'Missing'}</p>
          <p>UserType: {userType || 'None'}</p>

          {localStorageData && (
            <div className="mt-2 p-2 bg-green-100 rounded">
              <p className="font-bold text-green-800">LocalStorage Data:</p>
              <p>Email: {localStorageData.user?.email || 'N/A'}</p>
              <p>Name: {localStorageData.profile?.full_name || 'N/A'}</p>
              <p>Phone: {localStorageData.profile?.phone || 'N/A'}</p>
              <p>Login Time: {localStorageData.loginTime ? new Date(localStorageData.loginTime).toLocaleString() : 'N/A'}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-3">
            <div className="flex gap-2">
              <Button onClick={checkSession} size="sm">
                Check Session
              </Button>
              <Button onClick={handleForceRefresh} size="sm" variant="outline">
                Force Refresh
              </Button>
            </div>
            <Button onClick={checkAndLoadSession} size="sm" variant="secondary" className="w-full">
              Load Session Manually
            </Button>
            {localStorageData && (
              <Button
                onClick={() => setLocalStorageData({ ...localStorageData })}
                size="sm"
                variant="destructive"
                className="w-full"
              >
                Use LocalStorage Data Now
              </Button>
            )}
          </div>
        </div>

        {/* App Version */}
        <p className="mt-6 text-center text-xs text-muted-foreground">Anytime Pooja v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  )
}
