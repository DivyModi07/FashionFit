import React, { useState, useEffect } from 'react';
import { User, Lock, Save, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Animation from '../components/Animation';
import axios from 'axios';

const Notification = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed top-20 right-5 z-[100] bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg flex items-center gap-3">
      <CheckCircle className="w-6 h-6" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

const AccountSettingsPage = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserData(prev => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      // Don't send an empty password field if it wasn't changed
      const dataToUpdate = { ...userData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }
      
      await axios.put('http://127.0.0.1:8000/api/users/profile/', dataToUpdate, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showNotification("Profile updated successfully!");
      // Clear password field after submission for security
      setUserData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error("Failed to update profile:", error);
      showNotification("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading account details...</p>;
  }

  return (
    <>
      <Navbar />
      <Notification message={notification.message} show={notification.show} />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-[60px]">
        <Animation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <User className="w-10 h-10 inline mr-4 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Account Settings
              </span>
            </h1>
            <p className="text-xl text-gray-600">Manage your profile and contact information</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="first_name" value={userData.first_name || ''} onChange={handleChange} placeholder="First Name" className="w-full px-4 py-3 border rounded-lg" />
                    <input type="text" name="last_name" value={userData.last_name || ''} onChange={handleChange} placeholder="Last Name" className="w-full px-4 py-3 border rounded-lg" />
                    <input type="email" name="email" value={userData.email || ''} disabled className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
                    <input type="tel" name="phone" value={userData.phone || ''} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="address" value={userData.address || ''} onChange={handleChange} placeholder="Street Address" className="md:col-span-2 w-full px-4 py-3 border rounded-lg" />
                    <input type="text" name="city" value={userData.city || ''} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 border rounded-lg" />
                    <input type="text" name="state" value={userData.state || ''} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 border rounded-lg" />
                    <input type="text" name="zipcode" value={userData.zipcode || ''} onChange={handleChange} placeholder="ZIP Code" className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Change Password</h2>
                  <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Enter new password (optional)" className="w-full px-4 py-3 border rounded-lg" />
                </div>
              </div>

              <div className="mt-8 text-right">
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50">
                  <Save className="w-5 h-5 inline mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;