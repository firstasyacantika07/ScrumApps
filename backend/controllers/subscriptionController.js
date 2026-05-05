// controllers/subscriptionController.js
const midtransClient = require('midtrans-client');
const db = require('../config/db'); // Sesuai struktur Anda

// Midtrans Sandbox Config (dari kode Anda)
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey = process.env.MIDTRANS_SERVER_KEY;,
    clientKey: 'Mid-client-dgGTw7MIK1F7fdLK'
});

exports.createCheckout = async (req, res) => {
    try {
        const { plan, amount, isAnnual = false } = req.body;

        console.log('🧾 Checkout Request:', { 
            userId: req.user.id, 
            plan, 
            amount, 
            isAnnual 
        });

        // Validasi Plan
        const planPrices = {
            'PRO': 150000,
            'ENTERPRISE': 5000000
        };

        if (!planPrices[plan]) {
            return res.status(400).json({ 
                success: false, 
                message: `Plan ${plan} tidak valid. Pilih PRO atau ENTERPRISE` 
            });
        }

        const finalAmount = parseInt(amount) || planPrices[plan];

        // Midtrans Parameter
        const parameter = {
            transaction_details: {
                order_id: `SCRUM-${Date.now()}-${req.user.id}-${Math.random().toString(36).substr(2, 5)}`,
                gross_amount: finalAmount
            },
            customer_details: {
                first_name: req.user.name?.split(' ')[0] || "User",
                last_name: req.user.name?.split(' ').slice(1).join(' ') || "",
                email: req.user.email,
                phone: req.user.phone_number || "081234567890"
            },
            item_details: [{
                id: plan,
                price: finalAmount,
                quantity: 1,
                name: `${plan} Package ${isAnnual ? 'Tahunan (20% OFF)' : 'Bulanan'}`,
                brand: "ScrumApps",
                category: "SaaS Subscription"
            }],
            expiry: {
                start_time: new Date(Date.now() + (15 * 60 * 1000)).toISOString(), // 15 menit
                duration: 15,
                unit: "minutes"
            }
        };

        // Buat transaksi Midtrans
        const transaction = await snap.createTransaction(parameter);
        
        // Simpan ke database TRANSACTIONS
        await db.query(
            `INSERT INTO transactions (
                user_id, order_id, snap_token, amount, plan, is_annual, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [
                req.user.id, 
                parameter.transaction_details.order_id, 
                transaction.token, 
                finalAmount, 
                plan, 
                isAnnual
            ]
        );

        console.log('✅ Snap Token Created:', parameter.transaction_details.order_id);

        res.json({ 
            success: true, 
            token: transaction.token,
            order_id: parameter.transaction_details.order_id,
            amount: finalAmount,
            redirect_url: transaction.redirect_url
        });

    } catch (error) {
        console.error('❌ Midtrans Error:', error);
        res.status(500).json({ 
            success: false, 
            message: `Gagal membuat checkout: ${error.message}` 
        });
    }
};

exports.handleMidtransWebhook = async (req, res) => {
    try {
        console.log('📨 Midtrans Webhook:', req.body);

        const { 
            order_id, 
            transaction_status, 
            payment_type, 
            gross_amount,
            fraud_status 
        } = req.body;

        if (!order_id) {
            console.log('⚠️ Missing order_id');
            return res.status(400).send("OK");
        }

        // Cari transaksi
        const [transactions] = await db.query(
            'SELECT * FROM transactions WHERE order_id = ?',
            [order_id]
        );

        if (transactions.length === 0) {
            console.log('⚠️ Transaction not found:', order_id);
            return res.status(404).send("OK");
        }

        const transaction = transactions[0];

        // Update status transaksi
        await db.query(
            `UPDATE transactions SET 
                status = ?, 
                payment_type = ?, 
                gross_amount = ?, 
                fraud_status = ?
             WHERE order_id = ?`,
            [transaction_status, payment_type, gross_amount, fraud_status, order_id]
        );

        // AKTIVASI SUBSCRIPTION jika sukses
        if (['capture', 'settlement'].includes(transaction_status) && !fraud_status) {
            const days = transaction.is_annual ? 365 : 30;
            
            await db.query(
                `UPDATE tbr_users SET 
                    package_type = ?, 
                    subscription_status = 'active',
                    subscription_ends_at = DATE_ADD(NOW(), INTERVAL ? DAY)
                 WHERE id = ?`,
                [transaction.plan, days, transaction.user_id]
            );

            console.log('🎉 Subscription ACTIVATED:', {
                user_id: transaction.user_id,
                plan: transaction.plan,
                order_id: order_id,
                status: transaction_status
            });
        }

        res.status(200).send("OK");

    } catch (error) {
        console.error('❌ Webhook Error:', error);
        res.status(500).send("ERROR");
    }
};