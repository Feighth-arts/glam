import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendProviderBookingNotification } from '@/lib/email-service';

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

    // Send notification to provider
    if (payment.booking.provider?.email) {
      await sendProviderBookingNotification(
        {
          id: payment.booking.id,
          clientName: payment.booking.client.name,
          serviceName: payment.booking.service.name,
          date: new Date(payment.booking.bookingDatetime).toLocaleDateString(),
          time: new Date(payment.booking.bookingDatetime).toLocaleTimeString(),
          totalAmount: payment.booking.amount,
          location: payment.booking.location
        },
        payment.booking.provider.email,
        payment.booking.provider.name
      );
    }

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
