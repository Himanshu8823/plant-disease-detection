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

```bash
# Run the automated setup script
npm run setup
```

This will guide you through entering:
- ✅ Firebase configuration
- ✅ Kindwise API key (plant disease detection)
- ✅ Google Gemini AI key (chat functionality)
- ✅ OpenWeatherMap API key (weather data)

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
2. Create a new project
3. Enable **Authentication** and **Firestore**
4. Add a web app to get configuration
5. Go to Project Settings → Service Accounts → Generate new private key

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
│   ├── app/                 # All app screens
│   ├── assets/              # Images, fonts, animations
│   └── components/          # Reusable components
├── working-backend/         # Node.js backend
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   └── utils/               # Utility functions
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