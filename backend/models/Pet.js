const mongoose = require('mongoose');

// ER Diagram Entity: pets
// pet_id (pk), species, name, breed, date_of_birth, gender
// Relationship: pet_owner_profiles (1) has (1..m) pets
// Relationship: pets (1) has (1) vaccination_records
const petSchema = new mongoose.Schema({
  petId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Horse', 'Reptile', 'Other'],
    default: 'Dog'
  },
  type: {
    type: String
  },
  breed: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  dob: {
    type: String
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Male (Neutered)', 'Female (Spayed)'],
    default: 'Male'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String
  },
  color: {
    type: String
  },
  microchip: {
    type: String
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  vaccinationRecords: [{
    id: String,
    date: {
      type: String,
      required: true
    },
    usedVaccine: {
      type: String,
      required: true
    },
    name: String,
    nextDue: String,
    status: {
      type: String,
      default: 'Verified'
    },
    batchNumber: String,
    updatedByVet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vet'
    },
    vetName: String,
    clinicName: String,
    notes: String
  }],
  vaccinations: [{
    id: String,
    name: String,
    usedVaccine: String,
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

// Update the updatedAt field on save & sync aliases
petSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.species && !this.type) this.type = this.species;
  if (this.type && !this.species) this.species = this.type;
  if (this.dateOfBirth && !this.dob) this.dob = this.dateOfBirth;
  if (this.dob && !this.dateOfBirth) this.dateOfBirth = this.dob;
  if (this.vaccinationRecords && (!this.vaccinations || this.vaccinations.length === 0)) {
    this.vaccinations = this.vaccinationRecords.map(v => ({
      ...v,
      name: v.usedVaccine || v.name
    }));
  }
  next();
});

module.exports = mongoose.model('Pet', petSchema);
