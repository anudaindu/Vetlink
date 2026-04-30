import { 
    HomePage, 
    UserRegistrationPage, 
    LoginPage, 
    PetOwnerDashboardPage, 
    MyPetsPage, 
    RegisterPetPage, 
    FindVetPage, 
    BookVetPage, 
    AccountPage,
    VetDashboardPage,
    IncomingRequestsPage,
    MyPatientsPage,
    SchedulePage,
    VetSettingsPage,
    VetProfilePage,
    RoleSelectionPage,
    AdminAddVetPage
} from './pages.js';
import { mockPets, mockVets } from './data.js';

class VetLinkApp {
    constructor() {
        this.appRoot = document.getElementById('app-root');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinksContainer = document.getElementById('nav-links');
        
        this.state = {
            pets: JSON.parse(localStorage.getItem('pets') || JSON.stringify(mockPets)),
            vets: mockVets,
            currentUser: JSON.parse(localStorage.getItem('currentUser')),
            currentPath: window.location.hash || '#home'
        };

        this.init();
    }

    init() {
        // Global utilities
        window.handleLogout = () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                this.state.currentUser = null;
                window.location.hash = '#home';
                this.updateNavigation();
            }
        };

        window.selectRole = (role) => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            currentUser.role = role;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.state.currentUser = currentUser;
            window.location.hash = role === 'veterinarian' ? '#vet-dashboard' : '#dashboard';
        };

        window.updateBookingStatus = (id, status) => {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const index = bookings.findIndex(b => b.id === id);
            if (index !== -1) {
                bookings[index].status = status;
                localStorage.setItem('bookings', JSON.stringify(bookings));
                this.populateVetDashboard();
                alert(`Booking ${status}!`);
            }
        };

        // Routing
        window.addEventListener('hashchange', () => {
            this.state.currentPath = window.location.hash || '#home';
            this.handleRoute();
        });

        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.onclick = () => {
                this.navLinksContainer.classList.toggle('show-mobile');
                const icon = this.mobileMenuBtn.querySelector('i');
                const isOpen = this.navLinksContainer.classList.contains('show-mobile');
                if (icon) icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            };
        }

        this.handleRoute();
        this.updateNavigation();
    }

    handleRoute() {
        const path = this.state.currentPath.replace('#', '');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        let html = '';

        // Protected paths
        const protectedPaths = ['dashboard', 'my-pets', 'register-pet', 'find-vet', 'book-vet', 'account', 'vet-dashboard', 'incoming-requests', 'my-patients', 'schedule', 'settings', 'profile', 'role-selection'];
        
        if (protectedPaths.includes(path) && (!currentUser || !currentUser.id)) {
            window.location.hash = '#login';
            return;
        }

        // Auto-redirect from role-selection if role already set
        if (path === 'role-selection' && currentUser.role) {
            window.location.hash = currentUser.role === 'veterinarian' ? '#vet-dashboard' : '#dashboard';
            return;
        }

        // UI Visibility
        const isDashboard = protectedPaths.includes(path) && path !== 'role-selection';
        const isAdmin = path.startsWith('admin');
        const navbar = document.querySelector('.navbar');
        const footer = document.querySelector('.footer');
        
        if (navbar) navbar.style.display = (isDashboard || isAdmin) ? 'none' : 'flex';
        if (footer) footer.style.display = (isDashboard || (isAdmin && path !== 'admin-login')) ? 'none' : 'block';

        switch (path) {
            case '':
            case 'home': html = HomePage(); break;
            case 'user-register': html = UserRegistrationPage(); break;
            case 'login': html = LoginPage(); break;
            case 'role-selection': html = RoleSelectionPage(); break;
            case 'dashboard': 
                if (currentUser.role === 'veterinarian') { window.location.hash = '#vet-dashboard'; return; }
                html = PetOwnerDashboardPage(); 
                break;
            case 'my-pets': html = MyPetsPage(); break;
            case 'register-pet': html = RegisterPetPage(); break;
            case 'find-vet': html = FindVetPage(); break;
            case 'book-vet': html = BookVetPage(); break;
            case 'account': html = AccountPage(); break;
            case 'vet-dashboard': 
                if (currentUser.role === 'pet-owner') { window.location.hash = '#dashboard'; return; }
                html = VetDashboardPage(); 
                break;
            case 'incoming-requests': html = IncomingRequestsPage(); break;
            case 'my-patients': html = MyPatientsPage(); break;
            case 'schedule': html = SchedulePage(); break;
            case 'settings': html = VetSettingsPage(); break;
            case 'profile': html = VetProfilePage(); break;
            case 'admin-add-vet': html = AdminAddVetPage(); break;
            default: html = HomePage();
        }

        this.render(html);
        this.attachEventListeners(path);
        this.handleDashboardUI(path);
    }

    render(html) {
        this.appRoot.innerHTML = html;
        lucide.createIcons();
        this.updateNavigation();
        window.scrollTo(0, 0);
    }

    attachEventListeners(path) {
        // Forms
        const forms = {
            'user-registration-form': (e) => this.handleUserRegistration(e),
            'login-form': (e) => this.handleLogin(e),
            'register-pet-form': (e) => this.handleRegisterPet(e),
            'booking-form': (e) => this.handleBookingSubmit(e),
            'profile-edit-form': (e) => this.handleProfileUpdate(e)
        };

        Object.entries(forms).forEach(([id, handler]) => {
            const form = document.getElementById(id);
            if (form) form.onsubmit = handler;
        });

        // Search
        const searchInput = document.getElementById('vet-search-input');
        if (searchInput) searchInput.oninput = (e) => this.handleVetSearch(e);
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
            registeredAt: new Date().toISOString(),
            role: null
        };

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.hash = '#role-selection';
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
            window.location.hash = user.role ? (user.role === 'veterinarian' ? '#vet-dashboard' : '#dashboard') : '#role-selection';
        } else {
            alert('Invalid credentials.');
        }
    }

    handleRegisterPet(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        const newPet = {
            id: `VL-${Math.floor(1000 + Math.random() * 9000)}`,
            name: formData.get('petName'),
            type: formData.get('petType'),
            breed: formData.get('breed'),
            dob: formData.get('dob'),
            owner: currentUser.fullName,
            ownerId: currentUser.id,
            image: 'https://images.unsplash.com/photo-1543466835-00a732f3b95c?auto=format&fit=crop&q=80&w=200&h=200',
            vaccinations: []
        };

        const pets = JSON.parse(localStorage.getItem('pets') || '[]');
        pets.push(newPet);
        localStorage.setItem('pets', JSON.stringify(pets));
        alert('Pet Registered!');
        window.location.hash = '#my-pets';
    }

    handleVetSearch(e) {
        const query = e.target.value.toLowerCase();
        const filteredVets = this.state.vets.filter(v => 
            v.name.toLowerCase().includes(query) || v.clinic.toLowerCase().includes(query)
        );
        const grid = document.getElementById('vet-results-grid');
        if (grid) {
            grid.innerHTML = filteredVets.map(v => `
                <div class="card vet-card">
                    <h3>${v.name}</h3>
                    <p>${v.clinic}</p>
                    <button class="btn btn-outline w-full mt-10" onclick="location.hash='#book-vet'">Book</button>
                </div>
            `).join('');
        }
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const booking = {
            id: 'BK-' + Date.now(),
            petName: formData.get('petName'),
            vetName: formData.get('vetName'),
            date: formData.get('date'),
            time: formData.get('time'),
            reason: formData.get('reason'),
            status: 'pending',
            ownerId: currentUser.id,
            ownerName: currentUser.fullName
        };
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        alert('Booking sent!');
        window.location.hash = '#dashboard';
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const updated = { ...currentUser, fullName: formData.get('fullName'), email: formData.get('email') };
        localStorage.setItem('currentUser', JSON.stringify(updated));
        alert('Profile updated!');
    }

    handleDashboardUI(path) {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (toggle && sidebar) toggle.onclick = () => sidebar.classList.toggle('show');

        if (path === 'dashboard') this.populatePetOwnerDashboard();
        if (path === 'vet-dashboard') this.populateVetDashboard();
        
        // Active Nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${path}`);
        });
    }

    populatePetOwnerDashboard() {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const pets = JSON.parse(localStorage.getItem('pets') || '[]');
        const userPets = pets.filter(p => p.ownerId === user.id);
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const userBookings = bookings.filter(b => b.ownerId === user.id);

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('dash-total-pets', userPets.length);
        set('dash-approved-bookings', userBookings.filter(b => b.status === 'approved').length);

        const list = document.getElementById('upcoming-activities');
        if (list) {
            list.innerHTML = userBookings.length ? userBookings.map(b => `
                <div class="activity-item">
                    <div class="activity-details">
                        <strong>${b.petName}</strong> - ${b.date}
                    </div>
                    <span class="status-badge ${b.status}">${b.status}</span>
                </div>
            `).join('') : '<p class="text-muted">No activities.</p>';
        }
    }

    populateVetDashboard() {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const pending = bookings.filter(b => b.status === 'pending');
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('vet-total-requests', pending.length);

        const list = document.getElementById('incoming-requests-list');
        if (list) {
            list.innerHTML = pending.length ? pending.map(b => `
                <div class="request-card">
                    <h4>${b.petName}</h4>
                    <p>${b.reason}</p>
                    <div class="flex gap-10">
                        <button class="btn btn-primary btn-sm" onclick="updateBookingStatus('${b.id}', 'approved')">Approve</button>
                        <button class="btn btn-outline btn-sm" onclick="updateBookingStatus('${b.id}', 'rejected')">Reject</button>
                    </div>
                </div>
            `).join('') : '<p class="text-muted">No requests.</p>';
        }
    }

    updateNavigation() {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const profileLink = document.getElementById('profile-link');

        if (user && user.id) {
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (profileLink) {
                profileLink.style.display = 'block';
                profileLink.href = user.role ? (user.role === 'veterinarian' ? '#vet-dashboard' : '#dashboard') : '#role-selection';
                profileLink.textContent = 'My Dashboard';
            }
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (profileLink) profileLink.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new VetLinkApp());
