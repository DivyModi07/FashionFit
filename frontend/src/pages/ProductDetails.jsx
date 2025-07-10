import { useState, useEffect } from "react"
import { X, Heart, ShoppingCart, Star, Plus, Minus, Truck, Shield, RotateCcw } from "lucide-react"

const ProductDetails = ({ product, isOpen, onClose, onAddToCart, onToggleWishlist }) => {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("details")

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "")
      setSelectedColor(product.colors?.[0] || "")
      setQuantity(1)
    }
  }, [product])

  // Mock reviews data
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

  // Mock product data for demo
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

  const displayProduct = product || mockProduct
  const [isWishlistToggled, setIsWishlistToggled] = useState(displayProduct.isWishlisted)

  // Update local state when product changes
  useEffect(() => {
    if (displayProduct) {
      setIsWishlistToggled(displayProduct.isWishlisted)
    }
  }, [displayProduct.isWishlisted])

  if (!isOpen) return null

  const handleAddToCart = () => {
    onAddToCart?.(displayProduct.id, { size: selectedSize, color: selectedColor, quantity })
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlistToggled(!isWishlistToggled)
    onToggleWishlist?.(displayProduct.id)
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
              {/* Left - Product Image */}
              <div className="xl:w-1/2 relative">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  <img
                    src={displayProduct.image}
                    alt={displayProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                    {displayProduct.isNew && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        ✨ New Arrival
                      </div>
                    )}
                    {displayProduct.discount > 0 && (
                      <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        🔥 {displayProduct.discount}% OFF
                      </div>
                    )}
                  </div>

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
                </div>
              </div>

              {/* Right - Product Details */}
              <div className="xl:w-1/2 p-8 xl:p-12">
                {/* Brand & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {displayProduct.brand}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(displayProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">({displayProduct.reviews})</span>
                  </div>
                </div>

                {/* Product Name */}
                <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {displayProduct.name}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {displayProduct.description}
                </p>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${displayProduct.price}</span>
                    {displayProduct.originalPrice > displayProduct.price && (
                      <span className="text-2xl text-gray-500 line-through">${displayProduct.originalPrice}</span>
                    )}
                  </div>
                  {displayProduct.discount > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Save ${(displayProduct.originalPrice - displayProduct.price).toFixed(2)}
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

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 font-bold text-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart • ${(displayProduct.price * quantity).toFixed(2)}
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
                        <span className="text-lg font-medium text-gray-600">Brand</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct.brand}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Category</span>
                        <span className="text-lg font-bold text-gray-900">{displayProduct.category}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Material</span>
                        <span className="text-lg font-bold text-gray-900">Premium Leather</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Care</span>
                        <span className="text-lg font-bold text-gray-900">Professional Clean</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">SKU</span>
                        <span className="text-lg font-bold text-gray-900">#{displayProduct.id}00123</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600">Stock</span>
                        <span className="text-lg font-bold text-green-600">✓ In Stock</span>
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
                          <span className="text-6xl font-bold text-gray-900">{displayProduct.rating}</span>
                          <div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-6 h-6 ${
                                    i < Math.floor(displayProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600 font-medium">{displayProduct.reviews} reviews</p>
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
