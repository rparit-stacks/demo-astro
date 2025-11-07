// Create Database Schema
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Creating Supabase Database Schema...')
console.log('='.repeat(50))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test if we can create a simple table
async function testSchemaCreation() {
  try {
    console.log('🔍 Testing schema creation permissions...')
    
    // Try to create a simple test table
    const { data, error } = await supabase.rpc('create_test_table', {})
    
    if (error) {
      console.log('❌ Cannot create schema via client:', error.message)
      console.log('\n📝 Manual Steps Required:')
      console.log('1. Go to https://supabase.com/dashboard')
      console.log('2. Select your project: irkunqbrybxhucuvjhsz')
      console.log('3. Go to SQL Editor')
      console.log('4. Copy and paste the DATABASE_SCHEMA.sql file')
      console.log('5. Click "Run" to execute')
      console.log('\n📄 Schema file location: ./DATABASE_SCHEMA.sql')
      return false
    }
    
    console.log('✅ Schema creation successful!')
    return true
    
  } catch (error) {
    console.error('❌ Schema test failed:', error.message)
    return false
  }
}

// Check current database status
async function checkDatabaseStatus() {
  try {
    console.log('📊 Checking current database status...')
    
    // Check if any tables exist
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (error) {
      console.log('ℹ️  Cannot access schema information (normal for new projects)')
    } else {
      console.log('📋 Existing tables:', data?.map(t => t.table_name) || 'None')
    }
    
  } catch (error) {
    console.log('ℹ️  Database status check skipped')
  }
}

async function main() {
  await checkDatabaseStatus()
  await testSchemaCreation()
  
  console.log('\n🎯 Next Steps:')
  console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/irkunqbrybxhucuvjhsz')
  console.log('2. Go to SQL Editor')
  console.log('3. Run the DATABASE_SCHEMA.sql file')
  console.log('4. Test connection again with: node simple-test.js')
}

main().catch(console.error)