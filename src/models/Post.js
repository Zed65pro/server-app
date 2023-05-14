const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    minlength: 3,
  },
  hashtags: {
    type: [String],
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  image: {
    type: String,
    default: "",
  },
  user: {
    type: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
    },
    default: {},
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  dislikesCount: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  this.dislikesCount = this.dislikes.length;
  next();
});

module.exports = mongoose.model("Post", postSchema);
