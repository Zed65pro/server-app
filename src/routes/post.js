const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
const postSchema = require("../models/Post");
const userSchema = require("../models/User");
const getPost = require("../middlewares/post");
const mongoose = require("mongoose");

// CREATE a new post
router.post("/", requireAuth, async (req, res) => {
  try {
    const { body, hashtags, userId } = req.body;
    const post = new postSchema({
      body,
      hashtags,
      userId: mongoose.Types.ObjectId(userId),
    });

    const user = await userSchema.findByIdAndUpdate(userId, {
      $push: { posts: post._id },
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all posts
router.get("/", async (req, res) => {
  try {
    const posts = await postSchema.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ all posts
router.get("/user/:id", async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id).populate("posts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const postIds = user.posts; // Assuming user.posts contains an array of post IDs
    const posts = await postSchema.find({ _id: { $in: postIds } });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ a single post
router.get("/:id", getPost, (req, res) => {
  res.json(res.post);
});

// UPDATE a post
router.patch("/:id", requireAuth, getPost, async (req, res) => {
  if (req.body.body != null) {
    res.post.body = req.body.body;
  }
  if (req.body.hashtags != null) {
    res.post.hashtags = req.body.hashtags;
  }
  try {
    const updatedPost = await res.postSchema.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a post
router.delete("/:id", requireAuth, getPost, async (req, res) => {
  try {
    await userSchema.updateOne(
      { _id: req.user._id },
      {
        $pull: { posts: res.post._id },
      }
    );
    await req.user.save();
    await res.post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
