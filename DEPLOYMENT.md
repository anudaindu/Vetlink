# VetLink Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Node.js installed
- Vercel CLI installed (`npm i -g vercel`)
- Git repository connected to Vercel

### Quick Deploy Commands

```bash
# Install dependencies
npm install

# Deploy to production
npm run deploy

# Or use Vercel directly
vercel --prod
```

### Local Development
```bash
# Start local development server
npm run dev
```

## 📋 Features Deployed

✅ **Real-Time Veterinary Booking System**
- Pet owner booking interface
- Veterinarian dashboard
- Emergency detection (10 PM - 6 AM)
- Dynamic pricing system
- Home visit support
- Booking status management

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `package.json` - Updated with Vercel scripts

## 🌐 Access After Deployment

Once deployed, your VetLink booking system will be available at:
- **Pet Owner**: `https://your-app.vercel.app/#login`
- **Veterinarian**: `https://your-app.vercel.app/#vet-login`
- **Booking**: `https://your-app.vercel.app/#booking`

## 📱 Testing the Booking System

1. **Pet Owner Flow**:
   - Register/login as pet owner
   - Add a pet
   - Click "Book Vet Visit" in dashboard
   - Fill booking form and submit

2. **Veterinarian Flow**:
   - Login as veterinarian
   - View incoming requests
   - Accept/reject bookings
   - Configure availability settings

## 🎯 Key URLs After Login

- **Dashboard**: `/#dashboard`
- **Booking Form**: `/#booking`
- **Vet Dashboard**: `/#vet-dashboard`
- **Vet Settings**: `/#vet-settings`
