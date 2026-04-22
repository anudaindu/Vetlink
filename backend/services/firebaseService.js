const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// User Service
class UserService {
  static async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userRef = await db.collection('users').add({
      ...userData,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: userRef.id, ...userData };
  }

  static async findUserByEmail(email) {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findUserById(id) {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async updateUser(id, updateData) {
    await db.collection('users').doc(id).update({
      ...updateData,
      updatedAt: new Date()
    });
    const updatedUser = await this.findUserById(id);
    return updatedUser;
  }
}

// Veterinarian Service
class VetService {
  static async createVet(vetData) {
    const hashedPassword = await bcrypt.hash(vetData.password, 10);
    const vetRef = await db.collection('vets').add({
      ...vetData,
      password: hashedPassword,
      role: 'vet',
      approved: false,
      status: 'Active',
      rating: 0,
      acceptsHomeVisits: true,
      acceptsClinicVisits: true,
      emergencyAvailability: false,
      workStart: '08:00',
      workEnd: '20:00',
      baseFee: 2000,
      transportFee: 500,
      emergencyFee: 1500,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: vetRef.id, ...vetData };
  }

  static async findVetByEmail(email) {
    const snapshot = await db.collection('vets').where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findVetById(id) {
    const doc = await db.collection('vets').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async getApprovedVets() {
    const snapshot = await db.collection('vets')
      .where('approved', '==', true)
      .where('status', '==', 'Active')
      .orderBy('rating', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async updateVet(id, updateData) {
    await db.collection('vets').doc(id).update({
      ...updateData,
      updatedAt: new Date()
    });
    const updatedVet = await this.findVetById(id);
    return updatedVet;
  }

  static async findAvailableVets(visitType, isEmergency) {
    let query = db.collection('vets')
      .where('approved', '==', true)
      .where('status', '==', 'Active');
    
    if (visitType === 'home') {
      query = query.where('acceptsHomeVisits', '==', true);
    } else {
      query = query.where('acceptsClinicVisits', '==', true);
    }
    
    if (isEmergency) {
      query = query.where('emergencyAvailability', '==', true);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

// Pet Service
class PetService {
  static async createPet(petData) {
    const petRef = await db.collection('pets').add({
      ...petData,
      vaccinations: [],
      treatments: [],
      reminders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: petRef.id, ...petData };
  }

  static async findPetsByOwner(ownerId) {
    const snapshot = await db.collection('pets')
      .where('owner', '==', ownerId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async findPetById(id) {
    const doc = await db.collection('pets').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async findPetByIdAndOwner(id, ownerId) {
    const doc = await db.collection('pets').doc(id).get();
    if (!doc.exists) return null;
    const pet = { id: doc.id, ...doc.data() };
    return pet.owner === ownerId ? pet : null;
  }

  static async updatePet(id, updateData) {
    await db.collection('pets').doc(id).update({
      ...updateData,
      updatedAt: new Date()
    });
    return await this.findPetById(id);
  }

  static async addVaccination(petId, vaccinationData) {
    const petRef = db.collection('pets').doc(petId);
    await petRef.update({
      vaccinations: admin.firestore.FieldValue.arrayUnion(vaccinationData),
      updatedAt: new Date()
    });
    return await this.findPetById(petId);
  }
}

// Booking Service
class BookingService {
  static async createBooking(bookingData) {
    const bookingRef = await db.collection('bookings').add({
      ...bookingData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: bookingRef.id, ...bookingData };
  }

  static async findBookings(query = {}) {
    let dbQuery = db.collection('bookings');
    
    if (query.status) {
      dbQuery = dbQuery.where('status', '==', query.status);
    }
    if (query.vetId) {
      dbQuery = dbQuery.where('assignedVetId', '==', query.vetId);
    }
    if (query.ownerId) {
      dbQuery = dbQuery.where('ownerId', '==', query.ownerId);
    }
    
    const snapshot = await dbQuery.orderBy('createdAt', 'desc').get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async findBookingById(id) {
    const doc = await db.collection('bookings').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async updateBooking(id, updateData) {
    await db.collection('bookings').doc(id).update({
      ...updateData,
      updatedAt: new Date()
    });
    return await this.findBookingById(id);
  }

  static async acceptBooking(bookingId, vetData) {
    const updateData = {
      status: 'accepted',
      assignedVetId: vetData.id,
      assignedVetName: vetData.fullName,
      assignedVetClinic: vetData.clinic,
      assignedVetPhone: vetData.phone,
      acceptedAt: new Date(),
      updatedAt: new Date()
    };
    
    return await this.updateBooking(bookingId, updateData);
  }

  static async rejectBooking(bookingId, vetId) {
    const booking = await this.findBookingById(bookingId);
    if (!booking) return null;
    
    const availableVets = booking.availableVets.filter(vetId => vetId !== vetId);
    const updateData = {
      availableVets: availableVets,
      updatedAt: new Date()
    };
    
    if (availableVets.length === 0) {
      updateData.status = 'rejected';
      updateData.rejectedAt = new Date();
    }
    
    return await this.updateBooking(bookingId, updateData);
  }

  static async completeBooking(bookingId, notes) {
    const updateData = {
      status: 'completed',
      completedAt: new Date(),
      notes: notes,
      updatedAt: new Date()
    };
    
    return await this.updateBooking(bookingId, updateData);
  }
}

module.exports = {
  UserService,
  VetService,
  PetService,
  BookingService
};
