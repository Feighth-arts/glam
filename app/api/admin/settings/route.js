import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, getUserRole } from '@/lib/auth-helper';

const defaultSettings = {
  platform: {
    siteName: 'Glamease',
    siteDescription: 'Your premier beauty services platform',
    supportEmail: 'support@glamease.com',
    maintenanceMode: false,
    allowRegistrations: true
  },
  commission: {
    rate: 0.15,
    minimum: 50,
    maximum: 5000
  },
  points: {
    earningRate: 10,
    bonusPoints: { firstBooking: 500, review: 50, referral: 200 },
    redemptionMinimum: 100,
    expiryMonths: 12
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  },
  security: {
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8
  }
};

export async function GET(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.platformSetting.findMany();
    
    if (settings.length === 0) {
      return NextResponse.json(defaultSettings);
    }

    const result = {};
    settings.forEach(s => {
      if (!result[s.category]) result[s.category] = {};
      result[s.category][s.key] = s.value;
    });

    return NextResponse.json({ ...defaultSettings, ...result });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request) {
  try {
    const userId = getUserId(request);
    const userRole = getUserRole(request);
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reset = searchParams.get('reset');

    if (reset) {
      await prisma.platformSetting.deleteMany();
      return NextResponse.json(defaultSettings);
    }

    const settings = await request.json();

    for (const [category, values] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(values)) {
        await prisma.platformSetting.upsert({
          where: { category_key: { category, key } },
          update: { value, updatedBy: userId },
          create: { category, key, value, updatedBy: userId }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin settings POST error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
