import express from 'express';
import { body, validationResult } from 'express-validator';
import Company from '../models/Company.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/companies
// @desc    Get all companies
// @access  Private (Admin)
router.get('/', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/companies/:id
// @desc    Get company by ID
// @access  Private (Admin & Company users)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Check if user has permission
    if (
      req.user.role !== 'admin' &&
      (!req.user.company || req.user.company.toString() !== company._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this company' });
    }
    
    res.json(company);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/companies
// @desc    Create a company
// @access  Private (Admin)
router.post(
  '/',
  [
    authenticate,
    authorize('admin'),
    body('name', 'Name is required').not().isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contact, address } = req.body;

    try {
      // Check if company already exists
      let company = await Company.findOne({ name });
      if (company) {
        return res.status(400).json({ message: 'Company already exists' });
      }

      company = new Company({
        name,
        contact,
        address
      });

      await company.save();
      res.json(company);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/companies/:id
// @desc    Update a company
// @access  Private (Admin)
router.put(
  '/:id',
  [
    authenticate,
    authorize('admin')
  ],
  async (req, res) => {
    const { name, contact, address } = req.body;

    // Build company object
    const companyFields = {};
    if (name) companyFields.name = name;
    if (contact) companyFields.contact = contact;
    if (address) companyFields.address = address;

    try {
      let company = await Company.findById(req.params.id);

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      // Update
      company = await Company.findByIdAndUpdate(
        req.params.id,
        { $set: companyFields },
        { new: true }
      );

      res.json(company);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/companies/:id/users
// @desc    Get all users associated with a company
// @access  Private (Admin & Company reps)
router.get('/:id/users', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Check if user has permission
    if (
      req.user.role !== 'admin' &&
      (!req.user.company || req.user.company.toString() !== company._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this company' });
    }
    
    const users = await User.find({ company: req.params.id })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;