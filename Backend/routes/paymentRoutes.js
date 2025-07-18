const express = require('express');
const { protect } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment.js');
const Course = require('../models/Course.js');
const User = require('../models/User.js');
const generateCertificate = require('../utils/pdfGenerator.js');
const sendEmail = require('../utils/sendEmail.js');
const { createOrder, verifyPayment, getOrder, initializePayment } = require('../utils/razorpay');

const router = express.Router();

// @desc    Create payment order (Razorpay Sandbox)
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    console.log('Create order request:', { courseId, amount, userId: req.user.id });
    
    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course ID is required' 
      });
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found for ID:', courseId);
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already enrolled in this course' 
      });
    }
    
    // Create real Razorpay order
    const orderResult = await createOrder({
      amount: amount || course.price,
      currency: 'INR',
      receipt: `course_${courseId}_${Date.now()}`,
      notes: { 
        courseId: courseId,
        courseTitle: course.title,
        userId: req.user.id,
        type: 'course_enrollment'
      }
    });
    
    if (!orderResult.success) {
      console.error('Order creation failed:', orderResult.error);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to create order',
        error: orderResult.error
      });
    }
    
    // Return order details for Razorpay payment
    res.json({
      success: true,
      orderId: orderResult.order.id,
      amount: orderResult.order.amount,
      currency: orderResult.order.currency,
      order: orderResult.order,
      razorpayKey: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
      message: 'Razorpay order created successfully'
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// @desc    Verify payment and create enrollment (Razorpay Sandbox)
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      courseId, 
      amount 
    } = req.body;
    
    console.log('Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      courseId,
      amount
    });
    
    // Verify payment with real Razorpay signature
    const verificationResult = await verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount
    });
    
    if (!verificationResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: verificationResult.error || 'Payment verification failed' 
      });
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already enrolled in this course' 
      });
    }
    
    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      amount: amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'completed',
      enrolledAt: new Date()
    });
    
    await enrollment.save();
    
    // Populate course and instructor details
    await enrollment.populate([
      { path: 'course', select: 'title description instructor' },
      { path: 'course.instructor', select: 'name email' }
    ]);
    
    // Send confirmation email (optional)
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Enrollment Confirmation - ${course.title}`,
        text: `Congratulations! You have successfully enrolled in ${course.title}.`
      });
    } catch (emailError) {
      console.log('Email sending failed (optional):', emailError.message);
    }
    
    res.json({
      success: true,
      message: 'Payment successful! You can now access the course.',
      enrollment: enrollment
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// @desc    Get order details by order ID (Razorpay Sandbox)
// @route   GET /api/payments/order/:orderId
// @access  Private
router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('Get order request for orderId:', orderId);
    
    // Get order from Razorpay
    const orderResult = await getOrder(orderId);
    
    if (!orderResult.success) {
      console.error('Failed to get order:', orderResult.error);
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      order: orderResult.order
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// @desc    Initialize payment with Razorpay options
// @route   POST /api/payments/initialize
// @access  Private
router.post('/initialize', protect, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course ID is required' 
      });
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Initialize payment with Razorpay
    const paymentResult = await initializePayment({
      courseId,
      amount: amount || course.price,
      courseTitle: course.title
    });
    
    if (!paymentResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to initialize payment',
        error: paymentResult.error
      });
    }
    
    res.json({
      success: true,
      orderId: paymentResult.orderId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      paymentOptions: paymentResult.paymentOptions,
      message: 'Payment initialized successfully'
    });
    
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title price')
      .sort({ enrolledAt: -1 });
    
    res.json({
      success: true,
      payments: enrollments
    });
    
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
