import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function GET() {
  try {
    const userId = getUserId();
    const userRole = getUserRole();
    if (!userId || userRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerServices = await prisma.providerService.findMany({
      where: { providerId: userId },
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

    const servicesWithStats = providerServices.map(ps => ({
      id: ps.service.id,
      name: ps.service.name,
      price: ps.customPrice || ps.service.basePrice,
      points: ps.service.points,
      duration: ps.service.duration,
      ratings: ps.service.reviews.length > 0 
        ? ps.service.reviews.reduce((sum, r) => sum + r.rating, 0) / ps.service.reviews.length 
        : 0,
      totalRatings: ps.service.reviews.length,
      availability: ps.availability || {
        days: [],
        timeSlots: []
      },
      category: ps.service.category?.name,
      totalBookings: ps.service._count.bookings
    }));

    return NextResponse.json(servicesWithStats);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserId();
    const userRole = getUserRole();
    if (!userId || userRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, points, duration, availability, categoryId, serviceId } = await request.json();

    if (serviceId) {
      // Adding existing service to provider
      const providerService = await prisma.providerService.create({
        data: {
          providerId: userId,
          serviceId: parseInt(serviceId),
          customPrice: parseFloat(price),
          availability: availability || { days: [], timeSlots: [] }
        },
        include: {
          service: {
            include: {
              category: true
            }
          }
        }
      });

      return NextResponse.json({
        id: providerService.service.id,
        name: providerService.service.name,
        price: providerService.customPrice || providerService.service.basePrice,
        points: providerService.service.points,
        duration: providerService.service.duration,
        ratings: 0,
        totalRatings: 0,
        availability: providerService.availability || { days: [], timeSlots: [] },
        category: providerService.service.category?.name
      });
    } else {
      // Create new service and add to provider
      const service = await prisma.service.create({
        data: {
          name,
          basePrice: parseFloat(price),
          points: parseInt(points),
          duration: parseInt(duration),
          categoryId: categoryId || 1
        },
        include: {
          category: true
        }
      });

      const providerService = await prisma.providerService.create({
        data: {
          providerId: userId,
          serviceId: service.id,
          customPrice: parseFloat(price),
          availability: availability || { days: [], timeSlots: [] }
        }
      });

      return NextResponse.json({
        id: service.id,
        name: service.name,
        price: parseFloat(price),
        points: service.points,
        duration: service.duration,
        ratings: 0,
        totalRatings: 0,
        availability: availability || { days: [], timeSlots: [] },
        category: service.category?.name
      });
    }
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}