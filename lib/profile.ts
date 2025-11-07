import { supabase } from './supabase'
import type { User, Astrologer } from './supabase'

// Profile Response Types
export interface ProfileResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export interface UpdateUserProfileData {
  full_name?: string
  phone?: string
  date_of_birth?: string
  time_of_birth?: string
  place_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed'
  occupation?: string
  profile_image_url?: string
}

export interface UpdateAstrologerProfileData {
  full_name?: string
  display_name?: string
  phone?: string
  bio?: string
  experience_years?: number
  languages?: string[]
  education?: string
  certifications?: string[]
  chat_rate?: number
  voice_rate?: number
  video_rate?: number
  profile_image_url?: string
  city?: string
  state?: string
}

// Profile Management Service
export class ProfileService {

  // Get User Profile
  static async getUserProfile(userId: string): Promise<ProfileResponse> {
    try {
      console.log('👤 Fetching user profile...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Failed to fetch user profile:', error.message)
        return {
          success: false,
          message: 'Failed to fetch profile',
          error: error.message
        }
      }

      if (!data) {
        return {
          success: false,
          message: 'Profile not found',
          error: 'User profile does not exist'
        }
      }

      console.log('✅ User profile fetched successfully')
      return {
        success: true,
        message: 'Profile fetched successfully',
        data: data
      }

    } catch (error) {
      console.error('❌ Profile fetch error:', error)
      return {
        success: false,
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get Astrologer Profile
  static async getAstrologerProfile(astrologerId: string): Promise<ProfileResponse> {
    try {
      console.log('🔮 Fetching astrologer profile...')
      
      const { data, error } = await supabase
        .from('astrologers')
        .select(`
          *,
          astrologer_specialties (
            specialty_id,
            specialties (
              id,
              name,
              description,
              icon,
              color
            )
          )
        `)
        .eq('id', astrologerId)
        .single()

      if (error) {
        console.error('❌ Failed to fetch astrologer profile:', error.message)
        return {
          success: false,
          message: 'Failed to fetch profile',
          error: error.message
        }
      }

      if (!data) {
        return {
          success: false,
          message: 'Profile not found',
          error: 'Astrologer profile does not exist'
        }
      }

      // Format specialties data
      const specialties = data.astrologer_specialties?.map((as: any) => as.specialties) || []

      console.log('✅ Astrologer profile fetched successfully')
      return {
        success: true,
        message: 'Profile fetched successfully',
        data: {
          ...data,
          specialties: specialties
        }
      }

    } catch (error) {
      console.error('❌ Profile fetch error:', error)
      return {
        success: false,
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Update User Profile
  static async updateUserProfile(userId: string, updateData: UpdateUserProfileData): Promise<ProfileResponse> {
    try {
      console.log('📝 Updating user profile...')
      
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Failed to update user profile:', error.message)
        return {
          success: false,
          message: 'Failed to update profile',
          error: error.message
        }
      }

      console.log('✅ User profile updated successfully')
      return {
        success: true,
        message: 'Profile updated successfully',
        data: data
      }

    } catch (error) {
      console.error('❌ Profile update error:', error)
      return {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Update Astrologer Profile
  static async updateAstrologerProfile(astrologerId: string, updateData: UpdateAstrologerProfileData): Promise<ProfileResponse> {
    try {
      console.log('📝 Updating astrologer profile...')
      
      const { data, error } = await supabase
        .from('astrologers')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', astrologerId)
        .select()
        .single()

      if (error) {
        console.error('❌ Failed to update astrologer profile:', error.message)
        return {
          success: false,
          message: 'Failed to update profile',
          error: error.message
        }
      }

      console.log('✅ Astrologer profile updated successfully')
      return {
        success: true,
        message: 'Profile updated successfully',
        data: data
      }

    } catch (error) {
      console.error('❌ Profile update error:', error)
      return {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Update Astrologer Specialties
  static async updateAstrologerSpecialties(astrologerId: string, specialtyNames: string[]): Promise<ProfileResponse> {
    try {
      console.log('🎯 Updating astrologer specialties...')
      
      // First, remove existing specialties
      const { error: deleteError } = await supabase
        .from('astrologer_specialties')
        .delete()
        .eq('astrologer_id', astrologerId)

      if (deleteError) {
        console.error('❌ Failed to remove existing specialties:', deleteError.message)
        return {
          success: false,
          message: 'Failed to update specialties',
          error: deleteError.message
        }
      }

      // Get specialty IDs
      const { data: specialties, error: specialtyError } = await supabase
        .from('specialties')
        .select('id, name')
        .in('name', specialtyNames)

      if (specialtyError) {
        console.error('❌ Failed to fetch specialties:', specialtyError.message)
        return {
          success: false,
          message: 'Failed to fetch specialties',
          error: specialtyError.message
        }
      }

      if (!specialties || specialties.length === 0) {
        return {
          success: false,
          message: 'No valid specialties found',
          error: 'Invalid specialty names provided'
        }
      }

      // Insert new specialties
      const specialtyInserts = specialties.map(specialty => ({
        astrologer_id: astrologerId,
        specialty_id: specialty.id
      }))

      const { data, error: insertError } = await supabase
        .from('astrologer_specialties')
        .insert(specialtyInserts)
        .select()

      if (insertError) {
        console.error('❌ Failed to insert specialties:', insertError.message)
        return {
          success: false,
          message: 'Failed to update specialties',
          error: insertError.message
        }
      }

      console.log('✅ Astrologer specialties updated successfully')
      return {
        success: true,
        message: 'Specialties updated successfully',
        data: data
      }

    } catch (error) {
      console.error('❌ Specialties update error:', error)
      return {
        success: false,
        message: 'Failed to update specialties',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get All Specialties
  static async getAllSpecialties(): Promise<ProfileResponse> {
    try {
      console.log('📋 Fetching all specialties...')
      
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('❌ Failed to fetch specialties:', error.message)
        return {
          success: false,
          message: 'Failed to fetch specialties',
          error: error.message
        }
      }

      console.log('✅ Specialties fetched successfully')
      return {
        success: true,
        message: 'Specialties fetched successfully',
        data: data || []
      }

    } catch (error) {
      console.error('❌ Specialties fetch error:', error)
      return {
        success: false,
        message: 'Failed to fetch specialties',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Upload Profile Image
  static async uploadProfileImage(userId: string, file: File, userType: 'user' | 'astrologer'): Promise<ProfileResponse> {
    try {
      console.log('📸 Uploading profile image...')
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${userType}s/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.error('❌ Failed to upload image:', uploadError.message)
        return {
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new image URL
      const tableName = userType === 'user' ? 'users' : 'astrologers'
      const { data: updateData, error: updateError } = await supabase
        .from(tableName)
        .update({ 
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (updateError) {
        console.error('❌ Failed to update profile with image URL:', updateError.message)
        return {
          success: false,
          message: 'Failed to update profile image',
          error: updateError.message
        }
      }

      console.log('✅ Profile image uploaded successfully')
      return {
        success: true,
        message: 'Profile image updated successfully',
        data: {
          profile: updateData,
          imageUrl: publicUrl
        }
      }

    } catch (error) {
      console.error('❌ Image upload error:', error)
      return {
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Delete Profile Image
  static async deleteProfileImage(userId: string, userType: 'user' | 'astrologer'): Promise<ProfileResponse> {
    try {
      console.log('🗑️ Deleting profile image...')
      
      // Update profile to remove image URL
      const tableName = userType === 'user' ? 'users' : 'astrologers'
      const { data, error } = await supabase
        .from(tableName)
        .update({ 
          profile_image_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Failed to remove profile image:', error.message)
        return {
          success: false,
          message: 'Failed to remove profile image',
          error: error.message
        }
      }

      console.log('✅ Profile image removed successfully')
      return {
        success: true,
        message: 'Profile image removed successfully',
        data: data
      }

    } catch (error) {
      console.error('❌ Image deletion error:', error)
      return {
        success: false,
        message: 'Failed to remove image',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}