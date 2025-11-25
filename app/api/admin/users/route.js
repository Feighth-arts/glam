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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'providers';

    const users = await prisma.user.findMany({
      where: { 
        role: type === 'providers' ? 'PROVIDER' : 'CLIENT'
      },
      include: {
        userPoints: true,
        _count: {
          select: {
            clientBookings: true,
            providerBookings: true
          }
        }
      }
    });

    const usersWithStats = await Promise.all(users.map(async (user) => {
      if (user.role === 'PROVIDER') {
        const stats = await prisma.booking.aggregate({
          where: { 
            providerId: user.id,
            status: 'COMPLETED'
          },
          _sum: { providerEarning: true }
        });

        const avgRating = await prisma.review.aggregate({
          where: { providerId: user.id },
          _avg: { rating: true }
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status.toLowerCase(),
          verified: true,
          specialty: user.specialty || 'Beauty Provider',
          experience: user.experience,
          totalRevenue: parseFloat(stats._sum.providerEarning || 0),
          totalBookings: user._count.providerBookings,
          rating: parseFloat(avgRating._avg.rating || 0).toFixed(1),
          joinDate: user.createdAt,
          role: user.role
        };
      } else {
        const stats = await prisma.booking.aggregate({
          where: { 
            clientId: user.id,
            status: 'COMPLETED'
          },
          _sum: { amount: true }
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status.toLowerCase(),
          verified: true,
          tier: user.userPoints?.tier || 'BRONZE',
          points: user.userPoints?.currentPoints || 0,
          totalSpent: parseFloat(stats._sum.amount || 0),
          totalBookings: user._count.clientBookings,
          joinDate: user.createdAt,
          role: user.role
        };
      }
    }));

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, status } = await request.json();

    await prisma.user.update({
      where: { id: targetUserId },
      data: { status }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
