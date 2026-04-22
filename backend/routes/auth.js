const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { UserService, VetService } = require('../services/firebaseService');

// User registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, location, password } = req.body;

    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await UserService.createUser({
      fullName,
      email,
      phone,
      location,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'vetlink-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'vetlink-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
});

// Vet login
router.post('/vet-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find vet
    const vet = await VetService.findVetByEmail(email);
    if (!vet) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if vet is approved
    if (!vet.approved) {
      return res.status(401).json({
        status: 'error',
        message: 'Veterinarian account not approved'
      });
    }

    // Check password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, vet.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: vet.id, email: vet.email, role: 'vet' },
      process.env.JWT_SECRET || 'vetlink-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      vet: {
        id: vet.id,
        fullName: vet.fullName,
        email: vet.email,
        clinic: vet.clinic,
        phone: vet.phone,
        location: vet.location,
        role: 'vet'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
});

module.exports = router;
