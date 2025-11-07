import { useState, useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthUser {
  user: User | null
  profile: any | null
  userType: 'user' | 'astrologer' | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthUser>({
    user: null,
    profile: null,
    userType: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session immediately
    const getInitialSession = async () => {
      try {
        // Check if localStorage is available (client-side only)
        if (typeof window === 'undefined') {
          console.log('🔄 Server-side rendering, skipping session check')
          setAuthState(prev => ({ ...prev, loading: false }))
          return
        }

        // First check localStorage for stored session (priority)
        console.log('🔍 Checking localStorage for session...')
        const storedUser = localStorage.getItem('astro_user')
        console.log('📱 LocalStorage content:', storedUser ? 'Session found' : 'No session')
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            const loginTime = userData.loginTime || 0
            const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
            
            // Check if session is still valid (6 months)
            if (Date.now() - loginTime < sixMonthsInMs) {
              console.log('✅ Using stored session:', { 
                hasUser: !!userData.user, 
                hasProfile: !!userData.profile, 
                userType: userData.userType,
                email: userData.user?.email,
                name: userData.profile?.full_name
              })
              setAuthState({
                user: userData.user,
                profile: userData.profile,
                userType: userData.userType,
                loading: false,
                error: null
              })
              return
            } else {
              console.log('⏰ Stored session expired, removing...')
              localStorage.removeItem('astro_user')
            }
          } catch (e) {
            console.log('❌ Invalid stored session, removing...')
            localStorage.removeItem('astro_user')
          }
        }

        // Fallback: Check Supabase session
        console.log('🔍 Checking Supabase session as fallback...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError.message)
          setAuthState({
            user: null,
            profile: null,
            userType: null,
            loading: false,
            error: sessionError.message
          })
          return
        }
        
        if (session?.user) {
          console.log('✅ Supabase session found:', { 
            userId: session.user.id, 
            email: session.user.email 
          })
          
          // Get user profile from API
          console.log('🔄 Getting user profile from API...')
          const result = await AuthService.getCurrentUser()
          
          if (result.success) {
            console.log('✅ Profile loaded successfully:', {
              hasUser: !!result.data.user,
              hasProfile: !!result.data.profile,
              userType: result.data.userType
            })
            
            const authData = {
              user: result.data.user,
              profile: result.data.profile,
              userType: result.data.userType,
              loginTime: Date.now()
            }
            
            // Store in localStorage for persistence
            localStorage.setItem('astro_user', JSON.stringify(authData))
            
            setAuthState({
              user: result.data.user,
              profile: result.data.profile,
              userType: result.data.userType,
              loading: false,
              error: null
            })
          } else {
            console.log('❌ Failed to get profile, checking localStorage fallback...')
            // Fallback to localStorage if API fails
            const storedUser = localStorage.getItem('astro_user')
            if (storedUser) {
              try {
                const userData = JSON.parse(storedUser)
                const loginTime = userData.loginTime || 0
                const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
                
                if (Date.now() - loginTime < sixMonthsInMs) {
                  console.log('✅ Using localStorage fallback')
                  setAuthState({
                    user: userData.user,
                    profile: userData.profile,
                    userType: userData.userType,
                    loading: false,
                    error: null
                  })
                  return
                }
              } catch (e) {
                console.log('❌ Invalid localStorage data')
              }
            }
            
            setAuthState({
              user: null,
              profile: null,
              userType: null,
              loading: false,
              error: result.error || 'Failed to load profile'
            })
          }
        } else {
          console.log('❌ No Supabase session found, checking localStorage...')
          // Check localStorage as fallback
          const storedUser = localStorage.getItem('astro_user')
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser)
              const loginTime = userData.loginTime || 0
              const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
              
              if (Date.now() - loginTime < sixMonthsInMs) {
                console.log('✅ Using localStorage session')
                setAuthState({
                  user: userData.user,
                  profile: userData.profile,
                  userType: userData.userType,
                  loading: false,
                  error: null
                })
                return
              } else {
                console.log('⏰ Stored session expired')
                localStorage.removeItem('astro_user')
              }
            } catch (e) {
              console.log('❌ Invalid stored session')
              localStorage.removeItem('astro_user')
            }
          }
          
          setAuthState({
            user: null,
            profile: null,
            userType: null,
            loading: false,
            error: null
          })
        }
      } catch (error) {
        console.error('❌ Session initialization error:', error)
        setAuthState({
          user: null,
          profile: null,
          userType: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          console.log('✅ Session found, getting user profile...')
          const result = await AuthService.getCurrentUser()
          if (result.success) {
            console.log('✅ Profile loaded, updating state and localStorage')
            
            const authData = {
              user: result.data.user,
              profile: result.data.profile,
              userType: result.data.userType,
              loginTime: Date.now()
            }
            
            // Update localStorage
            localStorage.setItem('astro_user', JSON.stringify(authData))
            
            setAuthState({
              user: result.data.user,
              profile: result.data.profile,
              userType: result.data.userType,
              loading: false,
              error: null
            })
          } else {
            console.log('❌ Failed to get profile:', result.error)
            setAuthState({
              user: null,
              profile: null,
              userType: null,
              loading: false,
              error: result.error || 'Failed to load profile'
            })
          }
        } else {
          console.log('❌ No session, clearing state')
          // Clear localStorage
          localStorage.removeItem('astro_user')
          setAuthState({
            user: null,
            profile: null,
            userType: null,
            loading: false,
            error: null
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string, userType: 'user' | 'astrologer') => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await AuthService.login(email, password, userType)
      
      if (result.success) {
        console.log('✅ Login successful, updating auth state')
        
        const authData = {
          user: result.data.user,
          profile: result.data.profile,
          userType: result.data.userType,
          loginTime: Date.now()
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('astro_user', JSON.stringify(authData))
        
        setAuthState({
          user: result.data.user,
          profile: result.data.profile,
          userType: result.data.userType,
          loading: false,
          error: null
        })
      } else {
        console.log('❌ Login failed:', result.error)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Login failed'
        }))
      }
      
      return result
    } catch (error) {
      console.error('❌ Login error:', error)
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }))
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    try {
      // Clear localStorage first
      localStorage.removeItem('astro_user')
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Logout error:', error.message)
      }
      
      setAuthState({
        user: null,
        profile: null,
        userType: null,
        loading: false,
        error: null
      })
      
      return {
        success: true,
        message: 'Logged out successfully'
      }
    } catch (error) {
      console.error('❌ Logout error:', error)
      setAuthState({
        user: null,
        profile: null,
        userType: null,
        loading: false,
        error: null
      })
      return {
        success: true,
        message: 'Logged out successfully'
      }
    }
  }

  const refreshProfile = async () => {
    if (!authState.user) {
      console.log('🔄 No user found, attempting to refresh from API...')
      const result = await AuthService.getCurrentUser()
      if (result.success) {
        const updatedAuthData = {
          user: result.data.user,
          profile: result.data.profile,
          userType: result.data.userType,
          loginTime: Date.now()
        }
        
        // Update localStorage
        localStorage.setItem('astro_user', JSON.stringify(updatedAuthData))
        
        setAuthState({
          user: result.data.user,
          profile: result.data.profile,
          userType: result.data.userType,
          loading: false,
          error: null
        })
      }
      return
    }
    
    const result = await AuthService.getCurrentUser()
    if (result.success) {
      const updatedAuthData = {
        user: result.data.user,
        profile: result.data.profile,
        userType: result.data.userType,
        loginTime: Date.now()
      }
      
      // Update localStorage
      localStorage.setItem('astro_user', JSON.stringify(updatedAuthData))
      
      setAuthState(prev => ({
        ...prev,
        profile: result.data.profile,
        userType: result.data.userType
      }))
    }
  }

  const forceRefreshSession = async () => {
    console.log('🔄 Force refreshing session...')
    setAuthState(prev => ({ ...prev, loading: true }))
    await refreshProfile()
  }

  return {
    ...authState,
    login,
    logout,
    refreshProfile,
    forceRefreshSession,
    isAuthenticated: !!authState.user,
    isUser: authState.userType === 'user',
    isAstrologer: authState.userType === 'astrologer'
  }
}