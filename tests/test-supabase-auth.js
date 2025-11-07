// Test Supabase Auth Configuration
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔐 Testing Supabase Auth Configuration...')
console.log('='.repeat(50))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthSettings() {
    try {
        console.log('🔍 Testing auth settings...')

        // Test 1: Try to signup with a simple email
        console.log('\n📧 Testing email signup...')

        const testEmail = 'test@test.com'
        const testPassword = 'password123'

        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        })

        if (error) {
            console.log('❌ Signup error:', error.message)

            if (error.message.includes('invalid')) {
                console.log('💡 This suggests Supabase has email restrictions enabled')
                console.log('🔧 Solutions:')
                console.log('   1. Go to Supabase Dashboard > Authentication > Settings')
                console.log('   2. Disable "Confirm email" for testing')
                console.log('   3. Check "Site URL" settings')
                console.log('   4. Verify no domain restrictions are set')
            }

            return false
        }

        if (data.user) {
            console.log('✅ Auth signup working!')
            console.log('👤 User created:', data.user.id)

            // Cleanup
            try {
                await supabase.auth.signOut()
            } catch (e) {
                // Ignore cleanup errors
            }

            return true
        }

        return false

    } catch (error) {
        console.log('❌ Auth test failed:', error.message)
        return false
    }
}

async function testAuthConfig() {
    try {
        console.log('\n⚙️ Testing auth configuration...')

        // Test getting session (should be null)
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
            console.log('❌ Session error:', error.message)
            return false
        }

        console.log('✅ Auth system accessible')
        console.log('📋 Current session:', session ? 'Active' : 'None (expected)')

        return true

    } catch (error) {
        console.log('❌ Auth config test failed:', error.message)
        return false
    }
}

async function testDatabaseAccess() {
    try {
        console.log('\n🗄️ Testing database access...')

        // Test reading from a public table
        const { data, error } = await supabase
            .from('specialties')
            .select('name')
            .limit(1)

        if (error) {
            console.log('❌ Database access error:', error.message)
            return false
        }

        console.log('✅ Database access working')
        console.log('📊 Sample data:', data?.[0]?.name || 'No data')

        return true

    } catch (error) {
        console.log('❌ Database test failed:', error.message)
        return false
    }
}

async function main() {
    const tests = [
        { name: 'Auth Configuration', fn: testAuthConfig },
        { name: 'Database Access', fn: testDatabaseAccess },
        { name: 'Auth Settings', fn: testAuthSettings }
    ]

    console.log('🧪 Running Supabase tests...\n')

    for (const test of tests) {
        console.log(`${'='.repeat(15)} ${test.name.toUpperCase()} ${'='.repeat(15)}`)
        await test.fn()
    }

    console.log('\n' + '='.repeat(50))
    console.log('📋 SUPABASE AUTH TEST COMPLETE')
    console.log('='.repeat(50))

    console.log('\n🔧 If signup is still failing, check:')
    console.log('1. Supabase Dashboard > Authentication > Settings')
    console.log('2. Disable "Confirm email" temporarily')
    console.log('3. Set Site URL to: http://localhost:3000')
    console.log('4. Check if any domain restrictions are enabled')
    console.log('5. Verify RLS policies allow inserts')
}

main().catch(console.error)