const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { authMiddleware } = require('../middleware/auth');

// Get user's pets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: pets.length,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pets',
      error: error.message
    });
  }
});

// Register new pet
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      dob,
      phone,
      color,
      microchip
    } = req.body;

    const pet = new Pet({
      name,
      type,
      breed,
      dob,
      owner: req.user.id,
      phone,
      color,
      microchip
    });

    await pet.save();

    res.status(201).json({
      status: 'success',
      message: 'Pet registered successfully',
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to register pet',
      error: error.message
    });
  }
});

// Get pet by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Pet not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pet',
      error: error.message
    });
  }
});

module.exports = router;
