"use client";

import { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Search, Gift } from 'lucide-react';
import { BOOKINGS, getUserById, getServiceById } from '@/lib/normalized-data';
import { useRouter } from 'next/navigation';

export default function ClientBookingsPage() {
  const router = useRouter();
  const clientId = "client_001";
  const clientBookings = BOOKINGS.filter(b => b.clientId === clientId);
  const [bookings] = useState(clientBookings);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewBooking = () => router.push('/client/services');
  const handleReschedule = (id) => alert('Reschedule functionality coming soon!');
  const handleCancel = (id) => confirm('Cancel this booking?') && alert('Booking cancelled!');
  const handleRateService = (id) => alert('Rating functionality coming soon!');

  const filteredBookings = bookings.filter(booking => {
    const provider = getUserById(booking.providerId, 'providers');
    const service = getServiceById(booking.serviceId);
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = (service?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (provider?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const provider = getUserById(booking.providerId, 'providers');
          const service = getServiceById(booking.serviceId);
          return (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-600 font-semibold text-lg">
                      {provider?.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{service?.name}</h3>
                    <p className="text-gray-600">with {provider?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                  {booking.rewardUsed && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-purple-600">
                      <Gift className="w-4 h-4" />
                      <span>{booking.rewardUsed.name} applied</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">KES {booking.price.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{booking.points} points earned</p>
                </div>
                {booking.status === 'upcoming' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleReschedule(booking.id)} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Reschedule
                    </button>
                    <button onClick={() => handleCancel(booking.id)} className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">
                      Cancel
                    </button>
                  </div>
                )}
                {booking.status === 'completed' && !booking.reviewed && (
                  <button onClick={() => handleRateService(booking.id)} className="px-3 py-1 text-sm bg-rose-primary text-white rounded hover:bg-rose-dark">
                    <Star className="w-3 h-3 inline mr-1" />
                    Rate Service (+10 pts)
                  </button>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}