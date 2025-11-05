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
      where: { status: { in: ['PAID', 'CONFIRMED', 'COMPLETED'] } },
      include: {
        provider: { select: { name: true } },
        payment: { select: { status: true, completedAt: true } }
      }
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount), 0);
    const totalCommission = bookings.reduce((sum, b) => sum + parseFloat(b.commission), 0);
    const totalProviderEarnings = bookings.reduce((sum, b) => sum + parseFloat(b.providerEarning), 0);

    const pendingPayouts = await prisma.booking.findMany({
      where: { 
        status: 'COMPLETED',
        payment: { status: 'COMPLETED' }
      },
      include: {
        provider: { select: { id: true, name: true } }
      }
    });

    const payoutsByProvider = {};
    pendingPayouts.forEach(booking => {
      const providerId = booking.provider.id;
      if (!payoutsByProvider[providerId]) {
        payoutsByProvider[providerId] = {
          id: providerId,
          provider: booking.provider.name,
          amount: 0,
          bookings: 0,
          dueDate: new Date().toISOString().split('T')[0]
        };
      }
      payoutsByProvider[providerId].amount += parseFloat(booking.providerEarning);
      payoutsByProvider[providerId].bookings += 1;
    });

    return NextResponse.json({
      totalRevenue,
      totalCommission,
      totalProviderEarnings,
      pendingPayouts: Object.values(payoutsByProvider)
    });
  } catch (error) {
    console.error('Get finances error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
