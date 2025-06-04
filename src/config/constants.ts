// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  CART: 'cart',
};

// Tailwind Colors
export const COLORS = {
  primary: {
    50: '#F9F5F5',
    100: '#F2E5E5',
    200: '#E6CCCC',
    300: '#D9B3B3',
    400: '#C99999',
    500: '#B98080',
    600: '#8B0000', // Dark Red (Burgundy)
    700: '#7A0000',
    800: '#690000',
    900: '#580000',
  },
  secondary: {
    500: '#DAA520', // Gold
  },
  accent: {
    500: '#2E8B57', // Sea Green
  },
};

// Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
  COMPANY: 'company',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Locations
export const LOCATIONS = {
  DOWNTOWN: 'downtown',
  UPTOWN: 'uptown',
};