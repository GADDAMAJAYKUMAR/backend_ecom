const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.patch('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
], validate, userController.updateProfile);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

module.exports = router;
