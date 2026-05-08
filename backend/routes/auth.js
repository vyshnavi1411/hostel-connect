const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initial seeder route to easily setup a test user
router.post('/seed', async (req, res) => {
  try {
    const existingUser = await User.findOne({ registrationNumber: '12345678' });
    if (existingUser) {
      return res.json({ message: 'Test user already exists. Registration Number: 12345678, password: password123' });
    }

    const newUser = new User({
      name: 'Test User',
      registrationNumber: '12345678',
      password: 'password123',
      role: 'student'
    });

    await newUser.save();
    res.json({ message: 'Test user created! Registration Number: 12345678, password: password123' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  console.log('Registration attempt received:', req.body.registrationNumber);
  const { name, registrationNumber, password, role, hostelBlock, roomNumber } = req.body;

  try {
    if (!name || !registrationNumber || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    if (!/^\d{8}$/.test(registrationNumber)) {
      return res.status(400).json({ message: 'Registration number must be exactly 8 digits' });
    }

    const userExists = await User.findOne({ registrationNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      registrationNumber,
      password,
      role,
      hostelBlock,
      roomNumber
    });

    if (user) {
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({
            token,
            user: {
              id: user.id,
              name: user.name,
              registrationNumber: user.registrationNumber,
              role: user.role,
              hostelBlock: user.hostelBlock,
              roomNumber: user.roomNumber
            }
          });
        }
      );
    } else {
      console.log('Registration failed: Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { registrationNumber, password } = req.body;

  try {
    if (!registrationNumber || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing user
    const user = await User.findOne({ registrationNumber });
    if (!user) {
      return res.status(400).json({ message: 'User Does not exist' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            registrationNumber: user.registrationNumber,
            role: user.role,
            hostelBlock: user.hostelBlock,
            roomNumber: user.roomNumber
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
