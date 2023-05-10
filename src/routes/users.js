const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const User = require("../models/User");
const router = express.Router();
const upload = require("../storage");

//add user
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
module.exports = router;

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
