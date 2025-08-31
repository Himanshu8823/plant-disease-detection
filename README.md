# 🌱 Plant Disease Detector Pro

A comprehensive, production-ready plant disease detection application powered by AI and machine learning. Built with React Native for the frontend and Node.js for the backend, featuring real-time disease analysis, weather integration, and an AI-powered expert chat system.

## ✨ Features

### 🔍 **Advanced Disease Detection**
- **AI-Powered Analysis**: Uses Kindwise API for accurate plant disease identification
- **Real-time Processing**: Instant disease detection with confidence scores
- **Image Enhancement**: Automatic image optimization for better results
- **Detailed Reports**: Comprehensive disease information with symptoms, treatment, and prevention

### 🤖 **AI Expert Chat System**
- **Conversational AI**: Powered by Google Gemini AI for natural plant care conversations
- **Contextual Suggestions**: Smart recommendations based on your detection history
- **Quick Responses**: Pre-built responses for common plant care questions
- **Real-time Chat**: Socket.IO integration for instant messaging

### 📊 **Comprehensive Analytics**
- **Personal Statistics**: Track your detection history and success rates
- **Disease Insights**: Analyze patterns in detected diseases
- **Weather Impact**: Understand how weather affects plant health
- **Progress Tracking**: Monitor your plant care journey

### 🌤️ **Weather Integration**
- **Local Weather Data**: Real-time weather information for your location
- **Agricultural Insights**: Weather-based plant care recommendations
- **Forecast Analysis**: 5-day weather predictions for planning
- **Plant-Specific Advice**: Tailored recommendations based on weather conditions

### 📱 **Enhanced User Experience**
- **Beautiful UI/UX**: Modern, responsive design with green-white theme
- **Smooth Animations**: Lottie animations and React Native Animated
- **Offline Support**: View history and saved data without internet
- **Multi-language Support**: Internationalization ready
- **Dark Mode**: Automatic theme switching

### 🔐 **Security & Privacy**
- **Firebase Authentication**: Secure user authentication
- **Data Encryption**: All sensitive data is encrypted
- **Privacy Controls**: User-controlled data sharing
- **Secure API**: Rate limiting and input validation

## 🏗️ Project Structure

```
plant-disease-detector-pro/
├── frontend/                 # React Native Application
│   ├── app/                 # Main application screens
│   │   ├── detection.js     # Disease detection screen
│   │   ├── chat.js          # AI expert chat
│   │   ├── weather.js       # Weather information
│   │   ├── analytics.js     # Analytics dashboard
│   │   ├── profile.js       # User profile management
│   │   ├── contactus.js     # Contact form
│   │   └── ...
│   ├── components/          # Reusable components
│   ├── navigation/          # Navigation configuration
│   ├── assets/             # Images, animations, fonts
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js Server
│   ├── routes/             # API route handlers
│   │   ├── auth.js         # Authentication routes
│   │   ├── detection.js    # Disease detection API
│   │   ├── chat.js         # Chat system API
│   │   ├── history.js      # Detection history API
│   │   ├── weather.js      # Weather API
│   │   ├── analytics.js    # Analytics API
│   │   └── user.js         # User management API
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── package.json        # Backend dependencies
├── package.json            # Root package.json
├── README.md              # This file
├── QUICKSTART.md          # Quick setup guide
└── setup.js               # Automated setup script
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/plant-disease-detector-pro.git
cd plant-disease-detector-pro
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Setup

```bash
# Run the automated setup script
npm run setup
```

This will guide you through entering your API keys and create the necessary `.env` files.

### 4. Required API Keys

You'll need the following API keys:

- **Firebase**: For authentication and database
- **Kindwise API**: For plant disease detection
- **Google Gemini AI**: For AI chat functionality
- **OpenWeatherMap**: For weather data

### 5. Start Development

```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start them separately:
npm run start:backend  # Backend server (port 5000)
npm run start:frontend # Frontend development server
```

### 6. Run on Device

```bash
# For Android
npm run android

# For iOS
npm run ios

# For web
npm run web
```

## 📱 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run setup` - Run setup wizard
- `npm run test` - Run all tests
- `npm run clean` - Clean all node_modules
- `npm run reset` - Clean and reinstall everything

