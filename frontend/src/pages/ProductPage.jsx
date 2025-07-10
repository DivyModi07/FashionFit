import { useState, useEffect } from "react"
import { Search, Heart, ShoppingCart, Filter, Grid, List, Star, X, Plus, Eye, ArrowUpDown, Camera } from "lucide-react"
import ProductDetails from "./ProductDetails.jsx"
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Animation from './Animation.jsx'


const ProductPage = () => {
  const [isVisible, setIsVisible] = useState({})
  const [viewMode, setViewMode] = useState("grid") // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Product Details Modal State
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    size: [],
    color: [],
    priceRange: [0, 1000],
    rating: 0,
    discount: 0,
  })
  const [appliedFilters, setAppliedFilters] = useState({
    category: [],
    brand: [],
    size: [],
    color: [],
    priceRange: [0, 1000],
    rating: 0,
    discount: 0,
  })
  const [isFiltersExpanded, setIsFiltersExpanded] = useState({
    category: false, // Start with category expanded
    priceRange: false,
    brand: false,
    size: false,
    color: false,
    rating: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [imageSearchFile, setImageSearchFile] = useState(null)

  // Mock product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "AI-Recommended Summer Dress",
      brand: "FashionAI",
      price: 89.99,
      originalPrice: 129.99,
      discount: 31,
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Women",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Pink", "White"],
      isWishlisted: false,
      isNew: true,
      description: "Perfect summer dress with AI-curated style recommendations",
    },
    {
      id: 2,
      name: "Smart Casual Blazer",
      brand: "StyleTech",
      price: 159.99,
      originalPrice: 199.99,
      discount: 20,
      rating: 4.6,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Men",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Navy", "Black", "Gray"],
      isWishlisted: true,
      isNew: false,
      description: "Professional blazer with smart fit technology",
    },
    {
      id: 3,
      name: "Kids Adventure Sneakers",
      brand: "PlayTech",
      price: 49.99,
      originalPrice: 69.99,
      discount: 29,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Kids",
      sizes: ["28", "30", "32", "34"],
      colors: ["Red", "Blue", "Green"],
      isWishlisted: false,
      isNew: true,
      description: "Durable sneakers designed for active kids",
    },
    {
      id: 4,
      name: "Luxury Handbag Collection",
      brand: "EliteStyle",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Accessories",
      sizes: ["One Size"],
      colors: ["Black", "Brown", "Beige"],
      isWishlisted: false,
      isNew: false,
      description: "Premium leather handbag with timeless design",
    },
    {
      id: 5,
      name: "Athletic Performance Shoes",
      brand: "SportAI",
      price: 119.99,
      originalPrice: 149.99,
      discount: 20,
      rating: 4.5,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Footwear",
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["White", "Black", "Blue"],
      isWishlisted: true,
      isNew: false,
      description: "High-performance athletic shoes with AI-optimized comfort",
    },
    {
      id: 6,
      name: "Elegant Evening Gown",
      brand: "GlamourTech",
      price: 249.99,
      originalPrice: 349.99,
      discount: 29,
      rating: 4.9,
      reviews: 45,
      image:
        "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Women",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Burgundy"],
      isWishlisted: false,
      isNew: true,
      description: "Stunning evening gown for special occasions",
    },
  ])

  // Filter options
  const filterOptions = {
    categories: ["Men", "Women", "Kids", "Footwear", "Accessories"],
    brands: ["FashionAI", "StyleTech", "PlayTech", "EliteStyle", "SportAI", "GlamourTech"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "11", "28", "30", "32", "34"],
    colors: ["Black", "White", "Blue", "Red", "Pink", "Navy", "Gray", "Brown", "Green", "Beige", "Burgundy"],
    discounts: [10, 20, 30, 50],
  }

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

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      if (filterType === "priceRange" || filterType === "rating" || filterType === "discount") {
        newFilters[filterType] = value
      } else {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter((item) => item !== value)
        } else {
          newFilters[filterType] = [...newFilters[filterType], value]
        }
      }
      return newFilters
    })
  }

  // Handle wishlist toggle
  const toggleWishlist = (productId) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, isWishlisted: !product.isWishlisted } : product)),
    )
  }

  // Handle add to cart
  const handleAddToCart = (productId, options = {}) => {
    console.log(`Added product ${productId} to cart`, options)
    // Add your cart logic here
  }

  // Handle quick view
  const handleQuickView = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsProductDetailsOpen(true)
    }
  }

  // Handle see product details
  const handleSeeProduct = (product) => {
    setSelectedProduct(product)
    setIsProductDetailsOpen(true)
  }

  // Close product details modal
  const closeProductDetails = () => {
    setIsProductDetailsOpen(false)
    setSelectedProduct(null)
  }

  // Load more products (infinite scroll simulation)
  const loadMoreProducts = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1)
      setIsLoading(false)
    }, 1000)
  }

  // Apply filters function
  const applyFilters = () => {
    setAppliedFilters({ ...filters })
    setShowFilters(false)
  }

  // Filter and sort products using appliedFilters instead of filters
  const filteredAndSortedProducts = products
    .filter((product) => {
      // Search query filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      // Category filter
      if (appliedFilters.category.length > 0 && !appliedFilters.category.includes(product.category)) {
        return false
      }
      // Brand filter
      if (appliedFilters.brand.length > 0 && !appliedFilters.brand.includes(product.brand)) {
        return false
      }
      // Price range filter
      if (product.price < appliedFilters.priceRange[0] || product.price > appliedFilters.priceRange[1]) {
        return false
      }
      // Rating filter
      if (product.rating < appliedFilters.rating) {
        return false
      }
      // Discount filter
      if (product.discount < appliedFilters.discount) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.isNew - a.isNew
        default:
          return b.reviews - a.reviews // popularity
      }
    })

  // Handle image search
  const handleImageSearch = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImageSearchFile(file)
      console.log("Image search file:", file)
      // Here you would typically upload the image to your AI service
      // and get similar products back
    }
  }

  return (
    <>
          <Navbar/>

    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">
      {/* Floating background elements */}
      <Animation />

      {/* Custom animations */}
      <style jsx>{`
        
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInFromLeft 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInFromRight 0.6s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 " data-animate id="page-header">
          <div
            className={`transition-all duration-700 ${
              isVisible["page-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex justify-center">
              <h1 className="text-center text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Discover Your Style
                </span>
              </h1>
            </div>

            <p className="text-lg text-gray-600 mb-6 text-center">
              Explore our AI-curated collection of fashion items tailored just for you
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl shadow-lg sticky top-4 overflow-hidden">
              {/* Filter Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900">Filters</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setFilters({
                          category: [],
                          brand: [],
                          size: [],
                          color: [],
                          priceRange: [0, 1000],
                          rating: 0,
                          discount: 0,
                        })
                        setAppliedFilters({
                          category: [],
                          brand: [],
                          size: [],
                          color: [],
                          priceRange: [0, 1000],
                          rating: 0,
                          discount: 0,
                        })
                      }}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-300"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Content */}
              <div>
                {/* Category Filter - Now Collapsible */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setIsFiltersExpanded((prev) => ({ ...prev, category: !prev.category }))}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="font-medium text-gray-900">Category</h3>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isFiltersExpanded.category ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isFiltersExpanded.category && (
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {filterOptions.categories.map((category) => {
                          const count = products.filter((p) => p.category === category).length
                          return (
                            <label key={category} className="flex items-center justify-between cursor-pointer group">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={filters.category.includes(category)}
                                  onChange={() => handleFilterChange("category", category)}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                  {category}
                                </span>
                              </div>
                              <span className="text-gray-400 text-sm">({count})</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

              
                {/* Brand Filter */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setIsFiltersExpanded((prev) => ({ ...prev, brand: !prev.brand }))}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="font-medium text-gray-900">Brand</h3>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isFiltersExpanded.brand ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isFiltersExpanded.brand && (
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {filterOptions.brands.map((brand) => {
                          const count = products.filter((p) => p.brand === brand).length
                          return (
                            <label key={brand} className="flex items-center justify-between cursor-pointer group">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={filters.brand.includes(brand)}
                                  onChange={() => handleFilterChange("brand", brand)}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                  {brand}
                                </span>
                              </div>
                              <span className="text-gray-400 text-sm">({count})</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>                
              </div>

              {/* Filter Action Buttons */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-lg">
              <div className="flex flex-col gap-4">
                {/* Search Bar Row */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products, brands, or descriptions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Camera Search Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSearch}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-search"
                    />
                    <label
                      htmlFor="image-search"
                      className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                      title="Search by image"
                    >
                      <Camera className="w-5 h-5" />
                    </label>
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowFilters(true)}
                      className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>

                    <span className="text-gray-600">
                      {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""}{" "}
                      found
                      {searchQuery && <span className="ml-2 text-purple-600">for "{searchQuery}"</span>}
                      {imageSearchFile && <span className="ml-2 text-pink-600">• Image search active</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="popularity">Most Popular</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                      </select>
                      <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          viewMode === "grid"
                            ? "bg-white shadow-md text-purple-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          viewMode === "list"
                            ? "bg-white shadow-md text-purple-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(appliedFilters.category.length > 0 ||
                  appliedFilters.brand.length > 0 ||
                  appliedFilters.color.length > 0 ||
                  appliedFilters.rating > 0 ||
                  appliedFilters.discount > 0 ||
                  appliedFilters.priceRange[1] < 1000) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">Active filters:</span>

                    {appliedFilters.category.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                      >
                        {category}
                        <button
                          onClick={() => {
                            const newFilters = {
                              ...appliedFilters,
                              category: appliedFilters.category.filter((c) => c !== category),
                            }
                            setAppliedFilters(newFilters)
                            setFilters(newFilters)
                          }}
                          className="hover:text-purple-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {appliedFilters.brand.map((brand) => (
                      <span
                        key={brand}
                        className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs"
                      >
                        {brand}
                        <button
                          onClick={() => {
                            const newFilters = {
                              ...appliedFilters,
                              brand: appliedFilters.brand.filter((b) => b !== brand),
                            }
                            setAppliedFilters(newFilters)
                            setFilters(newFilters)
                          }}
                          className="hover:text-pink-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {appliedFilters.priceRange[1] < 1000 && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Under ${appliedFilters.priceRange[1]}
                        <button
                          onClick={() => {
                            const newFilters = { ...appliedFilters, priceRange: [0, 1000] }
                            setAppliedFilters(newFilters)
                            setFilters(newFilters)
                          }}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {appliedFilters.rating > 0 && (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        {appliedFilters.rating}+ stars
                        <button
                          onClick={() => {
                            const newFilters = { ...appliedFilters, rating: 0 }
                            setAppliedFilters(newFilters)
                            setFilters(newFilters)
                          }}
                          className="hover:text-yellow-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {appliedFilters.discount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {appliedFilters.discount}%+ off
                        <button
                          onClick={() => {
                            const newFilters = { ...appliedFilters, discount: 0 }
                            setAppliedFilters(newFilters)
                            setFilters(newFilters)
                          }}
                          className="hover:text-green-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            <div
              className={`${
                viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
              }`}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  data-animate
                  id={`product-${product.id}`}
                  className={`group transition-all duration-700 ${
                    isVisible[`product-${product.id}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  {viewMode === "grid" ? (
                    // Grid View Card
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              New
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                              product.isWishlisted
                                ? "bg-red-500 text-white"
                                : "bg-white/80 text-gray-600 hover:text-red-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${product.isWishlisted ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={() => handleQuickView(product.id)}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating}</span>
                            <span className="text-sm text-gray-400">({product.reviews})</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    // List View Card
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                      <div className="flex">
                        <div className="relative w-48 h-48 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNew && (
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                New
                              </span>
                            )}
                            {product.discount > 0 && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">{product.rating}</span>
                                  <span className="text-sm text-gray-400">({product.reviews})</span>
                                </div>
                              </div>

                              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                                {product.name}
                              </h3>

                              <p className="text-gray-600 mb-4">{product.description}</p>

                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                                  product.isWishlisted
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:text-red-500"
                                }`}
                              >
                                <Heart className={`w-5 h-5 ${product.isWishlisted ? "fill-current" : ""}`} />
                              </button>
                              <button
                                onClick={() => handleQuickView(product.id)}
                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
                            </button>

                            {/* <button
                              onClick={() => handleSeeProduct(product)}
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-5 h-5" />
                              See Product
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredAndSortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreProducts}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Load More Products
                    </>
                  )}
                </button>
              </div>
            )}

            {/* No Products Found */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        category: [],
                        brand: [],
                        size: [],
                        color: [],
                        priceRange: [0, 1000],
                        rating: 0,
                        discount: 0,
                      })
                    }
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        isOpen={isProductDetailsOpen}
        onClose={closeProductDetails}
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
      />

      <Footer />
    </div>
    </>
  )
}

export default ProductPage
