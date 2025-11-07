import { NextRequest, NextResponse } from 'next/server'
import { ProfileService } from '@/lib/profile'
import { AuthService } from '@/lib/auth'

// PUT - Update astrologer specialties
export async function PUT(request: NextRequest) {
    try {
        // Get current user
        const authResult = await AuthService.getCurrentUser()

        if (!authResult.success || !authResult.data?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                    error: 'Please login to update specialties'
                },
                { status: 401 }
            )
        }

        if (authResult.data.userType !== 'astrologer') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden',
                    error: 'Only astrologers can update specialties'
                },
                { status: 403 }
            )
        }

        const astrologerId = authResult.data.user.id
        const body = await request.json()

        // Validate specialties array
        if (!body.specialties || !Array.isArray(body.specialties)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid specialties',
                    error: 'Specialties must be an array of specialty names'
                },
                { status: 400 }
            )
        }

        if (body.specialties.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No specialties provided',
                    error: 'At least one specialty must be selected'
                },
                { status: 400 }
            )
        }

        if (body.specialties.length > 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Too many specialties',
                    error: 'Maximum 5 specialties can be selected'
                },
                { status: 400 }
            )
        }

        const result = await ProfileService.updateAstrologerSpecialties(astrologerId, body.specialties)

        if (result.success) {
            return NextResponse.json(result, { status: 200 })
        } else {
            return NextResponse.json(result, { status: 400 })
        }

    } catch (error) {
        console.error('Update astrologer specialties API error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: 'Something went wrong while updating specialties'
            },
            { status: 500 }
        )
    }
}