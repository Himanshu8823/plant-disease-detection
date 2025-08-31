# Plant Disease Detector Pro 🌱

A comprehensive React Native Expo application for plant disease detection, weather monitoring, and agricultural insights. Built with modern technologies and a focus on user experience.

## 🌟 Features

- **Plant Disease Detection**: AI-powered disease identification using Kindwise API
- **Weather Integration**: Real-time weather data for agricultural insights
- **AI Expert Chat**: Interactive chat with Gemini AI for plant care advice
- **Analytics Dashboard**: Comprehensive insights and statistics
- **User Authentication**: Secure login/signup with Firebase
- **Profile Management**: User data and detection history
- **Settings & Customization**: App preferences and language selection
- **Contact Support**: Built-in support system

## 🛠 Technology Stack

### Frontend (React Native Expo)
- **Framework**: React Native with Expo SDK 51
- **Navigation**: Expo Router (File-based routing)
- **UI Components**: React Native Paper, Ionicons
- **Animations**: Lottie React Native
- **Storage**: AsyncStorage
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Location**: Expo Location
- **Image Picker**: Expo Image Picker
- **File System**: Expo File System

### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Authentication**: Firebase Admin SDK, JWT
- **Database**: Firestore
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Real-time**: Socket.IO
- **HTTP Client**: Axios

### External APIs
- **Plant Disease**: Kindwise API
- **AI Assistant**: Google Gemini AI
- **Weather Data**: OpenWeatherMap API
- **Backend Services**: Firebase

## 🚀 Quick Start

### Prerequisites
- Node.js (>= 18.0.0)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio / Xcode (for mobile development)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd plant-disease-detector-pro
   npm run install:all
   ```

2. **Setup Environment Variables**
   ```bash
   npm run setup
   ```
   Or manually create the environment files (see Configuration section below).

3. **Start Development**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Automated Setup
Run `npm run setup` to automatically create environment files with guided prompts.

### Manual Setup

#### Frontend Environment (`frontend/.env`)
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

#### Backend Environment (`working-backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# API Keys
KINDWISE_API_KEY=your_kindwise_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### API Keys Setup

1. **Firebase**: 
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add a web app and get configuration
   - Go to Project Settings → Service Accounts → Generate new private key

2. **Kindwise API**: 
   - Visit [Kindwise](https://kindwise.com/)
   - Sign up and get your API key

3. **Google Gemini AI**: 
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key

4. **OpenWeatherMap**: 
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up and get your API key

## 📁 Project Structure

```
plant-disease-detector-pro/
├── frontend/                 # React Native Expo App
│   ├── app/                 # Expo Router screens
│   │   ├── _layout.js       # Main navigation layout
│   │   ├── index.js         # Home screen
│   │   ├── detection.js     # Disease detection
│   │   ├── weather.js       # Weather screen
│   │   ├── analytics.js     # Analytics dashboard
│   │   ├── chat.js          # AI chat
│   │   ├── profile.js       # User profile
│   │   ├── settings.js      # App settings
│   │   ├── contactus.js     # Contact support
│   │   ├── login.js         # Login screen
│   │   └── signup.js        # Registration screen
│   ├── assets/              # Images, fonts, animations
│   ├── .env                 # Frontend environment variables
│   ├── app.json             # Expo configuration
│   └── package.json         # Frontend dependencies
├── working-backend/         # Node.js Backend
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication
│   │   ├── detection.js     # Disease detection API
│   │   ├── weather.js       # Weather API
│   │   ├── analytics.js     # Analytics API
│   │   ├── chat.js          # Chat API
│   │   └── user.js          # User management
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
├── package.json             # Root package.json with scripts
├── setup.js                 # Automated setup script
├── README.md                # This file
├── QUICKSTART.md            # Quick start guide
└── SETUP_GUIDE.md           # Detailed setup guide
```

## 🧪 Testing

### Development Mode
```bash
npm run dev
```

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

## 📱 Available Scripts

- `npm run install:all` - Install all dependencies
- `npm run install:frontend` - Install frontend dependencies only
- `npm run install:backend` - Install backend dependencies only
- `npm run dev` - Start both frontend and backend in development
- `npm run start:backend` - Start backend server only
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests
- `npm run setup` - Automated environment setup
- `npm run clean` - Clean all node_modules

## 🚀 Deployment

### Frontend (Expo)
1. Build for production: `expo build`
2. Deploy to Expo: `expo publish`
3. Or build standalone: `expo build:android` / `expo build:ios`

### Backend
1. Set `NODE_ENV=production` in environment
2. Run `npm run build:backend`
3. Deploy to your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Note**: Make sure to never commit your `.env` files to version control. They contain sensitive information like API keys and secrets.
