import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type.toLowerCase(),
      title: notification.title,
      message: notification.message,
      time: getTimeAgo(notification.createdAt),
      read: notification.read,
      icon: getNotificationIcon(notification.type)
    }));

    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, notificationId } = await request.json();

    if (action === 'markAsRead') {
      await prisma.notification.update({
        where: { 
          id: notificationId,
          userId 
        },
        data: { read: true }
      });
    } else if (action === 'markAllAsRead') {
      await prisma.notification.updateMany({
        where: { 
          userId,
          read: false 
        },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId } = await request.json();

    await prisma.notification.delete({
      where: { 
        id: notificationId,
        userId 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
}

function getNotificationIcon(type) {
  const iconMap = {
    'BOOKING': 'Calendar',
    'REVIEW': 'Star', 
    'CLIENT': 'User',
    'PAYMENT': 'DollarSign',
    'SYSTEM': 'Bell'
  };
  return iconMap[type] || 'Bell';
}