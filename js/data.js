export const mockPets = [
    {
        id: '1',
        name: 'Buddy',
        type: 'Dog',
        breed: 'Golden Retriever',
        dob: '2021-05-15',
        owner: 'Anuda H',
        phone: '0771234567',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200',
        vaccinations: [
            { id: 'v1', name: 'Rabies', date: '2023-01-10', nextDue: '2024-01-10', status: 'done' },
            { id: 'v2', name: 'Parvovirus', date: '2023-03-22', nextDue: '2024-03-22', status: 'done' },
            { id: 'v3', name: 'Distemper', date: '2023-03-22', nextDue: '2024-03-22', status: 'done' }
        ],
        reminders: [
            { id: 'r1', title: 'Heartworm Pill', date: '2024-04-20', type: 'Medication' },
            { id: 'r2', title: 'Annual Checkup', date: '2024-05-15', type: 'Vet Visit' }
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

export const mockVets = [
    {
        id: 'vet1',
        name: 'Dr. Nirmal Silva',
        clinic: 'Pet Care Vets Colombo',
        location: 'Colombo',
        phone: '0112 555 123',
        email: 'info@petcare.lk',
        specialty: 'General Practice, Surgery',
        rating: 4.8,
        status: 'Active'
    },
    {
        id: 'vet2',
        name: 'Dr. Priyantha Banda',
        clinic: 'Kandy Animal Hospital',
        location: 'Kandy',
        phone: '0812 222 456',
        email: 'kandyvet@gmail.com',
        specialty: 'Emergency, Vaccinations',
        rating: 4.6,
        status: 'Active'
    },
    {
        id: 'vet3',
        name: 'Dr. Sarath Perera',
        clinic: 'Negombo Pet Clinic',
        location: 'Negombo',
        phone: '0312 888 777',
        email: 'sarath.p@vetlink.lk',
        specialty: 'Dental, Grooming',
        rating: 4.5,
        status: 'Active'
    },
    {
        id: 'vet4',
        name: 'Dr. Anjali Rose',
        clinic: 'Vets for Pets - Rajagiriya',
        location: 'Rajagiriya',
        phone: '0112 333 999',
        email: 'anjali@vetsforpets.lk',
        specialty: 'Cat Specialist, Lab Services',
        rating: 4.9,
        status: 'Active'
    }
];

export const vaccineTypes = [
    'Rabies',
    'DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)',
    'Leptospirosis',
    'Bordetella (Kennel Cough)',
    'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
    'FeLV (Feline Leukemia)'
];

export const cities = [
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
