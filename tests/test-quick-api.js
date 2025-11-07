// Quick API Test
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function quickTest() {
  try {
    console.log('🧪 Quick API Test...')
    
    // Test specialties endpoint (should work)
    const specialtiesResponse = await fetch('http://localhost:3000/api/profile/specialties')
    const specialtiesData = await specialtiesResponse.json()
    
    console.log('📊 Specialties API:')
    console.log('Status:', specialtiesResponse.status)
    console.log('Success:', specialtiesData.success)
    console.log('Count:', specialtiesData.data?.length || 0)
    
    if (specialtiesData.success) {
      console.log('✅ API is working!')
      
      // Test signup with real email format
      console.log('\n📝 Testing Signup...')
      
      const signupData = {
        email: 'realtest@gmail.com',
        password: 'RealTest123!',
        fullName: 'Real Test User',
        phone: '+919876543210',
        userType: 'user'
      }
      
      const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      })
      
      const signupResult = await signupResponse.json()
      
      console.log('📊 Signup Result:')
      console.log('Status:', signupResponse.status)
      console.log('Success:', signupResult.success)
      console.log('Message:', signupResult.message)
      
      if (signupResult.error) {
        console.log('Error:', signupResult.error)
      }
      
    } else {
      console.log('❌ API not working')
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

quickTest()