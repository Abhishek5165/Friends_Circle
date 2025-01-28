import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $and: [
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        },
        { _id: { $ne: req.user.userId } }, // Exclude current user
        { friends: { $ne: req.user.userId } }, // Exclude existing friends
        { friendRequests: { $ne: req.user.userId } } // Exclude users with pending requests
      ]
    }).select('-password');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

export default router;