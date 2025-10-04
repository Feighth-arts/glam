// Admin Data - Platform Overview
export const ADMIN_DATA = {
  platformStats: {
    totalUsers: 1247,
    totalProviders: 89,
    totalClients: 1158,
    activeBookings: 156,
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    platformCommission: 0.15,
    avgBookingValue: 2800
  },
  recentActivity: [
    { id: 1, type: 'booking', user: 'Faith Kiplangat', provider: 'Sarah Johnson', service: 'Hair Styling', amount: 3500, time: '2 hours ago' },
    { id: 2, type: 'registration', user: 'New Provider: Mary Beauty', userType: 'provider', time: '4 hours ago' },
    { id: 3, type: 'dispute', user: 'John Doe vs Jane Smith', status: 'pending', time: '6 hours ago' },
    { id: 4, type: 'payout', provider: 'Sarah Johnson', amount: 45000, time: '1 day ago' }
  ],
  pendingApprovals: {
    providers: 12,
    disputes: 3,
    payouts: 8
  },
  topProviders: [
    { id: 1, name: 'Sarah Johnson', revenue: 125000, bookings: 89, rating: 4.8, commission: 18750 },
    { id: 2, name: 'Mary Wanjiku', revenue: 98000, bookings: 67, rating: 4.7, commission: 14700 },
    { id: 3, name: 'Jane Doe', revenue: 76000, bookings: 54, rating: 4.6, commission: 11400 }
  ],
  topClients: [
    { id: 1, name: 'Faith Kiplangat', spent: 125000, bookings: 24, tier: 'Gold', points: 1250 },
    { id: 2, name: 'Grace Mwangi', spent: 89000, bookings: 18, tier: 'Gold', points: 890 },
    { id: 3, name: 'Ann Wanjiru', spent: 67000, bookings: 15, tier: 'Bronze', points: 670 }
  ],
  monthlyMetrics: [
    { month: 'Aug', revenue: 185000, bookings: 234, users: 45 },
    { month: 'Sep', revenue: 210000, bookings: 267, users: 52 },
    { month: 'Oct', revenue: 195000, bookings: 245, users: 38 },
    { month: 'Nov', revenue: 245000, bookings: 298, users: 67 },
    { month: 'Dec', revenue: 220000, bookings: 276, users: 43 },
    { month: 'Jan', revenue: 265000, bookings: 312, users: 58 }
  ]
};

// Normalized User Data for Admin Management
export const NORMALIZED_USERS = {
  providers: [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@beautystudio.com',
      phone: '+254 712 345 678',
      location: 'Westlands, Nairobi',
      specialty: 'Hair Stylist',
      rating: 4.8,
      totalBookings: 89,
      totalRevenue: 125000,
      joinDate: '2023-03-15',
      status: 'active',
      verified: true,
      services: ['Hair Styling', 'Hair Treatment'],
      commission: 18750
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      email: 'mary@glamourpalace.com',
      phone: '+254 723 456 789',
      location: 'CBD, Nairobi',
      specialty: 'Makeup Artist',
      rating: 4.7,
      totalBookings: 67,
      totalRevenue: 98000,
      joinDate: '2023-05-20',
      status: 'active',
      verified: true,
      services: ['Makeup', 'Bridal Makeup'],
      commission: 14700
    }
  ],
  clients: [
    {
      id: 1,
      name: 'Faith Kiplangat',
      email: 'faith.kiplangat@email.com',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      tier: 'Gold',
      totalSpent: 125000,
      totalBookings: 24,
      points: 1250,
      joinDate: '2023-06-15',
      status: 'active',
      favoriteServices: ['Hair Styling', 'Makeup']
    },
    {
      id: 2,
      name: 'Grace Mwangi',
      email: 'grace.mwangi@email.com',
      phone: '+254 723 456 789',
      location: 'Nairobi, Kenya',
      tier: 'Gold',
      totalSpent: 89000,
      totalBookings: 18,
      points: 890,
      joinDate: '2023-07-10',
      status: 'active',
      favoriteServices: ['Nail Art', 'Facial']
    }
  ]
};

// Normalized Booking Data
export const NORMALIZED_BOOKINGS = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Faith Kiplangat',
    providerId: 1,
    providerName: 'Sarah Johnson',
    service: 'Hair Styling',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'upcoming',
    price: 3500,
    commission: 525,
    providerEarning: 2975,
    points: 35,
    location: 'Westlands Salon',
    paymentStatus: 'paid'
  },
  {
    id: 2,
    clientId: 1,
    clientName: 'Faith Kiplangat',
    providerId: 2,
    providerName: 'Mary Wanjiku',
    service: 'Makeup',
    date: '2024-01-20',
    time: '2:30 PM',
    status: 'upcoming',
    price: 2800,
    commission: 420,
    providerEarning: 2380,
    points: 28,
    location: 'CBD Beauty Studio',
    paymentStatus: 'paid'
  },
  {
    id: 3,
    clientId: 2,
    clientName: 'Grace Mwangi',
    providerId: 1,
    providerName: 'Sarah Johnson',
    service: 'Hair Treatment',
    date: '2024-01-10',
    time: '4:00 PM',
    status: 'completed',
    price: 4500,
    commission: 675,
    providerEarning: 3825,
    points: 45,
    location: 'Westlands Salon',
    paymentStatus: 'paid'
  }
];

// Platform Settings
export const PLATFORM_SETTINGS = {
  commission: {
    rate: 0.15,
    minimum: 50,
    maximum: 1000
  },
  points: {
    earningRate: 1,
    bonusPoints: {
      firstBooking: 50,
      review: 10,
      referral: 100
    },
    redemptionMinimum: 50
  },
  payouts: {
    frequency: 'weekly',
    minimumAmount: 1000,
    processingDays: 3
  }
};