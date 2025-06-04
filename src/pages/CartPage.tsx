import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItem from '../components/cart/CartItem';
import { Info, ArrowRight, ShoppingCart } from 'lucide-react';

const CartPage: React.FC = () => {
  const { items, totalPrice, location, setLocation } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedLocation, setSelectedLocation] = useState<'downtown' | 'uptown' | null>(location);
  const [locationError, setLocationError] = useState<boolean>(false);

  const handleProceedToCheckout = () => {
    if (!selectedLocation) {
      setLocationError(true);
      return;
    }
    
    setLocation(selectedLocation);
    
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const handleLocationChange = (location: 'downtown' | 'uptown') => {
    setSelectedLocation(location);
    setLocationError(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="mb-6 flex justify-center">
            <ShoppingCart size={64} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/menu" 
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Browse Menu
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {items.map(item => (
              <CartItem
                key={item.menuItem.id}
                id={item.menuItem.id}
                name={item.menuItem.name}
                price={item.menuItem.price}
                image={item.menuItem.image}
                quantity={item.quantity}
                notes={item.notes}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="mb-6">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 font-semibold">
                <span>Total</span>
                <span>${(totalPrice + totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Pickup Location</h3>
              <div className="space-y-3">
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-colors ${
                    selectedLocation === 'downtown' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleLocationChange('downtown')}
                >
                  <h4 className="font-medium">Downtown</h4>
                  <p className="text-sm text-gray-600">123 Main Street</p>
                </div>
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-colors ${
                    selectedLocation === 'uptown' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleLocationChange('uptown')}
                >
                  <h4 className="font-medium">Uptown</h4>
                  <p className="text-sm text-gray-600">456 Park Avenue</p>
                </div>
              </div>
              {locationError && (
                <div className="mt-2 text-red-600 text-sm flex items-center">
                  <Info size={16} className="mr-1" />
                  Please select a pickup location
                </div>
              )}
            </div>
            
            <button 
              className="w-full bg-primary-600 text-white py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4">
              <Link 
                to="/menu" 
                className="inline-block text-center w-full text-primary-600 hover:text-primary-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;