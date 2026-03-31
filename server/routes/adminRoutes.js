const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const asyncHandler = require('../utils/asyncHandler');
const {
  assignMentor,
  reassignMentor,
  getAssignableStudents,
  getAvailableMentors
} = require('../controllers/adminController');

router.use(verifyToken, authorizeRole('admin'));

router.post('/assign-mentor', asyncHandler(assignMentor));
router.patch('/assignments/:id/reassign', asyncHandler(reassignMentor));
router.get('/students', asyncHandler(getAssignableStudents));
router.get('/mentors', asyncHandler(getAvailableMentors));

module.exports = router;
