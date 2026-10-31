// ============================================================================
// VetLink — Production UI Engine & State Management (60 FPS, Zero CLS, Anti-Glitch)
// ============================================================================

(function () {
    'use strict';

    // ==========================================
    // 1. High Performance UI Engine
    // ==========================================
    const UIEngine = {
        activeLocks: new WeakSet(),
        lastClickTime: new WeakMap(),
        SPAM_THRESHOLD_MS: 350,

        /**
         * Generic debouncer
         */
        debounce: function (fn, delayMs, immediate) {
            delayMs = delayMs || 250;
            let timeoutId = null;
            return function () {
                const context = this;
                const args = arguments;
                const callNow = immediate && !timeoutId;

                if (timeoutId !== null) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    timeoutId = null;
                    if (!immediate) fn.apply(context, args);
                }, delayMs);

                if (callNow) fn.apply(context, args);
            };
        },

        /**
         * Generic throttler
         */
        throttle: function (fn, intervalMs) {
            intervalMs = intervalMs || 100;
            let lastExecution = 0;
            let timerId = null;
            return function () {
                const context = this;
                const args = arguments;
                const now = Date.now();
                const remaining = intervalMs - (now - lastExecution);

                if (remaining <= 0) {
                    if (timerId !== null) {
                        clearTimeout(timerId);
                        timerId = null;
                    }
                    lastExecution = now;
                    fn.apply(context, args);
                } else if (!timerId) {
                    timerId = setTimeout(() => {
                        lastExecution = Date.now();
                        timerId = null;
                        fn.apply(context, args);
                    }, remaining);
                }
            };
        },

        /**
         * Rapid-click spam shield
         */
        isClickSpam: function (element) {
            if (!element) return false;
            const now = performance.now();
            const last = this.lastClickTime.get(element) || 0;
            if (now - last < this.SPAM_THRESHOLD_MS) return true;
            this.lastClickTime.set(element, now);
            return false;
        },

        /**
         * Lock element with dimension freeze (Zero Cumulative Layout Shift)
         */
        lockElement: function (element, loadingText) {
            if (!element || this.activeLocks.has(element)) return;
            this.activeLocks.add(element);

            // Reserve exact bounding dimensions to avoid layout jumps
            const rect = element.getBoundingClientRect();
            if (rect.width > 0) element.style.minWidth = rect.width + 'px';
            if (rect.height > 0) element.style.minHeight = rect.height + 'px';

            element.setAttribute('aria-busy', 'true');
            element.setAttribute('aria-disabled', 'true');
            element.classList.add('is-loading');

            if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
                element.disabled = true;
            }

            element.dataset.originalContent = element.innerHTML;

            if (loadingText) {
                element.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span class="btn-label">${loadingText}</span>`;
            } else {
                element.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span class="btn-label" style="opacity:0.2;">${element.dataset.originalContent}</span>`;
            }
        },

        /**
         * Unlock element and restore dimensions
         */
        unlockElement: function (element) {
            if (!element || !this.activeLocks.has(element)) return;
            this.activeLocks.delete(element);

            element.removeAttribute('aria-busy');
            element.removeAttribute('aria-disabled');
            element.classList.remove('is-loading');

            if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
                element.disabled = false;
            }

            if (element.dataset.originalContent !== undefined) {
                element.innerHTML = element.dataset.originalContent;
                delete element.dataset.originalContent;
            }

            element.style.minWidth = '';
            element.style.minHeight = '';
        },

        /**
         * Reliable Async Lifecycle (try...catch...finally)
         */
        executeAsyncSafe: async function (asyncFn, options) {
            const btn = options ? options.button : null;

            if (btn) {
                if (this.isClickSpam(btn) || this.activeLocks.has(btn)) return null;
                this.lockElement(btn, options ? options.loadingText : null);
            }

            try {
                const result = await asyncFn();
                if (options && options.onSuccess) options.onSuccess(result);
                return result;
            } catch (err) {
                console.error('[UIEngine Error]', err);
                if (options && options.onError) options.onError(err);
                return null;
            } finally {
                if (btn) this.unlockElement(btn);
                if (options && options.onFinally) options.onFinally();
            }
        },

        /**
         * Optimistic UI Updates with Snapshot-based Rollback
         */
        optimisticMutate: async function (options) {
            const currentSnapshot = JSON.parse(JSON.stringify(options.getCurrent()));
            try {
                const optimisticState = options.mutate(currentSnapshot);
                const commitResult = await Promise.resolve(options.commit(optimisticState));
                if (commitResult === false) throw new Error('Commit rejected');
                return true;
            } catch (error) {
                console.warn('[UIEngine Rollback]', error);
                if (options.onRollback) options.onRollback(currentSnapshot);
                if (window.showToast) {
                    window.showToast(options.rollbackMessage || 'Action failed. Changes have been restored.', 'error');
                }
                return false;
            }
        },

        /**
         * Zero-CLS Skeleton Grid Generator
         */
        renderSkeletonGrid: function (container, count, template) {
            if (!container) return;
            count = count || 3;
            template = template || 'pet-card';
            let skeletonHtml = '';

            for (let i = 0; i < count; i++) {
                if (template === 'pet-card') {
                    skeletonHtml += `
                        <div class="card skeleton-card" style="min-height: 240px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div class="skeleton-avatar skeleton-shimmer mx-auto mb-15"></div>
                                <div class="skeleton-line skeleton-shimmer mb-10" style="width: 60%; margin: 0 auto 10px;"></div>
                                <div class="skeleton-line skeleton-shimmer mb-15" style="width: 40%; margin: 0 auto 15px;"></div>
                                <div class="skeleton-shimmer" style="height: 60px; border-radius: 8px;"></div>
                            </div>
                            <div class="skeleton-shimmer mt-15" style="height: 38px; border-radius: 8px;"></div>
                        </div>
                    `;
                } else if (template === 'vet-card') {
                    skeletonHtml += `
                        <div class="card skeleton-card flex items-start gap-15" style="min-height: 140px;">
                            <div class="skeleton-avatar skeleton-shimmer" style="width: 56px; height: 56px; flex-shrink: 0;"></div>
                            <div style="flex: 1;">
                                <div class="skeleton-line skeleton-shimmer mb-10" style="width: 50%;"></div>
                                <div class="skeleton-line skeleton-shimmer mb-10" style="width: 70%;"></div>
                                <div class="skeleton-line skeleton-shimmer" style="width: 30%;"></div>
                            </div>
                        </div>
                    `;
                }
            }
            container.innerHTML = skeletonHtml;
        },

        /**
         * Global Double-Submit & Tactile Feedback Protection
         */
        initInteractionGuards: function () {
            document.addEventListener('submit', (e) => {
                const form = e.target;
                if (!form || !(form instanceof HTMLFormElement)) return;
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn && this.isClickSpam(submitBtn)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }, true);

            document.addEventListener('pointerdown', (e) => {
                const target = e.target.closest('button, .btn, [role="button"]');
                if (target && !target.hasAttribute('aria-disabled') && !target.classList.contains('is-loading')) {
                    target.classList.add('is-pressed');
                }
            }, { passive: true });

            const release = (e) => {
                const target = e.target.closest('button, .btn, [role="button"]');
                if (target) target.classList.remove('is-pressed');
            };

            document.addEventListener('pointerup', release, { passive: true });
            document.addEventListener('pointercancel', release, { passive: true });
        }
    };

    window.UIEngine = UIEngine;

    // ==========================================
    // 2. VetLink Application & ER Model Logic
    // ==========================================
    const VetLink = window.VetLink || {};

    VetLink.roles = [
        { value: 'pet_owner', label: 'Pet Owner' },
        { value: 'veterinarian', label: 'Veterinarian' }
    ];

    VetLink.species = [
        'Dog', 'Cat', 'Bird', 'Rabbit', 'Horse', 'Reptile', 'Other'
    ];

    VetLink.genders = [
        'Male', 'Female', 'Male (Neutered)', 'Female (Spayed)'
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
        'Colombo', 'Kandy', 'Gampaha', 'Galle', 'Negombo', 'Jaffna',
        'Matara', 'Kurunegala', 'Rajagiriya', 'Dehiwala', 'Battaramulla',
        'Pannipitiya', 'Nuwara Eliya', 'Anuradhapura', 'Trincomalee', 'Ratnapura'
    ];

    // ---- Auth Helpers ----
    VetLink.getCurrentUser = function () {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || 'null');
        } catch { return null; }
    };

    VetLink.isLoggedIn = function () {
        const user = VetLink.getCurrentUser();
        return Boolean(user && (user.id || user.user_id));
    };

    VetLink.normalizeRole = function (role) {
        if (!role) return 'pet_owner';
        const r = String(role).toLowerCase();
        if (r === 'pet-owner' || r === 'pet_owner') return 'pet_owner';
        if (r === 'veterinarian' || r === 'vet') return 'veterinarian';
        return 'pet_owner';
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

    // ---- Data Persistence Layer ----
    VetLink.getPets = function () {
        try {
            const raw = JSON.parse(localStorage.getItem('pets') || '[]');
            return raw.map(p => ({
                ...p,
                id: p.pet_id || p.id,
                pet_id: p.pet_id || p.id,
                species: p.species || p.type || 'Dog',
                type: p.species || p.type || 'Dog',
                date_of_birth: p.date_of_birth || p.dob || '2022-01-01',
                dob: p.date_of_birth || p.dob || '2022-01-01',
                gender: p.gender || 'Male',
                vaccination_records: (p.vaccination_records || p.vaccinations || []).map(v => ({
                    ...v,
                    used_vaccine: v.used_vaccine || v.vaccine || v.name || 'General Vaccine',
                    status: v.status || 'Verified'
                }))
            }));
        } catch { return []; }
    };

    VetLink.savePets = function (pets) {
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
                is_active: u.is_active !== undefined ? u.is_active : true
            }));
        } catch { return []; }
    };

    VetLink.saveUsers = function (users) {
        localStorage.setItem('users', JSON.stringify(users));
    };

    // ---- Mock Vets matching ER Diagram ----
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
            status: 'Active'
        }
    ];

    VetLink.getVets = function () {
        const users = VetLink.getUsers();
        const vetUsers = users.filter(u => VetLink.normalizeRole(u.user_role || u.role) === 'veterinarian');
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
                    status: 'Active',
                    user_role: 'veterinarian',
                    role: 'veterinarian'
                });
            }
        });
        return allVets;
    };

    // ---- Mock Pets matching ER Diagram ----
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
            owner_id: '',
            ownerId: '',
            phone_number: '077 123 4567',
            color: 'Golden',
            microchip: '985112345678901',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200',
            vaccination_records: [
                { id: '1', date: '2023-10-10', used_vaccine: 'Rabies Vaccine', nextDue: '2024-10-10', status: 'Verified', vetName: 'Dr. Nirmal Silva', clinicName: 'Pet Care Vets Colombo' },
                { id: '2', date: '2023-08-15', used_vaccine: 'DHPP / 5-in-1 (Distemper, Hepatitis, Parvo, Parainfluenza)', nextDue: '2024-08-15', status: 'Verified', vetName: 'Dr. Nirmal Silva', clinicName: 'Pet Care Vets Colombo' }
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
            owner_id: '',
            ownerId: '',
            phone_number: '0771234567',
            color: 'White',
            microchip: '985112345678902',
            image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200',
            vaccination_records: [
                { id: 'v4', date: '2023-11-05', used_vaccine: 'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)', nextDue: '2024-11-05', status: 'Verified', vetName: 'Dr. Anjali Rose', clinicName: 'Vets for Pets - Rajagiriya' }
            ]
        }
    ];

    VetLink.initMockData = function () {
        if (!localStorage.getItem('pets') || VetLink.getPets().length === 0) {
            VetLink.savePets(VetLink.mockPets);
        }
    };

    VetLink.calculateAge = function (dob) {
        if (!dob) return 'N/A';
        const birth = new Date(dob);
        if (isNaN(birth.getTime())) return 'N/A';
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
        if (years < 1) {
            const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
            if (months <= 0) return 'Under 1 month';
            return months + (months === 1 ? ' month' : ' months');
        }
        return years + (years === 1 ? ' year' : ' years');
    };

    VetLink.getParam = function (name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    };

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

    VetLink.addVaccinationRecord = function (petId, record) {
        const pets = VetLink.getPets();
        const petIdx = pets.findIndex(p => p.id === petId || p.pet_id === petId);
        if (petIdx === -1) return null;

        const newRecord = {
            id: record.id || ('vax_' + Date.now()),
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
        pets[petIdx].vaccination_records.push(newRecord);

        VetLink.savePets(pets);
        return newRecord;
    };

    window.VetLink = VetLink;

    // ---- DOM Lifecycle Initialization ----
    document.addEventListener('DOMContentLoaded', function () {
        UIEngine.initInteractionGuards();

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Mobile Nav
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

        // Sidebar mobile
        const sidebarToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', function () {
                sidebar.classList.toggle('show-mobile');
            });
        }

        // Active link highlighting
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a, .sidebar-nav .nav-item').forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Logout
        document.querySelectorAll('#logout-btn, [data-action="logout"]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                VetLink.logout();
            });
        });

        // User avatar & name display
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
