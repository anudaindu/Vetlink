import { vaccineTypes, mockVets, cities } from './data.js';
import { Input, SectionHeader, Card, Button } from './components.js';

// Navigation Constants
const petOwnerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '#dashboard' },
    { id: 'my-pets', label: 'My Pets', icon: 'dog', href: '#my-pets' },
    { id: 'register-pet', label: 'Register Pet', icon: 'plus-circle', href: '#register-pet' },
    { id: 'find-vet', label: 'Find Vet', icon: 'search', href: '#find-vet' },
    { id: 'book-vet', label: 'Book Vet', icon: 'calendar-plus', href: '#book-vet' },
    { id: 'account', label: 'Account', icon: 'user', href: '#account' },
    { id: 'logout', label: 'Logout', icon: 'log-out', href: '#logout', className: 'text-danger' }
];

const vetNav = [
    { id: 'vet-dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '#vet-dashboard' },
    { id: 'incoming-requests', label: 'Incoming Requests', icon: 'bell', href: '#incoming-requests' },
    { id: 'my-patients', label: 'My Patients', icon: 'users', href: '#my-patients' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar', href: '#schedule' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '#settings' },
    { id: 'profile', label: 'Profile', icon: 'user-cog', href: '#profile' },
    { id: 'logout', label: 'Logout', icon: 'log-out', href: '#logout', className: 'text-danger' }
];

const DashboardLayout = (content, activeId, role = 'pet-owner') => {
    const navItems = role === 'pet-owner' ? petOwnerNav : vetNav;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = currentUser.fullName || currentUser.name || 'User';

    return `
        <div class="dashboard-container">
            <aside class="dashboard-sidebar">
                <div class="sidebar-header">
                    <div class="logo-container">
                        <img src="assets/logo.png" alt="VetLink Logo" class="logo-img" style="height: 40px;">
                    </div>
                </div>
                <nav class="sidebar-nav">
                    ${navItems.map(item => `
                        <a href="${item.href}" class="nav-item ${activeId === item.id ? 'active' : ''} ${item.className || ''}">
                            <i data-lucide="${item.icon}"></i>
                            <span>${item.id === 'account' ? `${userName}` : item.label}</span>
                        </a>
                    `).join('')}
                </nav>
            </aside>
            <main class="dashboard-main">
                <header class="dashboard-top-nav">
                    <div class="mobile-menu-toggle">
                        <i data-lucide="menu"></i>
                    </div>
                    <div class="top-nav-right">
                        <div class="user-info">
                            <span>${userName}</span>
                            <div class="avatar-sm">${userName.charAt(0)}</div>
                        </div>
                    </div>
                </header>
                <div class="dashboard-content fade-in">
                    ${content}
                </div>
            </main>
        </div>
    `;
};


export const RoleSelectionPage = () => {
    return `
        <div class="container page-container">
            <div class="hero-content text-center py-60">
                <h1>Welcome to VetLink</h1>
                <p class="text-muted mb-40">Please choose your role to continue</p>
                
                <div class="role-selection-grid">
                    <div class="role-card" onclick="selectRole('pet-owner')">
                        <div class="role-icon">
                            <i data-lucide="users"></i>
                        </div>
                        <h2>Pet Owner</h2>
                        <p>Track your pet's vaccinations, health records, and book appointments.</p>
                        <button class="btn btn-dark w-full mt-20">Continue as Owner</button>
                    </div>
                    
                    <div class="role-card" onclick="selectRole('veterinarian')">
                        <div class="role-icon vet-icon">
                            <i data-lucide="stethoscope"></i>
                        </div>
                        <h2>Veterinarian</h2>
                        <p>Manage patients, verify vaccinations, and handle booking requests.</p>
                        <button class="btn btn-outline w-full mt-20">Continue as Vet</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Booking System Components

export const HomePage = () => `
    <section class="hero">
        <div class="container hero-container">
            <div class="hero-content">
                <h1>Digital Vaccination Book for Your Pet</h1>
                <p>Track your pet’s health, vaccinations, and reminders in one place. No more lost paper records.</p>
                <div class="hero-actions">
                    <a href="#register" class="btn btn-primary">
                        <i data-lucide="plus-circle"></i>
                        Register Your Pet
                    </a>
                    <a href="#vets" class="btn btn-outline">
                        <i data-lucide="search"></i>
                        Find a Vet
                    </a>
                </div>
            </div>
            <div class="hero-image">
                <!-- SVG or Placeholder Image -->
                <div class="hero-img-placeholder">
                    <i data-lucide="dog" stroke-width="1"></i>
                </div>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            ${SectionHeader('Smart Features', 'Everything you need to manage your pet’s health effortlessly.')}
            <div class="feature-grid">
                <div class="card feature-card">
                    <div class="feature-icon"><i data-lucide="syringe"></i></div>
                    <h3>Vaccination Tracking</h3>
                    <p>Maintain a complete digital history of all shots and medical procedures.</p>
                </div>
                <div class="card feature-card">
                    <div class="feature-icon"><i data-lucide="bell"></i></div>
                    <h3>Smart Reminders</h3>
                    <p>Get notified when your pet is due for their next booster or checkup.</p>
                </div>
                <div class="card feature-card">
                    <div class="feature-icon"><i data-lucide="award"></i></div>
                    <h3>Verified Vets</h3>
                    <p>Access a network of trusted veterinary professionals near you.</p>
                </div>
            </div>
        </div>
    </section>
`;

export const UserRegistrationPage = () => `
    <div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <h2>Create Your VetLink Account</h2>
                <p class="text-muted">Join Sri Lanka's digital pet health platform.</p>
                <form id="user-registration-form" class="mt-20">
                    <div class="form-grid">
                        ${Input({ label: 'Full Name', id: 'fullName', name: 'fullName', placeholder: 'e.g. John Doe', required: true })}
                        ${Input({ label: 'Email Address', id: 'email', name: 'email', type: 'email', placeholder: 'john@example.com', required: true })}
                        ${Input({ label: 'Phone Number', id: 'phone', name: 'phone', placeholder: '07X XXX XXXX', required: true })}
                        ${Input({ 
                            label: 'Location (City)', 
                            id: 'location', 
                            name: 'location', 
                            options: cities, 
                            placeholder: 'Select your city', 
                            required: true 
                        })}
                        ${Input({ label: 'Password', id: 'password', name: 'password', type: 'password', placeholder: 'Create a strong password', required: true })}
                        ${Input({ label: 'Confirm Password', id: 'confirmPassword', name: 'confirmPassword', type: 'password', placeholder: 'Confirm your password', required: true })}
                    </div>
                    <div class="form-actions mt-20">
                        <button type="submit" class="btn btn-primary w-full">Create Account</button>
                    </div>
                    <div class="auth-divider">
                        <span>OR</span>
                    </div>
                    <p class="text-center text-sm">
                        Already have an account? <a href="#login" class="text-primary">Sign In</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
`;

export const PetOwnerDashboardPage = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return DashboardLayout(`
        <div class="dashboard-welcome">
            <div>
                <h1>Welcome back, ${currentUser.fullName || 'Pet Owner'}! 👋</h1>
                <p class="text-muted">Manage your pets and their health records.</p>
            </div>
            <div class="flex gap-10">
                <a href="#register-pet" class="btn btn-outline">
                    <i data-lucide="plus"></i> Add New Pet
                </a>
                <a href="#book-vet" class="btn btn-primary">
                    <i data-lucide="calendar-plus"></i> Book a Vet
                </a>
            </div>
        </div>

        <div class="grid-2-1 mt-30">
            <div class="card">
                <div class="card-header-flex">
                    <h3>My Pets & Recent History</h3>
                    <a href="#my-pets" class="text-sm">View All</a>
                </div>
                <div id="dashboard-pets-history" class="activity-list mt-20">
                    <div class="text-center py-20 text-muted">
                        <i data-lucide="loader-2" class="spin"></i>
                        <p>Loading pet records...</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header-flex">
                    <h3>Quick Access</h3>
                    <i data-lucide="zap"></i>
                </div>
                <div class="quick-access-grid mt-20">
                    <a href="#find-vet" class="quick-access-item">
                        <div class="icon bg-primary-light text-primary"><i data-lucide="search"></i></div>
                        <span>Find New Vet</span>
                    </a>
                    <a href="#book-vet" class="quick-access-item">
                        <div class="icon bg-success-light text-success"><i data-lucide="calendar-check"></i></div>
                        <span>Re-book Last Vet</span>
                    </a>
                    <a href="#account" class="quick-access-item">
                        <div class="icon bg-warning-light text-warning"><i data-lucide="user-plus"></i></div>
                        <span>Switch Account</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="card mt-30">
            <div class="card-header-flex">
                <h3>Last Vaccination Details</h3>
                <i data-lucide="shield-check"></i>
            </div>
            <div id="last-vaccination-summary" class="mt-20">
                <div class="text-center py-20 text-muted">Select a pet to see vaccination details.</div>
            </div>
        </div>
    `, 'dashboard', 'pet-owner');
};

export const PetDetailsPage = () => {
    const pet = JSON.parse(localStorage.getItem('currentPetView') || '{}');
    return DashboardLayout(`
        <div class="page-header">
            <div class="flex items-center gap-15">
                <a href="#my-pets" class="btn-icon"><i data-lucide="arrow-left"></i></a>
                <div>
                    <h1>${pet.name || 'Pet Details'}</h1>
                    <p class="text-muted">${pet.type} • ${pet.breed}</p>
                </div>
            </div>
            <div class="flex gap-10">
                <button class="btn btn-outline btn-sm" onclick="location.hash='#book-vet'">Book Appointment</button>
            </div>
        </div>

        <div class="grid-3 mt-30">
            <div class="card stat-card">
                <div class="stat-label">Age</div>
                <div class="stat-value">${calculateAge(pet.dob)}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-label">Last Vaccination</div>
                <div class="stat-value text-primary">${pet.lastVaccination || 'None'}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-label">Pet ID</div>
                <div class="stat-value text-muted">${pet.id || 'N/A'}</div>
            </div>
        </div>

        <div class="card mt-30">
            <div class="card-header-flex">
                <h3>Virtual Vaccination Book</h3>
                <button class="btn btn-primary btn-sm"><i data-lucide="download"></i> Download PDF</button>
            </div>
            <div class="table-container mt-20">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Vaccine</th>
                            <th>Date</th>
                            <th>Veterinarian</th>
                            <th>Status</th>
                            <th>Next Due</th>
                        </tr>
                    </thead>
                    <tbody id="vaccination-history-list">
                        ${pet.vaccinations?.length ? pet.vaccinations.map(v => `
                            <tr>
                                <td><strong>${v.name}</strong></td>
                                <td>${v.date}</td>
                                <td>${v.vetName}</td>
                                <td><span class="status-badge approved">Verified</span></td>
                                <td>${v.nextDue || '-'}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="5" class="text-center py-40 text-muted">No vaccination records found for this pet.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `, 'my-pets', 'pet-owner');
};

const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age + ' years';
};

export const MyPetsPage = () => {
    return DashboardLayout(`
        <div class="page-header">
            <div>
                <h1>My Pets</h1>
                <p class="text-muted">Manage your pets and their medical records.</p>
            </div>
            <a href="#register-pet" class="btn btn-primary">
                <i data-lucide="plus"></i> Register New Pet
            </a>
        </div>

        <div class="pets-grid mt-30" id="user-pets-list">
            <div class="text-center py-60 col-span-full">
                <i data-lucide="loader-2" class="spin icon-lg text-muted"></i>
                <p class="mt-10">Loading your pets...</p>
            </div>
        </div>
    `, 'my-pets', 'pet-owner');
};

export const AccountPage = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return DashboardLayout(`
        <div class="page-header">
            <h1>My Account</h1>
            <p class="text-muted">Profile and account settings.</p>
        </div>

        <div class="max-w-600 mt-30">
            <div class="card">
                <div class="profile-header text-center mb-30">
                    <div class="avatar-lg bg-primary-light text-primary mx-auto">
                        ${user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h2 class="mt-15">${user.fullName || 'User Name'}</h2>
                    <p class="text-muted">${user.email}</p>
                </div>

                <form id="profile-edit-form">
                    <div class="form-grid">
                        ${Input({ label: 'Full Name', id: 'profileName', name: 'fullName', value: user.fullName, required: true })}
                        ${Input({ label: 'Email Address', id: 'profileEmail', name: 'email', type: 'email', value: user.email, required: true })}
                        ${Input({ label: 'Phone Number', id: 'profilePhone', name: 'phone', value: user.phone || '' })}
                        ${Input({ label: 'Location', id: 'profileLocation', name: 'location', value: user.location || '', options: cities })}
                    </div>
                    <div class="form-actions mt-30">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>

            <div class="card mt-20">
                <div class="card-header-flex">
                    <h3>Linked Accounts</h3>
                    <i data-lucide="users"></i>
                </div>
                <p class="text-sm text-muted mb-20">Add or switch between multiple VetLink accounts.</p>
                <div class="linked-accounts-list">
                    <div class="history-item">
                        <div class="history-info">
                            <div class="pet-avatar-sm">${user.fullName?.charAt(0) || 'U'}</div>
                            <div>
                                <strong>${user.fullName} (Current)</strong>
                                <p class="text-xs text-muted">${user.email}</p>
                            </div>
                        </div>
                        <span class="status-badge approved">Active</span>
                    </div>
                </div>
                <button class="btn btn-outline w-full mt-20" onclick="alert('Account switching feature coming soon!')">
                    <i data-lucide="plus"></i> Add New Account
                </button>
            </div>

            <div class="card mt-20 border-danger">
                <h3>Danger Zone</h3>
                <p class="text-sm text-muted">Deleting your account will permanently remove all pet data.</p>
                <div class="mt-20">
                    <button class="btn btn-outline text-danger">Delete Account</button>
                </div>
            </div>
        </div>
    `, 'account', 'pet-owner');
};

export const LoginPage = () => `
    <div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <div class="text-center mb-30">
                    <div class="logo-container justify-center mb-10">
                        <img src="assets/logo.png" alt="VetLink Logo" class="logo-img">
                    </div>
                    <p class="text-muted">Welcome back! Sign in to your account.</p>
                </div>
                <form id="login-form">
                    ${Input({ label: 'Email Address', id: 'loginEmail', name: 'email', type: 'email', placeholder: 'john@example.com', required: true })}
                    ${Input({ label: 'Password', id: 'loginPassword', name: 'password', type: 'password', placeholder: 'Enter your password', required: true })}
                    <button type="submit" class="btn btn-primary w-full mt-20">Sign In</button>
                </form>
                <div class="auth-divider">
                    <span>OR</span>
                </div>
                <p class="text-center text-sm">
                    Don't have an account? <a href="#user-register" class="text-primary">Create Account</a>
                </p>
            </div>
        </div>
    </div>
`;

export const RegisterPetPage = () => {
    return DashboardLayout(`
        <div class="page-header">
            <h1>Register New Pet</h1>
            <p class="text-muted">Add a new pet to your digital health book.</p>
        </div>

        <div class="max-w-700 mt-30">
            <div class="card">
                <form id="register-pet-form">
                    <div class="form-grid">
                        ${Input({ label: 'Pet Name', id: 'petName', name: 'petName', placeholder: 'e.g. Buddy', required: true })}
                        ${Input({ 
                            label: 'Type', 
                            id: 'petType', 
                            name: 'petType', 
                            options: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'], 
                            placeholder: 'Select type', 
                            required: true 
                        })}
                        ${Input({ label: 'Breed', id: 'breed', name: 'breed', placeholder: 'e.g. Golden Retriever', required: true })}
                        ${Input({ label: 'Date of Birth', id: 'dob', name: 'dob', type: 'date', required: true })}
                        ${Input({ label: 'Color / Markings', id: 'color', name: 'color', placeholder: 'e.g. Brown with white chest' })}
                        ${Input({ label: 'Microchip Number (Optional)', id: 'microchip', name: 'microchip', placeholder: '15-digit number' })}
                    </div>
                    <div class="form-actions mt-30">
                        <button type="submit" class="btn btn-primary">Register Pet</button>
                        <a href="#my-pets" class="btn btn-outline">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    `, 'register-pet', 'pet-owner');
};

export const FindVetPage = () => {
    return DashboardLayout(`
        <div class="page-header">
            <div>
                <h1>Find a Veterinary Surgeon</h1>
                <p class="text-muted">Search for vets or re-book a previous session.</p>
            </div>
        </div>

        <div class="grid-2-1 mt-30">
            <div>
                <div class="card">
                    <div class="card-header-flex">
                        <h3>Find New Vet</h3>
                        <div class="search-box-sm">
                            <i data-lucide="search"></i>
                            <input type="text" id="vet-search-input" placeholder="Search by name or clinic...">
                        </div>
                    </div>
                    <div id="vet-results-grid" class="vets-list-container mt-20">
                        <div class="text-center py-40 text-muted">Start typing to find veterinarians...</div>
                    </div>
                </div>
            </div>

            <div>
                <div class="card">
                    <div class="card-header-flex">
                        <h3>Direct Book</h3>
                        <i data-lucide="history"></i>
                    </div>
                    <p class="text-xs text-muted mb-15">Quickly book a vet you've visited before.</p>
                    <div id="previous-vets-list" class="activity-list">
                        <div class="text-center py-20 text-muted">No previous bookings found.</div>
                    </div>
                </div>
            </div>
        </div>
    `, 'find-vet', 'pet-owner');
};

export const BookVetPage = () => {
    const selectedVet = JSON.parse(localStorage.getItem('selectedVet') || 'null');
    const userPets = JSON.parse(localStorage.getItem('pets') || '[]');

    return DashboardLayout(`
        <div class="page-header">
            <h1>Book an Appointment</h1>
            <p class="text-muted">Schedule a visit for your pet.</p>
        </div>

        <div class="grid-2-1 mt-30">
            <div class="card">
                <form id="booking-form">
                    <div class="form-section">
                        <h4>1. Select Your Pet</h4>
                        <div class="form-group mt-15">
                            <select id="booking-pet-id" name="petId" class="form-select" required>
                                <option value="" disabled selected>Choose a pet</option>
                                ${userPets.map(pet => `<option value="${pet.id}">${pet.name} (${pet.petType})</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-section mt-30">
                        <h4>2. Select Veterinarian</h4>
                        <div class="form-group mt-15">
                            <select id="booking-vet-id" name="vetId" class="form-select" required>
                                <option value="" disabled ${!selectedVet ? 'selected' : ''}>Choose a vet</option>
                                ${mockVets.map(vet => `<option value="${vet.id}" ${selectedVet?.id === vet.id ? 'selected' : ''}>${vet.name} (${vet.clinic})</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-section mt-30">
                        <h4>3. Visit Type</h4>
                        <div class="visit-type-grid mt-15">
                            <label class="visit-type-item">
                                <input type="radio" name="visitType" value="Clinic" checked>
                                <div class="visit-type-card">
                                    <i data-lucide="building-2"></i>
                                    <span>Clinic Visit</span>
                                    <p class="text-xs text-muted">Standard Fee</p>
                                </div>
                            </label>
                            <label class="visit-type-item">
                                <input type="radio" name="visitType" value="Home">
                                <div class="visit-type-card">
                                    <i data-lucide="home"></i>
                                    <span>Home Visit</span>
                                    <p class="text-xs text-muted">+ Transport Fee</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="form-section mt-30">
                        <h4>4. Date & Time</h4>
                        <div class="form-grid mt-15">
                            ${Input({ label: 'Date', id: 'booking-date', name: 'date', type: 'date', required: true })}
                            ${Input({ label: 'Time', id: 'booking-time', name: 'time', type: 'time', required: true })}
                        </div>
                    </div>

                    <div class="form-section mt-30">
                        <h4>5. Additional Notes</h4>
                        <div class="form-group mt-15">
                            <textarea id="booking-notes" name="notes" class="form-textarea" placeholder="Describe the reason for visit (e.g. annual vaccination, fever, etc.)"></textarea>
                        </div>
                    </div>

                    <div class="form-actions mt-30">
                        <button type="submit" class="btn btn-primary w-full">Submit Booking Request</button>
                    </div>
                </form>
            </div>

            <aside>
                <div class="card summary-card">
                    <h4>Booking Summary</h4>
                    <div id="booking-summary-content" class="mt-20">
                        <p class="text-muted text-sm">Fill in the form to see your booking details and estimated cost.</p>
                    </div>
                </div>
            </aside>
        </div>
    `, 'book-vet', 'pet-owner');
};

export const VetDashboardPage = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return DashboardLayout(`
        <div class="dashboard-welcome">
            <div>
                <h1>Dr. ${user.name || 'Veterinarian'}, Dashboard</h1>
                <p class="text-muted">Manage your practice and patients effectively.</p>
            </div>
            <div class="search-pet-id-container">
                <input type="text" id="patient-search-id" placeholder="Search by Pet ID (e.g. PET-123)">
                <button class="btn btn-primary btn-sm" onclick="searchPatient()">Search</button>
            </div>
        </div>

        <div class="grid-4 mt-30">
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="stat-value" id="vet-pending-requests">0</span>
                    <span class="stat-label">Pending Requests</span>
                </div>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="stat-value" id="vet-today-appointments">0</span>
                    <span class="stat-label">Today's Appointments</span>
                </div>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="stat-value" id="vet-total-patients">0</span>
                    <span class="stat-label">My Patients</span>
                </div>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="stat-value">LKR <span id="vet-earnings">0</span></span>
                    <span class="stat-label">Estimated Earnings Today</span>
                </div>
            </div>
        </div>

        <div class="grid-2 mt-30">
            <div class="card">
                <div class="card-header-flex">
                    <h3>Recently Approved</h3>
                    <a href="#incoming-requests" class="text-sm">View All</a>
                </div>
                <div id="recent-approved-list" class="activity-list mt-15">
                    <div class="text-center py-20 text-muted">No recently approved requests.</div>
                </div>
            </div>
            <div class="card">
                <div class="card-header-flex">
                    <h3>Past Activities</h3>
                    <i data-lucide="history"></i>
                </div>
                <div id="past-activity-list" class="activity-list mt-15">
                    <div class="text-center py-20 text-muted">No past activities recorded.</div>
                </div>
            </div>
        </div>
    `, 'vet-dashboard', 'veterinarian');
};

export const IncomingRequestsPage = () => {
    return DashboardLayout(`
        <div class="page-header">
            <div>
                <h1>Incoming Requests</h1>
                <p class="text-muted">Review and manage booking requests from pet owners.</p>
            </div>
        </div>

        <div class="card mt-30">
            <div class="tabs">
                <button class="tab-btn active" data-tab="pending">Pending</button>
                <button class="tab-btn" data-tab="approved">Approved</button>
                <button class="tab-btn" data-tab="past">Past / Rejected</button>
            </div>
            <div class="tab-content mt-20" id="requests-list-container">
                <div class="text-center py-60">
                    <i data-lucide="loader-2" class="spin icon-lg text-muted"></i>
                    <p class="mt-10">Fetching requests...</p>
                </div>
            </div>
        </div>
    `, 'incoming-requests', 'veterinarian');
};

export const MyPatientsPage = () => {
    return DashboardLayout(`
        <div class="page-header">
            <h1>My Patients</h1>
            <p class="text-muted">A list of all pets assigned to your care.</p>
        </div>

        <div class="search-section mt-30">
            <div class="card search-card">
                <div class="search-bar-container">
                    <i data-lucide="search"></i>
                    <input type="text" id="patient-search-list" placeholder="Search patients by name or ID...">
                </div>
            </div>
        </div>

        <div class="patients-grid mt-30" id="patients-list">
            <div class="text-center py-60">
                <i data-lucide="loader-2" class="spin icon-lg text-muted"></i>
                <p class="mt-10">Loading patients...</p>
            </div>
        </div>
    `, 'my-patients', 'veterinarian');
};

export const SchedulePage = () => {
    return DashboardLayout(`
        <div class="page-header">
            <h1>My Schedule</h1>
            <p class="text-muted">Your upcoming medical appointments and activities.</p>
        </div>

        <div class="schedule-calendar-container mt-30 card">
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button class="btn btn-icon"><i data-lucide="chevron-left"></i></button>
                    <h3>October 2024</h3>
                    <button class="btn btn-icon"><i data-lucide="chevron-right"></i></button>
                </div>
                <div class="calendar-view-toggle">
                    <button class="btn-sm btn-outline active">Month</button>
                    <button class="btn-sm btn-outline">Week</button>
                    <button class="btn-sm btn-outline">Day</button>
                </div>
            </div>
            <div class="calendar-grid mt-20" id="calendar-view">
                <!-- Simple calendar UI -->
                <div class="calendar-days">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div class="calendar-body">
                    <!-- Days will go here -->
                </div>
            </div>
        </div>

        <div class="upcoming-slots mt-30">
            <div class="card">
                <h3>Upcoming Appointments</h3>
                <div id="upcoming-appointments-list" class="mt-15">
                    <div class="text-center py-20 text-muted">No appointments scheduled for today.</div>
                </div>
            </div>
        </div>
    `, 'schedule', 'veterinarian');
};

export const VetSettingsPage = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return DashboardLayout(`
        <div class="page-header">
            <h1>Settings</h1>
            <p class="text-muted">Manage your practice preferences and fees.</p>
        </div>

        <div class="max-w-800 mt-30">
            <div class="card">
                <form id="vet-settings-form-new">
                    <div class="form-section">
                        <h4>Consultation & Service Fees</h4>
                        <div class="form-grid mt-15">
                            ${Input({ label: 'Base Consultation Fee (LKR)', id: 'set-baseFee', name: 'baseFee', type: 'number', value: user.baseFee || '2000' })}
                            ${Input({ label: 'Home Visit Transport Fee (LKR)', id: 'set-transportFee', name: 'transportFee', type: 'number', value: user.transportFee || '500' })}
                            ${Input({ label: 'Emergency Fee (LKR)', id: 'set-emergencyFee', name: 'emergencyFee', type: 'number', value: user.emergencyFee || '1500' })}
                        </div>
                    </div>

                    <div class="form-section mt-30">
                        <h4>Availability Preferences</h4>
                        <div class="form-grid mt-15">
                            <label class="checkbox-label">
                                <input type="checkbox" name="acceptsHome" ${user.acceptsHomeVisits ? 'checked' : ''}>
                                <span class="checkmark"></span>
                                Accept Home Visits
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="acceptsClinic" ${user.acceptsClinicVisits !== false ? 'checked' : ''}>
                                <span class="checkmark"></span>
                                Accept Clinic Visits
                            </label>
                        </div>
                    </div>

                    <div class="form-actions mt-30">
                        <button type="submit" class="btn btn-primary">Save Settings</button>
                    </div>
                </form>
            </div>
        </div>
    `, 'settings', 'veterinarian');
};

export const VetProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return DashboardLayout(`
        <div class="page-header">
            <h1>Vet Profile</h1>
            <p class="text-muted">Your public professional profile information.</p>
        </div>

        <div class="max-w-600 mt-30">
            <div class="card">
                <div class="profile-header text-center mb-30">
                    <div class="avatar-lg bg-primary text-white mx-auto">
                        <i data-lucide="user-cog" class="icon-lg"></i>
                    </div>
                    <h2 class="mt-15">Dr. ${user.name || 'Veterinarian'}</h2>
                    <p class="text-muted">${user.email}</p>
                    <div class="badge badge-primary mt-10">Verified Veterinarian</div>
                </div>

                <div class="profile-details-list">
                    <div class="detail-item">
                        <span class="detail-label">Full Name</span>
                        <span class="detail-value">Dr. ${user.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Clinic Name</span>
                        <span class="detail-value">${user.clinic || 'Not Specified'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Contact Number</span>
                        <span class="detail-value">${user.phone || 'Not Specified'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">SLVC Reg Number</span>
                        <span class="detail-value">${user.slvcReg || 'VER-55421'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Location</span>
                        <span class="detail-value">${user.location || 'Colombo'}</span>
                    </div>
                </div>

                <div class="mt-30">
                    <button class="btn btn-outline w-full">Edit Profile Information</button>
                </div>
            </div>
        </div>
    `, 'profile', 'veterinarian');
};

