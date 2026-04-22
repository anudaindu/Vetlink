// Fixed version without ES6 modules - working version

// Data
const mockPets = [
    {
        id: 'PET-101',
        name: 'Max',
        type: 'Dog',
        breed: 'Golden Retriever',
        dob: '2022-05-15',
        owner: 'Anuda H',
        phone: '077 123 4567',
        color: 'Golden',
        microchip: '985112345678901',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200',
        vaccinations: [
            { id: '1', name: 'Rabies', date: '2023-10-10', nextDue: '2024-10-10', status: 'done', batchNumber: 'RB-9921', vetName: 'Dr. Silva', clinicName: 'Central Vet', notes: 'Annual Booster' },
            { id: '2', name: 'DHPP', date: '2023-08-15', nextDue: '2024-08-15', status: 'done', batchNumber: 'DH-1102', vetName: 'Dr. Silva', clinicName: 'Central Vet', notes: 'Ready for next year' }
        ],
        reminders: [
            { id: '1', title: 'Rabies Booster', date: '2024-10-10', type: 'Vaccination' },
            { id: '2', title: 'Flea Treatment', date: '2024-04-20', type: 'Medicine' }
        ]
    },
    {
        id: '2',
        name: 'Luna',
        type: 'Cat',
        breed: 'Persian',
        dob: '2022-10-01',
        owner: 'Anuda H',
        phone: '0771234567',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200',
        vaccinations: [
            { id: 'v4', name: 'FVRCP', date: '2023-11-05', nextDue: '2024-11-05', status: 'done' }
        ],
        reminders: [
            { id: 'r3', title: 'Flea Treatment', date: '2024-04-25', type: 'Medication' }
        ]
    }
];

const mockVets = [
    {
        id: 'vet1',
        name: 'Dr. H.H.A.S. Piyasiri',
        clinic: 'PetVet Clinic',
        location: 'Homagama',
        phone: '0112 777 888',
        email: 'piyasiri@petvet.lk',
        password: 'vet789', // Demo password
        licenseNumber: 'LIC-2023-005',
        specialty: 'General Practice, Vaccinations, Surgery',
        rating: 4.9,
        status: 'Active',
        approved: true,
        role: 'veterinarian'
    },
    {
        id: 'vet2',
        name: 'Dr. Nirmal Silva',
        clinic: 'Pet Care Vets Colombo',
        location: 'Colombo',
        phone: '0112 555 123',
        email: 'info@petcare.lk',
        password: 'vet123', // Demo password
        licenseNumber: 'LIC-2023-001',
        specialty: 'General Practice, Surgery',
        rating: 4.8,
        status: 'Active',
        approved: true,
        role: 'veterinarian'
    },
    {
        id: 'vet3',
        name: 'Dr. Priyantha Banda',
        clinic: 'Kandy Animal Hospital',
        location: 'Kandy',
        phone: '0812 222 456',
        email: 'kandyvet@gmail.com',
        password: 'vet456', // Demo password
        licenseNumber: 'LIC-2023-002',
        specialty: 'Emergency, Vaccinations',
        rating: 4.6,
        status: 'Active',
        approved: true,
        role: 'veterinarian'
    },
    {
        id: 'vet4',
        name: 'Dr. Sarath Perera',
        clinic: 'Negombo Pet Clinic',
        location: 'Negombo',
        phone: '0312 888 777',
        email: 'sarath.p@vetlink.lk',
        password: 'vet789', // Demo password
        licenseNumber: 'LIC-2023-003',
        specialty: 'Dental, Grooming',
        rating: 4.5,
        status: 'Active',
        approved: true,
        role: 'veterinarian'
    },
    {
        id: 'vet5',
        name: 'Dr. Anjali Rose',
        clinic: 'Vets for Pets - Rajagiriya',
        location: 'Rajagiriya',
        phone: '0112 333 999',
        email: 'anjali@vetsforpets.lk',
        password: 'vet012', // Demo password
        licenseNumber: 'LIC-2023-004',
        specialty: 'Cat Specialist, Lab Services',
        rating: 4.9,
        status: 'Active',
        approved: true,
        role: 'veterinarian'
    }
];

const vaccineTypes = [
    'Rabies',
    'DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)',
    'Leptospirosis',
    'Bordetella (Kennel Cough)',
    'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
    'FeLV (Feline Leukemia)'
];

const cities = [
    'Colombo',
    'Kandy',
    'Gampaha',
    'Galle',
    'Negombo',
    'Jaffna',
    'Matara',
    'Kurunegala',
    'Rajagiriya',
    'Dehiwala',
    'Battaramulla',
    'Pannipitiya'
];

// Components
const Input = ({ label, id, name, type = 'text', placeholder = '', value = '', required = false, options = null }) => {
    const inputHtml = options 
        ? `<select id="${id}" name="${name}" class="form-select" ${required ? 'required' : ''}>
                <option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>
                ${options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>`
        : `<input id="${id}" name="${name}" type="${type}" class="form-input" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''}>`;

    return `<div class="form-group">
            <label for="${id}">${label}${required ? ' *' : ''}</label>
            ${inputHtml}
        </div>`;
};

const SectionHeader = (title, subtitle) => {
    return `<div class="section-header">
            <h2>${title}</h2>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>`;
};

