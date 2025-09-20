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