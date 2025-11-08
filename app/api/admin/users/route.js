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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let where = {};
    if (type === 'providers') where.role = 'PROVIDER';
    else if (type === 'clients') where.role = 'CLIENT';

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        specialty: true,
        experience: true,
        _count: {
          select: {
            providerBookings: true,
            clientBookings: true
          }
        },
        providerBookings: {
          select: {
            amount: true
          }
        },
        clientBookings: {
          select: {
            amount: true
          }
        },
        userPoints: {
          select: {
            currentPoints: true,
            tier: true
          }
        }
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      joinDate: user.createdAt,
      specialty: user.specialty,
      experience: user.experience,
      totalBookings: user.role === 'PROVIDER' ? user._count.providerBookings : user._count.clientBookings,
      totalRevenue: user.role === 'PROVIDER' 
        ? user.providerBookings.reduce((sum, b) => sum + parseFloat(b.amount), 0)
        : 0,
      totalSpent: user.role === 'CLIENT'
        ? user.clientBookings.reduce((sum, b) => sum + parseFloat(b.amount), 0)
        : 0,
      points: user.userPoints?.currentPoints || 0,
      tier: user.userPoints?.tier || 'BRONZE',
      status: 'active',
      verified: true,
      rating: 4.5
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
