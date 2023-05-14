const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
const postSchema = require("../models/Post");
const userSchema = require("../models/User");
const Comment = require("../models/Comment");

// Route to add comments to a post
router.post("/:postId/comments", requireAuth, async (req, res) => {
  try {
    const postId = req.params.postId;

    const { body, profilePicture, username } = req.body;
    const commentData = {
      body: body,
      user: {
        profilePicture,
        username,
        _id: req.user._id,
      }, // Assuming you have the user ID available in req.body.userId
      post: postId,
    };

    // Create a new comment using the comment data
    const newComment = new Comment(commentData);

    // Find the post and add the new comment to its comments array
    const post = await postSchema.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    if (!post) {
      // If the post is not found, return an error
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the user and add the new comment to their comments array
    const user = await userSchema.findByIdAndUpdate(
      commentData.user,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    if (!user) {
      // If the user is not found, return an error
      return res.status(404).json({ error: "User not found" });
    }

    // Save the new comment to the database
    await newComment.save();

    // Send a response indicating the comment was added successfully
    res
      .status(200)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the comment" });
  }
});

// Route to get all comments for a post
router.get("/:postId/comments", requireAuth, async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await postSchema.findById(postId).populate("comments");

    if (!post) {
      // If the post is not found, return an error
      return res.status(404).json({ error: "Post not found" });
    }

    // Extract the comments from the post object
    const comments = post.comments;

    // Send the comments as the response
    res.status(200).json(comments);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error retrieving comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the comments" });
  }
});

module.exports = router;
