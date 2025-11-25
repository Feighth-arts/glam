"use client";

import { useState, useEffect } from "react";
import { Download, BarChart3, Users, DollarSign } from "lucide-react";
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
      
      const [dashboardResponse, servicesResponse, bookingsResponse] = await Promise.all([
        fetch('/api/dashboard', { headers }),
        fetch('/api/provider/services', { headers }),
        fetch('/api/bookings', { headers })
      ]);
      
      if (!dashboardResponse.ok || !servicesResponse.ok || !bookingsResponse.ok) {
        throw new Error('Failed to fetch provider data');
      }
      
      const dashboardData = await dashboardResponse.json();
      const servicesData = await servicesResponse.json();
      const bookingsData = await bookingsResponse.json();
      
      // Calculate top clients and service stats from bookings
      const clientStats = {};
      const serviceStats = {};
      
      bookingsData.filter(b => b.status === 'COMPLETED').forEach(booking => {
        // Client stats
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
        clientStats[clientId].totalSpent += parseFloat(booking.amount || 0);
        if (new Date(booking.bookingDatetime) > new Date(clientStats[clientId].lastVisit)) {
          clientStats[clientId].lastVisit = booking.bookingDatetime;
        }
        
        // Service stats
        const serviceId = booking.serviceId;
        if (!serviceStats[serviceId]) {
          serviceStats[serviceId] = {
            name: booking.service?.name || 'Unknown',
            bookings: 0,
            revenue: 0
          };
        }
        serviceStats[serviceId].bookings += 1;
        serviceStats[serviceId].revenue += parseFloat(booking.amount || 0);
      });
      
      const topClients = Object.values(clientStats).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
      
      // Merge service stats with service data
      const servicesWithStats = servicesData.map(service => ({
        ...service,
        bookings: serviceStats[service.id]?.bookings || 0,
        revenue: serviceStats[service.id]?.revenue || 0
      }));
      
      setProviderStats({
        totalBookings: dashboardData.totalBookings || 0,
        totalRevenue: parseFloat(dashboardData.totalRevenue || 0),
        grossRevenue: parseFloat(dashboardData.grossRevenue || 0),
        totalCommission: parseFloat(dashboardData.totalCommission || 0),
        rating: parseFloat(dashboardData.avgRating || 0).toFixed(1),
        services: servicesWithStats,
        monthlyStats: dashboardData.monthlyStats || [],
        topClients
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    {
      name: "Earnings Report",
      description: "Monthly revenue, commission, and net earnings",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      type: "earnings"
    },
    {
      name: "Services Report",
      description: "Service performance and booking statistics",
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-50",
      type: "services"
    },
    {
      name: "Clients Report",
      description: "Top clients and spending analysis",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      type: "clients"
    }
  ];

  const downloadReport = (reportType) => {
    const reportData = {
      earnings: {
        monthlyEarnings: (providerStats.monthlyStats || []).map(stat => ({
          month: stat.month,
          bookings: stat.bookings,
          revenue: parseFloat(stat.grossRevenue || stat.revenue || 0),
          commission: parseFloat(stat.commission || 0),
          netEarnings: parseFloat(stat.revenue || 0)
        }))
      },
      services: {
        services: providerStats.services?.map(service => ({
          name: service.name,
          bookings: service.bookings || 0,
          revenue: parseFloat(service.revenue || 0),
          rating: parseFloat(service.ratings || 0)
        })) || []
      },
      clients: {
        topClients: (providerStats.topClients || []).map(client => ({
          name: client.name,
          bookings: client.bookings,
          totalSpent: parseFloat(client.totalSpent || 0),
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${report.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
              <button
                onClick={() => downloadReport(report.type)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
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
              <div className="text-2xl font-bold text-blue-600">KES {Math.floor(providerStats.totalRevenue).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Net Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">KES {Math.floor(providerStats.totalCommission).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Commission Paid</div>
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