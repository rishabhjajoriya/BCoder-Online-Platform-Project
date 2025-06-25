const Course = require('../models/Course');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

const sampleCourses = [
  {
    title: "Complete JavaScript Masterclass",
    description: "Learn JavaScript from scratch to advanced concepts including ES6+, DOM manipulation, async programming, and modern frameworks.",
    price: 49.99,
    duration: 12, // hours as number
    level: "beginner",
    category: "programming",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    rating: 4.8,
    enrolledStudents: 1250,
    curriculum: [
      {
        title: "Introduction to JavaScript",
        duration: 45, // minutes as number
        description: "Basic syntax, variables, data types",
        videoUrl: "https://example.com/video1"
      },
      {
        title: "Functions and Scope",
        duration: 60, 
        description: "Function declarations, expressions, closures",
        videoUrl: "https://example.com/video2"
      },
      {
        title: "DOM Manipulation",
        duration: 90,
        description: "Selecting elements, event handling, dynamic content",
        videoUrl: "https://example.com/video3"
      }
    ],
    requirements: ["Basic computer knowledge", "No programming experience required"],
    learningOutcomes: [
      "JavaScript fundamentals and ES6+ features",
      "DOM manipulation and event handling",
      "Async programming with Promises and async/await",
      "Modern JavaScript frameworks introduction"
    ],
    isPublished: true
  },
  {
    title: "React.js Complete Guide",
    description: "Master React.js with hooks, context, routing, and state management. Build real-world applications from scratch.",
    price: 79.99,
    duration: 18, // hours as number
    level: "intermediate",
    category: "programming",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    rating: 4.9,
    enrolledStudents: 890,
    curriculum: [
      {
        title: "React Fundamentals",
        duration: 90,
        description: "Components, JSX, props, state",
        videoUrl: "https://example.com/video4"
      },
      {
        title: "Hooks and Context",
        duration: 120,
        description: "useState, useEffect, useContext",
        videoUrl: "https://example.com/video5"
      },
      {
        title: "Routing and Navigation",
        duration: 75,
        description: "React Router, navigation guards",
        videoUrl: "https://example.com/video6"
      }
    ],
    requirements: ["Basic JavaScript knowledge", "Understanding of ES6+ features"],
    learningOutcomes: [
      "React components and JSX syntax",
      "State management with hooks",
      "Context API for global state",
      "Routing and navigation patterns"
    ],
    isPublished: true
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design. Create beautiful, functional, and user-friendly designs.",
    price: 59.99,
    duration: 15, // hours as number
    level: "beginner",
    category: "design",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    rating: 4.7,
    enrolledStudents: 650,
    curriculum: [
      {
        title: "Design Principles",
        duration: 60,
        description: "Color theory, typography, layout",
        videoUrl: "https://example.com/video7"
      },
      {
        title: "User Research",
        duration: 90,
        description: "User personas, user journeys, wireframing",
        videoUrl: "https://example.com/video8"
      },
      {
        title: "Prototyping",
        duration: 120,
        description: "Figma, Adobe XD, interactive prototypes",
        videoUrl: "https://example.com/video9"
      }
    ],
    requirements: ["Creative mindset", "Basic computer skills"],
    learningOutcomes: [
      "Design principles and color theory",
      "User research and persona creation",
      "Wireframing and prototyping",
      "Design tools and software"
    ],
    isPublished: true
  },
  {
    title: "Digital Marketing Mastery",
    description: "Comprehensive guide to digital marketing including SEO, social media, email marketing, and analytics.",
    price: 69.99,
    duration: 20, // hours as number
    level: "intermediate",
    category: "marketing",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    rating: 4.6,
    enrolledStudents: 1100,
    curriculum: [
      {
        title: "SEO Fundamentals",
        duration: 90,
        description: "Keyword research, on-page SEO, technical SEO",
        videoUrl: "https://example.com/video10"
      },
      {
        title: "Social Media Marketing",
        duration: 120,
        description: "Platform strategies, content creation, engagement",
        videoUrl: "https://example.com/video11"
      },
      {
        title: "Email Marketing",
        duration: 75,
        description: "List building, automation, analytics",
        videoUrl: "https://example.com/video12"
      }
    ],
    requirements: ["Basic business knowledge", "Internet familiarity"],
    learningOutcomes: [
      "Search engine optimization techniques",
      "Social media marketing strategies",
      "Email marketing automation",
      "Analytics and performance tracking"
    ],
    isPublished: true
  },
  {
    title: "Data Science with Python",
    description: "Learn data science fundamentals using Python. Master pandas, numpy, matplotlib, and machine learning basics.",
    price: 89.99,
    duration: 25, // hours as number
    level: "advanced",
    category: "data-science",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    rating: 4.9,
    enrolledStudents: 750,
    curriculum: [
      {
        title: "Python for Data Science",
        duration: 120,
        description: "Pandas, NumPy, data manipulation",
        videoUrl: "https://example.com/video13"
      },
      {
        title: "Data Visualization",
        duration: 90,
        description: "Matplotlib, Seaborn, interactive charts",
        videoUrl: "https://example.com/video14"
      },
      {
        title: "Machine Learning Basics",
        duration: 150,
        description: "Scikit-learn, model training, evaluation",
        videoUrl: "https://example.com/video15"
      }
    ],
    requirements: ["Python programming basics", "Mathematics fundamentals"],
    learningOutcomes: [
      "Data manipulation with pandas and numpy",
      "Data visualization techniques",
      "Machine learning algorithms",
      "Statistical analysis methods"
    ],
    isPublished: true
  },
  {
    title: "Business Strategy & Leadership",
    description: "Develop strategic thinking and leadership skills. Learn business planning, team management, and organizational development.",
    price: 99.99,
    duration: 16, // hours as number
    level: "intermediate",
    category: "business",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
    rating: 4.8,
    enrolledStudents: 520,
    curriculum: [
      {
        title: "Strategic Planning",
        duration: 90,
        description: "SWOT analysis, competitive advantage, market positioning",
        videoUrl: "https://example.com/video16"
      },
      {
        title: "Leadership Skills",
        duration: 120,
        description: "Team building, communication, decision making",
        videoUrl: "https://example.com/video17"
      },
      {
        title: "Business Development",
        duration: 90,
        description: "Growth strategies, partnerships, scaling",
        videoUrl: "https://example.com/video18"
      }
    ],
    requirements: ["Business experience helpful", "Management interest"],
    learningOutcomes: [
      "Strategic planning and analysis",
      "Leadership and team management",
      "Business development strategies",
      "Organizational growth techniques"
    ],
    isPublished: true
  }
];

