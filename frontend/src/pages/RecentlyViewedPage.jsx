import React, { useState, useEffect } from 'react';
import { Clock, Heart, ShoppingCart, Star, CheckCircle, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animation from '../components/Animation';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { addToCart } from '../api/cart';
import { addToWishlist } from '../api/wishlist';
import ProductDetails from './ProductDetails';

const Notification = ({ message, show }) => {
    if (!show) return null;
    return (
      <div className="fixed top-20 right-5 z-[100] bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg flex items-center gap-3">
        <CheckCircle className="w-6 h-6" />
        <span className="font-semibold">{message}</span>
      </div>
    );
  };

const RecentlyViewedPage = () => {
  const [viewedItems, setViewedItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  

  useEffect(() => {
    const items = getRecentlyViewed();
    // We need to re-map the items from localStorage to ensure they have the latest structure
    const mappedItems = items.map(p => ({
        ...p,
        id: p.id,
        name: p.short_description || p.name || "Unnamed Product",
        brand: p.brand_name || p.brand || "No Brand",
        description: p.short_description || p.description || "",
        price: Number(p.final_price || p.price) || 0,
        originalPrice: Number(p.initial_price || p.originalPrice) || 0,
        image: p.model_image || p.cutout_image || p.image || "/placeholder.svg",
        model_image: p.model_image,
        cutout_image: p.cutout_image,
        rating: p.rating || 4.5,
        discount: p.is_on_sale ? parseInt(p.discount_label?.replace('% Off', '') || "0", 10) : (p.discount || 0),
    }));
    setViewedItems(mappedItems);
}, []);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  
  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
      .then(() => showNotification("Added to cart!"))
      .catch(() => showNotification("Error adding to cart."));
  };
  
  const handleToggleWishlist = (productId) => {
    const isFavorite = favorites.has(productId);
    const newFavorites = new Set(favorites);
    
    if (isFavorite) {
      newFavorites.delete(productId);
      showNotification("Removed from wishlist.");
    } else {
      newFavorites.add(productId);
      addToWishlist(productId);
      showNotification("Added to wishlist!");
    }
    setFavorites(newFavorites);
  };
  const renderStars = (rating) => [...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);

  return (
    <>
      <Navbar />
      <Notification message={notification.message} show={notification.show} />
      <ProductDetails
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">
        <Animation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <Clock className="w-10 h-10 inline mr-4 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recently Viewed
              </span>
            </h1>
            <p className="text-xl text-gray-600">Your browsing history</p>
          </div>

          {viewedItems.length === 0 ? (
            <p className="text-center text-gray-600">You haven't viewed any items yet.</p>
          ) : (
// In the return() JSX of RecentlyViewedPage.jsx

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {viewedItems.map((product) => (
    <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">-{product.discount}%</div>
        )}
        
        {/* This div stacks the icons vertically */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={() => handleToggleWishlist(product.id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md">
                <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>
            {/* <button onClick={() => handleViewDetails(product)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md">
                <Eye className="w-4 h-4 text-purple-600" />
            </button> */}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center mb-2">{renderStars(product.rating)}<span className="text-sm text-gray-500 ml-2">({product.rating})</span></div>
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
  {product.isOnSale && product.discount > 0 ? (
    <>
      <span className="text-lg font-bold text-red-600">₹{product.price.toFixed(2)}</span>
      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
 
    </>
  ) : (
    <span className="text-lg font-bold text-gray-900">₹{product.originalPrice.toFixed(2)}</span>
  )}
</div>
          <button onClick={() => handleAddToCart(product.id)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecentlyViewedPage;