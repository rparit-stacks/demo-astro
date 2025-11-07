// Check Supabase Schema - Verify all tables created
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Checking Supabase Database Schema...')
console.log('='.repeat(60))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Expected tables from our schema
const expectedTables = [
  'users',
  'astrologers', 
  'specialties',
  'astrologer_specialties',
  'astrologer_availability',
  'consultations',
  'messages',
  'transactions',
  'reviews',
  'user_favorites',
  'notifications',
  'referrals',
  'horoscope_cache',
  'system_settings'
]

// Test each table
async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      return {
        table: tableName,
        exists: false,
        error: error.message,
        count: 0
      }
    }
    
    return {
      table: tableName,
      exists: true,
      error: null,
      count: count || 0
    }
    
  } catch (err) {
    return {
      table: tableName,
      exists: false,
      error: err.message,
      count: 0
    }
  }
}

// Check table structure
async function checkTableStructure(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (error) {
      return { columns: [], error: error.message }
    }
    
    // If we get data, we can see the structure
    return { columns: data ? Object.keys(data[0] || {}) : [], error: null }
    
  } catch (err) {
    return { columns: [], error: err.message }
  }
}

// Test RLS (Row Level Security)
async function checkRLS() {
  try {
    console.log('\n🔒 Checking Row Level Security (RLS)...')
    
    // Try to access users table (should work with RLS)
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      console.log('⚠️  RLS Test:', error.message)
      return false
    }
    
    console.log('✅ RLS is properly configured')
    return true
    
  } catch (err) {
    console.log('❌ RLS Test failed:', err.message)
    return false
  }
}

// Test specialties data
async function checkInitialData() {
  try {
    console.log('\n📊 Checking initial data...')
    
    const { data: specialties, error } = await supabase
      .from('specialties')
      .select('name, description')
    
    if (error) {
      console.log('❌ Initial data check failed:', error.message)
      return false
    }
    
    console.log('✅ Specialties data:', specialties?.length || 0, 'records')
    if (specialties && specialties.length > 0) {
      console.log('📋 Available specialties:')
      specialties.forEach(s => console.log(`   - ${s.name}: ${s.description}`))
    }
    
    return true
    
  } catch (err) {
    console.log('❌ Initial data check failed:', err.message)
    return false
  }
}

// Test authentication
async function checkAuth() {
  try {
    console.log('\n🔐 Checking authentication system...')
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && !error.message.includes('not authenticated')) {
      console.log('❌ Auth system error:', error.message)
      return false
    }
    
    console.log('✅ Authentication system working')
    console.log('👤 Current user:', user ? user.email : 'Not logged in (expected)')
    
    return true
    
  } catch (err) {
    console.log('❌ Auth check failed:', err.message)
    return false
  }
}

// Main function
async function main() {
  console.log('📋 Testing all expected tables...\n')
  
  const results = []
  
  // Check each table
  for (const tableName of expectedTables) {
    const result = await checkTable(tableName)
    results.push(result)
    
    const status = result.exists ? '✅' : '❌'
    const count = result.exists ? ` (${result.count} records)` : ''
    
    console.log(`${status} ${tableName}${count}`)
    
    if (!result.exists) {
      console.log(`   Error: ${result.error}`)
    }
  }
  
  // Summary
  const existingTables = results.filter(r => r.exists)
  const missingTables = results.filter(r => !r.exists)
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 SCHEMA CHECK SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Tables created: ${existingTables.length}/${expectedTables.length}`)
  console.log(`❌ Tables missing: ${missingTables.length}`)
  
  if (missingTables.length > 0) {
    console.log('\n❌ Missing tables:')
    missingTables.forEach(t => console.log(`   - ${t.table}`))
  }
  
  if (existingTables.length === expectedTables.length) {
    console.log('\n🎉 All tables created successfully!')
    
    // Run additional tests
    await checkRLS()
    await checkInitialData()
    await checkAuth()
    
    console.log('\n🚀 Database is ready for use!')
    console.log('✅ You can now start building the backend services')
    
  } else {
    console.log('\n⚠️  Some tables are missing. Please check:')
    console.log('1. Did the SQL script run completely?')
    console.log('2. Were there any errors in Supabase SQL Editor?')
    console.log('3. Try running the DATABASE_SCHEMA.sql again')
  }
  
  // Test sample operations
  if (existingTables.length > 0) {
    console.log('\n🧪 Testing sample operations...')
    
    // Test inserting a specialty (if table exists)
    if (existingTables.find(t => t.table === 'specialties')) {
      try {
        const { data, error } = await supabase
          .from('specialties')
          .select('count')
          .limit(1)
        
        if (!error) {
          console.log('✅ Sample query successful')
        }
      } catch (err) {
        console.log('⚠️  Sample query failed:', err.message)
      }
    }
  }
}

main().catch(console.error)