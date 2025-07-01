import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { coursesAPI, enrollmentsAPI, paymentsAPI } from '../api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await coursesAPI.getById(id);
      if (response.data) {
        setCourse(response.data);
      } else {
        toast.error('Failed to fetch course details');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to fetch course details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!user) return;
    
    try {
      const response = await enrollmentsAPI.checkEnrollment(id);
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);

      // Role-based enrollment flow
      if (user.role === 'student') {
        // Students go through payment flow
        await handleStudentEnrollment();
      } else {
        // Admins and instructors get direct enrollment
        await handleDirectEnrollment();
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStudentEnrollment = async () => {
    try {
      // Create payment order
      const orderResponse = await paymentsAPI.createOrder({
        courseId: id,
        amount: course.price
      });

      if (orderResponse.data.success) {
        // Redirect to payment page
        navigate(`/pay/${orderResponse.data.orderId}`);
      } else {
        toast.error(orderResponse.data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create payment order');
    }
  };

  const handleDirectEnrollment = async () => {
    try {
      const response = await enrollmentsAPI.createEnrollment({
        courseId: id,
        amount: course.price
      });

      if (response.data.success) {
        toast.success('Successfully enrolled in the course!');
        setIsEnrolled(true);
      } else {
        toast.error(response.data.message || 'Enrollment failed');
      }
    } catch (error) {
      console.error('Direct enrollment error:', error);
      toast.error('Enrollment failed. Please try again.');
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">{course.description}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-semibold">{course.instructor?.name || 'Instructor'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-semibold">{course.level}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">₹{course.price}</div>
                  <div className="text-sm text-gray-500">Course Price</div>
                </div>
                
                {isEnrolled ? (
                  <button
                    onClick={handleStartLearning}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Access Course
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                )) || (
                  <div className="text-gray-500">Learning outcomes will be available soon.</div>
                )}
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules?.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Module {index + 1}: {module.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{module.duration}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-gray-500">Course modules will be available soon.</div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements?.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">•</span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                )) || (
                  <li className="text-gray-500">No specific requirements for this course.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xl">📹</span>
                  <span className="text-gray-700">{course.duration} of content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xl">📄</span>
                  <span className="text-gray-700">Downloadable resources</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xl">🏆</span>
                  <span className="text-gray-700">Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xl">♾️</span>
                  <span className="text-gray-700">Full lifetime access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xl">📱</span>
                  <span className="text-gray-700">Access on mobile and TV</span>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">
                    {course.instructor?.name?.charAt(0) || 'I'}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{course.instructor?.name || 'Instructor'}</h4>
                  <p className="text-gray-600 text-sm">{course.instructor?.email || 'instructor@bcoder.com'}</p>
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
