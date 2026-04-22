const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Vet = require('../models/Vet');
const Pet = require('../models/Pet');
const { authMiddleware } = require('../middleware/auth');

// Get all bookings (admin/vet)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, vetId, ownerId } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (vetId) filter.assignedVetId = vetId;
    if (ownerId) filter.ownerId = ownerId;

    const bookings = await Booking.find(filter)
      .populate('petId', 'name type breed')
      .populate('ownerId', 'fullName email phone')
      .populate('assignedVetId', 'fullName clinic phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Create new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      petId,
      visitType,
      date,
      time,
      location,
      notes,
      isEmergency = false
    } = req.body;

    // Validate pet exists and belongs to user
    const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Pet not found or does not belong to you'
      });
    }

    // Check for emergency booking (10 PM - 6 AM)
    const bookingHour = parseInt(time.split(':')[0]);
    const emergencyDetected = bookingHour >= 22 || bookingHour < 6;

    // Calculate pricing
    const baseFee = 2000;
    const transportFee = visitType === 'home' ? 500 : 0;
    const emergencyFee = emergencyDetected ? 1500 : 0;
    const totalCost = baseFee + transportFee + emergencyFee;

    // Find available vets based on criteria
    const availableVets = await Vet.find({
      approved: true,
      status: 'Active',
      [visitType === 'home' ? 'acceptsHomeVisits' : 'acceptsClinicVisits']: true,
      ...(emergencyDetected && { emergencyAvailability: true })
    });

    if (availableVets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No veterinarians available for this booking type'
      });
    }

    // Create booking
    const booking = new Booking({
      petId,
      ownerId: req.user.id,
      ownerName: req.user.fullName,
      ownerPhone: req.user.phone,
      ownerEmail: req.user.email,
      visitType,
      date,
      time,
      location,
      notes,
      isEmergency: emergencyDetected,
      baseFee,
      transportFee,
      emergencyFee,
      totalCost,
      status: 'pending',
      availableVets: availableVets.map(vet => vet._id)
    });

    await booking.save();

    // TODO: Send notifications to available vets
    // This would be implemented with WebSocket or push notifications

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Accept booking (vet only)
router.patch('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking cannot be accepted'
      });
    }

    // Check if vet is available for this booking
    if (!booking.availableVets.includes(req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to accept this booking'
      });
    }

    // Update booking
    booking.status = 'accepted';
    booking.assignedVetId = req.user.id;
    booking.assignedVetName = req.user.fullName;
    booking.assignedVetClinic = req.user.clinic;
    booking.assignedVetPhone = req.user.phone;
    booking.acceptedAt = new Date();

    await booking.save();

    // TODO: Send notification to pet owner
    // This would be implemented with WebSocket or email

    res.status(200).json({
      status: 'success',
      message: 'Booking accepted successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to accept booking',
      error: error.message
    });
  }
});

// Reject booking (vet only)
router.patch('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking cannot be rejected'
      });
    }

    // Check if vet is available for this booking
    if (!booking.availableVets.includes(req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to reject this booking'
      });
    }

    // Remove vet from available vets list
    booking.availableVets = booking.availableVets.filter(
      vetId => vetId.toString() !== req.user.id.toString()
    );

    // If no vets left, mark as rejected
    if (booking.availableVets.length === 0) {
      booking.status = 'rejected';
      booking.rejectedAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking rejected successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject booking',
      error: error.message
    });
  }
});

// Complete booking (vet only)
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if booking is accepted
    if (booking.status !== 'accepted') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking must be accepted before completing'
      });
    }

    // Check if vet is assigned to this booking
    if (booking.assignedVetId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not assigned to this booking'
      });
    }

    // Update booking
    booking.status = 'completed';
    booking.completedAt = new Date();
    booking.notes = req.body.notes || booking.notes;

    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking completed successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to complete booking',
      error: error.message
    });
  }
});

module.exports = router;
