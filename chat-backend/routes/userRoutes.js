const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findOneAndUpdate(
            { id: req.params.id },
            { status },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
