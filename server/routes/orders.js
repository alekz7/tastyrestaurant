import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  [
    authenticate,
    body('items', 'Items are required').isArray(),
    body('items.*.menuItemId', 'Menu item ID is required').not().isEmpty(),
    body('items.*.quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
    body('location', 'Location is required').isIn(['downtown', 'uptown']),
    body('pickupTime', 'Pickup time is required').optional().isISO8601()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, location, pickupTime, companyOrderId, isCompanyOrder } = req.body;

    try {
      // Get menu items to calculate correct prices
      const itemIds = items.map(item => item.menuItemId);
      const menuItems = await MenuItem.find({ _id: { $in: itemIds } });
      
      // Map menu items by ID for easy lookup
      const menuItemsMap = menuItems.reduce((acc, item) => {
        acc[item._id.toString()] = item;
        return acc;
      }, {});
      
      // Check if all items exist
      if (menuItems.length !== itemIds.length) {
        return res.status(400).json({ message: 'One or more menu items do not exist' });
      }
      
      // Create order items with correct prices
      const orderItems = items.map(item => {
        const menuItem = menuItemsMap[item.menuItemId];
        return {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          notes: item.notes || ''
        };
      });
      
      // Calculate total price
      const totalPrice = orderItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      // Create order object
      const orderData = {
        user: req.user.id,
        items: orderItems,
        totalPrice,
        location,
        pickupTime: pickupTime || undefined,
        isCompanyOrder: isCompanyOrder || false
      };
      
      // If this is part of a company order
      if (companyOrderId) {
        const parentOrder = await Order.findById(companyOrderId);
        
        if (!parentOrder) {
          return res.status(404).json({ message: 'Parent company order not found' });
        }
        
        orderData.company = parentOrder.company;
        orderData.parentOrder = parentOrder._id;
      } else if (isCompanyOrder && req.user.role === 'company') {
        // If this is a new company order
        orderData.company = req.user.company;
      }
      
      const order = new Order(orderData);
      await order.save();
      
      // If this is a child order, update the parent order
      if (companyOrderId) {
        await Order.findByIdAndUpdate(
          companyOrderId,
          { $push: { childOrders: order._id } }
        );
      }
      
      res.json(order);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/orders
// @desc    Get all orders for the authenticated user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { role, id, company } = req.user;
    let query = {};
    
    if (role === 'customer') {
      // Regular customers see their own orders
      query = { user: id };
    } else if (role === 'company') {
      // Company representatives see company orders
      query = { 
        $or: [
          { company: company, isCompanyOrder: true },
          { user: id }
        ]
      };
    } else if (role === 'staff') {
      // Staff see all orders for their location
      // This assumes staff have a 'location' field, which you might need to add
      query = {}; // All orders for now
    } else if (role === 'admin') {
      // Admins see all orders
      query = {};
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('company', 'name')
      .populate('childOrders');
    
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('company', 'name')
      .populate({
        path: 'childOrders',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user has permission to view this order
    const { role, id, company } = req.user;
    
    if (
      role === 'customer' && 
      order.user._id.toString() !== id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    if (
      role === 'company' && 
      order.company?._id.toString() !== company?.toString() &&
      order.user._id.toString() !== id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/orders/:id
// @desc    Update order status
// @access  Private (Staff & Admin)
router.put(
  '/:id',
  [
    authenticate,
    authorize('staff', 'admin'),
    body('status', 'Status is required').isIn([
      'pending',
      'preparing',
      'ready',
      'completed',
      'cancelled'
    ])
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      order.status = status;
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/orders/company/:id
// @desc    Get all orders for a company
// @access  Private (Company & Admin)
router.get('/company/:id', [authenticate, authorize('company', 'admin')], async (req, res) => {
  try {
    const { role, company } = req.user;
    
    // If company user, ensure they're querying their own company
    if (role === 'company' && company.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view these orders' });
    }
    
    const orders = await Order.find({ 
      company: req.params.id,
      isCompanyOrder: true
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('company', 'name')
      .populate({
        path: 'childOrders',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;