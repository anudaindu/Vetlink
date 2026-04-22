# Vercel Deployment Instructions

## Fixed Configuration Issue

The deployment error was caused by an empty `functions` property in `vercel.json`. This has been fixed.

## Quick Deploy Frontend

### Option 1: Use Fixed Configuration
```bash
# From root directory
vercel --prod
```

### Option 2: Use Frontend Folder
```bash
cd frontend
vercel --prod
```

### Option 3: Use Simple Configuration
```bash
# Copy simple config and deploy
cp vercel-simple.json vercel.json
vercel --prod
```

## Backend Deployment

### Firebase Backend Setup
1. Follow `FIREBASE_SETUP.md` to configure Firebase
2. Deploy backend to your preferred platform:
   - Vercel Serverless
   - Railway
   - Heroku
   - DigitalOcean

## Environment Variables

For frontend deployment, update `js/api.js`:
```javascript
this.baseURL = 'https://your-backend-url/api';
```

## Test Deployment

After deployment:
1. Visit your Vercel URL
2. Test booking flow
3. Verify API connectivity

## Troubleshooting

If you get deployment errors:
1. Remove `functions` property from vercel.json
2. Use the simplified configuration
3. Deploy from frontend folder only

The booking system is ready for deployment with Firebase backend!
