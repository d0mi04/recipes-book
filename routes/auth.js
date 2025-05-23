const express = require('express');
const bcrypt = require('bcryptjs');
const Uzytkownik = require('../models/Uzytkownik');

const router = express.Router();

// tu jest rejestracja uzytkownika:
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if user exists:
        const existingUser = await Uzytkownik.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: '❗ User already exists!'
            });
        }

        // hashowanie hasla, czy coś takiego:
        const salt = await bcrypt.genSalt(10); 
        const passwordHash = await bcrypt.hash(password, salt);

        // tworzenie nowego uzytkownika
        const newUser = new Uzytkownik({
            username,
            email,
            password: passwordHash,
        });

        await newUser.save();
        res.status(201).json({
            message: '✅ User successfully created.',
            username: username,
            email: email,
            password: password,
        });
    } catch (err) {
        res.status(500).json({
            message: '🖥 Server error',
        });
    }
});

// logowanie
router.post('/login', async (req, res) => {
    try {
        console.log('Request body:', req.body); 
        const { email, password } = req.body;

        // check if user exists
        const user = await Uzytkownik.findOne({ email });
        if(!user) {
            return res.status(400).json({
                message: '❗ Invalid email!',
            });
        }

        // password veryfication
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return res.status(400).json({
                message: '❌ Invalid password!',
            });
        }

        res.status(200).json({
            message: '✅ Login successful.',
            userId: user._id,
            username: user.username,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: '🖥 Server error!'
        })
    }
});

module.exports = router;