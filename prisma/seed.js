const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create service categories
  const nailsCategory = await prisma.serviceCategory.upsert({
    where: { name: 'Nails' },
    update: {},
    create: { name: 'Nails', description: 'Manicure and Pedicure services', sortOrder: 1 }
  });

  // Create services - Manicure and Pedicure only
  const manicure = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Manicure',
      categoryId: nailsCategory.id,
      basePrice: 1500,
      duration: 45,
      points: 15,
      description: 'Professional manicure with nail shaping, cuticle care, and polish'
    }
  });

  const pedicure = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Pedicure',
      categoryId: nailsCategory.id,
      basePrice: 2000,
      duration: 60,
      points: 20,
      description: 'Complete pedicure with foot soak, exfoliation, and polish'
    }
  });

  // Create users
  const admin = await prisma.user.upsert({
    where: { id: 'admin_001' },
    update: {},
    create: {
      id: 'admin_001',
      email: 'admin@glamease.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+254700000001',
      role: 'ADMIN',
      location: 'Nairobi, Kenya'
    }
  });

  const provider1 = await prisma.user.upsert({
    where: { id: 'prov_001' },
    update: { name: 'Mercy Johnson' },
    create: {
      id: 'prov_001',
      email: 'mercy.johnson@beautystudio.com',
      password: hashedPassword,
      name: 'Mercy Johnson',
      phone: '+254712345678',
      role: 'PROVIDER',
      location: 'Westlands, Nairobi'
    }
  });

  const provider2 = await prisma.user.upsert({
    where: { id: 'prov_002' },
    update: {},
    create: {
      id: 'prov_002',
      email: 'mary.wanjiku@glamourpalace.com',
      password: hashedPassword,
      name: 'Mary Wanjiku',
      phone: '+254723456789',
      role: 'PROVIDER',
      location: 'CBD, Nairobi'
    }
  });

  const client1 = await prisma.user.upsert({
    where: { id: 'client_001' },
    update: {},
    create: {
      id: 'client_001',
      email: 'faith.kiplangat@email.com',
      password: hashedPassword,
      name: 'Faith Kiplangat',
      phone: '+254734567890',
      role: 'CLIENT',
      location: 'Nairobi, Kenya'
    }
  });

  const client2 = await prisma.user.upsert({
    where: { id: 'client_002' },
    update: {},
    create: {
      id: 'client_002',
      email: 'grace.mwangi@email.com',
      password: hashedPassword,
      name: 'Grace Mwangi',
      phone: '+254745678901',
      role: 'CLIENT',
      location: 'Nairobi, Kenya'
    }
  });

  // Create provider services
  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_001', serviceId: 1 } },
    update: {},
    create: {
      providerId: 'prov_001',
      serviceId: 1,
      customPrice: 1500
    }
  });

  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_001', serviceId: 2 } },
    update: {},
    create: {
      providerId: 'prov_001',
      serviceId: 2,
      customPrice: 2000
    }
  });

  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_002', serviceId: 1 } },
    update: {},
    create: {
      providerId: 'prov_002',
      serviceId: 1,
      customPrice: 1500
    }
  });

  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_002', serviceId: 2 } },
    update: {},
    create: {
      providerId: 'prov_002',
      serviceId: 2,
      customPrice: 2000
    }
  });

  // Create user points
  await prisma.userPoints.upsert({
    where: { userId: 'client_001' },
    update: {},
    create: {
      userId: 'client_001',
      currentPoints: 800,
      lifetimePoints: 1700,
      tier: 'GOLD'
    }
  });

  await prisma.userPoints.upsert({
    where: { userId: 'client_002' },
    update: {},
    create: {
      userId: 'client_002',
      currentPoints: 690,
      lifetimePoints: 1090,
      tier: 'GOLD'
    }
  });

  // Create sample bookings
  const booking1 = await prisma.booking.upsert({
    where: { id: 'book_001' },
    update: {},
    create: {
      id: 'book_001',
      clientId: 'client_001',
      providerId: 'prov_001',
      serviceId: 1,
      bookingDatetime: new Date('2024-01-15T10:00:00Z'),
      status: 'COMPLETED',
      amount: 1500,
      commission: 225,
      providerEarning: 1275,
      pointsEarned: 15,
      location: 'Westlands, Nairobi'
    }
  });

  const booking2 = await prisma.booking.upsert({
    where: { id: 'book_002' },
    update: {},
    create: {
      id: 'book_002',
      clientId: 'client_001',
      providerId: 'prov_002',
      serviceId: 2,
      bookingDatetime: new Date('2024-01-20T14:30:00Z'),
      status: 'CONFIRMED',
      amount: 2000,
      commission: 300,
      providerEarning: 1700,
      pointsEarned: 20,
      location: 'CBD, Nairobi'
    }
  });

  // Create sample reviews
  await prisma.review.upsert({
    where: { bookingId: 'book_001' },
    update: {},
    create: {
      bookingId: 'book_001',
      clientId: 'client_001',
      providerId: 'prov_001',
      serviceId: 1,
      rating: 5,
      comment: 'Excellent service! Very professional and skilled.'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });