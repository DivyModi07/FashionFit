import { useState, useEffect } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Truck,
  Shield,
  Star,
  Edit,
  Plus,
  Wallet,
  Smartphone,
  Building,
  CheckCircle,
  Package,
  Calendar,
  Clock,
} from "lucide-react"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Animation from '../components/Animation'
import { placeOrder } from "../api/order"; 
import axios from 'axios';

const Checkout = ({
  cartItems,
  calculateTotal,
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  appliedPromo,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [errorMessage, setErrorMessage] = useState(""); 

  // New state for payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [upiId, setUpiId] = useState("")

  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const user = response.data;
        if (user.address) {
          const formattedAddress = {
            id: 1,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            phone: user.phone || "",
            address: user.address,
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipcode || "",
            isDefault: true,
            type: "Home",
          };
          setAddresses([formattedAddress]);
          setSelectedAddress(formattedAddress);
        }
      } catch (error) {
        console.error("Failed to fetch user address:", error);
      }
    };

    fetchUserAddress();
  }, []);


  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    type: "Home",
  })

    const paymentMethods = [
    {
      id: 1,
      type: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa,Rupay",
    },
    {
      id: 2,
      type: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "Pay using UPI ID or QR code",
    },
    {
      id: 4,
      type: "cashondelivery",
      name: "Cash on delivery",
      icon: Building,
      description: "All india cash on delivery supported",
    },
  ]

  const stepTitles = [
    'Address',
    'Payment',
    'Review'
  ];

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0]
      setSelectedAddress(defaultAddress)
    }
  }, [addresses])

  const steps = [
    { id: 1, name: "Address", icon: MapPin },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Check },
  ]

  const handleAddAddress = () => {
    if (
      newAddress.name &&
      newAddress.phone &&
      newAddress.address &&
      newAddress.city &&
      newAddress.state &&
      newAddress.zipCode
    ) {
      const address = {
        ...newAddress,
        id: addresses.length + 1,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, address])
      setSelectedAddress(address)
      setNewAddress({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        type: "Home",
      })
      setShowAddAddress(false)
    }
  }

  const isPaymentValid = () => {
    if (!selectedPayment) return false

    if (selectedPayment.type === "card") {
      return (
        cardDetails.cardNumber.length >= 16 &&
        cardDetails.expiryDate.length === 5 && // MM/YY
        cardDetails.cvv.length >= 3 &&
        cardDetails.cardholderName.trim() !== ""
      )
    } else if (selectedPayment.type === "upi") {
      return upiId.trim() !== "" && upiId.includes("@")
    }
    return true
  }
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setErrorMessage("Please select a shipping address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const formattedAddress = `${selectedAddress.name}\n${selectedAddress.address}\n${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}\nPhone: ${selectedAddress.phone}`;

    try {
      const orderData = await placeOrder({
        shipping_address: formattedAddress,
        billing_address: formattedAddress,
      });

      if (orderData) {
        setOrderId(orderData.id);
        setOrderPlaced(true);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }
  
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h1>

            <p className="text-xl text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-bold text-lg">#{orderId}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg text-green-600">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Delivery Address:</span>
                <span className="font-medium text-right max-w-xs">
                  {selectedAddress?.name}
                  <br />
                  {selectedAddress?.address}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Processing</h3>
                <p className="text-sm text-gray-600">Order is being prepared</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <Truck className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Shipping</h3>
                <p className="text-sm text-gray-600">2-3 business days</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Expected by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/homepage")}
                className="border-2 border-purple-500 text-purple-500 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100  mt-[60px]">
        <Animation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back 
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Checkout</span>
          </h1>
        <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex items-center justify-between">
                      {stepTitles.map((title, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                            index + 1 <= currentStep 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {index + 1 < currentStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
                          </div>
                          <div className="ml-4 hidden md:block">
                            <div className={`text-sm font-medium ${
                              index + 1 <= currentStep ? 'text-purple-600' : 'text-gray-500'
                            }`}>
                              Step {index + 1}
                            </div>
                            <div className={`text-xs ${
                              index + 1 <= currentStep ? 'text-gray-700' : 'text-gray-400'
                            }`}>
                              {title}
                            </div>
                          </div>
                          {index < stepTitles.length - 1 && (
                            <div className={`hidden md:block w-24 h-0.5 mx-6 ${
                              index + 1 < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New Address
                  </button>
                </div>

                {showAddAddress && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <input type="tel" placeholder="Phone Number" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <input type="text" placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <input type="text" placeholder="ZIP Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <select value={newAddress.type} onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddAddress} className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors" > Save Address </button>
                      <button onClick={() => setShowAddAddress(false)} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors" > Cancel </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedAddress?.id === address.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{address.name}</h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-1">{address.phone}</p>
                          <p className="text-gray-600">
                            {address.address}, {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {selectedAddress?.id === address.id && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedAddress}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  Continue to Payment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedPayment?.id === method.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <method.icon className="w-6 h-6 text-purple-600 mr-3" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        {selectedPayment?.id === method.id && (
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPayment?.type === "card" && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Credit Card Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input type="text" placeholder="Card Number" value={cardDetails.cardNumber} onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) }) } className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" maxLength={16} />
                      <input type="text" placeholder="Cardholder Name" value={cardDetails.cardholderName} onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" value={cardDetails.expiryDate} onChange={(e) => { let value = e.target.value.replace(/\D/g, ""); if (value.length > 2) { value = value.slice(0, 2) + "/" + value.slice(2, 4); } setCardDetails({ ...cardDetails, expiryDate: value }); }} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" maxLength={5} />
                        <input type="text" placeholder="CVV" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }) } className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayment?.type === "upi" && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">UPI Details</h3>
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g., yourname@bank)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border-2 border-purple-500 text-purple-500 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!isPaymentValid()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    Review Order
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {renderStars(item.rating)}
                            <span className="text-sm text-gray-500 ml-2">({item.rating})</span>
                          </div>
                        </div>
                      <div className="text-right">                    
                        <div className="font-bold text-lg">₹{((item.price || item.finalPrice || item.initialPrice) * item.quantity).toFixed(2)}</div>
                  {(item.originalPrice || item.initialPrice) > (item.price || item.finalPrice) && (
                    <div className="text-sm text-gray-500 line-through">
                        ₹{(item.originalPrice || item.initialPrice * item.quantity).toFixed(2)}
                    </div>
                  )}
                  </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Change
                    </button>
                  </div>
                  {selectedAddress && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{selectedAddress.name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {selectedAddress.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{selectedAddress.phone}</p>
                      <p className="text-gray-600">
                        {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Change
                    </button>
                  </div>
                  {selectedPayment && (
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                      <selectedPayment.icon className="w-6 h-6 text-purple-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedPayment.name}</h3>
                        <p className="text-sm text-gray-600">{selectedPayment.description}</p>
                        {selectedPayment.type === "card" && (
                          <p className="text-xs text-gray-500 mt-1">
                            Card ending in {cardDetails.cardNumber.slice(-4)}
                          </p>
                        )}
                        {selectedPayment.type === "upi" && (
                          <p className="text-xs text-gray-500 mt-1">UPI ID: {upiId}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errorMessage && (
                    <div className="my-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        {errorMessage}
                    </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border-2 border-purple-500 text-purple-500 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" ></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" ></path>
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order • ₹{calculateTotal().toFixed(2)}
                        <CheckCircle className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">₹{(calculateSubtotal() || 0).toFixed(2)}</span>
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
                      <span className="text-purple-600">₹{(calculateTotal() || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Items in your order</h3>
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">+{cartItems.length - 3} more items</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default Checkout;