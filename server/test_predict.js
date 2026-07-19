const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';
const IMAGE_PATH = path.join(__dirname, '../ai-service/tomato_healthy.jpg');

async function testPrediction() {
  console.log('--- Starting prediction proxy test ---');

  if (!fs.existsSync(IMAGE_PATH)) {
    console.error(`Error: Leaf image not found at ${IMAGE_PATH}`);
    return;
  }

  try {
    // 1. Register a test user
    console.log('Registering test user...');
    const testEmail = `farmer-${Date.now()}@agrivision.com`;
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Farmer',
      email: testEmail,
      password: 'password123',
      phone: '9876543210',
      role: 'farmer'
    });
    const token = regRes.data.token;

    // 2. Send image prediction
    console.log('Uploading image leaf to Node Express proxy...');
    const form = new FormData();
    form.append('image', fs.createReadStream(IMAGE_PATH));

    const response = await axios.post(`${BASE_URL}/prediction/predict`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\nResult from AI service:');
    console.log(response.data);
    console.log('\n--- Prediction test successful! ---');
  } catch (err) {
    console.error('Prediction failed:', err.response?.data || err.message);
  }
}

testPrediction();
