import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { coursesAPI, enrollmentsAPI } from '../../api';
import { toast } from 'react-toastify';

const InstructorDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [myCourses, setMyCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      // Fetch instructor's courses and enrollments
      const [coursesRes, enrollmentsRes] = await Promise.all([
        coursesAPI.getAll(), // This will need to be filtered by instructor
        enrollmentsAPI.getMyEnrollments() // This will need to be modified for instructor view
      ]);
      
      // Filter courses by current instructor (this is a simplified approach)
      const instructorCourses = coursesRes.data.filter(course => 
        course.instructor?.email === user?.email || course.instructor?.name === user?.name
      );
      
      setMyCourses(instructorCourses);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error('Error fetching instructor data:', error);
      toast.error('Failed to load instructor dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseStats = (courseId) => {
    const courseEnrollments = enrollments.filter(e => e.course?._id === courseId);
    const totalEnrollments = courseEnrollments.length;
    const completedEnrollments = courseEnrollments.filter(e => e.completed).length;
    const averageProgress = courseEnrollments.length > 0 
      ? Math.round(courseEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / courseEnrollments.length)
      : 0;
    
    return { totalEnrollments, completedEnrollments, averageProgress };
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading instructor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, Instructor {user?.name}! 👨‍🏫
      </h1>
      
      {/* Instructor Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">My Courses</h3>
          <p className="text-3xl font-bold text-green-600">
            {myCourses.length}
          </p>
          <p className="text-green-700">Created courses</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">
            {enrollments.length}
          </p>
          <p className="text-blue-700">Enrolled students</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Active Students</h3>
          <p className="text-3xl font-bold text-purple-600">
            {enrollments.filter(e => !e.completed).length}
          </p>
          <p className="text-purple-700">Currently learning</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-orange-600">
            {enrollments.length > 0 
              ? Math.round((enrollments.filter(e => e.completed).length / enrollments.length) * 100)
              : 0}%
          </p>
          <p className="text-orange-700">Students completed</p>
        </div>
      </div>

      {/* My Courses Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <Link
            to="/create-course"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Create New Course
          </Link>
        </div>
        
        {myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => {
              const stats = calculateCourseStats(course._id);
              return (
                <div key={course._id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{stats.totalEnrollments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">{stats.completedEnrollments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Progress:</span>
                      <span className="font-medium">{stats.averageProgress}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/courses/${course._id}/edit`}
                      className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit Course
                    </Link>
                    
                    <Link
                      to={`/courses/${course._id}/analytics`}
                      className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      View Analytics
                    </Link>
                    
                    <Link
                      to={`/courses/${course._id}/students`}
                      className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Manage Students
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses created yet</h3>
            <p className="text-gray-600 mb-4">Start creating courses to share your knowledge</p>
            <Link
              to="/create-course"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Create Your First Course
            </Link>
          </div>
        )}
      </div>

      {/* Recent Student Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Student Activity</h2>
        {enrollments.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              {enrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment._id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{enrollment.course?.title}</h4>
                    <p className="text-sm text-gray-600">Student: {enrollment.student?.name || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{enrollment.progress}% Complete</p>
                    <p className="text-xs text-gray-500">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {enrollments.length > 5 && (
              <div className="text-center mt-4">
                <Link
                  to="/students"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Students →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-4xl mb-2">👥</div>
            <p className="text-gray-600">No student activity yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Instructor Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/create-course"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-900">Create Course</h3>
            <p className="text-sm text-gray-600">Design new learning content</p>
          </Link>
          
          <Link
            to="/analytics"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed insights</p>
          </Link>
          
          <Link
            to="/students"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900">Manage Students</h3>
            <p className="text-sm text-gray-600">Track student progress</p>
          </Link>
          
          <Link
            to="/earnings"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900">Earnings</h3>
            <p className="text-sm text-gray-600">View your revenue</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard; 