import { HomePage, RegisterPetPage, DashboardPage, AddVaccinationPage, FindVetPage, LoginPage, AdminLoginPage, AdminDashboardPage, AdminManageVetsPage, AdminAddVetPage, VaccinationBookPage } from './pages.js';

class VetLinkApp {
    constructor() {
        this.appRoot = document.getElementById('app-root');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinksContainer = document.getElementById('nav-links');
        
        this.state = {
            pets: JSON.parse(localStorage.getItem('vetlink_pets')) || mockPets,
            vets: mockVets,
            currentUser: null,
            currentPath: window.location.hash || '#home'
        };

        this.init();
    }

    init() {
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
            case 'register':
                html = RegisterPetPage();
                break;
            case 'dashboard':
                html = DashboardPage(this.state.pets);
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
        window.scrollTo(0, 0);
    }

    attachEventListeners(path) {
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

    handleRegisterPet(e) {
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
            image: 'https://images.unsplash.com/photo-1543466835-00a732f3b95c?auto=format&fit=crop&q=80&w=200&h=200', // Default placeholder
            vaccinations: [],
            reminders: []
        };

        this.state.pets.unshift(newPet);
        this.saveState();
        alert('Pet Registered Successfully!');
        window.location.hash = '#dashboard';
    }

    handleAddVaccination(e) {
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

        // For MVP, we add to the first pet
        this.state.pets[0].vaccinations.unshift(newRecord);
        this.saveState();
        alert('Vaccination record added to book!');
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

    saveState() {
        localStorage.setItem('vetlink_pets', JSON.stringify(this.state.pets));
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new VetLinkApp();
});
