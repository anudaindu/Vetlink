import os
import json

base_dir = "/Users/anudahettiarachchi/Downloads/Vetlink"
os.makedirs(base_dir, exist_ok=True)

nav_html = """
        <aside class="dashboard-sidebar">
            <div class="sidebar-header">
                <div class="logo-container">
                    <img src="assets/logo.png" alt="VetLink Logo" class="logo-img" style="height: 40px;">
                </div>
            </div>
            <nav class="sidebar-nav">
                <a href="dashboard.html" class="nav-item {dashboard_active}">
                    <i data-lucide="layout-dashboard"></i><span>Dashboard</span>
                </a>
                <a href="my-pets.html" class="nav-item {my_pets_active}">
                    <i data-lucide="dog"></i><span>My Pets</span>
                </a>
                <a href="register-pet.html" class="nav-item {register_pet_active}">
                    <i data-lucide="plus-circle"></i><span>Register Pet</span>
                </a>
                <a href="find-vet.html" class="nav-item {find_vet_active}">
                    <i data-lucide="search"></i><span>Find Vet</span>
                </a>
                <a href="book-vet.html" class="nav-item {book_vet_active}">
                    <i data-lucide="calendar-plus"></i><span>Book Vet</span>
                </a>
                <a href="account.html" class="nav-item {account_active}">
                    <i data-lucide="user"></i><span>Account</span>
                </a>
                <a href="#" class="nav-item text-danger" id="logout-btn">
                    <i data-lucide="log-out"></i><span>Logout</span>
                </a>
            </nav>
        </aside>
"""

header_html = """
            <header class="dashboard-top-nav">
                <div class="mobile-menu-toggle" id="mobile-menu-btn">
                    <i data-lucide="menu"></i>
                </div>
                <div class="top-nav-right">
                    <div class="user-info">
                        <span id="user-name-display">User</span>
                        <div class="avatar-sm" id="user-avatar-display">U</div>
                    </div>
                </div>
            </header>
"""

def generate_page(filename, title, active_nav, content_html, js_logic):
    filepath = os.path.join(base_dir, filename)
    nav = nav_html.format(
        dashboard_active="active" if active_nav == "dashboard" else "",
        my_pets_active="active" if active_nav == "my-pets" else "",
        register_pet_active="active" if active_nav == "register-pet" else "",
        find_vet_active="active" if active_nav == "find-vet" else "",
        book_vet_active="active" if active_nav == "book-vet" else "",
        account_active="active" if active_nav == "account" else "",
    )
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - VetLink</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard-container">
{nav}
        <main class="dashboard-main">
{header_html}
            <div class="dashboard-content fade-in">
{content_html}
            </div>
        </main>
    </div>

    <script src="js/notifications.js"></script>
    <script src="js/common.js"></script>
    <script>
{js_logic}
    </script>
</body>
</html>
"""
    with open(filepath, 'w') as f:
        f.write(html)

# 1. Dashboard
dashboard_content = """
                <div class="dashboard-welcome mb-20">
                    <h1 id="welcome-title">Welcome back! 👋</h1>
                    <p class="text-muted" id="welcome-subtitle">Here's what's happening with your pets today.</p>
                </div>
                
                <div class="flex gap-10 mb-20">
                    <a href="register-pet.html" class="btn btn-primary">Add New Pet</a>
                    <a href="book-vet.html" class="btn btn-outline">Book a Vet</a>
                </div>

                <div class="grid-2-1 gap-20">
                    <div class="card">
                        <div class="card-header-flex mb-15 flex items-center" style="justify-content: space-between;">
                            <h3 style="margin:0">My Pets & Recent History</h3>
                            <a href="my-pets.html" class="text-sm text-primary">View All</a>
                        </div>
                        <div id="dashboard-pets-list" class="activity-list"></div>
                    </div>
                    
                    <div class="card">
                        <h3 class="mb-15">Quick Access</h3>
                        <div class="quick-access-grid">
                            <a href="find-vet.html" class="quick-access-item text-center p-15" style="display:block; border:1px solid #eee; border-radius:8px; margin-bottom:10px; text-decoration:none;">
                                <i data-lucide="search" class="mb-10 text-primary mx-auto"></i>
                                <span>Find New Vet</span>
                            </a>
                            <a href="book-vet.html" class="quick-access-item text-center p-15" style="display:block; border:1px solid #eee; border-radius:8px; margin-bottom:10px; text-decoration:none;">
                                <i data-lucide="calendar-plus" class="mb-10 text-primary mx-auto"></i>
                                <span>Re-book Last Vet</span>
                            </a>
                            <a href="account.html" class="quick-access-item text-center p-15" style="display:block; border:1px solid #eee; border-radius:8px; text-decoration:none;">
                                <i data-lucide="user" class="mb-10 text-primary mx-auto"></i>
                                <span>My Account</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="card mt-20">
                    <h3 class="mb-15">Last Vaccination Details</h3>
                    <div id="last-vacc-summary">
                        <p class="text-muted">Loading...</p>
                    </div>
                </div>
