"use client";

import { useState, useEffect } from 'react';
import { Bell, Calendar, Gift, Star, CheckCircle, X } from 'lucide-react';

export default function ClientNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    fetch('/api/notifications', {
      headers: { 'x-user-id': userId, 'x-user-role': userRole }
    }).then(r => r.json()).then(data => {
      setNotifications(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setNotifications([]);
      setLoading(false);
    });
  }, []);

  const [oldNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your hair styling appointment with Sarah Johnson is confirmed for Jan 15, 10:00 AM',
      time: '2 hours ago',
      read: false,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'reward',
      title: 'Points Earned!',
      message: 'You earned 35 points from your recent nail art service. Total: 1,250 points',
      time: '1 day ago',
      read: false,
      icon: Gift,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Appointment Reminder',
      message: 'Your makeup session with Mary Wanjiku is tomorrow at 2:30 PM',
      time: '1 day ago',
      read: true,
      icon: Bell,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      id: 4,
      type: 'review',
      title: 'Rate Your Service',
      message: 'How was your nail art service with Jane Doe? Rate and earn 10 bonus points!',
      time: '3 days ago',
      read: false,
      icon: Star,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    {
      id: 5,
      type: 'promotion',
      title: 'Special Offer',
      message: '20% off all hair services this weekend! Use your Gold member discount.',
      time: '1 week ago',
      read: true,
      icon: Gift,
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = async (id) => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
      body: JSON.stringify({ action: 'markAsRead', notificationId: id })
    });
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = async () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
      body: JSON.stringify({ action: 'markAllAsRead' })
    });
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = async (id) => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    await fetch('/api/notifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
      body: JSON.stringify({ notificationId: id })
    });
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getIconComponent = (iconName) => {
    const iconMap = { Calendar, Star, Gift, Bell };
    return iconMap[iconName] || Bell;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const getActionButton = (notification) => {
    switch (notification.type) {
      case 'review':
        return (
          <button className="px-3 py-1 text-sm bg-rose-primary text-white rounded hover:bg-rose-dark">
            Rate Service
          </button>
        );
      case 'booking':
        return (
          <button className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
            View Details
          </button>
        );
      case 'reward':
        return (
          <button className="px-3 py-1 text-sm border border-purple-300 text-purple-600 rounded hover:bg-purple-50">
            View Rewards
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'booking', label: 'Bookings' },
            { key: 'reward', label: 'Rewards' },
            { key: 'reminder', label: 'Reminders' },
            { key: 'promotion', label: 'Promotions' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-rose-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
              {key === 'unread' && unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const Icon = getIconComponent(notification.icon);
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  notification.read ? 'border-gray-200' : 'border-rose-primary'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`${notification.bg} p-3 rounded-full`}>
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-rose-primary rounded-full"></span>
                        )}
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} mb-2`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {getActionButton(notification)}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}