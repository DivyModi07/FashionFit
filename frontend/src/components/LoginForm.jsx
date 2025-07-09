// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { login, signup } from '../api/auth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const res = await signup(username, password);
        alert("Signup success! Now login.");
        setIsSignup(false);
      } else {
        const res = await login(username, password);
        alert("Login success! Token stored.");
        console.log("Access token:", res.access);
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80 mx-auto mt-10">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        {isSignup ? "Sign Up" : "Login"}
      </button>
      <p className="text-sm cursor-pointer text-blue-600" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </p>
    </form>
  );
};

export default LoginForm;
