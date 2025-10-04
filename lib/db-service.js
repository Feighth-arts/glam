import { prisma } from './prisma';

// User operations
export const userService = {
  create: async (data) => {
    return await prisma.user.create({ data });
  },
  
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ 
      where: { email },
      include: { userPoints: true }
    });
  },
  
  findById: async (id) => {
    return await prisma.user.findUnique({ 
      where: { id },
      include: { userPoints: true }
    });
  },
  
  update: async (id, data) => {
    return await prisma.user.update({ where: { id }, data });
  }
};

// Booking operations
export const bookingService = {
  create: async (data) => {
    return await prisma.booking.create({ 
      data,
      include: { client: true, provider: true, service: true }
    });
  },
  
  findByUser: async (userId, role) => {
    const where = role === 'provider' ? { providerId: userId } : { clientId: userId };
    return await prisma.booking.findMany({
      where,
      include: { client: true, provider: true, service: true, payment: true },
      orderBy: { createdAt: 'desc' }
    });
  },
  
  update: async (id, data) => {
    return await prisma.booking.update({ where: { id }, data });
  }
};

// Payment operations
export const paymentService = {
  create: async (data) => {
    return await prisma.payment.create({ data });
  },
  
  findById: async (id) => {
    return await prisma.payment.findUnique({ 
      where: { id },
      include: { booking: true }
    });
  },
  
  update: async (id, data) => {
    return await prisma.payment.update({ where: { id }, data });
  },
  
  findPending: async () => {
    return await prisma.payment.findMany({
      where: { status: 'INITIATED' },
      include: { booking: { include: { client: true, provider: true } } }
    });
  }
};

// Service operations
export const serviceService = {
  findAll: async () => {
    return await prisma.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' }
    });
  },
  
  findById: async (id) => {
    return await prisma.service.findUnique({ where: { id } });
  }
};

// Notification operations
export const notificationService = {
  create: async (data) => {
    return await prisma.notification.create({ data });
  },
  
  findByUser: async (userId) => {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },
  
  markAsSent: async (id) => {
    return await prisma.notification.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() }
    });
  }
};

// Points operations
export const pointsService = {
  award: async (userId, points) => {
    return await prisma.userPoints.upsert({
      where: { userId },
      update: {
        currentPoints: { increment: points },
        lifetimePoints: { increment: points }
      },
      create: {
        userId,
        currentPoints: points,
        lifetimePoints: points
      }
    });
  },
  
  redeem: async (userId, points) => {
    return await prisma.userPoints.update({
      where: { userId },
      data: { currentPoints: { decrement: points } }
    });
  }
};