const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { name: 'Hair' },
      update: {},
      create: { name: 'Hair', description: 'Hair styling and treatments', sortOrder: 1 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Makeup' },
      update: {},
      create: { name: 'Makeup', description: 'Professional makeup services', sortOrder: 2 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Nails' },
      update: {},
      create: { name: 'Nails', description: 'Nail care and art', sortOrder: 3 }
    }),
    prisma.serviceCategory.upsert({
      where: { name: 'Skincare' },
      update: {},
      create: { name: 'Skincare', description: 'Facial and skin treatments', sortOrder: 4 }
    })
  ]);

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Hair Styling',
        categoryId: categories[0].id,
        basePrice: 3500,
        duration: 90,
        points: 35,
        description: 'Professional hair styling and treatment'
      }
    }),
    prisma.service.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Makeup Application',
        categoryId: categories[1].id,
        basePrice: 2800,
        duration: 60,
        points: 28,
        description: 'Professional makeup application'
      }
    }),
    prisma.service.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Nail Art',
        categoryId: categories[2].id,
        basePrice: 1500,
        duration: 45,
        points: 15,
        description: 'Creative nail art and manicure'
      }
    }),
    prisma.service.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Facial Treatment',
        categoryId: categories[3].id,
        basePrice: 2200,
        duration: 75,
        points: 22,
        description: 'Deep cleansing facial treatment'
      }
    })
  ]);

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
      customPrice: 3500
    }
  });

  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_001', serviceId: 2 } },
    update: {},
    create: {
      providerId: 'prov_001',
      serviceId: 2,
      customPrice: 2800
    }
  });

  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_002', serviceId: 2 } },
    update: {},
    create: {
      providerId: 'prov_002',
      serviceId: 2,
      customPrice: 2800
    }
  });

  await prisma.providerService.upsert({
    where: { providerId_serviceId: { providerId: 'prov_002', serviceId: 3 } },
    update: {},
    create: {
      providerId: 'prov_002',
      serviceId: 3,
      customPrice: 1500
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
      amount: 3500,
      commission: 525,
      providerEarning: 2975,
      pointsEarned: 35,
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
      amount: 2800,
      commission: 420,
      providerEarning: 2380,
      pointsEarned: 28,
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