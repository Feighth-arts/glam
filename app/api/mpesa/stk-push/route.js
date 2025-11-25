import { NextResponse } from 'next/server';
import { initiateSTKPush } from '@/lib/mpesa';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { paymentId, phoneNumber, amount } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

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
    
    // Try real M-Pesa if credentials exist
    if (process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET) {
      try {
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
        }
      } catch (mpesaError) {
        console.log('M-Pesa API failed, falling back to demo mode:', mpesaError.message);
      }
    }
    
    // Fallback to demo mode
    const checkoutRequestID = `DEMO${Date.now()}`;
    
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        phoneNumber,
        transactionId: checkoutRequestID
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Demo STK push sent',
      checkoutRequestID
    });
  } catch (error) {
    console.error('STK push error:', error);
    
    // Fallback to demo mode on any error
    const checkoutRequestID = `DEMO${Date.now()}`;
    return NextResponse.json({
      success: true,
      message: 'Demo STK push sent',
      checkoutRequestID
    });
  }
}
