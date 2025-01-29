import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all friends
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('friends', 'name email');
    res.json(user.friends || []);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Error fetching friends' });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('friendRequests', 'name email');
    res.json(user.friendRequests || []);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Error fetching friend requests' });
  }
});

router.get('/recommendations', auth, async (req, res) => {
  try {

    const currentUser = await User.findById(req.user.userId).populate('friends');
    const currentUserFriendIds = currentUser.friends.map(friend => friend._id.toString());

  
    const potentialFriends = await User.find({
      $and: [
        { _id: { $ne: req.user.userId } }, // Exclude current user
        { _id: { $nin: currentUserFriendIds } }, // Exclude existing friends
        { friendRequests: { $ne: req.user.userId } } // Exclude users with pending requests
      ]
    }).populate('friends');

    
    const recommendationsWithMutualFriends = potentialFriends.map(user => {
      const userFriendIds = user.friends.map(friend => friend._id.toString());
      const mutualFriends = currentUserFriendIds.filter(id => userFriendIds.includes(id));
      

      const mutualFriendDetails = currentUser.friends
        .filter(friend => userFriendIds.includes(friend._id.toString()))
        .map(friend => ({
          _id: friend._id,
          name: friend.name,
          email: friend.email
        }));

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        mutualFriendsCount: mutualFriends.length,
        mutualFriends: mutualFriendDetails
      };
    });

    // Sort by number of mutual friends (highest to lowest)
    const sortedRecommendations = recommendationsWithMutualFriends
      .sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount)
      .slice(0, 10); // Limit to top 10 recommendations

    res.json(sortedRecommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
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
    console.error('Error sending friend request:', error);
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

    // Remove friend request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.userId
    );

    // Add to friends list for both users
    currentUser.friends.push(req.params.userId);
    requestingUser.friends.push(req.user.userId);

    await currentUser.save();
    await requestingUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Error accepting friend request' });
  }
});

// Reject friend request
router.post('/reject/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    
    // Remove friend request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.userId
    );

    await currentUser.save();
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
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

    // Remove from friends list for both users
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
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Error removing friend' });
  }
});

export default router;