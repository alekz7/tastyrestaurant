import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MenuItem from '../components/menu/MenuItem';
import MenuCategoryFilter from '../components/menu/MenuCategoryFilter';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Temporary mock data
const mockMenuItems: MenuItemType[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon, grilled to perfection and served with seasonal vegetables.',
    price: 18.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with pancetta, eggs, Parmesan cheese, and freshly ground black pepper.',
    price: 15.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, Parmesan cheese, and our homemade Caesar dressing.',
    price: 9.99,
    category: 'Starters',
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake with a decadent ganache frosting.',
    price: 8.99,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '5',
    name: 'Fish and Chips',
    description: 'Beer-battered cod fillets served with crispy fries and tartar sauce.',
    price: 16.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/4409273/pexels-photo-4409273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '6',
    name: 'Garlic Bread',
    description: 'Freshly baked bread topped with garlic butter and herbs.',
    price: 5.99,
    category: 'Starters',
    image: 'https://images.pexels.com/photos/1082343/pexels-photo-1082343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '7',
    name: 'Tiramisu',
    description: 'Classic Italian dessert made with coffee-soaked ladyfingers and mascarpone cream.',
    price: 7.99,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/6133303/pexels-photo-6133303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '8',
    name: 'Veggie Burger',
    description: 'Plant-based patty with lettuce, tomato, and special sauce on a brioche bun.',
    price: 14.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(mockMenuItems);
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>(mockMenuItems);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        // Uncomment below when backend is ready
        // const response = await axios.get(`${API_URL}/api/menu-items`);
        // setMenuItems(response.data);
        // const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        
        // For now, use mock data
        setMenuItems(mockMenuItems);
        const uniqueCategories = [...new Set(mockMenuItems.map(item => item.category))];
        setCategories(uniqueCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    let results = menuItems;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      results = results.filter(item => item.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(results);
  }, [menuItems, activeCategory, searchQuery]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Our Menu</h1>
      
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <MenuCategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={handleCategorySelect} 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No menu items found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;