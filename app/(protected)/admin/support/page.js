"use client";

import { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, User, Calendar, Search, Filter } from 'lucide-react';

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock support tickets
  const [tickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Payment not processed',
      description: 'My payment was deducted but booking not confirmed',
      user: 'Faith Kiplangat',
      userType: 'client',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      assignedTo: 'Admin Team'
    },
    {
      id: 'TKT-002', 
      subject: 'Provider verification delay',
      description: 'Submitted documents 5 days ago, still pending approval',
      user: 'John Beauty Salon',
      userType: 'provider',
      priority: 'medium',
      status: 'in-progress',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      assignedTo: 'Verification Team'
    },
    {
      id: 'TKT-003',
      subject: 'Service quality complaint',
      description: 'Unsatisfied with makeup service quality, requesting refund',
      user: 'Grace Mwangi',
      userType: 'client',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2024-01-13T16:20:00Z',
      updatedAt: '2024-01-14T10:30:00Z',
      assignedTo: 'Customer Success'
    }
  ]);

  // Mock disputes
  const [disputes] = useState([
    {
      id: 'DSP-001',
      title: 'Service not provided',
      client: 'Faith Kiplangat',
      provider: 'Sarah Johnson',
      bookingId: 'book_001',
      amount: 3500,
      reason: 'Provider did not show up for appointment',
      status: 'pending',
      createdAt: '2024-01-15T08:00:00Z',
      evidence: ['Screenshot of booking confirmation', 'No-show photo']
    },
    {
      id: 'DSP-002',
      title: 'Payment dispute',
      client: 'Grace Mwangi', 
      provider: 'Mary Wanjiku',
      bookingId: 'book_002',
      amount: 2800,
      reason: 'Charged extra fees not mentioned in booking',
      status: 'investigating',
      createdAt: '2024-01-14T12:30:00Z',
      evidence: ['Payment receipt', 'Chat conversation']
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTicketAction = (ticketId, action) => {
    console.log(`${action} ticket:`, ticketId);
    // Backend integration point
  };

  const handleDisputeAction = (disputeId, action) => {
    console.log(`${action} dispute:`, disputeId);
    // Backend integration point
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support & Disputes</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {activeTab === 'tickets' ? filteredTickets.length : filteredDisputes.length} items
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-blue-600">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Disputes</p>
              <p className="text-2xl font-bold text-red-600">
                {disputes.filter(d => ['pending', 'investigating'].includes(d.status)).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-600">2.5h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['tickets', 'disputes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-rose-primary text-rose-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} ({tab === 'tickets' ? tickets.length : disputes.length})
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              {activeTab === 'tickets' ? (
                <>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{ticket.user} ({ticket.userType})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>Assigned to: {ticket.assignedTo}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleTicketAction(ticket.id, 'view')}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        View
                      </button>
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => handleTicketAction(ticket.id, 'assign')}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Assign
                        </button>
                      )}
                      {ticket.status === 'in-progress' && (
                        <button
                          onClick={() => handleTicketAction(ticket.id, 'resolve')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => (
                <div key={dispute.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{dispute.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                          {dispute.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{dispute.reason}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Client:</span>
                          <p className="font-medium">{dispute.client}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Provider:</span>
                          <p className="font-medium">{dispute.provider}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium">KES {dispute.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-gray-500">Evidence: </span>
                        <span className="text-xs text-gray-700">{dispute.evidence.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDisputeAction(dispute.id, 'investigate')}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Investigate
                      </button>
                      {dispute.status === 'pending' && (
                        <button
                          onClick={() => handleDisputeAction(dispute.id, 'mediate')}
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Mediate
                        </button>
                      )}
                      {dispute.status === 'investigating' && (
                        <button
                          onClick={() => handleDisputeAction(dispute.id, 'resolve')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'tickets' ? filteredTickets : filteredDisputes).length === 0 && (
            <div className="text-center py-12">
              {activeTab === 'tickets' ? (
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}