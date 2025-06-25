const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment.js');
const Course = require('../models/Course.js');
const User = require('../models/User.js');
const generateCertificate = require('../utils/pdfGenerator.js');
const sendEmail = require('../utils/sendEmail.js');
const { createOrder, verifyPayment, getOrder, initializePayment } = require('../utils/razorpay');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Create mock order for demo/teaching purposes
    const mockOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // Convert to paise for consistency
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId,
        studentId: req.user._id.toString(),
        courseTitle: course.title
      }
    };
    
    res.json({
      orderId: mockOrder.id,
      amount: mockOrder.amount,
      currency: mockOrder.currency,
      success: true
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount } = req.body;
    
    // For demo/teaching purposes, allow mock payments for all user types
    const isMockPayment = razorpay_signature === 'mock_signature_for_demo';
    
    if (!isMockPayment) {
      // Verify signature for real payments (if needed in future)
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
        .update(body.toString())
        .digest('hex');
      
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false,
        message: 'Already enrolled in this course' 
      });
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      amount: amount,
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id || `mock_payment_${Date.now()}`
    });
    
    // Update course enrolled students count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledStudents: 1 }
    });
    
    // Update user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        enrolledCourses: {
          course: courseId,
          enrolledAt: new Date(),
          progress: 0
        }
      }
    });
    
    res.json({
      success: true,
      message: isMockPayment ? 'Mock payment successful and enrollment created' : 'Payment verified and enrollment created',
      enrollment: {
        _id: enrollment._id,
        course: courseId,
        student: req.user._id,
        amount: amount,
        paymentStatus: 'completed',
        enrollmentDate: enrollment.enrollmentDate
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during payment verification' 
    });
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Enrollment.find({ 
      student: req.user._id,
      paymentStatus: 'completed'
    })
    .populate('course', 'title thumbnail')
    .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
