import { useState, useEffect } from "react"
import {
  Heart,
  ShoppingCart,
  Star,
  X,
  Grid,
  List,
  ArrowRight,
  Sparkles,
  Share2,
  Download,
  Search,
  ChevronDown,
  Eye,
} from "lucide-react"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Animation from '../components/Animation'
import ProductDetails from "./ProductDetails"
import { getWishlist, removeFromWishlist } from '../api/wishlist'
import { addToCart } from '../api/cart'



const WishlistPage = () => {
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [itemToCheckout, setItemToCheckout] = useState(null)
  const [wishlistItems, setWishlistItems] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  // Get unique categories for filter
  const categories = ["all", ...new Set(wishlistItems.map((item) => item.category))]

  // Fetch wishlist data on component mount
  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const wishlistData = await getWishlist();
          const transformedItems = wishlistData.map(item => ({
            ...item.product,
            wishlistId: item.id,
            productId: item.product.id,
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
            addedDate: item.added_at,
          }));
          setWishlistItems(transformedItems);
          setFavorites(new Set(transformedItems.map(item => item.id)));
        }
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      }
    };
    fetchWishlistData();
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

  const handleAddToCart = async (productId, options = {}) => {
    const product = wishlistItems.find((item) => item.productId === productId)
    if (!product || !product.inStock) return

    try {
      await addToCart(product.productId, options.quantity || 1);
      showNotification(`${product.name} added to cart!`, "success")
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add item to cart', "error")
    }
  }

  const handleAddSelectedToCart = () => {
    const selectedProducts = wishlistItems.filter((item) => selectedItems.has(item.id) && item.inStock)

    if (selectedProducts.length === 0) {
      showNotification("No in-stock items selected!", "error")
      return
    }

    selectedProducts.forEach((product) => {
      handleAddToCart(product.id, { quantity: 1 })
    })

    setSelectedItems(new Set())
    showNotification(`${selectedProducts.length} items added to cart!`, "success")
  }

  const handleBuyNow = (item) => {
    setItemToCheckout(item)
    setShowCheckout(true)
  }


  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) {
      showNotification("No items selected!", "error")
      return
    }

    try {
      const selectedProducts = wishlistItems.filter((item) => selectedItems.has(item.id));
      
      // Remove from backend
      for (const product of selectedProducts) {
        await removeFromWishlist(product.wishlistId);
      }

      // Update local state
      setWishlistItems((prev) => prev.filter((item) => !selectedItems.has(item.id)));
      setFavorites((prev) => {
        const newFavorites = new Set(prev)
        selectedItems.forEach((id) => newFavorites.delete(id))
        return newFavorites
      })

      setSelectedItems(new Set())
      showNotification(`${selectedItems.size} items removed from wishlist!`, "success")
    } catch (error) {
      console.error('Error removing items:', error);
      showNotification('Failed to remove items from wishlist', "error")
    }
  }

  const handleClearWishlist = async () => {
    if (favorites.size === 0) {
      showNotification("Wishlist is already empty!", "error")
      return
    }

    if (window.confirm("Are you sure you want to clear your entire wishlist? This action cannot be undone.")) {
      try {
        // Remove all items from backend
        for (const item of wishlistItems) {
          await removeFromWishlist(item.wishlistId);
        }

        // Update local state
        setWishlistItems([]);
        setFavorites(new Set())
        setSelectedItems(new Set())
        showNotification("Wishlist cleared successfully!", "success")
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        showNotification('Failed to clear wishlist', "error")
      }
    }
  }

  const handleShareWishlist = async () => {
    const wishlistData = {
      items: wishlistItems.filter((item) => favorites.has(item.id)),
      totalItems: favorites.size,
      totalValue: wishlistItems.filter((item) => favorites.has(item.id)).reduce((sum, item) => sum + item.price, 0),
      sharedAt: new Date().toISOString(),
    }

    // Create shareable content
    const shareText = `Check out my wishlist! ${wishlistData.totalItems} amazing items worth $${wishlistData.totalValue.toFixed(2)}`
    const shareUrl = `${window.location.origin}/wishlist/shared/${btoa(JSON.stringify(wishlistData))}`

    // Try native sharing first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wishlist",
          text: shareText,
          url: shareUrl,
        })
        showNotification("Wishlist shared successfully!", "success")
      } catch (error) {
        if (error.name !== "AbortError") {
          fallbackShare(shareText, shareUrl)
        }
      }
    } else {
      fallbackShare(shareText, shareUrl)
    }
  }

  const fallbackShare = (text, url) => {
    // Copy to clipboard as fallback
    const shareContent = `${text}\n${url}`

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareContent)
        .then(() => {
          showNotification("Wishlist link copied to clipboard!", "success")
        })
        .catch(() => {
          showNotification("Unable to share wishlist", "error")
        })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = shareContent
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        showNotification("Wishlist link copied to clipboard!", "success")
      } catch (error) {
        showNotification("Unable to share wishlist", "error")
      }
      document.body.removeChild(textArea)
    }
  }

  const handleExportWishlist = () => {
    const wishlistData = wishlistItems.filter((item) => favorites.has(item.id))

    if (wishlistData.length === 0) {
      showNotification("No items in wishlist to export!", "error")
      return
    }

    // Create CSV content
    const csvHeaders = ["Name", "Price", "Original Price",  "Brand", "Rating", "In Stock", "Added Date"]
    const csvRows = wishlistData.map((item) => [
      `"${item.name}"`,
      item.price,
      item.originalPrice || "",
      item.brand,
      item.rating,
      item.inStock ? "Yes" : "No",
      item.addedDate,
    ])

    const csvContent = [csvHeaders, ...csvRows].map((row) => row.join(",")).join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `wishlist_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Wishlist exported successfully!", "success")
  }

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleFavorite = async (id) => {
    try {
      const product = wishlistItems.find(item => item.id === id);
      if (!product) return;

      await removeFromWishlist(product.wishlistId);
      
      // Update local state
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      setFavorites((prev) => {
        const newFavorites = new Set(prev)
        newFavorites.delete(id)
        return newFavorites
      })
      
      showNotification(`${product.name} removed from wishlist!`, "success")
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('Failed to remove from wishlist', "error")
    }
  }

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      return newSelected
    })
  }

  const selectAllItems = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)))
    }
  }

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }

  const handleCloseProductDetail = () => {
    setIsProductDetailOpen(false)
    setSelectedProduct(null)
  }

  const handleToggleWishlist = (productId) => {
    toggleFavorite(productId)
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter((item) => favorites.has(item.id)) // Only show favorited items
    .filter((item) => {
      const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "in-stock" && item.inStock) ||
        (filterBy === "out-of-stock" && !item.inStock) ||
        (filterBy === "on-sale" && item.discount > 0)
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      return matchesSearch && matchesFilter && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.addedDate) - new Date(a.addedDate)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const WishlistCard = ({ item }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{item.discount}%
          </div>
        )}
        {!item.inStock && (
          <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            Out of Stock
          </div>
        )}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <input
            type="checkbox"
            checked={selectedItems.has(item.id)}
            onChange={() => toggleItemSelection(item.id)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleFavorite(item.id)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
          >
            <Heart className={`w-4 h-4 ${favorites.has(item.id) ? "text-red-500 fill-current" : "text-gray-400"}`} />
          </button>
          {/* <button
            onClick={() => handleViewProduct(item)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            title="View Product Details"
          >
            <Eye className="w-4 h-4 text-blue-500" />
          </button> */}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
        <div className="flex items-center mb-2">
    {renderStars(item.rating)}
    <span className="text-sm text-gray-500 ml-2">({item.rating})</span>
  </div>
        <div className="flex items-center justify-between mb-3">
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
          <span className="text-sm text-gray-500">{item.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Added: {new Date(item.addedDate).toLocaleDateString()}</span>
          </div>
          <button
            onClick={() => handleAddToCart(item.productId)}
            disabled={!item.inStock}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
              item.inStock
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )



  return (
    <>
    <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">

      {/* Floating background elements */}
      <Animation />

      {/* Custom animations */}
      <style jsx>{`
       
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      {/* Header Section */}
      <section className="pt-16" data-animate id="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-700 ${
              isVisible["header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <Heart className="w-10 h-10 inline mr-3 text-red-500" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Wishlist
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your curated collection of favorite items</p>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="pt-8" data-animate id="controls">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-700 ${
              isVisible["controls"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                {/* Category Filter */}
                {/* <div className="relative w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div> */}

                <div className="relative w-full sm:w-auto">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Items</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="on-sale">On Sale</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>


              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center justify-between mt-3 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAllItems}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                    onChange={selectAllItems}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span>Select All ({filteredItems.length})</span>
                </button>
                {selectedItems.size > 0 && (
                  <span className="text-gray-600">
                    {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>

              {selectedItems.size > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAddSelectedToCart}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleRemoveSelected}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist Items Section */}
      <section className="pb-8" data-animate id="wishlist-items">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {favorites.size === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-8">Start adding items you love!</p>
              <button
                onClick={() => window.location.href = '/products'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Products
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div
              className={`transition-all duration-700 ${
                isVisible["wishlist-items"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="transition-all duration-700"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <WishlistCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white" data-animate id="quick-actions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-700 ${
              isVisible["quick-actions"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              <Sparkles className="w-8 h-8 inline mr-3 text-purple-600" />
              Quick Actions
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* <button
                onClick={handleShareWishlist}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Wishlist</span>
              </button> */}
              <button
                onClick={handleExportWishlist}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export List</span>
              </button>
              <button
                onClick={handleClearWishlist}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Clear List</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={handleCloseProductDetail}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onBuyNow={handleBuyNow}
      />
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" && <span>✓</span>}
            {notification.type === "error" && <span>✗</span>}
            {notification.type === "info" && <span>ℹ</span>}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Cart Summary (Optional) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Cart: {cart.length} items</span>
            <span className="text-sm text-gray-500">
            ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  )
}

export default WishlistPage
