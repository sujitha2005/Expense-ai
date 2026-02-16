const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('Testing registration endpoint...');
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test123@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.log('Registration failed with error:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
  }
};

testRegistration();
