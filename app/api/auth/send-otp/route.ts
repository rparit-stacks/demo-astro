import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    try {
        const { email, otp, type } = await request.json()

        // Validate inputs
        if (!email || !otp || !type) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields',
                    error: 'Email, OTP, and type are required'
                },
                { status: 400 }
            )
        }

        // Create SMTP transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        })

        // Email template
        const subject = type === 'signup'
            ? 'Verify Your Anytime Pooja Account'
            : 'Login Verification - Anytime Pooja'

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #FF6B1A, #FFC107); padding: 30px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .header-text { color: white; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .otp-box { background: linear-gradient(135deg, #FF6B1A, #FFC107); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌟 Anytime Pooja</div>
            <div class="header-text">Your Spiritual Companion</div>
          </div>
          
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">
              ${type === 'signup' ? 'Welcome to Anytime Pooja!' : 'Login Verification'}
            </h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              ${type === 'signup'
                ? 'Thank you for joining Anytime Pooja! To complete your registration, please verify your email address using the OTP below:'
                : 'Please use the following OTP to complete your login:'
            }
            </p>
            
            <div class="otp-box">
              <div style="font-size: 18px; margin-bottom: 10px;">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div style="font-size: 14px; opacity: 0.9;">Valid for 5 minutes</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              • This OTP is valid for 5 minutes only<br>
              • Do not share this code with anyone<br>
              • If you didn't request this, please ignore this email
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              ${type === 'signup'
                ? 'Once verified, you can start exploring personalized astrology consultations, daily horoscopes, and connect with expert astrologers.'
                : 'Enter this code in the app to complete your login.'
            }
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Anytime Pooja</strong> - Your Spiritual Companion</p>
            <p>Need help? Contact us at help@anytimepooja.in</p>
            <p style="font-size: 12px; color: #999;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

        // Send email
        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        }

        await transporter.sendMail(mailOptions)

        console.log('✅ OTP email sent successfully to:', email)

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully'
        })

    } catch (error) {
        console.error('❌ Send OTP error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send OTP',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}