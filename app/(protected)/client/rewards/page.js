"use client";

import { useState, useEffect } from 'react';
import { Gift, Star, Clock, TrendingUp, Award } from 'lucide-react';

export default function ClientRewardsPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/profile').then(r => r.json()).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const currentPoints = profile.userPoints?.currentPoints || 0;
  const lifetimePoints = profile.userPoints?.lifetimePoints || 0;
  const tier = profile.userPoints?.tier || 'BRONZE';

  const getTierProgress = () => {
    if (tier === 'BRONZE') return { next: 1000, progress: (currentPoints / 1000) * 100, nextTier: 'GOLD' };
    if (tier === 'GOLD') return { next: 5000, progress: ((currentPoints - 1000) / 4000) * 100, nextTier: 'PLATINUM' };
    return { next: null, progress: 100, nextTier: null };
  };

  const tierProgress = getTierProgress();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rewards & Points</h1>
        <div className="text-right">
          <p className="text-2xl font-bold text-rose-primary">{currentPoints} Points</p>
          <p className="text-sm text-gray-600">{tier} Member</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-rose-500 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Current Tier: {tier}</h3>
            {tierProgress.next && (
              <p className="text-purple-100">{tierProgress.next - currentPoints} points to {tierProgress.nextTier}</p>
            )}
          </div>
          <Award className="w-8 h-8" />
        </div>
        {tierProgress.next && (
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(tierProgress.progress, 100)}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">{lifetimePoints}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Redeemed</p>
              <p className="text-2xl font-bold text-purple-600">{lifetimePoints - currentPoints}</p>
            </div>
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-rose-primary">{currentPoints}</p>
            </div>
            <Star className="w-8 h-8 text-rose-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">How to Earn Points</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Complete a booking</span>
            <span className="font-semibold text-green-600">+Points based on service</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Refer a friend</span>
            <span className="font-semibold text-green-600">+100 points</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Leave a review</span>
            <span className="font-semibold text-green-600">+10 points</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Redeem Points</h3>
        <p className="text-gray-600 mb-4">Use your points during booking to get up to 30% discount!</p>
        <button 
          onClick={() => window.location.href = '/client/services'}
          className="px-6 py-3 bg-rose-primary text-white rounded-lg hover:bg-rose-dark"
        >
          Book a Service
        </button>
      </div>
    </div>
  );
}
