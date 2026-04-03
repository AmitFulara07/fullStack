const express = require('express');
const router  = express.Router();
const { checkLogPlagiarism, getIntegrityStatus } = require('../controllers/plagiarismController');
const verifyToken   = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

// Only mentors can trigger plagiarism checks
router.post('/check/:logId',   verifyToken, authorizeRole('mentor'), checkLogPlagiarism);
router.get('/status/:logId',   verifyToken, authorizeRole('mentor', 'faculty', 'admin'), getIntegrityStatus);

module.exports = router;
