import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const providers = await prisma.user.findMany({
      where: { role: 'PROVIDER', status: 'ACTIVE' },
      include: {
        providerServices: {
          where: {
            serviceId: { in: [1, 2] } // Only Manicure and Pedicure
          },
          include: {
            service: {
              include: {
                category: true
              }
            }
          }
        },
        providerReviews: {
          select: { rating: true }
        }
      }
    });

    const providersWithServices = providers.map(provider => {
      const avgRating = provider.providerReviews.length > 0
        ? provider.providerReviews.reduce((sum, r) => sum + r.rating, 0) / provider.providerReviews.length
        : 0;
      
      return {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        location: provider.location || 'Nairobi',
        rating: avgRating,
        reviews: provider.providerReviews.length,
        services: provider.providerServices.map(ps => ({
          id: ps.service.id,
          name: ps.service.name,
          price: parseFloat(ps.customPrice || ps.service.basePrice),
          duration: ps.service.duration,
          points: ps.customPoints || ps.service.points,
          ratings: avgRating,
          category: ps.service.category?.name
        }))
      };
    }).filter(p => p.services.length > 0);

    return NextResponse.json(providersWithServices);
  } catch (error) {
    console.error('Client services API error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
