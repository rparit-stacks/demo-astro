import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  phone: string
  full_name: string
  date_of_birth?: string
  time_of_birth?: string
  place_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed'
  occupation?: string
  profile_image_url?: string
  wallet_balance: number
  total_consultations: number
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Astrologer {
  id: string
  email: string
  phone: string
  full_name: string
  display_name?: string
  profile_image_url?: string
  bio?: string
  experience_years: number
  languages: string[]
  education?: string
  certifications?: string[]
  chat_rate: number
  voice_rate: number
  video_rate: number
  total_consultations: number
  total_earnings: number
  average_rating: number
  total_reviews: number
  status: 'active' | 'inactive' | 'pending_approval' | 'suspended'
  is_online: boolean
  is_verified: boolean
  city?: string
  state?: string
  country: string
  created_at: string
  updated_at: string
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseAnonKey ? 'Present' : 'Missing')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}