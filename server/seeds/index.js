import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

// Seed menu items
const menuItems = [
  {
    name: 'Grilled Salmon',
    description:
      'Fresh Atlantic salmon, grilled to perfection and served with seasonal vegetables.',
    price: 18.99,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Pasta Carbonara',
    description:
      'Creamy pasta with pancetta, eggs, Parmesan cheese, and freshly ground black pepper.',
    price: 15.99,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, Parmesan cheese, and our homemade Caesar dressing.',
    price: 9.99,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake with a decadent ganache frosting.',
    price: 8.99,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Fish and Chips',
    description: 'Beer-battered cod fillets served with crispy fries and tartar sauce.',
    price: 16.99,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/4409273/pexels-photo-4409273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Garlic Bread',
    description: 'Freshly baked bread topped with garlic butter and herbs.',
    price: 5.99,
    category: 'Starters',
    image:
      'https://images.pexels.com/photos/1082343/pexels-photo-1082343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Tiramisu',
    description:
      'Classic Italian dessert made with coffee-soaked ladyfingers and mascarpone cream.',
    price: 7.99,
    category: 'Desserts',
    image:
      'https://images.pexels.com/photos/6133303/pexels-photo-6133303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Veggie Burger',
    description: 'Plant-based patty with lettuce, tomato, and special sauce on a brioche bun.',
    price: 14.99,
    category: 'Main Course',
    image:
      'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Seed companies
const companies = [
  {
    name: 'Acme Corp',
    contact: {
      name: 'John Doe',
      email: 'john@acmecorp.com',
      phone: '555-123-4567'
    },
    address: {
      street: '123 Business St',
      city: 'Cityville',
      state: 'ST',
      zip: '12345'
    }
  },
  {
    name: 'TechStart Inc',
    contact: {
      name: 'Jane Smith',
      email: 'jane@techstart.com',
      phone: '555-987-6543'
    },
    address: {
      street: '456 Innovation Ave',
      city: 'Techtown',
      state: 'ST',
      zip: '54321'
    }
  }
];

// Seed users
const seedUsers = async (companyIds) => {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      // password: 'password123',
      password: '$2a$10$87GHiHoo..ifuMHhIel6VuWRddMonAkw3TqD1hx8iz0hCK3Klj8.i', // hashed password for 'password123'
      role: 'admin'
    },
    {
      name: 'Staff User',
      email: 'staff@example.com',
      // password: 'password123',
      password: '$2a$10$87GHiHoo..ifuMHhIel6VuWRddMonAkw3TqD1hx8iz0hCK3Klj8.i', // hashed password for 'password123',
      role: 'staff'
    },
    {
      name: 'Regular Customer',
      email: 'customer@example.com',
      // password: 'password123',
      password: '$2a$10$87GHiHoo..ifuMHhIel6VuWRddMonAkw3TqD1hx8iz0hCK3Klj8.i', // hashed password for 'password123',
      role: 'customer'
    },
    {
      name: 'Acme Rep',
      email: 'rep@acmecorp.com',
      // password: 'password123',
      password: '$2a$10$87GHiHoo..ifuMHhIel6VuWRddMonAkw3TqD1hx8iz0hCK3Klj8.i', // hashed password for 'password123',
      role: 'company',
      company: companyIds[0]
    },
    {
      name: 'TechStart Rep',
      email: 'rep@techstart.com',
      // password: 'password123',
      password: '$2a$10$87GHiHoo..ifuMHhIel6VuWRddMonAkw3TqD1hx8iz0hCK3Klj8.i', // hashed password for 'password123',
      role: 'company',
      company: companyIds[1]
    }
  ];

  await User.insertMany(users);
};

export const seedDatabase = async () => {
  try {
    // Clear existing data
    await MenuItem.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});

    // Seed menu items
    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully');

    // Seed companies
    const createdCompanies = await Company.insertMany(companies);
    const companyIds = createdCompanies.map((company) => company._id);
    console.log('Companies seeded successfully');

    // Seed users
    await seedUsers(companyIds);
    console.log('Users seeded successfully');

    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};
