const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
    minlength: 3,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
  },
  password: {
    type: "string",
    required: true,
    minlength: 5,
  },
  posts: {
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  friends: {
    type: [
      {
        friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        friendName: {
          type: String,
          required: true,
        },
        friendEmail: {
          type: String,
          required: true,
          validate: [validateEmail, "Please fill a valid email address"],
        },
      },
    ],
    default: [],
  },
});

// BCRYPT STUFF for password using Schema.pre which executes before a schema object is saved to the database
// and a custom function in the schema to execute whenever we want to compare hashed pass and original password
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (providedPassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(providedPassword, user.password, (err, isMatch) => {
      if (err) return reject(err);

      if (!isMatch) return reject(false);

      resolve(true);
    });
  });
};

module.exports = mongoose.model("User", userSchema);
