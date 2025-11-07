// Manual Signup Test with Real Email
require('dotenv').config()

const BASE_URL = 'http://localhost:3000'

async function testSignupWithRealEmail() {
  console.log('🔐 Testing Signup with Real Email Format...')
  console.log('='.repeat(50))

  try {
    // Test User Signup
    console.log('\n👤 Testing User Signup...')
    
    const userSignupData = {
      email: 'test.user@gmail.com', // Real email format
      password: 'TestPassword123!',
      fullName: 'Test User',
      phone: '+919876543210',
      userType: 'user',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      maritalStatus: 'single',
      occupation: 'Software Engineer'
    }

    const userResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userSignupData)
    })

    const userData = await userResponse.json()
    
    console.log('User Signup Status:', userResponse.status)
    console.log('User Signup Response:', userData)

    if (userResponse.ok && userData.success) {
      console.log('✅ User signup successful!')
    } else {
      console.log('❌ User signup failed:', userData.message)
    }

    // Test Astrologer Signup
    console.log('\n🔮 Testing Astrologer Signup...')
    
    const astrologerSignupData = {
      email: 'test.astrologer@gmail.com', // Real email format
      password: 'TestPassword123!',
      fullName: 'Test Astrologer',
      phone: '+919876543211',
      userType: 'astrologer',
      displayName: 'Dr. Test',
      bio: 'Experienced astrologer with 10+ years of practice',
      experienceYears: 10,
      languages: ['Hindi', 'English'],
      education: 'PhD in Astrology',
      specialties: ['Love', 'Career'],
      chatRate: 25,
      voiceRate: 35,
      videoRate: 45,
      city: 'Mumbai',
      state: 'Maharashtra'
    }

    const astrologerResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(astrologerSignupData)
    })

    const astrologerData = await astrologerResponse.json()
    
    console.log('Astrologer Signup Status:', astrologerResponse.status)
    console.log('Astrologer Signup Response:', astrologerData)

    if (astrologerResponse.ok && astrologerData.success) {
      console.log('✅ Astrologer signup successful!')
    } else {
      console.log('❌ Astrologer signup failed:', astrologerData.message)
    }

    // Test Login with User
    if (userResponse.ok && userData.success) {
      console.log('\n🔑 Testing Login...')
      
      const loginData = {
        email: 'test.user@gmail.com',
        password: 'TestPassword123!',
        userType: 'user'
      }

      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      const loginResult = await loginResponse.json()
      
      console.log('Login Status:', loginResponse.status)
      console.log('Login Response:', loginResult)

      if (loginResponse.ok && loginResult.success) {
        console.log('✅ Login successful!')
        
        // Test Get Profile
        console.log('\n👤 Testing Get Profile...')
        
        const profileResponse = await fetch(`${BASE_URL}/api/profile/user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        const profileData = await profileResponse.json()
        
        console.log('Profile Status:', profileResponse.status)
        console.log('Profile Response:', profileData)

        if (profileResponse.ok && profileData.success) {
          console.log('✅ Profile fetch successful!')
        } else {
          console.log('❌ Profile fetch failed:', profileData.message)
        }
      } else {
        console.log('❌ Login failed:', loginResult.message)
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Test with minimal data
async function testMinimalSignup() {
  console.log('\n📝 Testing Minimal Signup Data...')
  
  try {
    const minimalData = {
      email: 'minimal.test@gmail.com',
      password: 'TestPass123!',
      fullName: 'Minimal Test',
      phone: '9876543210',
      userType: 'user'
    }

    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minimalData)
    })

    const data = await response.json()
    
    console.log('Minimal Signup Status:', response.status)
    console.log('Minimal Signup Response:', data)

    if (response.ok && data.success) {
      console.log('✅ Minimal signup successful!')
    } else {
      console.log('❌ Minimal signup failed:', data.message)
    }

  } catch (error) {
    console.error('❌ Minimal test failed:', error.message)
  }
}

async function main() {
  await testSignupWithRealEmail()
  await testMinimalSignup()
  
  console.log('\n' + '='.repeat(50))
  console.log('📋 Manual Test Complete')
  console.log('='.repeat(50))
  console.log('\n💡 If signup is still failing:')
  console.log('1. Check Supabase Auth settings')
  console.log('2. Verify email confirmation is disabled for testing')
  console.log('3. Check if domain restrictions are enabled')
}

main().catch(console.error)