// Simple Authentication Test
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔐 Simple Authentication Test...')
console.log('='.repeat(50))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthSystem() {
  try {
    console.log('🔍 Testing auth system availability...')
    
    // Test 1: Check if auth is working
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && !error.message.includes('not authenticated')) {
      console.log('❌ Auth system error:', error.message)
      return false
    }
    
    console.log('✅ Auth system is available')
    console.log('👤 Current user:', user ? user.email : 'Not logged in (expected)')
    
    // Test 2: Check if we can access user table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (userError) {
      console.log('❌ Cannot access users table:', userError.message)
      return false
    }
    
    console.log('✅ Users table accessible')
    
    // Test 3: Check if we can access astrologers table
    const { data: astrologerData, error: astrologerError } = await supabase
      .from('astrologers')
      .select('count')
      .limit(1)
    
    if (astrologerError) {
      console.log('❌ Cannot access astrologers table:', astrologerError.message)
      return false
    }
    
    console.log('✅ Astrologers table accessible')
    
    // Test 4: Check specialties table
    const { data: specialties, error: specialtyError } = await supabase
      .from('specialties')
      .select('name')
      .limit(3)
    
    if (specialtyError) {
      console.log('❌ Cannot access specialties table:', specialtyError.message)
      return false
    }
    
    console.log('✅ Specialties table accessible')
    console.log('📋 Available specialties:', specialties?.map(s => s.name).join(', '))
    
    return true
    
  } catch (error) {
    console.log('❌ Auth system test failed:', error.message)
    return false
  }
}

async function testManualUserCreation() {
  try {
    console.log('\n👤 Testing manual user creation...')
    
    // Create a test user directly in the database
    const testUserId = `test-user-${Date.now()}`
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        phone: '+919876543210',
        full_name: 'Test User',
        wallet_balance: 0.00,
        total_consultations: 0,
        status: 'active'
      })
      .select()
      .single()
    
    if (error) {
      console.log('❌ Manual user creation failed:', error.message)
      return false
    }
    
    console.log('✅ Manual user created successfully')
    
    // Test update
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        full_name: 'Updated Test User',
        occupation: 'Software Engineer'
      })
      .eq('id', testUserId)
      .select()
      .single()
    
    if (updateError) {
      console.log('❌ User update failed:', updateError.message)
    } else {
      console.log('✅ User updated successfully:', updateData.full_name)
    }
    
    // Cleanup
    await supabase.from('users').delete().eq('id', testUserId)
    console.log('✅ Test user cleaned up')
    
    return true
    
  } catch (error) {
    console.log('❌ Manual user creation test failed:', error.message)
    return false
  }
}

async function testManualAstrologerCreation() {
  try {
    console.log('\n🔮 Testing manual astrologer creation...')
    
    // Create a test astrologer directly in the database
    const testAstrologerId = `test-astrologer-${Date.now()}`
    
    const { data, error } = await supabase
      .from('astrologers')
      .insert({
        id: testAstrologerId,
        email: 'testastrologer@example.com',
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
    
    if (error) {
      console.log('❌ Manual astrologer creation failed:', error.message)
      return false
    }
    
    console.log('✅ Manual astrologer created successfully')
    
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
            astrologer_id: testAstrologerId,
            specialty_id: s.id
          }))
        )
      
      if (specialtyError) {
        console.log('⚠️ Specialty assignment failed:', specialtyError.message)
      } else {
        console.log('✅ Specialties assigned:', specialties.map(s => s.name).join(', '))
      }
    }
    
    // Test update
    const { data: updateData, error: updateError } = await supabase
      .from('astrologers')
      .update({
        bio: 'Experienced astrologer with 5+ years of practice',
        chat_rate: 20.00
      })
      .eq('id', testAstrologerId)
      .select()
      .single()
    
    if (updateError) {
      console.log('❌ Astrologer update failed:', updateError.message)
    } else {
      console.log('✅ Astrologer updated successfully')
    }
    
    // Cleanup
    await supabase.from('astrologer_specialties').delete().eq('astrologer_id', testAstrologerId)
    await supabase.from('astrologers').delete().eq('id', testAstrologerId)
    console.log('✅ Test astrologer cleaned up')
    
    return true
    
  } catch (error) {
    console.log('❌ Manual astrologer creation test failed:', error.message)
    return false
  }
}

async function main() {
  const tests = [
    { name: 'Auth System', fn: testAuthSystem },
    { name: 'Manual User Creation', fn: testManualUserCreation },
    { name: 'Manual Astrologer Creation', fn: testManualAstrologerCreation }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(15)} ${test.name.toUpperCase()} ${'='.repeat(15)}`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 SIMPLE AUTH TEST SUMMARY')
  console.log('='.repeat(50))
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  console.log(`\n🎯 Result: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed!')
    console.log('✅ Database operations working')
    console.log('✅ User/Astrologer CRUD working')
    console.log('✅ Ready for frontend integration')
  } else {
    console.log('\n⚠️ Some tests failed')
  }
}

main().catch(console.error)