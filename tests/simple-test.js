// Simple Supabase Test
console.log('Starting simple test...')

try {
  require('dotenv').config()
  console.log('✅ dotenv loaded')
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('URL exists:', !!url)
  console.log('Key exists:', !!key)
  console.log('URL value:', url)
  
  if (url && key) {
    console.log('✅ Environment variables found')
    
    const { createClient } = require('@supabase/supabase-js')
    console.log('✅ Supabase module loaded')
    
    const supabase = createClient(url, key)
    console.log('✅ Supabase client created')
    
    // Test basic connection
    supabase
      .from('users')
      .select('count')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.log('❌ Query failed:', error.message)
          if (error.message.includes('does not exist')) {
            console.log('ℹ️  Table does not exist - need to create schema')
          }
        } else {
          console.log('✅ Query successful:', data)
        }
      })
      .catch(err => {
        console.log('❌ Connection error:', err.message)
      })
      
  } else {
    console.log('❌ Missing environment variables')
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message)
}