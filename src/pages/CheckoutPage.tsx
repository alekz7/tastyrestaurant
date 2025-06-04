import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/constants';
import { Clock, MapPin } from 'lucide-react';
import axios from 'axios';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, location, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState<string>('');

  // Calculate the earliest possible pickup time (30 minutes from now)
  const getMinPickupTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  // Calculate the latest possible pickup time (end of current day)
  const getMaxPickupTime = () => {
    const now = new Date();
    now.setHours(22, 0, 0); // Set to 10 PM
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      setError('Please select a pickup location');
      return;
    }

    if (!pickupTime) {
      setError('Please select a pickup time');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const orderData = {
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          notes: item.notes
        })),
        location,
        pickupTime: new Date(pickupTime).toISOString()
      };

      const response = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      clearCart();
      navigate(`/order-confirmation/${response.data._id}`);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.menuItem.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    {item.notes && (
                      <p className="text-sm text-gray-500">Notes: {item.notes}</p>
                    )}
                  </div>
                  <p className="font-medium">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  ${(totalPrice + totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Pickup Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Pickup Details</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Pickup Location</h3>
                <div className="bg-gray-50 p-4 rounded-md flex items-start">
                  <MapPin className="text-primary-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="font-medium">
                      {location === 'downtown' ? 'Downtown Location' : 'Uptown Location'}
                    </p>
                    <p className="text-gray-600">
                      {location === 'downtown' ? '123 Main Street' : '456 Park Avenue'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pickup Time */}
              <div className="mb-8">
                <label htmlFor="pickupTime" className="block text-lg font-medium mb-4">
                  Select Pickup Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="datetime-local"
                    id="pickupTime"
                    name="pickupTime"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min={getMinPickupTime()}
                    max={getMaxPickupTime()}
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Please allow at least 30 minutes for order preparation
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-md font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;