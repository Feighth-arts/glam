"use client";

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Gift, Star, Edit3 } from 'lucide-react';
import { CLIENT_DATA, POINTS_CONFIG } from '@/lib/constants';

export default function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: CLIENT_DATA?.profile?.name || '',
    email: CLIENT_DATA?.profile?.email || '',
    phone: CLIENT_DATA?.profile?.phone || '',
    location: CLIENT_DATA?.profile?.location || '',
    birthday: CLIENT_DATA?.profile?.birthday || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // Backend integration point
  };

  const getTierInfo = () => {
    const currentPoints = CLIENT_DATA?.stats?.pointsEarned || 0;
    const tier = CLIENT_DATA?.profile?.tier || 'Bronze';
    
    if (tier === 'Bronze') {
      return {
        current: tier,
        next: 'Gold',
        pointsNeeded: POINTS_CONFIG.tiers.gold.min - currentPoints,
        progress: (currentPoints / POINTS_CONFIG.tiers.gold.min) * 100
      };
    } else if (tier === 'Gold') {
      return {
        current: tier,
        next: 'Platinum',
        pointsNeeded: POINTS_CONFIG.tiers.platinum.min - currentPoints,
        progress: ((currentPoints - POINTS_CONFIG.tiers.gold.min) / (POINTS_CONFIG.tiers.platinum.min - POINTS_CONFIG.tiers.gold.min)) * 100
      };
    }
    return {
      current: tier,
      next: null,
      pointsNeeded: 0,
      progress: 100
    };
  };

  const tierInfo = getTierInfo();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{CLIENT_DATA?.profile?.name}</h3>
                <p className="text-gray-600">{CLIENT_DATA?.profile?.tier} Member</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(CLIENT_DATA?.profile?.memberSince || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{CLIENT_DATA?.profile?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{CLIENT_DATA?.profile?.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{CLIENT_DATA?.profile?.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Birthday
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {CLIENT_DATA?.profile?.birthday ? new Date(CLIENT_DATA.profile.birthday).toLocaleDateString() : 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Membership Tier */}
          <div className="bg-gradient-to-br from-purple-500 to-rose-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Membership Tier</h3>
              <Star className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-purple-100 text-sm">Current Tier</p>
                <p className="text-2xl font-bold">{tierInfo.current}</p>
              </div>
              {tierInfo.next && (
                <>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(tierInfo.progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-100">
                    {tierInfo.pointsNeeded} points to {tierInfo.next}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-semibold text-gray-900">{CLIENT_DATA?.stats?.totalBookings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-semibold text-gray-900">KES {(CLIENT_DATA?.stats?.totalSpent || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Points Balance</span>
                <span className="font-semibold text-rose-primary">{CLIENT_DATA?.stats?.pointsEarned || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Favorite Service</span>
                <span className="font-semibold text-gray-900">{CLIENT_DATA?.stats?.favoriteService || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Notification Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Privacy Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}