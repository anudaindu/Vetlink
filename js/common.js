// ===========================
// VetLink — Common Utilities & Data Layer
// ===========================
// Shared across ALL pages: auth guard, nav, mobile menu, Lucide icons, helpers, ER models

(function () {
    'use strict';

    window.VetLink = window.VetLink || {};

    // ---- Lookup Lists & Dropdowns (per ER Diagram) ----
    VetLink.roles = [
        { value: 'pet_owner', label: 'Pet Owner' },
        { value: 'veterinarian', label: 'Veterinarian' }
    ];

    VetLink.species = [
        'Dog',
        'Cat',
        'Bird',
        'Rabbit',
        'Horse',
        'Reptile',
        'Other'
    ];

    VetLink.genders = [
        'Male',
        'Female',
        'Male (Neutered)',
        'Female (Spayed)'
    ];

    VetLink.breedsBySpecies = {
        'Dog': [
            'Golden Retriever', 'German Shepherd', 'Labrador Retriever', 'Bulldog',
            'Beagle', 'Poodle', 'Rottweiler', 'Boxer', 'Siberian Husky', 'Dachshund',
            'Pug', 'Shih Tzu', 'Doberman Pinscher', 'Chihuahua', 'Local / Mixed Breed', 'Other'
        ],
        'Cat': [
            'Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll',
            'Bengal', 'Sphynx', 'Russian Blue', 'Domestic Short Hair (Local)', 'Other'
        ],
        'Bird': [
            'Budgerigar / Parakeet', 'Cockatiel', 'Lovebird', 'African Grey Parrot',
            'Canary', 'Cockatoo', 'Macaw', 'Finch', 'Amazon Parrot', 'Other'
        ],
        'Rabbit': [
            'Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'Angora', 'Other'
        ],
        'Horse': [
            'Arabian', 'Thoroughbred', 'Quarter Horse', 'Warmblood', 'Pony', 'Other'
        ],
        'Reptile': [
            'Bearded Dragon', 'Leopard Gecko', 'Red-Eared Slider Turtle', 'Ball Python', 'Chameleon', 'Other'
        ],
        'Other': [
            'Mixed Breed', 'Exotic Pet', 'Farm Animal', 'Other'
        ]
    };

    VetLink.specializations = [
        'General Practice',
        'Small Animal Surgery',
        'Veterinary Dermatology',
        'Internal Medicine',
        'Dental & Oral Health',
        'Exotic Animals & Avian',
        'Emergency & Critical Care',
        'Feline Specialist',
        'Cardiology',
        'Ophthalmology',
        'Orthopedic Surgery'
    ];

    VetLink.vaccineTypes = [
        'Rabies Vaccine',
        'DHPP / 5-in-1 (Distemper, Hepatitis, Parvo, Parainfluenza)',
        'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)',
        'FeLV (Feline Leukemia Virus)',
        'Leptospirosis Vaccine',
        'Bordetella (Kennel Cough)',
        'Canine Parvovirus Vaccine',
        'Deworming & Parasite Control',
        'Avian Polyomavirus Vaccine',
        'Tetanus Toxoid Vaccine',
        'Other Vaccine'
    ];

    VetLink.cities = [
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
        'Pannipitiya',
        'Nuwara Eliya',
        'Anuradhapura',
        'Trincomalee',
        'Ratnapura'
    ];

    // ---- Auth Helpers ----
    VetLink.getCurrentUser = function () {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || 'null');
        } catch { return null; }
    };

    VetLink.isLoggedIn = function () {
        const user = VetLink.getCurrentUser();
        return user && (user.id || user.user_id);
    };

    VetLink.normalizeRole = function (role) {
        if (!role) return '';
        if (role === 'pet-owner' || role === 'pet_owner') return 'pet_owner';
        if (role === 'veterinarian' || role === 'vet') return 'veterinarian';
        return role;
    };

    VetLink.requireAuth = function (redirectTo) {
        if (!VetLink.isLoggedIn()) {
            window.location.href = redirectTo || 'login.html';
            return false;
        }
        return true;
    };

    VetLink.requireRole = function (role) {
        const user = VetLink.getCurrentUser();
        if (!user || (!user.role && !user.user_role)) {
            window.location.href = 'role-selection.html';
            return false;
        }
        const userRole = VetLink.normalizeRole(user.role || user.user_role);
        const targetRole = VetLink.normalizeRole(role);

        if (userRole !== targetRole) {
            window.location.href = userRole === 'veterinarian' ? 'vet-dashboard.html' : 'dashboard.html';
            return false;
        }
        return true;
    };

    VetLink.logout = function () {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    };

    // ---- Data Helpers ----
    VetLink.getPets = function () {
        try {
            const raw = JSON.parse(localStorage.getItem('pets') || '[]');
            // Normalize pets according to ER diagram
            return raw.map(p => ({
                id: p.pet_id || p.id,
                pet_id: p.pet_id || p.id,
                name: p.name || 'Unnamed Pet',
                species: p.species || p.type || 'Dog',
                type: p.species || p.type || 'Dog',
                breed: p.breed || 'Mixed',
                gender: p.gender || 'Male',
                dob: p.date_of_birth || p.dob || '2022-01-01',
                date_of_birth: p.date_of_birth || p.dob || '2022-01-01',
                owner: p.owner || p.ownerName || 'Pet Owner',
                ownerName: p.owner || p.ownerName || 'Pet Owner',
                ownerId: p.ownerId || p.owner_id || '',
                owner_id: p.ownerId || p.owner_id || '',
                phone: p.phone || p.phone_number || '',
                phone_number: p.phone || p.phone_number || '',
                color: p.color || '',
                microchip: p.microchip || '',
                image: p.image || '',
                vaccination_records: (p.vaccination_records || p.vaccinations || []).map(v => ({
                    id: v.id || ('v_' + Date.now()),
                    date: v.date || new Date().toISOString().split('T')[0],
                    used_vaccine: v.used_vaccine || v.name || v.vaccine || 'General Vaccine',
                    vaccine: v.used_vaccine || v.name || v.vaccine || 'General Vaccine',
                    name: v.used_vaccine || v.name || v.vaccine || 'General Vaccine',
                    vetName: v.vetName || v.veterinarian || v.vet || 'Dr. Nirmal Silva',
                    veterinarian: v.vetName || v.veterinarian || v.vet || 'Dr. Nirmal Silva',
                    clinicName: v.clinicName || 'VetLink Partner Clinic',
                    status: v.status || 'Verified',
                    nextDue: v.nextDue || ''
                })),
                vaccinations: (p.vaccination_records || p.vaccinations || []).map(v => ({
                    id: v.id || ('v_' + Date.now()),
                    date: v.date || new Date().toISOString().split('T')[0],
                    used_vaccine: v.used_vaccine || v.name || v.vaccine || 'General Vaccine',
                    vaccine: v.used_vaccine || v.name || v.vaccine || 'General Vaccine',
                    name: v.used_vaccine || v.name || v.vaccine || 'General Vaccine',
                    vetName: v.vetName || v.veterinarian || v.vet || 'Dr. Nirmal Silva',
                    veterinarian: v.vetName || v.veterinarian || v.vet || 'Dr. Nirmal Silva',
                    clinicName: v.clinicName || 'VetLink Partner Clinic',
                    status: v.status || 'Verified',
                    nextDue: v.nextDue || ''
                })),
                reminders: p.reminders || []
            }));
        } catch { return []; }
    };

    VetLink.savePets = function (pets) {
        // Ensure dual compatibility for both ER fields and legacy UI
        const normalized = pets.map(p => ({
            ...p,
            pet_id: p.pet_id || p.id,
            id: p.pet_id || p.id,
            species: p.species || p.type,
            type: p.species || p.type,
            date_of_birth: p.date_of_birth || p.dob,
            dob: p.date_of_birth || p.dob,
            gender: p.gender || 'Male',
            owner_id: p.owner_id || p.ownerId,
            ownerId: p.owner_id || p.ownerId,
            vaccination_records: p.vaccination_records || p.vaccinations || [],
            vaccinations: p.vaccination_records || p.vaccinations || []
        }));
        localStorage.setItem('pets', JSON.stringify(normalized));
    };

    VetLink.getBookings = function () {
        try { return JSON.parse(localStorage.getItem('bookings') || '[]'); } catch { return []; }
    };

    VetLink.saveBookings = function (bookings) {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    };

    VetLink.getUsers = function () {
        try {
            const raw = JSON.parse(localStorage.getItem('users') || '[]');
            return raw.map(u => ({
                ...u,
                id: u.user_id || u.id,
                user_id: u.user_id || u.id,
                username: u.username || (u.email ? u.email.split('@')[0] : 'user_' + u.id),
                name: u.name || u.fullName || 'User',
                fullName: u.fullName || u.name || 'User',
                user_role: VetLink.normalizeRole(u.user_role || u.role),
                role: VetLink.normalizeRole(u.user_role || u.role),
                phone_number: u.phone_number || u.phone || '',
                phone: u.phone_number || u.phone || '',
                is_active: u.is_active !== undefined ? u.is_active : true,
                created_at: u.created_at || u.registeredAt || new Date().toISOString()
            }));
        } catch { return []; }
    };

    VetLink.saveUsers = function (users) {
        localStorage.setItem('users', JSON.stringify(users));
    };

    // ---- Mock Veterinarians (matching vet_profiles in ER Diagram) ----
    VetLink.mockVets = [
        {
            user_id: 'vet1',
            id: 'vet1',
            user_role: 'veterinarian',
            role: 'veterinarian',
            username: 'dr.nirmal',
            name: 'Dr. Nirmal Silva',
            fullName: 'Dr. Nirmal Silva',
            clinic: 'Pet Care Vets Colombo',
            location: 'Colombo',
            phone_number: '0112 555 123',
            phone: '0112 555 123',
            email: 'nirmal.silva@vetlink.lk',
            license_number: 'SLVC-4401',
            specialization: 'Small Animal Surgery',
            specialty: 'Small Animal Surgery',
            is_verified: true,
            ratings: 4.8,
            rating: 4.8,
            is_active: true,
            created_at: '2023-01-15T09:00:00Z',
            status: 'Active'
        },
        {
            user_id: 'vet2',
            id: 'vet2',
            user_role: 'veterinarian',
            role: 'veterinarian',
            username: 'dr.priyantha',
            name: 'Dr. Priyantha Banda',
            fullName: 'Dr. Priyantha Banda',
            clinic: 'Kandy Animal Hospital',
            location: 'Kandy',
            phone_number: '0812 222 456',
            phone: '0812 222 456',
            email: 'priyantha.b@vetlink.lk',
            license_number: 'SLVC-3890',
            specialization: 'Emergency & Critical Care',
            specialty: 'Emergency & Critical Care',
            is_verified: true,
            ratings: 4.6,
            rating: 4.6,
            is_active: true,
            created_at: '2023-03-20T10:30:00Z',
            status: 'Active'
        },
        {
            user_id: 'vet3',
            id: 'vet3',
            user_role: 'veterinarian',
            role: 'veterinarian',
            username: 'dr.sarath',
            name: 'Dr. Sarath Perera',
            clinic: 'Negombo Pet Clinic',
            fullName: 'Dr. Sarath Perera',
            location: 'Negombo',
            phone_number: '0312 888 777',
            phone: '0312 888 777',
            email: 'sarath.p@vetlink.lk',
            license_number: 'SLVC-5120',
            specialization: 'Dental & Oral Health',
            specialty: 'Dental & Oral Health',
            is_verified: true,
            ratings: 4.5,
            rating: 4.5,
            is_active: true,
            created_at: '2023-06-11T14:15:00Z',
            status: 'Active'
        },
        {
            user_id: 'vet4',
            id: 'vet4',
            user_role: 'veterinarian',
            role: 'veterinarian',
            username: 'dr.anjali',
            name: 'Dr. Anjali Rose',
            fullName: 'Dr. Anjali Rose',
            clinic: 'Vets for Pets - Rajagiriya',
            location: 'Rajagiriya',
            phone_number: '0112 333 999',
            phone: '0112 333 999',
            email: 'anjali.rose@vetlink.lk',
            license_number: 'SLVC-6234',
            specialization: 'Feline Specialist',
            specialty: 'Feline Specialist',
            is_verified: true,
            ratings: 4.9,
            rating: 4.9,
            is_active: true,
            created_at: '2023-08-05T08:45:00Z',
            status: 'Active'
        }
    ];

    VetLink.getVets = function () {
        const users = VetLink.getUsers();
        const vetUsers = users.filter(u => VetLink.normalizeRole(u.user_role || u.role) === 'veterinarian');
        
        // Merge mock vets with registered vet users
        const allVets = [...VetLink.mockVets];
        vetUsers.forEach(vu => {
            if (!allVets.some(v => v.id === vu.id || v.email === vu.email)) {
                allVets.push({
                    user_id: vu.id,
                    id: vu.id,
                    name: vu.fullName || vu.name,
                    fullName: vu.fullName || vu.name,
                    username: vu.username,
                    email: vu.email,
                    phone_number: vu.phone || vu.phone_number,
                    phone: vu.phone || vu.phone_number,
                    location: vu.location || 'Colombo',
                    clinic: vu.clinic || 'Vet Clinic',
                    license_number: vu.license_number || vu.licenseNumber || 'SLVC-PENDING',
                    specialization: vu.specialization || vu.specialty || 'General Practice',
                    specialty: vu.specialization || vu.specialty || 'General Practice',
                    is_verified: vu.is_verified !== undefined ? vu.is_verified : true,
                    ratings: vu.ratings || 5.0,
                    rating: vu.ratings || 5.0,
                    status: 'Active'
                });
            }
        });
        return allVets;
    };

    // ---- Mock Pets (matching pets entity in ER Diagram) ----
    VetLink.mockPets = [
        {
            pet_id: 'PET-101',
            id: 'PET-101',
            name: 'Max',
            species: 'Dog',
            type: 'Dog',
            breed: 'Golden Retriever',
            date_of_birth: '2022-05-15',
            dob: '2022-05-15',
            gender: 'Male',
            owner: 'Anuda H',
            ownerName: 'Anuda H',
            ownerId: '',
            owner_id: '',
            phone: '077 123 4567',
            phone_number: '077 123 4567',
            color: 'Golden',
            microchip: '985112345678901',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200',
            vaccination_records: [
                { id: '1', date: '2023-10-10', used_vaccine: 'Rabies Vaccine', nextDue: '2024-10-10', status: 'Verified', vetName: 'Dr. Nirmal Silva', clinicName: 'Pet Care Vets Colombo' },
                { id: '2', date: '2023-08-15', used_vaccine: 'DHPP / 5-in-1 (Distemper, Hepatitis, Parvo, Parainfluenza)', nextDue: '2024-08-15', status: 'Verified', vetName: 'Dr. Nirmal Silva', clinicName: 'Pet Care Vets Colombo' }
            ],
            vaccinations: [
                { id: '1', date: '2023-10-10', used_vaccine: 'Rabies Vaccine', vaccine: 'Rabies Vaccine', name: 'Rabies Vaccine', nextDue: '2024-10-10', status: 'Verified', vetName: 'Dr. Nirmal Silva', clinicName: 'Pet Care Vets Colombo' },
                { id: '2', date: '2023-08-15', used_vaccine: 'DHPP / 5-in-1 (Distemper, Hepatitis, Parvo, Parainfluenza)', vaccine: 'DHPP', name: 'DHPP', nextDue: '2024-08-15', status: 'Verified', vetName: 'Dr. Nirmal Silva', clinicName: 'Pet Care Vets Colombo' }
            ],
            reminders: [
                { id: '1', title: 'Rabies Booster', date: '2024-10-10', type: 'Vaccination' },
                { id: '2', title: 'Flea Treatment', date: '2024-04-20', type: 'Medicine' }
            ]
        },
        {
            pet_id: 'PET-102',
            id: 'PET-102',
            name: 'Luna',
            species: 'Cat',
            type: 'Cat',
            breed: 'Persian',
            date_of_birth: '2022-10-01',
            dob: '2022-10-01',
            gender: 'Female',
            owner: 'Anuda H',
            ownerName: 'Anuda H',
            ownerId: '',
            owner_id: '',
            phone: '0771234567',
            phone_number: '0771234567',
            color: 'White',
            microchip: '985112345678902',
            image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200',
            vaccination_records: [
                { id: 'v4', date: '2023-11-05', used_vaccine: 'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)', nextDue: '2024-11-05', status: 'Verified', vetName: 'Dr. Anjali Rose', clinicName: 'Vets for Pets - Rajagiriya' }
            ],
            vaccinations: [
                { id: 'v4', date: '2023-11-05', used_vaccine: 'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)', vaccine: 'FVRCP', name: 'FVRCP', nextDue: '2024-11-05', status: 'Verified', vetName: 'Dr. Anjali Rose', clinicName: 'Vets for Pets - Rajagiriya' }
            ],
            reminders: [
                { id: 'r3', title: 'Flea Treatment', date: '2024-04-25', type: 'Medication' }
            ]
        }
    ];

    // Initialize mock data
    VetLink.initMockData = function () {
        if (!localStorage.getItem('pets') || VetLink.getPets().length === 0) {
            VetLink.savePets(VetLink.mockPets);
        }
    };

    // ---- Age Calculator ----
    VetLink.calculateAge = function (dob) {
        if (!dob) return 'N/A';
        const birth = new Date(dob);
        if (isNaN(birth.getTime())) return 'N/A';
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
        if (years < 1) {
            let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
            if (months <= 0) return 'Under 1 month';
            return months + (months === 1 ? ' month' : ' months');
        }
        return years + (years === 1 ? ' year' : ' years');
    };

    // ---- URL Param Helpers ----
    VetLink.getParam = function (name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    };

    // ---- Dropdown Population Helpers ----
    VetLink.populateDropdown = function (selectEl, options, selectedValue, placeholder) {
        if (!selectEl) return;
        selectEl.innerHTML = '';
        if (placeholder) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = placeholder;
            selectEl.appendChild(opt);
        }
        options.forEach(item => {
            const opt = document.createElement('option');
            if (typeof item === 'object') {
                opt.value = item.value;
                opt.textContent = item.label;
                if (item.value === selectedValue) opt.selected = true;
            } else {
                opt.value = item;
                opt.textContent = item;
                if (item === selectedValue) opt.selected = true;
            }
            selectEl.appendChild(opt);
        });
    };

    VetLink.populateBreeds = function (species, breedSelectEl, selectedBreed) {
        if (!breedSelectEl) return;
        const breeds = VetLink.breedsBySpecies[species] || VetLink.breedsBySpecies['Other'];
        VetLink.populateDropdown(breedSelectEl, breeds, selectedBreed, 'Select Breed');
    };

    // ---- Vaccination Record Helper ----
    VetLink.addVaccinationRecord = function (petId, record) {
        const pets = VetLink.getPets();
        const petIdx = pets.findIndex(p => p.id === petId || p.pet_id === petId);
        if (petIdx === -1) return false;

        const newRecord = {
            id: 'vax_' + Date.now(),
            date: record.date || new Date().toISOString().split('T')[0],
            used_vaccine: record.used_vaccine || record.vaccine || 'General Vaccine',
            vaccine: record.used_vaccine || record.vaccine || 'General Vaccine',
            name: record.used_vaccine || record.vaccine || 'General Vaccine',
            vetName: record.vetName || record.veterinarian || 'Dr. Nirmal Silva',
            veterinarian: record.vetName || record.veterinarian || 'Dr. Nirmal Silva',
            clinicName: record.clinicName || 'Vet Clinic',
            status: record.status || 'Verified',
            nextDue: record.nextDue || ''
        };

        if (!pets[petIdx].vaccination_records) pets[petIdx].vaccination_records = [];
        if (!pets[petIdx].vaccinations) pets[petIdx].vaccinations = [];

        pets[petIdx].vaccination_records.push(newRecord);
        pets[petIdx].vaccinations.push(newRecord);

        VetLink.savePets(pets);
        return newRecord;
    };

    // ---- DOM Ready + Init ----
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        const menuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', function () {
                navLinks.classList.toggle('show-mobile');
                const icon = menuBtn.querySelector('i');
                const isOpen = navLinks.classList.contains('show-mobile');
                if (icon) icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }

        const sidebarToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', function () {
                sidebar.classList.toggle('show-mobile');
            });
        }

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a, .sidebar-nav .nav-item').forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        document.querySelectorAll('#logout-btn, [data-action="logout"]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                VetLink.logout();
            });
        });

        const user = VetLink.getCurrentUser();
        if (user) {
            document.querySelectorAll('#user-name-display, #welcome-name').forEach(function (el) {
                const displayName = user.fullName || user.name || user.username || 'User';
                el.textContent = (user.role === 'veterinarian' && !displayName.startsWith('Dr.')) ? `Dr. ${displayName}` : displayName;
            });
            document.querySelectorAll('#user-avatar-display').forEach(function (el) {
                const letter = (user.fullName || user.name || user.username || 'U').charAt(0).toUpperCase();
                el.textContent = letter;
            });
        }

        VetLink.initMockData();
    });
})();
