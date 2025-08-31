const express = require('express');
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

// Get user's detection history
router.get('/user', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, plant, disease, startDate, endDate } = req.query;

    let query = db.collection('detections').where('userId', '==', req.user.uid);

    // Apply filters if provided
    if (plant) {
      query = query.where('plantName', '==', plant);
    }

    if (disease) {
      query = query.where('diseaseName', '==', disease);
    }

    // Apply date filters
    if (startDate) {
      const start = new Date(startDate);
      query = query.where('timestamp', '>=', admin.firestore.Timestamp.fromDate(start));
    }

    if (endDate) {
      const end = new Date(endDate);
      query = query.where('timestamp', '<=', admin.firestore.Timestamp.fromDate(end));
    }

    // Order by timestamp and apply pagination
    query = query.orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();
    const detections = [];

    snapshot.forEach(doc => {
      detections.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get total count for pagination
    const totalQuery = db.collection('detections').where('userId', '==', req.user.uid);
    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: {
        detections,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get detection history'
    });
  }
});

// Add detection to history
router.post('/add', verifyToken, async (req, res) => {
  try {
    const {
      plantName,
      diseaseName,
      confidence,
      imageUrl,
      location,
      symptoms,
      treatment,
      prevention
    } = req.body;

    const detectionData = {
      userId: req.user.uid,
      plantName,
      diseaseName,
      confidence: parseFloat(confidence),
      imageUrl,
      location: location || {},
      symptoms: symptoms || [],
      treatment: treatment || [],
      prevention: prevention || [],
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('detections').add(detectionData);

    // Update user stats
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
      successfulDetections: currentStats.successfulDetections + (confidence > 0.5 ? 1 : 0),
      averageConfidence: calculateNewAverage(currentStats.averageConfidence, confidence, currentStats.totalDetections),
      lastDetectionAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.update({
      'stats': newStats
    });

    res.status(201).json({
      success: true,
      message: 'Detection added to history successfully',
      data: {
        id: docRef.id,
        ...detectionData
      }
    });

  } catch (error) {
    console.error('Add detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add detection to history'
    });
  }
});

// Get detection by ID
router.get('/detection/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('detections').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found'
      });
    }

    const detectionData = doc.data();

    // Verify user owns this detection
    if (detectionData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...detectionData
      }
    });

  } catch (error) {
    console.error('Get detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get detection'
    });
  }
});

// Update detection
router.put('/detection/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doc = await db.collection('detections').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found'
      });
    }

    const detectionData = doc.data();

    // Verify user owns this detection
    if (detectionData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove fields that shouldn't be updated
    delete updateData.userId;
    delete updateData.timestamp;
    delete updateData.id;

    await db.collection('detections').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Detection updated successfully'
    });

  } catch (error) {
    console.error('Update detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update detection'
    });
  }
});

// Delete detection
router.delete('/detection/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('detections').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found'
      });
    }

    const detectionData = doc.data();

    // Verify user owns this detection
    if (detectionData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await db.collection('detections').doc(id).delete();

    // Update user stats
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
      totalDetections: Math.max(0, currentStats.totalDetections - 1),
      successfulDetections: Math.max(0, currentStats.successfulDetections - (detectionData.confidence > 0.5 ? 1 : 0)),
      averageConfidence: currentStats.averageConfidence, // Keep same for now
      lastDetectionAt: currentStats.lastDetectionAt
    };

    await userRef.update({
      'stats': newStats
    });

    res.json({
      success: true,
      message: 'Detection deleted successfully'
    });

  } catch (error) {
    console.error('Delete detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete detection'
    });
  }
});

// Get history statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db.collection('detections').where('userId', '==', req.user.uid);

    // Apply date filters if provided
    if (startDate) {
      const start = new Date(startDate);
      query = query.where('timestamp', '>=', admin.firestore.Timestamp.fromDate(start));
    }

    if (endDate) {
      const end = new Date(endDate);
      query = query.where('timestamp', '<=', admin.firestore.Timestamp.fromDate(end));
    }

    const snapshot = await query.get();
    const detections = [];

    snapshot.forEach(doc => {
      detections.push(doc.data());
    });

    // Calculate statistics
    const totalDetections = detections.length;
    const successfulDetections = detections.filter(d => d.confidence > 0.5).length;
    const averageConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections || 0;

    // Get disease frequency
    const diseaseFrequency = {};
    detections.forEach(detection => {
      const disease = detection.diseaseName;
      diseaseFrequency[disease] = (diseaseFrequency[disease] || 0) + 1;
    });

    const topDiseases = Object.entries(diseaseFrequency)
      .map(([name, count]) => ({ name, count, percentage: (count / totalDetections) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get plant frequency
    const plantFrequency = {};
    detections.forEach(detection => {
      const plant = detection.plantName;
      plantFrequency[plant] = (plantFrequency[plant] || 0) + 1;
    });

    const topPlants = Object.entries(plantFrequency)
      .map(([name, count]) => ({ name, count, percentage: (count / totalDetections) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats = {
      totalDetections,
      successfulDetections,
      successRate: totalDetections > 0 ? (successfulDetections / totalDetections) * 100 : 0,
      averageConfidence: averageConfidence * 100,
      topDiseases,
      topPlants
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get history stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get history statistics'
    });
  }
});

// Helper function to calculate new average confidence
const calculateNewAverage = (currentAvg, newValue, currentCount) => {
  if (currentCount === 0) return newValue;
  return ((currentAvg * currentCount) + newValue) / (currentCount + 1);
};

module.exports = router;