const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const asyncHandler = require('../utils/asyncHandler');
const { getMyProject } = require('../controllers/progressLogController');

router.get(
  '/my',
  verifyToken,
  authorizeRole('student'),
  asyncHandler(getMyProject)
);

module.exports = router;
