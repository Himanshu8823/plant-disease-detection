# 🚀 Quick Start Guide

Get your Plant Disease Detector Pro app up and running in minutes!

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Expo Go app** - Download from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## ⚡ Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd plant-disease-detector-pro

# Install all dependencies
npm run install:all
```

### 2. Set Up Environment Variables

#### **Option A: Automated Setup (Recommended)**
```bash
# Run the automated setup script
npm run setup
```
This will guide you through entering all required API keys and create both `.env` files automatically.

#### **Option B: Manual Setup**

**Frontend Environment File** (`frontend/.env`):
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Backend API URL
EXPO_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Backend Environment File** (`working-backend/.env`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_client_email_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# API Keys
KINDWISE_API_KEY=your_kindwise_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- 🖥️ **Backend server** on `http://localhost:5000`
- 📱 **Expo development server** on `http://localhost:8081`

### 4. Run on Your Device

#### Option A: Physical Device (Recommended)
1. Install **Expo Go** app on your phone
2. Scan the QR code that appears in your terminal
3. The app will load on your device!

#### Option B: Simulator/Emulator
```bash
# For iOS (macOS only)
npm run ios

# For Android
npm run android

# For web browser
npm run web
```

## 🔑 Getting API Keys

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** and **Firestore**
4. Go to **Project Settings** → **General**
5. Scroll down to **Your apps** section
6. Click **Add app** → **Web app**
7. Copy the configuration values for frontend
8. For backend: Go to **Project Settings** → **Service Accounts** → **Generate new private key**

### Kindwise API
1. Visit [Kindwise](https://kindwise.com)
2. Sign up for an account
3. Get your API key from the dashboard

### Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the setup script

### OpenWeatherMap
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Note: Free tier has rate limits

## 📱 Testing the App

Once everything is running:

1. **Home Screen**: See the main dashboard with quick actions
2. **Disease Detection**: Take a photo of a plant to test detection
3. **Weather**: Check local weather information
4. **Chat**: Try the AI expert chat feature
5. **Analytics**: View your detection statistics

## 🛠️ Development Commands

```bash
# Install dependencies
npm run install:all          # Install all
npm run install:frontend     # Frontend only
npm run install:backend      # Backend only

# Start servers
npm run dev                  # Both frontend and backend
npm run start:frontend       # Frontend only
npm run start:backend        # Backend only

# Run on specific platforms
npm run ios                  # iOS simulator
npm run android              # Android emulator
npm run web                  # Web browser

# Development utilities
npm run setup                # Environment setup
npm run clean                # Clean node_modules
npm run reset                # Clean and reinstall
```

## 📁 Project Structure

```
plant-disease-detector-pro/
├── frontend/                 # React Native Expo app
│   ├── .env                 ← FRONTEND ENVIRONMENT FILE
│   ├── app/                 # All app screens
│   ├── assets/              # Images, fonts, animations
│   └── app.json             # Expo configuration
├── working-backend/         # Node.js backend
│   ├── .env                 ← BACKEND ENVIRONMENT FILE
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   └── server.js            # Main server file
├── package.json             # Root scripts
├── setup.js                 # Setup wizard
└── README.md                # Full documentation
```

## 🔧 Troubleshooting

### Common Issues

**"Expo CLI not found"**
```bash
npm install -g @expo/cli
```

**"Port 5000 already in use"**
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

**"Metro bundler error"**
```bash
# Clear Metro cache
npx expo start --clear
```

**"Backend connection failed"**
- Check if backend is running: `npm run start:backend`
- Verify API URL in frontend environment variables
- Check firewall settings

**"API key errors"**
- Verify all API keys are correctly set in `.env` files
- Check API key permissions and quotas
- Ensure keys are not expired

**"Environment file not found"**
- Make sure you created both `.env` files:
  - `frontend/.env` for frontend configuration
  - `working-backend/.env` for backend configuration
- Run `npm run setup` to create them automatically

### Getting Help

- 📖 **Full Documentation**: See [README.md](README.md)
- 🐛 **Report Issues**: Create an issue on GitHub
- 💬 **Community**: Join our discussions
- 📧 **Email**: support@plantdiseasedetector.com

## 🎯 What's Next?

After getting the app running:

1. **Explore Features**: Try all the different screens and features
2. **Customize**: Modify colors, add your own branding
3. **Add Features**: Extend the app with new functionality
4. **Deploy**: Build for production and deploy to app stores
5. **Contribute**: Help improve the app by contributing code

## 🚀 Production Deployment

### Frontend (Mobile Apps)
```bash
cd frontend
eas build --platform ios
eas build --platform android
```

### Backend
```bash
cd working-backend
# Deploy to your preferred platform (Heroku, Railway, etc.)
```

---

**Happy coding! 🌱**

Need more help? Check the full [README.md](README.md) for detailed documentation.