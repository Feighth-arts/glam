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

    const formattedNotifications = notifications.map(notification => {
      const content = typeof notification.content === 'string' ? JSON.parse(notification.content) : notification.content;
      return {
        id: notification.id,
        type: content.type || 'system',
        title: notification.subject || content.title || 'Notification',
        message: content.message || '',
        time: getTimeAgo(notification.createdAt),
        read: notification.status === 'SENT',
        icon: getNotificationIcon(notification.type),
        bg: getNotificationBg(content.type),
        color: getNotificationColor(content.type)
      };
    });

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
        data: { status: 'SENT' }
      });
    } else if (action === 'markAllAsRead') {
      await prisma.notification.updateMany({
        where: { 
          userId,
          status: 'PENDING'
        },
        data: { status: 'SENT' }
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
    'booking': 'Calendar',
    'review': 'Star', 
    'reward': 'Gift',
    'reminder': 'Bell',
    'promotion': 'Gift'
  };
  return iconMap[type] || 'Bell';
}

function getNotificationBg(type) {
  const bgMap = {
    'booking': 'bg-blue-50',
    'review': 'bg-yellow-50',
    'reward': 'bg-purple-50',
    'reminder': 'bg-yellow-50',
    'promotion': 'bg-green-50'
  };
  return bgMap[type] || 'bg-gray-50';
}

function getNotificationColor(type) {
  const colorMap = {
    'booking': 'text-blue-600',
    'review': 'text-yellow-600',
    'reward': 'text-purple-600',
    'reminder': 'text-yellow-600',
    'promotion': 'text-green-600'
  };
  return colorMap[type] || 'text-gray-600';
}