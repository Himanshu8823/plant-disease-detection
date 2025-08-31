# Plant Disease Detector Pro 🌱

A comprehensive React Native Expo application for plant disease detection using AI. This app helps users identify plant diseases, get weather insights, and receive expert advice through an AI-powered chat system.

## ✨ Features

### 🌿 Core Features
- **Plant Disease Detection**: AI-powered disease identification using Kindwise API
- **Weather Integration**: Real-time weather data and agricultural insights
- **AI Expert Chat**: Interactive chat with Gemini AI for plant care advice
- **Analytics Dashboard**: Comprehensive statistics and insights
- **Detection History**: Track and manage all your plant scans
- **User Authentication**: Secure login/signup with Firebase

### 🎨 UI/UX Features
- **Modern Design**: Clean, intuitive interface with green-white theme
- **Responsive Layout**: Optimized for all screen sizes
- **Dark Mode Support**: Automatic theme switching
- **Smooth Animations**: Lottie animations for enhanced user experience
- **Offline Support**: Basic functionality works without internet

### 🔧 Technical Features
- **Expo Router**: File-based navigation system
- **Firebase Integration**: Authentication and data storage
- **Real-time Updates**: Socket.IO for live chat
- **Image Processing**: Advanced image handling and optimization
- **Multi-language Support**: Internationalization ready
- **Push Notifications**: Weather alerts and reminders

## 🛠 Technology Stack

### Frontend (React Native Expo)
- **React Native**: 0.74.5
- **Expo**: 51.0.38
- **Expo Router**: File-based navigation
- **NativeWind**: Tailwind CSS for React Native
- **Lottie**: Smooth animations
- **React Native Paper**: Material Design components
- **AsyncStorage**: Local data persistence
- **Axios**: HTTP client
- **Socket.IO Client**: Real-time communication

### Backend (Node.js)
- **Express.js**: Web framework
- **Firebase Admin**: Authentication and database
- **Socket.IO**: Real-time communication
- **Multer**: File upload handling
- **JWT**: Token-based authentication
- **Helmet**: Security middleware
- **Rate Limiting**: API protection
- **CORS**: Cross-origin resource sharing

### APIs & Services
- **Kindwise API**: Plant disease detection
- **Google Gemini AI**: Expert advice and suggestions
- **OpenWeatherMap API**: Weather data
- **Firebase**: Authentication and Firestore database

## 📱 Screenshots

*Screenshots will be added here*

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plant-disease-detector-pro
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   npm run install:all
   
   # Or install separately:
   npm run install:frontend
   npm run install:backend
   ```

3. **Set up environment variables**
   ```bash
   # Run the setup script (RECOMMENDED)
   npm run setup
   ```
   
   **OR manually create environment files:**
   
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

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately:
   npm run start:frontend  # Starts Expo development server
   npm run start:backend   # Starts Node.js backend server
   ```

5. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## 🔧 Configuration

### Environment Variables Setup

#### **Option 1: Automated Setup (Recommended)**
```bash
npm run setup
```
This will guide you through entering all required API keys and create both `.env` files automatically.

#### **Option 2: Manual Setup**

