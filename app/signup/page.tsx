"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { AuthVideoBackground } from "@/components/auth-video-background"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthService } from "@/lib/auth"
import React from "react"

export default function SignupPage() {
  const router = useRouter()
  
  // State variables
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Form data
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [birthTime, setBirthTime] = useState("")
  const [birthPlace, setBirthPlace] = useState("")
  const [gender, setGender] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("")
  const [occupation, setOccupation] = useState("")
  
  const totalSteps = 3

  // Redirect to user signup by default
  React.useEffect(() => {
    router.push('/user/signup')
  }, [router])

  const handleNext = async () => {
    setError("")
    setSuccess("")

    if (step < totalSteps) {
      // Validate current step before proceeding
      if (step === 1) {
        if (!validateStep1()) return
      } else if (step === 2) {
        if (!validateStep2()) return
      }
      setStep(step + 1)
    } else {
      // Final step - submit signup
      if (!validateStep3()) return
      await handleSignup()
    }
  }

  const validateStep1 = () => {
    if (!name.trim()) {
      setError("Please enter your full name")
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      setError("Please enter a valid email address")
      return false
    }
    if (!phone.trim() || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return false
    }
    if (!password.trim() || password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!birthDate) {
      setError("Please select your date of birth")
      return false
    }
    if (!birthTime) {
      setError("Please select your time of birth")
      return false
    }
    if (!birthPlace.trim()) {
      setError("Please enter your place of birth")
      return false
    }
    if (!gender) {
      setError("Please select your gender")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!maritalStatus) {
      setError("Please select your marital status")
      return false
    }
    if (!occupation.trim()) {
      setError("Please enter your occupation")
      return false
    }
    return true
  }

  const handleSignup = async () => {
    setLoading(true)
    setError("")

    try {
      const signupData = {
        email: email.trim(),
        password: password,
        fullName: name.trim(),
        phone: `+91${phone}`,
        userType: 'user' as const,
        dateOfBirth: birthDate,
        timeOfBirth: birthTime,
        placeOfBirth: birthPlace.trim(),
        gender: gender as 'male' | 'female' | 'other',
        maritalStatus: maritalStatus as 'single' | 'married' | 'divorced' | 'widowed',
        occupation: occupation.trim()
      }

      const result = await AuthService.signupUser(signupData)

      if (result.success) {
        setSuccess("Account created successfully! Please check your email to verify your account.")

        // Wait a moment to show success message
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error || "Signup failed. Please try again.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return name.trim() && email.trim() && phone.length === 10 && password.length >= 8
      case 2:
        return birthDate && birthTime && birthPlace.trim() && gender
      case 3:
        return maritalStatus && occupation.trim()
      default:
        return false
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthVideoBackground />

      <div className="relative z-20 flex min-h-screen items-end justify-center pb-0">
        <div className="w-full">
          {/* Header with back button and logo */}
          <div className="mb-6 flex items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="relative h-20 w-20 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
              <Image src="/logo.png" alt="Anytime Pooja" fill className="object-contain p-2" priority />
            </div>
            <div className="w-10" />
          </div>

          <div className="rounded-t-[2rem] bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-md">
            {/* Progress Steps */}
            <div className="mb-6 flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${s < step
                      ? "bg-green-500 text-white"
                      : s === step
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {s < step ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={`h-1 w-12 transition-all ${s < step ? "bg-green-500" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {step === 1 && "Create Account"}
                {step === 2 && "Birth Details"}
                {step === 3 && "Additional Info"}
              </h1>
              <p className="text-sm text-gray-600">
                {step === 1 && "Enter your basic information"}
                {step === 2 && "For accurate kundli predictions"}
                {step === 3 && "Complete your profile"}
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
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setError("")
                    }}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
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
                  <Label htmlFor="phone" className="font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex h-12 w-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10 digit number"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setPhone(value)
                        setError("")
                      }}
                      className="h-12 flex-1 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      maxLength={10}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium text-gray-700">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    disabled={loading}
                  />
                  {password && password.length < 8 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Birth Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="font-medium text-gray-700">
                    Date of Birth *
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthTime" className="font-medium text-gray-700">
                    Time of Birth *
                  </Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="font-medium text-gray-700">
                    Place of Birth *
                  </Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    placeholder="City, State, Country"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-medium text-gray-700">
                    Gender *
                  </Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus" className="font-medium text-gray-700">
                    Marital Status *
                  </Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="font-medium text-gray-700">
                    Occupation *
                  </Label>
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Your profession"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              className="mt-6 h-12 w-full rounded-xl bg-orange-500 text-base font-bold text-white transition-colors hover:bg-orange-600"
              disabled={!isStepValid() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : step < totalSteps ? (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "Complete Signup"
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-bold text-orange-600 transition-colors hover:text-orange-700"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
