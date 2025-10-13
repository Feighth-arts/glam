import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function POST(request) {
  try {
    const userId = getUserId();
    const role = getUserRole();

    if (!userId || role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { paymentId, success } = await request.json();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.booking.providerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (success) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          transactionId: `TXN${Date.now()}`,
          completedAt: new Date()
        }
      });

      const booking = await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'PAID' }
      });

      await prisma.notification.create({
        data: {
          userId: booking.clientId,
          type: 'EMAIL',
          subject: 'Payment Confirmed',
          content: { message: 'Your payment has been confirmed. Booking is now active.' }
        }
      });

      return NextResponse.json({ success: true, message: 'Payment confirmed' });
    } else {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'FAILED' }
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CANCELLED' }
      });

      return NextResponse.json({ success: true, message: 'Payment marked as failed' });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}
