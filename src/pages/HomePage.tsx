import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
            Delicious Food, <br /> Delivered Fresh
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Order your favorite meals for pickup at our Downtown or Uptown locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/menu" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              Order Now
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <a 
              href="#locations" 
              className="bg-white hover:bg-gray-100 text-primary-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Our Locations
            </a>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Popular Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try our most loved dishes, prepared with the freshest ingredients and bursting with flavor.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Item 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Grilled Salmon" 
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Grilled Salmon</h3>
                  <span className="text-primary-700 font-bold">$18.99</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Fresh Atlantic salmon, grilled to perfection and served with seasonal vegetables.
                </p>
                <Link 
                  to="/menu" 
                  className="block text-center mt-4 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </div>
            
            {/* Featured Item 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Pasta Carbonara" 
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Pasta Carbonara</h3>
                  <span className="text-primary-700 font-bold">$15.99</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Creamy pasta with pancetta, eggs, Parmesan cheese, and freshly ground black pepper.
                </p>
                <Link 
                  to="/menu" 
                  className="block text-center mt-4 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </div>
            
            {/* Featured Item 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Chocolate Cake" 
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Chocolate Cake</h3>
                  <span className="text-primary-700 font-bold">$8.99</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Rich and moist chocolate cake with a decadent ganache frosting.
                </p>
                <Link 
                  to="/menu" 
                  className="block text-center mt-4 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/menu" 
              className="inline-flex items-center text-primary-700 font-medium hover:text-primary-800"
            >
              View Full Menu
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a variety of services to meet your needs, whether you're ordering for yourself or your company.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Individual Orders */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Individual Orders</h3>
              <p className="text-gray-600">
                Browse our menu and place your order for pickup at either of our convenient locations.
              </p>
            </div>
            
            {/* Company Orders */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Company Orders</h3>
              <p className="text-gray-600">
                Place bulk orders for your team or event. Company representatives can easily manage orders.
              </p>
            </div>
            
            {/* Scheduled Pickup */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scheduled Pickup</h3>
              <p className="text-gray-600">
                Schedule your order for pickup at a specific time, so it's ready when you arrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at one of our two convenient locations or order online for pickup.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Downtown Location */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64">
                <img 
                  src="https://images.pexels.com/photos/3952104/pexels-photo-3952104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Downtown Location" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Downtown Location</h3>
                <p className="text-gray-600 mb-4">
                  123 Main Street<br />
                  Open Daily: 8AM - 10PM
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-700 font-medium hover:text-primary-800 inline-flex items-center"
                >
                  Get Directions
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            {/* Uptown Location */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64">
                <img 
                  src="https://images.pexels.com/photos/2277653/pexels-photo-2277653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Uptown Location" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Uptown Location</h3>
                <p className="text-gray-600 mb-4">
                  456 Park Avenue<br />
                  Open Daily: 8AM - 10PM
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-700 font-medium hover:text-primary-800 inline-flex items-center"
                >
                  Get Directions
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse our menu and place your order for pickup at your preferred location.
          </p>
          <Link 
            to="/menu" 
            className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center"
          >
            Order Now
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;