import { NextRequest, NextResponse } from 'next/server'
import { ServerAuthService } from '@/lib/auth-server'
import type { ServerSignupData } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const body: ServerSignupData = await request.json()
    
    // Validate required fields
    if (!body.email || !body.password || !body.fullName || !body.phone || !body.userType) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'Email, password, full name, phone, and user type are required'
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

    // Validate password strength
    if (body.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password too weak',
          error: 'Password must be at least 8 characters long'
        },
        { status: 400 }
      )
    }

    // Validate phone number (Indian format)
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

    let result

    if (body.userType === 'user') {
      result = await ServerAuthService.signupUser(body)
    } else if (body.userType === 'astrologer') {
      result = await ServerAuthService.signupAstrologer(body)
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid user type',
          error: 'User type must be either "user" or "astrologer"'
        },
        { status: 400 }
      )
    }

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong during signup'
      },
      { status: 500 }
    )
  }
}