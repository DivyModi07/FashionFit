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
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Animation from './components/Animation.jsx'
import ProductDetails from "./ProductDetails.jsx"

const WishlistPage = () => {
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [favorites, setFavorites] = useState(new Set())
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)

  // Sample wishlist data with enhanced product information
  const wishlistItems = [
    {
      id: 1,
      name: "Elegant Summer Dress",
      price: 89.99,
      originalPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      discount: 31,
      category: "Dresses",
      addedDate: "2024-01-15",
      inStock: true,
      colors: ["Red", "Blue", "Black"],
      sizes: ["S", "M", "L", "XL"],
      brand: "Fashion Co",
      description:
        "A beautiful and elegant summer dress perfect for any occasion. Made with premium materials for comfort and style.",
      reviews: 124,
      isNew: false,
      isWishlisted: true,
    },
    {
      id: 2,
      name: "Casual Denim Jacket",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.3,
      discount: 20,
      category: "Jackets",
      addedDate: "2024-01-10",
      inStock: true,
      colors: ["Blue", "Light Blue"],
      sizes: ["M", "L", "XL"],
      brand: "Denim Works",
      description: "Classic denim jacket with a modern twist. Perfect for layering and everyday wear.",
      reviews: 89,
      isNew: true,
      isWishlisted: true,
    },
    {
      id: 3,
      name: "Stylish Sneakers",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      discount: 19,
      category: "Shoes",
      addedDate: "2024-01-05",
      inStock: false,
      colors: ["White", "Black"],
      sizes: ["7", "8", "9", "10"],
      brand: "SportStyle",
      description:
        "Comfortable and stylish sneakers for everyday wear. Premium quality materials and excellent cushioning.",
      reviews: 256,
      isNew: false,
      isWishlisted: true,
    },
    {
      id: 4,
      name: "Designer Handbag",
      price: 199.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      discount: 20,
      category: "Bags",
      addedDate: "2024-01-08",
      inStock: true,
      colors: ["Brown", "Black", "Tan"],
      sizes: ["One Size"],
      brand: "Luxury Bags",
      description:
        "Elegant designer handbag crafted from premium leather. Perfect for both casual and formal occasions.",
      reviews: 78,
      isNew: false,
      isWishlisted: true,
    },
    {
      id: 5,
      name: "Bohemian Maxi Dress",
      price: 119.99,
      originalPrice: 159.99,
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      discount: 25,
      category: "Dresses",
      addedDate: "2024-01-12",
      inStock: true,
      colors: ["Floral", "Solid"],
      sizes: ["XS", "S", "M", "L"],
      brand: "Boho Chic",
      description: "Flowing bohemian maxi dress with beautiful patterns. Perfect for summer events and casual outings.",
      reviews: 145,
      isNew: true,
      isWishlisted: true,
    },
    {
      id: 6,
      name: "Vintage Leather Jacket",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      discount: 25,
      category: "Jackets",
      addedDate: "2024-01-03",
      inStock: true,
      colors: ["Brown", "Black"],
      sizes: ["S", "M", "L"],
      brand: "Vintage Style",
      description: "Classic vintage-style leather jacket with authentic detailing. A timeless piece for your wardrobe.",
      reviews: 92,
      isNew: false,
      isWishlisted: true,
    },
  ]

  // Get unique categories for filter
  const categories = ["all", ...new Set(wishlistItems.map((item) => item.category))]

  // Initialize favorites
  useEffect(() => {
    const initialFavorites = new Set(wishlistItems.map((item) => item.id))
    setFavorites(initialFavorites)
  }, [])

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

  const handleAddToCart = (productId, options = {}) => {
    const product = wishlistItems.find((item) => item.id === productId)
    if (!product || !product.inStock) return

    const cartItem = {
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: options.quantity || 1,
      size: options.size || product.sizes?.[0] || "",
      color: options.color || product.colors?.[0] || "",
      addedAt: new Date().toISOString(),
    }

    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.id === productId && item.size === cartItem.size && item.color === cartItem.color,
      )

      if (existingItem) {
        return prev.map((item) =>
          item.id === productId && item.size === cartItem.size && item.color === cartItem.color
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item,
        )
      } else {
        return [...prev, cartItem]
      }
    })

    showNotification(`${product.name} added to cart!`, "success")
    console.log("Added to cart:", cartItem)
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

  const handleRemoveSelected = () => {
    if (selectedItems.size === 0) {
      showNotification("No items selected!", "error")
      return
    }

    const removedCount = selectedItems.size

    // Remove from favorites
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      selectedItems.forEach((id) => newFavorites.delete(id))
      return newFavorites
    })

    setSelectedItems(new Set())
    showNotification(`${removedCount} items removed from wishlist!`, "success")
  }

  const handleClearWishlist = () => {
    if (favorites.size === 0) {
      showNotification("Wishlist is already empty!", "error")
      return
    }

    if (window.confirm("Are you sure you want to clear your entire wishlist? This action cannot be undone.")) {
      setFavorites(new Set())
      setSelectedItems(new Set())
      showNotification("Wishlist cleared successfully!", "success")
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
    const csvHeaders = ["Name", "Price", "Original Price", "Category", "Brand", "Rating", "In Stock", "Added Date"]
    const csvRows = wishlistData.map((item) => [
      `"${item.name}"`,
      item.price,
      item.originalPrice || "",
      item.category,
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

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
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
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <button
            onClick={() => handleViewProduct(item)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            title="View Product Details"
          >
            <Eye className="w-4 h-4 text-blue-500" />
          </button>
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
            <span className="text-lg font-bold text-gray-900">${item.price}</span>
            {item.originalPrice && <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>}
          </div>
          <span className="text-sm text-gray-500">{item.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Added: {new Date(item.addedDate).toLocaleDateString()}</span>
          </div>
          <button
            onClick={() => handleAddToCart(item.id)}
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

  const WishlistListItem = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="flex">
        <div className="relative w-48 h-48 flex-shrink-0">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          {item.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{item.discount}%
            </div>
          )}
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
              <div className="flex items-center mb-2">
                {renderStars(item.rating)}
                <span className="text-sm text-gray-500 ml-2">({item.rating})</span>
              </div>
              <p className="text-gray-600 mb-2">{item.category}</p>
              <p className="text-sm text-gray-500">Added: {new Date(item.addedDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleItemSelection(item.id)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.has(item.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                  />
                </button>
                <button
                  onClick={() => handleViewProduct(item)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                  title="View Product Details"
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${item.originalPrice}</span>
                )}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>
            <button
              onClick={() => handleAddToCart(item.id)}
              disabled={!item.inStock}
              className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                item.inStock
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2 inline" />
              Add to Cart
            </button>
          </div>
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
                <div className="relative w-full sm:w-auto">
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
                </div>

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

                {/* View Mode */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start mt-2 sm:mt-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
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
                onClick={() => showNotification("Browse products feature coming soon!", "info")}
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
              {viewMode === "grid" ? (
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
              ) : (
                <div className="space-y-6">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="transition-all duration-700"
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <WishlistListItem item={item} />
                    </div>
                  ))}
                </div>
              )}
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
              <button
                onClick={handleShareWishlist}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Wishlist</span>
              </button>
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
              ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
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
