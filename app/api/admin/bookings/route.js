import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function GET(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        client: { select: { name: true } },
        provider: { select: { name: true } },
        service: { select: { name: true } },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      clientName: booking.client.name,
      providerName: booking.provider.name,
      service: booking.service.name,
      date: new Date(booking.bookingDatetime).toLocaleDateString(),
      time: new Date(booking.bookingDatetime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      price: parseFloat(booking.amount),
      commission: parseFloat(booking.commission),
      providerEarning: parseFloat(booking.providerEarning),
      points: booking.pointsEarned,
      status: booking.status.toLowerCase().replace('_', '-'),
      paymentStatus: booking.payment?.status === 'COMPLETED' || booking.payment?.status === 'DEMO_SUCCESS' ? 'paid' : 'pending',
      location: booking.location || 'Not specified'
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Admin bookings API error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
