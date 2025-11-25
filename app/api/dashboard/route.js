import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole, checkUserStatus } from '@/lib/auth-helper';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userRole !== 'ADMIN') {
      const statusCheck = await checkUserStatus(userId);
      if (!statusCheck.valid) {
        return NextResponse.json({ error: statusCheck.reason }, { status: 403 });
      }
    }

    let dashboardData = {};

    if (userRole === 'ADMIN') {
      // Admin dashboard stats
      const [totalUsers, totalBookings, totalRevenue, recentActivity, topProviders, topClients] = await Promise.all([
        prisma.user.count(),
        prisma.booking.count(),
        prisma.booking.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true, commission: true }
        }),
        prisma.booking.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            client: { select: { name: true } },
            provider: { select: { name: true } },
            service: { select: { name: true } }
          }
        }),
        prisma.user.findMany({
          where: { role: 'PROVIDER' },
          take: 5,
          include: {
            _count: { select: { providerBookings: true, providerReviews: true } },
            providerBookings: {
              where: { status: 'COMPLETED' },
              select: { providerEarning: true, commission: true }
            },
            providerReviews: { select: { rating: true } }
          }
        }),
        prisma.user.findMany({
          where: { role: 'CLIENT' },
          take: 5,
          include: {
            _count: { select: { clientBookings: true } },
            clientBookings: {
              where: { status: 'COMPLETED' },
              select: { amount: true }
            },
            userPoints: true
          }
        })
      ]);

      dashboardData = {
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalCommission: totalRevenue._sum.commission || 0,
        recentActivity: recentActivity.map(b => ({
          id: b.id,
          type: 'booking',
          user: b.client?.name,
          provider: b.provider?.name,
          service: b.service?.name,
          time: new Date(b.createdAt).toLocaleTimeString()
        })),
        topProviders: topProviders.map(p => ({
          id: p.id,
          name: p.name,
          rating: p.providerReviews.length > 0 ? (p.providerReviews.reduce((sum, r) => sum + r.rating, 0) / p.providerReviews.length).toFixed(1) : 0,
          bookings: p._count.providerBookings,
          revenue: p.providerBookings.reduce((sum, b) => sum + parseFloat(b.providerEarning || 0), 0),
          commission: p.providerBookings.reduce((sum, b) => sum + parseFloat(b.commission || 0), 0)
        })),
        topClients: topClients.map(c => ({
          id: c.id,
          name: c.name,
          tier: c.userPoints?.tier || 'BRONZE',
          bookings: c._count.clientBookings,
          spent: c.clientBookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0),
          points: c.userPoints?.currentPoints || 0
        }))
      };

    } else if (userRole === 'PROVIDER') {
      // Provider dashboard stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      console.log('Fetching provider dashboard for userId:', userId);
      
      const [totalStats, allBookingsCount, todayBookings, weeklyStats, monthlyStats] = await Promise.all([
        prisma.booking.aggregate({
          where: { 
            providerId: userId,
            status: 'COMPLETED'
          },
          _sum: { providerEarning: true, amount: true, commission: true },
          _count: true
        }),
        prisma.booking.count({
          where: { providerId: userId }
        }),
        prisma.booking.findMany({
          where: {
            providerId: userId,
            bookingDatetime: {
              gte: today,
              lt: tomorrow
            }
          },
          include: {
            client: { select: { name: true } },
            service: { select: { name: true } }
          },
          orderBy: { bookingDatetime: 'asc' }
        }),
        prisma.booking.aggregate({
          where: {
            providerId: userId,
            status: 'COMPLETED',
            bookingDatetime: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          },
          _sum: { providerEarning: true },
          _count: true
        }),
        // Get monthly stats for the last 6 months
        Promise.all(
          Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            
            return prisma.booking.aggregate({
              where: {
                providerId: userId,
                status: 'COMPLETED',
                createdAt: {
                  gte: startOfMonth,
                  lte: endOfMonth
                }
              },
              _sum: { providerEarning: true, amount: true, commission: true },
              _count: true
            }).then(result => ({
              month: date.toLocaleString('default', { month: 'long' }),
              revenue: result._sum.providerEarning || 0,
              grossRevenue: result._sum.amount || 0,
              commission: result._sum.commission || 0,
              bookings: result._count
            }));
          })
        )
      ]);

      const avgRating = await prisma.review.aggregate({
        where: { providerId: userId },
        _avg: { rating: true },
        _count: true
      });

      console.log('Provider stats:', {
        allBookings: allBookingsCount,
        completedBookings: totalStats._count,
        totalRevenue: totalStats._sum.providerEarning,
        todayBookingsCount: todayBookings.length,
        weeklyBookings: weeklyStats._count
      });

      dashboardData = {
        totalRevenue: totalStats._sum.providerEarning || 0,
        grossRevenue: totalStats._sum.amount || 0,
        totalCommission: totalStats._sum.commission || 0,
        totalBookings: allBookingsCount,
        todayBookings,
        weeklyRevenue: weeklyStats._sum.providerEarning || 0,
        weeklyBookings: weeklyStats._count,
        avgRating: avgRating._avg.rating || 0,
        totalReviews: avgRating._count,
        monthlyStats: monthlyStats.reverse() // Reverse to show oldest to newest
      };

    } else if (userRole === 'CLIENT') {
      // Client dashboard stats
      const [totalStats, upcomingBookings, pointsData] = await Promise.all([
        prisma.booking.aggregate({
          where: { 
            clientId: userId,
            status: 'COMPLETED'
          },
          _sum: { amount: true, pointsEarned: true },
          _count: true
        }),
        prisma.booking.findMany({
          where: {
            clientId: userId,
            status: { in: ['CONFIRMED', 'PAID'] },
            bookingDatetime: { gte: new Date() }
          },
          include: {
            provider: { select: { name: true } },
            service: { select: { name: true } }
          },
          orderBy: { bookingDatetime: 'asc' },
          take: 5
        }),
        prisma.userPoints.findUnique({
          where: { userId }
        })
      ]);

      dashboardData = {
        totalSpent: totalStats._sum.amount || 0,
        totalBookings: totalStats._count,
        totalPointsEarned: totalStats._sum.pointsEarned || 0,
        currentPoints: pointsData?.currentPoints || 0,
        lifetimePoints: pointsData?.lifetimePoints || 0,
        tier: pointsData?.tier || 'BRONZE',
        upcomingBookings
      };
    }

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}