"""
dashboard_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            const currentUser = VetLink.getCurrentUser();
            document.getElementById('welcome-title').textContent = `Welcome back, ${currentUser.fullName}! 👋`;

            const allPets = VetLink.getPets() || [];
            const userPets = allPets.filter(p => p.ownerId === currentUser.id);

            const petsListEl = document.getElementById('dashboard-pets-list');
            if (userPets.length === 0) {
                petsListEl.innerHTML = '<p class="text-muted">No pets registered yet.</p>';
            } else {
                let html = '';
                userPets.slice(0, 3).forEach(pet => {
                    const lastVacc = pet.vaccinations && pet.vaccinations.length > 0 
                        ? pet.vaccinations[pet.vaccinations.length - 1].date 
                        : 'No records';
                    html += `
                        <div class="history-item flex items-center mb-10" style="cursor:pointer; padding:10px; border-bottom:1px solid #eee;" onclick="window.location.href='pet-details.html?id=${pet.id}'">
                            <div class="pet-avatar-sm mr-15" style="width:40px;height:40px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;margin-right:15px;"><i data-lucide="dog"></i></div>
                            <div class="history-info flex-1">
                                <h4 style="margin:0">${pet.name}</h4>
                                <p class="text-xs text-muted" style="margin:0">${pet.type} • ${pet.breed}</p>
                            </div>
                            <div class="text-xs text-muted">
                                Last Vacc: ${lastVacc}
                            </div>
                        </div>
                    `;
                });
                petsListEl.innerHTML = html;
                lucide.createIcons();
            }

            const vaccSummaryEl = document.getElementById('last-vacc-summary');
            let lastVaccRecord = null;
            let lastVaccPet = null;

            userPets.forEach(pet => {
                if (pet.vaccinations && pet.vaccinations.length > 0) {
                    const vacc = pet.vaccinations[pet.vaccinations.length - 1];
                    if (!lastVaccRecord || new Date(vacc.date) > new Date(lastVaccRecord.date)) {
                        lastVaccRecord = vacc;
                        lastVaccPet = pet;
                    }
                }
            });

            if (lastVaccRecord) {
                vaccSummaryEl.innerHTML = `
                    <p><strong>${lastVaccPet.name}</strong> received <strong>${lastVaccRecord.vaccine || 'vaccine'}</strong> on ${lastVaccRecord.date} from ${lastVaccRecord.veterinarian || lastVaccRecord.vet || 'Vet'}.</p>
                    <p class="text-sm text-muted">Next due: ${lastVaccRecord.nextDue || 'N/A'}</p>
                `;
            } else {
                vaccSummaryEl.innerHTML = '<p class="text-muted">No recent vaccinations found.</p>';
            }
        });
"""
generate_page('dashboard.html', 'Dashboard', 'dashboard', dashboard_content, dashboard_js)

