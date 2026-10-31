const mongoose = require('mongoose');

// ER Diagram Entity: profiles -> vet_profiles
// Attributes: name, license number, specialization, is_verified, ratings
// Relationship: update_by 0..m vaccination_records
const vetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String
  },
  username: {
    type: String,
    unique: true,
    sparse: true
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
  phoneNumber: {
    type: String
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
  specialization: {
    type: String,
    required: true
  },
  specialty: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 5.0
  },
  rating: {
    type: Number,
    default: 5.0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  role: {
    type: String,
    enum: ['veterinarian', 'vet'],
    default: 'veterinarian'
  },
  userRole: {
    type: String,
    default: 'veterinarian'
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

// Sync aliases
vetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.name && !this.fullName) this.fullName = this.name;
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.specialization && !this.specialty) this.specialty = this.specialization;
  if (this.specialty && !this.specialization) this.specialization = this.specialty;
  if (this.ratings && !this.rating) this.rating = this.ratings;
  if (this.rating && !this.ratings) this.ratings = this.rating;
  if (this.isVerified !== undefined && this.approved === undefined) this.approved = this.isVerified;
  next();
});

module.exports = mongoose.model('Vet', vetSchema);
