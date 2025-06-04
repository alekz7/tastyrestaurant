import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, Clock, Download } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface OrderItem {
  menuItem: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  location: 'downtown' | 'uptown';
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupTime: string;
  createdAt: string;
  isCompanyOrder: boolean;
  company?: {
    name: string;
  };
  childOrders?: Order[];
}

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const generatePDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Order Receipt', 20, 20);
    
    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 35);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 45);
    doc.text(`Location: ${order.location === 'downtown' ? 'Downtown' : 'Uptown'}`, 20, 55);
    doc.text(`Pickup Time: ${new Date(order.pickupTime).toLocaleTimeString()}`, 20, 65);
    
    // Add items table
    const tableData = order.items.map(item => [
      item.menuItem.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 75,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: tableData,
    });
    
    // Add total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Total: $${order.totalPrice.toFixed(2)}`, 150, finalY);
    
    // Save PDF
    doc.save(`order-${order.id}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <Link 
            to="/menu" 
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Your order #{order.id.slice(-6)} has been received and is being processed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start mb-4">
              <MapPin size={24} className="text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pickup Location</h3>
                <p className="text-gray-600">
                  {order.location === 'downtown' ? (
                    '123 Main Street, Downtown'
                  ) : (
                    '456 Park Avenue, Uptown'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock size={24} className="text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pickup Time</h3>
                <p className="text-gray-600">
                  {new Date(order.pickupTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  ['pending', 'preparing', 'ready', 'completed'].includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`} />
                <span className="text-gray-600">Order Received</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  ['preparing', 'ready', 'completed'].includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`} />
                <span className="text-gray-600">Preparing</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  ['ready', 'completed'].includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`} />
                <span className="text-gray-600">Ready for Pickup</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  order.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`} />
                <span className="text-gray-600">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          
          {order.isCompanyOrder && order.company && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-600">
                Company Order for: <span className="font-medium">{order.company.name}</span>
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div 
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.menuItem.name}</p>
                  {item.notes && (
                    <p className="text-sm text-gray-500">Note: {item.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{item.quantity} × ${item.price.toFixed(2)}</p>
                  <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(order.totalPrice / 1.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Tax (8%)</span>
                <span>${(order.totalPrice - order.totalPrice / 1.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {order.childOrders && order.childOrders.length > 0 && (
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-semibold mb-4">Individual Orders</h3>
            <div className="space-y-4">
              {order.childOrders.map((childOrder, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Order #{childOrder.id.slice(-6)}</h4>
                  <p className="text-gray-600 mb-2">
                    Total: ${childOrder.totalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => generatePDF()}
                    className="text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Download size={16} className="mr-1" />
                    Download Receipt
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={generatePDF}
            className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Download Receipt
          </button>
          <Link 
            to="/menu" 
            className="inline-flex items-center justify-center bg-white text-primary-700 border border-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Place Another Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;