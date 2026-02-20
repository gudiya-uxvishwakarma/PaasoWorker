/**
 * Test Render Backend Connection
 * Run this to wake up Render backend and test connection
 */

const RENDER_URL = 'https://passo-backend.onrender.com';

async function testRenderBackend() {
  console.log('🔍 Testing Render Backend Connection...\n');
  console.log('⏰ Note: First request may take 30-50 seconds (cold start)\n');

  // Test 1: Health Check
  console.log('Test 1: Health Check');
  console.log('URL:', `${RENDER_URL}/health`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${RENDER_URL}/health`);
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log(`⏱️  Duration: ${duration}s\n`);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('💡 Render backend might be sleeping. Wait and try again.\n');
    return;
  }

  // Test 2: Check Mobile Endpoint
  console.log('Test 2: Check Mobile Endpoint (Public Route)');
  console.log('URL:', `${RENDER_URL}/api/workers/check-mobile`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${RENDER_URL}/api/workers/check-mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile: '9876543210' })
    });
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log(`⏱️  Duration: ${duration}s\n`);
  } catch (error) {
    console.error('❌ Check mobile failed:', error.message, '\n');
    return;
  }

  console.log('🎉 All tests passed! Render backend is ready.\n');
  console.log('📱 You can now use the mobile app.\n');
}

// Run tests
testRenderBackend().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
