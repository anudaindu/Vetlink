const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { authMiddleware } = require('../middleware/auth');

// Add vaccination record (vet only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'vet') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Veterinarian only.'
      });
    }

    const {
      petId,
      vaccineName,
      dateGiven,
      nextDue,
      batchNumber,
      notes
    } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Pet not found'
      });
    }

    const vaccination = {
      id: Date.now().toString(),
      name: vaccineName,
      date: dateGiven,
      nextDue: nextDue,
      status: 'verified',
      batchNumber: batchNumber,
      vetName: req.user.fullName,
      clinicName: req.user.clinic,
      notes: notes,
      type: 'veterinarian-record'
    };

    pet.vaccinations.push(vaccination);
    await pet.save();

    res.status(201).json({
      status: 'success',
      message: 'Vaccination record added successfully',
      data: vaccination
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add vaccination record',
      error: error.message
    });
  }
});

module.exports = router;
