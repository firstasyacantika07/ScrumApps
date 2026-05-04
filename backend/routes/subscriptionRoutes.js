// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();

// Import Controller & Middleware
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// POST /api/subscription/checkout - Buat Midtrans Snap Token
router.post('/checkout', auth, subscriptionController.createCheckout);

// POST /api/subscription/webhook - Midtrans Callback (No Auth)
router.post('/webhook', subscriptionController.handleMidtransWebhook);

// GET /api/subscription/me - Cek subscription user saat ini
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      subscription: {
        package_type: req.user.package_type,
        subscription_status: req.user.subscription_status,
        trial_ends_at: req.user.trial_ends_at,
        subscription_ends_at: req.user.subscription_ends_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;