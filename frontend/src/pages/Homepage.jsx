import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  TrendingUp, 
  Sparkles, 
  Tag, 
  Clock,
  ArrowRight,
  Filter,
  Grid,
  List
} from 'lucide-react';
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Animation from './components/Animation.jsx'

const Homepage = () => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

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

  // Sample data
  const offers = [
    {
      id: 1,
      title: "Summer Collection Sale",
      subtitle: "Up to 70% Off",
      description: "Discover amazing deals on summer essentials",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-purple-500 to-pink-500",
      buttonText: "Shop Now"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh & Trending",
      description: "Latest fashion trends just arrived",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-blue-500 to-purple-500",
      buttonText: "Explore"
    },
    {
      id: 3,
      title: "AI Styling Service",
      subtitle: "Personalized for You",
      description: "Get AI-powered outfit recommendations",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-orange-500 to-red-500",
      buttonText: "Try Now"
    }
  ];

  const categories = [
    { id: 1, name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", count: "250+ items" },
    { id: 2, name: "Tops", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", count: "180+ items" },
    { id: 3, name: "Bottoms", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", count: "120+ items" },
    { id: 4, name: "Shoes", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", count: "90+ items" },
    { id: 5, name: "Accessories", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", count: "150+ items" },
    { id: 6, name: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", count: "80+ items" }
  ];

  const recentlyViewed = [
    { id: 1, name: "Elegant Summer Dress", price: 89.99, originalPrice: 129.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.5 },
    { id: 2, name: "Casual Denim Jacket", price: 79.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.3 },
    { id: 3, name: "Stylish Sneakers", price: 129.99, originalPrice: 159.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.7 },
    { id: 4, name: "Designer Handbag", price: 199.99, originalPrice: 249.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.6 }
  ];

  const trendingProducts = [
    { id: 1, name: "Bohemian Maxi Dress", price: 119.99, originalPrice: 159.99, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.8, discount: 25 },
    { id: 2, name: "Vintage Leather Jacket", price: 149.99, originalPrice: 199.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.6, discount: 25 },
    { id: 3, name: "Athletic Wear Set", price: 89.99, originalPrice: 119.99, image: "https://images.unsplash.com/photo-1506629905607-15d82e04080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.7, discount: 25 },
    { id: 4, name: "Designer Sunglasses", price: 79.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.4, discount: 20 },
    { id: 5, name: "Formal Blazer", price: 159.99, originalPrice: 199.99, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.5, discount: 20 },
    { id: 6, name: "Casual Sneakers", price: 99.99, originalPrice: 129.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.8, discount: 23 }
  ];

  const aiRecommendations = [
    { id: 1, name: "Perfect Match Dress", price: 139.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.9, matchScore: 98 },
    { id: 2, name: "Style Companion Top", price: 69.99, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.7, matchScore: 95 },
    { id: 3, name: "AI Curated Pants", price: 89.99, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.8, matchScore: 92 },
    { id: 4, name: "Smart Choice Shoes", price: 119.99, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.6, matchScore: 90 }
  ];

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

  const ProductCard = ({ product, showAIScore = false }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
        {showAIScore && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Sparkles className="w-4 h-4 mr-1" />
            {product.matchScore}%
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
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
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
        
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }
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
                  <h1 className="text-3xl md:text-6xl font-bold mb-4 animate-slide-up">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-3xl mb-2 animate-slide-up animation-delay-200 text-center">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <p className="text-sm md:text-base mb-6 opacity-90 animate-slide-up animation-delay-400 text-center">
                    {heroSlides[currentSlide].description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 animate-slide-up animation-delay-600 flex justify-center">
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg font-semibold">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-6 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 font-semibold">
                      Explore Collection
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

      {/* Top Categories Section */}
      <section className="py-16" data-animate id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 ${
            isVisible['categories'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your style across our curated collections
            </p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCategoryIndex * (100 / 3)}%)` }}
              >
                {categories.map((category, index) => (
                  <div key={category.id} className="w-full md:w-1/3 flex-shrink-0 px-2">
                    <div className="group cursor-pointer" onClick={() => handleButtonClick('category', category.id)}>
                      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                          <p className="text-sm opacity-90">{category.count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category Navigation */}
            <button
              onClick={() => setCurrentCategoryIndex(Math.max(0, currentCategoryIndex - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentCategoryIndex(Math.min(categories.length - 3, currentCategoryIndex + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
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
              onClick={() => handleButtonClick('view-all-recent')}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((product, index) => (
              <div 
                key={product.id}
                className={`transition-all duration-700 ${
                  isVisible['recently-viewed'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => handleButtonClick('view-all-trending')}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {trendingProducts.map((product, index) => (
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

      {/* AI-Powered Recommendations Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50" data-animate id="ai-recommendations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 ${
            isVisible['ai-recommendations'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <Sparkles className="w-8 h-8 inline mr-3 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Recommendations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalized picks just for you, powered by advanced AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiRecommendations.map((product, index) => (
              <div 
                key={product.id}
                className={`transition-all duration-700 ${
                  isVisible['ai-recommendations'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} showAIScore={true} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => handleButtonClick('get-more-recommendations')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get More Recommendations
              <Sparkles className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Homepage;
