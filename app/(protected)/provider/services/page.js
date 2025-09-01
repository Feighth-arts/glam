"use client";

import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { MdModeEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';

// Mock data for initial testing
const mockServices = [
  {
    id: 1,
    name: "Hair Styling",
    price: 2500,
    points: 25,
    ratings: 4.5,
    totalRatings: 128
  },
  {
    id: 2,
    name: "Makeup",
    price: 3000,
    points: 30,
    ratings: 4.8,
    totalRatings: 95
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    points: '',
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewService({ name: '', price: '', points: '' });
  };

  const handleSaveNew = () => {
    if (!newService.name || !newService.price || !newService.points) {
      // You can add proper validation feedback here
      return;
    }

    setServices(prev => [...prev, {
      id: Date.now(),
      ...newService,
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
      points: service.points
    });
  };

  const handleSaveEdit = (id) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, ...newService }
        : service
    ));
    setEditingId(null);
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

            {/* Rating display - read only */}
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
                ({service.totalRatings} ratings)
              </span>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Price (KES)</label>
            {isEditing ? (
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
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
            <label className="text-sm font-medium text-gray-700">Reward Points</label>
            {isEditing ? (
              <input
                type="number"
                value={newService.points}
                onChange={(e) => setNewService(prev => ({ ...prev, points: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                placeholder="Points"
              />
            ) : (
              <p className="text-lg font-semibold text-gold-dark">
                {service.points} points
              </p>
            )}
          </div>
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
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                  placeholder="Price (KES)"
                />
                <input
                  type="number"
                  value={newService.points}
                  onChange={(e) => setNewService(prev => ({ ...prev, points: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-primary"
                  placeholder="Reward points"
                />
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
