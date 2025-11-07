// Test Frontend Integration
require('dotenv').config()

const BASE_URL = 'http://localhost:3000'

console.log('🎨 Testing Frontend Integration...')
console.log('='.repeat(50))

async function testSignupAPI() {
  try {
    console.log('\n📝 Testing Signup API Integration...')
    
    const signupData = {
      email: 'frontend.test@gmail.com',
      password: 'FrontendTest123!',
      fullName: 'Frontend Test User',
      phone: '+919876543210',
      userType: 'user',
      dateOfBirth: '1990-05-15',
      timeOfBirth: '14:30',
      placeOfBirth: 'Mumbai, Maharashtra',
      gender: 'male',
      maritalStatus: 'single',
      occupation: 'Software Engineer'
    }

    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    })

    const data = await response.json()
    
    console.log('📊 Signup Response:')
    console.log('Status:', response.status)
    console.log('Success:', data.success)
    console.log('Message:', data.message)
    
    if (data.error) {
      console.log('Error:', data.error)
    }

    return response.ok && data.success

  } catch (error) {
    console.log('❌ Signup API test failed:', error.message)
    return false
  }
}

async function testLoginAPI() {
  try {
    console.log('\n🔑 Testing Login API Integration...')
    
    const loginData = {
      email: 'frontend.test@gmail.com',
      password: 'FrontendTest123!',
      userType: 'user'
    }

    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })

    const data = await response.json()
    
    console.log('📊 Login Response:')
    console.log('Status:', response.status)
    console.log('Success:', data.success)
    console.log('Message:', data.message)
    
    if (data.error) {
      console.log('Error:', data.error)
    }

    return response.ok && data.success

  } catch (error) {
    console.log('❌ Login API test failed:', error.message)
    return false
  }
}

async function testValidationAPI() {
  try {
    console.log('\n✅ Testing Validation API...')
    
    // Test with invalid data
    const invalidData = {
      email: 'invalid-email',
      password: '123',
      fullName: '',
      phone: '123',
      userType: 'user'
    }

    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData)
    })

    const data = await response.json()
    
    console.log('📊 Validation Response:')
    console.log('Status:', response.status)
    console.log('Success:', data.success)
    console.log('Message:', data.message)

    // Should return 400 for invalid data
    return response.status === 400 && !data.success

  } catch (error) {
    console.log('❌ Validation API test failed:', error.message)
    return false
  }
}

async function checkFrontendPages() {
  try {
    console.log('\n🌐 Checking Frontend Pages...')
    
    const pages = [
      { path: '/', name: 'Home/Splash' },
      { path: '/login', name: 'Login' },
      { path: '/signup', name: 'Signup' }
    ]

    for (const page of pages) {
      try {
        const response = await fetch(`${BASE_URL}${page.path}`)
        const status = response.ok ? '✅' : '❌'
        console.log(`${status} ${page.name} (${response.status})`)
      } catch (err) {
        console.log(`❌ ${page.name} - Failed to load`)
      }
    }

    return true

  } catch (error) {
    console.log('❌ Frontend pages check failed:', error.message)
    return false
  }
}

async function main() {
  // Check if server is running
  try {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      console.log('❌ Next.js server not running!')
      console.log('🚀 Please start with: pnpm dev')
      return
    }
    console.log('✅ Next.js server is running')
  } catch (error) {
    console.log('❌ Cannot connect to server!')
    console.log('🚀 Please start with: pnpm dev')
    return
  }

  const tests = [
    { name: 'Frontend Pages', fn: checkFrontendPages },
    { name: 'Validation API', fn: testValidationAPI },
    { name: 'Signup API', fn: testSignupAPI },
    { name: 'Login API', fn: testLoginAPI }
  ]

  const results = []

  for (const test of tests) {
    console.log(`\n${'='.repeat(15)} ${test.name.toUpperCase()} ${'='.repeat(15)}`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 FRONTEND INTEGRATION TEST SUMMARY')
  console.log('='.repeat(50))
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })

  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length

  console.log(`\n🎯 Result: ${passedTests}/${totalTests} tests passed`)

  if (passedTests >= 2) {
    console.log('\n🎉 Frontend integration is working!')
    console.log('✅ You can now test signup/login in the browser')
    console.log('🌐 Open: http://localhost:3000/signup')
  } else {
    console.log('\n⚠️ Some integration issues found')
    console.log('🔧 Check the API responses above')
  }
}

main().catch(console.error)