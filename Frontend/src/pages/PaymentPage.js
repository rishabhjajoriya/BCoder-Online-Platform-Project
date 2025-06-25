import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { paymentsAPI, coursesAPI } from '../api';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderResponse = await paymentsAPI.getOrder(orderId);
      setOrder(orderResponse.data);

      // Fetch course details
      const courseResponse = await coursesAPI.getById(orderResponse.data.courseId);
      setCourse(courseResponse.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to complete payment');
      navigate('/login');
      return;
    }

    setProcessing(true);
    try {
      // Initialize Razorpay payment
      const response = await paymentsAPI.initializePayment({
        orderId: orderId,
        amount: order.amount,
        currency: 'INR',
        userEmail: user.email,
        userName: user.name
      });

      if (response.data.success) {
        const options = {
          key: response.data.key_id, // Your Razorpay Key ID
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'BCoder',
          description: `Payment for ${course.title}`,
          order_id: response.data.razorpay_order_id,
          handler: async (response) => {
            // Payment successful
            try {
              const verifyResponse = await paymentsAPI.verifyPayment({
                orderId: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.data.success) {
                toast.success('Payment successful! You can now access the course.');
                navigate('/dashboard');
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Payment initialization failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    navigate('/dashboard');
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

  if (!order || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure payment powered by Razorpay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Course Details */}
              <div className="flex items-start space-x-4">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                  <p className="text-sm text-gray-600">{course.duration}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Price:</span>
                  <span className="font-semibold">${course.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">${order.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-sm font-bold">R</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Razorpay</p>
                      <p className="text-sm text-gray-600">Secure payment gateway</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">🔒</span>
                  <div>
                    <h4 className="font-semibold text-green-900">Secure Payment</h4>
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Pay $${order.amount}`}
                </button>
                
                <button
                  onClick={handleCancelPayment}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel Payment
                </button>
              </div>

              {/* Money Back Guarantee */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  💰 30-Day Money-Back Guarantee
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Not satisfied? Get a full refund within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-500 text-xl">📹</span>
              <span className="text-gray-700">{course.duration} of video content</span>
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
            <div className="flex items-center space-x-3">
              <span className="text-blue-500 text-xl">🔄</span>
              <span className="text-gray-700">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;