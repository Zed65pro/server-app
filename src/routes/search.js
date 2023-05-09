const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const userSchema = require("../models/User");
const postSchema = require("../models/Post");
const router = express.Router();

// Express route for search
router.get("/:query", async (req, res) => {
  const { query } = req.params;
  try {
    // Search for users by username
    const userResults = await userSchema.find({
      username: { $regex: query, $options: "i" },
    });

    // Search for posts by hashtags
    const postResults = await postSchema.find({
      hashtags: { $regex: query, $options: "i" },
    });

    res.json({ users: userResults, posts: postResults });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
