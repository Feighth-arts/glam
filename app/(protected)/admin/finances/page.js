"use client";

import { useState } from 'react';
import { DollarSign, TrendingUp, Users, Calendar, Download, Eye } from 'lucide-react';
import { ADMIN_DATA, NORMALIZED_BOOKINGS, PLATFORM_SETTINGS } from '@/lib/admin-constants';

export default function AdminFinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate financial metrics
  const totalRevenue = NORMALIZED_BOOKINGS.reduce((sum, booking) => sum + booking.price, 0);
  const totalCommission = NORMALIZED_BOOKINGS.reduce((sum, booking) => sum + booking.commission, 0);
  const totalProviderEarnings = NORMALIZED_BOOKINGS.reduce((sum, booking) => sum + booking.providerEarning, 0);

  const pendingPayouts = [
    { id: 1, provider: 'Sarah Johnson', amount: 45000, bookings: 12, dueDate: '2024-01-20' },
    { id: 2, provider: 'Mary Wanjiku', amount: 32000, bookings: 8, dueDate: '2024-01-20' },
    { id: 3, provider: 'Jane Doe', amount: 28000, bookings: 6, dueDate: '2024-01-20' }
  ];

  const recentTransactions = [
    { id: 1, type: 'commission', description: 'Booking #001 - Hair Styling', amount: 525, date: '2024-01-15' },
    { id: 2, type: 'payout', description: 'Weekly payout - Sarah Johnson', amount: -45000, date: '2024-01-14' },
    { id: 3, type: 'commission', description: 'Booking #002 - Makeup', amount: 420, date: '2024-01-13' },
    { id: 4, type: 'refund', description: 'Refund - Booking #003', amount: -1500, date: '2024-01-12' }
  ];

  const handleExport = (type) => {
    console.log(`Exporting ${type} report`);
    // Backend integration point
  };

  const handlePayout = (payoutId) => {
    console.log('Processing payout:', payoutId);
    // Backend integration point
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
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
            onClick={() => handleExport('financial')}
            className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-purple-600">KES {totalCommission.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{PLATFORM_SETTINGS.commission.rate * 100}% of revenue</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Provider Earnings</p>
              <p className="text-2xl font-bold text-blue-600">KES {totalProviderEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">85% of revenue</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-2xl font-bold text-rose-600">KES {pendingPayouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{pendingPayouts.length} providers</p>
            </div>
            <Calendar className="w-8 h-8 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'payouts', 'transactions'].map((tab) => (
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
                <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                <div className="space-y-3">
                  {ADMIN_DATA.monthlyMetrics.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-48">
                          <div
                            className="bg-rose-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(month.revenue / Math.max(...ADMIN_DATA.monthlyMetrics.map(m => m.revenue))) * 100}%` }}
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

              {/* Commission Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Commission Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Hair Services</p>
                    <p className="text-xl font-bold text-green-700">KES 15,750</p>
                    <p className="text-xs text-green-600">45% of total commission</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Makeup Services</p>
                    <p className="text-xl font-bold text-purple-700">KES 10,500</p>
                    <p className="text-xs text-purple-600">30% of total commission</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Other Services</p>
                    <p className="text-xl font-bold text-blue-700">KES 8,750</p>
                    <p className="text-xs text-blue-600">25% of total commission</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pending Payouts</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Process All Payouts
                </button>
              </div>
              <div className="space-y-3">
                {pendingPayouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-semibold">{payout.provider.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payout.provider}</p>
                        <p className="text-sm text-gray-500">{payout.bookings} bookings • Due: {payout.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">KES {payout.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Weekly payout</p>
                      </div>
                      <button
                        onClick={() => handlePayout(payout.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Process
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <DollarSign className={`w-5 h-5 ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.type} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}