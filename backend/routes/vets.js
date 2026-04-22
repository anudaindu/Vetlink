const express = require('express');
const router = express.Router();
const Vet = require('../models/Vet');
const { authMiddleware } = require('../middleware/auth');

// Get all approved vets (public)
router.get('/', async (req, res) => {
  try {
    const vets = await Vet.find({ approved: true, status: 'Active' })
      .select('-password')
      .sort({ rating: -1 });

    res.status(200).json({
      status: 'success',
      results: vets.length,
      data: vets
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch veterinarians',
      error: error.message
    });
  }
});

// Get vet profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'vet') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Veterinarian only.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update vet settings
router.patch('/settings', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'vet') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Veterinarian only.'
      });
    }

    const {
      acceptsHomeVisits,
      acceptsClinicVisits,
      emergencyAvailability,
      workStart,
      workEnd,
      baseFee,
      transportFee,
      emergencyFee
    } = req.body;

    const vet = await Vet.findByIdAndUpdate(
      req.user.id,
      {
        acceptsHomeVisits,
        acceptsClinicVisits,
        emergencyAvailability,
        workStart,
        workEnd,
        baseFee,
        transportFee,
        emergencyFee
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully',
      data: vet
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update settings',
      error: error.message
    });
  }
});

module.exports = router;
