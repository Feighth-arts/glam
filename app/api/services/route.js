import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'ACTIVE';

    const where = { status };
    if (category && category !== 'all') {
      where.category = { name: category };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Calculate average ratings
    const servicesWithRatings = await Promise.all(
      services.map(async (service) => {
        const avgRating = await prisma.review.aggregate({
          where: { serviceId: service.id },
          _avg: { rating: true }
        });

        return {
          ...service,
          avgRating: avgRating._avg.rating || 0,
          totalReviews: service._count.reviews,
          totalBookings: service._count.bookings
        };
      })
    );

    return NextResponse.json(servicesWithRatings);
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, categoryId, basePrice, duration, points, description } = body;

    const service = await prisma.service.create({
      data: {
        name,
        categoryId: categoryId ? parseInt(categoryId) : null,
        basePrice: parseFloat(basePrice),
        duration: parseInt(duration),
        points: parseInt(points),
        description,
        status: 'ACTIVE'
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}