const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  clinic: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  approved: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['vet'],
    default: 'vet'
  },
  // Availability settings
  acceptsHomeVisits: {
    type: Boolean,
    default: true
  },
  acceptsClinicVisits: {
    type: Boolean,
    default: true
  },
  emergencyAvailability: {
    type: Boolean,
    default: false
  },
  workStart: {
    type: String,
    default: '08:00'
  },
  workEnd: {
    type: String,
    default: '20:00'
  },
  // Pricing
  baseFee: {
    type: Number,
    default: 2000
  },
  transportFee: {
    type: Number,
    default: 500
  },
  emergencyFee: {
    type: Number,
    default: 1500
  },
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
vetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Vet', vetSchema);
