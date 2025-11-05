"use client";

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, Star, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ProviderDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        const response = await fetch('/api/dashboard', {
          headers: { 'x-user-id': userId, 'x-user-role': userRole }
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewSchedule = () => router.push('/provider/bookings');
  const handleViewReports = () => router.push('/provider/reports');
  const handleViewServices = () => router.push('/provider/services');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `KES ${(dashboardData?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Bookings Today", value: dashboardData?.todayBookings?.length || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Bookings", value: dashboardData?.totalBookings || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Avg Rating", value: `${(dashboardData?.avgRating || 0).toFixed(1)}★`, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  const recentBookings = dashboardData?.todayBookings || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Bookings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.length > 0 ? recentBookings.map((booking, index) => (
                <div key={booking.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-rose-600 font-semibold">{booking.client?.name?.charAt(0) || 'C'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.client?.name || 'Client'}</p>
                      <p className="text-sm text-gray-500">{booking.service?.name || 'Service'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {booking.bookingDatetime ? new Date(booking.bookingDatetime).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        }) : 'Time TBD'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'CONFIRMED' || booking.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status?.toLowerCase() || 'pending'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  No bookings for today
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <button onClick={handleViewSchedule} className="w-full flex items-center justify-center px-4 py-3 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors">
              <Calendar className="w-5 h-5 mr-2" />
              View Schedule
            </button>
            <button onClick={handleViewServices} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 mr-2" />
              Manage Services
            </button>
            <button onClick={handleViewReports} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">This Week&apos;s Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-primary">{dashboardData?.weeklyBookings || 0}</div>
              <div className="text-sm text-gray-600">Weekly Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">KES {(dashboardData?.weeklyRevenue || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Weekly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">KES {Math.round((dashboardData?.weeklyRevenue || 0) * 0.15).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Commission (15%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{(dashboardData?.avgRating || 0).toFixed(1)}★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="text-xs text-gray-500 mt-1">(from {dashboardData?.totalReviews || 0} reviews)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
 
