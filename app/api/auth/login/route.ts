import { NextRequest, NextResponse } from 'next/server'
import { ServerAuthService } from '@/lib/auth-server'
import type { ServerLoginData } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const body: ServerLoginData = await request.json()
    
    // Validate required fields
    if (!body.email || !body.password || !body.userType) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'Email, password, and user type are required'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'Please provide a valid email address'
        },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['user', 'astrologer'].includes(body.userType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid user type',
          error: 'User type must be either "user" or "astrologer"'
        },
        { status: 400 }
      )
    }

    const result = await ServerAuthService.login(body)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 401 })
    }

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong during login'
      },
      { status: 500 }
    )
  }
}