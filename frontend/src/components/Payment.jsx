import React from 'react';
import { toast } from 'sonner';

const Payment = ({ amount, onPaymentSuccess }) => {
  const razorpay_key_id = "rzp_test_zlpkrN2ub1TXkS";

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/payment/create-order", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      const { id, amount: orderAmount, currency } = orderData.order;

      const options = {
        key: razorpay_key_id,
        amount: orderAmount,
        currency,
        order_id: id,
        handler: function (response) {
          toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          if (onPaymentSuccess) {
            onPaymentSuccess(response.razorpay_payment_id);
          }
        },
        prefill: {
          name: 'Harsh',
          email: 'harsh@gmail.com',
          contact: '9646766209',
        },
        theme: { color: '#F37254' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className='text-white'>
      <button
        onClick={handlePayment}
        className='bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-200 w-fit h-fit cursor-pointer'
      >
        Pay
      </button>
    </div>
  );
};

export default Payment;
