const Midtrans = require('midtrans-nodejs-client');

let midtrans;

const initMidtrans = () => {
  midtrans = new Midtrans.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey = process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });
};

initMidtrans();

module.exports = midtrans;