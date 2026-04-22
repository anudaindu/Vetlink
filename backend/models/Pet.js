const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  microchip: {
    type: String
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=200&h=200'
  },
  vaccinations: [{
    id: String,
    name: String,
    date: String,
    nextDue: String,
    status: String,
    batchNumber: String,
    vetName: String,
    clinicName: String,
    notes: String
  }],
  treatments: [{
    id: String,
    diagnosis: String,
    treatment: String,
    medicines: String,
    followUp: String,
    notes: String,
    vetName: String,
    clinicName: String,
    timestamp: String
  }],
  reminders: [{
    id: String,
    title: String,
    date: String,
    type: String
  }],
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
petSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Pet', petSchema);
