# 🚀 Quick Start Guide

Get your Plant Disease Detector Pro up and running in minutes!

## ⚡ Super Quick Setup (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/plant-disease-detector-pro.git
cd plant-disease-detector-pro
npm run install:all
```

### 2. Configure Environment
```bash
npm run setup
```
Follow the prompts to enter your API keys.

### 3. Start Development
```bash
npm run dev
```

### 4. Open Your App
- **Mobile**: Scan QR code with Expo Go app
- **Web**: Open http://localhost:3000
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal

## 🔑 Required API Keys

### Firebase (Authentication & Database)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Add a web app to get your config
6. Download service account key for backend

### Kindwise API (Plant Disease Detection)
1. Sign up at [Kindwise](https://kindwise.com/)
2. Get your API key from dashboard
3. Add to setup wizard

### Google Gemini AI (Chat System)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to setup wizard

### OpenWeatherMap (Weather Data)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to setup wizard

## 📱 Running on Device

### Android
```bash
# Install Expo Go from Google Play Store
npm run android
```

### iOS
```bash
# Install Expo Go from App Store
npm run ios
```

### Web
```bash
npm run web
```

## 🔧 Development Commands

### Start Both Frontend & Backend
```bash
npm run dev
```

### Start Separately
```bash
# Backend only
npm run start:backend

# Frontend only  
npm run start:frontend
```

### Testing
```bash
# All tests
npm test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend
```

## 🐛 Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
npm run reset
```

#### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

#### Expo CLI not found
```bash
npm install -g @expo/cli
```

#### Firebase connection issues
- Check your Firebase project settings
- Verify API keys in `.env` files
- Ensure Firestore rules allow read/write

#### API key errors
- Verify all API keys are correct
- Check API quotas and billing
- Ensure keys have proper permissions

### Reset Everything
```bash
npm run clean
npm run install:all
npm run setup
```

## 📊 What's Next?

### Explore Features
1. **Disease Detection**: Take photos of plants to detect diseases
2. **AI Chat**: Ask the AI expert about plant care
3. **Weather**: Check local weather and plant recommendations
4. **Analytics**: View your detection history and statistics
5. **Profile**: Manage your account and preferences

### Customize
- Modify colors in `frontend/tailwind.config.js`
- Add new screens in `frontend/app/`
- Extend API endpoints in `backend/routes/`
- Update database schema in Firebase

### Deploy
- **Frontend**: Use Expo EAS Build for app stores
- **Backend**: Deploy to Heroku, Vercel, or AWS
- **Database**: Firebase handles this automatically

## 🆘 Need Help?

- 📖 **Full Documentation**: [README.md](README.md)
- 💬 **Community**: [GitHub Discussions](https://github.com/your-username/plant-disease-detector-pro/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/plant-disease-detector-pro/issues)
- 📧 **Email**: support@plantdetector.com

## 🎯 Quick Tips

- Use the setup wizard for easy configuration
- Keep your API keys secure and never commit them
- Test on both iOS and Android devices
- Use the AI chat for plant care questions
- Check weather before applying treatments
- Export your data regularly

---

**Ready to detect some plant diseases? 🌱 Let's go!**