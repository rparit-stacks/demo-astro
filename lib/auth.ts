import { supabase } from './supabase'
import type { User, Astrologer } from './supabase'

// Client-side Auth Response Types
export interface AuthResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export interface LoginData {
  email: string
  password: string
  userType: 'user' | 'astrologer'
}

// Client-side Authentication Functions (using API routes)
export class AuthService {
  
  // Client-side signup (calls API)
  static async signupUser(data: any): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Client-side login (calls API)
  static async login(email: string, password: string, userType: 'user' | 'astrologer'): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType })
      })

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Client-side logout
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          success: false,
          message: 'Logout failed',
          error: error.message
        }
      }

      return {
        success: true,
        message: 'Logged out successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get Current User (client-side)
  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      // Get the current session from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        return {
          success: false,
          message: 'No active session',
          error: 'Please login first'
        }
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get user',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}