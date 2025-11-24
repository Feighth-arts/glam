"use client";

import { useState, useEffect } from 'react';
import { Calendar, Star, TrendingUp, Clock, MapPin, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCache } from '@/lib/cache-context';

const ClientDashboard = () => {
  const router = useRouter();
  const { getCached, setCache } = useCache();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCached('client-dashboard');
    if (cached) {
      setProfile(cached.profile);
      setBookings(cached.bookings);
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const headers = { 'x-user-id': userId, 'x-user-role': userRole };
    Promise.all([
      fetch('/api/users/profile', { headers }).then(r => r.json()),
      fetch('/api/bookings', { headers }).then(r => r.json())
    ]).then(([profileData, bookingsData]) => {
      setProfile(profileData);
      setBookings(bookingsData);
      setCache('client-dashboard', { profile: profileData, bookings: bookingsData });
      setLoading(false);
    });
  }, [getCached, setCache]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const upcomingBookings = bookings.filter(b => 
    ['PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(b.status) && 
    new Date(b.bookingDatetime) > new Date()
  );

  const stats = [
    { label: "Total Bookings", value: profile._count?.clientBookings || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Spent", value: `KES ${(profile.stats?.totalSpent || 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Points Earned", value: profile.userPoints?.currentPoints || 0, icon: Gift, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Tier", value: profile.userPoints?.tier || 'BRONZE', icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Manage your beauty appointments and rewards</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
          </div>
          <div className="p-6">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-semibold">{booking.provider?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.service?.name}</p>
                        <p className="text-sm text-gray-500">with {booking.provider?.name}</p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{booking.location || 'Location TBD'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-500 mb-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{new Date(booking.bookingDatetime).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{new Date(booking.bookingDatetime).toLocaleDateString()}</p>
                      <p className="text-xs text-green-600">+{booking.pointsEarned} points</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming bookings</p>
                <button 
                  onClick={() => router.push('/client/services')}
                  className="mt-2 text-rose-primary hover:text-rose-dark transition-colors"
                >
                  Book a service
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button 
                onClick={() => router.push('/client/services')}
                className="w-full flex items-center justify-center px-4 py-3 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Service
              </button>
              <button 
                onClick={() => router.push('/client/rewards')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Gift className="w-5 h-5 mr-2" />
                View Rewards
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-rose-500 rounded-lg shadow text-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Rewards Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-purple-100 text-sm">Current Points</p>
                  <p className="text-2xl font-bold">{profile.userPoints?.currentPoints || 0}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Tier: {profile.userPoints?.tier || 'BRONZE'}</p>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${Math.min(((profile.userPoints?.currentPoints || 0) / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-100 mt-1">
                    {Math.max(0, 1000 - (profile.userPoints?.currentPoints || 0))} points to GOLD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
