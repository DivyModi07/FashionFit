// src/api/auth.js
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/token/`, {
      email,
      password,
    });

    const { access, refresh } = response.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return { success: true, access, refresh };
  } catch (error) {
    const detail = error.response?.data?.detail || "Login failed";
    return { success: false, error: detail };
  }
};

// ✅ Logout function
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete axios.defaults.headers.common["Authorization"];
};

// ✅ Refresh token function
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return { success: false, error: "No refresh token" };

  try {
    const response = await axios.post(`${API_BASE}/token/refresh/`, {
      refresh,
    });

    const { access } = response.data;

    localStorage.setItem("accessToken", access);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return { success: true, access };
  } catch (error) {
    return { success: false, error: "Session expired. Please log in again." };
  }
};

// ✅ Send OTP to email (used in ForgotPassword.jsx)
export const sendOtpToEmail = async (email) => {
  try {
    const res = await axios.post(
      `${API_BASE}/send-otp/`,
      { email },
      { withCredentials: true }  // ✅ include cookies for session!
    );

    return { success: true, message: res.data.message };
  } catch (err) {
    const errorMessage = err.response?.data?.error ||err.message ||"Failed to send OTP";
    return { success: false, error: errorMessage };
  }
};



export const verifyOtp = async (email, otp) => {
  const res = await fetch('http://localhost:8000/api/verify-otp/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ✅ Session cookie will be reused
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Server error");
  }

  return await res.json();
};

export const resetPassword = async (email, newPassword) => {
  try {
    const res = await fetch("http://localhost:8000/api/reset-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, new_password: newPassword }),
    });

    const text = await res.text();
    console.log("Response Text:", text); // ✅ Debug: see raw response
    const data = JSON.parse(text);       // manually parse
    return data;
  } catch (err) {
    return { error: err.message };
  }
};