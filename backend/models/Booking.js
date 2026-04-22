const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerPhone: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  visitType: {
    type: String,
    enum: ['home', 'clinic'],
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  baseFee: {
    type: Number,
    required: true
  },
  transportFee: {
    type: Number,
    default: 0
  },
  emergencyFee: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  availableVets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vet'
  }],
  assignedVetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vet'
  },
  assignedVetName: String,
  assignedVetClinic: String,
  assignedVetPhone: String,
  acceptedAt: Date,
  rejectedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
