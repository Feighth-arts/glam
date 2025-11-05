import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingStatusUpdate } from '@/lib/email-service';

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

      if (payment.booking.client?.email) {
        await sendBookingStatusUpdate(
          {
            id: payment.booking.id,
            serviceName: payment.booking.service?.name,
            date: payment.booking.bookingDatetime.toISOString().split('T')[0],
            time: payment.booking.bookingDatetime.toISOString().split('T')[1].slice(0, 5),
            totalAmount: payment.booking.totalAmount
          },
          payment.booking.client.email,
          payment.booking.client.name,
          'PAID'
        );
      }
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
