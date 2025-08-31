# 🚀 Quick Start Guide

Get the Plant Disease Detector Pro app running in 5 minutes!

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

## Quick Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd plant-disease-detector-pro
npm install
cd backend && npm install && cd ..
```

### 2. Run Setup Script

```bash
npm run setup
```

This will guide you through entering your API keys and create the necessary environment files.

### 3. Get API Keys

You'll need these API keys:

- **Firebase**: [Firebase Console](https://console.firebase.google.com/)
- **Kindwise**: [Kindwise](https://kindwise.com/)
- **Gemini AI**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OpenWeatherMap**: [OpenWeatherMap](https://openweathermap.org/api)

### 4. Start the App

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm start
```

### 5. Run on Device

- **iOS**: Press `i` in the Expo terminal or run `npm run ios`
- **Android**: Press `a` in the Expo terminal or run `npm run android`
- **Web**: Press `w` in the Expo terminal or run `npm run web`

## 🎯 What's Next?

1. **Test the App**: Try taking a photo of a plant to test disease detection
2. **Check Weather**: Navigate to the Weather tab to see agricultural insights
3. **View Analytics**: Explore the Analytics tab for statistics and insights
4. **Customize Settings**: Adjust language, notifications, and other preferences

## 🆘 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
npm install
cd backend && npm install && cd ..
```

**"API key invalid" errors**
- Double-check your API keys in the `.env` files
- Make sure you've entered them correctly in the setup script

**"Backend connection failed"**
- Ensure the backend is running on port 5000
- Check that your firewall isn't blocking the connection

**"Firebase authentication failed"**
- Verify your Firebase configuration
- Make sure you've enabled Email/Password authentication in Firebase Console

### Still Having Issues?

1. Check the [full README.md](README.md) for detailed instructions
2. Verify all prerequisites are installed
3. Make sure all API keys are valid and active
4. Check the console for specific error messages

## 📱 App Features

Once running, you can:

- **Detect Plant Diseases**: Take photos and get AI-powered analysis
- **Weather Insights**: Get location-based weather and agricultural recommendations
- **Analytics Dashboard**: View comprehensive statistics and insights
- **Multi-language Support**: Use the app in 12+ languages
- **User Profiles**: Create accounts and track your detection history
- **Settings Management**: Customize the app to your preferences

## 🎉 You're All Set!

The Plant Disease Detector Pro app is now ready to use. Start exploring the features and enjoy helping farmers and gardeners identify plant diseases!

---

**Need help?** Check the [full documentation](README.md) or create an issue in the repository.