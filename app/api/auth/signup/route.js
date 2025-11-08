import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { validateEmail, sanitizeString, validateUserData } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`signup:${clientIp}`, 5, 300000);
    
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many signup attempts. Please try again later.' }, { status: 429 });
    }

    const { email, password, name, phone, role } = await request.json();

    // Validate input
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const validation = validateUserData({ name, email, phone });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: sanitizeString(name),
        phone: sanitizeString(phone),
        role: role || 'CLIENT'
      }
    });

    if (user.role === 'CLIENT') {
      await prisma.userPoints.create({
        data: {
          userId: user.id,
          currentPoints: 0,
          lifetimePoints: 0,
          tier: 'BRONZE'
        }
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
