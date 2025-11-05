"use client";

import { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    fetch(`/api/admin/users?type=${activeTab}`, {
      headers: { 'x-user-id': userId, 'x-user-role': userRole }
    }).then(r => r.json()).then(data => {
      setAllUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [activeTab]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = (action, userId) => {
    if (action === 'view') {
      const user = allUsers.find(u => u.id === userId);
      setViewingUser(user);
    } else if (action === 'edit') {
      alert('Edit functionality: Navigate to user profile page');
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this user?')) {
        alert('Delete functionality: Would call DELETE /api/admin/users/' + userId);
      }
    }
  };

  const getStatusBadge = (status, verified = true) => {
    if (status === 'active' && verified) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Active
      </span>;
    }
    if (status === 'active' && !verified) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
    }
    return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
      <XCircle className="w-3 h-3" /> Inactive
    </span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{filteredUsers.length} users found</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['providers', 'clients'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-rose-primary text-rose-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'providers' ? 'Performance' : 'Activity'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {activeTab === 'providers' && (
                          <div className="text-sm text-gray-500">{user.specialty}</div>
                        )}
                        {activeTab === 'clients' && (
                          <div className="text-sm text-gray-500">{user.tier} Member</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activeTab === 'providers' ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          KES {user.totalRevenue?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.totalBookings || 0} bookings • ⭐ {user.rating || 0}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          KES {user.totalSpent?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.totalBookings || 0} bookings • {user.points || 0} points
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status, user.verified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUserAction('view', user.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction('edit', user.id)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction('delete', user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={() => setViewingUser(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-medium">{viewingUser.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium">{viewingUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium">{viewingUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <p className="font-medium">{viewingUser.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className="font-medium">{viewingUser.status}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Joined</label>
                  <p className="font-medium">{new Date(viewingUser.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              {activeTab === 'providers' && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm text-gray-600">Specialty</label>
                    <p className="font-medium">{viewingUser.specialty || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Experience</label>
                    <p className="font-medium">{viewingUser.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Revenue</label>
                    <p className="font-medium">KES {viewingUser.totalRevenue?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Bookings</label>
                    <p className="font-medium">{viewingUser.totalBookings || 0}</p>
                  </div>
                </div>
              )}
              {activeTab === 'clients' && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm text-gray-600">Tier</label>
                    <p className="font-medium">{viewingUser.tier}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Points</label>
                    <p className="font-medium">{viewingUser.points || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Spent</label>
                    <p className="font-medium">KES {viewingUser.totalSpent?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Bookings</label>
                    <p className="font-medium">{viewingUser.totalBookings || 0}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
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