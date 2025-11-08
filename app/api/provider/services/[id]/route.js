import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function PUT(request, { params }) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    if (!userId || userRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, price, points, duration, availability } = await request.json();

    // Update the provider service relationship
    const providerService = await prisma.providerService.update({
      where: { 
        providerId_serviceId: {
          providerId: userId,
          serviceId: parseInt(id)
        }
      },
      data: {
        customPrice: parseFloat(price),
        customPoints: points ? parseInt(points) : null,
        availability: availability || { days: [], timeSlots: [] }
      },
      include: {
        service: {
          include: {
            category: true,
            reviews: {
              where: { providerId: userId },
              select: { rating: true }
            },
            _count: {
              select: { 
                bookings: {
                  where: { providerId: userId }
                }
              }
            }
          }
        }
      }
    });

    // Also update the base service if needed
    if (name || points || duration) {
      await prisma.service.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(points && { points: parseInt(points) }),
          ...(duration && { duration: parseInt(duration) })
        }
      });
    }

    return NextResponse.json({
      id: providerService.service.id,
      name: providerService.service.name,
      price: providerService.customPrice || providerService.service.basePrice,
      points: providerService.customPoints || providerService.service.points,
      duration: providerService.service.duration,
      ratings: providerService.service.reviews.length > 0 
        ? providerService.service.reviews.reduce((sum, r) => sum + r.rating, 0) / providerService.service.reviews.length 
        : 0,
      totalRatings: providerService.service.reviews.length,
      availability: providerService.availability || { days: [], timeSlots: [] },
      category: providerService.service.category?.name,
      totalBookings: providerService.service._count.bookings
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    if (!userId || userRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Remove the provider service relationship
    await prisma.providerService.delete({
      where: { 
        providerId_serviceId: {
          providerId: userId,
          serviceId: parseInt(id)
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}