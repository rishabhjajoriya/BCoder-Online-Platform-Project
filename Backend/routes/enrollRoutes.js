const express = require('express');
const { protect } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const generateCertificate = require('../utils/pdfGenerator');
const sendEmail = require('../utils/sendEmail');
const fs = require('fs');
const User = require('../models/User');

const router = express.Router();

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }
    
    // Create enrollment with proper amount
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      amount: amount || course.price, // Use provided amount or course price
      status: 'completed',
      enrolledAt: new Date()
    });
    
    // Update course enrolled students count
    course.enrolledStudents += 1;
    await course.save();
    
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
    
    res.status(201).json({
      success: true,
      message: 'Enrollment successful!',
      enrollment: enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get user enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Private
router.get('/my-enrollments', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title thumbnail price duration instructor',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      })
      .sort({ enrollmentDate: -1 });
    
    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { progress } = req.body;
    
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Check if user owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    enrollment.progress = progress;
    if (progress >= 100) {
      enrollment.completed = true;
    }
    
    await enrollment.save();
    
    // Update user's enrolled courses progress
    await User.updateOne(
      { 
        _id: req.user._id,
        'enrolledCourses.course': enrollment.course
      },
      {
        $set: {
          'enrolledCourses.$.progress': progress,
          'enrolledCourses.$.completed': progress >= 100
        }
      }
    );
    
    res.json(enrollment);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course', 'title thumbnail price duration curriculum')
      .populate('student', 'name email');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Check if user owns this enrollment or is admin
    if (enrollment.student._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(enrollment);
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Simple enrollment (for testing/demo purposes)
// @route   POST /api/enrollments/simple
// @access  Private
router.post('/simple', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }
    
    // Create enrollment without payment (for demo/testing)
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      amount: course.price,
      status: 'completed',
      paymentId: `demo_enrollment_${Date.now()}`,
      enrolledAt: new Date()
    });
    
    // Update course enrolled students count
    course.enrolledStudents += 1;
    await course.save();
    
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
    
    res.status(201).json({
      success: true,
      message: 'Enrollment successful',
      enrollment
    });
  } catch (error) {
    console.error('Simple enrollment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Check if user is enrolled in a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
router.get('/check/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    res.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;