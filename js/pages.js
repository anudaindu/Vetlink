import { vaccineTypes, mockVets, cities } from './data.js';

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
    const selectedPet = pets[0]; // Simplified for MVP
    
    return `
        <div class="container page-container py-40">
            <div class="dashboard-layout">
                <aside class="dashboard-sidebar">
                    <div class="card pet-profile-card">
                        <div class="pet-img-large">
                            <img src="${selectedPet.image}" alt="${selectedPet.name}">
                        </div>
                        <div class="pet-info">
                            <h2>${selectedPet.name}</h2>
                            <p>${selectedPet.breed} • ${selectedPet.type}</p>
                            <div class="pet-stats">
                                <div><strong>DOB:</strong> ${selectedPet.dob}</div>
                                <div><strong>Owner:</strong> ${selectedPet.owner}</div>
                            </div>
                        </div>
                        <a href="#add-vaccination" class="btn btn-primary btn-sm w-full mt-20">
                            <i data-lucide="plus"></i> Add Vaccination
                        </a>
                    </div>
                </aside>

                <main class="dashboard-main">
                    <div class="card mb-30">
                        <div class="flex justify-between items-center mb-20">
                            <h3>Vaccination Records</h3>
                            <span class="text-muted text-sm">${selectedPet.vaccinations.length} records found</span>
                        </div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Vaccine Name</th>
                                        <th>Date Given</th>
                                        <th>Next Due</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${selectedPet.vaccinations.map(v => `
                                        <tr>
                                            <td><strong>${v.name}</strong></td>
                                            <td>${v.date}</td>
                                            <td>${v.nextDue}</td>
                                            <td><span class="status-badge status-${v.status}">${v.status === 'done' ? 'Completed' : 'Due'}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card">
                        <h3>Upcoming Reminders</h3>
                        <div class="reminder-list mt-20">
                            ${selectedPet.reminders.map(r => `
                                <div class="reminder-item">
                                    <div class="reminder-icon"><i data-lucide="calendar"></i></div>
                                    <div class="reminder-text">
                                        <h4>${r.title}</h4>
                                        <p>${r.date} • ${r.type}</p>
                                    </div>
                                    <button class="btn btn-icon"><i data-lucide="check"></i></button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
};

export const AddVaccinationPage = () => `
    <div class="container page-container">
        <div class="auth-card-container">
            <div class="card">
                <div class="flex items-center gap-10 mb-20">
                    <a href="#dashboard" class="text-primary"><i data-lucide="arrow-left"></i></a>
                    <h2 class="m-0">Add Vaccination Record</h2>
                </div>
                <form id="add-vaccination-form">
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
                    <div class="form-group">
                        <label for="notes">Notes</label>
                        <textarea id="notes" name="notes" class="form-input" rows="3" placeholder="Additional details..."></textarea>
                    </div>
                    <div class="form-actions mt-20">
                        <button type="submit" class="btn btn-primary w-full">Save Vaccination Record</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

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
