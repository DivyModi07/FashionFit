import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Homepage from './pages/Homepage';
import ForgotPassword from './pages/ForgotPassword';
import ProductPage from './pages/ProductPage';
import ProductDetails from './pages/ProductDetails';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/productpage" element={<ProductPage />} />
      <Route path="/productdetails" element={<ProductDetails />} />
    </Routes>
  );
};

export default App;