# 2. My Pets
mypets_content = """
                <div class="page-header flex items-center mb-20" style="justify-content: space-between;">
                    <h1 style="margin:0">My Pets</h1>
                    <a href="register-pet.html" class="btn btn-primary">Register New Pet</a>
                </div>
                <div id="pets-grid" class="pets-grid grid-3 gap-20">
                    <!-- JS populates -->
                </div>
"""
mypets_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            const currentUser = VetLink.getCurrentUser();
            const allPets = VetLink.getPets() || [];
            const userPets = allPets.filter(p => p.ownerId === currentUser.id);

            const grid = document.getElementById('pets-grid');
            
            if (userPets.length === 0) {
                grid.innerHTML = `
                    <div class="card text-center col-span-full py-40">
                        <i data-lucide="dog" style="width:48px;height:48px;margin:0 auto 15px;" class="text-muted"></i>
                        <h3 class="mb-10">No pets registered yet</h3>
                        <p class="text-muted mb-20">Register your first pet to get started tracking their health!</p>
                        <a href="register-pet.html" class="btn btn-primary">Register your first pet!</a>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            let html = '';
            userPets.forEach(pet => {
                html += `
                    <div class="card feature-card text-center">
                        <div class="avatar-sm mx-auto mb-15" style="width:60px;height:60px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;">
                            <i data-lucide="dog"></i>
                        </div>
                        <h3 class="mb-5">${pet.name}</h3>
                        <p class="text-sm text-muted mb-15">${pet.type} • ${pet.breed}</p>
                        <a href="pet-details.html?id=${pet.id}" class="btn btn-outline btn-sm w-full">View History &rarr;</a>
                    </div>
                `;
            });
            grid.innerHTML = html;
            lucide.createIcons();
        });
"""
generate_page('my-pets.html', 'My Pets', 'my-pets', mypets_content, mypets_js)

# 3. Pet Details
petdetails_content = """
                <div class="mb-20">
                    <a href="my-pets.html" class="btn btn-outline btn-sm mb-15">&larr; Back to My Pets</a>
                    <div class="flex items-center" style="justify-content: space-between;">
                        <div>
                            <h1 id="pet-name" style="margin:0 0 5px;">Pet Name</h1>
                            <p class="text-muted" id="pet-type-breed" style="margin:0;">Type • Breed</p>
                        </div>
                        <a href="book-vet.html" class="btn btn-primary">Book Appointment</a>
                    </div>
                </div>

                <div class="grid-3 gap-20 mb-20">
                    <div class="card stat-card">
                        <p class="stat-label">Age</p>
                        <h3 class="stat-value" id="pet-age">-</h3>
                    </div>
                    <div class="card stat-card">
                        <p class="stat-label">Last Vaccination</p>
                        <h3 class="stat-value" id="pet-last-vacc">-</h3>
                    </div>
                    <div class="card stat-card">
                        <p class="stat-label">Pet ID</p>
                        <h3 class="stat-value text-sm" id="pet-id-display">-</h3>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header-flex mb-15 flex items-center" style="justify-content: space-between;">
                        <h3 style="margin:0">Vaccination Book</h3>
                        <button class="btn btn-outline btn-sm" onclick="window.print()">Download PDF</button>
                    </div>
                    <div class="table-container">
                        <table class="admin-table w-full" style="text-align: left;">
                            <thead>
                                <tr>
                                    <th>Vaccine</th>
                                    <th>Date</th>
                                    <th>Veterinarian</th>
                                    <th>Status</th>
                                    <th>Next Due</th>
                                </tr>
                            </thead>
                            <tbody id="vaccination-list">
                                <!-- JS Populates -->
                            </tbody>
                        </table>
                    </div>
                </div>
"""
petdetails_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            const petId = VetLink.getParam('id');
            const allPets = VetLink.getPets() || [];
            const pet = allPets.find(p => p.id === petId);

            if (!pet) {
                showToast('Pet not found.', 'error');
                setTimeout(() => window.location.href = 'my-pets.html', 1500);
                return;
            }

            document.getElementById('pet-name').textContent = pet.name;
            document.getElementById('pet-type-breed').textContent = `${pet.type} • ${pet.breed}`;
            document.getElementById('pet-age').textContent = pet.dob ? VetLink.calculateAge(pet.dob) : 'Unknown';
            document.getElementById('pet-id-display').textContent = pet.id;

            const vaccList = document.getElementById('vaccination-list');
            if (!pet.vaccinations || pet.vaccinations.length === 0) {
                vaccList.innerHTML = '<tr><td colspan="5" class="text-center py-20 text-muted">No vaccination records yet.</td></tr>';
                document.getElementById('pet-last-vacc').textContent = 'None';
            } else {
                let html = '';
                pet.vaccinations.forEach(v => {
                    html += `
                        <tr>
                            <td>${v.vaccine}</td>
                            <td>${v.date}</td>
                            <td>${v.veterinarian || v.vet || 'Unknown'}</td>
                            <td><span class="status-badge status-badge-approved">Completed</span></td>
                            <td>${v.nextDue || '-'}</td>
                        </tr>
                    `;
                });
                vaccList.innerHTML = html;
                const lastVacc = pet.vaccinations[pet.vaccinations.length - 1];
                document.getElementById('pet-last-vacc').textContent = lastVacc.date;
            }
        });
"""
generate_page('pet-details.html', 'Pet Details', 'my-pets', petdetails_content, petdetails_js)

# 4. Register Pet
register_content = """
                <h1 class="mb-20">Register New Pet</h1>
                <div class="card max-w-700">
                    <form id="register-pet-form">
                        <div class="form-grid grid-2 gap-15 mb-20">
                            <div class="input-group">
                                <label for="petName">Pet Name *</label>
                                <input type="text" id="petName" name="petName" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div class="input-group">
                                <label for="petType">Pet Type *</label>
                                <select id="petType" name="petType" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                                    <option value="">Select Type</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Rabbit">Rabbit</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label for="petBreed">Breed *</label>
                                <input type="text" id="petBreed" name="petBreed" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div class="input-group">
                                <label for="petDob">Date of Birth *</label>
                                <input type="date" id="petDob" name="petDob" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div class="input-group">
                                <label for="petColor">Color</label>
                                <input type="text" id="petColor" name="petColor" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div class="input-group">
                                <label for="petMicrochip">Microchip Number</label>
                                <input type="text" id="petMicrochip" name="petMicrochip" placeholder="15-digit number" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                        </div>
                        <div class="form-actions flex gap-10">
                            <button type="submit" class="btn btn-primary">Register Pet</button>
                            <a href="my-pets.html" class="btn btn-outline">Cancel</a>
                        </div>
                    </form>
                </div>
"""
register_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            document.getElementById('register-pet-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const currentUser = VetLink.getCurrentUser();
                
                const newPet = {
                    id: 'VL-' + Math.floor(1000 + Math.random() * 9000),
                    name: document.getElementById('petName').value,
                    type: document.getElementById('petType').value,
                    breed: document.getElementById('petBreed').value,
                    dob: document.getElementById('petDob').value,
                    color: document.getElementById('petColor').value,
                    microchip: document.getElementById('petMicrochip').value,
                    owner: currentUser.fullName,
                    ownerId: currentUser.id,
                    image: '',
                    vaccinations: [],
                    reminders: []
                };

                const allPets = VetLink.getPets() || [];
                allPets.push(newPet);
                VetLink.savePets(allPets);

                showToast('Pet registered successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'my-pets.html';
                }, 1000);
            });
        });
"""
generate_page('register-pet.html', 'Register Pet', 'register-pet', register_content, register_js)

# 5. Find Vet
findvet_content = """
                <div class="mb-20">
                    <h1 style="margin:0 0 5px;">Find a Vet</h1>
                    <p class="text-muted m-0">Search for trusted veterinary professionals near you.</p>
                </div>

                <div class="card mb-20">
                    <div class="input-group flex items-center" style="position:relative;">
                        <i data-lucide="search" style="position:absolute; left:10px; color:#888;"></i>
                        <input type="text" id="vet-search" placeholder="Search by name, clinic, or location..." style="width:100%; padding:10px 10px 10px 35px; border:1px solid #ccc; border-radius:4px;">
                    </div>
                </div>

                <div class="grid-2 gap-20 mb-30" id="vet-results">
                    <!-- JS populates -->
                </div>

                <div class="mb-20" id="previous-vets-container" style="display:none;">
                    <h3 class="mb-15">Your Previous Vets</h3>
                    <div class="flex gap-10" id="previous-vets" style="flex-wrap:wrap;">
                        <!-- JS populates -->
                    </div>
                </div>
"""
findvet_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            const currentUser = VetLink.getCurrentUser();
            const vets = VetLink.mockVets || [];
            const resultsGrid = document.getElementById('vet-results');
            const searchInput = document.getElementById('vet-search');

            function renderVets(vetList) {
                if (vetList.length === 0) {
                    resultsGrid.innerHTML = '<p class="text-muted col-span-full">No veterinarians found matching your search.</p>';
                    return;
                }
                
                let html = '';
                vetList.forEach(vet => {
                    html += `
                        <div class="card feature-card flex items-center" style="text-align:left;">
                            <div class="avatar-sm mr-15" style="width:60px;height:60px;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;font-size:24px;">
                                🐶
                            </div>
                            <div style="flex:1;">
                                <h3 style="margin:0 0 5px;">${vet.name}</h3>
                                <p class="text-sm text-muted" style="margin:0 0 2px;">${vet.clinic} - ${vet.location}</p>
                                <p class="text-xs text-primary" style="margin:0 0 10px;">${vet.specialty} • ⭐ ${vet.rating || '4.5'}</p>
                                <button class="btn btn-primary btn-sm" onclick="bookVet('${vet.id}')">Book Now</button>
                            </div>
                        </div>
                    `;
                });
                resultsGrid.innerHTML = html;
            }

            renderVets(vets);

            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = vets.filter(v => 
                    v.name.toLowerCase().includes(term) || 
                    v.clinic.toLowerCase().includes(term) || 
                    v.location.toLowerCase().includes(term)
                );
                renderVets(filtered);
            });

            window.bookVet = function(vetId) {
                localStorage.setItem('selectedVet', vetId);
                window.location.href = 'book-vet.html';
            };

            // Previous vets logic
            const bookings = VetLink.getBookings() || [];
            const userBookings = bookings.filter(b => b.ownerId === currentUser.id && b.status === 'approved');
            const prevVetsMap = {};
            userBookings.forEach(b => {
                prevVetsMap[b.vetId] = b.vetName;
            });
            
            const prevVetsKeys = Object.keys(prevVetsMap);
            if (prevVetsKeys.length > 0) {
                document.getElementById('previous-vets-container').style.display = 'block';
                const prevEl = document.getElementById('previous-vets');
                let prevHtml = '';
                prevVetsKeys.forEach(vId => {
                    prevHtml += `
                        <button class="btn btn-outline btn-sm" onclick="bookVet('${vId}')">Re-book ${prevVetsMap[vId]}</button>
                    `;
                });
                prevEl.innerHTML = prevHtml;
            }
        });
"""
generate_page('find-vet.html', 'Find Vet', 'find-vet', findvet_content, findvet_js)

# 6. Book Vet
bookvet_content = """
                <h1 class="mb-20">Book a Vet Appointment</h1>
                <div class="grid-2-1 gap-20">
                    <div class="card">
                        <form id="book-vet-form">
                            <div class="input-group mb-15">
                                <label for="booking-pet">Select Pet *</label>
                                <select id="booking-pet" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                                    <option value="">-- Choose Pet --</option>
                                </select>
                            </div>
                            
                            <div class="input-group mb-15">
                                <label for="booking-vet">Select Vet *</label>
                                <select id="booking-vet" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                                    <option value="">-- Choose Vet --</option>
                                </select>
                            </div>

                            <div class="input-group mb-15">
                                <label>Visit Type *</label>
                                <div class="flex gap-15">
                                    <label class="flex items-center" style="cursor:pointer; border:1px solid #ccc; padding:10px; border-radius:4px; flex:1;">
                                        <input type="radio" name="visitType" value="Clinic Visit" checked style="margin-right:10px;">
                                        <span><i data-lucide="building-2" style="width:16px; margin-right:5px; vertical-align:middle;"></i>Clinic Visit<br><small class="text-muted">Standard Fee</small></span>
                                    </label>
                                    <label class="flex items-center" style="cursor:pointer; border:1px solid #ccc; padding:10px; border-radius:4px; flex:1;">
                                        <input type="radio" name="visitType" value="Home Visit" style="margin-right:10px;">
                                        <span><i data-lucide="home" style="width:16px; margin-right:5px; vertical-align:middle;"></i>Home Visit<br><small class="text-muted">+ Transport Fee</small></span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-grid grid-2 gap-15 mb-15">
                                <div class="input-group">
                                    <label for="booking-date">Date *</label>
                                    <input type="date" id="booking-date" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                                </div>
                                <div class="input-group">
                                    <label for="booking-time">Time *</label>
                                    <input type="time" id="booking-time" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                                </div>
                            </div>

                            <div class="input-group mb-20">
                                <label for="booking-notes">Notes</label>
                                <textarea id="booking-notes" placeholder="Describe the reason for visit..." rows="3" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary w-full">Submit Booking Request</button>
                        </form>
                    </div>

                    <div class="card" id="booking-summary-card">
                        <h3 class="mb-15">Booking Summary</h3>
                        <div id="booking-summary" class="text-sm">
                            <p class="text-muted mb-10">Select options on the left to see the summary.</p>
                        </div>
                    </div>
                </div>
"""
bookvet_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            const currentUser = VetLink.getCurrentUser();
            
            // Populate Pets
            const allPets = VetLink.getPets() || [];
            const userPets = allPets.filter(p => p.ownerId === currentUser.id);
            const petSelect = document.getElementById('booking-pet');
            userPets.forEach(p => {
                petSelect.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.name} (${p.type})</option>`);
            });

            // Populate Vets
            const vets = VetLink.mockVets || [];
            const vetSelect = document.getElementById('booking-vet');
            vets.forEach(v => {
                vetSelect.insertAdjacentHTML('beforeend', `<option value="${v.id}">${v.name} - ${v.clinic}</option>`);
            });

            // Pre-select vet if from find-vet
            const savedVet = localStorage.getItem('selectedVet');
            if (savedVet) {
                vetSelect.value = savedVet;
                // localStorage.removeItem('selectedVet'); // We can remove it on submit
            }

            // Min date
            const dateInput = document.getElementById('booking-date');
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;

            // Summary calculation
            const formInputs = document.querySelectorAll('#book-vet-form input, #book-vet-form select');
            const summaryDiv = document.getElementById('booking-summary');

            function updateSummary() {
                const petName = petSelect.options[petSelect.selectedIndex]?.text || '-';
                const vetName = vetSelect.options[vetSelect.selectedIndex]?.text || '-';
                const visitType = document.querySelector('input[name="visitType"]:checked').value;
                const date = document.getElementById('booking-date').value || '-';
                const time = document.getElementById('booking-time').value || '-';

                let baseCost = 2000;
                if (visitType === 'Home Visit') baseCost += 500;
                
                let costStr = `LKR ${baseCost}`;
                if (time) {
                    const hour = parseInt(time.split(':')[0]);
                    if (hour >= 22 || hour < 6) {
                        baseCost += 1500;
                        costStr = `LKR ${baseCost} (Includes +1500 Emergency Fee)`;
                    }
                }

                summaryDiv.innerHTML = `
                    <p class="mb-10"><strong>Pet:</strong> <br>${petName}</p>
                    <p class="mb-10"><strong>Vet:</strong> <br>${vetName}</p>
                    <p class="mb-10"><strong>Type:</strong> <br>${visitType}</p>
                    <p class="mb-10"><strong>Date/Time:</strong> <br>${date} at ${time}</p>
                    <hr style="margin:10px 0; border:0; border-top:1px solid #eee;">
                    <p class="text-primary"><strong>Est. Cost:</strong> <br>${costStr}</p>
                `;
            }

            formInputs.forEach(el => el.addEventListener('change', updateSummary));
            if (savedVet) updateSummary();

            document.getElementById('book-vet-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const petId = petSelect.value;
                const petName = petSelect.options[petSelect.selectedIndex].text.split(' (')[0];
                const vetId = vetSelect.value;
                const vetName = vetSelect.options[vetSelect.selectedIndex].text.split(' -')[0];
                const visitType = document.querySelector('input[name="visitType"]:checked').value;
                const date = document.getElementById('booking-date').value;
                const time = document.getElementById('booking-time').value;
                const notes = document.getElementById('booking-notes').value;

                const newBooking = {
                    id: 'BK-' + Date.now(),
                    petId, petName, vetId, vetName, visitType, date, time, notes,
                    status: 'pending',
                    ownerId: currentUser.id,
                    ownerName: currentUser.fullName,
                    createdAt: new Date().toISOString()
                };

                const bookings = VetLink.getBookings() || [];
                bookings.push(newBooking);
                VetLink.saveBookings(bookings);

                localStorage.removeItem('selectedVet');
                
                showToast('Booking request sent successfully!', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            });
        });
