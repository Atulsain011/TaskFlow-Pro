const User = require('../models/User');

// @desc    Get user profile (including stats & subscription)
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update subscription plan
// @route   PUT /api/users/subscription
const updateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'business'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      { 'subscription.plan': plan },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUserProfile, updateSubscription };
