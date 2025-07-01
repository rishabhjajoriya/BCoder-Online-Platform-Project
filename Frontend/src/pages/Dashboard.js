import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import InstructorDashboard from '../components/dashboards/InstructorDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard = () => {
  // const { user } = useAuth();
  const user = useSelector((state) => state.auth.user);

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
