import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's friends
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('friends', '-password')
      .select('friends');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends' });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('friendRequests', '-password')
      .select('friendRequests');
    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend requests' });
  }
});

// Send friend request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.friendRequests.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    targetUser.friendRequests.push(req.user.userId);
    await targetUser.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request' });
  }
});

// Accept friend request
router.post('/accept/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const requestingUser = await User.findById(req.params.userId);

    if (!requestingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.friendRequests.includes(req.params.userId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    // Add each user to the other's friends list
    currentUser.friends.push(req.params.userId);
    requestingUser.friends.push(req.user.userId);

    // Remove the friend request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.userId
    );

    await currentUser.save();
    await requestingUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting friend request' });
  }
});

// Reject friend request
router.post('/reject/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the friend request exists
    if (!currentUser.friendRequests.includes(req.params.userId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    // Remove the friend request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.userId
    );

    await currentUser.save();

    res.json({ message: 'Friend request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting friend request' });
  }
});

// Remove friend
router.delete('/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const friendUser = await User.findById(req.params.userId);

    if (!friendUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove each user from the other's friends list
    currentUser.friends = currentUser.friends.filter(
      id => id.toString() !== req.params.userId
    );
    friendUser.friends = friendUser.friends.filter(
      id => id.toString() !== req.user.userId
    );

    await currentUser.save();
    await friendUser.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing friend' });
  }
});

// Get friend recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('friends');
    
    // Get friends of friends
    const friendIds = user.friends.map(friend => friend._id);
    const recommendations = await User.find({
      $and: [
        { _id: { $nin: [...friendIds, user._id] } }, // Exclude current user and their friends
        { friendRequests: { $ne: user._id } } // Exclude users with pending requests
      ]
    })
    .populate({
      path: 'friends',
      match: { _id: { $in: friendIds } } // Only populate mutual friends
    })
    .select('-password')
    .limit(10);

    // Sort by number of mutual friends
    const sortedRecommendations = recommendations
      .map(rec => ({
        ...rec.toObject(),
        mutualFriends: rec.friends.length
      }))
      .sort((a, b) => b.mutualFriends - a.mutualFriends);

    res.json(sortedRecommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

export default router;