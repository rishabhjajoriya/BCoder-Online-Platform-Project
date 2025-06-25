const express = require('express');
const { protect } = require('../middleware/auth');
const generateCertificate = require('../utils/pdfGenerator');

const router = express.Router();

// @desc    Generate certificate
// @route   POST /api/certificates/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { userId, courseId, quizId, score, courseName, userName } = req.body;

    // Mock certificate generation for demo
    const certificateData = {
      userId,
      courseId,
      quizId,
      score,
      courseName,
      userName,
      issuedDate: new Date(),
      certificateId: `CERT_${Date.now()}`
    };

    // In a real app, this would generate a PDF
    // For demo, we'll return a mock certificate URL
    const certificateUrl = `data:application/pdf;base64,${Buffer.from('Mock PDF Certificate').toString('base64')}`;

    res.json({
      success: true,
      certificate: certificateData,
      certificateUrl: certificateUrl
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
});

// @desc    Get user certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
router.get('/my-certificates', protect, async (req, res) => {
  try {
    // Mock certificates for demo
    const certificates = [
      {
        id: 'cert_1',
        courseName: 'Complete JavaScript Masterclass',
        score: 85,
        issuedDate: new Date(),
        certificateUrl: '#'
      }
    ];

    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Failed to get certificates' });
  }
});

// @desc    Download certificate
// @route   GET /api/certificates/:id/download
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock certificate download
    res.json({
      success: true,
      certificateUrl: `data:application/pdf;base64,${Buffer.from('Mock PDF Certificate').toString('base64')}`
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ message: 'Failed to download certificate' });
  }
});

module.exports = router; 