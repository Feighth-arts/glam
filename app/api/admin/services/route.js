import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const userId = getUserId(request);
    const role = getUserRole(request);
    if (!userId || role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Only Manicure and Pedicure services are allowed. Service creation is disabled.' }, { status: 400 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserId(request);
    const role = getUserRole(request);
    if (!userId || role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    // Only allow updating Manicure (1) or Pedicure (2)
    if (![1, 2].includes(parseInt(body.id))) {
      return NextResponse.json({ error: 'Only Manicure and Pedicure services can be modified' }, { status: 400 });
    }

    const service = await prisma.service.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        price: parseFloat(body.price),
        duration: parseInt(body.duration),
        pointsValue: parseInt(body.pointsValue || 0)
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserId(request);
    const role = getUserRole(request);
    if (!userId || role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Prevent deletion of Manicure and Pedicure services
    if ([1, 2].includes(parseInt(id))) {
      return NextResponse.json({ error: 'Cannot delete Manicure or Pedicure services' }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
