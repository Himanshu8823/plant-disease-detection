#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌱 Plant Disease Detector Pro - Setup Script');
console.log('===========================================\n');

const questions = [
  {
    name: 'firebaseApiKey',
    question: 'Enter your Firebase API Key: ',
    required: true
  },
  {
    name: 'firebaseAuthDomain',
    question: 'Enter your Firebase Auth Domain: ',
    required: true
  },
  {
    name: 'firebaseProjectId',
    question: 'Enter your Firebase Project ID: ',
    required: true
  },
  {
    name: 'firebaseStorageBucket',
    question: 'Enter your Firebase Storage Bucket: ',
    required: true
  },
  {
    name: 'firebaseMessagingSenderId',
    question: 'Enter your Firebase Messaging Sender ID: ',
    required: true
  },
  {
    name: 'firebaseAppId',
    question: 'Enter your Firebase App ID: ',
    required: true
  },
  {
    name: 'kindwiseApiKey',
    question: 'Enter your Kindwise API Key: ',
    required: true
  },
  {
    name: 'geminiApiKey',
    question: 'Enter your Gemini AI API Key: ',
    required: true
  },
  {
    name: 'openweatherApiKey',
    question: 'Enter your OpenWeatherMap API Key: ',
    required: true
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFiles();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    if (question.required && !answer.trim()) {
      console.log('❌ This field is required. Please try again.\n');
      askQuestion(index);
      return;
    }
    
    answers[question.name] = answer.trim();
    askQuestion(index + 1);
  });
}

function createEnvFiles() {
  console.log('\n📝 Creating environment files...\n');

  // Frontend .env
  const frontendEnv = `# Firebase Configuration
FIREBASE_API_KEY=${answers.firebaseApiKey}
FIREBASE_AUTH_DOMAIN=${answers.firebaseAuthDomain}
FIREBASE_PROJECT_ID=${answers.firebaseProjectId}
FIREBASE_STORAGE_BUCKET=${answers.firebaseStorageBucket}
FIREBASE_MESSAGING_SENDER_ID=${answers.firebaseMessagingSenderId}
FIREBASE_APP_ID=${answers.firebaseAppId}

# Backend API URL
API_BASE_URL=http://localhost:5000

# App Configuration
APP_NAME=Plant Disease Detector Pro
APP_VERSION=2.0.0
`;

  // Backend .env
  const backendEnv = `# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_PROJECT_ID=${answers.firebaseProjectId}
FIREBASE_CLIENT_EMAIL=your-client-email@${answers.firebaseProjectId}.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour private key here\\n-----END PRIVATE KEY-----\\n"

# API Keys
KINDWISE_API_KEY=${answers.kindwiseApiKey}
GEMINI_API_KEY=${answers.geminiApiKey}
OPENWEATHER_API_KEY=${answers.openweatherApiKey}

# Security
JWT_SECRET=your-jwt-secret-key-${Date.now()}
ENCRYPTION_KEY=your-encryption-key-${Date.now()}

# Database (if using external database)
DATABASE_URL=your-database-url

# Logging
LOG_LEVEL=info
`;

  try {
    // Create frontend .env
    fs.writeFileSync('.env', frontendEnv);
    console.log('✅ Created .env file in root directory');

    // Create backend .env
    const backendPath = path.join(__dirname, 'backend', '.env');
    fs.writeFileSync(backendPath, backendEnv);
    console.log('✅ Created .env file in backend directory');

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Download your Firebase service account key');
    console.log('2. Update the FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in backend/.env');
    console.log('3. Run "npm install" to install dependencies');
    console.log('4. Start the backend: cd backend && npm run dev');
    console.log('5. Start the frontend: npm start');
    console.log('\n📚 For more information, check the README.md file');

  } catch (error) {
    console.error('❌ Error creating environment files:', error.message);
  }

  rl.close();
}

// Start the setup process
askQuestion(0);