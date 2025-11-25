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

    const stats = await prisma.booking.aggregate({
      where: { status: 'COMPLETED' },
      _sum: {
        amount: true,
        commission: true,
        providerEarning: true
      }
    });

    const providers = await prisma.user.findMany({
      where: { role: 'PROVIDER' },
      select: {
        id: true,
        name: true,
        providerBookings: {
          where: { status: 'COMPLETED' },
          select: {
            providerEarning: true,
            createdAt: true
          }
        }
      }
    });

    const pendingPayouts = providers.map(provider => {
      const earnings = provider.providerBookings.reduce((sum, b) => sum + parseFloat(b.providerEarning), 0);
      return {
        id: provider.id,
        provider: provider.name,
        amount: earnings,
        bookings: provider.providerBookings.length,
        dueDate: new Date().toLocaleDateString()
      };
    }).filter(p => p.amount > 0);

    return NextResponse.json({
      totalRevenue: parseFloat(stats._sum.amount || 0),
      totalCommission: parseFloat(stats._sum.commission || 0),
      totalProviderEarnings: parseFloat(stats._sum.providerEarning || 0),
      pendingPayouts
    });
  } catch (error) {
    console.error('Admin finances API error:', error);
    return NextResponse.json({ error: 'Failed to fetch finances' }, { status: 500 });
  }
}
