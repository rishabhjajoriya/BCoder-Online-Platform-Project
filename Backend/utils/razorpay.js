const crypto = require('crypto');

// For teaching demo, we'll simulate Razorpay sandbox flow
// This allows students to see the complete payment integration without needing real credentials
const RAZORPAY_SANDBOX_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag';
const RAZORPAY_SANDBOX_KEY_SECRET = 'thisisasamplesecret';

// Note: These are sample credentials for teaching purposes
// In a real application, you would get these from Razorpay Dashboard
// For real integration: https://dashboard.razorpay.com/

let razorpay = null;

// In-memory storage for teaching demo orders
const demoOrders = new Map();

// For teaching demo, we'll use a simulated approach
console.log('✅ Using simulated Razorpay sandbox for teaching demo');
console.log('💡 This simulates the real Razorpay flow without needing actual credentials');

// Create order using Razorpay sandbox for teaching demo
const createOrder = async ({ amount, currency = 'INR', receipt, notes }) => {
  try {
    console.log('Creating Razorpay sandbox order with options:', {
      amount: Math.round(amount * 100),
      currency,
      receipt,
      payment_capture: 1,
      notes
    });

    // For teaching demo, we'll create a realistic order that simulates Razorpay
    // This allows students to see the complete payment flow without needing real credentials
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order = {
      id: orderId,
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      status: 'created',
      notes: notes || {},
      created_at: Date.now()
    };
    
    // Store the order in memory for retrieval
    demoOrders.set(orderId, order);
    
    console.log('✅ Teaching demo order created:', order.id);
    return { success: true, order };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: error.message };
  }
};

// Get order details from Razorpay sandbox
const getOrder = async (orderId) => {
  try {
    if (razorpay) {
      // Real Razorpay sandbox order
      const order = await razorpay.orders.fetch(orderId);
      return { success: true, order };
    } else {
      // For teaching demo, retrieve from in-memory storage
      const order = demoOrders.get(orderId);
      if (order) {
        return { success: true, order };
      } else {
        return { success: false, error: 'Order not found' };
      }
    }
  } catch (error) {
    console.error('Get order error:', error);
    return { success: false, error: error.message };
  }
};

// Verify payment signature using simulated Razorpay sandbox
const verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount }) => {
  try {
    console.log('Verifying simulated Razorpay sandbox payment:', {
      razorpay_order_id,
      razorpay_payment_id,
      courseId,
      amount
    });

    // For teaching demo, we'll accept demo signatures or verify real ones
    if (razorpay_signature === 'demo_signature_for_teaching') {
      console.log('✅ Teaching demo payment signature accepted');
      return { success: true };
    }

    // For real implementation, this would use actual Razorpay signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_SANDBOX_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      console.log('✅ Simulated Razorpay sandbox payment signature verified');
      return { success: true };
    } else {
      console.log('❌ Simulated Razorpay sandbox payment signature verification failed');
      console.log('Expected:', expectedSignature);
      console.log('Received:', razorpay_signature);
      return { success: false, error: 'Invalid payment signature' };
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return { success: false, error: error.message };
  }
};

// Initialize payment with Razorpay sandbox options
const initializePayment = async ({ courseId, amount, courseTitle, currency = 'INR' }) => {
  try {
    const order = await createOrder({
      amount,
      currency,
      receipt: `course_${courseId}_${Date.now()}`,
      notes: {
        courseId,
        courseTitle,
        type: 'course_enrollment'
      }
    });

    if (!order.success) {
      return { success: false, error: order.error };
    }

    return {
      success: true,
      orderId: order.order.id,
      amount: order.order.amount,
      currency: order.order.currency,
      paymentOptions: {
        key: RAZORPAY_SANDBOX_KEY_ID,
        amount: order.order.amount,
        currency: order.order.currency,
        name: 'BCoder Learning Platform',
        description: courseTitle,
        order_id: order.order.id,
        prefill: {
          name: 'Demo User',
          email: 'demo@bcoder.com'
        },
        theme: {
          color: '#3B82F6'
        },
        handler: function (response) {
          console.log('Payment successful:', response);
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
