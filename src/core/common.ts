// ============================================================================
// VetLink — Typed Core State & Logic Module
// ============================================================================

import {
  UserRecord,
  PetRecord,
  VetProfile,
  BookingRecord,
  VaccinationRecord,
  Species,
  Gender,
  UserRole
} from '../types';
import { UIEngine } from './ui-engine';

export class VetLinkApp {
  public static readonly roles: Array<{ value: UserRole; label: string }> = [
    { value: 'pet_owner', label: 'Pet Owner' },
    { value: 'veterinarian', label: 'Veterinarian' }
  ];

  public static readonly species: Species[] = [
    'Dog',
    'Cat',
    'Bird',
    'Rabbit',
    'Horse',
    'Reptile',
    'Other'
  ];

  public static readonly genders: Gender[] = [
    'Male',
    'Female',
    'Male (Neutered)',
    'Female (Spayed)'
  ];

  public static readonly breedsBySpecies: Record<Species, string[]> = {
    'Dog': [
      'Golden Retriever', 'German Shepherd', 'Labrador Retriever', 'Bulldog',
      'Beagle', 'Poodle', 'Rottweiler', 'Boxer', 'Siberian Husky', 'Dachshund',
      'Pug', 'Shih Tzu', 'Doberman Pinscher', 'Chihuahua', 'Local / Mixed Breed', 'Other'
    ],
    'Cat': [
      'Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll',
      'Bengal', 'Sphynx', 'Russian Blue', 'Domestic Short Hair (Local)', 'Other'
    ],
    'Bird': [
      'Budgerigar / Parakeet', 'Cockatiel', 'Lovebird', 'African Grey Parrot',
      'Canary', 'Cockatoo', 'Macaw', 'Finch', 'Amazon Parrot', 'Other'
    ],
    'Rabbit': [
      'Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'Angora', 'Other'
    ],
    'Horse': [
      'Arabian', 'Thoroughbred', 'Quarter Horse', 'Warmblood', 'Pony', 'Other'
    ],
    'Reptile': [
      'Bearded Dragon', 'Leopard Gecko', 'Red-Eared Slider Turtle', 'Ball Python', 'Chameleon', 'Other'
    ],
    'Other': [
      'Mixed Breed', 'Exotic Pet', 'Farm Animal', 'Other'
    ]
  };

  public static readonly specializations: string[] = [
    'General Practice',
    'Small Animal Surgery',
    'Veterinary Dermatology',
    'Internal Medicine',
    'Dental & Oral Health',
    'Exotic Animals & Avian',
    'Emergency & Critical Care',
    'Feline Specialist',
    'Cardiology',
    'Ophthalmology',
    'Orthopedic Surgery'
  ];

  public static readonly vaccineTypes: string[] = [
    'Rabies Vaccine',
    'DHPP / 5-in-1 (Distemper, Hepatitis, Parvo, Parainfluenza)',
    'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)',
    'FeLV (Feline Leukemia Virus)',
    'Leptospirosis Vaccine',
    'Bordetella (Kennel Cough)',
    'Canine Parvovirus Vaccine',
    'Deworming & Parasite Control',
    'Avian Polyomavirus Vaccine',
    'Tetanus Toxoid Vaccine',
    'Other Vaccine'
  ];

  public static readonly cities: string[] = [
    'Colombo', 'Kandy', 'Gampaha', 'Galle', 'Negombo', 'Jaffna',
    'Matara', 'Kurunegala', 'Rajagiriya', 'Dehiwala', 'Battaramulla',
    'Pannipitiya', 'Nuwara Eliya', 'Anuradhapura', 'Trincomalee', 'Ratnapura'
  ];

  // ---- Mock Data Matching ER Diagram ----
  public static readonly mockVets: VetProfile[] = [
    {
      id: 'vet1',
      user_id: 'vet1',
      username: 'dr.nirmal',
      name: 'Dr. Nirmal Silva',
      fullName: 'Dr. Nirmal Silva',
      clinic: 'Pet Care Vets Colombo',
      location: 'Colombo',
      phone_number: '0112 555 123',
      phone: '0112 555 123',
      email: 'nirmal.silva@vetlink.lk',
      license_number: 'SLVC-4401',
      specialization: 'Small Animal Surgery',
      is_verified: true,
      ratings: 4.8,
      status: 'Active',
      user_role: 'veterinarian',
      role: 'veterinarian'
    },
    {
      id: 'vet2',
      user_id: 'vet2',
      username: 'dr.priyantha',
      name: 'Dr. Priyantha Banda',
      fullName: 'Dr. Priyantha Banda',
      clinic: 'Kandy Animal Hospital',
      location: 'Kandy',
      phone_number: '0812 222 456',
      phone: '0812 222 456',
      email: 'priyantha.b@vetlink.lk',
      license_number: 'SLVC-3890',
      specialization: 'Emergency & Critical Care',
      is_verified: true,
      ratings: 4.6,
      status: 'Active',
      user_role: 'veterinarian',
      role: 'veterinarian'
    },
    {
      id: 'vet3',
      user_id: 'vet3',
      username: 'dr.sarath',
      name: 'Dr. Sarath Perera',
      fullName: 'Dr. Sarath Perera',
      clinic: 'Negombo Pet Clinic',
      location: 'Negombo',
      phone_number: '0312 888 777',
      phone: '0312 888 777',
      email: 'sarath.p@vetlink.lk',
      license_number: 'SLVC-5120',
      specialization: 'Dental & Oral Health',
      is_verified: true,
      ratings: 4.5,
      status: 'Active',
      user_role: 'veterinarian',
      role: 'veterinarian'
    },
    {
      id: 'vet4',
      user_id: 'vet4',
      username: 'dr.anjali',
      name: 'Dr. Anjali Rose',
      fullName: 'Dr. Anjali Rose',
      clinic: 'Vets for Pets - Rajagiriya',
      location: 'Rajagiriya',
      phone_number: '0112 333 999',
      phone: '0112 333 999',
      email: 'anjali.rose@vetlink.lk',
      license_number: 'SLVC-6234',
      specialization: 'Feline Specialist',
      is_verified: true,
      ratings: 4.9,
      status: 'Active',
      user_role: 'veterinarian',
      role: 'veterinarian'
    }
  ];

