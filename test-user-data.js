// Test script to check user data in database
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUserData() {
  console.log('🔍 Testing user data in database...')
  
  try {
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)
    
    console.log('👤 Users table:')
    if (usersError) {
      console.log('❌ Error:', usersError.message)
    } else {
      console.log('✅ Found', users?.length || 0, 'users')
      users?.forEach(user => {
        console.log(`  - ${user.email} (${user.full_name})`)
      })
    }
    
    // Check astrologers table
    const { data: astrologers, error: astrologersError } = await supabase
      .from('astrologers')
      .select('*')
      .limit(5)
    
    console.log('🔮 Astrologers table:')
    if (astrologersError) {
      console.log('❌ Error:', astrologersError.message)
    } else {
      console.log('✅ Found', astrologers?.length || 0, 'astrologers')
      astrologers?.forEach(astrologer => {
        console.log(`  - ${astrologer.email} (${astrologer.display_name})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testUserData()

