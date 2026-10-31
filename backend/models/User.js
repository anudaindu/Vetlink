const mongoose = require('mongoose');

// ER Diagram Entity: users
// user_id (pk), user_role, username (ak), password_hash, email, is_active, created_at
// Profile (mandatory, or): pet_owner_profiles (phone_number, location)
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    enum: ['pet_owner', 'veterinarian', 'user', 'vet'],
    default: 'pet_owner'
  },
  userRole: {
    type: String,
    enum: ['pet_owner', 'veterinarian', 'user', 'vet'],
    default: 'pet_owner'
  },
  isActive: {
    type: Boolean,
    default: true
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

// Sync aliases and update updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.phone && !this.phoneNumber) this.phoneNumber = this.phone;
  if (this.role && !this.userRole) this.userRole = this.role;
  next();
});

module.exports = mongoose.model('User', userSchema);
