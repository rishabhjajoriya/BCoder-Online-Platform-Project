# 🎓 BCoder Online Platform Project

A full-stack skill learning platform built with Node.js, Express, React, and MongoDB. Features role-based dashboards for students, instructors, and administrators with comprehensive course management, payment integration, and certificate generation.

## 🌟 Features

### 👨‍🎓 Student Features
- **Course Enrollment**: Browse and enroll in courses
- **Progress Tracking**: Real-time learning progress with visual indicators
- **Interactive Quizzes**: Take quizzes to test knowledge
- **Certificate Generation**: Download certificates upon course completion
- **Payment Integration**: Secure payment processing with Razorpay
- **Personal Dashboard**: Track enrolled courses, progress, and achievements

### 👨‍🏫 Instructor Features
- **Course Management**: Create, edit, and manage courses
- **Student Analytics**: Track student progress and performance
- **Content Management**: Upload course materials and videos
- **Quiz Creation**: Design interactive quizzes for students
- **Earnings Dashboard**: Monitor course revenue and analytics
- **Student Management**: View and manage enrolled students

### 👑 Admin Features
- **Platform Overview**: Comprehensive system analytics
- **User Management**: Manage students, instructors, and admins
- **Course Oversight**: Monitor all platform courses
- **System Analytics**: Platform performance and growth metrics
- **Content Moderation**: Approve and manage course content
- **Revenue Tracking**: Monitor platform revenue and transactions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **SendGrid** - Email notifications
- **PDFKit** - Certificate generation

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Context API** - State management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishabhjajoriya/BCoder-Online-Platform-Project.git
   cd BCoder-Online-Platform-Project
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the Backend directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/bcoder
   JWT_SECRET=your_jwt_secret_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

5. **Start the Application**
   
   **Backend:**
   ```bash
   cd Backend
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd Frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

## 👥 Demo Credentials

### Student Account
- **Email**: student@bcoder.com
- **Password**: student123

### Instructor Account
- **Email**: john.smith@bcoder.com
- **Password**: instructor123

### Admin Account
- **Email**: admin@bcoder.com
- **Password**: admin123

## 📁 Project Structure

```
BCoder Project/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Quiz.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── quizRoutes.js
│   │   └── certificateRoutes.js
│   ├── utils/
│   │   ├── pdfGenerator.js
│   │   ├── razorpay.js
│   │   ├── sampleData.js
│   │   └── sendEmail.js
│   └── server.js
├── Frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboards/
│   │   │   │   ├── StudentDashboard.js
│   │   │   │   ├── InstructorDashboard.js
│   │   │   │   └── AdminDashboard.js
│   │   │   ├── CourseCard.js
│   │   │   ├── Navbar.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── HomePage.js
│   │   │   ├── Login.js
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── api.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (instructor)
- `PUT /api/courses/:id` - Update course (instructor)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my` - Get user enrollments
- `PUT /api/enrollments/:id/progress` - Update progress

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get course quiz
- `POST /api/quizzes/submit` - Submit quiz answers

### Certificates
- `GET /api/certificates/my` - Get user certificates
- `GET /api/certificates/:id/download` - Download certificate

## 🎨 Key Features

### Role-Based Dashboards
- **Student Dashboard**: Learning progress, enrolled courses, certificates
- **Instructor Dashboard**: Course management, student analytics, earnings
- **Admin Dashboard**: Platform overview, user management, system analytics

### Payment Integration
- Secure payment processing with Razorpay
- Mock payment system for demonstration
- Order creation and verification

### Certificate Generation
- Automated PDF certificate generation
- Course completion tracking
- Downloadable certificates

### Email Notifications
- Welcome emails
- Course enrollment confirmations
- Certificate notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rishabh Jajoriya**
- GitHub: [@rishabhjajoriya](https://github.com/rishabhjajoriya)
- Portfolio: [View other projects](https://github.com/rishabhjajoriya)

## 🙏 Acknowledgments

- React.js community for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All contributors and supporters

---

⭐ **Star this repository if you find it helpful!** 