// Pages
const RoleSelectionPage = () => {
    return `<section class="hero">
        <div class="container hero-container">
            <div class="hero-content text-center">
                <h1>Welcome to VetLink</h1>
                <p>Choose your role to access the right features for you</p>
                <div class="role-selection-grid">
                    <div class="role-card pet-owner" onclick="selectRole('pet-owner')">
                        <div class="role-icon">
                            <i data-lucide="users"></i>
                        </div>
                        <h2>Pet Owner</h2>
                        <p>Manage your pet's health records, vaccinations, and appointments</p>
                        <div class="role-features">
                            <div class="feature-item">
                                <i data-lucide="check"></i>
                                <span>Digital vaccination book</span>
                            </div>
                            <div class="feature-item">
                                <i data-lucide="check"></i>
                                <span>Health reminders</span>
                            </div>
                            <div class="feature-item">
                                <i data-lucide="check"></i>
                                <span>Find trusted veterinarians</span>
                            </div>
                        </div>
                        <button class="btn btn-outline">
                            <i data-lucide="arrow-right"></i>
                            Continue as Pet Owner
                        </button>
                    </div>
                    
                    <div class="role-card veterinarian" onclick="selectRole('veterinarian')">
                        <div class="role-icon vet-icon">
                            <i data-lucide="stethoscope"></i>
                        </div>
                        <h2>Veterinarian</h2>
                        <p>Professional portal for licensed veterinary practitioners</p>
                        <div class="role-features">
                            <div class="feature-item">
                                <i data-lucide="check"></i>
                                <span>Add verified vaccination records</span>
                            </div>
                            <div class="feature-item">
                                <i data-lucide="check"></i>
                                <span>Digital treatment recommendations</span>
                            </div>
                            <div class="feature-item">
                                <i data-lucide="check"></i>
                                <span>Professional dashboard</span>
                            </div>
                        </div>
                        <button class="btn btn-primary">
                            <i data-lucide="shield-check"></i>
                            Access Vet Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
};

const HomePage = () => {
    return `<section class="hero">
        <div class="container hero-container">
            <div class="hero-content">
                <h1>Digital Vaccination Book for Your Pet</h1>
                <p>Track your pet's health, vaccinations, and reminders in one place. No more lost paper records.</p>
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
                <div class="hero-img-placeholder">
                    <i data-lucide="dog" stroke-width="1"></i>
                </div>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            ${SectionHeader('Smart Features', 'Everything you need to manage your pet\'s health effortlessly.')}
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
    </section>`;
};

const UserRegistrationPage = () => {
    return `<div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <h2>Create Your VetLink Account</h2>
                <p class="text-muted">Join Sri Lanka's digital pet health platform.</p>
                <form id="user-registration-form" class="mt-20">
                    <div class="form-grid">
                        ${Input({ label: 'Full Name', id: 'fullName', name: 'fullName', placeholder: 'e.g. John Doe', required: true })}
                        ${Input({ label: 'Email Address', id: 'email', name: 'email', type: 'email', placeholder: 'john@example.com', required: true })}
                        ${Input({ label: 'Phone Number', id: 'phone', name: 'phone', placeholder: '07X XXX XXXX', required: true })}
                        ${Input({ label: 'Location (City)', id: 'location', name: 'location', options: cities, placeholder: 'Select your city', required: true })}
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
    </div>`;
};

const UserProfilePage = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return `<div class="container page-container py-40">
        <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
                <div class="card">
                    <div class="text-center">
                        <div class="avatar" style="width: 80px; height: 80px; margin: 0 auto 20px; font-size: 2rem;">
                            ${currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h3>${currentUser.fullName || 'User Name'}</h3>
                        <p class="text-muted">${currentUser.email || 'user@example.com'}</p>
                        <p class="text-sm text-muted mt-10">
                            <i data-lucide="map-pin" class="inline-icon"></i>
                            ${currentUser.location || 'Location'}
                        </p>
                    </div>
                    <div class="mt-20">
                        <a href="#register" class="btn btn-primary w-full">
                            <i data-lucide="plus"></i> Add New Pet
                        </a>
                    </div>
                </div>

                <div class="card mt-20">
                    <h4>Account Settings</h4>
                    <div class="mt-15">
                        <a href="#" class="btn btn-outline w-full mb-10">Edit Profile</a>
                        <button onclick="handleLogout()" class="btn btn-outline w-full text-danger">Logout</button>
                    </div>
                </div>
            </aside>

            <main class="dashboard-main">
                <div class="card mb-30">
                    <h3>My Pets</h3>
                    <p class="text-muted text-sm mt-10">Manage your registered pets and their health records.</p>
                    <div class="mt-20" id="user-pets-list">
                        <!-- Pet list will be populated here -->
                    </div>
                </div>

                <div class="card">
                    <h3>Quick Stats</h3>
                    <div class="stats-mini-grid mt-20">
                        <div class="stat-mini">
                            <span class="label">Total Pets</span>
                            <span class="value" id="total-pets">0</span>
                        </div>
                        <div class="stat-mini">
                            <span class="label">Vaccination Records</span>
                            <span class="value" id="total-records">0</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>`;
};

const LoginPage = () => {
    return `<div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <div class="text-center mb-30">
                    <div class="logo-container justify-center mb-10">
                        <div class="logo-placeholder"><i data-lucide="shield-plus"></i></div>
                        <span class="app-name">VetLink</span>
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
                <div class="auth-divider">
                    <span>OR</span>
                </div>
                <p class="text-center text-sm">
                    <a href="#vet-login" class="text-primary">Veterinarian Login</a>
                </p>
            </div>
        </div>
    </div>`;
};

const VetLoginPage = () => {
    return `<div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <div class="text-center mb-30">
                    <div class="logo-container justify-center mb-10">
                        <div class="logo-placeholder"><i data-lucide="stethoscope"></i></div>
                        <span class="app-name">VetLink Professional</span>
                    </div>
                    <p class="text-muted">Secure access for licensed veterinarians only.</p>
                </div>
                <form id="vet-login-form">
                    ${Input({ label: 'Professional Email', id: 'vetEmail', name: 'email', type: 'email', placeholder: 'dr@clinic.com', required: true })}
                    ${Input({ label: 'Password', id: 'vetPassword', name: 'password', type: 'password', placeholder: 'Enter your secure password', required: true })}
                    <button type="submit" class="btn btn-primary w-full mt-20">Access Vet Portal</button>
                </form>
                <div class="auth-divider">
                    <span>OR</span>
                </div>
                <p class="text-center text-sm">
                    <a href="#login" class="text-primary">Pet Owner Login</a>
                </p>
                <div class="mt-20 p-15 bg-blue-light rounded-lg">
                    <p class="text-sm text-muted">
                        <strong>Demo Vet Accounts:</strong><br>
                        Dr. H.H.A.S. Piyasiri: piyasiri@petvet.lk / vet789<br>
                        Dr. Nirmal Silva: info@petcare.lk / vet123<br>
                        Dr. Priyantha Banda: kandyvet@gmail.com / vet456
                    </p>
                </div>
            </div>
        </div>
    </div>`;
};

const RegisterPetPage = () => {
    return `<div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <h2>Register Your Pet</h2>
                <p class="text-muted">Start tracking your pet's health today.</p>
                <form id="register-pet-form" class="mt-20">
                    <div class="form-grid">
                        ${Input({ label: 'Pet Name', id: 'petName', name: 'petName', placeholder: 'e.g. Buddy', required: true })}
                        ${Input({ label: 'Type', id: 'petType', name: 'petType', options: ['Dog', 'Cat', 'Bird', 'Other'], placeholder: 'Select type', required: true })}
                        ${Input({ label: 'Breed', id: 'breed', name: 'breed', placeholder: 'e.g. Golden Retriever', required: true })}
                        ${Input({ label: 'Date of Birth', id: 'dob', name: 'dob', type: 'date', required: true })}
                        ${Input({ label: 'Color / Markings', id: 'color', name: 'color', placeholder: 'e.g. Brown with white chest' })}
                        ${Input({ label: 'Microchip Number (Optional)', id: 'microchip', name: 'microchip', placeholder: '15-digit number' })}
                        ${Input({ label: 'Owner Name', id: 'ownerName', name: 'ownerName', placeholder: 'Your Name', required: true })}
                        ${Input({ label: 'Phone Number', id: 'phone', name: 'phone', placeholder: '07X XXX XXXX', required: true })}
                    </div>
                    <div class="form-actions mt-20">
                        <button type="submit" class="btn btn-primary w-full">Complete Registration</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
};

const DashboardPage = (pets) => {
    const selectedPet = pets[0];
    return `<div class="container page-container py-40">
        <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
                <div class="card pet-profile-card">
                    <div class="pet-img-large">
                        <img src="${selectedPet.image}" alt="${selectedPet.name}">
                    </div>
                    <div class="pet-info">
                        <div class="flex justify-between items-center mb-5">
                            <h2 class="m-0">${selectedPet.name}</h2>
                            <span class="pet-id-tag">ID: ${selectedPet.id}</span>
                        </div>
                        <p>${selectedPet.breed} • ${selectedPet.type}</p>
                        <div class="pet-stats">
                            <div><strong>DOB:</strong> ${selectedPet.dob}</div>
                            <div><strong>Owner:</strong> ${selectedPet.owner}</div>
                        </div>
                    </div>
                </div>

                <div class="card mt-20">
                    <h3 class="flex items-center gap-10">
                        <i data-lucide="book-open" class="text-primary"></i>
                        Vaccination Book
                    </h3>
                    <p class="text-muted text-sm mb-20">Access and manage ${selectedPet.name}'s digital health certificate.</p>
                    <a href="#vaccination-book" class="btn btn-primary w-full">
                        Open Vaccination Book
                    </a>
                </div>
            </aside>

            <main class="dashboard-main">
                <div class="card mb-30">
                    <h3>Summary</h3>
                    <div class="stats-mini-grid mt-20">
                        <div class="stat-mini">
                            <span class="label">Last Vaccination</span>
                            <span class="value">${selectedPet.vaccinations[0] ? selectedPet.vaccinations[0].date : 'None'}</span>
                        </div>
                        <div class="stat-mini">
                            <span class="label">Records</span>
                            <span class="value">${selectedPet.vaccinations.length}</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3>Upcoming Reminders</h3>
                    <div class="reminder-list mt-20">
                        ${selectedPet.reminders.length > 0 ? selectedPet.reminders.map(r => `
                            <div class="reminder-item">
                                <div class="reminder-icon"><i data-lucide="calendar"></i></div>
                                <div class="reminder-text">
                                    <h4>${r.title}</h4>
                                    <p>${r.date} • ${r.type}</p>
                                </div>
                                <button class="btn btn-icon"><i data-lucide="check"></i></button>
                            </div>
                        `).join('') : '<p class="text-muted">No upcoming reminders.</p>'}
                    </div>
                    <a href="#vets" class="btn btn-outline w-full mt-20">Find a Vet Nearby</a>
                </div>
            </main>
        </div>
    </div>`;
};

const VetDashboardPage = () => {
    const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
    return `<div class="container page-container py-40">
        <div class="vet-dashboard-header mb-30">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="m-0">Veterinarian Dashboard</h2>
                    <p class="text-muted mt-5">Welcome back, Dr. ${currentVet.name?.split(' ')[1] || 'User'}</p>
                </div>
                <div class="vet-badge">
                    <i data-lucide="shield-check" class="text-success"></i>
                    <span>Verified Veterinarian</span>
                    <small class="text-muted">ID: ${currentVet.id || 'VET-XXX'}</small>
                </div>
            </div>
        </div>

        <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
                <div class="card">
                    <h3>Quick Actions</h3>
                    <div class="mt-20">
                        <a href="#vet-search-pet" class="btn btn-primary w-full mb-10">
                            <i data-lucide="search"></i> Search Pet
                        </a>
                        <a href="#vet-add-vaccination" class="btn btn-outline w-full mb-10">
                            <i data-lucide="syringe"></i> Add Vaccination
                        </a>
                        <a href="#vet-add-treatment" class="btn btn-outline w-full">
                            <i data-lucide="heart-pulse"></i> Add Treatment
                        </a>
                    </div>
                </div>

                <div class="card mt-20">
                    <h3>Clinic Info</h3>
                    <div class="mt-15">
                        <p class="text-sm"><strong>${currentVet.clinic || 'Your Clinic'}</strong></p>
                        <p class="text-sm text-muted">${currentVet.location || 'Location'}</p>
                        <p class="text-sm text-muted">License: ${currentVet.licenseNumber || 'LIC-XXX'}</p>
                    </div>
                </div>
            </aside>

            <main class="dashboard-main">
                <div class="card mb-30">
                    <h3>Search Pet by ID</h3>
                    <div class="search-bar-container mt-20">
                        <div class="search-input-wrapper">
                            <i data-lucide="search" class="search-icon"></i>
                            <input type="text" id="pet-search" class="form-input no-border" placeholder="Enter Pet ID (e.g., PET-101)">
                        </div>
                        <button onclick="searchPet()" class="btn btn-primary ml-10">Search</button>
                    </div>
                    <div id="pet-search-result" class="mt-20">
                        <!-- Search results will appear here -->
                    </div>
                </div>

                <div class="card">
                    <h3>Recent Activity</h3>
                    <div class="activity-list mt-20">
                        <div class="activity-item">
                            <div class="activity-dot success"></div>
                            <div class="activity-content">
                                <strong>Vaccination Added:</strong> Rabies for Max (PET-101)
                                <span>2 hours ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-dot info"></div>
                            <div class="activity-content">
                                <strong>Treatment Recorded:</strong> Annual checkup for Luna (PET-102)
                                <span>5 hours ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-dot warning"></div>
                            <div class="activity-content">
                                <strong>Recommendation:</strong> Dental cleaning for Buddy (PET-103)
                                <span>1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>`;
};

const FindVetPage = (vets) => {
    return `<div class="container page-container py-40">
        ${SectionHeader('Find a Trusted Vet', 'Search for veterinary clinics in your area.')}
        
        <div class="search-bar-container card mb-40">
            <div class="search-input-wrapper">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" id="vet-search" class="form-input no-border" placeholder="Search by name or location...">
            </div>
        </div>

        <div class="vet-grid" id="vet-list">
            ${vets.filter(v => v.status === 'Active').map(vet => `
                <div class="card vet-card">
                    <div class="flex justify-between items-start mb-10">
                        <h3>${vet.name}</h3>
                        <div class="rating-badge">
                            <i data-lucide="star" class="star-icon"></i>
                            <span>${vet.rating}</span>
                        </div>
                    </div>
                    <p class="text-muted mb-5"><strong>${vet.clinic}</strong></p>
                    <p class="text-muted mb-5"><i data-lucide="map-pin" class="inline-icon"></i> ${vet.location}</p>
                    <p class="text-muted mb-20"><i data-lucide="phone" class="inline-icon"></i> ${vet.phone}</p>
                    <div class="vet-footer">
                        <span class="specialty-tag">${vet.specialty.split(',')[0]}</span>
                        <a href="#" class="btn btn-outline btn-sm">View Profile</a>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
};

const VetAddVaccinationPage = () => {
    const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
    return `<div class="container page-container">
        <div class="auth-card-container width-600">
            <div class="card">
                <div class="flex items-center gap-10 mb-20">
                    <a href="#vet-dashboard" class="text-primary"><i data-lucide="arrow-left"></i></a>
                    <h2 class="m-0">Add Vaccination Record</h2>
                    <div class="verified-badge ml-auto">
                        <i data-lucide="shield-check" class="text-success"></i>
                        <span>Verified Veterinarian</span>
                    </div>
                </div>
                
                <div class="verification-banner bg-blue-light p-15 rounded-lg mb-20">
                    <div class="flex items-center gap-10">
                        <i data-lucide="check-circle" class="text-primary"></i>
                        <div>
                            <strong>Digitally Verified Vaccination Record</strong>
                            <p class="text-sm text-muted mt-5">This record will be digitally signed and verified by your veterinary license.</p>
                        </div>
                    </div>
                </div>

                <form id="vet-add-vaccination-form">
                    <div class="form-grid">
                        ${Input({ label: 'Pet ID', id: 'petId', name: 'petId', placeholder: 'e.g. PET-101', required: true })}
                        ${Input({ label: 'Vaccine Name', id: 'vaccineName', name: 'vaccineName', options: vaccineTypes, placeholder: 'Select vaccine', required: true })}
                        ${Input({ label: 'Date Given', id: 'dateGiven', name: 'dateGiven', type: 'date', required: true })}
                        ${Input({ label: 'Next Due Date', id: 'nextDue', name: 'nextDue', type: 'date', required: true })}
                        ${Input({ label: 'Batch / Lot Number', id: 'batchNumber', name: 'batchNumber', placeholder: 'e.g. B-1234' })}
                    </div>
                    <div class="form-group mt-15">
                        <label for="notes">Notes</label>
                        <textarea id="notes" name="notes" class="form-input" rows="3" placeholder="Additional details..."></textarea>
                    </div>
                    
                    <div class="vet-signature-section mt-30 p-20 bg-gray-light rounded-lg">
                        <h4 class="mb-15">Veterinarian Information (Auto-filled)</h4>
                        <div class="form-grid">
                            ${Input({ label: 'Vet Name', id: 'vetName', name: 'vetName', value: currentVet.name || '', readonly: true })}
                            ${Input({ label: 'Clinic Name', id: 'clinicName', name: 'clinicName', value: currentVet.clinic || '', readonly: true })}
                            ${Input({ label: 'License Number', id: 'licenseNumber', name: 'licenseNumber', value: currentVet.licenseNumber || '', readonly: true })}
                        </div>
                        <input type="hidden" name="vetId" value="${currentVet.id || ''}">
                        <input type="hidden" name="timestamp" value="${new Date().toISOString()}">
                    </div>
                    
                    <div class="form-actions mt-20">
                        <button type="submit" class="btn btn-primary w-full">
                            <i data-lucide="shield-check"></i> Add Verified Record
                        </button>
                        <a href="#vet-dashboard" class="btn btn-outline w-full mt-10">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
};

const VetAddTreatmentPage = () => {
    const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
    return `<div class="container page-container">
        <div class="auth-card-container width-600">
            <div class="card">
                <div class="flex items-center gap-10 mb-20">
                    <a href="#vet-dashboard" class="text-primary"><i data-lucide="arrow-left"></i></a>
                    <h2 class="m-0">Add Treatment Record</h2>
                    <div class="verified-badge ml-auto">
                        <i data-lucide="heart-pulse" class="text-primary"></i>
                        <span>Vet Recommendation</span>
                    </div>
                </div>
                
                <div class="verification-banner bg-blue-light p-15 rounded-lg mb-20">
                    <div class="flex items-center gap-10">
                        <i data-lucide="file-text" class="text-primary"></i>
                        <div>
                            <strong>Vet Recommendation Record</strong>
                            <p class="text-sm text-muted mt-5">Professional treatment recommendation for pet health management.</p>
                        </div>
                    </div>
                </div>

                <form id="vet-add-treatment-form">
                    <div class="form-grid">
                        ${Input({ label: 'Pet ID', id: 'petId', name: 'petId', placeholder: 'e.g. PET-101', required: true })}
                        ${Input({ label: 'Diagnosis', id: 'diagnosis', name: 'diagnosis', placeholder: 'e.g. Annual wellness checkup', required: true })}
                        ${Input({ label: 'Treatment Given', id: 'treatment', name: 'treatment', placeholder: 'e.g. Physical examination, deworming', required: true })}
                        ${Input({ label: 'Follow-up Date', id: 'followUp', name: 'followUp', type: 'date' })}
                    </div>
                    <div class="form-group mt-15">
                        <label for="medicines">Medicines Prescribed</label>
                        <textarea id="medicines" name="medicines" class="form-input" rows="3" placeholder="List prescribed medications..."></textarea>
                    </div>
                    <div class="form-group mt-15">
                        <label for="notes">Treatment Notes</label>
                        <textarea id="notes" name="notes" class="form-input" rows="3" placeholder="Detailed treatment notes..."></textarea>
                    </div>
                    
                    <div class="vet-signature-section mt-30 p-20 bg-gray-light rounded-lg">
                        <h4 class="mb-15">Veterinarian Information (Auto-filled)</h4>
                        <div class="form-grid">
                            ${Input({ label: 'Vet Name', id: 'vetName', name: 'vetName', value: currentVet.name || '', readonly: true })}
                            ${Input({ label: 'Clinic Name', id: 'clinicName', name: 'clinicName', value: currentVet.clinic || '', readonly: true })}
                            ${Input({ label: 'License Number', id: 'licenseNumber', name: 'licenseNumber', value: currentVet.licenseNumber || '', readonly: true })}
                        </div>
                        <input type="hidden" name="vetId" value="${currentVet.id || ''}">
                        <input type="hidden" name="timestamp" value="${new Date().toISOString()}">
                    </div>
                    
                    <div class="form-actions mt-20">
                        <button type="submit" class="btn btn-primary w-full">
                            <i data-lucide="heart-pulse"></i> Add Treatment Record
                        </button>
                        <a href="#vet-dashboard" class="btn btn-outline w-full mt-10">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
};

const VaccinationBookPage = (pet) => {
    const today = new Date();
    const upcoming = pet.vaccinations
        .filter(v => new Date(v.nextDue) >= today)
        .sort((a,b) => new Date(a.nextDue) - new Date(b.nextDue));
    
    const overdue = pet.vaccinations
        .filter(v => new Date(v.nextDue) < today);

    return `<div class="container page-container py-40">
            <div class="flex items-center gap-15 mb-30">
                <a href="#dashboard" class="btn btn-icon-sm"><i data-lucide="arrow-left"></i></a>
                <h1 class="m-0">Digital Vaccination Book</h1>
            </div>

            <div class="vac-certificate card">
                <div class="cert-header">
                    <div class="flex justify-between items-start">
                        <div class="cert-title">
                            <h2>CERTIFICATE OF VACCINATION</h2>
                            <p class="text-sm">International Standard Pet Health Record</p>
                        </div>
                        <div class="cert-id">
                            <span class="label">PET ID</span>
                            <span class="value">${pet.id}</span>
                        </div>
                    </div>
                </div>

                <div class="cert-section">
                    <h3 class="flex items-center gap-10">
                        <i data-lucide="dog" class="text-primary size-20"></i>
                        Pet Information
                    </h3>
                    <div class="info-grid mt-20">
                        <div class="info-item"><span class="label">Name</span><span class="value">${pet.name}</span></div>
                        <div class="info-item"><span class="label">Species</span><span class="value">${pet.type}</span></div>
                        <div class="info-item"><span class="label">Breed</span><span class="value">${pet.breed}</span></div>
                        <div class="info-item"><span class="label">Date of Birth</span><span class="value">${pet.dob}</span></div>
                        <div class="info-item"><span class="label">Color / Markings</span><span class="value">${pet.color || 'Not specified'}</span></div>
                        <div class="info-item"><span class="label">Microchip No.</span><span class="value">${pet.microchip || 'N/A'}</span></div>
                    </div>
                </div>

                <div class="cert-section no-border">
                    <div class="flex justify-between items-center mb-20">
                        <h3 class="flex items-center gap-10">
                            <i data-lucide="syringe" class="text-primary size-20"></i>
                            Vaccination Records
                        </h3>
                        <a href="#add-vaccination" class="btn btn-primary btn-sm">
                            <i data-lucide="plus"></i> Add Record
                        </a>
                    </div>

                    <div class="table-container medical-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Vaccine</th>
                                    <th>Date</th>
                                    <th>Next Due</th>
                                    <th>Batch #</th>
                                    <th>Vet / Clinic</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pet.vaccinations.length > 0 ? pet.vaccinations.map(v => `
                                    <tr>
                                        <td><strong>${v.name}</strong></td>
                                        <td>${v.date}</td>
                                        <td>${v.nextDue}</td>
                                        <td><code class="text-sm">${v.batchNumber || '—'}</code></td>
                                        <td>
                                            <div class="text-sm">${v.vetName || '—'}</div>
                                            <div class="text-xs text-muted">${v.clinicName || '—'}</div>
                                        </td>
                                        <td><span class="text-xs text-muted">${v.notes || '—'}</span></td>
                                    </tr>
                                `).join('') : '<tr><td colspan="6" class="text-center py-20 text-muted">No vaccination records found.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="grid-2 mt-30">
                <div class="card">
                    <h3>Upcoming Vaccinations</h3>
                    <div class="reminder-list mt-20">
                        ${upcoming.length > 0 ? upcoming.map(u => `
                            <div class="reminder-item">
                                <div class="reminder-icon"><i data-lucide="calendar"></i></div>
                                <div class="reminder-text">
                                    <h4>${u.name}</h4>
                                    <p>Due: ${u.nextDue}</p>
                                </div>
                                <span class="status-badge status-due">Upcoming</span>
                            </div>
                        `).join('') : '<p class="text-muted">No upcoming vaccinations.</p>'}
                    </div>
                </div>

                <div class="card">
                    <h3>Alerts & Overdue</h3>
                    <div class="reminder-list mt-20">
                        ${overdue.length > 0 ? overdue.map(o => `
                            <div class="reminder-item">
                                <div class="reminder-icon bg-danger-light"><i data-lucide="alert-triangle" class="text-danger"></i></div>
                                <div class="reminder-text">
                                    <h4>${o.name}</h4>
                                    <p class="text-danger font-bold">OVERDUE since ${o.nextDue}</p>
                                </div>
                                <a href="#vets" class="btn btn-outline btn-sm">Book Vet</a>
                            </div>
                        `).join('') : '<p class="text-success flex items-center gap-10"><i data-lucide="check-circle" class="size-20"></i> All vaccinations up to date!</p>'}
                    </div>
                </div>
            </div>
        </div>`;
};

// Main App
class VetLinkApp {
    constructor() {
        this.appRoot = document.getElementById('app-root');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinksContainer = document.getElementById('nav-links');
        
        this.state = {
            pets: mockPets,
            vets: mockVets,
            currentUser: null,
            currentPath: window.location.hash || '#home'
        };

        this.init();
    }

    init() {
        this.updateNavigation();
        this.handleRoute();

        window.addEventListener('hashchange', () => {
            this.state.currentPath = window.location.hash || '#home';
            this.handleRoute();
        });

        this.mobileMenuBtn.addEventListener('click', () => {
            this.navLinksContainer.classList.toggle('show-mobile');
            const icon = this.mobileMenuBtn.querySelector('i');
            const isOpen = this.navLinksContainer.classList.contains('show-mobile');
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            lucide.createIcons();
        });

        this.navLinksContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.navLinksContainer.classList.remove('show-mobile');
                const icon = this.mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    }

    handleRoute() {
        const path = this.state.currentPath.replace('#', '');
        let html = '';

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + (path || 'home')) {
                link.classList.add('active');
            }
        });

        const isAdmin = path.startsWith('admin');
        const navbar = document.querySelector('.navbar');
        const footer = document.querySelector('.footer');
        if (navbar) navbar.style.display = isAdmin ? 'none' : 'flex';
        if (footer) footer.style.display = (isAdmin && path !== 'admin-login') ? 'none' : 'block';

        switch (path) {
            case '':
            case 'home':
                html = RoleSelectionPage();
                break;
            case 'user-register':
                html = UserRegistrationPage();
                break;
            case 'vet-login':
                html = VetLoginPage();
                break;
            case 'register':
                html = RegisterPetPage();
                break;
            case 'dashboard':
                html = DashboardPage(this.state.pets);
                break;
            case 'profile':
                html = UserProfilePage();
                break;
            case 'vet-dashboard':
                html = VetDashboardPage();
                break;
            case 'vet-add-vaccination':
                html = VetAddVaccinationPage();
                break;
            case 'vet-add-treatment':
                html = VetAddTreatmentPage();
                break;
            case 'vaccination-book':
                html = VaccinationBookPage(this.state.pets[0]);
                break;
            case 'vets':
                html = FindVetPage(this.state.vets);
                break;
            case 'booking':
                html = BookingPage();
                break;
            case 'vet-dashboard':
                html = VetBookingDashboardPage();
                break;
            case 'vet-settings':
                html = VetSettingsPage();
                break;
            case 'login':
                html = LoginPage();
                break;
            default:
                html = RoleSelectionPage();
        }

        this.render(html);
        this.attachEventListeners(path);
    }

    updateNavigation() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const profileLink = document.getElementById('profile-link');

        if (currentUser && currentUser.id) {
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (profileLink) {
                profileLink.style.display = 'block';
                profileLink.textContent = currentUser.fullName.split(' ')[0];
            }
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (profileLink) profileLink.style.display = 'none';
        }
    }

    render(html) {
        this.appRoot.innerHTML = html;
        lucide.createIcons();
        this.updateNavigation();
        window.scrollTo(0, 0);
    }

    attachEventListeners(path) {
        if (path === 'user-register') {
            const form = document.getElementById('user-registration-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleUserRegistration(e));
            }
        }

        if (path === 'login') {
            const form = document.getElementById('login-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleLogin(e));
            }
        }

        if (path === 'vet-login') {
            const form = document.getElementById('vet-login-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleVetLogin(e));
            }
        }

        if (path === 'register') {
            const form = document.getElementById('register-pet-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleRegisterPet(e));
            }
        }

        if (path === 'vet-add-vaccination') {
            const form = document.getElementById('vet-add-vaccination-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleVetAddVaccination(e));
            }
        }

        if (path === 'vet-add-treatment') {
            const form = document.getElementById('vet-add-treatment-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleVetAddTreatment(e));
            }
        }

        if (path === 'vets') {
            const searchInput = document.getElementById('vet-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.handleVetSearch(e));
            }
        }

        if (path === 'profile') {
            this.populateUserProfile();
        }

        if (path === 'booking') {
            const form = document.getElementById('booking-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleBookingForm(e));
            }
            // Setup booking form listeners for real-time updates
            this.setupBookingFormListeners();
        }

        if (path === 'vet-settings') {
            const form = document.getElementById('vet-settings-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleVetSettings(e));
            }
        }
    }

    handleUserRegistration(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (formData.get('password') !== formData.get('confirmPassword')) {
            alert('Passwords do not match!');
            return;
        }

        const newUser = {
            id: 'user' + Date.now(),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            password: formData.get('password'),
            registeredAt: new Date().toISOString()
        };

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        alert('Account created successfully! Welcome to VetLink!');
        window.location.hash = '#profile';
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful! Welcome back!');
            window.location.hash = '#profile';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    }

    populateUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userPets = this.state.pets.filter(pet => pet.owner === currentUser.fullName);
        
        const petsList = document.getElementById('user-pets-list');
        if (petsList) {
            if (userPets.length > 0) {
                petsList.innerHTML = userPets.map(pet => `
                    <div class="card mb-15">
                        <div class="flex items-center gap-15">
                            <img src="${pet.image}" alt="${pet.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                            <div class="flex-1">
                                <h4 class="m-0">${pet.name}</h4>
                                <p class="text-muted text-sm">${pet.breed} • ${pet.type}</p>
                                <p class="text-xs text-muted">ID: ${pet.id}</p>
                            </div>
                            <div class="flex gap-10">
                                <a href="#vaccination-book" class="btn btn-outline btn-sm">Vaccination Book</a>
                                <a href="#dashboard" class="btn btn-primary btn-sm">View Dashboard</a>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                petsList.innerHTML = `
                    <div class="text-center py-40">
                        <i data-lucide="dog" style="width: 48px; height: 48px; margin: 0 auto 15px; opacity: 0.3;"></i>
                        <p class="text-muted">No pets registered yet.</p>
                        <a href="#register" class="btn btn-primary mt-15">Register Your First Pet</a>
                    </div>
                `;
            }
        }

        const totalPetsElement = document.getElementById('total-pets');
        const totalRecordsElement = document.getElementById('total-records');
        
        if (totalPetsElement) totalPetsElement.textContent = userPets.length;
        if (totalRecordsElement) {
            const totalRecords = userPets.reduce((acc, pet) => acc + (pet.vaccinations ? pet.vaccinations.length : 0), 0);
            totalRecordsElement.textContent = totalRecords;
        }
    }

    handleRegisterPet(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPet = {
            id: 'VL-' + Math.floor(1000 + Math.random() * 9000),
            name: formData.get('petName'),
            type: formData.get('petType'),
            breed: formData.get('breed'),
            dob: formData.get('dob'),
            color: formData.get('color'),
            microchip: formData.get('microchip'),
            owner: formData.get('ownerName'),
            phone: formData.get('phone'),
            image: 'https://images.unsplash.com/photo-1543466835-00a732f3b95c?auto=format&fit=crop&q=80&w=200&h=200',
            vaccinations: [],
            reminders: []
        };

        this.state.pets.unshift(newPet);
        alert('Pet Registered Successfully!');
        window.location.hash = '#dashboard';
    }

    handleVetLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Authenticate against mock vet data
        const vet = mockVets.find(v => v.email === email && v.password === password && v.approved);

        if (vet) {
            // Store current vet in localStorage
            localStorage.setItem('currentVet', JSON.stringify(vet));
            alert(`Welcome Dr. ${vet.name.split(' ')[1]}! Access granted to VetLink Professional Portal.`);
            window.location.hash = '#vet-dashboard';
        } else {
            alert('Invalid credentials. Please check your email and password, or contact admin for approval.');
        }
    }

    handleVetAddVaccination(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
        
        // Find pet by ID
        const petId = formData.get('petId');
        const pet = this.state.pets.find(p => p.id === petId);
        
        if (!pet) {
            alert('Pet not found. Please check the Pet ID and try again.');
            return;
        }

        const newVaccination = {
            id: Date.now().toString(),
            petId: petId,
            vaccineName: formData.get('vaccineName'),
            date: formData.get('dateGiven'),
            nextDue: formData.get('nextDue'),
            batchNumber: formData.get('batchNumber'),
            vetName: currentVet.name,
            clinicName: currentVet.clinic,
            vetId: currentVet.id,
            licenseNumber: currentVet.licenseNumber,
            timestamp: formData.get('timestamp'),
            notes: formData.get('notes'),
            status: 'verified',
            type: 'veterinarian-record'
        };

        // Add vaccination to pet's records
        if (!pet.vaccinations) pet.vaccinations = [];
        pet.vaccinations.unshift(newVaccination);

        alert('Vaccination record added successfully! This record is digitally verified by your veterinary license.');
        window.location.hash = '#vet-dashboard';
    }

    handleVetAddTreatment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
        
        // Find pet by ID
        const petId = formData.get('petId');
        const pet = this.state.pets.find(p => p.id === petId);
        
        if (!pet) {
            alert('Pet not found. Please check the Pet ID and try again.');
            return;
        }

        const newTreatment = {
            id: Date.now().toString(),
            petId: petId,
            diagnosis: formData.get('diagnosis'),
            treatment: formData.get('treatment'),
            medicines: formData.get('medicines'),
            followUp: formData.get('followUp'),
            notes: formData.get('notes'),
            vetName: currentVet.name,
            clinicName: currentVet.clinic,
            vetId: currentVet.id,
            licenseNumber: currentVet.licenseNumber,
            timestamp: formData.get('timestamp'),
            type: 'veterinarian-recommendation'
        };

        // Add treatment to pet's records
        if (!pet.treatments) pet.treatments = [];
        pet.treatments.unshift(newTreatment);

        alert('Treatment recommendation added successfully! This record is digitally verified by your veterinary license.');
        window.location.hash = '#vet-dashboard';
    }

    handleVetSearch(e) {
        const query = e.target.value.toLowerCase();
        const filteredVets = mockVets.filter(vet => 
            vet.name.toLowerCase().includes(query) || 
            vet.location.toLowerCase().includes(query)
        );
        
        const vetList = document.getElementById('vet-list');
        if (vetList) {
            vetList.innerHTML = filteredVets.map(vet => `
                <div class="card vet-card">
                    <div class="flex justify-between items-start mb-10">
                        <h3>${vet.name}</h3>
                        <div class="rating-badge">
                            <i data-lucide="star" class="star-icon"></i>
                            <span>${vet.rating}</span>
                        </div>
                    </div>
                    <p class="text-muted mb-5"><strong>${vet.clinic}</strong></p>
                    <p class="text-muted mb-5"><i data-lucide="map-pin" class="inline-icon"></i> ${vet.location}</p>
                    <p class="text-muted mb-20"><i data-lucide="phone" class="inline-icon"></i> ${vet.phone}</p>
                    <div class="vet-footer">
                        <span class="specialty-tag">${vet.specialty.split(',')[0]}</span>
                        <a href="#" class="btn btn-outline btn-sm">View Profile</a>
                    </div>
                </div>
            `).join('');
            lucide.createIcons();
        }
    }

    // Booking System Methods
    handleBookingForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const pets = JSON.parse(localStorage.getItem('pets') || '[]');
        
        // Get selected pet
        const petId = formData.get('petId');
        const pet = pets.find(p => p.id === petId);
        
        if (!pet) {
            alert('Please select a pet for the booking.');
            return;
        }
        
        // Check if booking time is emergency (10 PM - 6 AM)
        const bookingTime = formData.get('time');
        const bookingHour = parseInt(bookingTime.split(':')[0]);
        const isEmergency = bookingHour >= 22 || bookingHour < 6;
        
        // Calculate total cost
        const baseFee = 2000;
        const visitType = formData.get('visitType');
        const transportFee = visitType === 'home' ? 500 : 0;
        const emergencyFee = isEmergency ? 1500 : 0;
        const totalCost = baseFee + transportFee + emergencyFee;
        
        // Create booking request
        const bookingRequest = {
            id: 'BK-' + Date.now(),
            petId: petId,
            petName: pet.name,
            petType: pet.type,
            ownerId: currentUser.fullName,
            ownerName: currentUser.fullName,
            ownerPhone: currentUser.phone || '077 123 4567',
            ownerEmail: currentUser.email,
            visitType: visitType,
            date: formData.get('date'),
            time: bookingTime,
            location: formData.get('location'),
            notes: formData.get('notes'),
            isEmergency: isEmergency,
            baseFee: baseFee,
            transportFee: transportFee,
            emergencyFee: emergencyFee,
            totalCost: totalCost,
            status: 'pending',
            createdAt: new Date().toISOString(),
            assignedVetId: null
        };
        
        // Save booking request
        let bookingRequests = JSON.parse(localStorage.getItem('bookingRequests') || '[]');
        bookingRequests.push(bookingRequest);
        localStorage.setItem('bookingRequests', JSON.stringify(bookingRequests));
        
        // Show success message
        alert(`Booking request sent successfully! Total cost: LKR ${totalCost}. You will be notified when a veterinarian accepts your request.`);
        
        // Redirect to dashboard
        window.location.hash = '#dashboard';
    }

    handleVetSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
        
        // Update vet settings
        const updatedVet = {
            ...currentVet,
            acceptsHomeVisits: formData.get('acceptsHomeVisits') === 'on',
            acceptsClinicVisits: formData.get('acceptsClinicVisits') === 'on',
            emergencyAvailability: formData.get('emergencyAvailability') === 'on',
            workStart: formData.get('workStart'),
            workEnd: formData.get('workEnd'),
            baseFee: parseInt(formData.get('baseFee')),
            transportFee: parseInt(formData.get('transportFee')),
            emergencyFee: parseInt(formData.get('emergencyFee'))
        };
        
        // Update in mockVets array
        const vetIndex = mockVets.findIndex(v => v.id === currentVet.id);
        if (vetIndex !== -1) {
            mockVets[vetIndex] = { ...mockVets[vetIndex], ...updatedVet };
        }
        
        // Update localStorage
        localStorage.setItem('currentVet', JSON.stringify(updatedVet));
        
        alert('Availability settings saved successfully!');
        window.location.hash = '#vet-dashboard';
    }

    setupBookingFormListeners() {
        // Visit type change handler
        const visitTypeSelect = document.getElementById('visitType');
        if (visitTypeSelect) {
            visitTypeSelect.addEventListener('change', (e) => {
                this.updateBookingAlerts();
                this.updatePricing();
            });
        }
        
        // Time change handler for emergency detection
        const timeInput = document.getElementById('bookingTime');
        if (timeInput) {
            timeInput.addEventListener('change', () => {
                this.updateBookingAlerts();
                this.updatePricing();
            });
        }
        
        // Date change handler
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                this.updateBookingAlerts();
            });
        }
    }

    updateBookingAlerts() {
        const alertsDiv = document.getElementById('booking-alerts');
        const visitType = document.getElementById('visitType')?.value;
        const bookingTime = document.getElementById('bookingTime')?.value;
        const bookingDate = document.getElementById('bookingDate')?.value;
        
        if (!alertsDiv || !visitType || !bookingTime) return;
        
        const alerts = [];
        
        // Home visit alert
        if (visitType === 'home') {
            alerts.push(`
                <div class="booking-alert info">
                    <i data-lucide="home"></i>
                    <span>Additional transport charges may apply for home visits</span>
                </div>
            `);
        }
        
        // Emergency alert
        if (bookingTime) {
            const bookingHour = parseInt(bookingTime.split(':')[0]);
            const isEmergency = bookingHour >= 22 || bookingHour < 6;
            
            if (isEmergency) {
                alerts.push(`
                    <div class="booking-alert danger">
                        <i data-lucide="alert-triangle"></i>
                        <span>Emergency booking (10 PM - 6 AM) - Emergency charges will apply</span>
                    </div>
                `);
            }
        }
        
        // Date validation
        if (bookingDate) {
            const selectedDate = new Date(bookingDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alerts.push(`
                    <div class="booking-alert warning">
                        <i data-lucide="calendar"></i>
                        <span>Cannot book for past dates. Please select a future date.</span>
                    </div>
                `);
            }
        }
        
        alertsDiv.innerHTML = alerts.join('');
        lucide.createIcons();
    }

    updatePricing() {
        const pricingDiv = document.getElementById('pricing-breakdown');
        const visitType = document.getElementById('visitType')?.value;
        const bookingTime = document.getElementById('bookingTime')?.value;
        
        if (!pricingDiv || !visitType || !bookingTime) return;
        
        const baseFee = 2000;
        const transportFee = visitType === 'home' ? 500 : 0;
        
        // Check if emergency
        const bookingHour = parseInt(bookingTime.split(':')[0]);
        const isEmergency = bookingHour >= 22 || bookingHour < 6;
        const emergencyFee = isEmergency ? 1500 : 0;
        
        const totalCost = baseFee + transportFee + emergencyFee;
        
        // Update pricing display
        document.getElementById('base-fee').textContent = `LKR ${baseFee}`;
        document.getElementById('total-cost').textContent = `LKR ${totalCost}`;
        
        // Show/hide transport fee row
        const transportRow = document.getElementById('transport-fee-row');
        if (transportRow) {
            transportRow.style.display = transportFee > 0 ? 'flex' : 'none';
            if (transportFee > 0) {
                document.getElementById('transport-fee').textContent = `LKR ${transportFee}`;
            }
        }
        
        // Show/hide emergency fee row
        const emergencyRow = document.getElementById('emergency-fee-row');
        if (emergencyRow) {
            emergencyRow.style.display = emergencyFee > 0 ? 'flex' : 'none';
            if (emergencyFee > 0) {
                document.getElementById('emergency-fee').textContent = `LKR ${emergencyFee}`;
            }
        }
        
        // Show pricing breakdown
        pricingDiv.style.display = 'block';
    }
}

window.handleLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully.');
        window.location.hash = '#home';
    }
};

window.searchPet = function() {
    const petId = document.getElementById('pet-search').value.trim();
    const pet = mockPets.find(p => p.id === petId);
    const resultDiv = document.getElementById('pet-search-result');
    
    if (!pet) {
        resultDiv.innerHTML = `
            <div class="pet-search-result">
                <h4>Pet Not Found</h4>
                <p class="text-muted">No pet found with ID: ${petId}</p>
                <p class="text-sm">Please check the Pet ID and try again.</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="pet-search-result">
                <h4>Found: ${pet.name}</h4>
                <div class="pet-info">
                    <div class="info-item"><span class="label">Pet ID:</span><span class="value">${pet.id}</span></div>
                    <div class="info-item"><span class="label">Type:</span><span class="value">${pet.type}</span></div>
                    <div class="info-item"><span class="label">Breed:</span><span class="value">${pet.breed}</span></div>
                    <div class="info-item"><span class="label">Owner:</span><span class="value">${pet.owner}</span></div>
                    <div class="info-item"><span class="label">Phone:</span><span class="value">${pet.phone}</span></div>
                </div>
                <div class="pet-search-actions">
                    <a href="#vet-add-vaccination" class="btn btn-primary">Add Vaccination</a>
                    <a href="#vet-add-treatment" class="btn btn-outline">Add Treatment</a>
                </div>
            </div>
        `;
    }
    lucide.createIcons();
};

window.handleVetLogout = function() {
    if (confirm('Are you sure you want to logout from Vet Portal?')) {
        localStorage.removeItem('currentVet');
        alert('You have been logged out from VetLink Professional Portal.');
        window.location.hash = '#vet-login';
    }
};

window.selectRole = function(role) {
    if (role === 'veterinarian') {
        // Direct to vet login
        window.location.hash = '#vet-login';
    } else if (role === 'pet-owner') {
        // Direct to pet owner interface
        window.location.hash = '#login';
    }
};

// Booking System Global Functions
window.acceptBooking = function(bookingId) {
    const currentVet = JSON.parse(localStorage.getItem('currentVet') || '{}');
    const bookingRequests = JSON.parse(localStorage.getItem('bookingRequests') || '[]');
    
    const bookingIndex = bookingRequests.findIndex(req => req.id === bookingId);
    if (bookingIndex === -1) {
        alert('Booking request not found.');
        return;
    }
    
    // Update booking status
    bookingRequests[bookingIndex].status = 'accepted';
    bookingRequests[bookingIndex].assignedVetId = currentVet.id;
    bookingRequests[bookingIndex].assignedVetName = currentVet.name;
    bookingRequests[bookingIndex].assignedVetClinic = currentVet.clinic;
    bookingRequests[bookingIndex].assignedVetPhone = currentVet.phone;
    bookingRequests[bookingIndex].acceptedAt = new Date().toISOString();
    
    // Save updated booking requests
    localStorage.setItem('bookingRequests', JSON.stringify(bookingRequests));
    
    alert(`Booking accepted! Contact ${bookingRequests[bookingIndex].ownerName} at ${bookingRequests[bookingIndex].ownerPhone}.`);
    
    // Refresh the vet dashboard
    window.location.hash = '#vet-dashboard';
};

window.rejectBooking = function(bookingId) {
    if (!confirm('Are you sure you want to reject this booking request?')) {
        return;
    }
    
    const bookingRequests = JSON.parse(localStorage.getItem('bookingRequests') || '[]');
    
    const bookingIndex = bookingRequests.findIndex(req => req.id === bookingId);
    if (bookingIndex === -1) {
        alert('Booking request not found.');
        return;
    }
    
    // Update booking status
    bookingRequests[bookingIndex].status = 'rejected';
    bookingRequests[bookingIndex].rejectedAt = new Date().toISOString();
    
    // Save updated booking requests
    localStorage.setItem('bookingRequests', JSON.stringify(bookingRequests));
    
    alert('Booking request rejected.');
    
    // Refresh the vet dashboard
    window.location.hash = '#vet-dashboard';
};

const style = document.createElement('style');
style.textContent = `
    .nav-links.show-mobile {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: var(--nav-height);
        left: 0;
        width: 100%;
        background: white;
        padding: 20px;
        box-shadow: var(--shadow-md);
        gap: 20px;
        z-index: 999;
    }
    
    .show-mobile li {
        width: 100%;
    }
    
    .show-mobile a {
        display: block;
        width: 100%;
        padding: 10px 0;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new VetLinkApp();
});
