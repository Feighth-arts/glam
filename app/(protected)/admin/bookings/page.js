"use client";

import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Eye, DollarSign, Clock, MapPin } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewingBooking, setViewingBooking] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    fetch('/api/admin/bookings', {
      headers: { 'x-user-id': userId, 'x-user-role': userRole }
    }).then(r => r.json()).then(data => {
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookingAction = (action, bookingId) => {
    if (action === 'view') {
      const booking = bookings.find(b => b.id === bookingId);
      setViewingBooking(booking);
    }
  };

  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.price, 0);
  const totalCommission = filteredBookings.reduce((sum, booking) => sum + booking.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {filteredBookings.length} bookings • KES {totalRevenue.toLocaleString()} revenue
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-purple-600">KES {totalCommission.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-rose-600">
                KES {filteredBookings.length > 0 ? Math.round(totalRevenue / filteredBookings.length).toLocaleString() : 0}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="in-progress">In Progress</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                      <div className="text-sm text-gray-500">{booking.service}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs">{booking.clientName.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{booking.clientName}</div>
                        <div className="text-xs text-gray-500">+{booking.points} points</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-semibold text-xs">{booking.providerName.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{booking.providerName}</div>
                        <div className="text-xs text-gray-500">Earns: KES {booking.providerEarning.toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">KES {booking.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Commission: KES {booking.commission.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleBookingAction('view', booking.id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View Booking Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button onClick={() => setViewingBooking(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Booking ID</label>
                  <p className="font-medium">#{viewingBooking.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingBooking.status)}`}>
                    {viewingBooking.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Client</label>
                  <p className="font-medium">{viewingBooking.clientName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Provider</label>
                  <p className="font-medium">{viewingBooking.providerName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Service</label>
                  <p className="font-medium">{viewingBooking.service}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="font-medium">{viewingBooking.location}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <p className="font-medium">{viewingBooking.date}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Time</label>
                  <p className="font-medium">{viewingBooking.time}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm text-gray-600">Total Amount</label>
                  <p className="font-medium text-lg">KES {viewingBooking.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Commission</label>
                  <p className="font-medium text-lg">KES {viewingBooking.commission.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Provider Earning</label>
                  <p className="font-medium text-lg">KES {viewingBooking.providerEarning.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <label className="text-sm text-gray-600">Payment Status</label>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(viewingBooking.paymentStatus)}`}>
                    {viewingBooking.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingBooking(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}