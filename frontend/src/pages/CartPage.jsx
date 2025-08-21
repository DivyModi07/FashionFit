import { useState, useEffect } from "react"
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ShoppingBag,
  Eye,
  CreditCard,
  Truck,
  Shield,
  Star,
  Gift,
  ArrowRight,
} from "lucide-react"
import CheckoutFlow from "./Checkout"
import ProductDetails from "./ProductDetails" // Import ProductDetails component
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Animation from '../components/Animation'
import { getCart, removeFromCart, updateCartItemQuantity } from '../api/cart'
import { addToWishlist, removeFromWishlist } from '../api/wishlist'
import { useCartWishlist } from '../context/CartWishlistContext'


const CartPage = () => {
  const { refreshCounts } = useCartWishlist();
  const [cartItems, setCartItems] = useState([])


  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isVisible, setIsVisible] = useState({})
  const [favorites, setFavorites] = useState(new Set())
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [itemToCheckout, setItemToCheckout] = useState(null)

  const [showProductDetails, setShowProductDetails] = useState(false) // New state for product details modal
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null) // New state for product details modal

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId);
      showNotification("Item added to wishlist!", "success");
      refreshCounts();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showNotification("Failed to add item to wishlist", "error");
    }
  };

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const cartData = await getCart();
          setCartItems(cartData.map(item => ({
            ...item.product,
            id: item.id,
            name: item.product.short_description || "Unnamed Product",
            brand: item.product.brand_name || "No Brand",
            price: Number(item.product.final_price) || 0,
            originalPrice: Number(item.product.initial_price) || 0,
            image: item.product.model_image || item.product.cutout_image || "/placeholder.svg",
            inStock: (item.product.stock_total || 0) > 0,
            discount: item.product.is_on_sale ? parseInt(item.product.discount_label?.replace('% Off', '') || "0", 10) : 0,
            isOnSale: item.product.is_on_sale,
            rating: 4.5, // Dummy rating
            reviews: [], // Dummy reviews
            quantity: item.quantity,
          })));
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCartData();
}, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItemQuantity(id, newQuantity);
      setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
      refreshCounts();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  const removeItem = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems((items) => items.filter((item) => item.id !== id))
      refreshCounts();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  const toggleFavorite = async (productId) => {
    try {
      const isInWishlist = favorites.has(productId);
  
      if (isInWishlist) {
        await removeFromWishlist(productId); 
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
      } else {
        await addToWishlist(productId);
        setFavorites(prev => new Set(prev).add(productId));
      }
      refreshCounts();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };
  

  const applyPromoCode = () => {
    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promoCodes[promoCode.toUpperCase()],
      })
      setPromoCode("")
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0
    const subtotal = calculateSubtotal()

    if (appliedPromo.type === "percentage") {
      return subtotal * (appliedPromo.discount / 100)
    } else if (appliedPromo.type === "fixed") {
      return Math.min(appliedPromo.discount, subtotal)
    }
    return 0
  }

  const calculateShipping = () => {
    if (cartItems.length === 0) return 0;
    
    if (appliedPromo?.type === "shipping") return 0
    const subtotal = calculateSubtotal()
    return subtotal > 500 ? 0 : 50 // Free shipping over ₹500
  }

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShipping()
  }

  const calculateSingleItemSubtotal = (item) => item.price * item.quantity
  const calculateSingleItemDiscount = () => 0
  const calculateSingleItemShipping = (item) => (item.price * item.quantity > 500 ? 0 : 50)
  const calculateSingleItemTotal = (item) =>
    calculateSingleItemSubtotal(item) - calculateSingleItemDiscount() + calculateSingleItemShipping(item)

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const handleButtonClick = (action, id = null) => {
    console.log(`Button clicked: ${action}`, id ? `ID: ${id}` : "")
  }

  const handleProceedToCartCheckout = async () => {
    setIsCheckoutLoading(true)
    setCheckoutError("")

    try {
      const outOfStockItems = cartItems.filter((item) => !item.inStock)
      if (outOfStockItems.length > 0) {
        setCheckoutError(`Please remove out of stock items: ${outOfStockItems.map((item) => item.name).join(", ")}`)
        setIsCheckoutLoading(false)
        return
      }

      if (cartItems.length === 0) {
        setCheckoutError("Your cart is empty")
        setIsCheckoutLoading(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setItemToCheckout(null)
      setShowCheckout(true)
    } catch (error) {
      setCheckoutError("Something went wrong. Please try again.")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  const handleBuyNow = (item) => {
    setItemToCheckout(item)
    setShowCheckout(true)
  }

  const handleViewDetails = (item) => {
    setSelectedProductForDetails(item);
    setShowProductDetails(true);
  };

  const handleCloseProductDetails = () => {
    setShowProductDetails(false)
    setSelectedProductForDetails(null)
  }

  const handleAddToCartFromDetails = (productId, { size, color, quantity }) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === productId,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: quantity,

        }
        return updatedItems
      } else {
        console.warn("Attempted to add to cart from details for an item not found in cart:", productId)
        return prevItems
      }
    })
  }

  if (showCheckout) {
    const currentCartItems = itemToCheckout ? [itemToCheckout] : cartItems
    const currentCalculateSubtotal = itemToCheckout
      ? () => calculateSingleItemSubtotal(itemToCheckout)
      : calculateSubtotal
    const currentCalculateDiscount = itemToCheckout ? calculateSingleItemDiscount : calculateDiscount
    const currentCalculateShipping = itemToCheckout
      ? () => calculateSingleItemShipping(itemToCheckout)
      : calculateShipping
    const currentCalculateTotal = itemToCheckout ? () => calculateSingleItemTotal(itemToCheckout) : calculateTotal
    const currentAppliedPromo = itemToCheckout ? null : appliedPromo

    return (
      <CheckoutFlow
        cartItems={currentCartItems}
        calculateTotal={currentCalculateTotal}
        calculateSubtotal={currentCalculateSubtotal}
        calculateDiscount={currentCalculateDiscount}
        calculateShipping={currentCalculateShipping}
        appliedPromo={currentAppliedPromo}
        onBack={() => {
          setShowCheckout(false)
          setItemToCheckout(null)
        }}
      />
    )
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">
      
      <Animation />

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center" data-animate id="cart-header">
          <div
            className={`transition-all duration-700 ${
              isVisible["cart-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              <ShoppingBag className="w-10 h-10 inline mr-4 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shopping Cart
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2" data-animate id="cart-items">
            <div
              className={`transition-all duration-700 ${
                isVisible["cart-items"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some items to get started</p>
                  <button
                    onClick={() =>(window.location.href = "/products")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="relative">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full md:w-32 h-48 md:h-32 object-cover rounded-xl"
                            />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-80 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Out of Stock</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                                {!item.inStock && (
                                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDetails(item)}
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                                >
                                  <Eye className="w-5 h-5 text-gray-400 hover:text-purple-500" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center mb-2">
                              {renderStars(item.rating)}
                              <span className="text-sm text-gray-500 ml-2">({item.rating})</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center space-x-2">
                                {item.isOnSale && item.discount > 0 ? (
                                  <>
                                    <span className="text-lg font-bold text-red-600">₹{item.price.toFixed(2)}</span>
                                    <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-gray-900">₹{item.originalPrice.toFixed(2)}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-full">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100 rounded-l-full transition-colors duration-300"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 rounded-r-full transition-colors duration-300"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleBuyNow(item)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                                >
                                  Buy Now
                                </button>
                                 <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1" data-animate id="order-summary">
            <div
              className={`transition-all duration-700 ${
                isVisible["order-summary"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                {/* ... (error message logic) */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  {appliedPromo && calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-₹{calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {calculateShipping() === 0 ? "Free" : `₹${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {checkoutError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {checkoutError}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleProceedToCartCheckout}
                    disabled={cartItems.length === 0 || cartItems.some((item) => !item.inStock) || isCheckoutLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center relative overflow-hidden"
                  >
                    {isCheckoutLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {cartItems.some((item) => !item.inStock)
                          ? "Remove Out of Stock Items"
                          : cartItems.length === 0
                            ? "Cart is Empty"
                            : `Proceed to Checkout • ₹${calculateTotal().toFixed(2)}`}
                        {!cartItems.some((item) => !item.inStock) && cartItems.length > 0 && !isCheckoutLoading && (
                          <ArrowRight className="w-5 h-5 ml-2" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedProductForDetails && (
        <ProductDetails
          product={selectedProductForDetails}
          isOpen={showProductDetails}
          onClose={handleCloseProductDetails}
          onAddToCart={handleAddToCartFromDetails}
          onToggleWishlist={toggleFavorite}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
    <Footer />
    </>
  )
}

export default CartPage;