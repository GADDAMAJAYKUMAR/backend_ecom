const crypto = require("crypto");

// Replace with your values from Step 1
const razorpay_order_id = "order_SXkjf6S5vEVDik";
const razorpay_payment_id = "pay_test_12345"; 
const key_secret = "vMzQqLl8PESpgbtyJf3afd2V";

const body = razorpay_order_id + "|" + razorpay_payment_id;

const signature = crypto
  .createHmac("sha256", key_secret)
  .update(body)
  .digest("hex");

console.log("Generated Signature:", signature);
