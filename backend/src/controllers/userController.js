const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const id = await User.create(req.body);
        res.status(201).json({ id, message: "User berhasil dibuat" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};