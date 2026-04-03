const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');
const { 
  getAllBadges, 
  createBadge, 
  getMyBadges, 
  getBadgeHistory 
} = require('../controllers/badgeController');

router.get('/', verifyToken, authorizeRole('admin'), getAllBadges);
router.post('/', verifyToken, authorizeRole('admin'), createBadge);
router.get('/my', verifyToken, authorizeRole('student'), getMyBadges);
router.get('/history', verifyToken, authorizeRole('student'), getBadgeHistory);

module.exports = router;
