import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { quizzesAPI, certificatesAPI } from '../api';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    fetchQuizDetails();
  }, [id]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const response = await quizzesAPI.getById(id);
      setQuiz(response.data);
      setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
      
      // Fetch course details if available
      if (response.data.courseId) {
        try {
          const courseResponse = await fetch(`http://localhost:8000/api/courses/${response.data.courseId}`);
          const courseData = await courseResponse.json();
          setCourse(courseData);
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizStarted) return;

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / quiz.questions.length) * 100;
    setScore(percentage);
    setQuizCompleted(true);

    // Submit quiz results
    try {
      await quizzesAPI.submitQuiz({
        quizId: id,
        userId: user._id,
        answers: answers,
        score: percentage,
        timeTaken: quiz.timeLimit * 60 - timeLeft
      });

      if (percentage >= quiz.passingScore) {
        toast.success(`Congratulations! You passed with ${percentage.toFixed(1)}%`);
      } else {
        toast.error(`You scored ${percentage.toFixed(1)}%. Minimum required: ${quiz.passingScore}%`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz results');
    }
  };

  const generateCertificate = async () => {
    if (score < quiz.passingScore) {
      toast.error('You need to pass the quiz to get a certificate');
      return;
    }

    setGeneratingCertificate(true);
    try {
      const response = await certificatesAPI.generateCertificate({
        userId: user._id,
        courseId: course?._id,
        quizId: id,
        score: score,
        courseName: course?.title || 'Course',
        userName: user.name
      });

      if (response.data.success) {
        // Download the certificate
        const link = document.createElement('a');
        link.href = response.data.certificateUrl;
        link.download = `certificate_${course?.title || 'course'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Certificate generated and downloaded successfully!');
      } else {
        toast.error('Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600">The quiz you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Quiz Information</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-semibold">{quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-semibold">{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing Score:</span>
                    <span className="font-semibold">{quiz.passingScore}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>• Read each question carefully</li>
                  <li>• Select only one answer per question</li>
                  <li>• You cannot go back to previous questions</li>
                  <li>• Quiz will auto-submit when time runs out</li>
                  <li>• Passing score required for certificate</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
              <p className="text-gray-600">Here are your results</p>
            </div>

            <div className="text-center mb-8">
              <div className={`text-6xl font-bold mb-4 ${score >= quiz.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                {score.toFixed(1)}%
              </div>
              <div className="text-xl font-semibold mb-2">
                {score >= quiz.passingScore ? '🎉 Congratulations! You Passed!' : '❌ You did not pass'}
              </div>
              <p className="text-gray-600">
                Passing score required: {quiz.passingScore}%
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{quiz.questions.length}</div>
                <div className="text-gray-600">Total Questions</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((score / 100) * quiz.questions.length)}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(quiz.timeLimit * 60 - timeLeft)}
                </div>
                <div className="text-gray-600">Time Taken</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {score >= quiz.passingScore && (
                <button
                  onClick={generateCertificate}
                  disabled={generatingCertificate}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {generatingCertificate ? 'Generating...' : 'Download Certificate'}
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
              <div className="text-gray-600">Time Remaining</div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(currentQuestion, index)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Object.keys(answers).length} / {quiz.questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
