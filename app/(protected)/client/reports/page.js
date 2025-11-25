"use client";

import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Calendar, DollarSign, Download, Star } from 'lucide-react';
import { generateClientReport } from '@/lib/pdf-generator';

export default function ClientReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [bookings, setBookings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const headers = { 'x-user-id': userId, 'x-user-role': userRole };

    Promise.all([
      fetch('/api/bookings', { headers }).then(r => r.json()),
      fetch('/api/users/profile', { headers }).then(r => r.json())
    ]).then(([bookingsData, profileData]) => {
      setBookings(bookingsData.filter(b => ['PAID', 'CONFIRMED', 'COMPLETED'].includes(b.status)));
      setUserProfile(profileData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  
  // Calculate real analytics from bookings
  const totalSpent = bookings.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const totalBookings = bookings.length;
  
  // Group by month
  const monthlyData = {};
  bookings.forEach(b => {
    const date = new Date(b.bookingDatetime);
    const monthKey = date.toLocaleString('default', { month: 'short' });
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthKey, amount: 0, bookings: 0 };
    }
    monthlyData[monthKey].amount += parseFloat(b.amount);
    monthlyData[monthKey].bookings += 1;
  });
  const monthlySpending = Object.values(monthlyData).slice(-6);
  
  // Service breakdown
  const serviceData = {};
  bookings.forEach(b => {
    const serviceName = b.service?.name || 'Unknown';
    if (!serviceData[serviceName]) {
      serviceData[serviceName] = { service: serviceName, count: 0, amount: 0 };
    }
    serviceData[serviceName].count += 1;
    serviceData[serviceName].amount += parseFloat(b.amount);
  });
  const serviceBreakdown = Object.values(serviceData).map(s => ({
    ...s,
    percentage: Math.round((s.amount / totalSpent) * 100)
  }));
  
  // Favorite providers
  const providerData = {};
  bookings.forEach(b => {
    const providerName = b.provider?.name || 'Unknown';
    if (!providerData[providerName]) {
      providerData[providerName] = { name: providerName, bookings: 0, amount: 0 };
    }
    providerData[providerName].bookings += 1;
    providerData[providerName].amount += parseFloat(b.amount);
  });
  const favoriteProviders = Object.values(providerData).sort((a, b) => b.amount - a.amount).slice(0, 3);
  
  const avgSpending = monthlySpending.length > 0 ? totalSpent / monthlySpending.length : 0;
  
  const analyticsData = {
    spending: { '6months': monthlySpending },
    serviceBreakdown,
    favoriteProviders
  };

  const downloadReport = (type) => {
    const reportData = {
      spending: {
        monthlySpending: analyticsData.spending['6months'],
        totalSpent,
        totalBookings
      },
      services: {
        serviceBreakdown: analyticsData.serviceBreakdown
      },
      points: {
        totalPointsEarned: userProfile?.userPoints?.lifetimePoints || 0,
        pointsRedeemed: (userProfile?.userPoints?.lifetimePoints || 0) - (userProfile?.userPoints?.currentPoints || 0),
        currentPoints: userProfile?.userPoints?.currentPoints || 0,
        tier: userProfile?.userPoints?.tier || 'BRONZE'
      },
      summary: {
        totalSpent,
        totalBookings,
        avgSpending,
        monthlySpending: analyticsData.spending['6months'],
        serviceBreakdown: analyticsData.serviceBreakdown,
        favoriteProviders: analyticsData.favoriteProviders,
        points: userProfile?.userPoints || {}
      }
    };
    
    generateClientReport(type, reportData[type] || reportData.summary);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Beauty Analytics</h1>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={() => downloadReport('summary')}
            className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">KES {totalSpent.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Monthly</p>
              <p className="text-2xl font-bold text-purple-600">KES {Math.round(avgSpending).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-rose-primary">{userProfile?.userPoints?.lifetimePoints || 0}</p>
            </div>
            <Star className="w-8 h-8 text-rose-primary" />
          </div>
        </div>
      </div>

      {/* Spending Trend */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Spending Trend</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.spending['6months'].map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 w-48">
                    <div
                      className="bg-rose-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(month.amount / Math.max(...analyticsData.spending['6months'].map(m => m.amount))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">KES {month.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{month.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Breakdown */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Service Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.serviceBreakdown.map((service) => (
                <div key={service.service} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{service.service}</span>
                    <span className="text-sm text-gray-500">{service.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      KES {service.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{service.count} bookings</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Favorite Providers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Favorite Providers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.favoriteProviders.map((provider, index) => (
                <div key={provider.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-rose-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KES {provider.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Download Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => downloadReport('spending')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart className="w-5 h-5 text-gray-600" />
            <span>Spending Analysis</span>
          </button>
          <button
            onClick={() => downloadReport('services')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star className="w-5 h-5 text-gray-600" />
            <span>Service History</span>
          </button>
          <button
            onClick={() => downloadReport('points')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span>Points Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
}