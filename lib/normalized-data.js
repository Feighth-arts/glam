// NORMALIZED DATA STRUCTURE - Single Source of Truth

// Core Platform Settings
export const PLATFORM_CONFIG = {
  commission: {
    rate: 0.15, // 15%
    minimum: 50,
    maximum: 1000
  },
  points: {
    earningRate: 1, // 1 point per KES 100
    bonusPoints: {
      firstBooking: 50,
      review: 10,
      referral: 100,
      birthdayMultiplier: 2
    },
    redemptionMinimum: 50,
    expiryMonths: 12
  },
  tiers: {
    bronze: { min: 0, max: 499, name: "Bronze" },
    gold: { min: 500, max: 1999, name: "Gold" },
    platinum: { min: 2000, max: Infinity, name: "Platinum" }
  }
};

// Service Catalog - Master List
export const SERVICE_CATALOG = [
  {
    id: 1,
    name: "Hair Styling",
    category: "Hair",
    basePrice: 3500,
    duration: 90,
    points: 35,
    description: "Professional hair styling and treatment"
  },
  {
    id: 2,
    name: "Makeup Application",
    category: "Makeup", 
    basePrice: 2800,
    duration: 60,
    points: 28,
    description: "Professional makeup application"
  },
  {
    id: 3,
    name: "Nail Art",
    category: "Nails",
    basePrice: 1500,
    duration: 45,
    points: 15,
    description: "Creative nail art and manicure"
  },
  {
    id: 4,
    name: "Facial Treatment",
    category: "Skincare",
    basePrice: 2200,
    duration: 75,
    points: 22,
    description: "Deep cleansing facial treatment"
  }
];

// Users - Normalized Structure
export const USERS = {
  providers: [
    {
      id: "prov_001",
      name: "Sarah Johnson",
      email: "sarah.johnson@beautystudio.com",
      phone: "+254 712 345 678",
      location: "Westlands, Nairobi",
      specialty: "Hair Stylist & Makeup Artist",
      rating: 4.8,
      totalRatings: 156,
      joinDate: "2023-03-15",
      status: "active",
      verified: true,
      businessName: "Sarah Beauty Studio",
      license: "CS-2023-001",
      services: [1, 2], // Service IDs
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      workingHours: { start: "09:00", end: "18:00" },
      stats: {
        totalBookings: 89,
        totalRevenue: 125000,
        weeklyBookings: 12,
        weeklyRevenue: 18500,
        newClients: 8,
        commission: 18750 // 15% of revenue
      }
    },
    {
      id: "prov_002", 
      name: "Mary Wanjiku",
      email: "mary.wanjiku@glamourpalace.com",
      phone: "+254 723 456 789",
      location: "CBD, Nairobi",
      specialty: "Makeup Artist & Nail Technician",
      rating: 4.7,
      totalRatings: 89,
      joinDate: "2023-05-20",
      status: "active",
      verified: true,
      businessName: "Glamour Palace",
      license: "CS-2023-002",
      services: [2, 3],
      workingDays: ["tuesday", "wednesday", "thursday", "friday", "saturday"],
      workingHours: { start: "10:00", end: "19:00" },
      stats: {
        totalBookings: 67,
        totalRevenue: 98000,
        weeklyBookings: 9,
        weeklyRevenue: 14200,
        newClients: 5,
        commission: 14700
      }
    }
  ],
  clients: [
    {
      id: "client_001",
      name: "Faith Kiplangat", 
      email: "faith.kiplangat@email.com",
      phone: "+254 712 345 678",
      location: "Nairobi, Kenya",
      birthday: "1995-08-20",
      joinDate: "2023-06-15",
      status: "active",
      tier: "Gold",
      stats: {
        totalBookings: 24,
        totalSpent: 125000,
        pointsEarned: 1250,
        pointsRedeemed: 450,
        currentPoints: 800,
        lifetimePoints: 1700,
        favoriteService: "Hair Styling",
        favoriteProvider: "prov_001"
      }
    },
    {
      id: "client_002",
      name: "Grace Mwangi",
      email: "grace.mwangi@email.com", 
      phone: "+254 723 456 789",
      location: "Nairobi, Kenya",
      birthday: "1992-03-12",
      joinDate: "2023-07-10",
      status: "active",
      tier: "Gold",
      stats: {
        totalBookings: 18,
        totalSpent: 89000,
        pointsEarned: 890,
        pointsRedeemed: 200,
        currentPoints: 690,
        lifetimePoints: 1090,
        favoriteService: "Makeup Application",
        favoriteProvider: "prov_002"
      }
    }
  ]
};

