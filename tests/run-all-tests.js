// Run All Tests - Comprehensive Testing Suite
require('dotenv').config()
const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 Running All Anytime Pooja Tests')
console.log('='.repeat(60))

const tests = [
  {
    name: 'Basic Connection Test',
    file: 'simple-test.js',
    description: 'Tests basic Supabase connection'
  },
  {
    name: 'Schema Verification',
    file: 'check-schema.js', 
    description: 'Verifies database schema and tables'
  }
]

async function runTest(test) {
  console.log(`\n${'='.repeat(20)} ${test.name.toUpperCase()} ${'='.repeat(20)}`)
  console.log(`📝 ${test.description}`)
  console.log(`📄 Running: ${test.file}`)
  console.log('-'.repeat(60))
  
  try {
    const testPath = path.join(__dirname, test.file)
    const output = execSync(`node "${testPath}"`, { 
      encoding: 'utf8',
      cwd: process.cwd()
    })
    
    console.log(output)
    console.log(`✅ ${test.name} - PASSED`)
    return true
    
  } catch (error) {
    console.error(`❌ ${test.name} - FAILED`)
    console.error(error.stdout || error.message)
    return false
  }
}

async function main() {
  const results = []
  
  for (const test of tests) {
    const passed = await runTest(test)
    results.push({ name: test.name, passed })
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(60))
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! System is ready for development.')
    console.log('\n🚀 Next Steps:')
    console.log('1. Start building backend services')
    console.log('2. Implement authentication')
    console.log('3. Create API endpoints')
    console.log('4. Test real-time features')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.')
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check .env file configuration')
    console.log('2. Verify Supabase project status')
    console.log('3. Ensure database schema is created')
    console.log('4. Check network connectivity')
  }
}

main().catch(console.error)