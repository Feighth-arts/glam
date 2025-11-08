import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { Body } = body;
    const { stkCallback } = Body;

    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    const payment = await prisma.payment.findFirst({
      where: { transactionId: checkoutRequestID },
      include: {
        booking: {
          include: {
            client: true,
            service: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    if (resultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata.Item;
      const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;

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

      // Email notification handled client-side
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
}
