// import React, { useState } from 'react';
// import { 
//   Facebook, 
//   Twitter, 
//   Instagram, 
//   Youtube, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Send,
//   Heart,
//   ArrowUp
// } from 'lucide-react';

// const Footer = () => {
//   const [email, setEmail] = useState('');
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   const handleButtonClick = (action) => {
//     console.log(`Button clicked: ${action}`);
//   };

//   const handleNewsletterSubmit = () => {
//     if (email.trim()) {
//       console.log('Newsletter signup:', email);
//       setEmail('');
//       // Add success message or API call here
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   const aboutUsLinks = [
//     { name: 'Our Story', action: 'our-story' },
//     { name: 'Mission & Values', action: 'mission' },
//     { name: 'Careers', action: 'careers' },
//     { name: 'Press & Media', action: 'press' },
//     { name: 'Sustainability', action: 'sustainability' }
//   ];

//   const helpLinks = [
//     { name: 'Contact Us', action: 'contact' },
//     { name: 'Help Center', action: 'help-center' },
//     { name: 'Size Guide', action: 'size-guide' },
//     { name: 'Shipping Info', action: 'shipping' },
//     { name: 'Returns & Exchanges', action: 'returns' },
//     { name: 'Track Your Order', action: 'track-order' }
//   ];

//   const categoryLinks = [
//     { name: 'Men\'s Fashion', action: 'men' },
//     { name: 'Women\'s Fashion', action: 'women' },
//     { name: 'Kids Collection', action: 'kids' },
//     { name: 'Accessories', action: 'accessories' },
//     { name: 'New Arrivals', action: 'new-arrivals' },
//     { name: 'Sale Items', action: 'sale' }
//   ];

//   const socialLinks = [
//     { name: 'Facebook', icon: Facebook, action: 'facebook', color: 'hover:text-blue-500' },
//     { name: 'Twitter', icon: Twitter, action: 'twitter', color: 'hover:text-blue-400' },
//     { name: 'Instagram', icon: Instagram, action: 'instagram', color: 'hover:text-pink-500' },
//     { name: 'YouTube', icon: Youtube, action: 'youtube', color: 'hover:text-red-500' }
//   ];

//   return (
//     <footer id="contact" className="bg-gray-900 text-white py-10 animate-slide-in-bottom">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                 <div>
//                   <div className="flex items-center mb-4">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-slow">
//                       <span className="text-white font-bold text-lg">F</span>
//                     </div>
//                     <span className="ml-2 text-xl font-bold">FashionFit</span>
//                   </div>
//                   <p className="text-gray-400 mb-4">
//                     AI-powered fashion discovery platform that helps you find your perfect style.
//                   </p>
//                   <div className="flex space-x-4">
//                     <button onClick={() => handleButtonClick('facebook')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 hover:rotate-12">
//                       <Facebook className="w-6 h-6" />
//                     </button>
//                     <button onClick={() => handleButtonClick('twitter')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 hover:rotate-12">
//                       <Twitter className="w-6 h-6" />
//                     </button>
//                     <button onClick={() => handleButtonClick('instagram')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 hover:rotate-12">
//                       <Instagram className="w-6 h-6" />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">About</h3>
//                   <ul className="space-y-2">
//                     <li><button onClick={() => handleButtonClick('our-story')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Our Story</button></li>
//                     <li><button onClick={() => handleButtonClick('careers')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Careers</button></li>
//                     <li><button onClick={() => handleButtonClick('press')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Press</button></li>
//                     <li><button onClick={() => handleButtonClick('blog')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Blog</button></li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Support</h3>
//                   <ul className="space-y-2">
//                     <li><button onClick={() => handleButtonClick('help-center')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Help Center</button></li>
//                     <li><button onClick={() => handleButtonClick('size-guide')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Size Guide</button></li>
//                     <li><button onClick={() => handleButtonClick('returns')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Returns</button></li>
//                     <li><button onClick={() => handleButtonClick('shipping')} className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Shipping Info</button></li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Contact</h3>
//                   <div className="space-y-2">
//                     <div className="flex items-center text-gray-400 hover:text-white transition-colors transform hover:translate-x-2 duration-300">
//                       <Mail className="w-4 h-4 mr-2" />
//                       <span>hello@fashiofit.com</span>
//                     </div>
//                     <div className="flex items-center text-gray-400 hover:text-white transition-colors transform hover:translate-x-2 duration-300">
//                       <Phone className="w-4 h-4 mr-2" />
//                       <span>+91 9999999999</span>
//                     </div>
//                     <div className="flex items-center text-gray-400 hover:text-white transition-colors transform hover:translate-x-2 duration-300">
//                       <MapPin className="w-4 h-4 mr-2" />
//                       <span>Mumbai, Maharashtra</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//                 <p className="text-gray-400 text-sm">
//                   © 2025 FashionFit. All rights reserved.
//                 </p>
//                 <div className="flex space-x-6 mt-4 md:mt-0">
//                   <button onClick={() => handleButtonClick('privacy')} className="text-gray-400 hover:text-white text-sm transition-colors transform hover:scale-105 duration-300">
//                     Privacy Policy
//                   </button>
//                   <button onClick={() => handleButtonClick('terms')} className="text-gray-400 hover:text-white text-sm transition-colors transform hover:scale-105 duration-300">
//                     Terms of Service
//                   </button>
//                   <button onClick={() => handleButtonClick('cookies')} className="text-gray-400 hover:text-white text-sm transition-colors transform hover:scale-105 duration-300">
//                     Cookie Policy
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </footer>
//   );
// };

// export default Footer;





import React from 'react';
import { Mail, Phone, MapPin,  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Send,
  Heart,
  ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand and About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              FashionFit
            </h2>
            <p className="text-gray-400">
              Discover your style with our AI-curated fashion collection. Quality and trends delivered to your doorstep.
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

          {/* Column 2: Recent Pages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wider uppercase text-gray-300">Pages</h3>
            <ul className="space-y-2">
              <li><Link to="/trending-products" className="text-gray-400 hover:text-white transition-colors duration-300">Trending</Link></li>
              <li><Link to="/recently-viewed" className="text-gray-400 hover:text-white transition-colors duration-300">Recently Viewed</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-300">All Products</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wider uppercase text-gray-300">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Fashion Avenue,Ahemdabad,Gujarat, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <a href="" className="text-gray-400 hover:text-white transition-colors duration-300">+91 12345 67890</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <a href="" className="text-gray-400 hover:text-white transition-colors duration-300">fashionfit@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FashionFit. All Rights Reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-300">Privacy Policy</Link>
            <Link to="" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-300">Terms of Service</Link>
            <Link to="" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;