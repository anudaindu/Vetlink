import re

with open('/Users/anudahettiarachchi/Downloads/Vetlink/frontend/js/app-fixed.js', 'r') as f:
    content = f.read()

pages_code = """
const BookingPage = () => {
    return `<div class="container page-container py-40">
        <div class="section-header text-center mb-40">
            <h2>Book a Veterinarian</h2>
            <p>Schedule a home visit or clinic appointment.</p>
        </div>
        <div class="card mx-auto" style="max-width: 600px;">
            <form id="booking-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Select Pet *</label>
                        <select id="petId" name="petId" class="form-select" required>
                            <option value="">Select your pet</option>
                            <option value="PET-101">Max - Golden Retriever</option>
                            <option value="PET-102">Luna - Persian</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Visit Type *</label>
                        <select id="visitType" name="visitType" class="form-select" required>
                            <option value="clinic">Clinic Visit</option>
                            <option value="home">Home Visit (+ LKR 500 Transport)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date *</label>
                        <input type="date" id="bookingDate" name="date" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Time *</label>
                        <input type="time" id="bookingTime" name="time" class="form-input" required>
                    </div>
                </div>
                <div class="mt-20">
                    <label>Symptoms / Notes</label>
                    <textarea name="notes" class="form-input mt-5" rows="3" placeholder="Describe the reason for the visit"></textarea>
                </div>
                <div id="booking-alerts" class="mt-20"></div>
                <div id="pricing-breakdown" class="mt-20 p-20 bg-gray-light rounded-lg" style="display:none;">
                    <h4>Pricing Estimate</h4>
                    <div class="flex justify-between mt-10"><span>Base Fee</span><span id="base-fee"></span></div>
                    <div class="flex justify-between mt-10" id="transport-fee-row"><span>Transport Fee</span><span id="transport-fee"></span></div>
                    <div class="flex justify-between mt-10 text-danger" id="emergency-fee-row"><span>Emergency Fee</span><span id="emergency-fee"></span></div>
                    <hr class="my-10">
                    <div class="flex justify-between font-bold"><span>Total Estimate</span><span id="total-cost"></span></div>
                </div>
                <button type="submit" class="btn btn-primary w-full mt-20">Confirm Booking</button>
            </form>
        </div>
    </div>`;
};

const MyPetsPage = () => {
    return `<div class="container page-container py-40">
        <h1 class="mb-30">My Pets</h1>
        <div class="card mb-15">
            <div class="flex items-center gap-15">
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100&h=100" class="rounded" style="width:60px;height:60px;border-radius:8px;">
                <div>
                    <h4 class="m-0">Max</h4>
                    <p class="text-sm text-muted">Golden Retriever • Dog</p>
                    <p class="text-xs text-muted">ID: PET-101</p>
                </div>
                <div class="flex gap-10 ml-auto">
                    <a href="#vaccination-book" class="btn btn-outline btn-sm">Vaccination Book</a>
                    <a href="#dashboard" class="btn btn-primary btn-sm">View Details</a>
                </div>
            </div>
        </div>
    </div>`;
};

const VetRequestsPage = () => {
    return `<div class="container page-container py-40">
        <div class="flex items-center gap-15 mb-30">
            <a href="#vet-dashboard" class="btn btn-icon-sm"><i data-lucide="arrow-left"></i></a>
            <h1 class="m-0">Incoming Requests</h1>
        </div>
        <div class="card mb-20">
            <div class="flex justify-between items-center mb-10">
                <div>
                    <h4>Home Visit</h4>
                    <p class="text-sm">Max (Golden Retriever) - 10:00 AM, Oct 25</p>
                    <p class="text-muted text-sm">Owner: Anuda H (077 123 4567)</p>
                </div>
                <div class="flex gap-10">
                    <button class="btn btn-primary btn-sm" onclick="alert('Accepted')">Accept</button>
                    <button class="btn btn-outline btn-sm text-danger" onclick="alert('Rejected')">Reject</button>
                </div>
            </div>
        </div>
    </div>`;
};

const VetPatientsPage = () => {
    return `<div class="container page-container py-40">
        <h1 class="mb-30">My Patients</h1>
        <div class="card">
            <div class="flex items-center gap-15 mb-15">
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100&h=100" class="rounded" style="width:50px;height:50px;border-radius:50%;">
                <div>
                    <h4 class="m-0">Max (PET-101)</h4>
                    <p class="text-sm text-muted">Golden Retriever • Owner: Anuda H</p>
                </div>
                <button class="btn btn-outline btn-sm ml-auto">View Records</button>
            </div>
        </div>
    </div>`;
};

const VetSchedulePage = () => {
    return `<div class="container page-container py-40">
        <h1 class="mb-30">My Schedule</h1>
        <div class="card text-center py-40">
            <i data-lucide="calendar" style="width:64px;height:64px;opacity:0.2;"></i>
            <p class="text-muted mt-20">Calendar integration and schedule view coming soon.</p>
        </div>
    </div>`;
};

const VetSettingsPage = () => {
    return `<div class="container page-container py-40">
        <h1 class="mb-30">Settings & Profile</h1>
        <div class="card">
            <h3 class="mb-20">Working Hours & Preferences</h3>
            <form id="vet-settings-form">
                <div class="form-grid">
                    <div class="form-group"><label>Work Start</label><input type="time" name="workStart" class="form-input" value="09:00"></div>
                    <div class="form-group"><label>Work End</label><input type="time" name="workEnd" class="form-input" value="17:00"></div>
                    <div class="form-group"><label>Base Fee (LKR)</label><input type="number" name="baseFee" class="form-input" value="2000"></div>
                </div>
                <button type="submit" class="btn btn-primary mt-20">Save Settings</button>
            </form>
        </div>
    </div>`;
};
"""

