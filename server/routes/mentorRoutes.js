const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAssignedStudents,
  getStudentLogs,
  reviewLog,
} = require('../controllers/mentorController');

router.use(verifyToken, authorizeRole('mentor'));

router.get('/students', asyncHandler(getAssignedStudents));
router.get('/students/:studentId/logs', asyncHandler(getStudentLogs));
router.post('/logs/:logId/review', asyncHandler(reviewLog));

module.exports = router;
