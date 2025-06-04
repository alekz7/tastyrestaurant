import express from 'express';
import { body, validationResult } from 'express-validator';
import MenuItem from '../models/MenuItem.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ active: true }).sort({ category: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/menu/categories
// @desc    Get all menu categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category', { active: true });
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/menu/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/menu
// @desc    Create a menu item
// @access  Private (Admin)
router.post(
  '/',
  [
    authenticate,
    authorize('admin'),
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('price', 'Price is required and must be a number').isNumeric(),
    body('category', 'Category is required').not().isEmpty(),
    body('image', 'Image URL is required').not().isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, image, active = true } = req.body;

    try {
      const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        image,
        active
      });

      await menuItem.save();
      res.json(menuItem);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private (Admin)
router.put(
  '/:id',
  [
    authenticate,
    authorize('admin')
  ],
  async (req, res) => {
    const { name, description, price, category, image, active } = req.body;

    // Build menu item object
    const menuItemFields = {};
    if (name !== undefined) menuItemFields.name = name;
    if (description !== undefined) menuItemFields.description = description;
    if (price !== undefined) menuItemFields.price = price;
    if (category !== undefined) menuItemFields.category = category;
    if (image !== undefined) menuItemFields.image = image;
    if (active !== undefined) menuItemFields.active = active;

    try {
      let menuItem = await MenuItem.findById(req.params.id);

      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      // Update
      menuItem = await MenuItem.findByIdAndUpdate(
        req.params.id,
        { $set: menuItemFields },
        { new: true }
      );

      res.json(menuItem);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private (Admin)
router.delete('/:id', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;