const sampleQuizzes = [
  {
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
    questions: [
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: [
          "var x = 5;",
          "variable x = 5;",
          "v x = 5;",
          "declare x = 5;"
        ],
        correctAnswer: 0
      },
      {
        question: "Which method is used to add an element to the end of an array?",
        options: [
          "push()",
          "pop()",
          "shift()",
          "unshift()"
        ],
        correctAnswer: 0
      },
      {
        question: "What does DOM stand for?",
        options: [
          "Document Object Model",
          "Data Object Model",
          "Document Oriented Model",
          "Dynamic Object Model"
        ],
        correctAnswer: 0
      }
    ],
    timeLimit: 15, // minutes
    passingScore: 70
  },
  {
    title: "React.js Basics Quiz",
    description: "Test your understanding of React components, props, state, and hooks.",
    questions: [
      {
        question: "What is JSX?",
        options: [
          "A JavaScript library",
          "A syntax extension for JavaScript",
          "A CSS framework",
          "A database technology"
        ],
        correctAnswer: 1
      },
      {
        question: "Which hook is used for side effects in functional components?",
        options: [
          "useState",
          "useEffect",
          "useContext",
          "useReducer"
        ],
        correctAnswer: 1
      },
      {
        question: "How do you pass data from parent to child component?",
        options: [
          "Using state",
          "Using props",
          "Using context",
          "Using refs"
        ],
        correctAnswer: 1
      }
    ],
    timeLimit: 20,
    passingScore: 75
  }
];

