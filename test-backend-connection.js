/**
 * Test Backend Connection
 * Run this to verify your backend is working
 */

const { getApiBaseUrl } = require('./src/config/api.config');

const testConnection = async () => {
  const baseUrl = getApiBaseUrl();
  const healthUrl = baseUrl.replace('/api', '/health');
  
  console.log('\n🔍 Testing Backend Connection...');
  console.log('🌐 API Base URL:', baseUrl);
  console.log('❤️  Health Check URL:', healthUrl);
  console.log('─────────────────────────────────\n');
  
  try {
    const response = await fetch(healthUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend is ONLINE!');
      console.log('📊 Status:', response.status);
      console.log('📦 Response:', JSON.stringify(data, null, 2));
      console.log('\n✨ Your app is ready to connect!\n');
    } else {
      console.log('⚠️  Backend responded but with error');
      console.log('📊 Status:', response.status);
      console.log('📦 Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend!');
    console.log('🔴 Error:', error.message);
    console.log('\n💡 Make sure your backend is running on Render');
    console.log('💡 Check: https://passo-backend.onrender.com/health\n');
  }
};

testConnection();
