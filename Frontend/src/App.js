import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import store from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import DemoButton from './components/DemoButton';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import QuizPage from './pages/QuizPage';
import EnrollmentPage from './pages/EnrollmentPage';
import PaymentPage from './pages/PaymentPage';

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:id" 
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/:id" 
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/enroll/:id" 
            element={
              <ProtectedRoute>
                <EnrollmentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/:orderId" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <DemoButton />
      </div>
    </Provider>
  );
}