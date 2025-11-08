"use client";

import { useState, useEffect } from "react";
import { Download, FileText, BarChart3, Users, Calendar, DollarSign } from "lucide-react";
import { generateProviderReport } from '@/lib/pdf-generator';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [providerStats, setProviderStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviderStats();
  }, []);

  const fetchProviderStats = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const headers = { 'x-user-id': userId, 'x-user-role': userRole };
      const [dashboardResponse, profileResponse, servicesResponse, bookingsResponse] = await Promise.all([
        fetch('/api/dashboard', { headers }),
        fetch('/api/users/profile', { headers }),
        fetch('/api/provider/services', { headers }),
        fetch('/api/bookings', { headers })
      ]);
      
      if (!dashboardResponse.ok || !profileResponse.ok || !servicesResponse.ok || !bookingsResponse.ok) {
        throw new Error('Failed to fetch provider data');
      }
      
      const dashboardData = await dashboardResponse.json();
      const profileData = await profileResponse.json();
      const servicesData = await servicesResponse.json();
      const bookingsData = await bookingsResponse.json();
      
      // Calculate top clients from bookings
      const clientStats = {};
      bookingsData.filter(b => b.status === 'COMPLETED').forEach(booking => {
        const clientId = booking.clientId;
        if (!clientStats[clientId]) {
          clientStats[clientId] = {
            name: booking.client?.name || 'Unknown',
            bookings: 0,
            totalSpent: 0,
            lastVisit: booking.bookingDatetime
          };
        }
        clientStats[clientId].bookings += 1;
        clientStats[clientId].totalSpent += booking.amount || 0;
        if (new Date(booking.bookingDatetime) > new Date(clientStats[clientId].lastVisit)) {
          clientStats[clientId].lastVisit = booking.bookingDatetime;
        }
      });
      const topClients = Object.values(clientStats).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
      
      setProviderStats({
        totalBookings: dashboardData.totalBookings || 0,
        totalRevenue: dashboardData.totalRevenue || 0,
        totalCommission: (dashboardData.totalRevenue || 0) * 0.15,
        completedBookings: dashboardData.totalBookings || 0,
        rating: profileData.stats?.avgRating || 0,
        services: servicesData || [],
        monthlyStats: dashboardData.monthlyStats || [],
        topClients
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        monthlyEarnings: (providerStats.monthlyStats || []).map(stat => ({
          month: stat.month,
          bookings: stat.bookings,
          revenue: stat.revenue,
          commission: stat.revenue * 0.15,
          netEarnings: stat.revenue * 0.85
        }))
      },
      services: {
        services: providerStats.services?.map(service => ({
          name: service.name,
          bookings: service._count?.bookings || 0,
          revenue: service.price || 0,
          rating: service.avgRating || 0
        })) || []
      },
      clients: {
        topClients: (providerStats.topClients || []).map(client => ({
          name: client.name,
          bookings: client.bookings,
          totalSpent: client.totalSpent,
          lastVisit: new Date(client.lastVisit).toLocaleDateString()
        }))
      }
    };
    
    generateProviderReport(reportType, reportData[reportType] || {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading reports data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

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
              <div className="text-2xl font-bold text-purple-600">{providerStats.rating || 0}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;