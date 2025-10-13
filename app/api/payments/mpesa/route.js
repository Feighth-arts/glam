import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { paymentId, phoneNumber, amount } = await request.json();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Simulate M-Pesa STK push (in production, call actual M-Pesa API)
    const mpesaCheckoutId = `MPESA${Date.now()}`;

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        mpesaCheckoutId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'STK push sent. Check your phone.',
      mpesaCheckoutId
    });
  } catch (error) {
    console.error('M-Pesa error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
