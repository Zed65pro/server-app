const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const getPost = require("../middlewares/post");
const postSchema = require("../models/Post");
const router = express.Router();

// INC like from a user
router.patch("/likes/:id", requireAuth, getPost, async (req, res) => {
  try {
    let updatedPost = null;
    if (res.post.likes.includes(req.user._id)) {
      updatedPost = await postSchema.findByIdAndUpdate(
        res.post._id,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
    } else if (res.post.dislikes.includes(req.user._id)) {
      updatedPost = await postSchema.findByIdAndUpdate(
        res.post._id,
        {
          $push: { likes: req.user._id },
          $pull: { dislikes: req.user._id },
        },
        { new: true }
      );
    } else {
      updatedPost = await postSchema.findByIdAndUpdate(
        res.post._id,
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
    }
    await updatedPost.save();

    res.send(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// INC dislike from a user
router.patch("/dislikes/:id", requireAuth, getPost, async (req, res) => {
  let updatedPost = null;

  try {
    if (res.post.dislikes.includes(req.user._id)) {
      updatedPost = await postSchema.findByIdAndUpdate(
        res.post._id,
        {
          $pull: { dislikes: req.user._id },
        },
        { new: true }
      );
    } else if (res.post.likes.includes(req.user._id)) {
      updatedPost = await postSchema.findByIdAndUpdate(
        res.post._id,
        {
          $pull: { likes: req.user._id },
          $push: { dislikes: req.user._id },
        },
        { new: true }
      );
    } else {
      updatedPost = await postSchema.findByIdAndUpdate(
        res.post._id,
        {
          $push: { dislikes: req.user._id },
        },
        { new: true }
      );
    }

    await updatedPost.save();
    res.send(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/liked/:id", requireAuth, getPost, (req, res) => {
  const userId = req.params.id;
  try {
    if (!res.post.likes.includes(userId)) {
      return res.send(false);
    }

    res.send(true);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ a single post
router.get("/disliked/:id", requireAuth, getPost, (req, res) => {
  const userId = req.params.id;
  try {
    if (!res.post.dislikes.includes(userId)) {
      return res.send(false);
    }

    res.send(true);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
