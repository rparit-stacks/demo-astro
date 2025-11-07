// Test with Real Email (Gmail)
require('dotenv').config()

const BASE_URL = 'http://localhost:3000'

async function testWithRealEmail() {
  console.log('📧 Testing with Real Email Address...')
  console.log('='.repeat(50))

  try {
    // Use a real email format that Supabase will accept
    const realEmail = 'test.anytimepooja@gmail.com' // Real Gmail format
    
    console.log('\n👤 Testing User Signup with Real Email...')
    
    const userSignupData = {
      email: realEmail,
      password: 'TestPassword123!',
      fullName: 'Test User Real',
      phone: '+919876543210',
      userType: 'user',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      maritalStatus: 'single',
      occupation: 'Software Engineer'
    }

    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userSignupData)
    })

    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (response.ok && data.success) {
      console.log('✅ Signup successful with real email!')
      console.log('📧 Check email for confirmation link')
      
      // Test login (will fail until email is confirmed)
      console.log('\n🔑 Testing Login (will fail until email confirmed)...')
      
      const loginData = {
        email: realEmail,
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
      console.log('Login Response:', JSON.stringify(loginResult, null, 2))
      
    } else {
      console.log('❌ Signup failed:', data.message)
      console.log('Error details:', data.error)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

async function testEmailFormats() {
  console.log('\n📧 Testing Different Email Formats...')
  
  const emailFormats = [
    'test@gmail.com',
    'user@yahoo.com', 
    'demo@outlook.com',
    'sample@hotmail.com',
    'test123@protonmail.com'
  ]
  
  for (const email of emailFormats) {
    console.log(`\n🧪 Testing: ${email}`)
    
    try {
      const testData = {
        email: email,
        password: 'TestPassword123!',
        fullName: 'Test User',
        phone: '+919876543210',
        userType: 'user'
      }

      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        console.log(`✅ ${email} - ACCEPTED`)
      } else {
        console.log(`❌ ${email} - REJECTED: ${data.error}`)
      }
      
    } catch (error) {
      console.log(`❌ ${email} - ERROR: ${error.message}`)
    }
  }
}

async function main() {
  await testWithRealEmail()
  await testEmailFormats()
  
  console.log('\n' + '='.repeat(50))
  console.log('📋 Real Email Test Complete')
  console.log('='.repeat(50))
  
  console.log('\n💡 Next Steps:')
  console.log('1. If signup works, check email for confirmation')
  console.log('2. Click confirmation link in email')
  console.log('3. Then try login again')
  console.log('4. If still failing, check Supabase Auth settings')
}

main().catch(console.error)