const express = require('express');
const router = express.Router();
const { getUserProfile, updateSubscription } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/subscription', protect, updateSubscription);

module.exports = router;
