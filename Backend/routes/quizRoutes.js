const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ 
      course: req.params.courseId,
      isActive: true
    }).select('-questions.correctAnswer');
    
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get quiz by ID (without correct answers)
// @route   GET /api/quizzes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title')
      .select('-questions.correctAnswer');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const answerDetails = [];
    
    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      answerDetails.push({
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      });
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Save attempt
    const attempt = {
      student: req.user._id,
      score,
      totalQuestions,
      answers: answerDetails,
      completedAt: new Date()
    };
    
    quiz.attempts.push(attempt);
    await quiz.save();
    
    res.json({
      score,
      totalQuestions,
      correctAnswers,
      passed: score >= quiz.passingScore,
      attemptId: attempt._id
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create quiz (Instructor only)
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId, title, description, questions, timeLimit, passingScore } = req.body;
    
    // Check if course exists and user is instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to create quiz for this course' });
    }
    
    const quiz = await Quiz.create({
      course: courseId,
      title,
      description,
      questions,
      timeLimit,
      passingScore
    });
    
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update quiz (Instructor only)
// @route   PUT /api/quizzes/:id
// @access  Private (Instructor/Admin)
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is course instructor or admin
    const course = await Course.findById(quiz.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this quiz' });
    }
    
    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json(quiz);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get quiz results (Instructor only)
// @route   GET /api/quizzes/:id/results
// @access  Private (Instructor/Admin)
router.get('/:id/results', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('attempts.student', 'name email')
      .populate('course', 'title');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if user is course instructor or admin
    const course = await Course.findById(quiz.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view these results' });
    }
    
    res.json(quiz.attempts);
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
