/**
 * Test OTP Flow - Debug OTP verification issue
 */

const BACKEND_URL = 'https://passo-backend.onrender.com';

async function testOTPFlow() {
  console.log('🔍 Testing OTP Flow...\n');

  // Test 1: Health Check
  console.log('='.repeat(50));
  console.log('Test 1: Health Check');
  console.log('='.repeat(50));
  console.log('URL:', `${BACKEND_URL}/health`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log(`⏱️  Duration: ${duration}s\n`);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('💡 Backend might be sleeping. Wait 30-50 seconds and try again.\n');
    return;
  }

  // Test 2: Check Mobile - New User (Not Registered)
  console.log('='.repeat(50));
  console.log('Test 2: Check Mobile - New User');
  console.log('='.repeat(50));
  const newUserMobile = '9999999999';
  console.log('Mobile:', newUserMobile);
  console.log('URL:', `${BACKEND_URL}/api/workers/check-mobile`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BACKEND_URL}/api/workers/check-mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile: newUserMobile })
    });
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log(`⏱️  Duration: ${duration}s`);
    
    // Verify response structure
    if (data.success && !data.exists && data.worker === null) {
      console.log('✅ New user response is correct!\n');
    } else {
      console.warn('⚠️ Unexpected response structure\n');
    }
  } catch (error) {
    console.error('❌ Check mobile failed:', error.message, '\n');
    return;
  }

  // Test 3: Check Mobile - Existing User (If any)
  console.log('='.repeat(50));
  console.log('Test 3: Check Mobile - Existing User');
  console.log('='.repeat(50));
  const existingUserMobile = '9876543210';
  console.log('Mobile:', existingUserMobile);
  console.log('URL:', `${BACKEND_URL}/api/workers/check-mobile`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BACKEND_URL}/api/workers/check-mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile: existingUserMobile })
    });
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log(`⏱️  Duration: ${duration}s`);
    
    // Verify response structure
    if (data.success !== undefined && data.exists !== undefined) {
      console.log('✅ Response structure is correct!');
      if (data.exists && data.worker) {
        console.log('✅ Existing user found!');
        console.log('   - Name:', data.worker.name);
        console.log('   - Status:', data.worker.status);
        console.log('   - Verified:', data.worker.verified);
      } else {
        console.log('ℹ️  User not found in database (expected for new user)');
      }
    } else {
      console.warn('⚠️ Unexpected response structure');
    }
    console.log('');
  } catch (error) {
    console.error('❌ Check mobile failed:', error.message, '\n');
    return;
  }

  // Test 4: Invalid Request (Missing mobile)
  console.log('='.repeat(50));
  console.log('Test 4: Invalid Request - Missing Mobile');
  console.log('='.repeat(50));
  console.log('URL:', `${BACKEND_URL}/api/workers/check-mobile`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/workers/check-mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Empty body
    });
    const data = await response.json();
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 400 && !data.success) {
      console.log('✅ Error handling works correctly!\n');
    } else {
      console.warn('⚠️ Expected 400 error for missing mobile\n');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message, '\n');
  }

  // Summary
  console.log('='.repeat(50));
  console.log('🎉 OTP Flow Tests Complete!');
  console.log('='.repeat(50));
  console.log('\n📋 Expected OTP Flow:');
  console.log('1. User enters mobile number');
  console.log('2. User enters any 6-digit OTP (demo mode)');
  console.log('3. App calls /api/workers/check-mobile');
  console.log('4. If exists=true: Login existing user');
  console.log('5. If exists=false: Redirect to registration');
  console.log('\n💡 If app shows "Unable to verify", check:');
  console.log('- Response has success=true');
  console.log('- Response has exists field (true/false)');
  console.log('- Response has worker field (object or null)');
  console.log('- Network connection is stable');
  console.log('- Backend is not sleeping (first request takes 30-50s)');
  console.log('');
}

// Run tests
testOTPFlow().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
