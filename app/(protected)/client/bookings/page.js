"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Search, Gift, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MpesaSimulation from '@/components/MpesaSimulation';

export default function ClientBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMpesa, setShowMpesa] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const headers = { 'x-user-id': userId, 'x-user-role': userRole };
    
    fetch('/api/bookings', { headers })
      .then(r => r.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
    
    fetch('/api/users/profile', { headers })
      .then(r => r.json())
      .then(data => setUserProfile(data));
  }, []);

  const handleNewBooking = () => router.push('/client/services');
  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
      body: JSON.stringify({ status: 'CANCELLED' })
    });
    setBookings(bookings.map(b => b.id === id ? {...b, status: 'CANCELLED'} : b));
  };

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setShowMpesa(true);
  };

  const handleMpesaSuccess = async (transactionId, phoneNumber) => {
    alert('Payment successful!');
    window.location.reload();
  };

  const handleMpesaFailure = (error) => {
    alert(`Payment failed: ${error}`);
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId, 
          'x-user-role': userRole 
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      alert('Failed to submit review');
    }
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
                <div className="flex gap-2">
                  {booking.status === 'PENDING_PAYMENT' && (
                    <button 
                      onClick={() => handlePayNow(booking)} 
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                    >
                      <CreditCard className="w-3 h-3" />
                      Pay Now
                    </button>
                  )}
                  {booking.status === 'COMPLETED' && !booking.review && (
                    <button 
                      onClick={() => handleReview(booking)} 
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      Rate
                    </button>
                  )}
                  {['PAID', 'CONFIRMED'].includes(booking.status) && (
                    <button onClick={() => handleCancel(booking.id)} className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MpesaSimulation
        isOpen={showMpesa}
        onClose={() => setShowMpesa(false)}
        amount={selectedBooking?.amount || 0}
        paymentId={selectedBooking?.payment?.id}
        onSuccess={handleMpesaSuccess}
        onFailure={handleMpesaFailure}
      />

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Rate Your Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className="flex-1 px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
