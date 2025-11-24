import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

const COMMISSION_RATE = 0.15;
const MAX_POINTS_DISCOUNT = 0.30;

export async function POST(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { providerId, serviceId, bookingDatetime, location, notes, pointsToRedeem, phoneNumber } = await request.json();

    // Only allow Manicure (1) or Pedicure (2)
    if (![1, 2].includes(parseInt(serviceId))) {
      return NextResponse.json({ error: 'Only Manicure and Pedicure services are available' }, { status: 400 });
    }

    const providerService = await prisma.providerService.findUnique({
      where: { providerId_serviceId: { providerId, serviceId: parseInt(serviceId) } },
      include: { service: true }
    });

    if (!providerService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const basePrice = parseFloat(providerService.customPrice || providerService.service.basePrice);
    const servicePoints = providerService.customPoints || providerService.service.points;

    const userPoints = await prisma.userPoints.findUnique({
      where: { userId }
    });

    let pointsUsed = 0;
    let discount = 0;
    const maxDiscount = basePrice * MAX_POINTS_DISCOUNT;

    if (pointsToRedeem && userPoints && userPoints.currentPoints >= pointsToRedeem) {
      // Check points earned from this specific provider
      const providerBookings = await prisma.booking.findMany({
        where: {
          clientId: userId,
          providerId,
          status: 'COMPLETED'
        },
        select: { pointsEarned: true }
      });
      
      const pointsFromProvider = providerBookings.reduce((sum, b) => sum + (b.pointsEarned || 0), 0);
      
      // Check points already redeemed with this provider
      const redeemedWithProvider = await prisma.pointsTransaction.findMany({
        where: {
          userId,
          type: 'REDEEMED',
          description: { contains: providerId }
        },
        select: { points: true }
      });
      
      const alreadyRedeemed = Math.abs(redeemedWithProvider.reduce((sum, t) => sum + t.points, 0));
      const availableWithProvider = pointsFromProvider - alreadyRedeemed;
      
      if (pointsToRedeem > availableWithProvider) {
        return NextResponse.json({ 
          error: `You can only redeem ${availableWithProvider} points with this provider` 
        }, { status: 400 });
      }
      
      pointsUsed = Math.min(pointsToRedeem, userPoints.currentPoints);
      discount = Math.min(pointsUsed, maxDiscount);
    }

    const finalAmount = basePrice - discount;
    const commission = finalAmount * COMMISSION_RATE;
    const providerEarning = finalAmount - commission;

    const booking = await prisma.booking.create({
      data: {
        clientId: userId,
        providerId,
        serviceId: parseInt(serviceId),
        bookingDatetime: new Date(bookingDatetime),
        status: 'PENDING_PAYMENT',
        amount: finalAmount,
        commission,
        providerEarning,
        pointsEarned: servicePoints,
        location,
        notes
      }
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        phoneNumber: phoneNumber || '0700000000',
        amount: finalAmount,
        status: 'INITIATED',
        demoMode: true
      }
    });

    if (pointsUsed > 0) {
      await prisma.userPoints.update({
        where: { userId },
        data: { currentPoints: { decrement: pointsUsed } }
      });

      await prisma.pointsTransaction.create({
        data: {
          userId,
          type: 'REDEEMED',
          points: -pointsUsed,
          source: 'BOOKING',
          referenceId: booking.id,
          description: `Redeemed ${pointsUsed} points with provider ${providerId}`
        }
      });
    }

    return NextResponse.json({ booking, payment });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
