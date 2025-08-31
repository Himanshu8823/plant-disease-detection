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

// Send chat message
router.post('/send', verifyToken, [
  body('message').notEmpty().trim().isLength({ min: 1, max: 1000 }),
  body('context').optional().isObject()
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

    const { message, context } = req.body;

    // Get user's recent detections for context
    let userContext = '';
    if (context?.recentDetections) {
      userContext = `Recent detections: ${context.recentDetections.map(d => `${d.plantName} - ${d.diseaseName}`).join(', ')}. `;
    }

    // Create enhanced prompt with context
    const enhancedPrompt = `
      You are an expert plant pathologist and agricultural consultant. 
      ${userContext}
      
      User question: ${message}
      
      Please provide a helpful, accurate, and practical response. 
      Focus on plant care, disease management, and agricultural best practices.
      Keep your response concise but informative.
    `;

    // Call Gemini AI
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: enhancedPrompt
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

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    // Save chat to database
    const chatData = {
      userId: req.user.uid,
      userMessage: message,
      aiResponse: aiResponse,
      context: context || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const chatRef = await db.collection('chat_history').add(chatData);

    res.json({
      success: true,
      message: 'Chat response generated successfully',
      data: {
        id: chatRef.id,
        message: aiResponse,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Gemini API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message
    });
  }
});

// Get chat history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const chatSnapshot = await db.collection('chat_history')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const chats = [];
    chatSnapshot.forEach(doc => {
      chats.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: chats.length
        }
      }
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history'
    });
  }
});

// Get contextual suggestions
router.get('/suggestions', verifyToken, async (req, res) => {
  try {
    // Get user's recent detections for personalized suggestions
    const detectionsSnapshot = await db.collection('detections')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    const recentDetections = [];
    detectionsSnapshot.forEach(doc => {
      recentDetections.push(doc.data());
    });

    // Generate personalized suggestions based on recent detections
    const suggestions = [
      {
        type: 'general',
        title: 'How to prevent plant diseases?',
        message: 'What are the best practices for preventing plant diseases in my garden?'
      },
      {
        type: 'general',
        title: 'When to water plants?',
        message: 'What is the best time of day to water my plants and how often?'
      },
      {
        type: 'general',
        title: 'Natural pest control',
        message: 'What are some natural ways to control pests in my garden?'
      }
    ];

    // Add disease-specific suggestions based on recent detections
    if (recentDetections.length > 0) {
      const lastDetection = recentDetections[0];
      suggestions.push({
        type: 'disease_followup',
        title: `More about ${lastDetection.diseaseName}`,
        message: `Tell me more about ${lastDetection.diseaseName} and how to treat it effectively.`
      });

      suggestions.push({
        type: 'disease_followup',
        title: `Prevent ${lastDetection.diseaseName}`,
        message: `How can I prevent ${lastDetection.diseaseName} from affecting my other ${lastDetection.plantName} plants?`
      });
    }

    res.json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
});

// Get quick response options
router.get('/quick-responses', verifyToken, async (req, res) => {
  try {
    const quickResponses = [
      {
        category: 'Plant Care',
        responses: [
          {
            title: 'Watering Schedule',
            message: 'What is the best watering schedule for my plants?'
          },
          {
            title: 'Fertilizer Guide',
            message: 'When and how should I fertilize my plants?'
          },
          {
            title: 'Pruning Tips',
            message: 'How often should I prune my plants and what\'s the best technique?'
          }
        ]
      },
      {
        category: 'Disease Management',
        responses: [
          {
            title: 'Early Detection',
            message: 'What are the early signs of plant diseases I should watch for?'
          },
          {
            title: 'Treatment Options',
            message: 'What are the most effective treatments for common plant diseases?'
          },
          {
            title: 'Prevention Methods',
            message: 'How can I prevent diseases from spreading in my garden?'
          }
        ]
      },
      {
        category: 'Seasonal Care',
        responses: [
          {
            title: 'Spring Preparation',
            message: 'What should I do to prepare my garden for spring?'
          },
          {
            title: 'Summer Protection',
            message: 'How can I protect my plants during hot summer months?'
          },
          {
            title: 'Winter Care',
            message: 'What special care do my plants need during winter?'
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: quickResponses
    });

  } catch (error) {
    console.error('Get quick responses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quick responses'
    });
  }
});

module.exports = router;