### Frontend
- `npm run start:frontend` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Backend
- `npm run start:backend` - Start backend server
- `npm run dev` - Start with nodemon (auto-restart)

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
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

# App Configuration
APP_NAME=Plant Disease Detector Pro
APP_VERSION=2.0.0
```

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# API Keys
KINDWISE_API_KEY=your-kindwise-api-key
GEMINI_API_KEY=your-gemini-api-key
OPENWEATHER_API_KEY=your-openweather-api-key

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

## 🗄️ Database Schema

### Collections (Firestore)

#### Users
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  stats: {
    totalDetections: number,
    successfulDetections: number,
    averageConfidence: number,
    lastDetectionAt: timestamp
  },
  preferences: {
    language: string,
    units: string,
    notifications: boolean,
    darkMode: boolean
  }
}
```

#### Detections
```javascript
{
  id: string,
  userId: string,
  plantName: string,
  diseaseName: string,
  confidence: number,
  imageUrl: string,
  location: {
    latitude: number,
    longitude: number
  },
  symptoms: string[],
  treatment: string[],
  prevention: string[],
  timestamp: timestamp,
  status: string
}
```

#### Chat History
```javascript
{
  id: string,
  userId: string,
  userMessage: string,
  aiResponse: string,
  context: object,
  timestamp: timestamp
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete account

### Disease Detection
- `POST /api/detection/analyze` - Analyze plant image
- `GET /api/detection/history/:userId` - Get detection history

### Chat System
- `POST /api/chat/send` - Send chat message
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/suggestions` - Get contextual suggestions
- `GET /api/chat/quick-responses` - Get quick response options

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

### Analytics
- `GET /api/analytics/usage` - Get app usage statistics
- `GET /api/analytics/personal` - Get personal analytics
- `GET /api/analytics/diseases` - Get disease insights
- `GET /api/analytics/weather-impact` - Get weather impact analysis

### User Management
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/activity` - Get user activity log
- `GET /api/user/export` - Export user data

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Green-white theme with semantic colors
- **Typography**: Consistent font hierarchy and spacing
- **Components**: Reusable, accessible components
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Web Compatibility**: Works on web browsers
- **Cross-Platform**: Consistent experience across platforms

### Accessibility
- **Screen Reader Support**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Support for high contrast modes
- **Font Scaling**: Dynamic text sizing

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📦 Deployment

### Frontend Deployment

#### Expo Build
```bash
cd frontend
expo build:android  # For Android
expo build:ios      # For iOS
```

#### Web Deployment
```bash
cd frontend
expo build:web
```

### Backend Deployment

#### Heroku
```bash
cd backend
heroku create
git push heroku main
```

#### Vercel
```bash
cd backend
vercel
```

#### Docker
```bash
docker build -t plant-detector-backend .
docker run -p 5000:5000 plant-detector-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discussions](https://github.com/your-username/plant-disease-detector-pro/discussions)
- [Issues](https://github.com/your-username/plant-disease-detector-pro/issues)
- [Wiki](https://github.com/your-username/plant-disease-detector-pro/wiki)

### Contact
- **Email**: support@plantdetector.com
- **Discord**: [Join our community](https://discord.gg/plantdetector)
- **Twitter**: [@PlantDetector](https://twitter.com/PlantDetector)

## 🙏 Acknowledgments

- **Kindwise API** for plant disease detection
- **Google Gemini AI** for conversational AI
- **OpenWeatherMap** for weather data
- **Firebase** for backend services
- **Expo** for React Native development platform
- **React Native Community** for excellent libraries

## 📈 Roadmap

### Version 2.1 (Q2 2024)
- [ ] Offline disease detection
- [ ] Plant care reminders
- [ ] Community features
- [ ] Advanced analytics

### Version 2.2 (Q3 2024)
- [ ] Multi-language support
- [ ] AR plant identification
- [ ] Soil analysis integration
- [ ] Expert consultation booking

### Version 3.0 (Q4 2024)
- [ ] Machine learning model training
- [ ] IoT sensor integration
- [ ] Blockchain data verification
- [ ] Enterprise features

---

**Made with ❤️ for plant lovers everywhere**
