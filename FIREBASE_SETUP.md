# Firebase Setup Guide for VetLink Backend

## Prerequisites
- Google Firebase account
- Node.js installed
- VetLink backend code

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `vetlink-backend`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Create"

## Step 3: Generate Service Account Key

1. Go to Firebase Console
2. Click "Project Settings" (gear icon)
3. Go to "Service accounts" tab
4. Click "Generate new private key"
5. Select "Node.js"
6. Click "Generate key"
7. Download the JSON file

## Step 4: Configure Environment Variables

Create `.env` file in `backend/` folder:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account-email@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Other Configuration
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

**Extract values from your downloaded JSON file:**
- `project_id` -> FIREBASE_PROJECT_ID
- `client_email` -> FIREBASE_CLIENT_EMAIL  
- `private_key` -> FIREBASE_PRIVATE_KEY (add newlines with \n)

## Step 5: Install Dependencies

```bash
cd backend
npm install
```

## Step 6: Test Firebase Connection

```bash
npm run dev
```

Test health endpoint:
```bash
curl http://localhost:5000/api/health
```

## Step 7: Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Vets can read all approved vets, write their own data
    match /vets/{vetId} {
      allow read: if resource.data.approved == true;
      allow write: if request.auth != null && request.auth.uid == vetId;
    }
    
    // Pet owners can read/write their own pets
    match /pets/{petId} {
      allow read, write: if request.auth != null && resource.data.owner == request.auth.uid;
    }
    
    // Bookings - vets can see assigned bookings, owners can see their bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || resource.data.assignedVetId == request.auth.uid);
      allow write: if request.auth != null;
    }
  }
}
```

## Step 8: Deploy Backend

### Option 1: Vercel Serverless
```bash
cd backend
vercel --prod
```

### Option 2: Railway
```bash
cd backend
railway login
railway deploy
```

### Option 3: Heroku
```bash
cd backend
heroku create vetlink-backend
git push heroku main
```

## Firebase Collections Structure

### Users Collection
```javascript
{
  fullName: "John Doe",
  email: "john@example.com",
  phone: "0771234567",
  location: "Colombo",
  role: "user",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Vets Collection
```javascript
{
  fullName: "Dr. Jane Smith",
  email: "jane@vet.com",
  phone: "0112345678",
  clinic: "Pet Care Clinic",
  location: "Colombo",
  licenseNumber: "LIC-2023-001",
  specialty: "General Practice",
  rating: 4.8,
  approved: true,
  status: "Active",
  acceptsHomeVisits: true,
  acceptsClinicVisits: true,
  emergencyAvailability: false,
  workStart: "08:00",
  workEnd: "20:00",
  baseFee: 2000,
  transportFee: 500,
  emergencyFee: 1500,
  role: "vet"
}
```

### Pets Collection
```javascript
{
  name: "Max",
  type: "Dog",
  breed: "Golden Retriever",
  dob: "2022-05-15",
  owner: "userId",
  phone: "0771234567",
  vaccinations: [],
  treatments: [],
  reminders: []
}
```

### Bookings Collection
```javascript
{
  petId: "petId",
  ownerId: "userId",
  ownerName: "John Doe",
  ownerPhone: "0771234567",
  ownerEmail: "john@example.com",
  visitType: "home",
  date: "2024-04-25",
  time: "14:00",
  location: "Colombo",
  notes: "Regular checkup",
  isEmergency: false,
  baseFee: 2000,
  transportFee: 500,
  emergencyFee: 0,
  totalCost: 2500,
  status: "pending",
  availableVets: ["vetId1", "vetId2"],
  assignedVetId: null,
  createdAt: timestamp
}
```

## Troubleshooting

### Common Issues
1. **"Invalid Firebase credentials"**: Check private key formatting
2. **"Permission denied"**: Update Firestore security rules
3. **"Connection timeout"**: Check network and Firebase project settings

### Debug Commands
```bash
# Test Firebase connection
node -e "require('./config/firebase')"

# Check environment variables
printenv | grep FIREBASE
```

## Production Considerations
- Use production Firebase project
- Implement proper security rules
- Monitor Firestore usage and costs
- Set up alerts for high usage
- Regular data backups
