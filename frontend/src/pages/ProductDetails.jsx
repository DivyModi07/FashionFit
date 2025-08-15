import { useState, useEffect, useMemo } from "react"
import { X, Heart, ShoppingCart, Star, Plus, Minus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Upload, Camera } from "lucide-react"
import axios from "axios"
import { addToWishlist, removeFromWishlist, checkWishlistStatus, getWishlist } from '../api/wishlist'
import { addToCart } from '../api/cart'

// --- FIX 1: Moved Mock Data Outside Component ---
// This data doesn't change, so it doesn't need to be inside the component.
// This solves the crash where `mockProduct` was used before it was defined.
const mockReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2024-01-15",
    comment: "Absolutely love this product! The quality is amazing and it fits perfectly. Highly recommend!",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 4,
    date: "2024-01-10",
    comment: "Great product overall. Good quality and fast shipping. Only minor issue was the sizing runs a bit small.",
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 5,
    date: "2024-01-08",
    comment: "Perfect! Exactly what I was looking for. The color is beautiful and the material feels premium.",
    verified: false,
    helpful: 5,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    rating: 4,
    date: "2024-01-05",
    comment: "Good value for money. The product arrived quickly and was well packaged. Would buy again.",
    verified: true,
    helpful: 3,
  },
]

const mockProduct = {
  id: 1,
  name: "Premium Leather Jacket",
  brand: "StyleCraft",
  category: "Clothing",
  price: 199.99,
  originalPrice: 299.99,
  discount: 33,
  rating: 4.8,
  reviews: 127,
  description: "Experience luxury with our premium leather jacket. Crafted from the finest materials with attention to detail, this jacket combines style and comfort for the modern individual.",
  image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["Black", "Brown", "Burgundy"],
  isNew: true,
  isWishlisted: false,
}

