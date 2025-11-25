import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        providerServices: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                location: true
              }
            }
          },
          take: 1
        },
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedServices = services.map(service => {
      const avgRating = service.reviews.length > 0
        ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
        : 0;

      const provider = service.providerServices[0]?.provider;

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        duration: service.duration,
        points: service.points,
        category: service.category,
        avgRating,
        totalReviews: service.reviews.length,
        providerName: provider?.name || 'Glamease Provider',
        providerLocation: provider?.location || 'Nairobi',
        providerId: provider?.id
      };
    });

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error('Services with providers error:', error);
    return NextResponse.json([]);
  }
}
