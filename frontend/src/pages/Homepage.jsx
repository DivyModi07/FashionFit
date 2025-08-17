import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Clock,
  ArrowRight,
  Grid,
  List
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Animation from '../components/Animation.jsx';
import { useNavigate } from 'react-router-dom';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import axios from 'axios';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);
  const navigate = useNavigate();

  const heroSlides = [
    {
      title: "Summer Collection 2025",
      subtitle: "Discover the hottest trends",
      description: "Embrace the season with our stunning new arrivals",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      gradient: "from-pink-500 to-orange-400"
    },
    {
      title: "Luxury Essentials",
      subtitle: "Timeless elegance redefined",
      description: "Premium quality meets contemporary style",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
      gradient: "from-purple-600 to-blue-500"
    },
    {
      title: "Street Style Revolution",
      subtitle: "Bold. Fresh. Authentic.",
      description: "Express yourself with urban fashion",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
      gradient: "from-green-500 to-teal-400"
    }
  ];

  // This data is static for now. A full implementation would use localStorage to track visited items.
  const recentlyViewed = [
    { id: 1, name: "Elegant Summer Dress", price: 89.99, originalPrice: 129.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.5 },
    { id: 2, name: "Casual Denim Jacket", price: 79.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.3 },
    { id: 3, name: "Stylish Sneakers", price: 129.99, originalPrice: 159.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.7 },
    { id: 4, name: "Designer Handbag", price: 199.99, originalPrice: 249.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.6 }
  ];

  useEffect(() => {
    setRecentlyViewedItems(getRecentlyViewed());
  }, []);

  const trendingItems = products.filter(p => p.discount > 0).slice(0, 4); 


  // Fetch all products to find trending (discounted) items
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/all/')
      .then(res => {
        const allProducts = res.data.map(p => ({
            id: p.id,
            name: p.short_description,
            price: p.final_price,
            originalPrice: p.initial_price,
            image: p.model_image || p.cutout_image,
            rating: 4.5, // Using dummy rating
            discount: p.is_on_sale ? parseInt(p.discount_label?.replace('% Off', '') || "0", 10) : 0,
        }));
        setProducts(allProducts);
      })
      .catch(err => console.error("Failed to fetch products", err));
  }, []);



  useEffect(() => {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
  
      return () => clearInterval(slideInterval);
    }, []);

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

  const handleButtonClick = (action, id = null) => {
    console.log(`Button clicked: ${action}`, id ? `ID: ${id}` : '');
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
        >
          <Heart 
            className={`w-4 h-4 ${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
  {Number(product.originalPrice) > Number(product.price) ? (
    <>
      {/* Discounted */}
      <span className="text-lg font-bold text-red-600">
        ${Number(product.price).toFixed(2)}
      </span>
      <span className="text-sm text-gray-500 line-through">
        ${Number(product.originalPrice).toFixed(2)}
      </span>
    </>
  ) : (
    /* Not discounted */
    <span className="text-lg font-bold text-gray-600">
      ${Number(product.price ?? product.originalPrice).toFixed(2)}
    </span>
  )}
</div>
          <button
            onClick={() => handleButtonClick('add-to-cart', product.id)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
      `}</style>
      <Animation />


      <section className="relative overflow-hidden py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[450px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-0">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient} opacity-80`}
              ></div>
              <img
                src={heroSlides[currentSlide].image || "/placeholder.svg"}
                alt="Fashion"
                className="w-full h-full object-cover transition-all duration-1000"
              />
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="flex-1 p-8 md:p-12 text-white flex justify-center">
                <div className="animate-fade-in">
                  <h1 className="text-3xl md:text-6xl font-bold mb-4">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-3xl mb-2 text-center">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <p className="text-sm md:text-base mb-6 opacity-90 text-center">
                    {heroSlides[currentSlide].description}
                  </p>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate('/products')}
                      className="px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg font-semibold">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <section className="py-16 bg-white" data-animate id="recently-viewed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between mb-12 transition-all duration-700 ${
            isVisible['recently-viewed'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <Clock className="w-8 h-8 inline mr-3 text-purple-600" />
                Recently Viewed
              </h2>
              <p className="text-xl text-gray-600">
                Pick up where you left off
              </p>
            </div>
            <button
              onClick={() => navigate('/recently-viewed')}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyViewedItems.slice(0, 4).map((product, index) => (
              <div 
                key={product.id}
                className={`transition-all duration-700`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16" data-animate id="trending">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between mb-12 transition-all duration-700 ${
            isVisible['trending'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <TrendingUp className="w-8 h-8 inline mr-3 text-purple-600" />
                Trending Now
              </h2>
              <p className="text-xl text-gray-600">
                What's hot in fashion right now
              </p>
            </div>
            <button
                onClick={() => navigate('/trending-products')}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {trendingItems.map((product, index) => (
              <div 
                key={product.id}
                className={`transition-all duration-700 ${
                  isVisible['trending'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
    <Footer />
    </>
  );
};

export default Homepage;