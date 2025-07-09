import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Camera,
  Shirt
} from 'lucide-react';

const S3 = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    newsletter: false,
    terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (step === 2) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Please select your gender';
    }
    
    if (step === 3) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    console.log(currentStep)
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep+1);
      console.log(currentStep)
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNextStep()
    if (validateStep(3)) {
      console.log('Form submitted:', formData);
      // Here you would typically send data to your backend
      alert('Account created successfully!');
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signing up with ${provider}`);
    // Implement social signup logic
  };

  const stepTitles = [
    'Personal Information',
    'Account Security',
    'Address & Preferences'
  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
      `}</style>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FashionAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Already have an account?</span>
              <button 
                onClick={() => console.log('Navigate to login')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Fashion Revolution
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> AI-Powered </span>
              Fashion Account
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of fashion enthusiasts discovering their perfect style with our AI recommendations
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                    index + 1 <= currentStep 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1 < currentStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
                  </div>
                  <div className="ml-4 hidden md:block">
                    <div className={`text-sm font-medium ${
                      index + 1 <= currentStep ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      Step {index + 1}
                    </div>
                    <div className={`text-xs ${
                      index + 1 <= currentStep ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {title}
                    </div>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`hidden md:block w-24 h-0.5 mx-6 ${
                      index + 1 < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
              <form  className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-gray-600 mt-2">Tell us about yourself</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                              errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                            }`}
                            placeholder="Enter your first name"
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                              errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                            }`}
                            placeholder="Enter your last name"
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Enter your email address"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Enter your phone number"
                        />
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Social Signup Options */}
                    <div className="mt-8">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => handleSocialSignup('facebook')}
                          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSocialSignup('twitter')}
                          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-blue-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSocialSignup('instagram')}
                          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Instagram className="w-5 h-5 text-pink-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Account Security */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Account Security</h2>
                      <p className="text-gray-600 mt-2">Secure your account with a strong password</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.password ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Create a strong password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth *
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                              errors.dateOfBirth ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                            }`}
                          />
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.gender ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Address & Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Address & Preferences</h2>
                      <p className="text-gray-600 mt-2">Complete your profile setup</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.address ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Enter your street address"
                        />
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.city ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Enter your city"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.state ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Enter your state"
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                          placeholder="Enter your ZIP code"
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.country ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                          }`}
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                        </select>
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="newsletter"
                          id="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                          Subscribe to our newsletter for style tips and exclusive offers
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          name="terms"
                          id="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={() => console.log('Show terms')}
                            className="text-purple-600 hover:text-purple-700 underline"
                          >
                            Terms of Service
                          </button>
                          {' '}and{' '}
                          <button
                            type="button"
                            onClick={() => console.log('Show privacy policy')}
                            className="text-purple-600 hover:text-purple-700 underline"
                          >
                            Privacy Policy
                          </button>
                        </label>
                      </div>
                      {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      Next Step <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      Create Account <Sparkles className="w-5 h-5 ml-2" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default S3;