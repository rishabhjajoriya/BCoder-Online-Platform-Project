import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsAPI, certificatesAPI } from '../../api';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        enrollmentsAPI.getMyEnrollments(),
        certificatesAPI.getMyCertificates()
      ]);
      
      setEnrollments(enrollmentsRes.data);
      setCertificates(certificatesRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await certificatesAPI.downloadCertificate(certificateId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.name}! 👋
      </h1>
      
      {/* Student Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">My Courses</h3>
          <p className="text-3xl font-bold text-blue-600">
            {enrollments.length}
          </p>
          <p className="text-blue-700">Enrolled courses</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Progress</h3>
          <p className="text-3xl font-bold text-green-600">
            {enrollments.filter(enrollment => enrollment.completed).length}
          </p>
          <p className="text-green-700">Completed courses</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Certificates</h3>
          <p className="text-3xl font-bold text-purple-600">
            {certificates.length}
          </p>
          <p className="text-purple-700">Earned certificates</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-orange-600">
            {enrollments.length > 0 
              ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
              : 0}%
          </p>
          <p className="text-orange-700">Overall progress</p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Enrolled Courses</h2>
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{enrollment.course?.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    enrollment.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {enrollment.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/courses/${enrollment.course?._id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue Learning
                  </Link>
                  
                  {enrollment.course && (
                    <Link
                      to={`/quiz/${enrollment.course._id}`}
                      className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Take Quiz
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
            <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Certificates */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Certificates</h2>
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="font-semibold text-gray-900">{certificate.courseName}</h3>
                  <p className="text-sm text-gray-600">Completed on {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                </div>
                
                <button
                  onClick={() => handleDownloadCertificate(certificate._id)}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Download Certificate
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-600">Complete courses and pass quizzes to earn certificates</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900">Browse Courses</h3>
            <p className="text-sm text-gray-600">Find new courses to enroll</p>
          </Link>
          
          <Link
            to="/dashboard"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">View Progress</h3>
            <p className="text-sm text-gray-600">Track your learning journey</p>
          </Link>
          
          <Link
            to="/"
            className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-900">My Achievements</h3>
            <p className="text-sm text-gray-600">View certificates and badges</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 