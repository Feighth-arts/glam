import { NextResponse } from 'next/server';
import { initiateSTKPush } from '@/lib/mpesa';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { paymentId, phoneNumber, amount } = await request.json();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            service: true,
            client: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const accountReference = `BK${payment.bookingId.slice(-8)}`;
    const transactionDesc = `Payment for ${payment.booking.service.name}`;
    
    const stkResponse = await initiateSTKPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    );

    if (stkResponse.ResponseCode === '0') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          phoneNumber,
          transactionId: stkResponse.CheckoutRequestID
        }
      });

      return NextResponse.json({
        success: true,
        message: stkResponse.CustomerMessage,
        checkoutRequestID: stkResponse.CheckoutRequestID
      });
    } else {
      return NextResponse.json({
        success: false,
        error: stkResponse.errorMessage || 'STK push failed'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('STK push error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to initiate payment'
    }, { status: 500 });
  }
}
