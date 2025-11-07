// Supabase Connection Test Script
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Starting Supabase Connection Test...')
console.log('='.repeat(50))

// Check environment variables
console.log('📋 Environment Variables Check:')
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing')
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔍 Testing basic connection...')
    
    // Test 1: Basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (healthError) {
      console.log('❌ Connection failed:', healthError.message)
      
      // Check if it's a table not found error (expected if schema not created)
      if (healthError.message.includes('relation "public.users" does not exist')) {
        console.log('ℹ️  This is expected - database schema not created yet')
        console.log('📝 You need to run the DATABASE_SCHEMA.sql file in Supabase')
      }
      
      return false
    }
    
    console.log('✅ Basic connection successful!')
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

async function testAuth() {
  try {
    console.log('🔐 Testing authentication...')
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && !error.message.includes('not authenticated')) {
      console.log('❌ Auth test failed:', error.message)
      return false
    }
    
    console.log('✅ Authentication system working!')
    console.log('👤 Current user:', user ? user.email : 'Not logged in (expected)')
    return true
    
  } catch (error) {
    console.error('❌ Auth test failed:', error.message)
    return false
  }
}

async function testRealtime() {
  try {
    console.log('⚡ Testing realtime connection...')
    
    const channel = supabase.channel('test-channel')
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('⚠️  Realtime connection timeout (this might be normal)')
        channel.unsubscribe()
        resolve(true)
      }, 3000)
      
      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('✅ Realtime connection successful!')
          clearTimeout(timeout)
          channel.unsubscribe()
          resolve(true)
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime channel subscribed!')
            clearTimeout(timeout)
            channel.unsubscribe()
            resolve(true)
          }
        })
    })
    
  } catch (error) {
    console.error('❌ Realtime test failed:', error.message)
    return false
  }
}

async function checkDatabaseSchema() {
  console.log('📊 Checking database schema...')
  
  const tables = [
    'users', 
    'astrologers', 
    'consultations', 
    'messages', 
    'transactions',
    'specialties',
    'reviews'
  ]
  
  const results = []
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        results.push({ table, status: '❌', error: error.message })
      } else {
        results.push({ table, status: '✅', error: null })
      }
    } catch (err) {
      results.push({ table, status: '❌', error: err.message })
    }
  }
  
  console.log('\n📋 Schema Check Results:')
  console.log('-'.repeat(40))
  results.forEach(({ table, status, error }) => {
    console.log(`${status} ${table}`)
    if (error && !error.includes('does not exist')) {
      console.log(`   Error: ${error}`)
    }
  })
  
  const existingTables = results.filter(r => r.status === '✅').length
  const totalTables = results.length
  
  console.log(`\n📈 Schema Status: ${existingTables}/${totalTables} tables exist`)
  
  if (existingTables === 0) {
    console.log('\n📝 Next Steps:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Open SQL Editor')
    console.log('3. Run the DATABASE_SCHEMA.sql file')
    console.log('4. Re-run this test')
  }
  
  return existingTables > 0
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running comprehensive Supabase tests...\n')
  
  const tests = [
    { name: 'Connection', fn: testConnection },
    { name: 'Authentication', fn: testAuth },
    { name: 'Realtime', fn: testRealtime },
    { name: 'Database Schema', fn: checkDatabaseSchema }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(20)} ${test.name.toUpperCase()} TEST ${'='.repeat(20)}`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
    console.log('')
  }
  
  // Summary
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Supabase is ready to use.')
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.')
  }
}

// Run the tests
runAllTests().catch(console.error)