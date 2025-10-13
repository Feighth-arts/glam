"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Search, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    fetch('/api/bookings', {
      headers: { 'x-user-id': userId, 'x-user-role': userRole }
    }).then(r => r.json()).then(data => {
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setBookings([]);
      setLoading(false);
    });
  }, []);

  const handleNewBooking = () => router.push('/client/services');
  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' })
    });
    setBookings(bookings.map(b => b.id === id ? {...b, status: 'CANCELLED'} : b));
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter.toUpperCase();
    const matchesSearch = booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <button onClick={handleNewBooking} className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors">
          <Calendar className="w-4 h-4 inline mr-2" />
          New Booking
        </button>
      </div>

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
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="paid">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-600 font-semibold text-lg">
                    {booking.provider?.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{booking.service?.name}</h3>
                  <p className="text-gray-600">with {booking.provider?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.bookingDatetime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(booking.bookingDatetime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">KES {parseFloat(booking.amount).toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{booking.pointsEarned} points</p>
                </div>
                {['PAID', 'CONFIRMED'].includes(booking.status) && (
                  <button onClick={() => handleCancel(booking.id)} className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
