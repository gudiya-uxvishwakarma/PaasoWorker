// Simple test to verify api.config.js can be loaded
try {
  const config = require('./src/config/api.config');
  console.log('✅ Config loaded successfully!');
  console.log('📍 API Base URL:', config.getApiBaseUrl());
  console.log('🔑 Storage Keys:', config.STORAGE_KEYS);
  console.log('⏱️  Timeout:', config.REQUEST_TIMEOUT);
  process.exit(0);
} catch (error) {
  console.error('❌ Error loading config:', error.message);
  process.exit(1);
}
