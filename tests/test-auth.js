// Test Authentication System
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔐 Testing Authentication System...')
console.log('='.repeat(60))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test User Signup
async function testUserSignup() {
  console.log('\n👤 Testing User Signup...')
  
  try {
    // Test signup with email/password
    const testEmail = `testuser${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          user_type: 'user'
        }
      }
    })

    if (authError) {
      console.log('❌ Auth signup failed:', authError.message)
      return false
    }

    if (!authData.user) {
      console.log('❌ No user data returned')
      return false
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testEmail,
        phone: '+919876543210',
        full_name: 'Test User',
        wallet_balance: 0.00,
        total_consultations: 0,
        status: 'active'
      })
      .select()
      .single()

    if (userError) {
      console.log('❌ User profile creation failed:', userError.message)
      return false
    }

    console.log('✅ User profile created successfully')
    
    // Cleanup - delete test user
    await supabase.from('users').delete().eq('id', authData.user.id)
    
    return true

  } catch (error) {
    console.log('❌ User signup test failed:', error.message)
    return false
  }
}

// Test Astrologer Signup
async function testAstrologerSignup() {
  console.log('\n🔮 Testing Astrologer Signup...')
  
  try {
    // Test signup with email/password
    const testEmail = `testastrologer${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test Astrologer',
          user_type: 'astrologer'
        }
      }
    })

    if (authError) {
      console.log('❌ Auth signup failed:', authError.message)
      return false
    }

    if (!authData.user) {
      console.log('❌ No user data returned')
      return false
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Create astrologer profile
    const { data: astrologerData, error: astrologerError } = await supabase
      .from('astrologers')
      .insert({
        id: authData.user.id,
        email: testEmail,
        phone: '+919876543210',
        full_name: 'Test Astrologer',
        display_name: 'Test Astrologer',
        experience_years: 5,
        languages: ['Hindi', 'English'],
        chat_rate: 15.00,
        voice_rate: 20.00,
        video_rate: 25.00,
        total_consultations: 0,
        total_earnings: 0.00,
        average_rating: 0.00,
        total_reviews: 0,
        status: 'pending_approval',
        is_online: false,
        is_verified: false,
        country: 'India'
      })
      .select()
      .single()

    if (astrologerError) {
      console.log('❌ Astrologer profile creation failed:', astrologerError.message)
      return false
    }

    console.log('✅ Astrologer profile created successfully')
    
    // Test adding specialties
    const { data: specialties } = await supabase
      .from('specialties')
      .select('id, name')
      .limit(2)

    if (specialties && specialties.length > 0) {
      const { error: specialtyError } = await supabase
        .from('astrologer_specialties')
        .insert(
          specialties.map(s => ({
            astrologer_id: authData.user.id,
            specialty_id: s.id
          }))
        )

      if (!specialtyError) {
        console.log('✅ Specialties added successfully')
      }
    }
    
    // Cleanup - delete test astrologer
    await supabase.from('astrologer_specialties').delete().eq('astrologer_id', authData.user.id)
    await supabase.from('astrologers').delete().eq('id', authData.user.id)
    
    return true

  } catch (error) {
    console.log('❌ Astrologer signup test failed:', error.message)
    return false
  }
}

// Test Login
async function testLogin() {
  console.log('\n🔑 Testing Login System...')
  
  try {
    // Create a temporary user for login test
    const testEmail = `logintest${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    // Signup first
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (signupError || !signupData.user) {
      console.log('❌ Failed to create test user for login')
      return false
    }

    // Create profile
    await supabase
      .from('users')
      .insert({
        id: signupData.user.id,
        email: testEmail,
        phone: '+919876543210',
        full_name: 'Login Test User',
        wallet_balance: 0.00,
        total_consultations: 0,
        status: 'active'
      })

    // Test login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (loginError) {
      console.log('❌ Login failed:', loginError.message)
      return false
    }

    if (!loginData.user) {
      console.log('❌ No user data returned from login')
      return false
    }

    console.log('✅ Login successful')

    // Test getting user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', loginData.user.id)
      .single()

    if (profileError) {
      console.log('❌ Failed to fetch user profile:', profileError.message)
      return false
    }

    console.log('✅ Profile fetched successfully:', profileData.full_name)

    // Test logout
    const { error: logoutError } = await supabase.auth.signOut()

    if (logoutError) {
      console.log('❌ Logout failed:', logoutError.message)
      return false
    }

    console.log('✅ Logout successful')
    
    // Cleanup
    await supabase.from('users').delete().eq('id', signupData.user.id)
    
    return true

  } catch (error) {
    console.log('❌ Login test failed:', error.message)
    return false
  }
}

// Test Profile Updates
async function testProfileUpdate() {
  console.log('\n📝 Testing Profile Updates...')
  
  try {
    // Create a test user
    const testEmail = `profiletest${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (authError || !authData.user) {
      console.log('❌ Failed to create test user')
      return false
    }

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testEmail,
        phone: '+919876543210',
        full_name: 'Profile Test User',
        wallet_balance: 0.00,
        total_consultations: 0,
        status: 'active'
      })
      .select()
      .single()

    if (profileError) {
      console.log('❌ Failed to create profile')
      return false
    }

    console.log('✅ Test profile created')

    // Test profile update
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        full_name: 'Updated Profile Test User',
        occupation: 'Software Engineer',
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id)
      .select()
      .single()

    if (updateError) {
      console.log('❌ Profile update failed:', updateError.message)
      return false
    }

    console.log('✅ Profile updated successfully:', updateData.full_name)
    
    // Cleanup
    await supabase.from('users').delete().eq('id', authData.user.id)
    
    return true

  } catch (error) {
    console.log('❌ Profile update test failed:', error.message)
    return false
  }
}

// Run all tests
async function runAllAuthTests() {
  const tests = [
    { name: 'User Signup', fn: testUserSignup },
    { name: 'Astrologer Signup', fn: testAstrologerSignup },
    { name: 'Login System', fn: testLogin },
    { name: 'Profile Update', fn: testProfileUpdate }
  ]

  const results = []

  for (const test of tests) {
    console.log(`\n${'='.repeat(20)} ${test.name.toUpperCase()} TEST ${'='.repeat(20)}`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 AUTHENTICATION TEST SUMMARY')
  console.log('='.repeat(60))
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })

  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length

  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log('\n🎉 All authentication tests passed!')
    console.log('✅ Authentication system is working properly')
    console.log('✅ User and Astrologer signup working')
    console.log('✅ Login/Logout working')
    console.log('✅ Profile management working')
  } else {
    console.log('\n⚠️  Some authentication tests failed')
    console.log('🔧 Check the errors above for troubleshooting')
  }
}

runAllAuthTests().catch(console.error)