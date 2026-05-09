const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth'); // middleware auth Anda

// Route untuk user membuat transaksi (Butuh Login)
router.post('/create-transaction', verifyToken, paymentController.createTransaction);

// Route untuk Midtrans kirim laporan (TIDAK BOLEH pakai verifyToken)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;