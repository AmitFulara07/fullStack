const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../utils/asyncHandler');

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').isIn(['admin', 'faculty', 'student', 'mentor']),
], asyncHandler(register));

router.post('/login', asyncHandler(login));

router.get('/me', verifyToken, asyncHandler(getMe));

module.exports = router;
