const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// Validation middleware
const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required'),
  body('orderId').notEmpty().isUUID().withMessage('Valid order ID is required')
];

const retryPaymentValidation = [
  body('orderId').notEmpty().isUUID().withMessage('Valid order ID is required')
];

// Routes
router.post('/verify', verifyPaymentValidation, validate, paymentController.verifyPayment);
router.post('/retry', retryPaymentValidation, validate, paymentController.retryPayment);

module.exports = router;
