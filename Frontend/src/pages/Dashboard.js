import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import InstructorDashboard from '../components/dashboards/InstructorDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Render different dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
