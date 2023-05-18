const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const User = require("../models/User");
const router = express.Router();

// Add friend to user's friends list
router.post("/friends", requireAuth, async (req, res) => {
  try {
    const user = req.user;

    // Extract friend details from request body
    const { friendId, friendEmail, friendUsername } = req.body;

    // Find friend by ID, email, or username
    let friend;
    if (friendId) {
      friend = await User.findById(friendId);
    } else if (friendEmail) {
      friend = await User.findOne({ email: friendEmail });
    } else if (friendUsername) {
      friend = await User.findOne({ username: friendUsername });
    }

    if (!friend) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user._id.equals(friend._id)) {
      return res.status(400).send({ error: "Cannot add yourself as a friend" });
    }

    const existingFriend = user.friends.find(
      (f) => f.friendId.toString() === friend._id.toString()
    );
    if (existingFriend) {
      return res.status(400).send({ error: "Friend already exists" });
    }
    // Add friend to user's friends list
    user.friends.push({
      friendId: friend._id,
      friendName: friend.username,
      friendEmail: friend.email,
      friendProfilePicture: friend.profilePicture,
    });

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// DELETE /users/:userId/friends/:friendId
router.delete("/friends/:friendId", requireAuth, async (req, res) => {
  const { friendId } = req.params;

  try {
    const user = req.user;

    // Check if user exists
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if friend exists in user's friend list
    const friendIndex = user.friends.findIndex(
      (friend) => friend.friendId.toString() === friendId
    );

    if (friendIndex === -1) {
      return res.status(404).send({ error: "Friend not found" });
    }

    // Remove friend from friend list
    user.friends.splice(friendIndex, 1);

    // Save updated user document
    await user.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

// GET /users/:userId/friends
router.get("/:userId/friends", requireAuth, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "friends.friendId",
      "username email"
    );

    // Check if user exists
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(user.friends);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
