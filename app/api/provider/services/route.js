import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function GET(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    if (!userId || userRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerServices = await prisma.providerService.findMany({
      where: { 
        providerId: userId,
        serviceId: { in: [1, 2] } // Only Manicure and Pedicure
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

    const servicesWithStats = providerServices.map(ps => ({
      id: ps.service.id,
      name: ps.service.name,
      price: ps.customPrice || ps.service.basePrice,
      points: ps.customPoints || ps.service.points,
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
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    if (!userId || userRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, points, duration, availability, categoryId, serviceId } = await request.json();

    // Only allow Manicure (1) or Pedicure (2)
    if (serviceId && ![1, 2].includes(parseInt(serviceId))) {
      return NextResponse.json({ error: 'Only Manicure and Pedicure services are allowed' }, { status: 400 });
    }

    if (serviceId) {
      // Adding existing service to provider
      const providerService = await prisma.providerService.create({
        data: {
          providerId: userId,
          serviceId: parseInt(serviceId),
          customPrice: parseFloat(price),
          customPoints: points ? parseInt(points) : null,
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
        points: providerService.customPoints || providerService.service.points,
        duration: providerService.service.duration,
        ratings: 0,
        totalRatings: 0,
        availability: providerService.availability || { days: [], timeSlots: [] },
        category: providerService.service.category?.name
      });
    } else {
      // Prevent creating new services - only Manicure and Pedicure allowed
      return NextResponse.json({ error: 'Only Manicure and Pedicure services are allowed. Please select from existing services.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}