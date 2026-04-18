import { HomePage, RegisterPetPage, DashboardPage, AddVaccinationPage, FindVetPage, LoginPage, UserRegistrationPage, UserProfilePage, AdminLoginPage, AdminDashboardPage, AdminManageVetsPage, AdminAddVetPage, VaccinationBookPage } from './pages.js';
import { mockPets, mockVets } from './data.js';
import { FirebaseService } from './firebase-service.js';

class VetLinkApp {
    constructor() {
        this.appRoot = document.getElementById('app-root');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinksContainer = document.getElementById('nav-links');
        
        this.state = {
            pets: mockPets, // Fallback to mock data initially
            vets: mockVets,
            currentUser: null,
            currentPath: window.location.hash || '#home',
            isFirebaseReady: false
        };

        this.init();
    }

    async init() {
        // Update navigation based on login status
        this.updateNavigation();

        // Initialize Firebase Sync
        try {
            FirebaseService.subscribeToPets((pets) => {
                this.state.pets = pets.length > 0 ? pets : mockPets;
                this.state.isFirebaseReady = true;
                this.handleRoute(); // Re-render when data arrives
            });
        } catch (error) {
            console.warn("Firebase not configured, using local mock data.");
        }

        // Handle initial routing
        this.handleRoute();

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.state.currentPath = window.location.hash || '#home';
            this.handleRoute();
        });

        // Mobile menu toggle
        this.mobileMenuBtn.addEventListener('click', () => {
            this.navLinksContainer.classList.toggle('show-mobile');
            const icon = this.mobileMenuBtn.querySelector('i');
            const isOpen = this.navLinksContainer.classList.contains('show-mobile');
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            lucide.createIcons();
        });

        // Close mobile menu on link click
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

        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${path || 'home'}`) {
                link.classList.add('active');
            }
        });

        // Toggle Navbar/Footer for Admin
        const isAdmin = path.startsWith('admin');
        const navbar = document.querySelector('.navbar');
        const footer = document.querySelector('.footer');
        if (navbar) navbar.style.display = isAdmin ? 'none' : 'flex';
        if (footer) footer.style.display = (isAdmin && path !== 'admin-login') ? 'none' : 'block';

        switch (path) {
            case '':
            case 'home':
                html = HomePage();
                break;
            case 'user-register':
                html = UserRegistrationPage();
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
            case 'add-vaccination':
                html = AddVaccinationPage();
                break;
            case 'vets':
                html = FindVetPage(this.state.vets);
                break;
            case 'login':
                html = LoginPage();
                break;
            case 'admin-login':
                html = AdminLoginPage();
                break;
            case 'admin-dashboard':
                html = AdminDashboardPage(this.calculateStats());
                break;
            case 'admin-vets':
                html = AdminManageVetsPage(this.state.vets);
                break;
            case 'admin-add-vet':
                html = AdminAddVetPage();
                break;
            case 'vaccination-book':
                html = VaccinationBookPage(this.state.pets[0]); // Simplified to first pet for MVP
                break;
            default:
                html = HomePage();
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
            // User is logged in
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (profileLink) {
                profileLink.style.display = 'block';
                profileLink.textContent = currentUser.fullName.split(' ')[0]; // Show first name
            }
        } else {
            // User is not logged in
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (profileLink) profileLink.style.display = 'none';
        }
    }

    calculateStats() {
        return {
            vets: this.state.vets.length,
            pets: this.state.pets.length,
            records: this.state.pets.reduce((acc, pet) => acc + pet.vaccinations.length, 0)
        };
    }

    render(html) {
        this.appRoot.innerHTML = html;
        // Re-initialize Lucide icons after rendering new content
        lucide.createIcons();
        // Update navigation based on login status
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

        if (path === 'register') {
            const form = document.getElementById('register-pet-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleRegisterPet(e));
            }
        }
        
        if (path === 'add-vaccination') {
            const form = document.getElementById('add-vaccination-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleAddVaccination(e));
            }
        }

        if (path === 'admin-login') {
            const form = document.getElementById('admin-login-form');
            if (form) form.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }

        if (path === 'admin-add-vet') {
            const form = document.getElementById('add-vet-form');
            if (form) form.addEventListener('submit', (e) => this.handleAddVet(e));
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
    }

    handleUserRegistration(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Validate passwords match
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
            password: formData.get('password'), // In production, this should be hashed
            registeredAt: new Date().toISOString()
        };

        // Store user in localStorage (for demo purposes)
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login after registration
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        alert('Account created successfully! Welcome to VetLink!');
        window.location.hash = '#profile';
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Get users from localStorage
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
        
        // Update user pets list
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

        // Update stats
        const totalPetsElement = document.getElementById('total-pets');
        const totalRecordsElement = document.getElementById('total-records');
        
        if (totalPetsElement) totalPetsElement.textContent = userPets.length;
        if (totalRecordsElement) {
            const totalRecords = userPets.reduce((acc, pet) => acc + (pet.vaccinations?.length || 0), 0);
            totalRecordsElement.textContent = totalRecords;
        }
    }

    handleAdminLogin(e) {
        e.preventDefault();
        // Mock validation
        alert('Admin logged in successfully!');
        window.location.hash = '#admin-dashboard';
    }

    handleAddVet(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newVet = {
            id: 'vet' + (this.state.vets.length + 1),
            name: formData.get('name'),
            clinic: formData.get('clinic'),
            location: formData.get('location'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            specialty: 'General Practice', // Default
            rating: 5.0,
            status: 'Active'
        };

        this.state.vets.push(newVet);
        // Persist vets if you want, but for now we keep in mem for session
        alert('New Veterinary Surgeon added successfully!');
        window.location.hash = '#admin-vets';
    }

    async handleRegisterPet(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPet = {
            id: `VL-${Math.floor(1000 + Math.random() * 9000)}`,
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

        try {
            await FirebaseService.addPet(newPet);
            alert('Pet Registered Successfully (Cloud Synced)!');
        } catch (error) {
            this.state.pets.unshift(newPet); // Local fallback
            alert('Pet Registered locally (Firebase not configured)');
        }
        
        window.location.hash = '#dashboard';
    }

    async handleAddVaccination(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newRecord = {
            id: Date.now().toString(),
            name: formData.get('vaccineName'),
            date: formData.get('dateGiven'),
            nextDue: formData.get('nextDue'),
            batchNumber: formData.get('batchNumber'),
            vetName: formData.get('vetName'),
            clinicName: formData.get('clinicName'),
            notes: formData.get('notes'),
            status: 'done'
        };

        try {
            // For MVP, we add to the first pet
            const targetPetId = this.state.pets[0].id;
            await FirebaseService.addVaccinationRecord(targetPetId, newRecord);
            alert('Vaccination record added to cloud!');
        } catch (error) {
            this.state.pets[0].vaccinations.unshift(newRecord);
            alert('Record saved locally (Firebase not configured)');
        }
        
        window.location.hash = '#vaccination-book';
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

}

// Mobile Menu specific CSS to be injected if not already in style.css
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

// Global logout function
window.handleLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully.');
        window.location.hash = '#home';
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new VetLinkApp();
});
