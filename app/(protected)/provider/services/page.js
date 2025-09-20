"use client";

import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { MdModeEdit, MdDelete, MdSave, MdClose, MdSchedule } from 'react-icons/md';
import { Clock, Calendar } from 'lucide-react';
import { PROVIDER_DATA } from '@/lib/constants';

// Mock data for initial testing
const mockServices = PROVIDER_DATA.services;

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    points: '',
    duration: '',
    availability: {
      days: [],
      timeSlots: []
    }
  });

  const [showAvailability, setShowAvailability] = useState(null);
  const [tempTimeSlot, setTempTimeSlot] = useState('');

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewService({ 
      name: '', 
      price: '', 
      points: '', 
      duration: '',
      availability: { days: [], timeSlots: [] }
    });
  };

  const handleSaveNew = () => {
    if (!newService.name || !newService.price || !newService.points || !newService.duration) {
      return;
    }

    setServices(prev => [...prev, {
      id: Date.now(),
      ...newService,
      price: Number(newService.price),
      points: Number(newService.points),
      duration: Number(newService.duration),
      ratings: 0,
      totalRatings: 0
    }]);
    setIsAddingNew(false);
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setNewService({
      name: service.name,
      price: service.price,
      points: service.points,
      duration: service.duration,
      availability: service.availability
    });
  };

  const handleSaveEdit = (id) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { 
            ...service, 
            ...newService,
            price: Number(newService.price),
            points: Number(newService.points),
            duration: Number(newService.duration)
          }
        : service
    ));
    setEditingId(null);
  };

  const toggleDay = (day) => {
    setNewService(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const addTimeSlot = () => {
    if (tempTimeSlot && !newService.availability.timeSlots.includes(tempTimeSlot)) {
      setNewService(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          timeSlots: [...prev.availability.timeSlots, tempTimeSlot]
        }
      }));
      setTempTimeSlot('');
    }
  };

  const removeTimeSlot = (timeSlot) => {
    setNewService(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.filter(t => t !== timeSlot)
      }
    }));
  };

  const handleDelete = (id) => {
    // You can add confirmation dialog here
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const ServiceCard = ({ service }) => {
    const isEditing = editingId === service.id;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                placeholder="Service name"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            )}

            {/* Rating and Duration */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= service.ratings
                          ? 'text-gold-dark'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({service.totalRatings})
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{service.duration} min</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSaveEdit(service.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                >
                  <MdSave className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <MdModeEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Price (KES)</label>
            {isEditing ? (
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                placeholder="Price"
              />
            ) : (
              <p className="text-lg font-semibold text-rose-primary">
                KES {service.price.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Points</label>
            {isEditing ? (
              <input
                type="number"
                value={newService.points}
                onChange={(e) => setNewService(prev => ({ ...prev, points: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                placeholder="Points"
              />
            ) : (
              <p className="text-lg font-semibold text-gold-dark">
                {service.points} pts
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            {isEditing ? (
              <input
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                placeholder="Minutes"
              />
            ) : (
              <p className="text-lg font-semibold text-blue-600">
                {service.duration} min
              </p>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Availability</label>
            <button
              onClick={() => setShowAvailability(showAvailability === service.id ? null : service.id)}
              className="text-rose-primary hover:text-rose-dark text-sm flex items-center gap-1"
            >
              <MdSchedule className="w-4 h-4" />
              {showAvailability === service.id ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {!isEditing && (
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                <span>{service.availability.days.length} days available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{service.availability.timeSlots.length} time slots</span>
              </div>
            </div>
          )}

          {showAvailability === service.id && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Available Days</label>
                  <div className="flex flex-wrap gap-1">
                    {service.availability.days.map(day => (
                      <span key={day} className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded">
                        {daysOfWeek.find(d => d.key === day)?.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Time Slots</label>
                  <div className="flex flex-wrap gap-1">
                    {service.availability.timeSlots.map(time => (
                      <span key={time} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors"
        >
          <IoMdAdd className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="grid gap-6">
        {isAddingNew && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border-2 border-rose-primary">
            <div className="space-y-4">
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                placeholder="Service name"
              />
              
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                  placeholder="Price (KES)"
                />
                <input
                  type="number"
                  value={newService.points}
                  onChange={(e) => setNewService(prev => ({ ...prev, points: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                  placeholder="Points"
                />
                <input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                  placeholder="Duration (min)"
                />
              </div>

              {/* Availability Settings */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Available Days</label>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleDay(key)}
                        className={`py-2 px-2 text-sm font-medium rounded-lg transition-all ${
                          newService.availability.days.includes(key)
                            ? 'bg-rose-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Time Slots</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="time"
                      value={tempTimeSlot}
                      onChange={(e) => setTempTimeSlot(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                    />
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newService.availability.timeSlots.map(time => (
                      <span
                        key={time}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-2"
                      >
                        {time}
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(time)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-2 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        )}

        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
