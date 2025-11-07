// Server-side authentication functions
import { supabaseAdmin } from './supabase-admin'
import { supabase } from './supabase'
import { createHash } from 'crypto'

export interface ServerAuthResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export interface ServerSignupData {
  email: string
  password: string
  fullName: string
  phone: string
  userType: 'user' | 'astrologer'
  // User specific fields
  dateOfBirth?: string
  timeOfBirth?: string
  placeOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  occupation?: string
  // Astrologer specific fields
  displayName?: string
  bio?: string
  experienceYears?: number
  languages?: string[]
  education?: string
  specialties?: string[]
  chatRate?: number
  voiceRate?: number
  videoRate?: number
  city?: string
  state?: string
}

export interface ServerLoginData {
  email: string
  password: string
  userType: 'user' | 'astrologer'
}

// Server-side Authentication Service
export class ServerAuthService {

  // User Signup (Server-side)
  static async signupUser(data: ServerSignupData): Promise<ServerAuthResponse> {
    try {
      console.log('🔐 Starting server-side user signup...')

      // 1. Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_type: 'user'
          }
        }
      })

      if (authError) {
        console.error('❌ Auth signup failed:', authError.message)
        return {
          success: false,
          message: 'Signup failed',
          error: authError.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'User creation failed',
          error: 'No user data returned'
        }
      }

      // 2. Hash password for database storage (simple hash since Supabase Auth handles real auth)
      const passwordHash = createHash('sha256').update(data.password + data.email).digest('hex')

      // 3. Create user profile using admin client (bypasses RLS)
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          phone: data.phone,
          full_name: data.fullName,
          password_hash: passwordHash,
          date_of_birth: data.dateOfBirth || null,
          time_of_birth: data.timeOfBirth || null,
          place_of_birth: data.placeOfBirth || null,
          gender: data.gender || null,
          marital_status: data.maritalStatus || null,
          occupation: data.occupation || null,
          wallet_balance: 0.00,
          total_consultations: 0,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (userError) {
        console.error('❌ User profile creation failed:', userError.message)
        // Cleanup auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return {
          success: false,
          message: 'Profile creation failed',
          error: userError.message
        }
      }

      console.log('✅ User signup successful!')
      return {
        success: true,
        message: 'User registered successfully! Please check your email for verification.',
        data: {
          user: authData.user,
          profile: userData,
          needsEmailVerification: !authData.user.email_confirmed_at
        }
      }

    } catch (error) {
      console.error('❌ Signup error:', error)
      return {
        success: false,
        message: 'Signup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Astrologer Signup (Server-side)
  static async signupAstrologer(data: ServerSignupData): Promise<ServerAuthResponse> {
    try {
      console.log('🔮 Starting server-side astrologer signup...')

      // 1. Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_type: 'astrologer'
          }
        }
      })

      if (authError) {
        console.error('❌ Auth signup failed:', authError.message)
        return {
          success: false,
          message: 'Signup failed',
          error: authError.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'User creation failed',
          error: 'No user data returned'
        }
      }

      // 2. Hash password for database storage (simple hash since Supabase Auth handles real auth)
      const passwordHash = createHash('sha256').update(data.password + data.email).digest('hex')

      // 3. Create astrologer profile using admin client (bypasses RLS)
      const { data: astrologerData, error: astrologerError } = await supabaseAdmin
        .from('astrologers')
        .insert({
          id: authData.user.id,
          email: data.email,
          phone: data.phone,
          full_name: data.fullName,
          password_hash: passwordHash,
          display_name: data.displayName || data.fullName,
          bio: data.bio || null,
          experience_years: data.experienceYears || 0,
          languages: data.languages || ['Hindi', 'English'],
          education: data.education || null,
          chat_rate: data.chatRate || 15.00,
          voice_rate: data.voiceRate || 20.00,
          video_rate: data.videoRate || 25.00,
          total_consultations: 0,
          total_earnings: 0.00,
          average_rating: 0.00,
          total_reviews: 0,
          status: 'pending_approval',
          is_online: false,
          is_verified: false,
          city: data.city || null,
          state: data.state || null,
          country: 'India',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (astrologerError) {
        console.error('❌ Astrologer profile creation failed:', astrologerError.message)
        // Cleanup auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return {
          success: false,
          message: 'Profile creation failed',
          error: astrologerError.message
        }
      }

      // 3. Add specialties if provided
      if (data.specialties && data.specialties.length > 0) {
        const { error: specialtyError } = await this.addAstrologerSpecialties(
          authData.user.id,
          data.specialties
        )

        if (specialtyError) {
          console.warn('⚠️ Specialty assignment failed:', specialtyError)
        }
      }

      console.log('✅ Astrologer signup successful!')
      return {
        success: true,
        message: 'Astrologer registered successfully! Your profile is under review.',
        data: {
          user: authData.user,
          profile: astrologerData,
          needsEmailVerification: !authData.user.email_confirmed_at,
          needsApproval: true
        }
      }

    } catch (error) {
      console.error('❌ Astrologer signup error:', error)
      return {
        success: false,
        message: 'Signup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Login Function (Server-side)
  static async login(data: ServerLoginData): Promise<ServerAuthResponse> {
    try {
      console.log('🔐 Starting server-side login...')

      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (authError) {
        console.error('❌ Login failed:', authError.message)
        return {
          success: false,
          message: 'Invalid email or password',
          error: authError.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Login failed',
          error: 'No user data returned'
        }
      }

      // 2. Get user profile based on user type
      let profile = null
      let userType = data.userType

      console.log('🔍 Looking for user profile:', {
        userId: authData.user.id,
        email: authData.user.email,
        requestedUserType: userType
      })

      if (userType === 'user') {
        // Try by email first (more reliable)
        const { data: userByEmail, error: emailError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', authData.user.email)
          .single()

        console.log('👤 User table query by email:', { userByEmail, emailError })

        if (userByEmail) {
          profile = userByEmail
          console.log('✅ Found user by email in users table')
        } else {
          // Try by ID
          const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          console.log('👤 User table query by ID:', { userData, userError })

          if (userData) {
            profile = userData
            console.log('✅ Found user by ID in users table')
          } else {
            console.log('🔄 User not found in users table, trying astrologers table...')
            // Try astrologer table if user not found
            const { data: astrologerData } = await supabaseAdmin
              .from('astrologers')
              .select('*')
              .eq('email', authData.user.email)
              .single()

            console.log('🔮 Astrologer table query result:', { astrologerData })

            if (astrologerData) {
              profile = astrologerData
              userType = 'astrologer'
              console.log('✅ Found user in astrologers table')
            }
          }
        }
      } else {
        // Try by email first for astrologers
        const { data: astrologerByEmail, error: emailError } = await supabaseAdmin
          .from('astrologers')
          .select('*')
          .eq('email', authData.user.email)
          .single()

        console.log('🔮 Astrologer table query by email:', { astrologerByEmail, emailError })

        if (astrologerByEmail) {
          profile = astrologerByEmail
          console.log('✅ Found astrologer by email in astrologers table')
        } else {
          // Try by ID
          const { data: astrologerData, error: astrologerError } = await supabaseAdmin
            .from('astrologers')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          console.log('🔮 Astrologer table query by ID:', { astrologerData, astrologerError })

          if (astrologerData) {
            profile = astrologerData
            console.log('✅ Found astrologer by ID in astrologers table')
          } else {
            console.log('🔄 Astrologer not found in astrologers table, trying users table...')
            // Try user table if astrologer not found
            const { data: userData } = await supabaseAdmin
              .from('users')
              .select('*')
              .eq('email', authData.user.email)
              .single()

            console.log('👤 User table query result:', { userData })

            if (userData) {
              profile = userData
              userType = 'user'
              console.log('✅ Found astrologer in users table')
            }
          }
        }
      }

      if (!profile) {
        console.error('❌ No profile found for user:', authData.user.id)
        return {
          success: false,
          message: 'Profile not found',
          error: 'User profile does not exist'
        }
      }

      console.log('✅ Profile found:', { userType, profileId: profile.id })

      console.log('✅ Login successful!')
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: authData.user,
          profile: profile,
          userType: userType,
          session: authData.session
        }
      }

    } catch (error) {
      console.error('❌ Login error:', error)
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Helper function to add astrologer specialties
  private static async addAstrologerSpecialties(astrologerId: string, specialtyNames: string[]) {
    try {
      // Get specialty IDs
      const { data: specialties, error: specialtyError } = await supabaseAdmin
        .from('specialties')
        .select('id, name')
        .in('name', specialtyNames)

      if (specialtyError || !specialties) {
        return { error: 'Failed to fetch specialties' }
      }

      // Insert astrologer specialties
      const specialtyInserts = specialties.map(specialty => ({
        astrologer_id: astrologerId,
        specialty_id: specialty.id
      }))

      const { error: insertError } = await supabaseAdmin
        .from('astrologer_specialties')
        .insert(specialtyInserts)

      if (insertError) {
        return { error: insertError.message }
      }

      return { success: true }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}