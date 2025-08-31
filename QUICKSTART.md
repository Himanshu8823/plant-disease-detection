# Quick Start Guide 🚀

Get your Plant Disease Detector Pro app running in minutes!

## Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio / Xcode (for mobile development)

## Quick Setup

### 1. Install Dependencies
```bash
git clone <repository-url>
cd plant-disease-detector-pro
npm run install:all
```

### 2. Setup Environment Variables

**Option A: Automated Setup (Recommended)**
```bash
npm run setup
```

**Option B: Manual Setup**

Create `frontend/.env`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
EXPO_PUBLIC_BACKEND_URL=http://localhost:5000
```

Create `working-backend/.env`:
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
KINDWISE_API_KEY=your_kindwise_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 3. Get API Keys

1. **Firebase**: [Firebase Console](https://console.firebase.google.com/)
2. **Kindwise**: [Kindwise](https://kindwise.com/)
3. **Gemini AI**: [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **OpenWeatherMap**: [OpenWeatherMap](https://openweathermap.org/api)

### 4. Start Development
```bash
npm run dev
```

### 5. Run on Device
- **iOS**: Press `i` in terminal or scan QR with Camera app
- **Android**: Press `a` in terminal or scan QR with Expo Go app
- **Web**: Press `w` in terminal

## Project Structure

```
plant-disease-detector-pro/
├── frontend/                 # React Native Expo App
│   ├── app/                 # Expo Router screens
│   ├── assets/              # Images, fonts, animations
│   ├── .env                 # Frontend environment variables
│   └── package.json         # Frontend dependencies
├── working-backend/         # Node.js Backend
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── .env                 # Backend environment variables
│   └── package.json         # Backend dependencies
├── package.json             # Root package.json with scripts
└── setup.js                 # Automated setup script
```

## Development Commands

- `npm run dev` - Start both frontend and backend
- `npm run start:backend` - Start backend only
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean all node_modules

## Troubleshooting

### Common Issues

1. **Metro bundler errors**: Clear cache with `npx expo start --clear`
2. **Port already in use**: Change PORT in backend .env file
3. **Environment file not found**: Run `npm run setup` or create manually
4. **API key errors**: Verify all API keys are correct in .env files

### Need Help?

- Check the full [README.md](README.md)
- See detailed setup in [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Open an issue on GitHub

---

**Happy coding! 🌱**