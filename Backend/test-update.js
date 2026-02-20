const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin1@test.com',
      password: 'Password123!'
    });
    
    const token = res.data.access_token;
    
    const updateRes = await axios.post('http://localhost:3000/users/profile', {
      name: "Admin User",
      bio: "Test bio"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Success:", updateRes.data);
  } catch (err) {
    console.log("Failed:", err.response ? err.response.data : err.message);
  }
}
test();
