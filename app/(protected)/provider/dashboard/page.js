"use client";

import { Calendar, DollarSign, Users, Star, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { USERS, getProviderStats } from "@/lib/normalized-data";
import { useRouter } from "next/navigation";

const ProviderDashboard = () => {
  const router = useRouter();
  const providerId = "prov_001"; // In real app, get from auth context
  const provider = USERS.providers.find(p => p.id === providerId);
  const providerStats = getProviderStats(providerId);

  const stats = [
    { label: "Total Revenue", value: `KES ${providerStats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Bookings Today", value: "3", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" }, // Mock today's bookings
    { label: "Total Clients", value: provider?.totalRatings?.toString() || "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Avg Rating", value: `${provider?.rating || 0}★`, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  const handleViewSchedule = () => router.push('/provider/bookings');
  const handleManageClients = () => alert('Client management coming soon!');
  const handleViewReports = () => router.push('/provider/reports');

  const recentBookings = [
    { client: "Sarah M.", service: "Hair Styling", time: "10:00 AM", status: "confirmed" },
    { client: "Jane D.", service: "Makeup", time: "2:30 PM", status: "pending" },
    { client: "Mary K.", service: "Nail Art", time: "4:00 PM", status: "completed" }
  ];

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
            <h2 className="text-lg font-semibold text-gray-900">Today's Bookings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-rose-600 font-semibold">{booking.client.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.client}</p>
                      <p className="text-sm text-gray-500">{booking.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{booking.time}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
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
            <button onClick={handleManageClients} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 mr-2" />
              Manage Clients
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
          <h2 className="text-lg font-semibold text-gray-900">This Week's Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-primary">{providerStats.completedBookings}</div>
              <div className="text-sm text-gray-600">Bookings Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">KES {Math.round(providerStats.totalRevenue * 0.3).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Weekly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">New Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{provider?.rating || 0}★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="text-xs text-gray-500 mt-1">(from {provider?.totalRatings || 0} reviews)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
 
