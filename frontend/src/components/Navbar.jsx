// import React, { useState, useEffect } from 'react';
// import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useCartWishlist } from '../context/CartWishlistContext';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { cartCount, wishlistCount } = useCartWishlist();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Updated menu items array
//   const menuItems = [
//     { name: 'Home', path: '/homepage' },
//     { name: 'Products', path: '/products' },
//     { name: 'Trending', path: '/trending-products' },
//     { name: 'Recently Viewed', path: '/recently-viewed' }
//   ];

//   const handleNav = (path) => {
//     navigate(path);
//   };

//   return (
//     <nav className={`fixed top-0 left-0 mb-4 right-0 z-50 transition-all duration-300 ${
//       isScrolled 
//         ? 'bg-white/95 backdrop-blur-md shadow-lg' 
//         : 'bg-white/80 backdrop-blur-md shadow-sm'
//     }`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center cursor-pointer" onClick={() => navigate('/homepage')}>
//             <div className="flex-shrink-0 flex items-center">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
//                 <span className="text-white font-bold text-lg">FF</span>
//               </div>
//               <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
//                 FashionFit
//               </span>
//             </div>
//           </div>

//           {/* Desktop Navigation Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {menuItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => handleNav(item.path)}
//                 className="text-gray-700 hover:text-purple-600 transition-colors font-medium relative group"
//               >
//                 {item.name}
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
//               </button>
//             ))}
//           </div>

//           {/* Desktop Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             <button 
//               onClick={() => navigate('/wishlist')}
//               className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
//             >
//               <Heart className="w-5 h-5" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
//                   {wishlistCount}
//                 </span>
//               )}
//               <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
//             </button>

//             <button 
//               onClick={() => navigate('/cart')}
//               className="p-2 text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 relative group"
//             >
//               <ShoppingCart className="w-5 h-5" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
//                   {cartCount}
//                 </span>
//               )}
//               <span className="absolute -inset-2 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
//             </button>

//             <button 
//               onClick={() => navigate('/login')}
//               className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
//             >
//               <User className="w-4 h-4" />
//               <span>Account</span>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button 
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-purple-600 transition-colors transform hover:scale-110 p-2"
//             >
//               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
//           <div className="px-4 py-6 space-y-6">
//             <div className="flex flex-col space-y-4">
//               {menuItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => {
//                     handleNav(item.path);
//                     setIsMenuOpen(false);
//                   }}
//                   className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-left py-2 border-b border-gray-100 hover:border-purple-200"
//                 >
//                   {item.name}
//                 </button>
//               ))}
//             </div>

//             {/* Mobile Actions */}
//             <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//               <div className="flex items-center space-x-6">
//                 <button 
//                   onClick={() => {
//                     navigate('/wishlist');
//                     setIsMenuOpen(false);
//                   }}
//                   className="p-2 text-gray-700 hover:text-purple-600 relative"
//                 >
//                   <Heart className="w-5 h-5" />
//                   {wishlistCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
//                       {wishlistCount}
//                     </span>
//                   )}
//                 </button>
//                 <button 
//                   onClick={() => {
//                     navigate('/cart');
//                     setIsMenuOpen(false);
//                   }}
//                   className="p-2 text-gray-700 hover:text-purple-600 relative"
//                 >
//                   <ShoppingCart className="w-5 h-5" />
//                   {cartCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
//                       {cartCount}
//                     </span>
//                   )}
//                 </button>
//               </div>
//               <button 
//                 onClick={() => {
//                   navigate('/login');
//                   setIsMenuOpen(false);
//                 }}
//                 className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium"
//               >
//                 <User className="w-4 h-4" />
//                 <span>Account</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useCartWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // --- NEW: State for user data and dropdown ---
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- NEW: Effect to fetch user data on load ---
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data, token might be expired.", error);
          // Optional: handle token refresh or logout here
        }
      }
    };
    fetchUserData();
  }, []);

  // --- NEW: Effect to handle clicks outside the dropdown to close it ---
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
  
  // --- NEW: Function to handle user sign-out ---
  const handleSignOut = () => {
    // Clear user state and tokens
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsDropdownOpen(false);
    
    // Navigate to login and reload for a clean state
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 left-0 mb-4 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 backdrop-blur-md shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button key={item.name} onClick={() => handleNav(item.path)} className="text-gray-700 hover:text-purple-600 font-medium relative group">
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate('/wishlist')} className="p-2 text-gray-700 hover:text-purple-600 relative group">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 ...">{wishlistCount}</span>}
            </button>
            <button onClick={() => navigate('/cart')} className="p-2 text-gray-700 hover:text-purple-600 relative group">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 ...">{cartCount}</span>}
            </button>

            {/* --- UPDATED: Conditional Account Button & Dropdown --- */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                // If user is logged in, show their name and dropdown
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span>{user.first_name || user.email}</span>
                </button>
              ) : (
                // If user is not logged in, show a simple Login button
                <button onClick={() => navigate('/login')} className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Dropdown Menu */}
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
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
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
            {/* ... other mobile actions ... */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;