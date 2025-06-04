import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Company from '../models/Company.js';
import moment from 'moment';

const router = express.Router();

// @route   GET api/reports/sales
// @desc    Get sales report
// @access  Private (Admin)
router.get('/sales', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const { startDate, endDate, location } = req.query;
    
    // Build query
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    
    if (location) {
      query.location = location;
    }
    
    // Get all orders matching the query
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate('company', 'name');
    
    // Calculate totals by location
    const locationTotals = orders.reduce((acc, order) => {
      const location = order.location;
      if (!acc[location]) {
        acc[location] = {
          orderCount: 0,
          totalSales: 0,
          orders: []
        };
      }
      
      acc[location].orderCount += 1;
      acc[location].totalSales += order.totalPrice;
      acc[location].orders.push({
        id: order._id,
        user: order.user.name,
        company: order.company?.name,
        totalPrice: order.totalPrice,
        date: order.createdAt
      });
      
      return acc;
    }, {});
    
    // Calculate overall totals
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Generate report
    const report = {
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
      },
      summary: {
        totalOrders,
        totalSales
      },
      locationBreakdown: locationTotals
    };
    
    res.json(report);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/reports/company/:id
// @desc    Get company orders report
// @access  Private (Admin & Company)
router.get('/company/:id', authenticate, async (req, res) => {
  try {
    const { role, company: userCompany } = req.user;
    const companyId = req.params.id;
    
    // Check if user has permission
    if (
      role !== 'admin' &&
      (role !== 'company' || userCompany.toString() !== companyId)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this report' });
    }
    
    const { startDate, endDate } = req.query;
    
    // Build query
    const query = {
      company: companyId
    };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    
    // Get company info
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Get all orders for this company
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'childOrders',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    
    // Calculate totals
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Group orders by month
    const monthlyData = orders.reduce((acc, order) => {
      const month = moment(order.createdAt).format('YYYY-MM');
      
      if (!acc[month]) {
        acc[month] = {
          orderCount: 0,
          totalSpent: 0,
          orders: []
        };
      }
      
      acc[month].orderCount += 1;
      acc[month].totalSpent += order.totalPrice;
      acc[month].orders.push({
        id: order._id,
        user: order.user.name,
        totalPrice: order.totalPrice,
        date: order.createdAt,
        location: order.location,
        status: order.status,
        childOrdersCount: order.childOrders.length
      });
      
      return acc;
    }, {});
    
    // Generate report
    const report = {
      company: {
        id: company._id,
        name: company.name,
        contact: company.contact
      },
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
      },
      summary: {
        totalOrders,
        totalSpent
      },
      monthlyBreakdown: monthlyData,
      orders: orders.map(order => ({
        id: order._id,
        user: order.user.name,
        totalPrice: order.totalPrice,
        date: order.createdAt,
        location: order.location,
        status: order.status,
        childOrders: order.childOrders.map(childOrder => ({
          id: childOrder._id,
          user: childOrder.user.name,
          totalPrice: childOrder.totalPrice,
          date: childOrder.createdAt
        }))
      }))
    };
    
    res.json(report);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

export default router;