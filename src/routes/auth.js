const express = require("express");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new userModel({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token, user: { email, password } });
  } catch (err) {
    // 422: invalid data sent
    res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(422).send("Please provide an email and a password!");

  const user = await userModel.findOne({ email });

  if (!user) return res.status(422).send("Wrong email or password!");

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log(token);
    return res.send({
      token,
      user,
    });
  } catch (err) {
    return res.status(422).send("Wrong email or password!");
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.send({ message: "Successfully signed out!" });
});

router.get("/username/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    res.send(user.username);
  } catch (err) {
    return res.status(422).send("Wrong user Id.");
  }
});

module.exports = router;
