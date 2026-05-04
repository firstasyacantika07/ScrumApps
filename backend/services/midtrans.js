const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const createTransaction = async (data) => {
    const parameter = {
        transaction_details: {
            order_id: data.order_id,
            gross_amount: data.amount
        }
    };

    return await snap.createTransaction(parameter);
};

module.exports = { createTransaction };