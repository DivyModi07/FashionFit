import axios from "axios";
import { loginUser } from "../api/auth"; 
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Facebook, Twitter, Instagram, ArrowRight, User, Sparkles } from "lucide-react"

const Login= () => {

    const navigate = useNavigate();
  

  const [isVisible, setIsVisible] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    setIsLoading(true);
    setErrors({});
    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
      alert("✅ Login successful!");
      // Navigate to dashboard
    } else {
      setErrors({ email: result.error, password: "" });
      alert("❌ " + result.error);
    }

    setIsLoading(false);
  }
};


  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    alert(`${provider} login clicked`)
  }

  const handleSignUp = () => {
    console.log("Navigate to sign up")
    alert("Navigate to sign up page")
  }

  // const handleForgotPassword = () => {
  //   console.log("Forgot password clicked")
  //   alert("Forgot password functionality")
  // }

  const handleGuestLogin = () => {
    console.log("Continue as guest")
    alert("Continue as guest")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Floating particles animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-slide-in-top {
          animation: slideInFromTop 0.6s ease-out;
        }
        
        .animate-slide-in-bottom {
          animation: slideInFromBottom 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 animate-slide-in-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
                FashionAI
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Don't have an account?</span>
              <button
                onClick={() => navigate('/signup')}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      {/* <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 animate-slide-in-top">
        <div className="flex items-center justify-center">
          <Sparkles className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Welcome Back to Fashion Revolution</span>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header Section */}
          <div className="text-center" data-animate id="header">
            <div
              className={`transition-all duration-700 ${
                isVisible["header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
              <p className="text-lg text-gray-600">
                Sign in to continue your{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                  AI-powered
                </span>{" "}
                fashion journey
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="mt-8" data-animate id="login-form">
            <div
              className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-700 ${
                isVisible["login-form"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Remember me</label>
                  </div> */}
                  <button
                    type="button"
                    onClick={() => navigate('/forgotpassword')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                {/* Guest Login */}
                {/* <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full border-2 border-purple-500 text-purple-600 py-3 px-4 rounded-xl font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Continue as Guest
                </button> */}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Facebook")}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Twitter")}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Instagram")}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Features */}
          {/* <div className="text-center" data-animate id="features">
            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible["features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-slow">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">AI Recommendations</h3>
                  <p className="text-xs text-gray-600 mt-1">Personalized style suggestions</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
                  <div
                    className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-slow"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Virtual Try-On</h3>
                  <p className="text-xs text-gray-600 mt-1">See before you buy</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
                  <div
                    className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-slow"
                    style={{ animationDelay: "1s" }}
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Smart Shopping</h3>
                  <p className="text-xs text-gray-600 mt-1">Intelligent fashion discovery</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Login


// import React, { useState } from "react";
// import axios from "axios";

// const Login = () => {
//   const [email, setemail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage("Logging in...");

//     try {
//       const response = await axios.post("http://localhost:8000/api/token/", {
//       email,
//       password,
//     });


//       const { access, refresh } = response.data;

//       // Store tokens in localStorage
//       localStorage.setItem("access", access);
//       localStorage.setItem("refresh", refresh);

//       // Set token as default header
//       axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

//       setMessage("✅ Login successful!");
//     } catch (error) {
//   console.error("Axios error object:", error);

//   if (error.response) {
//     console.log("Response error:", error.response.data);
//     setMessage("❌ " + JSON.stringify(error.response.data));
//   } else if (error.request) {
//     console.log("No response received:", error.request);
//     setMessage("❌ No response from server. Possible CORS or network error.");
//   } else {
//     console.log("Error message:", error.message);
//     setMessage("❌ Error: " + error.message);
//   }
// }

//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-700">email</label>
//             <input
//               type="text"
//               value={email}
//               onChange={(e) => setemail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-center text-red-600 mt-4">{message}</p>
//       </div>
//     </div>
//   );
// };

// export default Login;
