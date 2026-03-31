const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');

const token = jwt.sign(
  { id: '69c28b75066f21cc0c9da452', role: 'mentor', name: 'Test Mentor' }, 
  process.env.JWT_SECRET || 'this_is_a_super_secret_jwt_key_min_32_chars', 
  { expiresIn: '1h' }
);

fetch('http://localhost:5000/api/mentor/students', {
  headers: { Authorization: `Bearer ${token}` }
}).then(async res => {
  const text = await res.text();
  fs.writeFileSync('fetch_out.json', JSON.stringify({ status: res.status, data: text }, null, 2));
  console.log('DONE');
}).catch(err => {
  fs.writeFileSync('fetch_err.txt', err.message);
  console.log('DONE');
});
