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

    const { bookingId } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.providerId !== userId) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'PAID' && booking.status !== 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking must be paid first' }, { status: 400 });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' }
    });

    const userPoints = await prisma.userPoints.findUnique({
      where: { userId: booking.clientId }
    });

    if (userPoints) {
      const newPoints = userPoints.currentPoints + booking.pointsEarned;
      const newLifetimePoints = userPoints.lifetimePoints + booking.pointsEarned;

      let newTier = userPoints.tier;
      if (newLifetimePoints >= 5000) newTier = 'PLATINUM';
      else if (newLifetimePoints >= 1000) newTier = 'GOLD';

      await prisma.userPoints.update({
        where: { userId: booking.clientId },
        data: {
          currentPoints: newPoints,
          lifetimePoints: newLifetimePoints,
          tier: newTier
        }
      });

      await prisma.pointsTransaction.create({
        data: {
          userId: booking.clientId,
          type: 'EARNED',
          points: booking.pointsEarned,
          source: 'BOOKING',
          referenceId: bookingId,
          description: `Earned ${booking.pointsEarned} points from completed booking`
        }
      });
    }

    await prisma.notification.create({
      data: {
        userId: booking.clientId,
        type: 'EMAIL',
        subject: 'Service Completed',
        content: { 
          message: `Your service has been completed. You earned ${booking.pointsEarned} points!` 
        }
      }
    });

    return NextResponse.json({ success: true, pointsEarned: booking.pointsEarned });
  } catch (error) {
    console.error('Complete booking error:', error);
    return NextResponse.json({ error: 'Failed to complete booking' }, { status: 500 });
  }
}
