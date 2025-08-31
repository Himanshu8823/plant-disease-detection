const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
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

// Get disease information from Gemini AI
const getDiseaseInfoFromGemini = async (plantName, diseaseName) => {
  try {
    const prompt = `
      Provide detailed information about the disease "${diseaseName}" affecting the plant "${plantName}".
      Please structure the response as follows:
      
      Symptoms:
      - List 3-5 key symptoms
      
      Diagnosis:
      - List 2-3 diagnostic points
      
      Treatment:
      - List 3-4 treatment methods
      
      Prevention:
      - List 3-4 prevention strategies
      
      Keep each point concise and practical for gardeners and farmers.
    `;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    
    // Parse the response to extract structured data
    const sections = text.split('\n\n');
    const result = {
      symptoms: [],
      diagnosis: [],
      treatment: [],
      prevention: []
    };

    sections.forEach(section => {
      if (section.includes('Symptoms:')) {
        result.symptoms = section.split('\n').slice(1).filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      } else if (section.includes('Diagnosis:')) {
        result.diagnosis = section.split('\n').slice(1).filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      } else if (section.includes('Treatment:')) {
        result.treatment = section.split('\n').slice(1).filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      } else if (section.includes('Prevention:')) {
        result.prevention = section.split('\n').slice(1).filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      }
    });

    return result;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return default information if API fails
    return {
      symptoms: ['Visual symptoms may vary', 'Check for common disease signs'],
      diagnosis: ['Consult with a local expert', 'Compare with known disease patterns'],
      treatment: ['Remove affected parts', 'Apply appropriate fungicide', 'Improve growing conditions'],
      prevention: ['Maintain good hygiene', 'Ensure proper spacing', 'Monitor regularly']
    };
  }
};

// Analyze plant image for diseases
router.post('/analyze', [
  body('image').notEmpty().withMessage('Image data is required'),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat()
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

    const { image, latitude, longitude } = req.body;

    // Call Kindwise API for plant and disease identification
    const kindwiseResponse = await axios.post(
      'https://crop.kindwise.com/api/v1/identification',
      {
        images: [`data:image/jpeg;base64,${image}`],
        latitude: latitude || 49.207,
        longitude: longitude || 16.608,
        similar_images: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.KINDWISE_API_KEY
        },
        timeout: 30000
      }
    );

    if (!kindwiseResponse.data.result) {
      throw new Error('No identification result from Kindwise API');
    }

    const result = kindwiseResponse.data.result;
    const plantName = result.crop?.suggestions?.[0]?.name || 'Unknown Plant';
    const diseaseName = result.disease?.suggestions?.[0]?.name || 'No Disease Detected';
    const confidence = result.disease?.suggestions?.[0]?.probability || 0;

    // Get detailed disease information from Gemini AI
    const diseaseInfo = await getDiseaseInfoFromGemini(plantName, diseaseName);

    const response = {
      plant: {
        name: plantName,
        confidence: result.crop?.suggestions?.[0]?.probability || 0
      },
      disease: {
        name: diseaseName,
        confidence: confidence,
        symptoms: diseaseInfo.symptoms,
        diagnosis: diseaseInfo.diagnosis,
        treatment: diseaseInfo.treatment,
        prevention: diseaseInfo.prevention
      },
      location: {
        latitude: latitude || 49.207,
        longitude: longitude || 16.608
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Analysis completed successfully',
      data: response
    });

  } catch (error) {
    console.error('Detection error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        message: 'Request timeout'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message
    });
  }
});

// Get detection history for a user
router.get('/history/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify user can access this history
    if (req.user.uid !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const detectionsRef = db.collection('detections')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await detectionsRef.get();
    const detections = [];

    snapshot.forEach(doc => {
      detections.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: {
        detections,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: detections.length
        }
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get detection history'
    });
  }
});

// Save detection to history
router.post('/save', verifyToken, [
  body('plantName').notEmpty(),
  body('diseaseName').notEmpty(),
  body('confidence').isFloat({ min: 0, max: 1 }),
  body('imageUrl').optional().isURL(),
  body('location').optional().isObject()
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
      confidence,
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

    const newStats = {
      totalDetections: (userData.stats?.totalDetections || 0) + 1,
      successfulDetections: (userData.stats?.successfulDetections || 0) + (confidence > 0.5 ? 1 : 0),
      averageConfidence: calculateAverageConfidence(userData.stats?.averageConfidence || 0, confidence, userData.stats?.totalDetections || 0),
      lastDetectionAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.update({
      'stats': newStats
    });

    res.status(201).json({
      success: true,
      message: 'Detection saved successfully',
      data: {
        id: docRef.id,
        ...detectionData
      }
    });

  } catch (error) {
    console.error('Save detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save detection'
    });
  }
});

// Helper function to calculate average confidence
const calculateAverageConfidence = (currentAvg, newConfidence, totalDetections) => {
  if (totalDetections === 0) return newConfidence;
  return ((currentAvg * totalDetections) + newConfidence) / (totalDetections + 1);
};

module.exports = router;