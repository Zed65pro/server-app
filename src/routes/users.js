const express = require("express");
const User = require("../models/User");
const router = express.Router();

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
