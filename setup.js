#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log(`
🌱 Plant Disease Detector Pro - Setup Wizard
============================================

This script will help you configure your environment variables and API keys.
Please have your API keys ready before proceeding.

`);

async function setup() {
  try {
    // Frontend environment variables
    console.log('\n📱 Frontend Configuration');
    console.log('==========================\n');

    const firebaseApiKey = await question('Firebase API Key: ');
    const firebaseAuthDomain = await question('Firebase Auth Domain: ');
    const firebaseProjectId = await question('Firebase Project ID: ');
    const firebaseStorageBucket = await question('Firebase Storage Bucket: ');
    const firebaseMessagingSenderId = await question('Firebase Messaging Sender ID: ');
    const firebaseAppId = await question('Firebase App ID: ');

    const frontendEnv = `# Firebase Configuration
FIREBASE_API_KEY=${firebaseApiKey}
FIREBASE_AUTH_DOMAIN=${firebaseAuthDomain}
FIREBASE_PROJECT_ID=${firebaseProjectId}
FIREBASE_STORAGE_BUCKET=${firebaseStorageBucket}
FIREBASE_MESSAGING_SENDER_ID=${firebaseMessagingSenderId}
FIREBASE_APP_ID=${firebaseAppId}

# Backend API URL
API_BASE_URL=http://localhost:5000

# App Configuration
APP_NAME=Plant Disease Detector Pro
APP_VERSION=2.0.0
`;

    // Backend environment variables
    console.log('\n🔧 Backend Configuration');
    console.log('=========================\n');

    const nodeEnv = await question('Node Environment (development/production) [development]: ') || 'development';
    const port = await question('Server Port [5000]: ') || '5000';
    const frontendUrl = await question('Frontend URL [http://localhost:3000]: ') || 'http://localhost:3000';

    const firebasePrivateKey = await question('Firebase Private Key (from service account): ');
    const firebaseClientEmail = await question('Firebase Client Email (from service account): ');

    const kindwiseApiKey = await question('Kindwise API Key: ');
    const geminiApiKey = await question('Google Gemini AI API Key: ');
    const openweatherApiKey = await question('OpenWeatherMap API Key: ');

    const jwtSecret = await question('JWT Secret (random string for token signing): ');
    const encryptionKey = await question('Encryption Key (32-character random string): ');

    const backendEnv = `# Server Configuration
NODE_ENV=${nodeEnv}
PORT=${port}
FRONTEND_URL=${frontendUrl}

# Firebase Admin
FIREBASE_PROJECT_ID=${firebaseProjectId}
FIREBASE_PRIVATE_KEY="${firebasePrivateKey}"
FIREBASE_CLIENT_EMAIL=${firebaseClientEmail}

# API Keys
KINDWISE_API_KEY=${kindwiseApiKey}
GEMINI_API_KEY=${geminiApiKey}
OPENWEATHER_API_KEY=${openweatherApiKey}

# Security
JWT_SECRET=${jwtSecret}
ENCRYPTION_KEY=${encryptionKey}
`;

    // Create directories if they don't exist
    const frontendDir = path.join(__dirname, 'frontend');
    const backendDir = path.join(__dirname, 'backend');

    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    if (!fs.existsSync(backendDir)) {
      fs.mkdirSync(backendDir, { recursive: true });
    }

    // Write environment files
    fs.writeFileSync(path.join(frontendDir, '.env'), frontendEnv);
    fs.writeFileSync(path.join(backendDir, '.env'), backendEnv);

    console.log('\n✅ Configuration Complete!');
    console.log('==========================\n');

    console.log('Environment files have been created:');
    console.log('📁 frontend/.env');
    console.log('📁 backend/.env\n');

    console.log('Next steps:');
    console.log('1. Install dependencies: npm run install:all');
    console.log('2. Start development: npm run dev');
    console.log('3. Open your app and start detecting plant diseases!\n');

    console.log('📚 Documentation:');
    console.log('- README.md - Complete setup guide');
    console.log('- QUICKSTART.md - Quick start guide');
    console.log('- API Documentation - Available in docs/ folder\n');

    console.log('🔗 Useful Links:');
    console.log('- Firebase Console: https://console.firebase.google.com/');
    console.log('- Kindwise API: https://kindwise.com/');
    console.log('- Google AI Studio: https://makersuite.google.com/app/apikey');
    console.log('- OpenWeatherMap: https://openweathermap.org/api\n');

    console.log('🚀 Happy coding! 🌱\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Setup cancelled by user');
  rl.close();
  process.exit(0);
});

// Run setup
setup();