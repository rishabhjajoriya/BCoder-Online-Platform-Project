const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { populateSampleData } = require('./utils/sampleData');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollRoutes = require('./routes/enrollRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'BCoder API is running successfully!' });
});

// Sample data population endpoint (for development/demo purposes)
app.post('/api/populate-sample-data', async (req, res) => {
  try {
    const result = await populateSampleData();
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Sample data populated successfully! Check console for details.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.message 
      });
    }
  } catch (error) {
    console.error('Error populating sample data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error populating sample data: ' + error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Auto-populate sample data on startup
const initializeApp = async () => {
  try {
    // Wait for MongoDB connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Populate sample data
    console.log('🌱 Auto-populating sample data on startup...');
    const result = await populateSampleData();
    if (result.success) {
      console.log('✅ Sample data populated successfully on startup!');
    } else {
      console.log('⚠️ Sample data population failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error during startup sample data population:', error);
  }
};

app.listen(PORT, () => {
  console.log(`🚀 BCoder Server running on port ${PORT}`);
  console.log(`📚 Skill Learning Platform API ready!`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📦 MongoDB Connected: localhost`);
  console.log(`\n💡 To manually populate sample data, make a POST request to: http://localhost:${PORT}/api/populate-sample-data`);
  
  // Initialize app with sample data
  initializeApp();
});
