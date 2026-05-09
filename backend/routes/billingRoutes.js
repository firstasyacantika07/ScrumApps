const express = require('express');
const router = express.Router();

// Middleware auth (opsional tapi disarankan)
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * 🔒 Semua route billing wajib login
 */
router.use(verifyToken);

/**
 * 📊 GET: Ambil info billing user
 * Endpoint: /api/billing/
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Data billing user berhasil diambil',
        user: req.user
    });
});

/**
 * 💳 POST: Buat transaksi pembayaran
 * Endpoint: /api/billing/create
 */
router.post('/create', (req, res) => {
    const { amount, plan } = req.body;

    if (!amount || !plan) {
        return res.status(400).json({
            message: 'Amount dan plan wajib diisi'
        });
    }

    // Simulasi transaksi
    res.json({
        message: 'Transaksi berhasil dibuat',
        data: {
            amount,
            plan,
            status: 'pending'
        }
    });
});

/**
 * 📄 GET: Riwayat transaksi (hanya Admin / Superadmin)
 */
router.get('/history', authorize('Superadmin'), (req, res) => {
    res.json({
        message: 'Riwayat transaksi',
        data: [
            { id: 1, amount: 100000, status: 'paid' },
            { id: 2, amount: 50000, status: 'pending' }
        ]
    });
});

/**
 * ❌ DELETE: Batalkan transaksi
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    res.json({
        message: `Transaksi dengan id ${id} berhasil dibatalkan`
    });
});

module.exports = router;