import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const userId = getUserId();
    const userRole = getUserRole();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 50;

    let where = {};
    if (userRole === 'PROVIDER') {
      where.providerId = userId;
    } else if (userRole === 'CLIENT') {
      where.clientId = userId;
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, phone: true }
        },
        provider: {
          select: { id: true, name: true, email: true, phone: true }
        },
        service: {
          include: { category: true }
        },
        payment: true,
        review: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = getUserId();
    const userRole = getUserRole();
    if (!userId || userRole !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { providerId, serviceId, bookingDatetime, notes } = body;

    // Get service details for pricing
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate commission and earnings
    const amount = service.basePrice;
    const commission = Math.round(amount * 0.15); // 15% commission
    const providerEarning = amount - commission;
    const pointsEarned = Math.floor(amount / 100); // 1 point per KES 100

    const booking = await prisma.booking.create({
      data: {
        clientId: userId,
        providerId,
        serviceId: parseInt(serviceId),
        bookingDatetime: new Date(bookingDatetime),
        amount,
        commission,
        providerEarning,
        pointsEarned,
        notes,
        status: 'PENDING_PAYMENT'
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, phone: true }
        },
        provider: {
          select: { id: true, name: true, email: true, phone: true }
        },
        service: {
          include: { category: true }
        }
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}