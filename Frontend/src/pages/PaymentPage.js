import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paymentsAPI } from '../api';
import { toast } from 'react-toastify';
import { coursesAPI } from '../api';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  
  const [course, setCourse] = useState(null);
  const [amount, setAmount] = useState(0);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    console.log('PaymentPage mounted with orderId:', orderId);
    console.log('Auth state:', { isAuthenticated, authLoading, user });
    
    if (!authLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (isAuthenticated && orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, authLoading, navigate]);

  const fetchOrderDetails = async () => {
    try {
      console.log('Fetching order details for:', orderId);
      setLoading(true);
      setError(null);
      
      const response = await paymentsAPI.getOrder(orderId);
      console.log('Order response:', response);
      
      if (response.data.success) {
        const order = response.data.order;
        setAmount(order.amount / 100); // Convert from paise to rupees
        setCourseTitle(order.notes?.courseTitle || 'Course');
        
        // Get courseId from order notes or courseId field
        const courseId = order.notes?.courseId || order.courseId;
        
        if (courseId) {
          console.log('Fetching course details for courseId:', courseId);
          try {
            const courseResponse = await coursesAPI.getById(courseId);
            if (courseResponse.data) {
              setCourse(courseResponse.data);
              setCourseTitle(courseResponse.data.title);
            }
          } catch (courseError) {
            console.error('Error fetching course details:', courseError);
            // Set basic course info from order
            setCourse({ 
              _id: courseId, 
              id: courseId,
              title: courseTitle || 'Course' 
            });
          }
        }
      } else {
        setError('Failed to fetch order details');
        toast.error('Failed to fetch order details');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to fetch order details');
      toast.error('Failed to fetch order details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPayment = async () => {
    try {
      setProcessing(true);
      setShowDemoModal(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the order details to ensure we have the correct course ID
      const orderResponse = await paymentsAPI.getOrder(orderId);
      if (!orderResponse.data.success) {
        toast.error('Failed to get order details');
        setProcessing(false);
        setShowDemoModal(false);
        return;
      }
      
      const order = orderResponse.data.order;
      const courseId = order.notes?.courseId;
      
      if (!courseId) {
        toast.error('Course ID not found in order');
        setProcessing(false);
        setShowDemoModal(false);
        return;
      }
      
      // Simulate successful payment with demo payment ID
      const demoPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Order details:', order);
      console.log('Attempting payment verification with:', {
        orderId,
        courseId,
        amount,
        demoPaymentId
      });
      
      // Verify payment with backend
      const verifyResponse = await paymentsAPI.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: demoPaymentId,
        razorpay_signature: 'demo_signature_for_teaching',
        courseId: courseId,
        amount: amount
      });
      
      console.log('Payment verification response:', verifyResponse);
      
      if (verifyResponse.data && verifyResponse.data.success) {
        toast.success('Payment successful! You can now access the course.');
        setShowDemoModal(false);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        const errorMessage = verifyResponse.data?.message || 'Payment verification failed';
        console.error('Payment verification failed:', errorMessage);
        
        // Check if user is already enrolled
        if (errorMessage.includes('already enrolled')) {
          toast.info('You are already enrolled in this course! Redirecting to dashboard...');
          setShowDemoModal(false);
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          toast.error(errorMessage);
          setShowDemoModal(false);
        }
      }
      
    } catch (error) {
      console.error('Demo payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed';
      
      // Check if user is already enrolled
      if (errorMessage.includes('already enrolled')) {
        toast.info('You are already enrolled in this course! Redirecting to dashboard...');
        setShowDemoModal(false);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error(errorMessage);
        setShowDemoModal(false);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Invalid Payment Link</h2>
            <p className="text-sm">No order ID found. Please try enrolling in the course again.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Payment Error</h2>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Your Enrollment</h1>
            <p className="text-blue-100 mt-1">Choose your payment method</p>
          </div>

          {/* Course Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course?.title || courseTitle}</h3>
                <p className="text-sm text-gray-600">{course?.instructor?.name || 'Instructor'}</p>
                <p className="text-sm text-gray-600">{course?.duration || 'Duration'}</p>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">₹{amount}</span>
            </div>
          </div>

          {/* Payment Options */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Demo Payment Option */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Teaching Demo Payment</h3>
                  <p className="text-gray-600 mb-6">
                    Simulated payment flow for teaching purposes. 
                    This demonstrates the complete payment integration without real charges.
                  </p>
                  
                  <button
                    onClick={handleDemoPayment}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg"
                  >
                    {processing ? 'Processing...' : 'Complete Demo Payment'}
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Teaching Demo Mode</p>
                    <p>This is a simulated payment flow for educational purposes. In a real application, you would integrate with actual payment gateways like Razorpay, Stripe, or PayPal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Payment Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Simulating payment verification...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;