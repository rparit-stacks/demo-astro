"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function OTPVerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerify = () => {
    // Dummy verification
    router.push("/home")
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col p-6">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Verify OTP</h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to
              <br />
              <span className="font-medium text-foreground">+91 {phone}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6 flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="h-14 w-12 text-center text-xl font-semibold"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="mb-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            disabled={otp.some((d) => !d)}
          >
            Verify & Continue
          </Button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in <span className="font-medium text-primary">{timer}s</span>
              </p>
            ) : (
              <button onClick={() => setTimer(30)} className="text-sm font-medium text-primary hover:underline">
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OTPVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPVerifyContent />
    </Suspense>
  )
}
