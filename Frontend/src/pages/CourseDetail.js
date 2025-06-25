import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, enrollmentsAPI, paymentsAPI } from '../api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getById(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!user) return;
    
    try {
      const response = await enrollmentsAPI.getUserEnrollments();
      const userEnrollments = response.data;
      const enrolled = userEnrollments.some(enrollment => enrollment.courseId === id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this course');
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      // Create enrollment
      const enrollmentResponse = await enrollmentsAPI.createEnrollment({
        courseId: id,
        userId: user._id
      });

      if (enrollmentResponse.data.success) {
        // Create payment order
        const paymentResponse = await paymentsAPI.createOrder({
          courseId: id,
          enrollmentId: enrollmentResponse.data.enrollment._id,
          amount: course.price
        });

        if (paymentResponse.data.success) {
          // Redirect to payment page
          navigate(`/pay/${paymentResponse.data.orderId}`);
        } else {
          toast.error('Failed to create payment order');
        }
      } else {
        toast.error('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/courses/${id}/learn`);
  };

  const handleTakeQuiz = () => {
    navigate(`/quiz/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Image */}
            <div className="lg:col-span-2">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Course Info & Enrollment */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-700">{course.rating}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-700">{course.enrolledStudents} students enrolled</span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>📚 {course.duration} hours</span>
                  <span>•</span>
                  <span className="capitalize">{course.level}</span>
                  <span>•</span>
                  <span className="capitalize">{course.category}</span>
                </div>
              </div>

              {/* Price and Enrollment */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ₹{course.price}
                </div>
                
                {isEnrolled ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleStartLearning}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Continue Learning
                    </button>
                    <button
                      onClick={handleTakeQuiz}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Take Quiz
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                )}

                <p className="text-sm text-gray-600 mt-2 text-center">
                  30-Day Money-Back Guarantee
                </p>
              </div>

              {/* Instructor */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Instructor</h3>
                <p className="text-gray-700">{course.instructor?.name || 'Expert Instructor'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningOutcomes?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <div className="space-y-3">
                {course.curriculum?.map((module, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{module.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {course.requirements?.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Features */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">This course includes:</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {course.duration} hours on-demand video
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Full lifetime access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Access on mobile and TV
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Certificate of completion
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Interactive quizzes
                </li>
              </ul>
            </div>

            {/* Demo Features for Teaching */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">🎓 Teaching Demo Features</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-center">
                  <span className="mr-2">💳</span>
                  Mock Razorpay Payment Gateway
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📝</span>
                  Interactive Quiz System
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📄</span>
                  PDF Certificate Generation
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  Email Notifications
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  User Role Management
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
