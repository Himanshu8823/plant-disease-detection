const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('firebase-admin');

const router = express.Router();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRecord = await admin.auth().getUser(decoded.uid);
    req.user = userRecord;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get user statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    const stats = userData.stats || {
      totalDetections: 0,
      successfulDetections: 0,
      averageConfidence: 0,
      lastDetectionAt: null
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
});

// Update user preferences
router.put('/preferences', verifyToken, [
  body('language').optional().isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi']),
  body('units').optional().isIn(['metric', 'imperial']),
  body('notifications').optional().isBoolean(),
  body('darkMode').optional().isBoolean(),
  body('autoLocation').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const preferences = req.body;
    const validPreferences = {};

    // Only update provided preferences
    if (preferences.language !== undefined) validPreferences.language = preferences.language;
    if (preferences.units !== undefined) validPreferences.units = preferences.units;
    if (preferences.notifications !== undefined) validPreferences.notifications = preferences.notifications;
    if (preferences.darkMode !== undefined) validPreferences.darkMode = preferences.darkMode;
    if (preferences.autoLocation !== undefined) validPreferences.autoLocation = preferences.autoLocation;

    await db.collection('users').doc(req.user.uid).update({
      'preferences': validPreferences
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// Get user preferences
router.get('/preferences', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    const preferences = userData.preferences || {
      language: 'en',
      units: 'metric',
      notifications: true,
      darkMode: false,
      autoLocation: true
    };

    res.json({
      success: true,
      data: preferences
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user preferences'
    });
  }
});

// Update detection statistics
router.post('/stats/detection', verifyToken, [
  body('confidence').isFloat({ min: 0, max: 1 }),
  body('successful').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { confidence, successful } = req.body;

    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const currentStats = userData.stats || {
      totalDetections: 0,
      successfulDetections: 0,
      averageConfidence: 0,
      lastDetectionAt: null
    };

    const newStats = {
      totalDetections: currentStats.totalDetections + 1,
      successfulDetections: currentStats.successfulDetections + (successful ? 1 : 0),
      averageConfidence: calculateNewAverage(currentStats.averageConfidence, confidence, currentStats.totalDetections),
      lastDetectionAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.update({
      'stats': newStats
    });

    res.json({
      success: true,
      message: 'Statistics updated successfully',
      data: newStats
    });

  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update statistics'
    });
  }
});

// Get user activity log
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get recent detections
    const detectionsSnapshot = await db.collection('detections')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const activities = [];

    detectionsSnapshot.forEach(doc => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        type: 'detection',
        description: `Analyzed ${data.plantName} for ${data.diseaseName}`,
        timestamp: data.timestamp,
        confidence: data.confidence,
        plantName: data.plantName,
        diseaseName: data.diseaseName
      });
    });

    // Mock other activities for now
    const mockActivities = [
      {
        id: 'login-1',
        type: 'login',
        description: 'Logged into the application',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'settings-1',
        type: 'settings',
        description: 'Updated app preferences',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    const allActivities = [...activities, ...mockActivities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        activities: allActivities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: allActivities.length
        }
      }
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity log'
    });
  }
});

// Export user data
router.get('/export', verifyToken, async (req, res) => {
  try {
    // Get user profile
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Get user detections
    const detectionsSnapshot = await db.collection('detections')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .get();

    const detections = [];
    detectionsSnapshot.forEach(doc => {
      detections.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get chat history
    const chatSnapshot = await db.collection('chat_history')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const chatHistory = [];
    chatSnapshot.forEach(doc => {
      chatHistory.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const exportData = {
      user: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt,
        stats: userData.stats,
        preferences: userData.preferences
      },
      detections: detections,
      chatHistory: chatHistory,
      exportDate: new Date().toISOString()
    };

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export user data'
    });
  }
});

// Helper function to calculate new average confidence
const calculateNewAverage = (currentAvg, newValue, currentCount) => {
  if (currentCount === 0) return newValue;
  return ((currentAvg * currentCount) + newValue) / (currentCount + 1);
};

module.exports = router;