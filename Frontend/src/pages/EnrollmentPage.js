import React from 'react';
import { useParams } from 'react-router-dom';

const EnrollmentPage = () => {
  const { courseId } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Enrollment</h1>
        <p className="text-gray-600">Course ID: {courseId}</p>
        <p className="text-gray-600 mt-4">Enrollment functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default EnrollmentPage;
