import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, rating, comment } = await request.json();

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.clientId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 });
    }

    if (booking.review) {
      return NextResponse.json({ error: 'Review already exists' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        clientId: userId,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        rating,
        comment: comment || null
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
