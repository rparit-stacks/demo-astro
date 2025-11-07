import { useState } from 'react'
import { ProfileService } from '@/lib/profile'
import type { UpdateUserProfileData, UpdateAstrologerProfileData } from '@/lib/profile'

export function useProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUserProfile = async (userId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.getUserProfile(userId)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch profile')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to fetch profile' }
    }
  }

  const getAstrologerProfile = async (astrologerId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.getAstrologerProfile(astrologerId)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch profile')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to fetch profile' }
    }
  }

  const updateUserProfile = async (userId: string, data: UpdateUserProfileData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.updateUserProfile(userId, data)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to update profile')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to update profile' }
    }
  }

  const updateAstrologerProfile = async (astrologerId: string, data: UpdateAstrologerProfileData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.updateAstrologerProfile(astrologerId, data)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to update profile')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to update profile' }
    }
  }

  const updateAstrologerSpecialties = async (astrologerId: string, specialties: string[]) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.updateAstrologerSpecialties(astrologerId, specialties)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to update specialties')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to update specialties' }
    }
  }

  const getAllSpecialties = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.getAllSpecialties()
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch specialties')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to fetch specialties' }
    }
  }

  const uploadProfileImage = async (userId: string, file: File, userType: 'user' | 'astrologer') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.uploadProfileImage(userId, file, userType)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to upload image')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to upload image' }
    }
  }

  const deleteProfileImage = async (userId: string, userType: 'user' | 'astrologer') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await ProfileService.deleteProfileImage(userId, userType)
      setLoading(false)
      
      if (!result.success) {
        setError(result.error || 'Failed to delete image')
      }
      
      return result
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: 'Failed to delete image' }
    }
  }

  return {
    loading,
    error,
    getUserProfile,
    getAstrologerProfile,
    updateUserProfile,
    updateAstrologerProfile,
    updateAstrologerSpecialties,
    getAllSpecialties,
    uploadProfileImage,
    deleteProfileImage
  }
}