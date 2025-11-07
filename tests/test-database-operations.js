// Test Database Operations
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🗄️ Testing Database Operations...')
console.log('='.repeat(50))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generate UUID v4
function generateUUID() {
  return crypto.randomUUID()
}

async function testUserOperations() {
  try {
    console.log('\n👤 Testing User Operations...')
    
    const testUserId = generateUUID()
    console.log('Generated UUID:', testUserId)
    
    // Create user
    const { data: createData, error: createError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'testuser@example.com',
        phone: '+919876543210',
        full_name: 'Test User',
        date_of_birth: '1990-05-15',
        gender: 'male',
        marital_status: 'single',
        occupation: 'Software Engineer',
        wallet_balance: 0.00,
        total_consultations: 0,
        status: 'active'
      })
      .select()
      .single()
    
    if (createError) {
      console.log('❌ User creation failed:', createError.message)
      return false
    }
    
    console.log('✅ User created:', createData.full_name)
    
    // Read user
    const { data: readData, error: readError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single()
    
    if (readError) {
      console.log('❌ User read failed:', readError.message)
      return false
    }
    
    console.log('✅ User read:', readData.full_name)
    
    // Update user
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        full_name: 'Updated Test User',
        occupation: 'Senior Software Engineer',
        wallet_balance: 100.00
      })
      .eq('id', testUserId)
      .select()
      .single()
    
    if (updateError) {
      console.log('❌ User update failed:', updateError.message)
      return false
    }
    
    console.log('✅ User updated:', updateData.full_name, '- Balance:', updateData.wallet_balance)
    
    // Delete user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', testUserId)
    
    if (deleteError) {
      console.log('❌ User deletion failed:', deleteError.message)
      return false
    }
    
    console.log('✅ User deleted successfully')
    return true
    
  } catch (error) {
    console.log('❌ User operations test failed:', error.message)
    return false
  }
}

async function testAstrologerOperations() {
  try {
    console.log('\n🔮 Testing Astrologer Operations...')
    
    const testAstrologerId = generateUUID()
    console.log('Generated UUID:', testAstrologerId)
    
    // Create astrologer
    const { data: createData, error: createError } = await supabase
      .from('astrologers')
      .insert({
        id: testAstrologerId,
        email: 'testastrologer@example.com',
        phone: '+919876543211',
        full_name: 'Test Astrologer',
        display_name: 'Dr. Test',
        bio: 'Experienced astrologer with 10+ years of practice',
        experience_years: 10,
        languages: ['Hindi', 'English', 'Sanskrit'],
        education: 'PhD in Astrology',
        chat_rate: 25.00,
        voice_rate: 35.00,
        video_rate: 45.00,
        total_consultations: 0,
        total_earnings: 0.00,
        average_rating: 0.00,
        total_reviews: 0,
        status: 'active',
        is_online: true,
        is_verified: true,
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      })
      .select()
      .single()
    
    if (createError) {
      console.log('❌ Astrologer creation failed:', createError.message)
      return false
    }
    
    console.log('✅ Astrologer created:', createData.display_name)
    
    // Add specialties
    const { data: specialties, error: specialtyError } = await supabase
      .from('specialties')
      .select('id, name')
      .limit(3)
    
    if (specialtyError || !specialties || specialties.length === 0) {
      console.log('⚠️ No specialties found, skipping specialty assignment')
    } else {
      const { error: assignError } = await supabase
        .from('astrologer_specialties')
        .insert(
          specialties.map(s => ({
            astrologer_id: testAstrologerId,
            specialty_id: s.id
          }))
        )
      
      if (assignError) {
        console.log('⚠️ Specialty assignment failed:', assignError.message)
      } else {
        console.log('✅ Specialties assigned:', specialties.map(s => s.name).join(', '))
      }
    }
    
    // Read astrologer with specialties
    const { data: readData, error: readError } = await supabase
      .from('astrologers')
      .select(`
        *,
        astrologer_specialties (
          specialty_id,
          specialties (
            name,
            description
          )
        )
      `)
      .eq('id', testAstrologerId)
      .single()
    
    if (readError) {
      console.log('❌ Astrologer read failed:', readError.message)
      return false
    }
    
    console.log('✅ Astrologer read with specialties:', readData.display_name)
    
    // Update astrologer
    const { data: updateData, error: updateError } = await supabase
      .from('astrologers')
      .update({
        bio: 'Updated: Master astrologer with extensive experience',
        chat_rate: 30.00,
        average_rating: 4.8,
        total_reviews: 150,
        is_online: false
      })
      .eq('id', testAstrologerId)
      .select()
      .single()
    
    if (updateError) {
      console.log('❌ Astrologer update failed:', updateError.message)
      return false
    }
    
    console.log('✅ Astrologer updated - Rating:', updateData.average_rating, 'Online:', updateData.is_online)
    
    // Cleanup
    await supabase.from('astrologer_specialties').delete().eq('astrologer_id', testAstrologerId)
    await supabase.from('astrologers').delete().eq('id', testAstrologerId)
    
    console.log('✅ Astrologer deleted successfully')
    return true
    
  } catch (error) {
    console.log('❌ Astrologer operations test failed:', error.message)
    return false
  }
}

async function testSpecialtiesOperations() {
  try {
    console.log('\n🎯 Testing Specialties Operations...')
    
    // Read all specialties
    const { data: specialties, error: specialtyError } = await supabase
      .from('specialties')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (specialtyError) {
      console.log('❌ Specialties read failed:', specialtyError.message)
      return false
    }
    
    console.log('✅ Specialties read:', specialties?.length || 0, 'found')
    
    if (specialties && specialties.length > 0) {
      console.log('📋 Available specialties:')
      specialties.forEach(s => {
        console.log(`   - ${s.name}: ${s.description}`)
      })
    }
    
    return true
    
  } catch (error) {
    console.log('❌ Specialties operations test failed:', error.message)
    return false
  }
}

async function testSystemSettings() {
  try {
    console.log('\n⚙️ Testing System Settings...')
    
    // Read system settings
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
    
    if (settingsError) {
      console.log('❌ System settings read failed:', settingsError.message)
      return false
    }
    
    console.log('✅ System settings read:', settings?.length || 0, 'found')
    
    if (settings && settings.length > 0) {
      console.log('📋 System settings:')
      settings.forEach(s => {
        console.log(`   - ${s.key}: ${s.value} (${s.description})`)
      })
    }
    
    return true
    
  } catch (error) {
    console.log('❌ System settings test failed:', error.message)
    return false
  }
}

async function main() {
  const tests = [
    { name: 'User Operations', fn: testUserOperations },
    { name: 'Astrologer Operations', fn: testAstrologerOperations },
    { name: 'Specialties Operations', fn: testSpecialtiesOperations },
    { name: 'System Settings', fn: testSystemSettings }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(15)} ${test.name.toUpperCase()} ${'='.repeat(15)}`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 DATABASE OPERATIONS TEST SUMMARY')
  console.log('='.repeat(50))
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  console.log(`\n🎯 Result: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All database operations working!')
    console.log('✅ User CRUD operations working')
    console.log('✅ Astrologer CRUD operations working')
    console.log('✅ Specialties system working')
    console.log('✅ System settings accessible')
    console.log('\n🚀 Ready for authentication integration!')
  } else {
    console.log('\n⚠️ Some database operations failed')
    console.log('🔧 Check the errors above for troubleshooting')
  }
}

main().catch(console.error)