const ProductDetails = ({ product, isOpen, onClose, onAddToCart, onToggleWishlist }) => {
  // This is the variable that holds either the passed product or the mock product
  const displayProduct = product || mockProduct

  // --- FIX 2: All useState hooks must be at the top level ---
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("details")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [tryOnResult, setTryOnResult] = useState(null)
  const [isTryOnLoading, setIsTryOnLoading] = useState(false)
  const [tryOnError, setTryOnError] = useState(null)
  const [isWishlistToggled, setIsWishlistToggled] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "")
      setSelectedColor(product.colors?.[0] || "")
      setQuantity(1)
      setUploadedImage(null)
      setTryOnResult(null)
      setTryOnError(null)
      // Check wishlist status when product changes
      checkWishlistStatusForProduct()
    }
  }, [product])

  // Check if product is in wishlist
  const checkWishlistStatusForProduct = async () => {
    if (!product?.id) return
    try {
      const response = await checkWishlistStatus(product.id)
      setIsWishlistToggled(response.isWishlisted)
    } catch (error) {
      console.error('Error checking wishlist status:', error)
      setIsWishlistToggled(false)
    }
  }

  // Carousel state for images
  const images = useMemo(() => {
    const arr = [];
    // Fix: Use displayProduct instead of product for image sources
    if (displayProduct?.modelImage) arr.push({ src: displayProduct.modelImage, label: "Model" });
    if (displayProduct?.cutoutImage) arr.push({ src: displayProduct.cutoutImage, label: "Cutout" });
    // Fallback to regular image if no model/cutout images
    if (arr.length === 0 && displayProduct?.image) {
      arr.push({ src: displayProduct.image, label: "Product" });
    }
    return arr;
  }, [displayProduct?.modelImage, displayProduct?.cutoutImage, displayProduct?.image]);
  
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => { setCarouselIndex(0); }, [images.length, product]);

  // Handle image upload for try-on
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    console.log("Selected file:", file);
    if (file) {
      setUploadedImage(file)
      setTryOnResult(null)
      setTryOnError(null)
    }
  }

  // Handle try-on process
  const handleTryOn = async () => {
    console.log("Cloth image URL:", displayProduct.modelImage);
    if (!uploadedImage || !displayProduct) {
      setTryOnError("Please upload an image and select a product first");
      return;
    }
  
    setIsTryOnLoading(true);
    setTryOnError(null);
  
    try {
      const formData = new FormData();
      formData.append("person_image", uploadedImage); // file
      formData.append("product_id", displayProduct.id); // id for cloth image
      if (displayProduct.modelImage) {
        formData.append('cloth_image_url', displayProduct.modelImage);
      } else if (displayProduct.cutoutImage) {
        formData.append('cloth_image_url', displayProduct.cutoutImage);
      }
      const response = await axios.post("http://127.0.0.1:8000/tryon/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.error) {
        setTryOnError(response.data.error);
      } else {
        setTryOnResult(response.data.output_image_url); // match backend key
      }
    } catch (error) {
      setTryOnError(error.response?.data?.error || "Failed to process try-on");
    } finally {
      setIsTryOnLoading(false);
    }
  };
  

  const goToPrev = () => setCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () => setCarouselIndex((prev) => (prev + 1) % images.length);

  if (!isOpen) return null

  // Fix: Use API calls instead of callback functions
  const handleAddToCart = async () => {
    if (!displayProduct?.id) return
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    setIsAddingToCart(true)
    try {
      await addToCart(displayProduct.id, quantity)
      // Call the parent callback if provided
      onAddToCart?.(displayProduct.id, { size: selectedSize, color: selectedColor, quantity })
      console.log('Product added to cart successfully')
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Don't redirect here, let the API handle it
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  // Fix: Use API calls for wishlist functionality
  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!displayProduct?.id) return
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    try {
      if (isWishlistToggled) {
        // Find the wishlist item ID first
        const wishlist = await getWishlist();
        const wishlistItem = wishlist.find(item => item.product.id === displayProduct.id);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
        }
      } else {
        await addToWishlist(displayProduct.id)
      }
      
      setIsWishlistToggled(!isWishlistToggled)
      // Call the parent callback if provided
      onToggleWishlist?.(displayProduct.id)
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      // Don't redirect here, let the API handle it
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Custom Scrollbar Hidden */}
        <div 
          className="overflow-y-auto max-h-[95vh] scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {/* Hero Section */}
          <div className="relative">
            <div className="flex flex-col xl:flex-row">
              {/* Left - Product Images Carousel */}
              <div className="xl:w-1/2 relative flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  {images.length > 1 && (
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                      onClick={goToPrev}
                      tabIndex={0}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                  {images.length > 0 ? (
                    <img
                      src={images[carouselIndex].src}
                      alt={displayProduct?.name + ' ' + images[carouselIndex].label}
                      className="w-full h-full object-cover transition-all duration-700 rounded-xl"
                      onError={(e) => {
                        console.error('Image failed to load:', images[carouselIndex].src)
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                  )}
                  {images.length > 1 && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                      onClick={goToNext}
                      tabIndex={0}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                  {/* Floating Badges, Wishlist Button, etc. remain unchanged */}
                  {/* Wishlist Button */}
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
                  {/* Merchandise Label Badge */}
                  {displayProduct?.merchandiseLabel && (
                    <span className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                      {displayProduct.merchandiseLabel}
                    </span>
                  )}
                  {/* Discount Badge (only if on sale) */}
                  {displayProduct?.isOnSale && displayProduct?.discount > 0 && (
                    <span className="absolute top-20 left-6 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                      -{displayProduct.discount}%
                    </span>
                  )}
                </div>
              </div>
              {/* Right - Product Details */}
              <div className="xl:w-1/2 p-8 xl:p-12">
                {/* Brand & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {displayProduct?.brand}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(displayProduct?.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">({displayProduct?.reviews})</span>
                  </div>
                </div>
                {/* Product Name */}
                <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {displayProduct?.name}
                </h1>
                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {displayProduct?.description}
                </p>
                {/* Price Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    {displayProduct?.isOnSale ? (
                      <>
                        <span className="text-4xl font-bold text-red-600">${displayProduct.finalPrice}</span>
                        <span className="text-2xl text-gray-500 line-through">${displayProduct.initialPrice}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">${displayProduct.initialPrice}</span>
                    )}
                  </div>
                  {displayProduct?.isOnSale && displayProduct?.discount > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Save ${(displayProduct.initialPrice - displayProduct.finalPrice).toFixed(2)}
                      </span>
                      <span className="text-green-600 font-bold">{displayProduct.discount}% off today!</span>
                    </div>
                  )}
                </div>

                {/* Size & Quantity Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Size Selection */}
                  {displayProduct.sizes && displayProduct.sizes.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Size</h3>
                      <div className="flex flex-wrap gap-3">
                        {displayProduct.sizes.map((size) => (
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

                  {/* Quantity Selection */}
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

                {/* Try-On Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600" />
                    Virtual Try-On
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Upload */}
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

                    {/* Try-On Result */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Try-On Result
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center min-h-[140px] flex items-center justify-center">
                        {isTryOnLoading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-600">Processing try-on...</p>
                          </div>
                        ) : tryOnResult ? (
                          <div className="w-full">
                            <img
                              src={`http://127.0.0.1:8000${tryOnResult}`}
                              alt="Try-on result"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <p className="text-sm text-green-600 mt-2">Try-on completed!</p>
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

                  {/* Try-On Button */}
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

                {/* Action Buttons */}
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
                  <button className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-bold text-lg">
                    Buy Now
                  </button>
                </div>

                {/* Features */}
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

          {/* Tabs Section */}
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8 py-8">
              {/* Tab Navigation */}
              <div className="flex gap-8 mb-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`text-xl font-bold pb-4 border-b-4 transition-all duration-300 ${
                    activeTab === "details"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`text-xl font-bold pb-4 border-b-4 transition-all duration-300 ${
                    activeTab === "reviews"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({mockReviews.length})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "details" && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Brand Name</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct?.brand}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Brand ID</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct?.brand_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Merchant ID</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct?.merchant_id || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">In Stock</span>
                        <span className={`text-lg font-bold ${displayProduct?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{displayProduct?.stock > 0 ? 'Available' : 'Not Available'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Category</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct?.category || displayProduct?.gender || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Product ID</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct?.product_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {/* Reviews Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                          <span className="text-6xl font-bold text-gray-900">{displayProduct?.rating}</span>
                          <div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-6 h-6 ${
                                    i < Math.floor(displayProduct?.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600 font-medium">{displayProduct?.reviews} reviews</p>
                          </div>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105">
                        Write Review
                      </button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-xl font-bold text-gray-900">{review.name}</span>
                              {review.verified && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-500 font-medium">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">{review.comment}</p>
                        <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                          👍 Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProductDetails
