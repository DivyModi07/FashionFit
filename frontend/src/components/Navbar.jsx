import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonClick = (action) => {
    console.log(`Button clicked: ${action}`);
  };

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Recommendation', href: '#recommendation' },
    { name: 'Trending', href: '#trending' },
    { name: 'Accessories', href: '#accessories' }
  ];

  return (
    <nav className={`fixed top-0 left-0 mb-4 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 backdrop-blur-md shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
                FashionAI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(item.name.toLowerCase())}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => handleButtonClick('wishlist')}
              className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                  {wishlistCount}
                </span>
              )}
              <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
            </button>

            {/* Cart */}
            <button 
              onClick={() => handleButtonClick('cart')}
              className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                  {cartCount}
                </span>
              )}
              <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
            </button>

            {/* Account */}
            <button 
              onClick={() => handleButtonClick('account')}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Menu Items */}
            <div className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleButtonClick(item.name.toLowerCase());
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left py-2 border-b border-gray-100 hover:border-purple-200"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                {/* Search */}
                <button 
                  onClick={() => {
                    handleButtonClick('search');
                    setIsMenuOpen(false);
                  }}
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
                >
                  <Search className="w-5 h-5" />
                  <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                </button>

                {/* Wishlist */}
                <button 
                  onClick={() => {
                    handleButtonClick('wishlist');
                    setIsMenuOpen(false);
                  }}
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                </button>

                {/* Cart */}
                <button 
                  onClick={() => {
                    handleButtonClick('cart');
                    setIsMenuOpen(false);
                  }}
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                </button>
              </div>

              {/* Account */}
              <button 
                onClick={() => {
                  handleButtonClick('account');
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;