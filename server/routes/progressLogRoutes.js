const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const asyncHandler = require('../utils/asyncHandler');
const { upload } = require('../config/cloudinary');
const {
  createLog,
  updateLog,
  getMyLogs,
  getLogById,
  deleteLog,
  getStudentStats
} = require('../controllers/progressLogController');
const { getFeedbackByLog } = require('../controllers/mentorController');

router.post(
  '/',
  verifyToken,
  authorizeRole('student'),
  upload.array('attachments', 5),
  asyncHandler(createLog)
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole('student'),
  upload.array('attachments', 5),
  asyncHandler(updateLog)
);

router.get(
  '/my',
  verifyToken,
  authorizeRole('student'),
  asyncHandler(getMyLogs)
);

router.get(
  '/stats',
  verifyToken,
  authorizeRole('student'),
  asyncHandler(getStudentStats)
);

router.get(
  '/:id',
  verifyToken,
  asyncHandler(getLogById)
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRole('student'),
  asyncHandler(deleteLog)
);

router.get(
  '/:logId/feedback',
  verifyToken,
  asyncHandler(getFeedbackByLog)
);

module.exports = router;
