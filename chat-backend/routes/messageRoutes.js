const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

// Get messages between users
router.get('/', async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Send a message
router.post('/', async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;