  public static readonly mockPets: PetRecord[] = [
    {
      id: 'PET-101',
      pet_id: 'PET-101',
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      date_of_birth: '2022-05-15',
      gender: 'Male',
      owner: 'Anuda H',
      ownerName: 'Anuda H',
      owner_id: '',
      ownerId: '',
      phone_number: '077 123 4567',
      color: 'Golden',
      microchip: '985112345678901',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200',
      vaccination_records: [
        {
          id: 'v1',
          date: '2023-10-10',
          used_vaccine: 'Rabies Vaccine',
          nextDue: '2024-10-10',
          status: 'Verified',
          vetName: 'Dr. Nirmal Silva',
          clinicName: 'Pet Care Vets Colombo'
        },
        {
          id: 'v2',
          date: '2023-08-15',
          used_vaccine: 'DHPP / 5-in-1 (Distemper, Hepatitis, Parvo, Parainfluenza)',
          nextDue: '2024-08-15',
          status: 'Verified',
          vetName: 'Dr. Nirmal Silva',
          clinicName: 'Pet Care Vets Colombo'
        }
      ]
    },
    {
      id: 'PET-102',
      pet_id: 'PET-102',
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      date_of_birth: '2022-10-01',
      gender: 'Female',
      owner: 'Anuda H',
      ownerName: 'Anuda H',
      owner_id: '',
      ownerId: '',
      phone_number: '0771234567',
      color: 'White',
      microchip: '985112345678902',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200',
      vaccination_records: [
        {
          id: 'v4',
          date: '2023-11-05',
          used_vaccine: 'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)',
          nextDue: '2024-11-05',
          status: 'Verified',
          vetName: 'Dr. Anjali Rose',
          clinicName: 'Vets for Pets - Rajagiriya'
        }
      ]
    }
  ];

