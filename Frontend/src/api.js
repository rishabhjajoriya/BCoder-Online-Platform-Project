import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401 errors on protected routes
    if (error.response?.status === 401 && error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  addReview: (id, reviewData) => api.post(`/courses/${id}/reviews`, reviewData),
};

// Enrollments API
export const enrollmentsAPI = {
  enroll: (enrollmentData) => api.post('/enrollments', enrollmentData),
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
  getUserEnrollments: () => api.get('/enrollments/my-enrollments'),
  createEnrollment: (enrollmentData) => api.post('/enrollments', enrollmentData),
  simpleEnroll: (courseId) => api.post('/enrollments/simple', { courseId }),
  checkEnrollment: (courseId) => api.get(`/enrollments/check/${courseId}`),
  updateProgress: (id, progress) => api.put(`/enrollments/${id}/progress`, { progress }),
  getById: (id) => api.get(`/enrollments/${id}`),
};

// Payments API
export const paymentsAPI = {
  createOrder: (orderData) => api.post('/payments/create-order', orderData),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
  getHistory: () => api.get('/payments/history'),
  getOrder: (orderId) => api.get(`/payments/order/${orderId}`),
  initialize: (paymentData) => api.post('/payments/initialize', paymentData),
};

// Quizzes API
export const quizzesAPI = {
  getByCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getById: (id) => api.get(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  submitQuiz: (quizData) => api.post(`/quizzes/${quizData.quizId}/submit`, quizData),
  create: (quizData) => api.post('/quizzes', quizData),
  update: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  getResults: (id) => api.get(`/quizzes/${id}/results`),
};

// Certificates API
export const certificatesAPI = {
  generateCertificate: (certificateData) => api.post('/certificates/generate', certificateData),
  getMyCertificates: () => api.get('/certificates/my-certificates'),
  downloadCertificate: (id) => api.get(`/certificates/${id}/download`),
};

export default api;

