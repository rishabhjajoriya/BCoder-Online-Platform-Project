# Razorpay Sandbox Setup Guide

## Overview
This guide will help you set up Razorpay sandbox integration for teaching students how real payment gateways work.

## Step 1: Get Razorpay Sandbox Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a free account
3. Go to Settings → API Keys
4. Generate a new API key pair for **Test Mode**
5. Copy the Key ID and Key Secret

## Step 2: Configure Environment Variables

Create a `.env` file in the Backend directory with:

```env
# Razorpay Configuration (Sandbox)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here
```

## Step 3: Test Payment Flow

### For Students (Demo):
1. **Login** as a student
2. **Browse courses** and click "Enroll Now"
3. **Create order** - This creates a real Razorpay order
4. **Click "Pay"** - Opens the real Razorpay payment modal
5. **Use test card details**:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name
6. **Complete payment** - Real payment simulation
7. **Verify enrollment** - Check dashboard for enrolled course

### Test Card Details:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **Expiry**: Any future date (MM/YY)
- **CVV**: Any 3 digits
- **Name**: Any name

## Step 4: What Students Will See

1. **Real Razorpay Interface**: Students see the actual Razorpay payment modal
2. **Secure Payment Flow**: Real payment gateway simulation
3. **Payment Verification**: Backend verifies payment signatures
4. **Enrollment Creation**: Automatic enrollment after successful payment
5. **Error Handling**: Real payment failure scenarios

## Benefits for Teaching

✅ **Real Payment Gateway**: Students experience actual Razorpay interface
✅ **Secure Transactions**: Learn about payment signature verification
✅ **Error Handling**: Understand payment failure scenarios
✅ **Sandbox Environment**: Safe testing without real money
✅ **Industry Standard**: Learn how real e-commerce payments work

## Troubleshooting

### Payment Fails:
- Check if Razorpay credentials are correct
- Ensure you're using test mode credentials
- Verify the payment amount is in paise (multiply by 100)

### Order Creation Fails:
- Check MongoDB connection
- Verify course exists in database
- Check if user is already enrolled

### Modal Doesn't Open:
- Ensure Razorpay script is loaded
- Check browser console for errors
- Verify API responses are correct

## Security Notes

- Never use production credentials in development
- Always use sandbox/test mode for teaching
- Test cards are safe and don't charge real money
- Payment signatures are verified on backend for security

## Next Steps

1. Set up your Razorpay sandbox account
2. Configure environment variables
3. Test the payment flow
4. Show students the real payment experience!

Happy Teaching! 🎓💳 