"""
generate_page('book-vet.html', 'Book Vet', 'book-vet', bookvet_content, bookvet_js)

# 7. Account
account_content = """
                <h1 class="mb-20">My Account</h1>
                
                <div class="card mb-20 flex items-center gap-20">
                    <div class="avatar-sm" id="acc-avatar" style="width:80px;height:80px;border-radius:50%;background:#4a6cf7;color:white;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;">
                        U
                    </div>
                    <div>
                        <h2 id="acc-name" style="margin:0 0 5px;">User Name</h2>
                        <p class="text-muted" id="acc-email" style="margin:0;">user@email.com</p>
                    </div>
                </div>

                <div class="card max-w-600 mb-20">
                    <h3 class="mb-15">Profile Details</h3>
                    <form id="account-form">
                        <div class="input-group mb-15">
                            <label for="fullName">Full Name *</label>
                            <input type="text" id="fullName" name="fullName" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                        </div>
                        <div class="input-group mb-15">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required readonly style="width:100%; padding:8px; border:1px solid #eee; background:#f9f9f9; border-radius:4px; color:#888;">
                            <small class="text-muted">Email cannot be changed.</small>
                        </div>
                        <div class="input-group mb-15">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                        </div>
                        <div class="input-group mb-20">
                            <label for="location">Location</label>
                            <select id="location" name="location" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                                <option value="">Select City</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>

                <div class="card max-w-600" style="border: 1px solid #fee2e2; background-color: #fef2f2;">
                    <h3 class="text-danger mb-10">Danger Zone</h3>
                    <p class="text-muted mb-15">Once you delete your account, there is no going back. Please be certain.</p>
                    <button class="btn btn-outline" style="border-color:#ef4444; color:#ef4444;" id="delete-account-btn">Delete Account</button>
                </div>
