import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/me - Getting current user...')

    // Get the session from the request headers or cookies
    const authHeader = request.headers.get('authorization')
    const sessionToken = authHeader?.replace('Bearer ', '')
    
    if (!sessionToken) {
      console.log('❌ No session token found')
      return NextResponse.json(
        {
          success: false,
          message: 'No session found',
          error: 'Please login first'
        },
        { status: 401 }
      )
    }

    // Get user from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser(sessionToken)
    
    if (userError || !user) {
      console.log('❌ User not found:', userError?.message)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid session',
          error: 'Please login again'
        },
        { status: 401 }
      )
    }

    console.log('✅ User found:', { id: user.id, email: user.email })

    // Try to find user profile in users table first
    const { data: userProfile, error: userError2 } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    console.log('👤 User table query:', { userProfile, userError2 })

    if (userProfile) {
      console.log('✅ Found user profile')
      return NextResponse.json({
        success: true,
        message: 'User data retrieved successfully',
        data: {
          user: user,
          profile: userProfile,
          userType: 'user'
        }
      })
    }

    // Try astrologers table if not found in users
    const { data: astrologerProfile, error: astrologerError } = await supabaseAdmin
      .from('astrologers')
      .select('*')
      .eq('email', user.email)
      .single()

    console.log('🔮 Astrologer table query:', { astrologerProfile, astrologerError })

    if (astrologerProfile) {
      console.log('✅ Found astrologer profile')
      return NextResponse.json({
        success: true,
        message: 'User data retrieved successfully',
        data: {
          user: user,
          profile: astrologerProfile,
          userType: 'astrologer'
        }
      })
    }

    console.log('❌ No profile found for user')
    return NextResponse.json(
      {
        success: false,
        message: 'Profile not found',
        error: 'User profile does not exist'
      },
      { status: 404 }
    )

  } catch (error) {
    console.error('❌ Get current user API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong while fetching user data'
      },
      { status: 500 }
    )
  }
}