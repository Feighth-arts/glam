"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";

const EarningsPage = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch earnings data');
      const data = await response.json();
      
      // Transform dashboard data to earnings format
      const monthlyData = data.monthlyStats || [];
      setEarningsData(monthlyData.map(stat => ({
        month: stat.month,
        amount: stat.revenue || 0,
        bookings: stat.bookings || 0
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.amount, 0);
  const totalBookings = earningsData.reduce((sum, item) => sum + item.bookings, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading earnings data...</div>
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
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">KES {totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average per Booking</p>
              <p className="text-2xl font-bold text-gray-900">KES {Math.round(totalEarnings / totalBookings)}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Earnings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Bookings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Average</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{item.month}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">KES {item.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-900">{item.bookings}</td>
                    <td className="py-3 px-4 text-gray-900">KES {Math.round(item.amount / item.bookings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;