"""
account_js = """
        document.addEventListener('DOMContentLoaded', () => {
            if (!VetLink.requireAuth()) return;
            if (!VetLink.requireRole('pet-owner')) return;

            const currentUser = VetLink.getCurrentUser();
            
            // Populate header
            document.getElementById('acc-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();
            document.getElementById('acc-name').textContent = currentUser.fullName;
            document.getElementById('acc-email').textContent = currentUser.email;

            // Populate cities
            const locSelect = document.getElementById('location');
            if (VetLink.cities) {
                VetLink.cities.forEach(city => {
                    locSelect.insertAdjacentHTML('beforeend', `<option value="${city}">${city}</option>`);
                });
            }

            // Fill form
            document.getElementById('fullName').value = currentUser.fullName || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
            if (currentUser.location) {
                locSelect.value = currentUser.location;
            }

            document.getElementById('account-form').addEventListener('submit', function(e) {
                e.preventDefault();
                currentUser.fullName = document.getElementById('fullName').value;
                currentUser.phone = document.getElementById('phone').value;
                currentUser.location = document.getElementById('location').value;

                // Update in users array
                const users = VetLink.getUsers() || [];
                const idx = users.findIndex(u => u.id === currentUser.id);
                if (idx !== -1) {
                    users[idx] = currentUser;
                    VetLink.saveUsers(users);
                }
                
                // Update in session
                localStorage.setItem('vetlink_current_user', JSON.stringify(currentUser));
                
                // Update UI immediately
                document.getElementById('user-name-display').textContent = currentUser.fullName;
                document.getElementById('user-avatar-display').textContent = currentUser.fullName.charAt(0).toUpperCase();
                document.getElementById('acc-name').textContent = currentUser.fullName;
                document.getElementById('acc-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();

                showToast('Profile updated successfully!', 'success');
            });

            document.getElementById('delete-account-btn').addEventListener('click', function() {
                showConfirmModal(
                    'Delete Account',
                    'This will permanently delete your account and all pet data. This cannot be undone.',
                    function() {
                        localStorage.clear();
                        window.location.href = 'index.html';
                    },
                    'Delete',
                    'danger'
                );
            });
        });
"""
generate_page('account.html', 'My Account', 'account', account_content, account_js)

