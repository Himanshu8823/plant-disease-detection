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

// Middleware to verify JWT token (optional for contact form)
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      // Allow anonymous contact submissions
      req.user = null;
      return next();
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRecord = await admin.auth().getUser(decoded.uid);
    req.user = userRecord;
    next();
  } catch (error) {
    // Allow anonymous contact submissions
    req.user = null;
    next();
  }
};

// Submit contact form
router.post('/submit', verifyToken, [
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('subject').notEmpty().trim().isLength({ min: 5, max: 200 }),
  body('message').notEmpty().trim().isLength({ min: 10, max: 2000 })
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

    const { name, email, subject, message } = req.body;

    const contactData = {
      name,
      email,
      subject,
      message,
      userId: req.user?.uid || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'new',
      priority: 'normal'
    };

    // Save to Firestore
    const docRef = await db.collection('contact_submissions').add(contactData);

    // Send email notification (mock for now)
    // In production, you would integrate with a service like SendGrid, Mailgun, etc.
    console.log('Contact form submission:', {
      id: docRef.id,
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: docRef.id,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
});

// Get contact submissions (admin only)
router.get('/submissions', verifyToken, async (req, res) => {
  try {
    // Check if user is admin (you would implement your own admin check)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { page = 1, limit = 20, status } = req.query;

    let query = db.collection('contact_submissions');

    // Apply status filter if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    // Order by timestamp and apply pagination
    query = query.orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();
    const submissions = [];

    snapshot.forEach(doc => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: submissions.length
        }
      }
    });

  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact submissions'
    });
  }
});

// Update contact submission status (admin only)
router.put('/submission/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { status, priority, response } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (response) {
      updateData.response = response;
      updateData.respondedAt = admin.firestore.FieldValue.serverTimestamp();
      updateData.respondedBy = req.user.uid;
    }

    await db.collection('contact_submissions').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Contact submission updated successfully'
    });

  } catch (error) {
    console.error('Update contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact submission'
    });
  }
});

// Get contact submission by ID
router.get('/submission/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('contact_submissions').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    const submissionData = doc.data();

    // Check if user can access this submission
    if (req.user && submissionData.userId && submissionData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...submissionData
      }
    });

  } catch (error) {
    console.error('Get contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact submission'
    });
  }
});

// Get contact statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get all submissions
    const snapshot = await db.collection('contact_submissions').get();
    const submissions = [];

    snapshot.forEach(doc => {
      submissions.push(doc.data());
    });

    // Calculate statistics
    const totalSubmissions = submissions.length;
    const newSubmissions = submissions.filter(s => s.status === 'new').length;
    const inProgressSubmissions = submissions.filter(s => s.status === 'in_progress').length;
    const resolvedSubmissions = submissions.filter(s => s.status === 'resolved').length;

    // Get submissions by priority
    const priorityStats = {
      low: submissions.filter(s => s.priority === 'low').length,
      normal: submissions.filter(s => s.priority === 'normal').length,
      high: submissions.filter(s => s.priority === 'high').length,
      urgent: submissions.filter(s => s.priority === 'urgent').length
    };

    // Get monthly submissions
    const monthlyStats = {};
    submissions.forEach(submission => {
      const month = new Date(submission.timestamp?.toDate?.() || submission.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    const stats = {
      total: totalSubmissions,
      byStatus: {
        new: newSubmissions,
        inProgress: inProgressSubmissions,
        resolved: resolvedSubmissions
      },
      byPriority: priorityStats,
      monthly: Object.entries(monthlyStats)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(a.month) - new Date(b.month))
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact statistics'
    });
  }
});

module.exports = router;