export const AdminAddVetPage = () => AdminLayout(`
    <div class="max-w-700">
        <div class="card">
            <div class="flex items-center gap-10 mb-20">
                <a href="#admin-vets" class="text-primary"><i data-lucide="arrow-left"></i></a>
                <h3 class="m-0">Register New Veterinary Surgeon</h3>
            </div>
            <form id="add-vet-form">
                <div class="form-grid">
                    ${Input({ label: 'Full Name', id: 'vetName', name: 'name', placeholder: 'Dr. Jane Doe', required: true })}
                    ${Input({ label: 'Clinic Name', id: 'clinicName', name: 'clinic', placeholder: 'Central Pet Hospital', required: true })}
                    ${Input({ 
                        label: 'Location (City)', 
                        id: 'vetLocation', 
                        name: 'location', 
                        options: cities, 
                        placeholder: 'Select city', 
                        required: true 
                    })}
                    ${Input({ label: 'Phone Number', id: 'vetPhone', name: 'phone', placeholder: '07X XXX XXXX', required: true })}
                    ${Input({ label: 'Email Address', id: 'vetEmail', name: 'email', type: 'email', placeholder: 'vet@example.com' })}
                </div>
                <div class="form-actions mt-30">
                    <button type="submit" class="btn btn-primary">Save Veterinary Surgeon</button>
                    <a href="#admin-vets" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>
    </div>
`, 'vets');
