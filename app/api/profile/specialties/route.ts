import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/lib/profile'

// GET - Get all specialties
export async function GET(request: NextRequest) {
  try {
    const result = await ProfileService.getAllSpecialties()

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }

  } catch (error) {
    console.error('Get specialties API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong while fetching specialties'
      },
      { status: 500 }
    )
  }
}