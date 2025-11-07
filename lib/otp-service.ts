// OTP Service for Email Verification
import { supabase } from './supabase'

export interface OTPResponse {
  success: boolean
  message: string
  error?: string
}

export class OTPService {
  
  // Generate and send OTP via email
  static async sendOTP(email: string, type: 'signup' | 'login' = 'signup'): Promise<OTPResponse> {
    try {
      console.log('📧 Sending OTP to:', email)
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store OTP in localStorage temporarily (in production, use database)
      const otpData = {
        email,
        otp,
        type,
        timestamp: Date.now(),
        expires: Date.now() + (5 * 60 * 1000) // 5 minutes
      }
      
      localStorage.setItem(`otp_${email}`, JSON.stringify(otpData))
      
      // Send OTP via API
      console.log('📤 Making API call to send OTP...')
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type })
      })
      
      console.log('📥 API Response status:', response.status)
      const result = await response.json()
      console.log('📥 API Response data:', result)
      
      if (result.success) {
        console.log('✅ OTP API call successful')
        return {
          success: true,
          message: `OTP sent to ${email}. Please check your email.`
        }
      } else {
        console.error('❌ OTP API call failed:', result)
        return {
          success: false,
          message: 'Failed to send OTP',
          error: result.error
        }
      }
      
    } catch (error) {
      console.error('❌ OTP send error:', error)
      return {
        success: false,
        message: 'Failed to send OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // Verify OTP
  static async verifyOTP(email: string, enteredOTP: string): Promise<OTPResponse> {
    try {
      console.log('🔍 Verifying OTP for:', email)
      
      // Get stored OTP
      const storedData = localStorage.getItem(`otp_${email}`)
      
      if (!storedData) {
        return {
          success: false,
          message: 'OTP not found. Please request a new OTP.',
          error: 'OTP_NOT_FOUND'
        }
      }
      
      const otpData = JSON.parse(storedData)
      
      // Check if OTP expired
      if (Date.now() > otpData.expires) {
        localStorage.removeItem(`otp_${email}`)
        return {
          success: false,
          message: 'OTP expired. Please request a new OTP.',
          error: 'OTP_EXPIRED'
        }
      }
      
      // Verify OTP
      if (otpData.otp === enteredOTP) {
        // OTP verified, remove from storage
        localStorage.removeItem(`otp_${email}`)
        return {
          success: true,
          message: 'OTP verified successfully!'
        }
      } else {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.',
          error: 'INVALID_OTP'
        }
      }
      
    } catch (error) {
      console.error('❌ OTP verify error:', error)
      return {
        success: false,
        message: 'Failed to verify OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // Resend OTP
  static async resendOTP(email: string, type: 'signup' | 'login' = 'signup'): Promise<OTPResponse> {
    // Remove existing OTP
    localStorage.removeItem(`otp_${email}`)
    
    // Send new OTP
    return this.sendOTP(email, type)
  }
  
  // Check if OTP is pending for email
  static isPendingOTP(email: string): boolean {
    const storedData = localStorage.getItem(`otp_${email}`)
    
    if (!storedData) return false
    
    try {
      const otpData = JSON.parse(storedData)
      return Date.now() < otpData.expires
    } catch {
      return false
    }
  }
  
  // Get remaining time for OTP
  static getRemainingTime(email: string): number {
    const storedData = localStorage.getItem(`otp_${email}`)
    
    if (!storedData) return 0
    
    try {
      const otpData = JSON.parse(storedData)
      const remaining = Math.max(0, otpData.expires - Date.now())
      return Math.ceil(remaining / 1000) // Return seconds
    } catch {
      return 0
    }
  }
}