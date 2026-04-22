const express = require('express');
const router = express.Router();
const { BookingService, VetService, PetService } = require('../services/firebaseService');
const { authMiddleware } = require('../middleware/auth');

// Get all bookings (admin/vet)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, vetId, ownerId } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (vetId) query.vetId = vetId;
    if (ownerId) query.ownerId = ownerId;

    const bookings = await BookingService.findBookings(query);

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
    const pet = await PetService.findPetByIdAndOwner(petId, req.user.id);
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
    const availableVets = await VetService.findAvailableVets(visitType, emergencyDetected);

    if (availableVets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No veterinarians available for this booking type'
      });
    }

    // Create booking
    const booking = await BookingService.createBooking({
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
      availableVets: availableVets.map(vet => vet.id)
    });

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
    const booking = await BookingService.findBookingById(req.params.id);
    
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
    const updatedBooking = await BookingService.acceptBooking(req.params.id, req.user);

    // TODO: Send notification to pet owner
    // This would be implemented with WebSocket or email

    res.status(200).json({
      status: 'success',
      message: 'Booking accepted successfully',
      data: updatedBooking
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
    const booking = await BookingService.findBookingById(req.params.id);
    
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

    // Update booking
    const updatedBooking = await BookingService.rejectBooking(req.params.id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Booking rejected successfully',
      data: updatedBooking
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
    const booking = await BookingService.findBookingById(req.params.id);
    
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
    if (booking.assignedVetId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not assigned to this booking'
      });
    }

    // Update booking
    const updatedBooking = await BookingService.completeBooking(req.params.id, req.body.notes);

    res.status(200).json({
      status: 'success',
      message: 'Booking completed successfully',
      data: updatedBooking
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
