import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, type, title, message } = await request.json();

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        status: 'SENT',
        subject: title,
        content: { message },
        sentAt: new Date()
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
