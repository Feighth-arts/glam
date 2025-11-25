import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

export async function POST(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, category, price, duration, pointsValue } = await request.json();

    let categoryId = null;
    if (category) {
      let cat = await prisma.serviceCategory.findFirst({ where: { name: category } });
      if (!cat) {
        cat = await prisma.serviceCategory.create({ data: { name: category } });
      }
      categoryId = cat.id;
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        basePrice: price,
        duration,
        points: pointsValue,
        categoryId
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Admin create service error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, description, category, price, duration, pointsValue } = await request.json();

    let categoryId = null;
    if (category) {
      let cat = await prisma.serviceCategory.findFirst({ where: { name: category } });
      if (!cat) {
        cat = await prisma.serviceCategory.create({ data: { name: category } });
      }
      categoryId = cat.id;
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description || '',
        basePrice: price,
        duration,
        points: pointsValue,
        categoryId
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Admin update service error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    await prisma.service.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete service error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
