"use client";

import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Star } from "lucide-react";
import { useCache } from '@/lib/cache-context';

const AdminDashboard = () => {
  const { getCached, setCache } = useCache();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCached('admin-dashboard');
    if (cached) {
      setDashboardData(cached);
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    fetch('/api/dashboard', {
      headers: { 'x-user-id': userId, 'x-user-role': userRole }
    }).then(r => r.json()).then(data => {
      setDashboardData(data);
      setCache('admin-dashboard', data);
      setLoading(false);
    });
  }, [getCached, setCache]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stats = [
    { label: "Total Users", value: dashboardData?.totalUsers || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Bookings", value: dashboardData?.totalBookings || 0, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Revenue", value: `KES ${(dashboardData?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Commission", value: `KES ${(dashboardData?.totalCommission || 0).toLocaleString()}`, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'registration': return Users;
      case 'dispute': return AlertCircle;
      case 'payout': return DollarSign;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking': return 'text-blue-600 bg-blue-50';
      case 'registration': return 'text-green-600 bg-green-50';
      case 'dispute': return 'text-red-600 bg-red-50';
      case 'payout': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600">Monitor and manage the Glamease platform</p>
        </div>
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
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData?.recentActivity?.slice(0, 10).map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'booking' && `New booking: ${activity.service}`}
                        {activity.type === 'registration' && activity.user}
                        {activity.type === 'dispute' && `Dispute: ${activity.user}`}
                        {activity.type === 'payout' && `Payout to ${activity.provider}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.type === 'booking' && `${activity.user} → ${activity.provider}`}
                        {activity.type === 'payout' && `KES ${activity.amount?.toLocaleString()}`}
                        {activity.type === 'dispute' && `Status: ${activity.status}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <a href="/admin/users" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </a>
            <a href="/admin/bookings" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <p className="font-medium text-gray-900">View Bookings</p>
              <p className="text-sm text-gray-600">Monitor all bookings</p>
            </a>
            <a href="/admin/services" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <p className="font-medium text-gray-900">Manage Services</p>
              <p className="text-sm text-gray-600">Add or edit services</p>
            </a>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Providers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(dashboardData?.topProviders || []).map((provider, index) => (
                <div key={provider.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-rose-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{provider.rating}</span>
                        <span>•</span>
                        <span>{provider.bookings} bookings</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KES {provider.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Commission: KES {provider.commission.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Clients</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(dashboardData?.topClients || []).map((client, index) => (
                <div key={client.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{client.tier} Member</span>
                        <span>•</span>
                        <span>{client.bookings} bookings</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KES {client.spent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{client.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;