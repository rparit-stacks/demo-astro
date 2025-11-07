import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/lib/profile'
import { AuthService } from '@/lib/auth'
import type { UpdateAstrologerProfileData } from '@/lib/profile'

// GET - Get astrologer profile
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

    const astrologerId = authResult.data.user.id
    const result = await ProfileService.getAstrologerProfile(astrologerId)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 404 })
    }

  } catch (error) {
    console.error('Get astrologer profile API error:', error)
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

// PUT - Update astrologer profile
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

    const astrologerId = authResult.data.user.id
    const body: UpdateAstrologerProfileData = await request.json()

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

    // Validate experience years if provided
    if (body.experience_years !== undefined) {
      if (body.experience_years < 0 || body.experience_years > 50) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid experience years',
            error: 'Experience must be between 0 and 50 years'
          },
          { status: 400 }
        )
      }
    }

    // Validate rates if provided
    const rates = ['chat_rate', 'voice_rate', 'video_rate'] as const
    for (const rate of rates) {
      if (body[rate] !== undefined) {
        if (body[rate]! < 5 || body[rate]! > 1000) {
          return NextResponse.json(
            {
              success: false,
              message: `Invalid ${rate.replace('_', ' ')}`,
              error: `${rate.replace('_', ' ')} must be between ₹5 and ₹1000 per minute`
            },
            { status: 400 }
          )
        }
      }
    }

    const result = await ProfileService.updateAstrologerProfile(astrologerId, body)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Update astrologer profile API error:', error)
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