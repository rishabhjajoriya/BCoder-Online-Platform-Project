import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { coursesAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: categoryFilter,
        level: levelFilter,
        sort: sortBy
      };
      
      const response = await coursesAPI.getAll(params);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, levelFilter, sortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'other', label: 'Other' }
  ];

  const levels = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'enrolled', label: 'Most Popular' }
  ];

  const getHeroContent = () => {
    if (!isAuthenticated) {
      return {
        title: "Learn Skills That Matter",
        subtitle: "Master programming, design, business, and more with expert-led courses",
        primaryButton: { text: "Get Started", link: "/register" },
        secondaryButton: { text: "Browse Courses", link: "#courses" }
      };
    }

    switch (user?.role) {
      case 'student':
        return {
          title: `Welcome back, ${user?.name}!`,
          subtitle: "Continue your learning journey with our expert-led courses",
          primaryButton: { text: "My Dashboard", link: "/dashboard" },
          secondaryButton: { text: "Browse Courses", link: "#courses" }
        };
      case 'instructor':
        return {
          title: `Welcome, Instructor ${user?.name}!`,
          subtitle: "Share your knowledge and grow your teaching business",
          primaryButton: { text: "Create Course", link: "/create-course" },
          secondaryButton: { text: "My Analytics", link: "/analytics" }
        };
      case 'admin':
        return {
          title: `Welcome, Admin ${user?.name}!`,
          subtitle: "Manage the platform and oversee all activities",
          primaryButton: { text: "Admin Dashboard", link: "/dashboard" },
          secondaryButton: { text: "Manage Users", link: "/admin/users" }
        };
      default:
        return {
          title: "Learn Skills That Matter",
          subtitle: "Master programming, design, business, and more with expert-led courses",
          primaryButton: { text: "Get Started", link: "/register" },
          secondaryButton: { text: "Browse Courses", link: "#courses" }
        };
    }
  };

  const heroContent = getHeroContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={heroContent.primaryButton.link}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {heroContent.primaryButton.text}
            </Link>
            <Link
              to={heroContent.secondaryButton.link}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              {heroContent.secondaryButton.text}
            </Link>
          </div>
        </div>
      </div>

      {/* Role-specific Quick Actions */}
      {isAuthenticated && (
        <div className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user?.role === 'student' && (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold text-gray-900">View Progress</h3>
                    <p className="text-sm text-gray-600">Track your learning journey</p>
                  </Link>
                  <Link
                    to="/certificates"
                    className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">🏆</div>
                    <h3 className="font-semibold text-gray-900">My Certificates</h3>
                    <p className="text-sm text-gray-600">Download your achievements</p>
                  </Link>
                  <Link
                    to="/"
                    className="bg-purple-50 p-6 rounded-lg text-center hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="font-semibold text-gray-900">Find Courses</h3>
                    <p className="text-sm text-gray-600">Discover new skills</p>
                  </Link>
                </>
              )}
              
              {user?.role === 'instructor' && (
                <>
                  <Link
                    to="/create-course"
                    className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">📝</div>
                    <h3 className="font-semibold text-gray-900">Create Course</h3>
                    <p className="text-sm text-gray-600">Share your expertise</p>
                  </Link>
                  <Link
                    to="/analytics"
                    className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600">View performance insights</p>
                  </Link>
                  <Link
                    to="/my-courses"
                    className="bg-purple-50 p-6 rounded-lg text-center hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">📚</div>
                    <h3 className="font-semibold text-gray-900">My Courses</h3>
                    <p className="text-sm text-gray-600">Manage your content</p>
                  </Link>
                </>
              )}
              
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/users"
                    className="bg-red-50 p-6 rounded-lg text-center hover:bg-red-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <h3 className="font-semibold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-600">Manage all users</p>
                  </Link>
                  <Link
                    to="/admin/courses"
                    className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">📚</div>
                    <h3 className="font-semibold text-gray-900">Course Management</h3>
                    <p className="text-sm text-gray-600">Oversee all courses</p>
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold text-gray-900">Platform Analytics</h3>
                    <p className="text-sm text-gray-600">View system insights</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {user?.role === 'instructor' ? 'All Platform Courses' : 'Explore Courses'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search for courses..."
              />
            </div>
            <FilterDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories}
              label="Category"
            />
            <FilterDropdown
              value={levelFilter}
              onChange={setLevelFilter}
              options={levels}
              label="Level"
            />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${courses.length} courses found`}
            </p>
            <FilterDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              label="Sort by"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BCoder?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to advance your career
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals with real-world experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Learn Anywhere
              </h3>
              <p className="text-gray-600">
                Access courses on any device, anytime, anywhere
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Earn Certificates
              </h3>
              <p className="text-gray-600">
                Get recognized for your achievements with certificates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
