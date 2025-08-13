import { useNavigate } from 'react-router-dom';
import { sendOtpToEmail, verifyOtp, resetPassword } from '../api/auth';
import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, CheckCircle, RotateCcw, Clock } from "lucide-react"
import Animation from '../components/Animation';
import toast from 'react-hot-toast';

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1)
  const [isVisible, setIsVisible] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

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

  // Countdown timer for resend code
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const steps = [
    {
      step: 1,
      title: "Enter Email",
      subtitle: "We'll send you a reset link",
      icon: <Mail className="w-8 h-8 text-white" />,
    },
    {
      step: 2,
      title: "Verify Code",
      subtitle: "Enter the code we sent you",
      icon: <Shield className="w-8 h-8 text-white" />,
    },
    {
      step: 3,
      title: "New Password",
      subtitle: "Create your new password",
      icon: <Lock className="w-8 h-8 text-white" />,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    if (step === 2) {
      if (!formData.verificationCode.trim()) {
        newErrors.verificationCode = "Verification code is required"
      } else if (formData.verificationCode.length !== 6) {
        newErrors.verificationCode = "Verification code must be 6 digits"
      }
    }

    if (step === 3) {
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required"
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = async () => {
    if (validateStep(currentStep)) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(async () => {
        setIsLoading(false)

        if (currentStep === 1) {
          // Basic email format check before sending OTP
          if (!formData.email || !formData.email.includes("@")) {
            setErrors((prev) => ({
              ...prev,
              email: "Please enter a valid email address",
            }));
            return;
          }

          // Call the function to send OTP and handle result
          const res = await sendOtpToEmail(formData.email);
          if (res.success) {
            toast.success("Verification code sent to your "+ formData.email);
            setCurrentStep(2);
          } else {
            setErrors((prev) => ({
              ...prev,
              email: res.error || "Failed to send verification code"
            }));
            toast.error(res.error || "Failed to send verification code");
          }

        } else if (currentStep === 2) {
            try {
              const res = await verifyOtp(formData.email, formData.verificationCode);
              console.log("verifyOtp response:", res);  // ✅ this is fine

              if (res.message) {
                toast.success("Code verified successfully!");
                setCurrentStep(3);
              } else {
                toast.error(res.error || "Invalid code");
                setErrors((prev) => ({
                  ...prev,
                  verificationCode: res.error || "Invalid code"
                }));
              }
            } catch (err) {
  console.error("verifyOtp failed:", err);
  toast.error("Something went wrong: " + err.message);
}
          }
      else if (currentStep === 3) {
          const res = await resetPassword(formData.email, formData.newPassword);

          if (res.message) {
            setCurrentStep(4); // success
            toast.success("Password reset successful!");
            navigate('/login');
          } else {
            toast.error(res.error || "Password reset failed");
          }
        }
      }, 2000)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleResendCode = async () => {
  if (countdown === 0) {
    setIsLoading(true)
    try {
      const res = await sendOtpToEmail(formData.email);  // ✅ actually send OTP
      setIsLoading(false)
      setCountdown(60)

      if (res.success) {
        toast.success("Verification code resent to " + formData.email)
      } else {
        toast.error("Failed to resend code: " + res.error)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error("Something went wrong: " + error.message)
    }
  }
}




  const handleBackToLogin = () => {
    console.log("Navigate back to login")
    toast("Navigate back to login page")
  }

  const handleContactSupport = () => {
    console.log("Contact support")
    toast("Contact support functionality")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 overflow-hidden">
      <Animation count={25} />

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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
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
              <span className="text-gray-600">Remember your password?</span>
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Security Banner */}
      {/* <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 animate-slide-in-top">
        <div className="flex items-center justify-center">
          <Shield className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Secure Password Recovery</span>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Progress Steps */}
          {currentStep < 4 && (
            <div className="flex justify-center mb-8" data-animate id="steps">
              <div
                className={`flex items-center space-x-4 transition-all duration-700 ${
                  isVisible["steps"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {steps.map((step, index) => (
                  <div key={step.step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                        currentStep >= step.step
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-110"
                          : "bg-gray-300"
                      }`}
                    >
                      {step.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                          currentStep > step.step ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center" data-animate id="header">
            <div
              className={`transition-all duration-700 ${
                isVisible["header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {currentStep < 4 ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                    {steps[currentStep - 1]?.icon}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{steps[currentStep - 1]?.title}</h1>
                  <p className="text-lg text-gray-600">{steps[currentStep - 1]?.subtitle}</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Password Reset!</h1>
                  <p className="text-lg text-gray-600">Your password has been successfully updated</p>
                </>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="mt-8" data-animate id="form-content">
            <div
              className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-700 ${
                isVisible["form-content"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {/* Step 1: Enter Email */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in-up">
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

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                        <p className="text-sm text-blue-600 mt-1">
                          We'll send a 6-digit verification code to your email address. This code will expire in 10
                          minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Verify Code */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="text-center mb-6">
                    <p className="text-gray-600">
                      We sent a verification code to{" "}
                      <span className="font-semibold text-purple-600">{formData.email}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-center text-lg font-mono ${
                          errors.verificationCode ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.verificationCode && <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <button
                      onClick={handleResendCode}
                      disabled={countdown > 0 || isLoading}
                      className={`text-sm font-medium transition-colors ${
                        countdown > 0 || isLoading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-purple-600 hover:text-purple-700"
                      }`}
                    >
                      {countdown > 0 ? (
                        <span className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Resend in {countdown}s
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Resend Code
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: New Password */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                          errors.newPassword ? "border-red-500" : "border-gray-300"
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
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Password Requirements</h3>
                        <ul className="text-sm text-green-600 mt-1 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Include at least one number</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center space-y-6 animate-fade-in-up">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce-slow" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Password Successfully Reset!</h3>
                    <p className="text-green-600">
                      Your password has been updated. You can now sign in with your new password.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    Back to Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className={`px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentStep === 1 ? "ml-auto" : ""
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <>
                        {currentStep === 1 && "Send Code"}
                        {currentStep === 2 && "Verify Code"}
                        {currentStep === 3 && "Reset Password"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center mt-8" data-animate id="help">
            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible["help"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <button
                onClick={handleContactSupport}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
