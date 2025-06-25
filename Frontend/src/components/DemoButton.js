import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DemoButton = () => {
  const [loading, setLoading] = useState(false);

  const populateSampleData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/populate-sample-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Sample data populated successfully! Refresh the page to see the courses.');
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to populate sample data');
      }
    } catch (error) {
      console.error('Error populating sample data:', error);
      toast.error('Failed to populate sample data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={populateSampleData}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg"
      >
        {loading ? 'Loading...' : '🎯 Load Demo Data'}
      </button>
    </div>
  );
};

export default DemoButton; 