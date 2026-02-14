/**
 * Test Render Backend Connection
 * Run: node test-render-backend.js
 */

const BACKEND_URL = 'https://passo-backend.onrender.com';

console.log('🔍 Testing Render Backend Connection...\n');
console.log('Backend URL:', BACKEND_URL);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Health Check
async function testHealth() {
  console.log('Test 1: Health Check');
  console.log('URL:', `${BACKEND_URL}/health`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend is running!');
      console.log('Response:', data);
    } else {
      console.log('❌ Backend returned error');
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('Error:', error.message);
  }
  console.log('');
}

// Test 2: Check Mobile Endpoint
async function testCheckMobile() {
  console.log('Test 2: Check Mobile Endpoint');
  console.log('URL:', `${BACKEND_URL}/api/workers/check-mobile`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/workers/check-mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile: '9876543210' }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Endpoint working!');
      console.log('Worker exists:', data.exists);
      if (data.worker) {
        console.log('Worker:', {
          name: data.worker.name,
          mobile: data.worker.mobile,
          status: data.worker.status,
        });
      }
    } else {
      console.log('❌ Endpoint returned error');
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ Request failed!');
    console.log('Error:', error.message);
  }
  console.log('');
}

// Test 3: Login Endpoint (if worker exists)
async function testLogin() {
  console.log('Test 3: Login Endpoint');
  console.log('URL:', `${BACKEND_URL}/api/auth/worker/login`);
  console.log('Credentials: 9876543210 / test123');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/worker/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: '9876543210',
        password: 'test123',
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token ? `${data.token.substring(0, 20)}...` : 'None');
      console.log('Worker:', {
        name: data.worker?.name,
        mobile: data.worker?.mobile,
        status: data.worker?.status,
      });
    } else {
      console.log('❌ Login failed');
      console.log('Message:', data.message);
    }
  } catch (error) {
    console.log('❌ Request failed!');
    console.log('Error:', error.message);
  }
  console.log('');
}

// Run all tests
async function runTests() {
  console.log('Starting tests...\n');
  
  await testHealth();
  await testCheckMobile();
  await testLogin();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Tests completed!');
  console.log('\n📱 Now test in your React Native app:');
  console.log('   Mobile: 9876543210');
  console.log('   Password: test123');
}

runTests();
