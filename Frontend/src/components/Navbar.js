import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleBadge = (role) => {
    const badges = {
      student: 'bg-blue-100 text-blue-800',
      instructor: 'bg-green-100 text-green-800',
      admin: 'bg-red-100 text-red-800'
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role) => {
    const icons = {
      student: '👨‍🎓',
      instructor: '👨‍🏫',
      admin: '👑'
    };
    return icons[role] || '👤';
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">BCoder</div>
        {isAuthenticated && (
          <div className="flex items-center space-x-2">
            <span className="text-sm">{getRoleIcon(user?.role)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user?.role)}`}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <NavLink to="/" className="hover:text-gray-300 transition-colors">Home</NavLink>
        
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</NavLink>
            
            {/* Role-specific navigation */}
            {user?.role === 'student' && (
              <>
                <NavLink to="/courses" className="hover:text-gray-300 transition-colors">My Courses</NavLink>
                <NavLink to="/certificates" className="hover:text-gray-300 transition-colors">Certificates</NavLink>
              </>
            )}
            
            {user?.role === 'instructor' && (
              <>
                <NavLink to="/my-courses" className="hover:text-gray-300 transition-colors">My Courses</NavLink>
                <NavLink to="/create-course" className="hover:text-gray-300 transition-colors">Create Course</NavLink>
                <NavLink to="/analytics" className="hover:text-gray-300 transition-colors">Analytics</NavLink>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/users" className="hover:text-gray-300 transition-colors">Users</NavLink>
                <NavLink to="/admin/courses" className="hover:text-gray-300 transition-colors">Courses</NavLink>
                <NavLink to="/admin/analytics" className="hover:text-gray-300 transition-colors">Analytics</NavLink>
                <NavLink to="/admin/settings" className="hover:text-gray-300 transition-colors">Settings</NavLink>
              </>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">Welcome, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className="hover:text-gray-300 transition-colors">Login</NavLink>
            <NavLink to="/register" className="hover:text-gray-300 transition-colors">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}