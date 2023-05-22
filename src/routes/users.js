const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

// const upload = require("../storage");
const User = require("../models/User");
const Post = require("../models/Post");

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) res.status(404).send("User not found.");

    res.send(user);
  } catch (err) {
    return res.status(422).send("Wrong user Id.");
  }
});

// Assuming you have an endpoint to handle profile picture upload
router.post("/profile-picture", requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { image } = req.body;

    if (image) {
      // Save the profile picture path or URL to the user's profilePicture field
      user.profilePicture = image;
      await user.save();
    }

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// PATCH route for updating user profile
router.patch("/edit", requireAuth, async (req, res) => {
  const { image, username, email, dateOfBirth } = req.body;

  try {
    const user = req.user;

    // Update the user object with the provided data
    if (dateOfBirth) {
      const parsedDateOfBirth = new Date(dateOfBirth);
      if (!isNaN(parsedDateOfBirth)) {
        user.dateOfBirth = parsedDateOfBirth;
      }
    }
    if (image) {
      user.profilePicture = image;
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }

    // Save the updated user object
    await user.save();

    // Update all posts with the new user data
    const posts = await Post.find({ "user.userId": user._id });

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      post.user.username = user.username;
      post.user.profilePicture = user.profilePicture;
      await post.save();
    }

    res
      .status(200)
      .json({ message: "User and posts updated successfully", user });
  } catch (error) {
    console.error("Error updating user and posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