// Bookings - Normalized Structure
export const BOOKINGS = [
  {
    id: "book_001",
    clientId: "client_001",
    providerId: "prov_001", 
    serviceId: 1,
    date: "2024-01-15",
    time: "10:00",
    status: "upcoming",
    price: 3500,
    commission: 525, // 15%
    providerEarning: 2975,
    points: 35,
    location: "Westlands, Nairobi",
    paymentStatus: "paid",
    rewardUsed: null,
    createdAt: "2024-01-10T09:00:00Z"
  },
  {
    id: "book_002",
    clientId: "client_001", 
    providerId: "prov_002",
    serviceId: 2,
    date: "2024-01-20",
    time: "14:30",
    status: "upcoming", 
    price: 2800,
    commission: 420,
    providerEarning: 2380,
    points: 28,
    location: "CBD, Nairobi",
    paymentStatus: "paid",
    rewardUsed: { id: "reward_001", name: "10% Off Next Service", discount: 10 },
    createdAt: "2024-01-12T11:30:00Z"
  },
  {
    id: "book_003",
    clientId: "client_002",
    providerId: "prov_001",
    serviceId: 1,
    date: "2024-01-10", 
    time: "16:00",
    status: "completed",
    price: 3500,
    commission: 525,
    providerEarning: 2975,
    points: 35,
    location: "Westlands, Nairobi",
    paymentStatus: "paid",
    rewardUsed: null,
    createdAt: "2024-01-08T14:20:00Z",
    completedAt: "2024-01-10T17:30:00Z",
    reviewed: true,
    rating: 5
  }
];

// Rewards Catalog
export const REWARDS_CATALOG = {
  discounts: [
    { 
      id: "reward_001", 
      name: "10% Off Next Service", 
      points: 100, 
      discount: 10, 
      limit: "monthly", 
      minSpend: 1000,
      category: "all"
    },
    { 
      id: "reward_002", 
      name: "20% Off Hair Services", 
      points: 500, 
      discount: 20, 
      limit: "quarterly", 
      minSpend: 1500,
      category: "Hair"
    },
    { 
      id: "reward_003", 
      name: "25% Off Any Service", 
      points: 750, 
      discount: 25, 
      limit: "yearly", 
      minSpend: 2000,
      category: "all"
    }
  ],
  services: [
    { 
      id: "reward_004", 
      name: "Free Basic Manicure", 
      points: 300, 
      value: 1500, 
      category: "Nails",
      serviceId: 3
    },
    { 
      id: "reward_005", 
      name: "Free Makeup Session", 
      points: 800, 
      value: 2800, 
      category: "Makeup",
      serviceId: 2
    }
  ]
};

// Status Enums
export const STATUS_ENUMS = {
  booking: ["upcoming", "confirmed", "in-progress", "completed", "cancelled", "no-show"],
  payment: ["pending", "paid", "failed", "refunded"],
  user: ["active", "inactive", "suspended", "pending"],
  provider: ["active", "inactive", "pending", "verified", "rejected"]
};

// Helper Functions
export const getServiceById = (id) => SERVICE_CATALOG.find(service => service.id === id);
export const getUserById = (id, type) => USERS[type]?.find(user => user.id === id);
export const getBookingById = (id) => BOOKINGS.find(booking => booking.id === id);

export const calculateCommission = (amount) => Math.round(amount * PLATFORM_CONFIG.commission.rate);
export const calculatePoints = (amount) => Math.floor(amount / 100);
export const getUserTier = (points) => {
  if (points >= PLATFORM_CONFIG.tiers.platinum.min) return "Platinum";
  if (points >= PLATFORM_CONFIG.tiers.gold.min) return "Gold";
  return "Bronze";
};

// Data Aggregation Functions
export const getProviderStats = (providerId) => {
  const provider = getUserById(providerId, 'providers');
  const providerBookings = BOOKINGS.filter(b => b.providerId === providerId);
  
  return {
    totalBookings: providerBookings.length,
    totalRevenue: providerBookings.reduce((sum, b) => sum + b.providerEarning, 0),
    totalCommission: providerBookings.reduce((sum, b) => sum + b.commission, 0),
    completedBookings: providerBookings.filter(b => b.status === 'completed').length,
    upcomingBookings: providerBookings.filter(b => b.status === 'upcoming').length,
    avgRating: provider?.rating || 0
  };
};

export const getClientStats = (clientId) => {
  const client = getUserById(clientId, 'clients');
  const clientBookings = BOOKINGS.filter(b => b.clientId === clientId);
  
  return {
    totalBookings: clientBookings.length,
    totalSpent: clientBookings.reduce((sum, b) => sum + b.price, 0),
    pointsEarned: clientBookings.reduce((sum, b) => sum + b.points, 0),
    completedBookings: clientBookings.filter(b => b.status === 'completed').length,
    upcomingBookings: clientBookings.filter(b => b.status === 'upcoming').length,
    favoriteService: client?.stats?.favoriteService || "None"
  };
};

export const getPlatformStats = () => {
  const totalRevenue = BOOKINGS.reduce((sum, b) => sum + b.price, 0);
  const totalCommission = BOOKINGS.reduce((sum, b) => sum + b.commission, 0);
  
  return {
    totalUsers: USERS.providers.length + USERS.clients.length,
    totalProviders: USERS.providers.length,
    totalClients: USERS.clients.length,
    totalBookings: BOOKINGS.length,
    totalRevenue,
    totalCommission,
    avgBookingValue: BOOKINGS.length > 0 ? Math.round(totalRevenue / BOOKINGS.length) : 0,
    activeBookings: BOOKINGS.filter(b => ['upcoming', 'confirmed'].includes(b.status)).length
  };
};