const populateSampleData = async () => {
  try {
    console.log('🌱 Starting to populate sample data...');

    // Drop collections for a true clean slate
    const mongoose = require('mongoose');
    const db = mongoose.connection;
    try { await db.collection('users').drop(); } catch (e) { if (e.codeName !== 'NamespaceNotFound') throw e; }
    try { await db.collection('courses').drop(); } catch (e) { if (e.codeName !== 'NamespaceNotFound') throw e; }
    try { await db.collection('quizzes').drop(); } catch (e) { if (e.codeName !== 'NamespaceNotFound') throw e; }
    console.log('🗑️ Dropped users, courses, and quizzes collections');

    // Create instructor users first
    const instructor1 = await User.create({
      name: 'John Smith',
      email: 'john.smith@bcoder.com',
      password: 'instructor123',
      role: 'instructor'
    });
    const instructor2 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bcoder.com',
      password: 'instructor123',
      role: 'instructor'
    });
    const instructor3 = await User.create({
      name: 'Emily Chen',
      email: 'emily.chen@bcoder.com',
      password: 'instructor123',
      role: 'instructor'
    });
    const instructor4 = await User.create({
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@bcoder.com',
      password: 'instructor123',
      role: 'instructor'
    });
    const instructor5 = await User.create({
      name: 'Dr. Lisa Wang',
      email: 'lisa.wang@bcoder.com',
      password: 'instructor123',
      role: 'instructor'
    });
    const instructor6 = await User.create({
      name: 'Robert Thompson',
      email: 'robert.thompson@bcoder.com',
      password: 'instructor123',
      role: 'instructor'
    });
    console.log('✅ Created instructor users');

    // Create sample courses with proper instructor references
    const coursesWithInstructors = [
      { ...sampleCourses[0], instructor: instructor1._id },
      { ...sampleCourses[1], instructor: instructor2._id },
      { ...sampleCourses[2], instructor: instructor3._id },
      { ...sampleCourses[3], instructor: instructor4._id },
      { ...sampleCourses[4], instructor: instructor5._id },
      { ...sampleCourses[5], instructor: instructor6._id }
    ];
    const createdCourses = await Course.insertMany(coursesWithInstructors);
    console.log(`✅ Created ${createdCourses.length} sample courses`);

    // Create sample quizzes and link them to courses
    const jsCourse = createdCourses.find(course => course.title.includes('JavaScript'));
    const reactCourse = createdCourses.find(course => course.title.includes('React'));
    if (jsCourse) {
      await Quiz.create({ ...sampleQuizzes[0], course: jsCourse._id });
    }
    if (reactCourse) {
      await Quiz.create({ ...sampleQuizzes[1], course: reactCourse._id });
    }
    console.log('✅ Created sample quizzes');

    // Create a sample admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@bcoder.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Created admin user (admin@bcoder.com / admin123)');

    // Create a sample regular user
    await User.create({
      name: 'Demo Student',
      email: 'student@bcoder.com',
      password: 'student123',
      role: 'student'
    });
    console.log('✅ Created demo student (student@bcoder.com / student123)');

    console.log('🎉 Sample data population completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@bcoder.com / admin123');
    console.log('Student: student@bcoder.com / student123');
    console.log('Instructors: [email]@bcoder.com / instructor123');
    console.log('\n📚 Sample courses created with full details, modules, and quizzes!');

    return { success: true, message: 'Sample data populated successfully' };
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
    return { success: false, message: error.message };
  }
};

module.exports = { populateSampleData }; 