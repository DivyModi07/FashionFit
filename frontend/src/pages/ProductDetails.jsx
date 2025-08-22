import { useState, useEffect, useMemo } from "react"
import { X, Heart, ShoppingCart, Star, Plus, Minus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Upload, Camera, Expand } from "lucide-react" // 👈 1. Import Expand icon
import axios from "axios"
import { addToWishlist, removeFromWishlist, checkWishlistStatus, getWishlist } from '../api/wishlist'
import { addToCart } from '../api/cart'
import { addRecentlyViewed } from '../utils/recentlyViewed';
import { useCartWishlist } from "../context/CartWishlistContext"; 
import { useNavigate } from "react-router-dom";
const ProductDetails = ({ product, isOpen, onClose, onAddToCart, onToggleWishlist, onBuyNow }) => {
  if (!isOpen || !product) {
    return null;
  }
  const { refreshCounts } = useCartWishlist(); 
const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [isTryOnLoading, setIsTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState(null);
  const [isWishlistToggled, setIsWishlistToggled] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false); // 👈 2. Add state for fullscreen view
  const [reviews, setReviews] = useState([]);
const [isLoadingReviews, setIsLoadingReviews] = useState(false);


useEffect(() => {
  // Only fetch if the modal is open and we have a product ID
  if (isOpen && product?.id) {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        // This endpoint should return an array of reviews for the product
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${product.id}/reviews/`);
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]); // Reset to empty on error
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }
}, [isOpen, product?.id]);


  useEffect(() => {
    if (isOpen && product?.id) {
        const checkPurchaseStatus = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://127.0.0.1:8000/api/orders/check-purchase/?product_id=${product.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setHasPurchased(response.data.has_purchased);
            } catch (error) {
                console.error("Failed to check purchase status", error);
            }
        };
        checkPurchaseStatus();
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (isOpen && product) {
        addRecentlyViewed(product);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      setQuantity(1);
      setUploadedImage(null);
      setTryOnResult(null);
      setTryOnError(null);
      checkWishlistStatusForProduct();
    }
  }, [product]);

  const checkWishlistStatusForProduct = async () => {
    if (!product?.id) return;
    try {
      const response = await checkWishlistStatus(product.id);
      setIsWishlistToggled(response.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setIsWishlistToggled(false);
    }
  };

  const images = useMemo(() => {
    const arr = [];
    if (product?.model_image) arr.push({ src: product.model_image, label: "Model" });
    if (product?.cutout_image) arr.push({ src: product.cutout_image, label: "Cutout" });
    if (arr.length === 0 && product?.image) {
      arr.push({ src: product.image, label: "Product" });
    }
    return arr;
  }, [product]); 
  
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => { setCarouselIndex(0); }, [images.length, product]);


  const handleBuyNowClick = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        navigate('/login');
        return;
    }
    // If logged in, call the original onBuyNow function
    onBuyNow({ 
      ...product, 
      quantity: quantity, 
      size: selectedSize, 
      color: selectedColor 
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setTryOnResult(null);
      setTryOnError(null);
    }
  };

  const handleTryOn = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
      navigate('/login');
      return;
  }
    if (!uploadedImage || !product) {
      setTryOnError("Please upload an image and select a product first");
      return;
    }
  
    setIsTryOnLoading(true);
    setTryOnError(null);
  
    try {
      const formData = new FormData();
      formData.append("person_image", uploadedImage);
      formData.append("product_id", product.id);
      if (product.modelImage) {
        formData.append('cloth_image_url', product.modelImage);
      } else if (product.cutoutImage) {
        formData.append('cloth_image_url', product.cutoutImage);
      }
      const response = await axios.post("http://127.0.0.1:8000/tryon/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.error) {
        setTryOnError(response.data.error);
      } else {
        setTryOnResult(response.data.output_image_url);
      }
    } catch (error) {
      setTryOnError(error.response?.data?.error || "Failed to process try-on");
    } finally {
      setIsTryOnLoading(false);
    }
  };
  
  const goToPrev = () => setCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () => setCarouselIndex((prev) => (prev + 1) % images.length);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(product.id, { quantity });
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!product?.id) return;
    onToggleWishlist(product.id);
    setIsWishlistToggled(!isWishlistToggled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300" 
        onClick={onClose} 
      />

      
      {showFullScreenImage && tryOnResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-lg" onClick={() => setShowFullScreenImage(false)}>
          <img src={tryOnResult} alt="Fullscreen Try-on Result" className="max-w-[90vw] max-h-[90vh] object-contain" />
          <button className="absolute top-4 right-4 text-white p-2 bg-white/20 rounded-full">
            <X className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
        {showSizeChart && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setShowSizeChart(false)}>
            <div className="bg-white p-8 rounded-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Size Chart (Men's Tops)</h2>
              <table className="w-full text-left">
                <thead><tr><th className="p-2">Size</th><th className="p-2">Chest (in)</th><th className="p-2">Waist (in)</th></tr></thead>
                <tbody>
                  <tr><td className="p-2">S</td><td className="p-2">36-38</td><td className="p-2">30-32</td></tr>
                  <tr><td className="p-2">M</td><td className="p-2">38-40</td><td className="p-2">32-34</td></tr>
                  <tr><td className="p-2">L</td><td className="p-2">40-42</td><td className="p-2">34-36</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
        <div 
          className="overflow-y-auto max-h-[95vh] scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="relative">
            <div className="flex flex-col xl:flex-row">
              <div className="xl:w-1/2 relative flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  {images.length > 1 && (
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                      onClick={goToPrev}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                  {images.length > 0 ? (
                    <img
                      src={images[carouselIndex].src}
                      alt={product?.name + ' ' + images[carouselIndex].label}
                      className="w-full h-full object-cover transition-all duration-700 rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                  )}
                  {images.length > 1 && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                      onClick={goToNext}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                  <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-6 right-6 p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
                      isWishlistToggled
                        ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                        : "bg-white/90 text-gray-600 hover:text-red-500 backdrop-blur-sm"
                    }`}
                  >
                    <Heart className={`w-6 h-6 transition-all duration-300 ${isWishlistToggled ? "fill-current text-white" : "hover:text-red-500"}`} />
                  </button>
                  {product?.merchandiseLabel && (
                    <span className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                      {product.merchandiseLabel}
                    </span>
                  )}
                  {product?.isOnSale && product?.discount > 0 && (
                    <span className="absolute top-20 left-6 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              </div>
              <div className="xl:w-1/2 p-8 xl:p-12">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {product?.brand}
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(4.5) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 font-medium">(4.5)</span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {product?.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {product?.description}
                </p>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                  <div className="flex items-center space-x-2">
                    {product.finalPrice && Number(product.finalPrice) < Number(product.initialPrice) ? (
                      <>
                        <span className="text-lg font-bold text-red-600">₹{Number(product.finalPrice).toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">₹{Number(product.initialPrice).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">₹{Number(product.initialPrice || product.finalPrice).toFixed(2)}</span>
                    )}
                  </div>
                  {product?.isOnSale && product?.discount > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Save ₹{Number(product.initialPrice - product.finalPrice).toFixed(2)}
                      </span>
                      <span className="text-green-600 font-bold">{product.discount}% off today!</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Size</h3>
                      <button onClick={() => setShowSizeChart(true)} className="text-sm font-medium text-purple-600">
                        Size Chart
                      </button>
                      <div className="flex flex-wrap gap-3">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                              selectedSize === size
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quantity</h3>
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-4 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-8 py-4 font-bold text-xl">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-4 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                        disabled={quantity >= 10}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600" />
                    Virtual Try-On
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Your Photo
                      </label>
                      <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-300">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="tryon-image-upload"
                        />
                        <label
                          htmlFor="tryon-image-upload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          {uploadedImage ? (
                            <div className="w-full">
                              <img
                                src={URL.createObjectURL(uploadedImage)}
                                alt="Uploaded"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <p className="text-sm text-gray-600 mt-2">{uploadedImage.name}</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Click to upload</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Try-On Result
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center min-h-[140px] flex items-center justify-center relative group">
                        {isTryOnLoading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-600">Processing try-on...</p>
                          </div>
                        ) : tryOnResult ? (
                          <div className="w-full">
                            <img
                              src={tryOnResult}
                              alt="Try-on result"
                              className="w-full h-32 object-cover rounded-lg cursor-pointer"
                              onClick={() => setShowFullScreenImage(true)}
                            />
                            <p className="text-sm text-green-600 mt-2">Try-on completed!</p>
                            <button 
                              onClick={() => setShowFullScreenImage(true)} 
                              className="absolute top-2 right-2 p-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Expand className="w-5 h-5 text-black" />
                            </button>
                          </div>
                        ) : tryOnError ? (
                          <div className="text-red-600">
                            <p className="text-sm">{tryOnError}</p>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <p className="text-sm">Upload an image to see the result</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleTryOn}
                      disabled={!uploadedImage || isTryOnLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
                    >
                      {isTryOnLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Try On This Item
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                        onClick={() => handleBuyNowClick({ 
                          ...product, 
                          quantity: quantity, 
                          size: selectedSize, 
                          color: selectedColor 
                        })}
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-bold text-lg">
                    Buy Now
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-green-800">Free Ship</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-blue-800">Secure Pay</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <RotateCcw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-orange-800">30d Return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 -mb-px font-medium ${
                    activeTab === "details"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Product Details
                </button>
                <button
                  className={`px-4 py-2 -mb-px font-medium ${
                    activeTab === "reviews"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </div>
              {activeTab === "details" && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Brand Name</span>
                        <span className="text-lg font-bold text-gray-900">{product?.brand}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Brand ID</span>
                        <span className="text-lg font-bold text-gray-900">{product?.brand_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Merchant ID</span>
                        <span className="text-lg font-bold text-gray-900">{product?.merchant_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                          <span className="text-lg font-bold text-gray-900">
                          Category: {product?.merchandise_label || 'N/A'}
                          </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">In Stock</span>
                        <span className={`text-lg font-bold ${product?.stock_total > 0 ? 'text-green-600' : 'text-red-600'}`}>{product?.stock_total > 0 ? 'Available' : 'Not Available'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Category</span>
                        <span className="text-lg font-bold text-gray-900">{product?.category || product?.gender || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Product ID</span>
                        <span className="text-lg font-bold text-gray-900">{product?.product_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
{activeTab === "reviews" && (
  <div className="space-y-6 p-8">
    <h3 className="text-2xl font-bold text-gray-900 text-center">Customer Reviews</h3>
    {isLoadingReviews ? (
      <p className="text-center text-gray-600">Loading reviews...</p>
    ) : reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-gray-800">{review.user_name || "Anonymous"}</p>
            <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center my-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 mr-1 ${
                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-700 mt-2">{review.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-600 pt-4">No reviews available for this product yet.</p>
    )}
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails;