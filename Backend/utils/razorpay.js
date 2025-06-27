const crypto = require('crypto');

// Mock Razorpay implementation for demo purposes
const createOrder = async ({ amount, currency = 'INR', receipt, notes }) => {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId,
      amount: Math.round(amount * 100), // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      status: 'created',
      notes: notes || {},
      created_at: Date.now()
    };
    
    console.log('Creating mock Razorpay order with options:', {
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      payment_capture: 1,
      notes: order.notes
    });
    
    console.log('Mock Razorpay order created successfully:', order);
    
    return { success: true, order };
  } catch (error) {
    console.error('Mock order creation error:', error);
    return { success: false, error };
  }
};

// Get order details (mock)
const getOrder = async (orderId) => {
  try {
    // For demo purposes, return a mock order
    const order = {
      id: orderId,
      amount: 99900, // Default amount in paise
      currency: 'INR',
      status: 'created',
      notes: {
        courseId: 'mock_course_id',
        courseTitle: 'Demo Course',
        userId: 'mock_user_id'
      },
      created_at: Date.now()
    };
    
    return { success: true, order };
  } catch (error) {
    return { success: false, error };
  }
};

// Verify payment signature (mock)
const verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount }) => {
  try {
    console.log('Payment verification (demo mode):', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount
    });
    
    // For demo purposes, always return success
    return { success: true };
  } catch (error) {
    console.error('Mock payment verification error:', error);
    return { success: false, error: error.message };
  }
};

// Initialize payment (mock)
const initializePayment = async ({ courseId, amount, courseTitle, currency = 'INR' }) => {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      orderId,
      amount: Math.round(amount * 100),
      currency,
      paymentOptions: {
        amount: Math.round(amount * 100),
        currency,
        name: 'BCoder Learning Platform',
        description: courseTitle,
        order_id: orderId,
        prefill: {
          name: 'Demo User',
          email: 'demo@bcoder.com'
        },
        theme: {
          color: '#3B82F6'
        }
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  createOrder,
  getOrder,
  verifyPayment,
  initializePayment
};
