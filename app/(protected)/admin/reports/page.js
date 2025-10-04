"use client";

import { useState } from 'react';
import { BarChart, Download, TrendingUp, Users, Calendar, DollarSign, Star, FileText } from 'lucide-react';
import { getPlatformStats, BOOKINGS, USERS, SERVICE_CATALOG } from '@/lib/normalized-data';

export default function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const platformStats = getPlatformStats();

  // Mock monthly data for charts
  const monthlyData = [
    { month: 'Aug', revenue: 185000, bookings: 234, users: 45, commission: 27750 },
    { month: 'Sep', revenue: 210000, bookings: 267, users: 52, commission: 31500 },
    { month: 'Oct', revenue: 195000, bookings: 245, users: 38, commission: 29250 },
    { month: 'Nov', revenue: 245000, bookings: 298, users: 67, commission: 36750 },
    { month: 'Dec', revenue: 220000, bookings: 276, users: 43, commission: 33000 },
    { month: 'Jan', revenue: 265000, bookings: 312, users: 58, commission: 39750 }
  ];

  const servicePerformance = SERVICE_CATALOG.map(service => {
    const serviceBookings = BOOKINGS.filter(b => b.serviceId === service.id);
    const revenue = serviceBookings.reduce((sum, b) => sum + b.price, 0);
    return {
      ...service,
      bookings: serviceBookings.length,
      revenue,
      commission: serviceBookings.reduce((sum, b) => sum + b.commission, 0)
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const providerPerformance = USERS.providers.map(provider => ({
    ...provider,
    bookings: BOOKINGS.filter(b => b.providerId === provider.id).length,
    revenue: BOOKINGS.filter(b => b.providerId === provider.id).reduce((sum, b) => sum + b.providerEarning, 0),
    commission: BOOKINGS.filter(b => b.providerId === provider.id).reduce((sum, b) => sum + b.commission, 0)
  })).sort((a, b) => b.revenue - a.revenue);

  const handleExport = (reportType) => {
    console.log(`Exporting ${reportType} report for ${selectedPeriod}`);
    // In real app, this would generate and download PDF/Excel
    alert(`${reportType} report exported successfully!`);
  };

  const generatePDFReport = (type) => {
    const reportData = {
      overview: platformStats,
      services: { servicePerformance },
      providers: { topProviders: providerPerformance },
      financial: { monthlyMetrics: monthlyData }
    };

    import('@/lib/pdf-generator').then(({ generateAdminReport }) => {
      generateAdminReport(type, reportData[type] || {});
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => handleExport('comprehensive')}
            className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">KES {platformStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">+15.2% from last period</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-600">{platformStats.totalBookings}</p>
              <p className="text-xs text-blue-500 mt-1">+8.7% from last period</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">{platformStats.totalUsers}</p>
              <p className="text-xs text-purple-500 mt-1">+12.3% from last period</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-rose-600">KES {platformStats.totalCommission.toLocaleString()}</p>
              <p className="text-xs text-rose-500 mt-1">15% of total revenue</p>
            </div>
            <TrendingUp className="w-8 h-8 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'services', 'providers', 'financial'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-rose-primary text-rose-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Revenue Trend */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Revenue Trend</h3>
                  <button
                    onClick={() => generatePDFReport('overview')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4 inline mr-1" />
                    Export Chart
                  </button>
                </div>
                <div className="space-y-3">
                  {monthlyData.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 w-64">
                          <div
                            className="bg-rose-primary h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(month.revenue / Math.max(...monthlyData.map(m => m.revenue))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">KES {month.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{month.bookings} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Average Booking Value</p>
                  <p className="text-xl font-bold text-blue-700">KES {platformStats.avgBookingValue.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Active Providers</p>
                  <p className="text-xl font-bold text-green-700">{platformStats.totalProviders}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Active Clients</p>
                  <p className="text-xl font-bold text-purple-700">{platformStats.totalClients}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Service Performance</h3>
                <button
                  onClick={() => generatePDFReport('services')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Export Report
                </button>
              </div>
              <div className="space-y-3">
                {servicePerformance.map((service, index) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.category} • {service.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">KES {service.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Commission: KES {service.commission.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Provider Performance</h3>
                <button
                  onClick={() => generatePDFReport('providers')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Export Report
                </button>
              </div>
              <div className="space-y-3">
                {providerPerformance.map((provider, index) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
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
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Financial Summary</h3>
                <button
                  onClick={() => generatePDFReport('financial')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Export Report
                </button>
              </div>
              
              {/* Commission Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Commission</h4>
                  <div className="space-y-2">
                    {monthlyData.map((month) => (
                      <div key={month.month} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">{month.month}</span>
                        <span className="font-medium">KES {month.commission.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Revenue Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Platform Commission (15%)</span>
                      <span className="font-medium text-rose-600">KES {platformStats.totalCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Provider Earnings (85%)</span>
                      <span className="font-medium text-blue-600">KES {(platformStats.totalRevenue - platformStats.totalCommission).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Revenue</span>
                        <span className="font-bold text-gray-900">KES {platformStats.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExport('overview')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart className="w-5 h-5 text-gray-600" />
            <span>Platform Overview</span>
          </button>
          <button
            onClick={() => handleExport('services')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star className="w-5 h-5 text-gray-600" />
            <span>Service Analytics</span>
          </button>
          <button
            onClick={() => handleExport('providers')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-600" />
            <span>Provider Reports</span>
          </button>
          <button
            onClick={() => handleExport('financial')}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span>Financial Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
}