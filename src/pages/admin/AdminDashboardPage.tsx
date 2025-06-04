import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config/constants';
import { BarChart3, Users, Menu, FileText, ArrowRight } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  activeUsers: number;
  popularItems: Array<{
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    status: string;
    totalPrice: number;
    location: string;
    createdAt: string;
  }>;
  locationStats: {
    [key: string]: {
      orders: number;
      sales: number;
    };
  };
}

const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/reports/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timeframe,
          },
        });

        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token, timeframe]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'today'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTimeframe('today')}
          >
            Today
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </button>
        </div>
      </div>

      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                <BarChart3 className="text-primary-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-sm text-gray-500 mt-2">
                From {stats.locationStats.downtown?.orders || 0} locations
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
                <FileText className="text-primary-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalSales.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Average order: ${(stats.totalSales / stats.totalOrders).toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
                <Users className="text-primary-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              <p className="text-sm text-gray-500 mt-2">
                Orders per user: {(stats.totalOrders / stats.activeUsers).toFixed(1)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Popular Items</h3>
                <Menu className="text-primary-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.popularItems.length}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Top seller: {stats.popularItems[0]?.name}
              </p>
            </div>
          </div>

          {/* Location Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Downtown Location
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-medium">
                    {stats.locationStats.downtown?.orders || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-medium">
                    ${stats.locationStats.downtown?.sales.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Uptown Location
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-medium">
                    {stats.locationStats.uptown?.orders || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-medium">
                    ${stats.locationStats.uptown?.sales.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Popular Items</h3>
              <Link
                to="/admin/menu"
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                View All
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Item
                    </th>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Orders
                    </th>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.popularItems.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-4 px-4">{item.name}</td>
                      <td className="py-4 px-4">{item.orderCount}</td>
                      <td className="py-4 px-4">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              <Link
                to="/admin/orders"
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                View All
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Order ID
                    </th>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Location
                    </th>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Total
                    </th>
                    <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-4 px-4">#{order.id.slice(-6)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {order.location === 'downtown' ? 'Downtown' : 'Uptown'}
                      </td>
                      <td className="py-4 px-4">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;