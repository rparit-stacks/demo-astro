// Test Authentication API Endpoints
require('dotenv').config()

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

console.log('🔐 Testing Authentication API Endpoints...')
console.log('='.repeat(60))
console.log('Base URL:', BASE_URL)

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await response.json()

    return {
      status: response.status,
      success: response.ok,
      data: data
    }
  } catch (error) {
    return {
      status: 0,
      success: false,
      error: error.message
    }
  }
}

// Test User Signup
async function testUserSignup() {
  console.log('\n👤 Testing User Signup API...')
  
  try {
    const testEmail = `testuser${Date.now()}@example.com`
    
    const signupData = {
      email: testEmail,
      password: 'TestPassword123!',
      fullName: 'Test User',
      phone: '+919876543210',
      userType: 'user',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      maritalStatus: 'single',
      occupation: 'Software Engineer'
    }

    const response = await apiRequest('/api/auth/signup', 'POST', signupData)
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', response.data)

    if (response.success && response.data.success) {
      console.log('✅ User signup API working')
      return { success: true, email: testEmail, password: signupData.password }
    } else {
      console.log('❌ User signup failed:', response.data.message || response.error)
      return { success: false }
    }

  } catch (error) {
    console.log('❌ User signup test failed:', error.message)
    return { success: false }
  }
}

// Test Astrologer Signup
async function testAstrologerSignup() {
  console.log('\n🔮 Testing Astrologer Signup API...')
  
  try {
    const testEmail = `testastrologer${Date.now()}@example.com`
    
    const signupData = {
      email: testEmail,
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

    const response = await apiRequest('/api/auth/signup', 'POST', signupData)
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', response.data)

    if (response.success && response.data.success) {
      console.log('✅ Astrologer signup API working')
      return { success: true, email: testEmail, password: signupData.password }
    } else {
      console.log('❌ Astrologer signup failed:', response.data.message || response.error)
      return { success: false }
    }

  } catch (error) {
    console.log('❌ Astrologer signup test failed:', error.message)
    return { success: false }
  }
}

// Test Login API
async function testLogin(credentials) {
  console.log('\n🔑 Testing Login API...')
  
  if (!credentials || !credentials.success) {
    console.log('⚠️ Skipping login test - no valid credentials')
    return { success: false }
  }

  try {
    const loginData = {
      email: credentials.email,
      password: credentials.password,
      userType: 'user'
    }

    const response = await apiRequest('/api/auth/login', 'POST', loginData)
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', response.data)

    if (response.success && response.data.success) {
      console.log('✅ Login API working')
      return { success: true, data: response.data }
    } else {
      console.log('❌ Login failed:', response.data.message || response.error)
      return { success: false }
    }

  } catch (error) {
    console.log('❌ Login test failed:', error.message)
    return { success: false }
  }
}

// Test Get Current User API
async function testGetCurrentUser() {
  console.log('\n👤 Testing Get Current User API...')
  
  try {
    const response = await apiRequest('/api/auth/me', 'GET')
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', response.data)

    if (response.status === 401) {
      console.log('✅ Get current user API working (not authenticated - expected)')
      return { success: true }
    } else if (response.success && response.data.success) {
      console.log('✅ Get current user API working (authenticated)')
      return { success: true }
    } else {
      console.log('❌ Get current user failed:', response.data.message || response.error)
      return { success: false }
    }

  } catch (error) {
    console.log('❌ Get current user test failed:', error.message)
    return { success: false }
  }
}

// Test Get Specialties API
async function testGetSpecialties() {
  console.log('\n🎯 Testing Get Specialties API...')
  
  try {
    const response = await apiRequest('/api/profile/specialties', 'GET')
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', response.data)

    if (response.success && response.data.success) {
      console.log('✅ Get specialties API working')
      console.log('📋 Specialties found:', response.data.data?.length || 0)
      return { success: true }
    } else {
      console.log('❌ Get specialties failed:', response.data.message || response.error)
      return { success: false }
    }

  } catch (error) {
    console.log('❌ Get specialties test failed:', error.message)
    return { success: false }
  }
}

// Test API Validation
async function testAPIValidation() {
  console.log('\n🔍 Testing API Validation...')
  
  try {
    // Test signup with missing fields
    const invalidSignup = await apiRequest('/api/auth/signup', 'POST', {
      email: 'test@example.com'
      // Missing required fields
    })
    
    if (invalidSignup.status === 400) {
      console.log('✅ Signup validation working (missing fields)')
    } else {
      console.log('❌ Signup validation not working')
      return { success: false }
    }

    // Test signup with invalid email
    const invalidEmail = await apiRequest('/api/auth/signup', 'POST', {
      email: 'invalid-email',
      password: 'TestPassword123!',
      fullName: 'Test User',
      phone: '+919876543210',
      userType: 'user'
    })
    
    if (invalidEmail.status === 400) {
      console.log('✅ Email validation working')
    } else {
      console.log('❌ Email validation not working')
      return { success: false }
    }

    // Test login with missing fields
    const invalidLogin = await apiRequest('/api/auth/login', 'POST', {
      email: 'test@example.com'
      // Missing password and userType
    })
    
    if (invalidLogin.status === 400) {
      console.log('✅ Login validation working')
    } else {
      console.log('❌ Login validation not working')
      return { success: false }
    }

    return { success: true }

  } catch (error) {
    console.log('❌ API validation test failed:', error.message)
    return { success: false }
  }
}

// Run all tests
async function runAllAPITests() {
  console.log('\n🧪 Running all API tests...')
  
  const tests = [
    { name: 'User Signup', fn: testUserSignup },
    { name: 'Astrologer Signup', fn: testAstrologerSignup },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Get Specialties', fn: testGetSpecialties },
    { name: 'API Validation', fn: testAPIValidation }
  ]

  const results = []
  let userCredentials = null

  for (const test of tests) {
    console.log(`\n${'='.repeat(20)} ${test.name.toUpperCase()} TEST ${'='.repeat(20)}`)
    
    let result
    if (test.name === 'Login' && userCredentials) {
      result = await test.fn(userCredentials)
    } else {
      result = await test.fn()
    }
    
    // Store user credentials for login test
    if (test.name === 'User Signup' && result.success) {
      userCredentials = result
    }
    
    results.push({ name: test.name, passed: result.success })
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 API TEST SUMMARY')
  console.log('='.repeat(60))
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })

  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length

  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log('\n🎉 All API tests passed!')
    console.log('✅ Authentication APIs working')
    console.log('✅ Profile APIs working')
    console.log('✅ Validation working')
    console.log('✅ Ready for frontend integration!')
  } else {
    console.log('\n⚠️ Some API tests failed')
    console.log('🔧 Make sure the Next.js dev server is running:')
    console.log('   pnpm dev')
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(BASE_URL)
    return response.ok
  } catch (error) {
    return false
  }
}

async function main() {
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    console.log('❌ Next.js server is not running!')
    console.log('🚀 Please start the server first:')
    console.log('   pnpm dev')
    console.log('\nThen run this test again.')
    return
  }

  console.log('✅ Next.js server is running')
  await runAllAPITests()
}

main().catch(console.error)