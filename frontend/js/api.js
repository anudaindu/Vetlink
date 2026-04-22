// VetLink API Service
class VetLinkAPI {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://vetlink-backend.vercel.app/api' 
      : 'http://localhost:5000/api';
    this.token = localStorage.getItem('vetlink_token');
  }

  // Helper method for making API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('vetlink_token', data.token);
    }
    
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('vetlink_token', data.token);
    }
    
    return data;
  }

  async vetLogin(credentials) {
    const data = await this.request('/auth/vet-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('vetlink_token', data.token);
    }
    
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('vetlink_token');
  }

  // User Management
  async getUserProfile() {
    return await this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    return await this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  }

  // Pet Management
  async getPets() {
    return await this.request('/pets');
  }

  async registerPet(petData) {
    return await this.request('/pets', {
      method: 'POST',
      body: JSON.stringify(petData)
    });
  }

  async getPet(petId) {
    return await this.request(`/pets/${petId}`);
  }

  // Veterinarian Management
  async getVets() {
    return await this.request('/vets');
  }

  async getVetProfile() {
    return await this.request('/vets/profile');
  }

  async updateVetSettings(settings) {
    return await this.request('/vets/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    });
  }

  // Booking Management
  async getBookings(query = {}) {
    const params = new URLSearchParams(query);
    return await this.request(`/bookings?${params}`);
  }

  async createBooking(bookingData) {
    return await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }

  async acceptBooking(bookingId) {
    return await this.request(`/bookings/${bookingId}/accept`, {
      method: 'PATCH'
    });
  }

  async rejectBooking(bookingId) {
    return await this.request(`/bookings/${bookingId}/reject`, {
      method: 'PATCH'
    });
  }

  async completeBooking(bookingId, notes) {
    return await this.request(`/bookings/${bookingId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ notes })
    });
  }

  // Vaccination Management
  async addVaccination(vaccinationData) {
    return await this.request('/vaccinations', {
      method: 'POST',
      body: JSON.stringify(vaccinationData)
    });
  }

  // Health Check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Export singleton instance
const api = new VetLinkAPI();
window.VetLinkAPI = VetLinkAPI;
window.api = api;
