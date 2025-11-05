"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Gift, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MpesaSimulation from '@/components/MpesaSimulation';
import { sendBookingConfirmation } from '@/lib/email-service';

export default function ClientServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const headers = { 'x-user-id': userId, 'x-user-role': userRole };
    fetch('/api/client/services', { headers }).then(r => r.json()).then(data => {
      setProviders(data);
      const allCategories = new Set();
      data.forEach(p => p.services.forEach(s => s.category && allCategories.add(s.category)));
      setCategories(['all', ...Array.from(allCategories)]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => 
                           service.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'all' || 
                           provider.services.some(service => 
                             service.name.toLowerCase().includes(selectedCategory.toLowerCase())
                           );
    
    return matchesSearch && matchesCategory;
  });

  const handleBookService = (provider, service) => {
    setBookingModal({ provider, service });
  };

  const handleViewProfile = (providerId) => {
    // In real app, navigate to provider profile
    alert('Provider profile view coming soon!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Browse Services</h1>
        <div className="text-sm text-gray-600">
          {filteredProviders.length} providers found
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="space-y-6">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Provider Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-bold text-xl">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{provider.rating} ({provider.reviews} reviews)</span>
                      </div>
                      <span>{provider.distance} away</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewProfile(provider.id)}
                  className="px-4 py-2 border border-rose-primary text-rose-primary rounded-lg hover:bg-rose-50 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Available Services</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {provider.services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 hover:border-rose-primary transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{service.name}</h5>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{service.ratings}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">KES {service.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Gift className="w-3 h-3" />
                          <span>+{service.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookService(provider, service)}
                      className="w-full py-2 px-4 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <BookingModal
          provider={bookingModal.provider}
          service={bookingModal.service}
          onClose={() => setBookingModal(null)}
        />
      )}
    </div>
  );
}

function BookingModal({ provider, service, onClose }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    notes: '',
    pointsToRedeem: 0,
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showMpesa, setShowMpesa] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const headers = { 'x-user-id': userId, 'x-user-role': userRole };
    fetch('/api/users/profile', { headers })
      .then(res => res.json())
      .then(data => {
        setUserProfile(data);
        setUserPoints(data.userPoints?.currentPoints || 0);
      });
  }, []);

  const maxDiscount = service.price * 0.30;
  const maxPoints = Math.min(userPoints, maxDiscount);
  const finalPrice = service.price - Math.min(formData.pointsToRedeem, maxDiscount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
        body: JSON.stringify({
          providerId: provider.id,
          serviceId: service.id,
          bookingDatetime: `${formData.date}T${formData.time}`,
          location: formData.location,
          notes: formData.notes,
          pointsToRedeem: formData.pointsToRedeem,
          phoneNumber: formData.phoneNumber
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBookingData(data);
        setShowMpesa(true);
      }
    } catch (error) {
      alert('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMpesaSuccess = async (transactionId, phoneNumber) => {
    try {
      // Update payment with transaction ID
      await fetch(`/api/payments/${bookingData.payment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, phoneNumber })
      });

      // Send email confirmation
      if (userProfile?.email) {
        await sendBookingConfirmation(
          {
            id: bookingData.booking.id,
            serviceName: service.name,
            date: formData.date,
            time: formData.time,
            totalAmount: finalPrice
          },
          userProfile.email,
          userProfile.name
        );
      }

      alert('Payment successful! Booking confirmed.');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Post-payment error:', error);
    }
  };

  const handleMpesaFailure = (error) => {
    alert(`Payment failed: ${error}`);
  };

  return (
    <>
      <MpesaSimulation
        isOpen={showMpesa}
        onClose={() => setShowMpesa(false)}
        amount={finalPrice}
        onSuccess={handleMpesaSuccess}
        onFailure={handleMpesaFailure}
      />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Book {service.name}</h2>
        <p className="text-gray-600 mb-4">with {provider.name}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number (M-Pesa)</label>
            <input
              type="tel"
              required
              placeholder="254712345678"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows="2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Redeem Points (Max {maxPoints} pts = 30% discount)
            </label>
            <input
              type="number"
              min="0"
              max={maxPoints}
              value={formData.pointsToRedeem}
              onChange={(e) => setFormData({...formData, pointsToRedeem: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-1">You have {userPoints} points</p>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Original Price:</span>
              <span>KES {service.price}</span>
            </div>
            {formData.pointsToRedeem > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Points Discount:</span>
                <span>-KES {Math.min(formData.pointsToRedeem, maxDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>KES {finalPrice}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-rose-primary text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}