import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { coursesAPI, enrollmentsAPI } from '../../api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch all platform data for admin overview
      const [coursesRes, enrollmentsRes] = await Promise.all([
        coursesAPI.getAll(),
        enrollmentsAPI.getMyEnrollments() // This will need to be modified for admin view
      ]);
      
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
      
      // Mock user data for demo
      setUsers([
        { _id: '1', name: 'John Smith', email: 'john.smith@bcoder.com', role: 'instructor', status: 'active' },
        { _id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@bcoder.com', role: 'instructor', status: 'active' },
        { _id: '3', name: 'Emily Chen', email: 'emily.chen@bcoder.com', role: 'instructor', status: 'active' },
        { _id: '4', name: 'Demo Student', email: 'student@bcoder.com', role: 'student', status: 'active' },
        { _id: '5', name: 'Admin User', email: 'admin@bcoder.com', role: 'admin', status: 'active' }
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getRoleStats = () => {
    const students = users.filter(u => u.role === 'student').length;
    const instructors = users.filter(u => u.role === 'instructor').length;
    const admins = users.filter(u => u.role === 'admin').length;
    return { students, instructors, admins };
  };

  const getCourseStats = () => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === 'active').length;
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(e => e.completed).length;
    return { totalCourses, activeCourses, totalEnrollments, completedEnrollments };
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  const roleStats = getRoleStats();
  const courseStats = getCourseStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, Admin {user?.name}! 👑
      </h1>
      
      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-red-600">
            {users.length}
          </p>
          <p className="text-red-700">Platform users</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">
            {courseStats.totalCourses}
          </p>
          <p className="text-blue-700">Available courses</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Total Enrollments</h3>
          <p className="text-3xl font-bold text-green-600">
            {courseStats.totalEnrollments}
          </p>
          <p className="text-green-700">Course enrollments</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-purple-600">
            {courseStats.totalEnrollments > 0 
              ? Math.round((courseStats.completedEnrollments / courseStats.totalEnrollments) * 100)
              : 0}%
          </p>
          <p className="text-purple-700">Students completed</p>
        </div>
      </div>

      {/* User Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <Link
            to="/admin/users"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manage Users
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Students</h3>
              <div className="text-3xl font-bold text-blue-600">{roleStats.students}</div>
            </div>
            <p className="text-blue-700">Active learners</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Instructors</h3>
              <div className="text-3xl font-bold text-green-600">{roleStats.instructors}</div>
            </div>
            <p className="text-green-700">Course creators</p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-900">Admins</h3>
              <div className="text-3xl font-bold text-red-600">{roleStats.admins}</div>
            </div>
            <p className="text-red-700">Platform managers</p>
          </div>
        </div>
      </div>

      {/* Course Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <Link
            to="/admin/courses"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Manage Courses
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Courses:</span>
                <span className="font-medium">{courseStats.totalCourses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Courses:</span>
                <span className="font-medium">{courseStats.activeCourses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Enrollments:</span>
                <span className="font-medium">{courseStats.totalEnrollments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">{courseStats.completedEnrollments}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
            {courses.slice(0, 3).map((course) => (
              <div key={course._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600">by {course.instructor?.name}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">System Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-gray-900">Growth Rate</h3>
            <p className="text-3xl font-bold text-blue-600">+15%</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">$12.5K</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900">Conversion</h3>
            <p className="text-3xl font-bold text-purple-600">8.2%</p>
            <p className="text-sm text-gray-600">Visitor to student</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-semibold text-gray-900">Rating</h3>
            <p className="text-3xl font-bold text-orange-600">4.8</p>
            <p className="text-sm text-gray-600">Average rating</p>
          </div>
        </div>
      </div>

      {/* Admin Tools */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold text-red-900 mb-4">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600">Manage all users</p>
          </Link>
          
          <Link
            to="/admin/courses"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900">Course Management</h3>
            <p className="text-sm text-gray-600">Oversee all courses</p>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600">Platform insights</p>
          </Link>
          
          <Link
            to="/admin/settings"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-gray-900">Settings</h3>
            <p className="text-sm text-gray-600">System configuration</p>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => toast.success('Sample data populated!')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Populate Sample Data
          </button>
          <button
            onClick={() => toast.info('Backup completed!')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Backup
          </button>
          <button
            onClick={() => toast.warning('System maintenance scheduled!')}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Schedule Maintenance
          </button>
          <button
            onClick={() => toast.error('Emergency mode activated!')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Emergency Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 