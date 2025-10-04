"use client";

import { useState } from 'react';
import { BarChart, TrendingUp, Calendar, DollarSign, Download, Star } from 'lucide-react';
import { CLIENT_DATA } from '@/lib/constants';

export default function ClientReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
  // Mock analytics data - in real app, this would come from API
  const analyticsData = {
    spending: {
      '6months': [
        { month: 'Aug', amount: 8500, bookings: 3 },
        { month: 'Sep', amount: 12000, bookings: 4 },
        { month: 'Oct', amount: 6500, bookings: 2 },
        { month: 'Nov', amount: 15000, bookings: 5 },
        { month: 'Dec', amount: 9800, bookings: 3 },
        { month: 'Jan', amount: 11200, bookings: 4 }
      ]
    },
    serviceBreakdown: [
      { service: 'Hair Styling', count: 8, amount: 28000, percentage: 45 },
      { service: 'Makeup', count: 6, amount: 18000, percentage: 29 },
      { service: 'Nail Art', count: 5, amount: 9500, percentage: 15 },
      { service: 'Facial Treatment', count: 3, amount: 6500, percentage: 11 }
    ],
    favoriteProviders: [
      { name: 'Sarah Johnson', bookings: 6, amount: 21000 },
      { name: 'Mary Wanjiku', bookings: 4, amount: 11200 },
      { name: 'Jane Doe', bookings: 3, amount: 4500 }
    ]
  };

  const totalSpent = analyticsData.spending['6months'].reduce((sum, month) => sum + month.amount, 0);
  const totalBookings = analyticsData.spending['6months'].reduce((sum, month) => sum + month.bookings, 0);
  const avgSpending = totalSpent / analyticsData.spending['6months'].length;

  const downloadReport = (type) => {
    console.log(`Downloading ${type} report`);
    // Backend integration point for PDF generation
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
              <p className="text-2xl font-bold text-rose-primary">{CLIENT_DATA?.stats?.lifetimePoints || 0}</p>
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