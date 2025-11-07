"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { AuthVideoBackground } from "@/components/auth-video-background"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OTPService } from "@/lib/otp-service"

export default function UserSignupPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Step 1: Basic Info
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Step 2: Birth Details for Kundli
    const [birthDate, setBirthDate] = useState("")
    const [birthTime, setBirthTime] = useState("")
    const [birthPlace, setBirthPlace] = useState("")
    const [gender, setGender] = useState("")

    // Step 3: Additional Details
    const [maritalStatus, setMaritalStatus] = useState("")
    const [occupation, setOccupation] = useState("")

    // Step 4: OTP Verification
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)

    const totalSteps = 4

    const handleNext = async () => {
        console.log('🔄 handleNext called, current step:', step)
        setError("")
        setSuccess("")

        if (step < totalSteps - 1) {
            // Validate current step before proceeding
            if (step === 1) {
                console.log('✅ Validating step 1')
                if (!validateStep1()) return
            } else if (step === 2) {
                console.log('✅ Validating step 2')
                if (!validateStep2()) return
            } else if (step === 3) {
                console.log('✅ Step 3 - Force moving to OTP step...')
                // Force go to step 4 for testing
                setStep(4)
                setSuccess("TEST OTP: 123456")
                setError("")
                console.log('✅ Forced step to 4')
                return
            }
            console.log('➡️ Moving to next step:', step + 1)
            setStep(step + 1)
        } else {
            console.log('🔐 Final step - verifying OTP')
            // Final step - verify OTP and complete signup
            await verifyOTPAndSignup()
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
        console.log('🔍 Validating Step 3:')
        console.log('  - maritalStatus:', maritalStatus)
        console.log('  - occupation:', occupation)

        if (!maritalStatus) {
            console.log('❌ Marital status missing')
            setError("Please select your marital status")
            return false
        }
        if (!occupation.trim()) {
            console.log('❌ Occupation missing')
            setError("Please enter your occupation")
            return false
        }
        console.log('✅ Step 3 validation passed')
        return true
    }

    const sendOTP = async () => {
        try {
            console.log('🚀 Starting OTP send process for:', email)
            const result = await OTPService.sendOTP(email, 'signup')
            console.log('📧 OTP Service Result:', result)

            if (result.success) {
                setOtpSent(true)
                setSuccess("OTP sent to your email. Please check and enter the 6-digit code.")
                startResendTimer()
                console.log('✅ OTP sent successfully')
            } else {
                console.error('❌ OTP send failed:', result.message)
                setError(result.message || "Failed to send OTP")
            }
        } catch (err) {
            console.error('❌ OTP send error:', err)
            setError("Failed to send OTP. Please try again.")
        }
    }

    const verifyOTPAndSignup = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit OTP")
            return
        }

        setLoading(true)
        try {
            // First verify OTP
            const otpResult = await OTPService.verifyOTP(email, otp)

            if (!otpResult.success) {
                setError(otpResult.message || "Invalid OTP")
                return
            }

            // OTP verified, now create account
            const signupData = {
                email: email.trim(),
                password: password,
                fullName: name.trim(),
                phone: `+91${Date.now().toString().slice(-10)}`, // Temporary phone
                userType: 'user' as const,
                dateOfBirth: birthDate,
                timeOfBirth: birthTime,
                placeOfBirth: birthPlace.trim(),
                gender: gender as 'male' | 'female' | 'other',
                maritalStatus: maritalStatus as 'single' | 'married' | 'divorced' | 'widowed',
                occupation: occupation.trim()
            }

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            })

            const result = await response.json()

            if (result.success) {
                setSuccess("Account created successfully! Redirecting to login...")
                setTimeout(() => {
                    router.push("/user/login")
                }, 2000)
            } else {
                setError(result.error || "Signup failed. Please try again.")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
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
            const result = await OTPService.resendOTP(email, 'signup')

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

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
            setError("")
            setSuccess("")
        } else {
            router.back()
        }
    }

    const isStepValid = () => {
        let isValid = false
        switch (step) {
            case 1:
                isValid = !!(name.trim() && email.trim() && password.length >= 8)
                break
            case 2:
                isValid = !!(birthDate && birthTime && birthPlace.trim() && gender)
                break
            case 3:
                isValid = !!(maritalStatus && occupation.trim())
                console.log('🔍 Step 3 validation check:', {
                    maritalStatus: !!maritalStatus,
                    occupation: !!occupation.trim(),
                    isValid
                })
                break
            case 4:
                isValid = otp.length === 6
                break
            default:
                isValid = false
        }
        return isValid
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
                            disabled={loading}
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
                            {[1, 2, 3, 4].map((s) => (
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
                                    {s < 4 && <div className={`h-1 w-12 transition-all ${s < step ? "bg-green-500" : "bg-gray-200"}`} />}
                                </div>
                            ))}
                        </div>

                        <div className="mb-6 text-center">
                            <h1 className="mb-2 text-2xl font-bold text-gray-900">
                                {step === 1 && "Create User Account"}
                                {step === 2 && "Birth Details"}
                                {step === 3 && "Additional Info"}
                                {step === 4 && "Verify Email"}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {step === 1 && "Enter your basic information"}
                                {step === 2 && "For accurate kundli predictions"}
                                {step === 3 && "Complete your profile"}
                                {step === 4 && "Enter the OTP sent to your email"}
                            </p>
                            {/* Debug info */}
                            <p className="text-xs text-blue-600 mt-2">
                                Debug: Step {step}/{totalSteps} | Valid: {isStepValid() ? 'Yes' : 'No'} | Loading: {loading ? 'Yes' : 'No'}
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
                                        onChange={(e) => {
                                            setBirthDate(e.target.value)
                                            setError("")
                                        }}
                                        className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        disabled={loading}
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
                                        onChange={(e) => {
                                            setBirthTime(e.target.value)
                                            setError("")
                                        }}
                                        className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        disabled={loading}
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
                                        onChange={(e) => {
                                            setBirthPlace(e.target.value)
                                            setError("")
                                        }}
                                        className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="font-medium text-gray-700">
                                        Gender *
                                    </Label>
                                    <Select value={gender} onValueChange={(value) => {
                                        setGender(value)
                                        setError("")
                                    }} disabled={loading}>
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
                                    <Select value={maritalStatus} onValueChange={(value) => {
                                        setMaritalStatus(value)
                                        setError("")
                                    }} disabled={loading}>
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
                                        onChange={(e) => {
                                            setOccupation(e.target.value)
                                            setError("")
                                        }}
                                        className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Test Button */}
                                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                                    <p className="text-sm text-yellow-800 mb-2">Testing Mode:</p>
                                    <Button
                                        onClick={() => {
                                            console.log('🧪 Test button clicked - going to step 4')
                                            setStep(4)
                                            setSuccess("TEST MODE: Enter OTP 123456")
                                        }}
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                    >
                                        Skip to OTP Step (Test)
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: OTP Verification */}
                        {step === 4 && (
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
                                        Enter OTP *
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
                                        className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                        disabled={loading}
                                    />
                                </div>

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
                            </div>
                        )}

                        <Button
                            onClick={() => {
                                console.log('🖱️ Button clicked! Step:', step, 'Valid:', isStepValid(), 'Loading:', loading)
                                handleNext()
                            }}
                            className="mt-6 h-12 w-full rounded-xl bg-orange-500 text-base font-bold text-white transition-colors hover:bg-orange-600"
                            disabled={!isStepValid() || loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {step === 3 ? 'Sending OTP...' : step === 4 ? 'Verifying...' : 'Processing...'}
                                </>
                            ) : step < totalSteps - 1 ? (
                                step === 3 ? (
                                    <>
                                        Send OTP
                                        <Mail className="ml-2 h-5 w-5" />
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )
                            ) : (
                                "Complete Signup"
                            )}
                        </Button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    onClick={() => router.push("/user/login")}
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