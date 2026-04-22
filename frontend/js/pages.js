import { vaccineTypes, mockVets, cities } from './data.js';

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

export const UserProfilePage = () => `
    <div class="container page-container py-40">
        <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
                <div class="card">
                    <div class="text-center">
                        <div class="avatar" style="width: 80px; height: 80px; margin: 0 auto 20px; font-size: 2rem;">
                            ${JSON.parse(localStorage.getItem('currentUser') || '{}').fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h3>${JSON.parse(localStorage.getItem('currentUser') || '{}').fullName || 'User Name'}</h3>
                        <p class="text-muted">${JSON.parse(localStorage.getItem('currentUser') || '{}').email || 'user@example.com'}</p>
                        <p class="text-sm text-muted mt-10">
                            <i data-lucide="map-pin" class="inline-icon"></i>
                            ${JSON.parse(localStorage.getItem('currentUser') || '{}').location || 'Location'}
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
    </div>
`;

export const LoginPage = () => `
    <div class="container page-container">
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
            </div>
        </div>
    </div>
`;

export const RegisterPetPage = () => `
    <div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <h2>Register Your Pet</h2>
                <p class="text-muted">Start tracking your pet's health today.</p>
                <form id="register-pet-form" class="mt-20">
                    <div class="form-grid">
                        ${Input({ label: 'Pet Name', id: 'petName', name: 'petName', placeholder: 'e.g. Buddy', required: true })}
                        ${Input({ 
                            label: 'Type', 
                            id: 'petType', 
                            name: 'petType', 
                            options: ['Dog', 'Cat', 'Bird', 'Other'], 
                            placeholder: 'Select type', 
                            required: true 
                        })}
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
    </div>
`;

export const DashboardPage = (pets) => {
    const selectedPet = pets[0];
    
    return `
        <div class="container page-container py-40">
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

                    <div class="card mt-20">
                        <h3 class="flex items-center gap-10">
                            <i data-lucide="calendar" class="text-primary"></i>
                            Book Appointment
                        </h3>
                        <p class="text-muted text-sm mb-20">Request a veterinary consultation for your pet.</p>
                        <a href="#booking" class="btn btn-outline w-full">
                            <i data-lucide="plus"></i> Book Vet Visit
                        </a>
                    </div>
                </aside>

                <main class="dashboard-main">
                    <div class="card mb-30">
                        <h3>Summary</h3>
                        <div class="stats-mini-grid mt-20">
                            <div class="stat-mini">
                                <span class="label">Last Vaccination</span>
                                <span class="value">${selectedPet.vaccinations[0]?.date || 'None'}</span>
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
        </div>
    `;
};

export const AddVaccinationPage = () => `
    <div class="container page-container">
        <div class="auth-card-container width-600">
            <div class="card">
                <div class="flex items-center gap-10 mb-20">
                    <a href="#vaccination-book" class="text-primary"><i data-lucide="arrow-left"></i></a>
                    <h2 class="m-0">Add Vaccination Record</h2>
                </div>
                <form id="add-vaccination-form">
                    <div class="form-grid">
                        ${Input({ 
                            label: 'Vaccine Name', 
                            id: 'vaccineName', 
                            name: 'vaccineName', 
                            options: vaccineTypes, 
                            placeholder: 'Select vaccine', 
                            required: true 
                        })}
                        ${Input({ label: 'Date Given', id: 'dateGiven', name: 'dateGiven', type: 'date', required: true })}
                        ${Input({ label: 'Next Due Date', id: 'nextDue', name: 'nextDue', type: 'date', required: true })}
                        ${Input({ label: 'Batch / Lot Number', id: 'batchNumber', name: 'batchNumber', placeholder: 'e.g. B-1234' })}
                        ${Input({ label: 'Vet Name', id: 'vetName', name: 'vetName', placeholder: 'Dr. John Doe', required: true })}
                        ${Input({ label: 'Clinic Name', id: 'clinicName', name: 'clinicName', placeholder: 'City Vet Clinic', required: true })}
                    </div>
                    <div class="form-group mt-15">
                        <label for="notes">Notes</label>
                        <textarea id="notes" name="notes" class="form-input" rows="3" placeholder="Additional details..."></textarea>
                    </div>
                    <div class="form-actions mt-20">
                        <button type="submit" class="btn btn-primary w-full">Save Record</button>
                        <a href="#vaccination-book" class="btn btn-outline w-full mt-10">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

export const VaccinationBookPage = (pet) => {
    const today = new Date();
    const upcoming = pet.vaccinations
        .filter(v => new Date(v.nextDue) >= today)
        .sort((a,b) => new Date(a.nextDue) - new Date(b.nextDue));
    
    const overdue = pet.vaccinations
        .filter(v => new Date(v.nextDue) < today);

    return `
        <div class="container page-container py-40">
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
        </div>
    `;
};

export const FindVetPage = (vets) => `
    <div class="container page-container py-40">
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
    </div>
