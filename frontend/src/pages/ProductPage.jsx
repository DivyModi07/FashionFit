import { useState, useEffect } from "react"
import { Search, Heart, ShoppingCart, Filter, Grid, List, Star, X, Plus, Eye, ArrowUpDown, Camera } from "lucide-react"
import ProductDetails from "./ProductDetails.jsx"
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Animation from '../components/Animation.jsx'
import axios from "axios";

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
    priceRange: [0, 10000], 
    rating: 0,
    discount: 0,
  })
  const [appliedFilters, setAppliedFilters] = useState({
    category: [],
    brand: [],
    size: [],
    color: [],
    priceRange: [0, 10000],
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
const [products,setProducts]=useState([])

// Dynamically generate unique types from products for category filter
const availableTypes = Array.from(new Set(products.map(p => p.type).filter(Boolean))).sort();

// Dynamically generate unique brands from products for brand filter
const availableBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();

// Place filteredAndSortedProducts here so it is defined before useEffect
const filteredAndSortedProducts = products
  .filter((product) => {
    // Search query filter
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      console.log("Filtered by search:", product);
      return false;
    }
    // Category filter (now type)
    if (appliedFilters.category.length > 0 && !appliedFilters.category.includes(product.type)) {
      console.log("Filtered by type:", product, "applied:", appliedFilters.category, "product:", product.type);
      return false;
    }
    // Brand filter
    if (appliedFilters.brand.length > 0 && !appliedFilters.brand.includes(product.brand)) {
      console.log("Filtered by brand:", product, "applied:", appliedFilters.brand, "product:", product.brand);
      return false;
    }
    // Price range filter
    if (product.initialPrice < appliedFilters.priceRange[0] || product.initialPrice > appliedFilters.priceRange[1]) {
      console.log("Filtered by price:", product, "applied:", appliedFilters.priceRange, "product:", product.initialPrice);
      return false;
    }
    // Rating filter
    if (product.rating < appliedFilters.rating) {
      console.log("Filtered by rating:", product, "applied:", appliedFilters.rating, "product:", product.rating);
      return false;
    }
    // Discount filter
    if (product.discount < appliedFilters.discount) {
      console.log("Filtered by discount:", product, "applied:", appliedFilters.discount, "product:", product.discount);
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.initialPrice - b.initialPrice
      case "price-high":
        return b.initialPrice - a.initialPrice
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.isNew - a.isNew
      default:
        return b.reviews - a.reviews // popularity
    }
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/all/')
      .then(res => {
        console.log("✅ DATA FROM API:", res.data);
        const mapped = res.data.map((item, index) => {
          // Extract type from short_description (last word, lowercased)
          let type = '';
          if (item.short_description) {
            const words = item.short_description.trim().split(' ');
            type = words.length > 0 ? words[words.length - 1].toLowerCase() : '';
          }
          return {
            id: item.id || index,
            name: item.short_description || "No name",
            brand: item.brand_name,
            finalPrice: Number(item.final_price) || 0,
            initialPrice: Number(item.initial_price) || 0,
            isOnSale: !!item.is_on_sale,
            discount: item.is_on_sale ? parseInt(item.discount_label?.replace('% Off', '') || "0", 10) : 0,
            merchandiseLabel: item.merchandise_label || "",
            rating: 4.5, // Default rating since API doesn't provide
            reviews: Math.floor(Math.random() * 50) + 10, // Random reviews count
            reviewList: [], // Empty array since API doesn't provide
            image: item.model_image || "/placeholder.png",
            modelImage: item.model_image,
            cutoutImage: item.cutout_image,
            description: item.short_description || "",
            type, // new type field
            currency: item.currency || "USD",
            isWishlisted: false,
            stock: Number(item.stock_total) || 0,
            isCustomizable: !!item.is_customizable,
            brand_id: item.brand_id,
            merchant_id: item.merchant_id,
            product_id: item.product_id,
          };
        });
        console.log("✅ MAPPED PRODUCTS:", mapped);
        setProducts(mapped);
      })
      .catch(err => console.error("❌ Failed to fetch products:", err));
  }, []);

  
  // Filter options
// Filter options - Updated to match API data
const filterOptions = {
  categories: availableTypes, // now types like dress, sandals, etc.
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "One Size", "7", "8", "9", "10", "11", "28", "30", "32", "34"],
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
  }, [filteredAndSortedProducts]) // <-- add dependency so observer runs after products change

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
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('access_token');
    console.log('Token check in toggleWishlist:', !!token, 'Token length:', token?.length);
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    try {
      const { addToWishlist, removeFromWishlist, getWishlist } = await import('../api/wishlist');
      const product = products.find(p => p.id === productId);
      
      if (product?.isWishlisted) {
        // Find wishlist item ID and remove
        const wishlist = await getWishlist();
        const wishlistItem = wishlist.find(item => item.product.id === productId);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
        }
      } else {
        await addToWishlist(productId);
      }
      
      // Update local state
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, isWishlisted: !product.isWishlisted } : product)),
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Don't redirect here, let the API handle it
    }
  }

  // Handle add to cart
  const handleAddToCart = async (productId, options = {}) => {
    const token = localStorage.getItem('access_token');
    console.log('Token check in handleAddToCart:', !!token, 'Token length:', token?.length);
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    try {
      const { addToCart } = await import('../api/cart');
      await addToCart(productId, options.quantity || 1);
      console.log(`Added product ${productId} to cart`, options);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Don't redirect here, let the API handle it
    }
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

  // Handle image search
  const handleImageSearch = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setImageSearchFile(file)
      setIsLoading(true)
      
      try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await axios.post('http://127.0.0.1:8000/api/products/search_image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data.results) {
          const mapped = response.data.results.map((item, index) => {
            // Extract type from short_description (last word, lowercased)
            let type = '';
            if (item.short_description) {
              const words = item.short_description.trim().split(' ');
              type = words.length > 0 ? words[words.length - 1].toLowerCase() : '';
            }
            return {
              id: item.id || index,
              name: item.short_description || "No name",
              brand: item.brand_name,
              finalPrice: Number(item.final_price) || 0,
              initialPrice: Number(item.initial_price) || 0,
              isOnSale: !!item.is_on_sale,
              discount: item.is_on_sale ? parseInt(item.discount_label?.replace('% Off', '') || "0", 10) : 0,
              merchandiseLabel: item.merchandise_label || "",
              rating: 4.5, // Default rating since API doesn't provide
              reviews: Math.floor(Math.random() * 50) + 10, // Random reviews count
              reviewList: [], // Empty array since API doesn't provide
              image: item.model_image || "/placeholder.png",
              modelImage: item.model_image,
              cutoutImage: item.cutout_image,
              description: item.short_description || "",
              type, // new type field
              currency: item.currency || "USD",
              isWishlisted: false,
              stock: Number(item.stock_total) || 0,
              isCustomizable: !!item.is_customizable,
              brand_id: item.brand_id,
              merchant_id: item.merchant_id,
              product_id: item.product_id,
            };
          });
          setProducts(mapped)
        }
      } catch (error) {
        console.error('Image search error:', error)
        // Keep existing products if search fails
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
          <Navbar/>

    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">
      {/* Floating background elements */}
      <Animation />

      {/* Custom animations */}
      <style >{`
        
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
                          priceRange: [0, 10000], 
                          rating: 0,
                          discount: 0,
                        })
                        setAppliedFilters({
                          category: [],
                          brand: [],
                          size: [],
                          color: [],
                          priceRange: [0, 10000], // increased upper bound
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

              {/* Filter Content - make this scrollable if content is long */}
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                          const count = products.filter((p) => p.type === category).length
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
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
                        {availableBrands.map((brand) => {
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
                                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
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
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="image-search"
                      className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Search by image"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
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
                      {imageSearchFile && (
                        <span className="ml-2 text-pink-600 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Image search active
                          <button
                            onClick={() => {
                              setImageSearchFile(null)
                              // Reload original products
                              axios.get('http://127.0.0.1:8000/api/products/all/')
                                .then(res => {
                                  const mapped = res.data.map((item, index) => {
                                    let type = '';
                                    if (item.short_description) {
                                      const words = item.short_description.trim().split(' ');
                                      type = words.length > 0 ? words[words.length - 1].toLowerCase() : '';
                                    }
                                    return {
                                      id: item.id || index,
                                      name: item.short_description || "No name",
                                      brand: item.brand_name,
                                      finalPrice: Number(item.final_price) || 0,
                                      initialPrice: Number(item.initial_price) || 0,
                                      isOnSale: !!item.is_on_sale,
                                      discount: item.is_on_sale ? parseInt(item.discount_label?.replace('% Off', '') || "0", 10) : 0,
                                      merchandiseLabel: item.merchandise_label || "",
                                      rating: 4.5,
                                      reviews: Math.floor(Math.random() * 50) + 10,
                                      reviewList: [],
                                      image: item.model_image || "/placeholder.png",
                                      modelImage: item.model_image,
                                      cutoutImage: item.cutout_image,
                                      description: item.short_description || "",
                                      type,
                                      currency: item.currency || "USD",
                                      isWishlisted: false,
                                      stock: Number(item.stock_total) || 0,
                                      isCustomizable: !!item.is_customizable,
                                      brand_id: item.brand_id,
                                      merchant_id: item.merchant_id,
                                      product_id: item.product_id,
                                    };
                                  });
                                  setProducts(mapped);
                                })
                                .catch(err => console.error("❌ Failed to fetch products:", err));
                            }}
                            className="text-pink-600 hover:text-pink-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
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
                  appliedFilters.priceRange[1] < 10000) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">Active filters:</span>

                    {appliedFilters.category.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
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
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
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

                    {appliedFilters.priceRange[1] < 10000 && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Under ${appliedFilters.priceRange[1]}
                        <button
                          onClick={() => {
                            const newFilters = { ...appliedFilters, priceRange: [0, 10000] }
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
                    <div
                      className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group min-h-[380px] flex flex-col cursor-pointer"
                      onClick={() => handleSeeProduct(product)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Merchandise Label Badge */}
                        {product.merchandiseLabel && (
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
                            {product.merchandiseLabel}
                          </span>
                        )}
                        {/* Discount Badge (only if on sale) */}
                        {product.isOnSale && product.discount > 0 && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                            -{product.discount}%
                          </span>
                        )}
                        {/* Quick Actions */}
                        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button
                            onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
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
                            onClick={e => {
                              e.stopPropagation();
                              handleAddToCart(product.id, { price: product.isOnSale ? product.finalPrice : product.initialPrice });
                            }}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        {/* Brand name below image */}
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                          {product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}
                        </h3>
                        {/* Description below brand */}
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        {/* Price below description */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {product.isOnSale ? (
                              <>
                                <span className="text-lg font-bold text-red-600">${product.finalPrice}</span>
                                <span className="text-sm text-gray-500 line-through">${product.initialPrice}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">${product.initialPrice}</span>
                            )}
                          </div>
                        </div>
                        {/* Buy Now Button */}
                        <button
                          className="mt-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 font-medium"
                          onClick={e => { e.stopPropagation(); /* Add buy now logic here */ }}
                        >
                          Buy Now
                        </button>
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
                        priceRange: [0, 10000], // increased upper bound
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
        onAddToCart={(id, options) => handleAddToCart(id, { ...options, price: selectedProduct?.isOnSale ? selectedProduct?.finalPrice : selectedProduct?.initialPrice })}
        onToggleWishlist={toggleWishlist}
      />

      <Footer />
    </div>
    </>
  )
}

export default ProductPage;







