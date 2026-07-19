const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting AgriVision AI API Verification Tests ---');

  try {
    // 1. Health Check
    console.log('\n1. Testing Health Check...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('Result:', healthRes.data);

    // 2. Register a test user
    console.log('\n2. Testing User Registration...');
    const testEmail = `farmer-${Date.now()}@agrivision.com`;
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Farmer',
      email: testEmail,
      password: 'password123',
      phone: '9876543210',
      role: 'farmer'
    });
    console.log('Registration Status:', regRes.data.status);
    const token = regRes.data.token;
    console.log('Received JWT Token:', token ? 'YES (Valid)' : 'NO');

    // 3. Login
    console.log('\n3. Testing User Login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    console.log('Login Status:', loginRes.data.status);

    // Set axios auth header for protected routes
    const authAxios = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });

    // 4. Get current user
    console.log('\n4. Testing /me Profile Check...');
    const meRes = await authAxios.get(`${BASE_URL}/auth/me`);
    console.log('Profile Name:', meRes.data.data.user.name);
    console.log('Profile Role:', meRes.data.data.user.role);

    // 5. Test Weather API
    console.log('\n5. Testing Protected Weather Risk Endpoint...');
    const weatherRes = await authAxios.get(`${BASE_URL}/weather/current`);
    console.log('Weather Data:', weatherRes.data.data);

    console.log('\n--- All API Endpoints Verified Successfully! ---');
  } catch (err) {
    console.error('\n❌ Test failed with error:', err.response?.data || err.message);
  }
}

runTests();
