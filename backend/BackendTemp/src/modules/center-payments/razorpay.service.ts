import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with dummy keys if env variables are not present.
// The user can later add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to their .env file.
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykeyid123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret123dummysecret',
});

export const createRazorpayOrder = async (amountInRupees: number, receiptId: string) => {
  const options = {
    amount: amountInRupees * 100, // Razorpay works in paise
    currency: 'INR',
    receipt: receiptId,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

export const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret123dummysecret';
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