`;

/**
 * Admin Panel Pages
 */

export const AdminLoginPage = () => `
    <div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <div class="text-center mb-30">
                    <div class="logo-container justify-center mb-10">
                        <div class="logo-placeholder"><i data-lucide="shield-check"></i></div>
                        <span class="app-name">VetLink Admin</span>
                    </div>
                    <p class="text-muted">Enter your credentials to access the portal.</p>
                </div>
                <form id="admin-login-form">
                    ${Input({ label: 'Admin Email', id: 'adminEmail', name: 'email', type: 'email', placeholder: 'admin@vetlink.lk', required: true })}
                    ${Input({ label: 'Password', id: 'adminPassword', name: 'password', type: 'password', placeholder: '••••••••', required: true })}
                    <button type="submit" class="btn btn-primary w-full mt-10">Secure Login</button>
                </form>
            </div>
        </div>
    </div>
`;

const AdminLayout = (content, activePage) => `
    <div class="admin-dashboard">
        <aside class="admin-sidebar">
            <div class="admin-sidebar-header">
                <div class="logo-container">
                    <div class="logo-placeholder small"><i data-lucide="shield-check"></i></div>
                    <span class="app-name">Admin</span>
                </div>
            </div>
            <nav class="admin-nav">
                <a href="#admin-dashboard" class="${activePage === 'dashboard' ? 'active' : ''}">
                    <i data-lucide="layout-dashboard"></i> Dashboard
                </a>
                <a href="#admin-vets" class="${activePage === 'vets' ? 'active' : ''}">
                    <i data-lucide="users"></i> Manage Vets
                </a>
                <a href="#admin-pets" class="${activePage === 'pets' ? 'active' : ''}">
                    <i data-lucide="dog"></i> Manage Pets
                </a>
                <div class="nav-divider"></div>
                <a href="#home" class="logout-link">
                    <i data-lucide="log-out"></i> Logout
                </a>
            </nav>
        </aside>
        <main class="admin-content">
            <div class="admin-header">
                <h2>${activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
                <div class="admin-user">
                    <span>Admin User</span>
                    <div class="avatar">A</div>
                </div>
            </div>
            <div class="admin-inner">
                ${content}
            </div>
        </main>
    </div>
`;

export const AdminDashboardPage = (stats) => AdminLayout(`
    <div class="stats-grid">
        <div class="card stat-card">
            <div class="stat-icon blue"><i data-lucide="users"></i></div>
            <div class="stat-info">
                <span class="stat-label">Total Vets</span>
                <span class="stat-value">${stats.vets}</span>
            </div>
        </div>
        <div class="card stat-card">
            <div class="stat-icon green"><i data-lucide="dog"></i></div>
            <div class="stat-info">
                <span class="stat-label">Total Pets</span>
                <span class="stat-value">${stats.pets}</span>
            </div>
        </div>
        <div class="card stat-card">
            <div class="stat-icon purple"><i data-lucide="file-text"></i></div>
            <div class="stat-info">
                <span class="stat-label">Total Records</span>
                <span class="stat-value">${stats.records}</span>
            </div>
        </div>
    </div>

    <div class="grid-2 mt-30">
        <div class="card">
            <h3>Recent Platform Activity</h3>
            <p class="text-muted text-sm mt-10">Mock activity data for showcase.</p>
            <ul class="activity-list mt-20">
                <li class="activity-item">
                    <div class="activity-dot blue"></div>
                    <div class="activity-content">
                        <strong>New Vet Registered:</strong> Dr. Nirmal Silva
                        <span>10 minutes ago</span>
                    </div>
                </li>
                <li class="activity-item">
                    <div class="activity-dot green"></div>
                    <div class="activity-content">
                        <strong>New Pet Added:</strong> Max (Golden Retriever)
                        <span>1 hour ago</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
`, 'dashboard');

export const AdminManageVetsPage = (vets) => AdminLayout(`
    <div class="flex justify-between items-center mb-30">
        <p class="text-muted">Manage all veterinary surgeons on the platform.</p>
        <a href="#admin-add-vet" class="btn btn-primary">
            <i data-lucide="plus"></i> Add New Vet
        </a>
    </div>

    <div class="card p-0">
        <div class="table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Vet Details</th>
                        <th>Clinic</th>
                        <th>Location</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${vets.map(vet => `
                        <tr>
                            <td>
                                <div><strong>${vet.name}</strong></div>
                                <div class="text-sm text-muted">${vet.email || 'No email provided'}</div>
                            </td>
                            <td>${vet.clinic}</td>
                            <td>${vet.location}</td>
                            <td>${vet.phone}</td>
                            <td>
                                <span class="status-badge status-${vet.status.toLowerCase()}">${vet.status}</span>
                            </td>
                            <td>
                                <div class="flex gap-10">
                                    <button class="btn-icon-sm" title="Edit"><i data-lucide="edit-3"></i></button>
                                    <button class="btn-icon-sm text-danger" title="Delete"><i data-lucide="trash-2"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
`, 'vets');

export const BookingPage = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const pets = JSON.parse(localStorage.getItem('pets') || '[]');
    const userPets = pets.filter(pet => pet.owner === currentUser.fullName);
    
    return `
        <div class="container page-container py-40">
            <div class="auth-card-container">
                <div class="card">
                    <div class="text-center mb-30">
                        <h2>Book Veterinary Consultation</h2>
                        <p class="text-muted">Request professional veterinary care for your pet</p>
                    </div>
                    
                    <form id="booking-form">
                        <div class="form-grid">
                            ${Input({ 
                                label: 'Select Pet', 
                                id: 'petSelect', 
                                name: 'petId', 
                                options: userPets.map(pet => ({ value: pet.id, label: `${pet.name} (${pet.type})` })),
                                placeholder: 'Choose your pet', 
                                required: true 
                            })}
                            
                            ${Input({ 
                                label: 'Visit Type', 
                                id: 'visitType', 
                                name: 'visitType', 
                                options: [
                                    { value: 'home', label: 'Home Visit' },
                                    { value: 'clinic', label: 'Clinic Visit' }
                                ],
                                placeholder: 'Select visit type', 
                                required: true 
                            })}
                            
                            ${Input({ label: 'Preferred Date', id: 'bookingDate', name: 'date', type: 'date', required: true })}
                            ${Input({ label: 'Preferred Time', id: 'bookingTime', name: 'time', type: 'time', required: true })}
                            
                            ${Input({ 
                                label: 'Location', 
                                id: 'bookingLocation', 
                                name: 'location', 
                                placeholder: currentUser.location || 'Enter your location',
                                required: true 
                            })}
                        </div>
                        
                        <div class="form-group mt-20">
                            <label for="problemDescription">Problem Description / Notes</label>
                            <textarea id="problemDescription" name="notes" class="form-input" rows="4" 
                                placeholder="Describe your pet's symptoms or reason for visit..." required></textarea>
                        </div>
                        
                        <div id="booking-alerts" class="mt-20">
                            <!-- Dynamic alerts will be shown here -->
                        </div>
                        
                        <div id="pricing-breakdown" class="card mt-20" style="display: none;">
                            <h4>Cost Breakdown</h4>
                            <div class="pricing-details mt-15">
                                <div class="flex justify-between mb-10">
                                    <span>Base Consultation Fee:</span>
                                    <span id="base-fee">LKR 2,000</span>
                                </div>
                                <div class="flex justify-between mb-10" id="transport-fee-row" style="display: none;">
                                    <span>Home Visit Transport Fee:</span>
                                    <span id="transport-fee">LKR 500</span>
                                </div>
                                <div class="flex justify-between mb-10" id="emergency-fee-row" style="display: none;">
                                    <span>Emergency Fee:</span>
                                    <span id="emergency-fee">LKR 1,500</span>
                                </div>
                                <div class="border-top pt-10 mt-10">
                                    <div class="flex justify-between font-bold">
                                        <span>Total Cost:</span>
                                        <span id="total-cost">LKR 2,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions mt-30">
                            <button type="submit" class="btn btn-primary w-full">
                                <i data-lucide="send"></i> Send Booking Request
                            </button>
                            <a href="#dashboard" class="btn btn-outline w-full mt-10">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};

export const VetBookingDashboardPage = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const bookingRequests = JSON.parse(localStorage.getItem('bookingRequests') || '[]');
    const pendingRequests = bookingRequests.filter(req => req.status === 'pending');
    
    return `
        <div class="container page-container py-40">
            <div class="dashboard-layout">
                <aside class="dashboard-sidebar">
                    <div class="card">
                        <div class="text-center">
                            <div class="avatar" style="width: 80px; height: 80px; margin: 0 auto 20px; font-size: 2rem;">
                                ${currentUser.fullName?.charAt(0).toUpperCase() || 'V'}
                            </div>
                            <h3>${currentUser.fullName || 'Dr. Vet'}</h3>
                            <p class="text-muted">${currentUser.clinic || 'Veterinary Clinic'}</p>
                        </div>
                    </div>

                    <div class="card mt-20">
                        <h4>Availability Settings</h4>
                        <div class="mt-15">
                            <a href="#vet-settings" class="btn btn-outline w-full">
                                <i data-lucide="settings"></i> Configure Settings
                            </a>
                        </div>
                    </div>
                </aside>

                <main class="dashboard-main">
                    <div class="card mb-30">
                        <div class="flex justify-between items-center">
                            <h3>Incoming Booking Requests</h3>
                            <span class="status-badge status-due">${pendingRequests.length} Pending</span>
                        </div>
                        <p class="text-muted text-sm mt-10">Review and respond to booking requests from pet owners.</p>
                    </div>

                    <div class="booking-requests-list" id="booking-requests">
                        ${pendingRequests.length > 0 ? pendingRequests.map(request => `
                            <div class="card booking-request-card mb-20">
                                <div class="booking-request-header">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h4 class="mb-5">Request from ${request.ownerName}</h4>
                                            <div class="booking-meta">
                                                <span class="badge ${request.isEmergency ? 'bg-danger' : 'bg-primary'}">
                                                    ${request.isEmergency ? 'Emergency' : 'Regular'}
                                                </span>
                                                <span class="text-sm text-muted ml-10">
                                                    ${request.visitType === 'home' ? 'Home Visit' : 'Clinic Visit'}
                                                </span>
                                            </div>
                                        </div>
                                        <span class="status-badge status-due">Pending</span>
                                    </div>
                                </div>
                                
                                <div class="booking-details mt-20">
                                    <div class="grid-2">
                                        <div>
                                            <p class="text-sm"><strong>Pet:</strong> ${request.petName}</p>
                                            <p class="text-sm"><strong>Date:</strong> ${request.date}</p>
                                            <p class="text-sm"><strong>Time:</strong> ${request.time}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm"><strong>Location:</strong> ${request.location}</p>
                                            <p class="text-sm"><strong>Contact:</strong> ${request.ownerPhone}</p>
                                            <p class="text-sm"><strong>Estimated Cost:</strong> LKR ${request.totalCost}</p>
                                        </div>
                                    </div>
                                    <div class="mt-15">
                                        <p class="text-sm"><strong>Problem:</strong></p>
                                        <p class="text-sm text-muted">${request.notes}</p>
                                    </div>
                                </div>
                                
                                <div class="booking-actions mt-20">
                                    <button onclick="acceptBooking('${request.id}')" class="btn btn-primary">
                                        <i data-lucide="check"></i> Accept Booking
                                    </button>
                                    <button onclick="rejectBooking('${request.id}')" class="btn btn-outline text-danger ml-10">
                                        <i data-lucide="x"></i> Reject
                                    </button>
                                </div>
                            </div>
                        `).join('') : '<div class="card text-center py-40"><p class="text-muted">No pending booking requests.</p></div>'}
                    </div>
                </main>
            </div>
        </div>
    `;
};

export const VetSettingsPage = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    return `
        <div class="container page-container py-40">
            <div class="auth-card-container">
                <div class="card">
                    <div class="flex items-center gap-10 mb-20">
                        <a href="#vet-dashboard" class="text-primary"><i data-lucide="arrow-left"></i></a>
                        <h3 class="m-0">Availability & Pricing Settings</h3>
                    </div>
                    
                    <form id="vet-settings-form">
                        <div class="form-section">
                            <h4>Service Availability</h4>
                            <div class="form-grid mt-15">
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="acceptsHomeVisits" name="acceptsHomeVisits" 
                                            ${currentUser.acceptsHomeVisits ? 'checked' : ''}>
                                        <span class="checkmark"></span>
                                        Accept Home Visits
                                    </label>
                                </div>
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="acceptsClinicVisits" name="acceptsClinicVisits" 
                                            ${currentUser.acceptsClinicVisits !== false ? 'checked' : ''}>
                                        <span class="checkmark"></span>
                                        Accept Clinic Visits
                                    </label>
                                </div>
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="emergencyAvailability" name="emergencyAvailability" 
                                            ${currentUser.emergencyAvailability ? 'checked' : ''}>
                                        <span class="checkmark"></span>
                                        Emergency Availability (10 PM - 6 AM)
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section mt-30">
                            <h4>Working Hours</h4>
                            <div class="form-grid mt-15">
                                ${Input({ label: 'Start Time', id: 'workStart', name: 'workStart', type: 'time', value: currentUser.workStart || '08:00' })}
                                ${Input({ label: 'End Time', id: 'workEnd', name: 'workEnd', type: 'time', value: currentUser.workEnd || '20:00' })}
                            </div>
                        </div>
                        
                        <div class="form-section mt-30">
                            <h4>Pricing</h4>
                            <div class="form-grid mt-15">
                                ${Input({ label: 'Base Consultation Fee (LKR)', id: 'baseFee', name: 'baseFee', type: 'number', value: currentUser.baseFee || '2000', required: true })}
                                ${Input({ label: 'Home Visit Transport Fee (LKR)', id: 'transportFee', name: 'transportFee', type: 'number', value: currentUser.transportFee || '500' })}
                                ${Input({ label: 'Emergency Fee (LKR)', id: 'emergencyFee', name: 'emergencyFee', type: 'number', value: currentUser.emergencyFee || '1500' })}
                            </div>
                        </div>
                        
                        <div class="form-actions mt-30">
                            <button type="submit" class="btn btn-primary">Save Settings</button>
                            <a href="#vet-dashboard" class="btn btn-outline ml-10">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
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
