const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const userModel = require("../models/User");

router.get("/", requireAuth, (req, res) => {
  res.send(`User with email ${req.user.email} is logged in.`);
});

router.get("/users", async (req, res) => {
  const users = await userModel.find();

  res.send(users);
});

router.get("/token", requireAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
