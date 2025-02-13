const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user (without password) and token
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      user: userObject,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user (without password) and token
    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      user: userObject,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

module.exports = router;