"use client";

import { useState } from 'react';
import { Search, MapPin, Star, Clock, Gift, Calendar } from 'lucide-react';
import { AVAILABLE_SERVICES, PROVIDER_DATA } from '@/lib/constants';

export default function ClientServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Mock providers data - in real app, this would come from API
  const providers = [
    {
      id: 1,
      name: "Sarah Beauty Studio",
      location: "Westlands, Nairobi",
      rating: 4.8,
      reviews: 156,
      services: PROVIDER_DATA.services,
      distance: "2.1 km",
      image: "/provider1.jpg"
    },
    {
      id: 2,
      name: "Glamour Palace",
      location: "CBD, Nairobi",
      rating: 4.6,
      reviews: 89,
      services: [
        { id: 1, name: "Hair Styling", price: 3000, points: 30, duration: 90, ratings: 4.7 },
        { id: 3, name: "Nail Art", price: 1800, points: 18, duration: 60, ratings: 4.5 }
      ],
      distance: "1.5 km",
      image: "/provider2.jpg"
    }
  ];

  const categories = ['all', 'Hair', 'Makeup', 'Nails', 'Facial'];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => 
                           service.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'all' || 
                           provider.services.some(service => 
                             service.name.toLowerCase().includes(selectedCategory.toLowerCase())
                           );
    
    return matchesSearch && matchesCategory;
  });

  const handleBookService = (provider, service) => {
    console.log('Booking service:', { provider: provider.name, service: service.name });
    // Backend integration point
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Browse Services</h1>
        <div className="text-sm text-gray-600">
          {filteredProviders.length} providers found
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-primary focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="space-y-6">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Provider Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-bold text-xl">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{provider.rating} ({provider.reviews} reviews)</span>
                      </div>
                      <span>{provider.distance} away</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-rose-primary text-rose-primary rounded-lg hover:bg-rose-50 transition-colors">
                  View Profile
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Available Services</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {provider.services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 hover:border-rose-primary transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{service.name}</h5>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{service.ratings}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">KES {service.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Gift className="w-3 h-3" />
                          <span>+{service.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookService(provider, service)}
                      className="w-full py-2 px-4 bg-rose-primary text-white rounded-lg hover:bg-rose-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}