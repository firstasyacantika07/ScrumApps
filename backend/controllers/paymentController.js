const snap = require('../services/midtrans');
const crypto = require('crypto');
const UserModel = require('../src/models/userModel');

/**
 * 1. Membuat Transaksi Pembayaran (Snap Token)
 */
exports.createTransaction = async (req, res) => {
    try {
        const isAnnual = req.body.isAnnual;
        const price = isAnnual ? 1500000 : 150000;
        const planName = isAnnual ? 'YEARLY' : 'MONTHLY';

        // Kita format Order ID agar mengandung User ID: ORDER-TIMESTAMP-USERID
        // Contoh: ORDER-1714123456-12
        const orderId = `ORDER-${Date.now()}-${req.user.id}`;

        const transactionParams = {
            transaction_details: {
                order_id: orderId,
                gross_amount: price
            },
            item_details: [{
                id: planName,
                price: price,
                quantity: 1,
                name: `Subscription Package ${planName}`
            }],
            customer_details: {
                email: req.user.email
            }
        };

        const trx = await snap.createTransaction(transactionParams);
        res.json(trx);
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat transaksi", error: error.message });
    }
};

/**
 * 2. Menangani Notifikasi Otomatis (Webhook) dari Midtrans
 */
exports.handleWebhook = async (req, res) => {
    try {
        const notification = req.body;

        // --- Verifikasi Signature Key (Keamanan) ---
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const combined = notification.order_id + notification.status_code + notification.gross_amount + serverKey;
        const hash = crypto.createHash('sha512').update(combined).digest('hex');

        if (hash !== notification.signature_key) {
            return res.status(403).json({ message: "Invalid signature key" });
        }

        const transactionStatus = notification.transaction_status;
        const orderId = notification.order_id;
        
        // --- Ekstraksi User ID dari Order ID ---
        // Format kita tadi: ORDER-Timestamp-UserID
        const parts = orderId.split('-');
        const userId = parts[2];

        if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
            // --- PEMBAYARAN BERHASIL ---
            
            const expiryDate = new Date();
            // Cek apakah ini paket tahunan dari Order ID atau Item Details
            if (orderId.includes('YEARLY') || (notification.item_details && notification.item_details[0].id.includes('YEARLY'))) {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            } else {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
            }

            // Update status user di database melalui model
            await UserModel.updateSubscription(userId, {
                package_type: 'PRO',
                subscription_status: 'active',
                subscription_ends_at: expiryDate,
                trial_ends_at: null // User sudah upgrade, masa trial selesai
            });

            console.log(`✅ Pembayaran Berhasil: User ${userId} (${orderId})`);

        } else if (['expire', 'cancel', 'deny'].includes(transactionStatus)) {
            // --- PEMBAYARAN GAGAL / EXPIRED ---
            console.log(`❌ Pembayaran Gagal/Expired: User ${userId} (${orderId})`);
        }

        // Midtrans butuh respon 200 OK untuk berhenti mengirim notifikasi ulang
        res.status(200).send('OK');

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ message: error.message });
    }
};