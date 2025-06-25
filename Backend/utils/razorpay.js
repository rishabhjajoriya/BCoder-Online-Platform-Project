// MOCK Razorpay integration for demo/teaching

const createOrder = async ({ courseId, enrollmentId, amount }) => {
  // Simulate order creation
  return {
    success: true,
    orderId: `MOCK_ORDER_${Date.now()}`,
    amount,
    currency: 'INR',
    courseId,
    enrollmentId
  };
};

const initializePayment = async ({ orderId, amount, currency, userEmail, userName }) => {
  // Simulate payment initialization
  return {
    success: true,
    key_id: 'rzp_test_MOCKKEY',
    amount,
    currency,
    razorpay_order_id: orderId
  };
};

const verifyPayment = async ({ orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {
  // Simulate payment verification (always success)
  return {
    success: true,
    message: 'Payment verified (mock)'
  };
};

const getOrder = async (orderId) => {
  // Simulate fetching order details
  return {
    orderId,
    amount: 100,
    currency: 'INR',
    courseId: 'mockCourseId',
    enrollmentId: 'mockEnrollmentId',
    status: 'created'
  };
};

module.exports = {
  createOrder,
  initializePayment,
  verifyPayment,
  getOrder
};
