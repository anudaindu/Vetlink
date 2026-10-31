// ==========================================
// VetLink — Production Domain & UI Type Definitions
// ==========================================

export type UserRole = 'pet_owner' | 'veterinarian' | 'pet-owner' | 'vet' | 'user';

export type Species = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Horse' | 'Reptile' | 'Other';

export type Gender = 'Male' | 'Female' | 'Male (Neutered)' | 'Female (Spayed)';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * ER Entity: users
 * user_id (pk), user_role, username (ak), password_hash, email, is_active, created_at
 */
export interface UserRecord extends BaseEntity {
  user_id: string;
  user_role: UserRole;
  role: UserRole;
  username: string;
  password_hash?: string;
  password?: string;
  email: string;
  is_active: boolean;
  name: string;
  fullName: string;
  phone_number?: string;
  phone?: string;
  location?: string;
  registeredAt?: string;
  // Specific to vet_profiles subtype
  license_number?: string;
  licenseNumber?: string;
  specialization?: string;
  specialty?: string;
  clinic?: string;
  is_verified?: boolean;
  ratings?: number;
  rating?: number;
  settings?: {
    baseFee?: number;
    transportFee?: number;
    emergencyFee?: number;
    acceptClinic?: boolean;
    acceptHome?: boolean;
  };
}

/**
 * ER Entity: vaccination_records
 * date, used_vaccine, updated_by vet_profiles
 */
export interface VaccinationRecord {
  id: string;
  date: string;
  used_vaccine: string;
  vaccine?: string;
  name?: string;
  vetName?: string;
  veterinarian?: string;
  clinicName?: string;
  status: 'Verified' | 'Pending' | 'done';
  nextDue?: string;
  batchNumber?: string;
  notes?: string;
  vetId?: string;
}

/**
 * ER Entity: pets
 * pet_id (pk), species, name, breed, date_of_birth, gender
 * has 1..m vaccination_records
 */
export interface PetRecord extends BaseEntity {
  pet_id: string;
  species: Species;
  type?: string;
  name: string;
  breed: string;
  date_of_birth: string;
  dob?: string;
  gender: Gender;
  owner_id?: string;
  ownerId?: string;
  owner?: string;
  ownerName?: string;
  phone_number?: string;
  phone?: string;
  color?: string;
  microchip?: string;
  image?: string;
  vaccination_records: VaccinationRecord[];
  vaccinations?: VaccinationRecord[];
  reminders?: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
}

/**
 * ER Entity: vet_profiles
 * name, license number, specialization, is_verified, ratings
 */
export interface VetProfile extends BaseEntity {
  user_id: string;
  username: string;
  name: string;
  fullName: string;
  clinic: string;
  location: string;
  phone_number: string;
  phone: string;
  email: string;
  license_number: string;
  licenseNumber?: string;
  specialization: string;
  specialty?: string;
  is_verified: boolean;
  ratings: number;
  rating?: number;
  status: 'Active' | 'Inactive';
  user_role: 'veterinarian';
  role: 'veterinarian';
}

/**
 * Booking Record
 */
export interface BookingRecord extends BaseEntity {
  petId: string;
  petName: string;
  species?: string;
  ownerId: string;
  ownerName: string;
  vetId: string;
  vetName: string;
  service?: string;
  type?: string;
  visitType: 'Clinic Visit' | 'Home Visit';
  date: string;
  time: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

/**
 * UI State & Interaction Types
 */
export type InteractionState = 'idle' | 'hover' | 'active' | 'focused' | 'loading' | 'disabled';

export interface AsyncExecutionOptions<T = unknown> {
  button?: HTMLElement | HTMLButtonElement | null;
  loadingText?: string;
  preventDoubleSubmit?: boolean;
  lockTimeoutMs?: number;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export interface OptimisticMutationOptions<T> {
  key: string;
  getCurrent: () => T;
  mutate: (current: T) => T;
  commit: (optimistic: T) => Promise<boolean | void> | boolean | void;
  rollbackMessage?: string;
  onRollback?: (previous: T) => void;
}

