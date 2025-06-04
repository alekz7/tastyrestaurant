import React, { createContext, useState, useContext, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

interface CartContextType {
  items: CartItem[];
  companyOrderId: string | null;
  isCompanyOrder: boolean;
  location: 'downtown' | 'uptown' | null;
  addItem: (menuItem: MenuItem, quantity: number, notes: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  setCompanyOrderId: (id: string | null) => void;
  setIsCompanyOrder: (isCompany: boolean) => void;
  setLocation: (location: 'downtown' | 'uptown' | null) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [companyOrderId, setCompanyOrderId] = useState<string | null>(null);
  const [isCompanyOrder, setIsCompanyOrder] = useState<boolean>(false);
  const [location, setLocation] = useState<'downtown' | 'uptown' | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart.items || []);
        setCompanyOrderId(parsedCart.companyOrderId || null);
        setIsCompanyOrder(parsedCart.isCompanyOrder || false);
        setLocation(parsedCart.location || null);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartData = {
      items,
      companyOrderId,
      isCompanyOrder,
      location
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
  }, [items, companyOrderId, isCompanyOrder, location]);

  const addItem = (menuItem: MenuItem, quantity: number, notes: string) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.menuItem.id === menuItem.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          notes: notes || updatedItems[existingItemIndex].notes
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { menuItem, quantity, notes }];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.menuItem.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const updateNotes = (itemId: string, notes: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.menuItem.id === itemId 
          ? { ...item, notes } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCompanyOrderId(null);
    setIsCompanyOrder(false);
    setLocation(null);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        companyOrderId,
        isCompanyOrder,
        location,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        setCompanyOrderId,
        setIsCompanyOrder,
        setLocation,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};