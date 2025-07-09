// src/components/HomePage.jsx
import React from 'react';

const HomePage = () => {
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/auth'; // redirect to login
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to FashionFit</h1>
      <p className="mt-2 text-gray-600">You are logged in 🎉</p>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
};

export default HomePage;
