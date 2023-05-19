// routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// Create a new message
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, content, timestamp } = req.body;
    const message = new Message({ sender, receiver, content });
    await message.save();

    // console.log(message);
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Get messages between two users (pagination)
router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { "sender.userId": senderId, "receiver.userId": receiverId },
        { "sender.userId": receiverId, "receiver.userId": senderId },
      ],
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({
      $or: [
        { "sender.userId": senderId, "receiver.userId": receiverId },
        { "sender.userId": receiverId, "receiver.userId": senderId },
      ],
    });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
