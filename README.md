# 🌱 Plant Disease Detector Pro

A comprehensive React Native application for plant disease detection with advanced features including weather integration, analytics, and AI-powered insights.

## 🚀 Features

### Core Features
- **Plant Disease Detection**: AI-powered image analysis using Kindwise API
- **Weather Integration**: Location-based weather data with agricultural insights
- **Analytics Dashboard**: Comprehensive statistics and insights
- **Multi-language Support**: 12+ languages including English, Spanish, French, German, etc.
- **User Authentication**: Secure Firebase-based authentication
- **Offline Support**: Basic functionality works without internet

### Advanced Features
- **Real-time Weather Analysis**: Agricultural recommendations based on weather conditions
- **Disease Insights**: Detailed information about common plant diseases
- **Personal Analytics**: User-specific detection history and statistics
- **Settings Management**: Comprehensive app customization options
- **Data Export**: Export user data and detection history
- **Privacy Controls**: Granular privacy and data usage settings

### Technical Features
- **Modern UI/UX**: Beautiful green-themed interface optimized for plant-related content
- **Responsive Design**: Works seamlessly across different screen sizes
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimized**: Efficient image processing and data management
- **Security**: Secure API communication and data storage

## 📱 Screenshots

*Screenshots will be added here*

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **NativeWind**: Tailwind CSS for React Native
- **React Navigation**: Navigation between screens
- **Axios**: HTTP client for API calls
- **AsyncStorage**: Local data persistence

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Firebase**: Authentication and database
- **Firebase Admin**: Server-side Firebase integration
- **Multer**: File upload handling
- **Helmet**: Security middleware
- **Morgan**: HTTP request logging

### APIs & Services
- **Kindwise API**: Plant and disease identification
- **Gemini AI**: Disease information and recommendations
- **OpenWeatherMap API**: Weather data and forecasts
- **Firebase Auth**: User authentication
- **Firestore**: Database storage

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Git**

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd plant-disease-detector-pro
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Frontend Environment
Create a `.env` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Backend API URL
API_BASE_URL=http://localhost:5000
```

#### Backend Environment
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# API Keys
KINDWISE_API_KEY=your-kindwise-api-key
GEMINI_API_KEY=your-gemini-api-key
OPENWEATHER_API_KEY=your-openweather-api-key

# Security
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# Database (if using external database)
DATABASE_URL=your-database-url

# Logging
LOG_LEVEL=info
```

### 4. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Download your Firebase service account key
5. Update the Firebase configuration in your environment files

### 5. API Keys Setup

#### Kindwise API
1. Sign up at [Kindwise](https://kindwise.com/)
2. Get your API key from the dashboard
3. Add it to your backend `.env` file

#### Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

#### OpenWeatherMap
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key
3. Add it to your backend `.env` file

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
# In a new terminal
npm start
```

#### Run on Device/Simulator
```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

### Production Mode

#### Build Backend
```bash
cd backend
npm run build
npm start
```

#### Build Frontend
```bash
# For Android
expo build:android

# For iOS
expo build:ios
```

## 📁 Project Structure

```
plant-disease-detector-pro/
├── app/                    # React Native screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Splash screen
│   ├── home.js            # Dashboard
│   ├── detection.js       # Disease detection
│   ├── weather.js         # Weather screen
│   ├── analytics.js       # Analytics dashboard
│   ├── profile.js         # User profile
│   ├── settings.js        # App settings
│   ├── login.js           # Login screen
│   ├── signup.js          # Signup screen
│   └── contactus.js       # Contact page
├── backend/               # Node.js backend
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── detection.js   # Detection routes
│   │   ├── weather.js     # Weather routes
│   │   ├── user.js        # User routes
│   │   └── analytics.js   # Analytics routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── package.json       # Backend dependencies
├── components/            # Reusable components
├── navigation/            # Navigation configuration
├── assets/               # Images, fonts, etc.
├── FirebaseConfig.js     # Firebase configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete account

### Detection
- `POST /api/detection/analyze` - Analyze plant image
- `GET /api/detection/history/:userId` - Get detection history

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

### User
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/activity` - Get user activity

### Analytics
- `GET /api/analytics/usage` - Get app usage analytics
- `GET /api/analytics/personal` - Get personal analytics
- `GET /api/analytics/diseases` - Get disease insights
- `GET /api/analytics/weather-impact` - Get weather impact analysis

## 🎨 Customization

### Theme Colors
The app uses a green theme optimized for plant-related content. You can customize colors in:

- `tailwind.config.js` - Tailwind CSS theme
- Individual component styles

### Language Support
Add new languages by updating the language array in `app/settings.js`:

```javascript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  // Add your language here
  { code: 'your-code', name: 'Your Language', flag: '🇺🇸' },
];
```

### API Configuration
Update API endpoints in the backend routes and frontend API calls as needed.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

## 📦 Deployment

### Backend Deployment
1. Deploy to your preferred platform (Heroku, AWS, etc.)
2. Update environment variables
3. Set up domain and SSL

### Frontend Deployment
1. Build the app using Expo
2. Submit to app stores (iOS/Android)
3. Deploy web version if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- **Kindwise** for plant identification API
- **Google Gemini** for AI-powered insights
- **OpenWeatherMap** for weather data
- **Firebase** for backend services
- **Expo** for development platform

## 📈 Roadmap

- [ ] Offline disease detection
- [ ] Community features
- [ ] Expert consultation
- [ ] Crop management tools
- [ ] Integration with IoT sensors
- [ ] Advanced analytics dashboard
- [ ] Multi-language disease database
- [ ] Social sharing features

---

**Made with ❤️ for the agricultural community**