  // ---- Auth Management ----
  public static getCurrentUser(): UserRecord | null {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? (JSON.parse(raw) as UserRecord) : null;
    } catch {
      return null;
    }
  }

  public static isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return Boolean(user && (user.id || user.user_id));
  }

  public static normalizeRole(role?: string): UserRole {
    if (!role) return 'pet_owner';
    const r = role.toLowerCase();
    if (r === 'pet-owner' || r === 'pet_owner') return 'pet_owner';
    if (r === 'veterinarian' || r === 'vet') return 'veterinarian';
    return 'pet_owner';
  }

  public static requireAuth(redirectTo = 'login.html'): boolean {
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  public static requireRole(targetRole: UserRole): boolean {
    const user = this.getCurrentUser();
    if (!user || (!user.role && !user.user_role)) {
      window.location.href = 'role-selection.html';
      return false;
    }
    const current = this.normalizeRole(user.role || user.user_role);
    const target = this.normalizeRole(targetRole);

    if (current !== target) {
      window.location.href = current === 'veterinarian' ? 'vet-dashboard.html' : 'dashboard.html';
      return false;
    }
    return true;
  }

  public static logout(): void {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    }
  }

  // ---- Safe Data Persistence Layer ----
  public static getPets(): PetRecord[] {
    try {
      const raw = JSON.parse(localStorage.getItem('pets') || '[]') as PetRecord[];
      return raw.map(p => ({
        ...p,
        id: p.pet_id || p.id,
        pet_id: p.pet_id || p.id,
        species: p.species || (p.type as Species) || 'Dog',
        type: p.species || (p.type as Species) || 'Dog',
        date_of_birth: p.date_of_birth || p.dob || '2022-01-01',
        dob: p.date_of_birth || p.dob || '2022-01-01',
        gender: p.gender || 'Male',
        vaccination_records: (p.vaccination_records || p.vaccinations || []).map(v => ({
          ...v,
          used_vaccine: v.used_vaccine || v.vaccine || v.name || 'Vaccine',
          status: v.status || 'Verified'
        }))
      }));
    } catch {
      return [];
    }
  }

  public static savePets(pets: PetRecord[]): void {
    localStorage.setItem('pets', JSON.stringify(pets));
  }

  public static getUsers(): UserRecord[] {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]') as UserRecord[];
    } catch {
      return [];
    }
  }

  public static saveUsers(users: UserRecord[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public static getBookings(): BookingRecord[] {
    try {
      return JSON.parse(localStorage.getItem('bookings') || '[]') as BookingRecord[];
    } catch {
      return [];
    }
  }

  public static saveBookings(bookings: BookingRecord[]): void {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  public static getVets(): VetProfile[] {
    const users = this.getUsers();
    const vetUsers = users.filter(u => this.normalizeRole(u.user_role || u.role) === 'veterinarian');
    const result: VetProfile[] = [...this.mockVets];

    vetUsers.forEach(vu => {
      if (!result.some(v => v.id === vu.id || v.email === vu.email)) {
        result.push({
          id: vu.id || vu.user_id,
          user_id: vu.user_id || vu.id,
          username: vu.username || 'dr.vet',
          name: vu.fullName || vu.name,
          fullName: vu.fullName || vu.name,
          clinic: vu.clinic || 'Companion Pet Hospital',
          location: vu.location || 'Colombo',
          phone_number: vu.phone_number || vu.phone || '0112 555 123',
          phone: vu.phone_number || vu.phone || '0112 555 123',
          email: vu.email,
          license_number: vu.license_number || vu.licenseNumber || 'SLVC-PENDING',
          specialization: vu.specialization || vu.specialty || 'General Practice',
          is_verified: vu.is_verified ?? true,
          ratings: vu.ratings || vu.rating || 5.0,
          status: 'Active',
          user_role: 'veterinarian',
          role: 'veterinarian'
        });
      }
    });

    return result;
  }

  // ---- Safe Vaccination Insertion (Optimistic / Anti-Glitch) ----
  public static addVaccinationRecord(
    petId: string,
    record: Omit<VaccinationRecord, 'id'> & { id?: string }
  ): VaccinationRecord | null {
    const pets = this.getPets();
    const petIdx = pets.findIndex(p => p.pet_id === petId || p.id === petId);
    if (petIdx === -1) return null;

    const newRecord: VaccinationRecord = {
      id: record.id || `vax_${Date.now()}`,
      date: record.date || new Date().toISOString().split('T')[0],
      used_vaccine: record.used_vaccine,
      vaccine: record.used_vaccine,
      name: record.used_vaccine,
      vetName: record.vetName || 'Dr. Nirmal Silva',
      veterinarian: record.vetName || 'Dr. Nirmal Silva',
      clinicName: record.clinicName || 'Vet Clinic',
      status: record.status || 'Verified',
      nextDue: record.nextDue || ''
    };

    if (!pets[petIdx].vaccination_records) pets[petIdx].vaccination_records = [];
    pets[petIdx].vaccination_records.push(newRecord);

    this.savePets(pets);
    return newRecord;
  }

  // ---- Dropdown Builders ----
  public static populateDropdown(
    selectEl: HTMLSelectElement | null,
    options: Array<string | { value: string; label: string }>,
    selectedValue?: string,
    placeholder?: string
  ): void {
    if (!selectEl) return;
    selectEl.innerHTML = '';

    if (placeholder) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = placeholder;
      selectEl.appendChild(opt);
    }

    options.forEach(item => {
      const opt = document.createElement('option');
      if (typeof item === 'object') {
        opt.value = item.value;
        opt.textContent = item.label;
        if (item.value === selectedValue) opt.selected = true;
      } else {
        opt.value = item;
        opt.textContent = item;
        if (item === selectedValue) opt.selected = true;
      }
      selectEl.appendChild(opt);
    });
  }

  public static populateBreeds(
    species: Species,
    breedSelectEl: HTMLSelectElement | null,
    selectedBreed?: string
  ): void {
    if (!breedSelectEl) return;
    const list = this.breedsBySpecies[species] || this.breedsBySpecies['Other'];
    this.populateDropdown(breedSelectEl, list, selectedBreed, 'Select Breed');
  }

  // ---- Age Calculator ----
  public static calculateAge(dob?: string): string {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return 'N/A';

    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }

    if (years < 1) {
      const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
      if (months <= 0) return 'Under 1 month';
      return `${months} month${months === 1 ? '' : 's'}`;
    }

    return `${years} year${years === 1 ? '' : 's'}`;
  }

  public static getParam(name: string): string | null {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get(name);
  }

  public static initMockData(): void {
    if (!localStorage.getItem('pets') || this.getPets().length === 0) {
      this.savePets(this.mockPets);
    }
  }
}

// Attach to window for global runtime access across legacy & modern scripts
if (typeof window !== 'undefined') {
  (window as unknown as { VetLink: typeof VetLinkApp; UIEngine: typeof UIEngine }).VetLink = VetLinkApp;
  (window as unknown as { VetLink: typeof VetLinkApp; UIEngine: typeof UIEngine }).UIEngine = UIEngine;
}

