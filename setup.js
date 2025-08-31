#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌱 Plant Disease Detector Pro - Setup Wizard');
console.log('===========================================\n');

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  try {
    console.log('📋 This setup will help you configure your environment variables.\n');

    // Frontend Environment Variables
    console.log('🔧 Frontend Configuration (Expo)');
    console.log('----------------------------------');
    
    const frontendEnv = {
      EXPO_PUBLIC_FIREBASE_API_KEY: await question('Firebase API Key: '),
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: await question('Firebase Auth Domain: '),
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: await question('Firebase Project ID: '),
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: await question('Firebase Storage Bucket: '),
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: await question('Firebase Messaging Sender ID: '),
      EXPO_PUBLIC_FIREBASE_APP_ID: await question('Firebase App ID: '),
      EXPO_PUBLIC_BACKEND_URL: await question('Backend URL (default: http://localhost:5000): ') || 'http://localhost:5000'
    };

    console.log('\n🔧 Backend Configuration (Node.js)');
    console.log('-----------------------------------');
    
    const backendEnv = {
      PORT: await question('Backend Port (default: 5000): ') || '5000',
      NODE_ENV: await question('Environment (default: development): ') || 'development',
      FIREBASE_PROJECT_ID: frontendEnv.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: await question('Firebase Client Email: '),
      FIREBASE_PRIVATE_KEY: await question('Firebase Private Key (with quotes): '),
      JWT_SECRET: await question('JWT Secret (generate a random string): '),
      KINDWISE_API_KEY: await question('Kindwise API Key: '),
      GEMINI_API_KEY: await question('Google Gemini AI API Key: '),
      OPENWEATHER_API_KEY: await question('OpenWeatherMap API Key: ')
    };

    // Create frontend .env file
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    const frontendEnvContent = Object.entries(frontendEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('\n✅ Frontend .env file created at:', frontendEnvPath);

    // Create backend .env file
    const backendEnvPath = path.join(__dirname, 'working-backend', '.env');
    const backendEnvContent = Object.entries(backendEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Backend .env file created at:', backendEnvPath);

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Install dependencies: npm run install:all');
    console.log('2. Start development servers: npm run dev');
    console.log('3. Run on device: npm run ios or npm run android');
    console.log('\n📖 For more information, see README.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();