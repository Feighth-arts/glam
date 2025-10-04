"use client";

import { useState } from "react";
import { Download, FileText, BarChart3, Users, Calendar, DollarSign } from "lucide-react";
import { USERS, getProviderStats } from '@/lib/normalized-data';
import { generateProviderReport } from '@/lib/pdf-generator';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const providerId = "prov_001";
  const provider = USERS.providers.find(p => p.id === providerId);
  const providerStats = getProviderStats(providerId);

  const reportCategories = [
    {
      title: "Financial Reports",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      reports: [
        { name: "Revenue Summary", description: "Monthly revenue breakdown and trends" },
        { name: "Payment History", description: "Complete payment transaction history" },
        { name: "Tax Report", description: "Tax-ready financial summary" }
      ]
    },
    {
      title: "Booking Reports",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
      reports: [
        { name: "Booking Analytics", description: "Booking patterns and statistics" },
        { name: "Service Performance", description: "Most popular services analysis" },
        { name: "Cancellation Report", description: "Cancellation rates and reasons" }
      ]
    },
    {
      title: "Client Reports",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      reports: [
        { name: "Client Demographics", description: "Client age, location, and preferences" },
        { name: "Loyalty Analysis", description: "Repeat clients and retention rates" },
        { name: "Feedback Summary", description: "Client reviews and ratings analysis" }
      ]
    },
    {
      title: "Performance Reports",
      icon: BarChart3,
      color: "text-orange-600",
      bg: "bg-orange-50",
      reports: [
        { name: "Business Overview", description: "Complete business performance summary" },
        { name: "Growth Metrics", description: "Month-over-month growth analysis" },
        { name: "Competitive Analysis", description: "Market position and benchmarks" }
      ]
    }
  ];

  const downloadReport = (categoryTitle, reportName) => {
    const reportType = reportName.toLowerCase().includes('revenue') || reportName.toLowerCase().includes('financial') ? 'earnings' :
                      reportName.toLowerCase().includes('service') || reportName.toLowerCase().includes('booking') ? 'services' :
                      reportName.toLowerCase().includes('client') ? 'clients' : 'earnings';
    
    const reportData = {
      earnings: {
        monthlyEarnings: [
          { month: 'Jan', bookings: providerStats.totalBookings, revenue: providerStats.totalRevenue, commission: providerStats.totalCommission, netEarnings: providerStats.totalRevenue - providerStats.totalCommission },
          { month: 'Dec', bookings: Math.floor(providerStats.totalBookings * 0.8), revenue: Math.floor(providerStats.totalRevenue * 0.8), commission: Math.floor(providerStats.totalCommission * 0.8), netEarnings: Math.floor((providerStats.totalRevenue - providerStats.totalCommission) * 0.8) }
        ]
      },
      services: {
        services: provider?.services.map((serviceId, index) => ({
          name: `Service ${serviceId}`,
          bookings: Math.floor(providerStats.totalBookings / provider.services.length),
          revenue: Math.floor(providerStats.totalRevenue / provider.services.length),
          rating: provider.rating
        })) || []
      },
      clients: {
        topClients: [
          { name: 'Faith Kiplangat', bookings: 8, totalSpent: 28000, lastVisit: '2024-01-15' },
          { name: 'Grace Mwangi', bookings: 6, totalSpent: 21000, lastVisit: '2024-01-12' }
        ]
      }
    };
    
    generateProviderReport(reportType, reportData[reportType] || {});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex items-center gap-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <div key={categoryIndex} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`${category.bg} p-2 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadReport(category.title, report.name)}
                        className="flex items-center gap-2 px-3 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Statistics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-primary">{providerStats.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">KES {Math.floor(providerStats.totalRevenue / 1000)}K</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{providerStats.completedBookings}</div>
              <div className="text-sm text-gray-600">Completed Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{provider?.rating || 0}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;