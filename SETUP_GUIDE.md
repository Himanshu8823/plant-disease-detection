# 🔧 Setup Guide - Plant Disease Detector Pro

This guide will walk you through setting up your environment variables step by step.

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js (v18 or higher) installed
- All API keys ready (see sections below)
- Basic knowledge of command line

## 🚀 Quick Setup (Recommended)

### Option 1: Automated Setup
```bash
# Run the setup wizard
npm run setup
```
This will guide you through entering all values and create both `.env` files automatically.

### Option 2: Manual Setup
Follow the sections below to create your environment files manually.

## 🔑 Getting Your API Keys

### 1. Firebase Configuration

#### Frontend Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Go to **Project Settings** → **General**
6. Scroll down to **Your apps** section
7. Click **Add app** → **Web app**
8. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

#### Backend Firebase Admin
1. In the same Firebase project
2. Go to **Project Settings** → **Service accounts**
3. Click **Generate new private key**
4. Download the JSON file
5. Copy these values from the JSON:
   - `project_id`
   - `client_email`
   - `private_key` (keep the quotes and \n characters)

### 2. Kindwise API
1. Visit [Kindwise](https://kindwise.com)
2. Sign up for an account
3. Go to your dashboard
4. Copy your API key

### 3. Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key

### 4. OpenWeatherMap
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Go to your account
3. Copy your API key
4. Note: Free tier has rate limits

## 📁 Creating Environment Files

### Frontend Environment File

**Location:** `frontend/.env`

**Content:**
```env
# Frontend Environment Variables (Expo)
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_YourFirebaseApiKeyHere123456789
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-name.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-name
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-name.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Backend API URL
EXPO_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Backend Environment File

**Location:** `working-backend/.env`

**Content:**
```env
# Backend Environment Variables (Node.js)
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-name
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-name.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# API Keys
KINDWISE_API_KEY=your-kindwise-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
OPENWEATHER_API_KEY=your-openweather-api-key-here
```

## 🔧 Manual Setup Steps

### Step 1: Create Frontend Environment File
```bash
# Navigate to frontend directory
cd frontend

# Create .env file
touch .env

# Edit the file (use any text editor)
nano .env
# or
code .env
# or
vim .env
```

### Step 2: Create Backend Environment File
```bash
# Navigate to working-backend directory
cd working-backend

# Create .env file
touch .env

# Edit the file (use any text editor)
nano .env
# or
code .env
# or
vim .env
```

## ✅ Verification

After creating both files, verify your setup:

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Test backend (in a new terminal)
curl http://localhost:5000/api/health
```

You should see a success message if everything is configured correctly.

## 🚨 Important Notes

1. **Never commit .env files** - They contain sensitive information
2. **Keep your API keys secure** - Don't share them publicly
3. **Use different keys for development and production**
4. **The setup script will create both files automatically**

## 🆘 Troubleshooting

### Common Issues

**"Environment variable not found"**
- Make sure both `.env` files exist in the correct locations
- Check that variable names match exactly (case-sensitive)
- Restart your development servers after creating `.env` files

**"Firebase connection failed"**
- Verify Firebase project ID matches in both files
- Check that Firebase services are enabled (Auth, Firestore)
- Ensure API keys are correct

**"API key errors"**
- Verify all API keys are correctly copied
- Check API key permissions and quotas
- Ensure keys are not expired

**"Backend connection failed"**
- Check if backend is running: `npm run start:backend`
- Verify `EXPO_PUBLIC_BACKEND_URL` in frontend `.env`
- Check firewall settings

## 📞 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- See [QUICKSTART.md](QUICKSTART.md) for quick setup instructions
- Report issues on GitHub
- Contact support at support@plantdiseasedetector.com

---

**Happy coding! 🌱**