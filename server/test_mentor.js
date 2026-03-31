const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign(
  { id: '650c8c9a3b2b4c5d6e7f8a9b', role: 'mentor', name: 'Test Mentor' }, 
  process.env.JWT_SECRET || 'this_is_a_super_secret_jwt_key_min_32_chars', 
  { expiresIn: '1h' }
);

axios.get('http://localhost:5000/api/mentor/students', {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => {
  console.log("SUCCESS");
  console.log(res.data);
}).catch(err => {
  console.error("ERROR ENCOUNTERED:");
  if (err.response) {
    console.error("Status:", err.response.status);
    console.error("Data:", err.response.data);
  } else {
    console.error(err.message);
  }
});
