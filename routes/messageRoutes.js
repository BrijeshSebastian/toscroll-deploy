const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/history/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId },
        { receiverId: req.params.userId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;