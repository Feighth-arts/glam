import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const providers = await prisma.user.findMany({
      where: { role: 'PROVIDER' },
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
        }
      }
    });

    const providersWithServices = providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      location: provider.location,
      rating: 4.5,
      reviews: 0,
      distance: "2.1 km",
      services: provider.providerServices.map(ps => ({
        id: ps.service.id,
        name: ps.service.name,
        price: parseFloat(ps.customPrice || ps.service.basePrice),
        duration: ps.service.duration,
        points: ps.customPoints || ps.service.points,
        ratings: 4.5,
        category: ps.service.category?.name
      }))
    })).filter(p => p.services.length > 0);

    return NextResponse.json(providersWithServices);
  } catch (error) {
    console.error('Client services API error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
