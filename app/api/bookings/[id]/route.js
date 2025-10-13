import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true } },
        provider: { select: { id: true, name: true, email: true, phone: true } },
        service: { include: { category: true } },
        payment: true,
        review: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Verify booking exists and user has permission
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { client: true, provider: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check permissions
    if (userRole === 'PROVIDER' && booking.providerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (userRole === 'CLIENT' && booking.clientId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
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
      }
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}