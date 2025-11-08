// Manual M-Pesa Callback Processor
// Use this to process callbacks received on webhook.site

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function processCallback(callbackData) {
  try {
    const { Body } = callbackData;
    const { stkCallback } = Body;

    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    console.log('Processing:', checkoutRequestID, 'Result:', resultCode);

    const payment = await prisma.payment.findFirst({
      where: { transactionId: checkoutRequestID },
      include: { booking: true }
    });

    if (!payment) {
      console.log('Payment not found');
      return;
    }

    if (resultCode === 0) {
      const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item.find(
        item => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          transactionId: mpesaReceiptNumber,
          completedAt: new Date()
        }
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'PAID' }
      });

      console.log('✅ Payment successful! Receipt:', mpesaReceiptNumber);
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });

      console.log('❌ Payment failed');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Copy JSON from webhook.site and paste here
const callbackData = {
  // Paste webhook.site JSON here
};

// processCallback(callbackData);

module.exports = { processCallback };
