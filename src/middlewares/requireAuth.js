const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../models/User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).send("You must be logged in to continue.");

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(401).send({ error: err.message });

    const { userId } = payload;

    const user = await userModel.findById(userId);

    req.user = user;
    next();
  });
};
