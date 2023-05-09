const postSchema = require("../models/Post");

// Middleware function to get a single post by ID
module.exports = async (req, res, next) => {
  try {
    const post = await postSchema.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.post = post;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
