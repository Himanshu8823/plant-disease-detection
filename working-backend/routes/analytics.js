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

// Get app usage statistics
router.get('/usage', verifyToken, async (req, res) => {
  try {
    // Mock data for now - in production, this would aggregate real usage data
    const usageStats = {
      totalUsers: 1250,
      activeUsers: 890,
      totalDetections: 5670,
      averageDetectionsPerUser: 4.5,
      successRate: 87.3,
      mostCommonDiseases: [
        { name: 'Leaf Blight', count: 234, percentage: 18.7 },
        { name: 'Powdery Mildew', count: 189, percentage: 15.1 },
        { name: 'Root Rot', count: 156, percentage: 12.5 },
        { name: 'Bacterial Spot', count: 134, percentage: 10.7 },
        { name: 'Anthracnose', count: 98, percentage: 7.8 }
      ],
      topPlants: [
        { name: 'Tomato', count: 456, percentage: 36.5 },
        { name: 'Corn', count: 234, percentage: 18.7 },
        { name: 'Wheat', count: 189, percentage: 15.1 },
        { name: 'Soybean', count: 156, percentage: 12.5 },
        { name: 'Potato', count: 134, percentage: 10.7 }
      ],
      monthlyGrowth: [
        { month: 'Jan', detections: 234, users: 89 },
        { month: 'Feb', detections: 345, users: 123 },
        { month: 'Mar', detections: 456, users: 167 },
        { month: 'Apr', detections: 567, users: 234 },
        { month: 'May', detections: 678, users: 345 },
        { month: 'Jun', detections: 789, users: 456 }
      ]
    };

    res.json({
      success: true,
      data: usageStats
    });

  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get usage statistics'
    });
  }
});

// Get personal analytics for the user
router.get('/personal', verifyToken, async (req, res) => {
  try {
    // Get user's detection history
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

    // Calculate personal analytics
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

    // Monthly activity
    const monthlyActivity = {};
    detections.forEach(detection => {
      const month = new Date(detection.timestamp?.toDate?.() || detection.timestamp).toLocaleDateString('en-US', { month: 'short' });
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });

    const monthlyData = Object.entries(monthlyActivity)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month + ' 1, 2024') - new Date(b.month + ' 1, 2024'));

    const personalAnalytics = {
      overview: {
        totalDetections,
        successfulDetections,
        successRate: totalDetections > 0 ? (successfulDetections / totalDetections) * 100 : 0,
        averageConfidence: averageConfidence * 100
      },
      topDiseases,
      topPlants,
      monthlyActivity: monthlyData,
      recentActivity: detections.slice(0, 10).map(d => ({
        id: d.id,
        plantName: d.plantName,
        diseaseName: d.diseaseName,
        confidence: d.confidence,
        timestamp: d.timestamp
      }))
    };

    res.json({
      success: true,
      data: personalAnalytics
    });

  } catch (error) {
    console.error('Get personal analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get personal analytics'
    });
  }
});

// Get disease insights
router.get('/diseases', verifyToken, async (req, res) => {
  try {
    // Mock disease insights data
    const diseaseInsights = {
      globalTrends: [
        {
          disease: 'Leaf Blight',
          trend: 'increasing',
          percentage: 15.2,
          affectedPlants: ['Tomato', 'Corn', 'Wheat'],
          season: 'Summer',
          riskLevel: 'High'
        },
        {
          disease: 'Powdery Mildew',
          trend: 'stable',
          percentage: 12.8,
          affectedPlants: ['Grape', 'Cucumber', 'Squash'],
          season: 'Spring',
          riskLevel: 'Medium'
        },
        {
          disease: 'Root Rot',
          trend: 'decreasing',
          percentage: 8.5,
          affectedPlants: ['Tomato', 'Pepper', 'Eggplant'],
          season: 'All Year',
          riskLevel: 'Medium'
        }
      ],
      seasonalAnalysis: {
        spring: ['Powdery Mildew', 'Early Blight', 'Anthracnose'],
        summer: ['Leaf Blight', 'Bacterial Spot', 'Sunscald'],
        autumn: ['Late Blight', 'Gray Mold', 'Downy Mildew'],
        winter: ['Root Rot', 'Crown Rot', 'Frost Damage']
      },
      preventionTips: {
        'Leaf Blight': [
          'Remove infected plant debris',
          'Use resistant varieties',
          'Apply fungicides preventively',
          'Ensure proper spacing for air circulation'
        ],
        'Powdery Mildew': [
          'Avoid overhead watering',
          'Plant in full sun',
          'Use resistant varieties',
          'Apply neem oil or sulfur-based fungicides'
        ],
        'Root Rot': [
          'Improve soil drainage',
          'Avoid overwatering',
          'Use well-draining soil',
          'Remove infected plants immediately'
        ]
      }
    };

    res.json({
      success: true,
      data: diseaseInsights
    });

  } catch (error) {
    console.error('Get disease insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get disease insights'
    });
  }
});

// Get weather impact analysis
router.get('/weather-impact', verifyToken, async (req, res) => {
  try {
    // Mock weather impact data
    const weatherImpact = {
      currentConditions: {
        temperature: 25,
        humidity: 65,
        windSpeed: 12,
        riskLevel: 'Medium',
        recommendations: [
          'Monitor for heat stress in sensitive plants',
          'Maintain adequate irrigation',
          'Watch for fungal diseases due to moderate humidity'
        ]
      },
      seasonalTrends: {
        spring: {
          commonIssues: ['Frost damage', 'Wet soil diseases'],
          recommendations: ['Protect from late frosts', 'Improve drainage']
        },
        summer: {
          commonIssues: ['Heat stress', 'Drought stress'],
          recommendations: ['Provide shade', 'Increase watering frequency']
        },
        autumn: {
          commonIssues: ['Fungal diseases', 'Nutrient deficiencies'],
          recommendations: ['Apply fungicides', 'Fertilize appropriately']
        },
        winter: {
          commonIssues: ['Cold damage', 'Root rot'],
          recommendations: ['Protect from cold', 'Avoid overwatering']
        }
      },
      weatherDiseaseCorrelation: [
        {
          weatherCondition: 'High Humidity (>80%)',
          diseases: ['Powdery Mildew', 'Downy Mildew', 'Gray Mold'],
          riskLevel: 'High'
        },
        {
          weatherCondition: 'High Temperature (>30°C)',
          diseases: ['Sunscald', 'Heat Stress', 'Bacterial Wilt'],
          riskLevel: 'Medium'
        },
        {
          weatherCondition: 'Heavy Rainfall',
          diseases: ['Root Rot', 'Leaf Blight', 'Anthracnose'],
          riskLevel: 'High'
        },
        {
          weatherCondition: 'Drought Conditions',
          diseases: ['Drought Stress', 'Spider Mites', 'Powdery Mildew'],
          riskLevel: 'Medium'
        }
      ]
    };

    res.json({
      success: true,
      data: weatherImpact
    });

  } catch (error) {
    console.error('Get weather impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weather impact analysis'
    });
  }
});

module.exports = router;