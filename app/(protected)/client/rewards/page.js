"use client";

import { useState } from 'react';
import { Gift, Star, Clock, TrendingUp, Award } from 'lucide-react';
import { USERS, REWARDS_CATALOG, PLATFORM_CONFIG, getUserTier } from '@/lib/normalized-data';

export default function ClientRewardsPage() {
  const [activeTab, setActiveTab] = useState('available');
  const clientId = "client_001";
  const client = USERS.clients.find(c => c.id === clientId);
  const currentPoints = client?.stats?.currentPoints || 0;
  const tier = getUserTier(currentPoints);

  const getTierProgress = () => {
    const tiers = PLATFORM_CONFIG.tiers;
    if (tier === 'Bronze') return { current: currentPoints, next: tiers.gold.min, progress: (currentPoints / tiers.gold.min) * 100 };
    if (tier === 'Gold') return { current: currentPoints, next: tiers.platinum.min, progress: ((currentPoints - tiers.gold.min) / (tiers.platinum.min - tiers.gold.min)) * 100 };
    return { current: currentPoints, next: null, progress: 100 };
  };

  const canRedeem = (reward) => currentPoints >= reward.points;

  const handleRedeem = (reward) => {
    if (!canRedeem(reward)) return;
    if (confirm(`Redeem ${reward.name} for ${reward.points} points?`)) {
      alert('Reward redeemed successfully! Check your bookings to use it.');
    }
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

      {/* Tier Progress */}
      <div className="bg-gradient-to-r from-purple-500 to-rose-500 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Current Tier: {tier}</h3>
            {tierProgress.next && (
              <p className="text-purple-100">{tierProgress.next - currentPoints} points to {tier === 'Bronze' ? 'Gold' : 'Platinum'}</p>
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

      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">{client?.stats?.lifetimePoints || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Redeemed</p>
              <p className="text-2xl font-bold text-purple-600">{client?.stats?.pointsRedeemed || 0}</p>
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['available', 'redeemed', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-rose-primary text-rose-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Discount Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REWARDS_CATALOG.discounts.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{reward.name}</h4>
                        <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded">
                          {reward.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {reward.discount}% off • Min spend: KES {reward.minSpend.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem(reward)}
                        className={`w-full py-2 px-4 rounded text-sm font-medium ${
                          canRedeem(reward)
                            ? 'bg-rose-primary text-white hover:bg-rose-dark'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canRedeem(reward) ? 'Redeem' : 'Insufficient Points'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Free Service Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REWARDS_CATALOG.services.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{reward.name}</h4>
                        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {reward.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Value: KES {reward.value.toLocaleString()} • {reward.category}
                      </p>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem(reward)}
                        className={`w-full py-2 px-4 rounded text-sm font-medium ${
                          canRedeem(reward)
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canRedeem(reward) ? 'Redeem' : 'Insufficient Points'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'redeemed' && (
            <div className="space-y-4">
              {client?.rewards?.redeemed?.map((reward) => (
                <div key={reward.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{reward.name}</h4>
                    <p className="text-sm text-gray-600">
                      Redeemed: {reward.redeemedDate} • Status: {reward.used ? 'Used' : 'Available'}
                    </p>
                  </div>
                  {!reward.used && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Ready to Use
                    </span>
                  )}
                </div>
              )) || (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No redeemed rewards yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {client?.pointsHistory?.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {entry.type === 'earned' ? '+' : ''}{entry.points} points
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.source} • {entry.date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    entry.type === 'earned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.type}
                  </span>
                </div>
              )) || (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No points history yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}