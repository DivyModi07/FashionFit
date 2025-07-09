import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Homepage from './pages/Homepage';
import ForgotPassword from './pages/ForgotPassword';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