1. **Create Frontend Environment File**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Create .env file
   touch .env
   
   # Edit with your values
   nano .env  # or use any text editor
   ```

2. **Create Backend Environment File**
   ```bash
   # Navigate to working-backend directory
   cd working-backend
   
   # Create .env file
   touch .env
   
   # Edit with your values
   nano .env  # or use any text editor
   ```

### API Keys Setup

#### **1. Firebase Configuration**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** and **Firestore**
4. Go to **Project Settings** → **General**
5. Scroll down to **Your apps** section
6. Click **Add app** → **Web app**
7. Copy the configuration values for frontend
8. For backend: Go to **Project Settings** → **Service Accounts** → **Generate new private key**

#### **2. Kindwise API**
1. Visit [Kindwise](https://kindwise.com)
2. Sign up for an account
3. Get your API key from the dashboard

#### **3. Google Gemini AI**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the setup script

#### **4. OpenWeatherMap**
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Note: Free tier has rate limits

### Final Directory Structure
```
plant-disease-detector-pro/
├── frontend/
│   ├── .env                 ← FRONTEND ENVIRONMENT FILE
│   ├── app/
│   ├── assets/
│   └── package.json
├── working-backend/
│   ├── .env                 ← BACKEND ENVIRONMENT FILE
│   ├── routes/
│   ├── server.js
│   └── package.json
├── package.json
└── setup.js
```

## 📁 Project Structure

```
plant-disease-detector-pro/
├── frontend/                 # React Native Expo app
│   ├── app/                 # Expo Router screens
│   │   ├── _layout.js       # Root layout with drawer navigation
│   │   ├── index.js         # Home screen
│   │   ├── detection.js     # Disease detection screen
│   │   ├── weather.js       # Weather screen
│   │   ├── analytics.js     # Analytics dashboard
│   │   ├── chat.js          # AI expert chat
│   │   ├── profile.js       # User profile
│   │   ├── settings.js      # App settings
│   │   ├── login.js         # Login screen
│   │   ├── signup.js        # Signup screen
│   │   └── contactus.js     # Contact support
│   ├── assets/              # Images, fonts, animations
│   │   ├── images/          # App images and icons
│   │   ├── fonts/           # Custom fonts
│   │   └── animations/      # Lottie animation files
│   ├── .env                 # Frontend environment variables
│   ├── app.json             # Expo configuration
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── babel.config.js      # Babel configuration
├── working-backend/         # Node.js backend
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── detection.js     # Disease detection API
│   │   ├── weather.js       # Weather API
│   │   ├── analytics.js     # Analytics API
│   │   ├── chat.js          # Chat API
│   │   ├── history.js       # History management
│   │   ├── user.js          # User management
│   │   └── contact.js       # Contact form API
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Backend environment template
├── package.json             # Root package.json with scripts
├── setup.js                 # Setup script for environment variables
├── README.md                # This file
├── QUICKSTART.md            # Quick start guide
└── .env.example             # Frontend environment template
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `DELETE /api/auth/account` - Delete account

### Disease Detection
- `POST /api/detection/analyze` - Analyze plant image
- `GET /api/detection/history/:userId` - Get detection history
- `POST /api/detection/save` - Save detection result

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get 5-day forecast

### Analytics
- `GET /api/analytics/usage` - App usage statistics
- `GET /api/analytics/personal` - Personal analytics
- `GET /api/analytics/diseases` - Disease insights
- `GET /api/analytics/weather-impact` - Weather impact analysis

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/suggestions` - Get contextual suggestions

### User Management
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/preferences` - Update preferences
- `GET /api/user/activity` - Get activity log
- `GET /api/user/export` - Export user data

### Contact
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/submissions` - Get submissions (admin)
- `PUT /api/contact/submission/:id` - Update submission (admin)

## 🎨 Customization

### Theme Colors
The app uses a green-white theme. To customize colors:

1. **Frontend**: Update `frontend/tailwind.config.js`
2. **Backend**: Update color values in API responses

### Adding New Features
1. Create new screen in `frontend/app/`
2. Add route in `frontend/app/_layout.js`
3. Create corresponding API endpoint in `working-backend/routes/`
4. Update navigation and documentation

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd working-backend
npm test
```

## 📦 Building for Production

### Frontend (Expo)
```bash
cd frontend

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for web
expo export --platform web
```

### Backend
```bash
cd working-backend

# Set NODE_ENV=production
export NODE_ENV=production

# Start production server
npm start
```

## 🚀 Deployment

### Frontend
- **Expo Application Services (EAS)**: Recommended for mobile apps
- **Vercel/Netlify**: For web deployment

### Backend
- **Heroku**: Easy deployment with Git integration
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS/GCP**: Cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [QUICKSTART.md](QUICKSTART.md) for quick setup
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact support at support@plantdiseasedetector.com

## 🗺 Roadmap

### Version 2.1
- [ ] Push notifications
- [ ] Offline mode improvements
- [ ] Social sharing features
- [ ] Plant care reminders

### Version 2.2
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Plant identification (not just diseases)
- [ ] Community features

### Version 3.0
- [ ] AR plant scanning
- [ ] Voice commands
- [ ] Integration with smart garden devices
- [ ] Advanced AI models

---

**Made with ❤️ for plant lovers everywhere**
