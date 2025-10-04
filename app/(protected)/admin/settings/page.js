"use client";

import { useState } from 'react';
import { Settings, Save, RefreshCw, Shield, DollarSign, Users, Bell } from 'lucide-react';
import { PLATFORM_CONFIG } from '@/lib/normalized-data';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('platform');
  const [settings, setSettings] = useState({
    platform: {
      siteName: 'Glamease',
      siteDescription: 'Your premier beauty services platform',
      supportEmail: 'support@glamease.com',
      maintenanceMode: false,
      allowRegistrations: true
    },
    commission: {
      rate: PLATFORM_CONFIG.commission.rate,
      minimum: PLATFORM_CONFIG.commission.minimum,
      maximum: PLATFORM_CONFIG.commission.maximum
    },
    points: {
      earningRate: PLATFORM_CONFIG.points.earningRate,
      bonusPoints: { ...PLATFORM_CONFIG.points.bonusPoints },
      redemptionMinimum: PLATFORM_CONFIG.points.redemptionMinimum,
      expiryMonths: PLATFORM_CONFIG.points.expiryMonths
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      marketingEmails: false
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordMinLength: 8
    },
    payouts: {
      frequency: 'weekly',
      minimumAmount: 1000,
      processingDays: 3,
      autoProcess: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category, parentKey, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parentKey]: {
          ...prev[category][parentKey],
          [key]: value
        }
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset logic here
      console.log('Resetting to defaults');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'platform', label: 'Platform', icon: Settings },
              { key: 'commission', label: 'Commission', icon: DollarSign },
              { key: 'points', label: 'Points System', icon: Users },
              { key: 'notifications', label: 'Notifications', icon: Bell },
              { key: 'security', label: 'Security', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-rose-primary text-rose-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'platform' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Platform Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.platform.siteName}
                    onChange={(e) => handleSettingChange('platform', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.platform.supportEmail}
                    onChange={(e) => handleSettingChange('platform', 'supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.platform.siteDescription}
                  onChange={(e) => handleSettingChange('platform', 'siteDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  rows="3"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">Temporarily disable the platform for maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.platform.maintenanceMode}
                      onChange={(e) => handleSettingChange('platform', 'maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow New Registrations</h4>
                    <p className="text-sm text-gray-600">Allow new users to register on the platform</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.platform.allowRegistrations}
                      onChange={(e) => handleSettingChange('platform', 'allowRegistrations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commission' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Commission Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={settings.commission.rate * 100}
                    onChange={(e) => handleSettingChange('commission', 'rate', parseFloat(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current: {(settings.commission.rate * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Commission (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.commission.minimum}
                    onChange={(e) => handleSettingChange('commission', 'minimum', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Commission (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.commission.maximum}
                    onChange={(e) => handleSettingChange('commission', 'maximum', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Commission Preview</h4>
                <div className="text-sm text-blue-800">
                  <p>For a KES 3,000 service:</p>
                  <p>• Platform commission: KES {Math.round(3000 * settings.commission.rate).toLocaleString()}</p>
                  <p>• Provider earnings: KES {Math.round(3000 * (1 - settings.commission.rate)).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'points' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Points System Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Earning Rate</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={settings.points.earningRate}
                      onChange={(e) => handleSettingChange('points', 'earningRate', parseFloat(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">points per KES 100</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points Expiry (months)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.points.expiryMonths}
                    onChange={(e) => handleSettingChange('points', 'expiryMonths', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Bonus Points</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Booking</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.points.bonusPoints.firstBooking}
                      onChange={(e) => handleNestedSettingChange('points', 'bonusPoints', 'firstBooking', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Bonus</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.points.bonusPoints.review}
                      onChange={(e) => handleNestedSettingChange('points', 'bonusPoints', 'review', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referral Bonus</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.points.bonusPoints.referral}
                      onChange={(e) => handleNestedSettingChange('points', 'bonusPoints', 'referral', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Send email notifications to users'}
                        {key === 'smsNotifications' && 'Send SMS notifications for important updates'}
                        {key === 'pushNotifications' && 'Send push notifications via mobile app'}
                        {key === 'marketingEmails' && 'Send promotional and marketing emails'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Email Verification</h4>
                    <p className="text-sm text-gray-600">Users must verify their email before accessing the platform</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-primary"></div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                    <input
                      type="number"
                      min="6"
                      max="32"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}