import React from 'react'
import { useState } from 'react'
const Payment = () => {
  const [amount, setAmount] = useState(0);

  
  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/payment/create-order", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }), // Ensure amount is a number
      });
  
      const orderData = await res.json();
  
      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }
  
      const { id, amount: orderAmount, currency } = orderData.order;
  
      const options = {
        key: 'rzp_test_zlpkrN2ub1TXkS',
        amount: orderAmount,
        currency,
        order_id: id,
        handler: function (response) {
          alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
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
      <div>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      {amount}
      <button onClick={() => handlePayment()} className='bg-white text-black w-fit h-fit px-6 rounded-2xl cursor-pointer  py-2'>Pay</button>

    </div>
  )
}

export default Payment
