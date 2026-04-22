# VetLink Deployment Guide

## Project Structure
```
Vetlink/
frontend/          # Frontend application (Vercel)
backend/           # Backend API (Node.js/Express)
```

## Frontend Deployment (Vercel)

### Prerequisites
- Node.js installed
- Vercel CLI installed (`npm i -g vercel`)
- Git repository

### Quick Deploy
```bash
cd frontend
npm install
vercel --prod
```

### Manual Deployment
1. Go to https://vercel.com/new
2. Import Git repository
3. Select `frontend` folder
4. Configure as Static Site
5. Deploy

## Backend Deployment Options

### Option 1: Vercel Serverless Functions
```bash
cd backend
npm install
vercel --prod
```

### Option 2: Railway
```bash
cd backend
npm install
railway login
railway deploy
```

### Option 3: Heroku
```bash
cd backend
npm install
heroku create vetlink-backend
git push heroku main
```

### Option 4: DigitalOcean App Platform
1. Create DigitalOcean account
2. Create new App
3. Connect Git repository
4. Select `backend` folder
5. Deploy

## Environment Setup

### Backend Environment Variables
Create `.env` file in `backend/`:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vetlink
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Database Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Add to environment variables

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/vet-login` - Veterinarian login

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/accept` - Accept booking
- `PATCH /api/bookings/:id/reject` - Reject booking
- `PATCH /api/bookings/:id/complete` - Complete booking

### Pets
- `GET /api/pets` - Get user's pets
- `POST /api/pets` - Register new pet
- `GET /api/pets/:id` - Get pet details

### Veterinarians
- `GET /api/vets` - Get all veterinarians
- `GET /api/vets/profile` - Get vet profile
- `PATCH /api/vets/settings` - Update vet settings

## Testing the Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Visit `https://your-backend-url/api/health`
3. **Integration**: Test booking flow end-to-end

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed with HTTPS
- [ ] MongoDB database connected
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] SSL certificates active
- [ ] Health check endpoint working
- [ ] Error monitoring set up

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure FRONTEND_URL is set correctly
2. **Database Connection**: Check MongoDB URI and network access
3. **Authentication**: Verify JWT_SECRET is consistent
4. **API Timeouts**: Check server logs and performance

### Debug Commands
```bash
# Check backend health
curl https://your-backend-url/api/health

# Check frontend API connection
# Open browser console and test booking flow
```

## Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test API endpoints individually
4. Ensure database connectivity
