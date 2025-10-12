import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPoints: true,
        providerServices: {
          include: {
            service: {
              include: { category: true }
            }
          }
        },
        _count: {
          select: {
            clientBookings: true,
            providerBookings: true,
            clientReviews: true,
            providerReviews: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate additional stats based on role
    let stats = {};
    if (user.role === 'PROVIDER') {
      const earnings = await prisma.booking.aggregate({
        where: { 
          providerId: userId,
          status: 'COMPLETED'
        },
        _sum: {
          providerEarning: true,
          commission: true
        },
        _count: true
      });

      const avgRating = await prisma.review.aggregate({
        where: { providerId: userId },
        _avg: { rating: true }
      });

      stats = {
        totalEarnings: earnings._sum.providerEarning || 0,
        totalCommission: earnings._sum.commission || 0,
        completedBookings: earnings._count,
        avgRating: avgRating._avg.rating || 0,
        totalReviews: user._count.providerReviews
      };
    } else if (user.role === 'CLIENT') {
      const spending = await prisma.booking.aggregate({
        where: { 
          clientId: userId,
          status: 'COMPLETED'
        },
        _sum: { amount: true },
        _count: true
      });

      stats = {
        totalSpent: spending._sum.amount || 0,
        completedBookings: spending._count,
        currentPoints: user.userPoints?.currentPoints || 0,
        lifetimePoints: user.userPoints?.lifetimePoints || 0,
        tier: user.userPoints?.tier || 'BRONZE'
      };
    }

    return NextResponse.json({
      ...user,
      stats
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, location, experience, license, specialty, workingDays, workingHours } = body;

    const updateData = {
      name,
      phone,
      location
    };

    // Add provider-specific fields if they exist
    if (experience !== undefined) updateData.experience = experience;
    if (license !== undefined) updateData.license = license;
    if (specialty !== undefined) updateData.specialty = specialty;
    if (workingDays !== undefined) updateData.workingDays = workingDays;
    if (workingHours !== undefined) updateData.workingHours = workingHours;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        userPoints: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}