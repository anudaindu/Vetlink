const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { authMiddleware } = require('../middleware/auth');

// Add vaccination record (vet_profiles update_by vaccination_records)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const role = (req.user.role || '').toLowerCase();
    if (role !== 'vet' && role !== 'veterinarian') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Veterinarian only.'
      });
    }

    const {
      petId,
      usedVaccine,
      vaccineName,
      date,
      dateGiven,
      nextDue,
      batchNumber,
      notes
    } = req.body;

    const chosenVaccine = usedVaccine || vaccineName;
    const chosenDate = date || dateGiven || new Date().toISOString().split('T')[0];

    const pet = await Pet.findOne({ $or: [{ _id: petId }, { petId: petId }] });
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Pet not found'
      });
    }

    const vaccination = {
      id: 'vax_' + Date.now().toString(),
      usedVaccine: chosenVaccine,
      name: chosenVaccine,
      date: chosenDate,
      nextDue: nextDue,
      status: 'Verified',
      batchNumber: batchNumber,
      updatedByVet: req.user.id || req.user._id,
      vetName: req.user.name || req.user.fullName,
      clinicName: req.user.clinic || 'Companion Animal Clinic',
      notes: notes,
      type: 'veterinarian-record'
    };

    if (!pet.vaccinationRecords) pet.vaccinationRecords = [];
    if (!pet.vaccinations) pet.vaccinations = [];

    pet.vaccinationRecords.push(vaccination);
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
