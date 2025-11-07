"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { AuthVideoBackground } from "@/components/auth-video-background"
import { OTPService } from "@/lib/otp-service"
import { useAuth } from "@/hooks/useAuth"

export default function UserLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1) // 1: Email/Password, 2: OTP
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Login credentials - Pre-filled for testing
  const [email, setEmail] = useState("rohitparit1934@gmail.com")
  const [password, setPassword] = useState("Rparit@111288")

  // OTP verification
  const [otp, setOtp] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ User already authenticated, redirecting to home...')
      router.push("/home")
    }
  }, [isAuthenticated, router])

  const handleEmailPasswordLogin = async () => {
    setError("")
    setLoading(true)

    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Attempting login with useAuth hook...')
      const result = await login(email.trim(), password, 'user')

      if (result.success) {
        setSuccess("Login successful! Redirecting...")
        console.log('✅ Login successful, redirecting to home...')
        
        // Dispatch login event for location selector
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("userLoggedIn"))
        }
        
        setTimeout(() => {
          router.push("/home")
        }, 1000)
      } else {
        setError(result.error || 'Invalid email or password')
        console.log('❌ Login failed:', result.error)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('❌ Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }

    setLoading(true)
    try {
      // Verify OTP
      const otpResult = await OTPService.verifyOTP(email, otp)
      
      if (otpResult.success) {
        // OTP verified, complete login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email.trim(), 
            password, 
            userType: 'user' 
          })
        })

        const result = await response.json()

        if (result.success) {
          setSuccess("Login successful! Redirecting...")
          
          // Dispatch login event for location selector
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("userLoggedIn"))
          }
          
          setTimeout(() => {
            router.push('/home')
          }, 1000)
        } else {
          setError('Login failed. Please try again.')
        }
      } else {
        setError(otpResult.message || "Invalid OTP")
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    
    setLoading(true)
    try {
      const result = await OTPService.resendOTP(email, 'login')
      
      if (result.success) {
        setSuccess("New OTP sent to your email")
        startResendTimer()
      } else {
        setError(result.message || "Failed to resend OTP")
      }
    } catch (err) {
      setError("Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthVideoBackground />

      <div className="relative z-20 flex min-h-screen items-end justify-center pb-0">
        <div className="w-full">
          {/* Logo positioned above card */}
          <div className="mb-6 flex justify-center">
            <div className="relative h-24 w-24 rounded-full bg-white/90 p-4 shadow-lg backdrop-blur-sm">
              <Image src="/logo.png" alt="Anytime Pooja" fill className="object-contain p-2" priority />
            </div>
          </div>

          <div className="rounded-t-[2rem] bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {step === 1 ? "Welcome Back" : "Verify Your Email"}
              </h1>
              <p className="text-sm text-gray-600">
                {step === 1 ? "Sign in to your account" : "Enter the OTP sent to your email"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-200">
                <Mail className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Step 1: Email & Password */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !loading && email && password) {
                          handleEmailPasswordLogin()
                        }
                      }}
                      className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 pr-12"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleEmailPasswordLogin}
                  className="w-full h-12 text-base font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-xl"
                  disabled={!email || !password || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Continue with OTP'
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit verification code to<br />
                    <strong>{email}</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp" className="font-medium text-gray-700">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtp(value)
                      setError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && otp.length === 6 && !loading) {
                        handleOTPVerification()
                      }
                    }}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-center text-2xl tracking-widest"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                
                <Button
                  onClick={handleOTPVerification}
                  className="w-full h-12 text-base font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-xl"
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying OTP...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || loading}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep(1)
                    setOtp("")
                    setError("")
                    setSuccess("")
                  }}
                  className="w-full text-gray-600 hover:text-gray-700"
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/user/signup")}
                  className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Are you an astrologer?{" "}
                <button
                  onClick={() => router.push("/astrologer/login")}
                  className="font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Astrologer Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}