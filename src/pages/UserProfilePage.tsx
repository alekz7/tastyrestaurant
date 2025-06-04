import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/constants';
import { Clock, MapPin } from 'lucide-react';
import axios from 'axios';

interface Order {
  id: string;
  items: Array<{
    menuItem: {
      name: string;
      price: number;
    };
    quantity: number;
    notes?: string;
  }>;
  totalPrice: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  location: 'downtown' | 'uptown';
  pickupTime: string;
  createdAt: string;
}

const UserProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Profile</h1>
        <div className="text-gray-600">
          <p className="mb-1">Name: {user?.name}</p>
          <p className="mb-1">Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Order History</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(order.status)}`} />
                    <span className="text-sm font-medium capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <MapPin className="text-primary-600 mt-1 mr-2" size={20} />
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-gray-600">
                        {order.location === 'downtown' ? '123 Main Street' : '456 Park Avenue'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="text-primary-600 mt-1 mr-2" size={20} />
                    <div>
                      <p className="font-medium">Pickup Time</p>
                      <p className="text-gray-600">
                        {new Date(order.pickupTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p>{item.menuItem.name}</p>
                          {item.notes && (
                            <p className="text-sm text-gray-500">Note: {item.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">
                            {item.quantity} × ${item.menuItem.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;