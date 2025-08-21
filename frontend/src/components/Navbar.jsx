// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';
import axiosInstance from '../api/axios'; // 👈 1. Import your custom axiosInstance
import { logoutUser } from '../api/auth'; // 👈 2. Import the logout utility

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useCartWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // 👈 3. Use axiosInstance to automatically handle token refresh.
          // The Authorization header is now added automatically by the interceptor.
          const response = await axiosInstance.get('/users/profile/');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data. Session may be expired.", error);
          // 👈 4. If fetching fails even after a refresh attempt, log the user out.
          logoutUser();
          setUser(null); // Ensure user state is cleared
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const menuItems = [
    { name: 'Home', path: '/homepage' },
    { name: 'Products', path: '/products' },
    { name: 'Trending', path: '/trending-products' },
    { name: 'Recently Viewed', path: '/recently-viewed' }
  ];

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  const handleSignOut = () => {
    logoutUser(); // Use the utility to clear tokens
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
    window.location.reload(); // Reload to ensure a clean state
  };

  return (
    <nav className={`fixed top-0 left-0 mb-4 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 backdrop-blur-md shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/homepage')}>
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform hover:scale-110">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
                FashionFit
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button key={item.name} onClick={() => handleNav(item.path)} className="text-gray-700 hover:text-purple-600 font-medium relative group">
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate('/wishlist')} className="p-2 text-gray-700 hover:text-purple-600 relative group">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{wishlistCount}</span>}
            </button>
            <button onClick={() => navigate('/cart')} className="p-2 text-gray-700 hover:text-purple-600 relative group">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{cartCount}</span>}
            </button>

            <div className="relative" ref={dropdownRef}>
              {user ? (
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span>{user.first_name || user.email}</span>
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 animate-fade-in-up">
                  <button onClick={() => { navigate('/account-settings'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </button>
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
          <div className="px-4 py-6 space-y-6">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button key={item.name} onClick={() => handleNav(item.path)} className="text-gray-700 text-left py-2 border-b">
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;