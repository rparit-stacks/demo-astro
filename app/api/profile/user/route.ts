import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/lib/profile'
import { AuthService } from '@/lib/auth'
import type { UpdateUserProfileData } from '@/lib/profile'

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const authResult = await AuthService.getCurrentUser()
    
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Please login to access profile'
        },
        { status: 401 }
      )
    }

    const userId = authResult.data.user.id
    const result = await ProfileService.getUserProfile(userId)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 404 })
    }

  } catch (error) {
    console.error('Get user profile API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong while fetching profile'
      },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Get current user
    const authResult = await AuthService.getCurrentUser()
    
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Please login to update profile'
        },
        { status: 401 }
      )
    }

    const userId = authResult.data.user.id
    const body: UpdateUserProfileData = await request.json()

    // Validate phone number if provided
    if (body.phone) {
      const phoneRegex = /^[+]?[0-9]{10,15}$/
      if (!phoneRegex.test(body.phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid phone number',
            error: 'Please provide a valid phone number'
          },
          { status: 400 }
        )
      }
    }

    // Validate date of birth if provided
    if (body.date_of_birth) {
      const birthDate = new Date(body.date_of_birth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 13 || age > 120) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid date of birth',
            error: 'Age must be between 13 and 120 years'
          },
          { status: 400 }
        )
      }
    }

    const result = await ProfileService.updateUserProfile(userId, body)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Update user profile API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong while updating profile'
      },
      { status: 500 }
    )
  }
}