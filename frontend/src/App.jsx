import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Homepage from './pages/Homepage';
import ForgotPassword from './pages/ForgotPassword';
import ProductPage from './pages/ProductPage';
import ProductDetails from './pages/ProductDetails';

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '1rem',
            maxWidth: '90vw',
            margin: '0.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            background: '#22223b',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4ade80',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#4ade80',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/productdetails" element={<ProductDetails />} />
      </Routes>
    </>
  );
};

export default App;
