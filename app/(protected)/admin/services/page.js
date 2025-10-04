"use client";

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, Clock, Star } from 'lucide-react';
import { SERVICE_CATALOG, USERS } from '@/lib/normalized-data';

export default function AdminServicesPage() {
  const [services, setServices] = useState(SERVICE_CATALOG);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [newService, setNewService] = useState({
    name: '',
    category: '',
    basePrice: '',
    duration: '',
    description: ''
  });

  const categories = ['all', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = () => {
    if (!newService.name || !newService.basePrice) return;
    
    const service = {
      id: Math.max(...services.map(s => s.id)) + 1,
      ...newService,
      basePrice: Number(newService.basePrice),
      duration: Number(newService.duration),
      points: Math.floor(Number(newService.basePrice) / 100)
    };
    
    setServices([...services, service]);
    setNewService({ name: '', category: '', basePrice: '', duration: '', description: '' });
    setIsAddingService(false);
  };

  const handleEditService = (service) => {
    setEditingService(service.id);
    setNewService({
      name: service.name,
      category: service.category,
      basePrice: service.basePrice.toString(),
      duration: service.duration.toString(),
      description: service.description
    });
  };

  const handleUpdateService = () => {
    setServices(services.map(service => 
      service.id === editingService 
        ? {
            ...service,
            ...newService,
            basePrice: Number(newService.basePrice),
            duration: Number(newService.duration),
            points: Math.floor(Number(newService.basePrice) / 100)
          }
        : service
    ));
    setEditingService(null);
    setNewService({ name: '', category: '', basePrice: '', duration: '', description: '' });
  };

  const handleDeleteService = (serviceId) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  const getServiceProviders = (serviceId) => {
    return USERS.providers.filter(provider => provider.services.includes(serviceId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
        <button
          onClick={() => setIsAddingService(true)}
          className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-blue-600">{categories.length - 1}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">C</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-green-600">
                KES {Math.round(services.reduce((sum, s) => sum + s.basePrice, 0) / services.length).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)} min
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Service Form */}
      {(isAddingService || editingService) && (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-rose-primary">
          <h3 className="text-lg font-semibold mb-4">
            {isAddingService ? 'Add New Service' : 'Edit Service'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Category"
              value={newService.category}
              onChange={(e) => setNewService({...newService, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Base price (KES)"
              value={newService.basePrice}
              onChange={(e) => setNewService({...newService, basePrice: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newService.duration}
              onChange={(e) => setNewService({...newService, duration: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            />
          </div>
          <textarea
            placeholder="Service description"
            value={newService.description}
            onChange={(e) => setNewService({...newService, description: e.target.value})}
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            rows="3"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setIsAddingService(false);
                setEditingService(null);
                setNewService({ name: '', category: '', basePrice: '', duration: '', description: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isAddingService ? handleAddService : handleUpdateService}
              className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors"
            >
              {isAddingService ? 'Add Service' : 'Update Service'}
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const providers = getServiceProviders(service.id);
          return (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {service.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base Price</span>
                  <span className="font-semibold text-gray-900">KES {service.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{service.duration} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="font-semibold text-green-600">{service.points} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Providers</span>
                  <span className="font-semibold text-purple-600">{providers.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}