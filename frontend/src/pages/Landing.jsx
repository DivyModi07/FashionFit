import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, User, Camera, Sparkles, Shirt, Shuffle, TrendingUp, MessageCircle, Ruler, Star, ChevronRight, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Animation from '../components/Animation';


const Landing = () => {

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotating testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI Style Recommender",
      description: "Get personalized fashion suggestions based on your style preferences and shopping history.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Virtual Try-On",
      description: "See how clothes look on you before buying with our advanced AR virtual try-on technology.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <Ruler className="w-8 h-8" />,
      title: "Smart Size Guide",
      description: "Never worry about sizing again with our AI-powered size recommendation system.",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: <Shuffle className="w-8 h-8" />,
      title: "Mix & Match Generator",
      description: "Create perfect outfit combinations with our intelligent styling algorithm.",
      color: "from-blue-500 to-purple-500"
    }
  ];

  const products = [
    {
      id: 1,
      name: "Designer Jacket",
      price: "$299",
      image: "/api/placeholder/300/300",
      category: "Outerwear",
      rating: 4.8
    },
    {
      id: 2,
      name: "Casual Shirt",
      price: "$89",
      image: "/api/placeholder/300/300",
      category: "Tops",
      rating: 4.6
    },
    {
      id: 3,
      name: "Premium Jeans",
      price: "$159",
      image: "/api/placeholder/300/300",
      category: "Bottoms",
      rating: 4.9
    },
    {
      id: 4,
      name: "Summer Dress",
      price: "$199",
      image: "/api/placeholder/300/300",
      category: "Dresses",
      rating: 4.7
    },
    {
      id: 5,
      name: "Sneakers",
      price: "$129",
      image: "/api/placeholder/300/300",
      category: "Footwear",
      rating: 4.5
    },
    {
      id: 6,
      name: "Handbag",
      price: "$249",
      image: "/api/placeholder/300/300",
      category: "Accessories",
      rating: 4.8
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Sign Up",
      description: "Create your account and join our fashion community"
    },
    {
      step: "02",
      title: "Style Quiz",
      description: "Answer a few questions about your style preferences"
    },
    {
      step: "03",
      title: "Get Outfits",
      description: "Receive personalized outfit recommendations"
    },
    {
      step: "04",
      title: "Try & Shop",
      description: "Virtual try-on and purchase your perfect items"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      avatar: "/api/placeholder/60/60",
      quote: "FashionAI completely transformed my shopping experience. The AI recommendations are spot-on!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Style Blogger",
      avatar: "/api/placeholder/60/60",
      quote: "The virtual try-on feature saved me so much time. I can now shop confidently online.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Working Professional",
      avatar: "/api/placeholder/60/60",
      quote: "Love the mix & match generator! It helps me create professional outfits effortlessly.",
      rating: 5
    }
  ];

  const handleNavClick = (section) => {
    console.log(`Navigating to ${section}`);
  };

  const handleButtonClick = (action) => {
    console.log(`Button clicked: ${action}`);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, transform: 'translateY(30px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' }
  };

  const fadeInLeft = {
    initial: { opacity: 0, transform: 'translateX(-30px)' },
    animate: { opacity: 1, transform: 'translateX(0px)' }
  };

  const fadeInRight = {
    initial: { opacity: 0, transform: 'translateX(30px)' },
    animate: { opacity: 1, transform: 'translateX(0px)' }
  };

  const scaleIn = {
    initial: { opacity: 0, transform: 'scale(0.8)' },
    animate: { opacity: 1, transform: 'scale(1)' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Floating particles animation */}
      <Animation count={25} />

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
          from { transform: translateY(100%); opacity: 0; }
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
        
        .animate-slide-in-left {
          animation: slideInFromLeft 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInFromRight 0.6s ease-out;
        }
        
        .animate-slide-in-top {
          animation: slideInFromTop 0.6s ease-out;
        }
        
        .animate-slide-in-bottom {
          animation: slideInFromBottom 0.6s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 animate-slide-in-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
                  FashionAI
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <button 
                onClick={() => document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Home
              </button> */}
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Reviews
              </button>
              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Contact
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Login
              </button>
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4 px-4">
              <button 
                onClick={() => {
                  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => {
                  document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left"
              >
                Reviews
              </button>
              <button 
                onClick={() => {
                  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-16 lg:mb-0 animate-slide-in-left">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-6 animate-bounce-slow">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Recommended
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                Fashion Discovery
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Experience the future of fashion with our AI-driven recommendations, virtual try-on, and smart styling suggestions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-slow"
                >
                  Explore Now
                </button>
                <button 
                  onClick={() => handleButtonClick('try-virtual-fit')}
                  className="border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Try Virtual Fit
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-8">
                {[
                  { value: "50K+", label: "Happy Customers", color: "text-purple-600" },
                  { value: "10K+", label: "Fashion Items", color: "text-pink-600" },
                  { value: "95%", label: "AI Accuracy", color: "text-orange-600" }
                ].map((stat, index) => (
                  <div key={index} className="text-center" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className={`text-2xl font-bold ${stat.color} animate-pulse-slow`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-full h-80 rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="relative"> 
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl transform rotate-6 opacity-20 animate-pulse-slow">
                      </div> 
                      <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-300 hover:shadow-3xl"> 
                        <img 
                          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                          alt="Fashion model wearing trendy outfit" 
                          className="w-full h-96 object-cover rounded-2xl hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce-slow"> 
                          AI Recommended 
                        </div> 
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="features-header">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Features
              </span>
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-200 ${
              isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Discover fashion like never before with our cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group"
                data-animate
                id={`feature-${index}`}
              >
                <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <button 
                    onClick={() => handleButtonClick(`try-${feature.title.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="text-purple-600 hover:text-purple-700 font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Try Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="how-it-works-header">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              isVisible['how-it-works-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              How It Works
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-200 ${
              isVisible['how-it-works-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Get started with FashionAI in four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="text-center"
                data-animate
                id={`step-${index}`}
              >
                <div className={`transition-all duration-1000 ${
                  isVisible[`step-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.3}s` }}>
                  <div className="relative mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-1200 hover:rotate-12">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200 transform translate-x-8 animate-pulse-slow"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="testimonials-header">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              What Our Customers Say
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-200 ${
              isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Join thousands who have transformed their fashion experience
            </p>
          </div>
          
          {/* Carousel Container */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg mx-auto max-w-2xl">
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-6 h-6 text-yellow-400 fill-current" 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-6 italic text-lg text-center">"{testimonial.quote}"</p>
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-4 text-center">
                          <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                          <p className="text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            {/* Previous/Next Buttons */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 transform rotate-180" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-slow">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="ml-2 text-xl font-bold">FashionAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered fashion discovery platform that helps you find your perfect style.
              </p>
              <div className="flex space-x-4">
                <button onClick={() => handleButtonClick('facebook')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 hover:rotate-12">
                  <Facebook className="w-6 h-6" />
                </button>
                <button onClick={() => handleButtonClick('twitter')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 hover:rotate-12">
                  <Twitter className="w-6 h-6" />
                </button>
                <button onClick={() => handleButtonClick('instagram')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 hover:rotate-12">
                  <Instagram className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><button onClick={() => handleButtonClick('our-story')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Our Story</button></li>
                <li><button onClick={() => handleButtonClick('careers')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Careers</button></li>
                <li><button onClick={() => handleButtonClick('press')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Press</button></li>
                <li><button onClick={() => handleButtonClick('blog')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Blog</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><button onClick={() => handleButtonClick('help-center')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Help Center</button></li>
                <li><button onClick={() => handleButtonClick('size-guide')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Size Guide</button></li>
                <li><button onClick={() => handleButtonClick('returns')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Returns</button></li>
                <li><button onClick={() => handleButtonClick('shipping')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Shipping Info</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400 hover:text-white transition-colors transform hover:translate-x-2 duration-300">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>hello@fashionai.com</span>
                </div>
                <div className="flex items-center text-gray-400 hover:text-white transition-colors transform hover:translate-x-2 duration-300">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-400 hover:text-white transition-colors transform hover:translate-x-2 duration-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 FashionAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => handleButtonClick('privacy')} className="text-gray-400 hover:text-white text-sm transition-colors transform hover:scale-105 duration-300">
                Privacy Policy
              </button>
              <button onClick={() => handleButtonClick('terms')} className="text-gray-400 hover:text-white text-sm transition-colors transform hover:scale-105 duration-300">
                Terms of Service
              </button>
              <button onClick={() => handleButtonClick('cookies')} className="text-gray-400 hover:text-white text-sm transition-colors transform hover:scale-105 duration-300">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;