content = content.replace('// Main App', pages_code + '\n// Main App')

handle_route_new = """
    handleRoute() {
        const path = this.state.currentPath.replace('#', '');
        let html = '';

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + (path || 'home')) {
                link.classList.add('active');
            }
        });

        const navbar = document.querySelector('.navbar');
        const footer = document.querySelector('.footer');
        if (navbar) navbar.style.display = 'flex';
        if (footer) footer.style.display = 'block';

        switch (path) {
            case '':
            case 'home': html = RoleSelectionPage(); break;
            case 'user-register': html = UserRegistrationPage(); break;
            case 'vet-login': html = VetLoginPage(); break;
            case 'register': html = RegisterPetPage(); break;
            case 'dashboard': html = DashboardPage(this.state.pets); break;
            case 'profile': html = UserProfilePage(); break;
            case 'my-pets': html = MyPetsPage(); break;
            case 'vaccination-book': html = VaccinationBookPage(this.state.pets[0]); break;
            case 'vets': html = FindVetPage(this.state.vets); break;
            case 'booking': html = BookingPage(); break;
            case 'vet-dashboard': html = VetDashboardPage(); break;
            case 'vet-requests': html = VetRequestsPage(); break;
            case 'vet-patients': html = VetPatientsPage(); break;
            case 'vet-schedule': html = VetSchedulePage(); break;
            case 'vet-settings': html = VetSettingsPage(); break;
            case 'vet-add-vaccination': html = VetAddVaccinationPage(); break;
            case 'vet-add-treatment': html = VetAddTreatmentPage(); break;
            case 'login': html = LoginPage(); break;
            case 'logout': handleLogout(); break;
            case 'vet-logout': handleVetLogout(); break;
            default: html = RoleSelectionPage();
        }

        this.render(html);
        this.attachEventListeners(path);
    }
"""

content = re.sub(r'handleRoute\(\) \{.*?(?=\n    updateNavigation\(\) \{)', handle_route_new.strip() + '\n\n', content, flags=re.DOTALL)

update_nav_new = """
    updateNavigation() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentVet = JSON.parse(localStorage.getItem('currentVet'));
        
        let navHtml = '';
        
        if (currentVet && currentVet.id) {
            // Veterinarian Navigation
            navHtml = `
                <li><a href="#vet-dashboard" class="active">Dashboard</a></li>
                <li><a href="#vet-requests">Incoming Requests</a></li>
                <li><a href="#vet-patients">My Patients</a></li>
                <li><a href="#vet-schedule">Schedule</a></li>
                <li><a href="#vet-settings">Settings</a></li>
                <li><a href="#profile" class="btn-login">Dr. ${currentVet.name.split(' ')[1]}</a></li>
                <li><a href="#vet-logout" class="btn-login text-danger" style="background:#fee2e2;color:#dc2626!important;">Logout</a></li>
            `;
        } else if (currentUser && currentUser.id) {
            // Pet Owner Navigation
            navHtml = `
                <li><a href="#dashboard" class="active">Dashboard</a></li>
                <li><a href="#my-pets">My Pets</a></li>
                <li><a href="#register">Register Pet</a></li>
                <li><a href="#vets">Find Vet</a></li>
                <li><a href="#booking">Book Vet</a></li>
                <li><a href="#profile" class="btn-login">${currentUser.fullName.split(' ')[0]}</a></li>
                <li><a href="#logout" class="btn-login text-danger" style="background:#fee2e2;color:#dc2626!important;">Logout</a></li>
            `;
        } else {
            // Public Navigation
            navHtml = `
                <li><a href="#home" class="active">About Us</a></li>
                <li><a href="#vets">Services</a></li>
                <li><a href="#home">Help</a></li>
                <li><a href="#login" class="btn-login" id="login-link">Login / Get Started</a></li>
            `;
        }
        
        if (this.navLinksContainer) {
            this.navLinksContainer.innerHTML = navHtml;
            // Update navLinks array for highlighting
            this.navLinks = this.navLinksContainer.querySelectorAll('a');
        }
    }
"""

content = re.sub(r'updateNavigation\(\) \{.*?(?=\n    render\(html\))', update_nav_new.strip() + '\n\n', content, flags=re.DOTALL)

with open('/Users/anudahettiarachchi/Downloads/Vetlink/frontend/js/app-fixed.js', 'w') as f:
    f.write(content)

print("Patched app-fixed.js successfully.")
