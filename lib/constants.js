// Centralized data constants for provider system
export const PROVIDER_DATA = {
  profile: {
    name: "Sarah Beauty Studio",
    email: "sarah@beautystudio.com", 
    phone: "+1 (555) 123-4567",
    location: "Downtown Beauty Plaza, San Francisco",
    experience: "5",
    license: "Cosmetology License #CS-2019-4567",
    specialty: "Nail Artist & Spa Specialist",
    rating: 4.8,
    clients: 156,
    joinDate: "2019",
    verified: true,
    workingDays: {
      monday: true,
      tuesday: true, 
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    workingHours: {
      start: "09:00",
      end: "18:00"
    }
  },
  
  services: [
    {
      id: 1,
      name: "Hair Styling",
      price: 2500,
      points: 25,
      duration: 90,
      ratings: 4.8,
      totalRatings: 128,
      availability: {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        timeSlots: ['09:00', '11:00', '14:00', '16:00']
      }
    },
    {
      id: 2,
      name: "Makeup",
      price: 3000,
      points: 30,
      duration: 60,
      ratings: 4.8,
      totalRatings: 95,
      availability: {
        days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        timeSlots: ['10:00', '13:00', '15:00', '17:00']
      }
    }
  ],

  stats: {
    totalRevenue: 45200,
    bookingsToday: 8,
    totalClients: 156,
    avgRating: 4.8,
    weeklyBookings: 24,
    weeklyRevenue: 12400,
    newClients: 18
  }
};

export const AVAILABLE_SERVICES = [
  { id: 1, name: "Hair Styling" },
  { id: 2, name: "Makeup" },
  { id: 3, name: "Nail Art" },
  { id: 4, name: "Facial Treatment" }
];

// Points System Configuration
export const POINTS_CONFIG = {
  earningRate: 1, // 1 point per KES 100
  bonusPoints: {
    firstBooking: 50,
    review: 10,
    referral: 100,
    birthdayMultiplier: 2
  },
  tiers: {
    bronze: { min: 0, max: 499, name: "Bronze" },
    gold: { min: 500, max: 1999, name: "Gold" },
    platinum: { min: 2000, max: Infinity, name: "Platinum" }
  },
  expiryMonths: 12
};

export const REWARDS_CATALOG = {
  discounts: [
    { id: 1, name: "10% Off Next Service", points: 100, discount: 10, limit: "monthly", minSpend: 1000 },
    { id: 2, name: "20% Off Hair Services", points: 500, discount: 20, category: "Hair", limit: "quarterly", minSpend: 1500 },
    { id: 3, name: "25% Off Any Service", points: 750, discount: 25, limit: "yearly", minSpend: 2000 }
  ],
  services: [
    { id: 4, name: "Free Basic Manicure", points: 300, value: 1500, category: "Nails" },
    { id: 5, name: "Free Makeup Session", points: 800, value: 3000, category: "Makeup" },
    { id: 6, name: "Free Hair Wash & Blow Dry", points: 400, value: 2000, category: "Hair" }
  ]
};

// Client Data
export const CLIENT_DATA = {
  profile: {
    name: "Faith Kiplangat",
    email: "faith.kiplangat@email.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    memberSince: "2023-06-15",
    birthday: "1995-08-20",
    totalPoints: 1250,
    tier: "Gold"
  },
  stats: {
    totalBookings: 24,
    totalSpent: 125000,
    favoriteService: "Hair Styling",
    pointsEarned: 1250,
    pointsRedeemed: 450,
    upcomingBookings: 2,
    completedBookings: 22,
    lifetimePoints: 1700
  },
  bookings: [
    {
      id: 1,
      provider: "Sarah Johnson",
      service: "Hair Styling",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "upcoming",
      price: 3500,
      points: 35,
      location: "Westlands Salon",
      rewardUsed: null
    },
    {
      id: 2,
      provider: "Mary Wanjiku",
      service: "Makeup",
      date: "2024-01-20",
      time: "2:30 PM",
      status: "upcoming",
      price: 2800,
      points: 28,
      location: "CBD Beauty Studio",
      rewardUsed: { id: 1, name: "10% Off Next Service", discount: 10 }
    },
    {
      id: 3,
      provider: "Jane Doe",
      service: "Nail Art",
      date: "2024-01-10",
      time: "4:00 PM",
      status: "completed",
      price: 1500,
      points: 15,
      location: "Karen Nails",
      rewardUsed: null,
      reviewed: true
    }
  ],
  pointsHistory: [
    { id: 1, type: "earned", points: 35, source: "booking", date: "2024-01-10", bookingId: 3 },
    { id: 2, type: "earned", points: 10, source: "review", date: "2024-01-11", bookingId: 3 },
    { id: 3, type: "redeemed", points: -100, source: "reward", date: "2024-01-12", rewardId: 1 }
  ],
  rewards: {
    available: [
      { id: 1, name: "10% Off Next Service", points: 100, type: "discount", expiresAt: "2024-12-31" },
      { id: 2, name: "Free Basic Manicure", points: 300, type: "service", expiresAt: "2024-12-31" },
      { id: 3, name: "20% Off Hair Services", points: 500, type: "discount", expiresAt: "2024-12-31" }
    ],
    redeemed: [
      { id: 1, name: "10% Off Next Service", redeemedDate: "2024-01-12", used: false, usedDate: null, bookingId: 2 }
    ]
  }
};