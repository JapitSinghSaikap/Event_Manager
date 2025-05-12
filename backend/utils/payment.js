const express  = require('express');
const razorpay = require('razorpay');
const router = express.Router();


const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.post('/create-order', async (req, res) => {
  let { amount, currency = 'INR' } = req.body;
  console.log("Received amount:", amount, "and currency:", currency);

  // Convert to number safely
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Convert INR to paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



module.exports = router;