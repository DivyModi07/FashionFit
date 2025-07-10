import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Heart,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleButtonClick = (action) => {
    console.log(`Button clicked: ${action}`);
  };

  const handleNewsletterSubmit = () => {
    if (email.trim()) {
      console.log('Newsletter signup:', email);
      setEmail('');
      // Add success message or API call here
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const aboutUsLinks = [
    { name: 'Our Story', action: 'our-story' },
    { name: 'Mission & Values', action: 'mission' },
    { name: 'Careers', action: 'careers' },
    { name: 'Press & Media', action: 'press' },
    { name: 'Sustainability', action: 'sustainability' }
  ];

  const helpLinks = [
    { name: 'Contact Us', action: 'contact' },
    { name: 'Help Center', action: 'help-center' },
    { name: 'Size Guide', action: 'size-guide' },
    { name: 'Shipping Info', action: 'shipping' },
    { name: 'Returns & Exchanges', action: 'returns' },
    { name: 'Track Your Order', action: 'track-order' }
  ];

  const categoryLinks = [
    { name: 'Men\'s Fashion', action: 'men' },
    { name: 'Women\'s Fashion', action: 'women' },
    { name: 'Kids Collection', action: 'kids' },
    { name: 'Accessories', action: 'accessories' },
    { name: 'New Arrivals', action: 'new-arrivals' },
    { name: 'Sale Items', action: 'sale' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, action: 'facebook', color: 'hover:text-blue-500' },
    { name: 'Twitter', icon: Twitter, action: 'twitter', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, action: 'instagram', color: 'hover:text-pink-500' },
    { name: 'YouTube', icon: Youtube, action: 'youtube', color: 'hover:text-red-500' }
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white py-10 animate-slide-in-bottom">
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
  );
};

export default Footer;