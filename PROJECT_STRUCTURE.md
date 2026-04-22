# VetLink Project Structure

## Overview
VetLink is a real-time veterinary booking system with separate frontend and backend components.

## Directory Structure

```
Vetlink/
frontend/                 # Frontend application (Vercel)
  index.html            # Main HTML file
  style.css             # Styling
  js/
    api.js              # API service layer
    app-fixed.js        # Main application logic
    pages.js            # Page components
  assets/               # Images and static files
  package.json          # Frontend dependencies
  vercel.json           # Vercel configuration

backend/                  # Backend API (Node.js/Express)
  server.js             # Express server
  package.json          # Backend dependencies
  .env.example          # Environment variables template
  models/               # Database models
    Booking.js          # Booking model
    User.js             # User model
    Vet.js              # Veterinarian model
    Pet.js              # Pet model
  routes/               # API routes
    auth.js             # Authentication routes
    bookings.js         # Booking management
    pets.js             # Pet management
    users.js            # User management
    vets.js             # Veterinarian management
    vaccinations.js     # Vaccination records
  middleware/           # Express middleware
    auth.js             # Authentication middleware
  config/               # Configuration files

# Deployment Files
vercel.json             # Frontend Vercel config
render.yaml             # REMOVED (Vercel only)
DEPLOYMENT_GUIDE.md     # Deployment instructions
PROJECT_STRUCTURE.md    # This file
```

## Frontend Features

### Core Components
- **Role Selection**: Pet owner vs veterinarian
- **User Authentication**: Login/registration system
- **Pet Management**: Add, edit, view pets
- **Booking System**: Real-time appointment booking
- **Veterinarian Dashboard**: Manage booking requests
- **Vaccination Records**: Digital health certificates

### Key Files
- `index.html` - Main application entry point
- `js/api.js` - API communication layer
- `js/app-fixed.js` - Application logic and routing
- `js/pages.js` - Page components and UI

## Backend Features

### API Endpoints
- **Authentication**: `/api/auth/*`
- **Bookings**: `/api/bookings/*`
- **Pets**: `/api/pets/*`
- **Users**: `/api/users/*`
- **Veterinarians**: `/api/vets/*`
- **Vaccinations**: `/api/vaccinations/*`

### Database Models
- **User**: Pet owner accounts
- **Vet**: Veterinarian accounts with availability
- **Pet**: Pet profiles and records
- **Booking**: Appointment bookings with status tracking

### Security Features
- JWT authentication
- Password hashing
- Rate limiting
- CORS protection
- Input validation

## Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6)** - Application logic
- **Lucide Icons** - Icon library
- **Vercel** - Static site hosting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Deployment Architecture

### Frontend (Vercel)
- Static site hosting
- Global CDN
- Automatic HTTPS
- Custom domain support

### Backend Options
- **Vercel Serverless** - Serverless functions
- **Railway** - Container hosting
- **Heroku** - PaaS hosting
- **DigitalOcean** - Cloud hosting

## Development Workflow

1. **Frontend Development**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Production Deployment**
   ```bash
   # Frontend
   cd frontend && vercel --prod
   
   # Backend (choose platform)
   cd backend && [deploy-command]
   ```

## API Integration

The frontend communicates with the backend through the `api.js` service:

```javascript
// Example API calls
await api.login({ email, password });
await api.createBooking(bookingData);
await api.getBookings({ status: 'pending' });
```

## Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vetlink
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-domain.vercel.app
```

### Frontend
- API base URL configured in `js/api.js`
- Automatic switching between development/production endpoints

## Security Considerations

- JWT tokens stored in localStorage
- API requests include authentication headers
- Input validation on both frontend and backend
- HTTPS required for production
- Rate limiting on API endpoints

## Scalability Features

- Stateless API design
- Database indexing for performance
- Caching headers for static assets
- CDN distribution for frontend
- Horizontal scaling ready for backend
