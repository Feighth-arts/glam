import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function GET(request) {
  try {
    const userId = getUserId(request);
    const role = getUserRole(request);

    if (!userId || role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        client: { select: { id: true, name: true } },
        provider: { select: { id: true, name: true } },
        service: { select: { name: true } },
        payment: { select: { status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      clientName: booking.client.name,
      providerName: booking.provider.name,
      service: booking.service.name,
      date: booking.bookingDatetime.toISOString().split('T')[0],
      time: booking.bookingDatetime.toISOString().split('T')[1].slice(0, 5),
      location: booking.location || 'N/A',
      price: parseFloat(booking.amount),
      commission: parseFloat(booking.commission),
      providerEarning: parseFloat(booking.providerEarning),
      points: booking.pointsEarned,
      status: booking.status.toLowerCase(),
      paymentStatus: booking.payment?.status.toLowerCase() || 'pending'
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
