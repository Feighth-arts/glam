import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { checkoutRequestID } = await request.json();

    const payment = await prisma.payment.findFirst({
      where: { transactionId: checkoutRequestID },
      include: { 
        booking: {
          include: {
            client: true,
            provider: true,
            service: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const mpesaReceiptNumber = `TEST${Date.now()}`;

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

    return NextResponse.json({
      success: true,
      resultCode: 0,
      resultDesc: 'Payment simulated successfully'
    });
  } catch (error) {
    console.error('Simulate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
