// Quick server check
const http = require('http')

const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log('✅ Server is running on port 3000')
      resolve(true)
    })
    
    req.on('error', (err) => {
      console.log('❌ Server not running on port 3000')
      console.log('🚀 Please start the server with: pnpm dev')
      resolve(false)
    })
    
    req.setTimeout(2000, () => {
      console.log('⏰ Server check timeout')
      resolve(false)
    })
  })
}

checkServer().then(running => {
  if (running) {
    console.log('\n🧪 Now you can test the APIs:')
    console.log('node tests/test-auth-api.js')
  }
})