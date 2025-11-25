"use client";

import { useState, useEffect } from 'react';
import { Star, Clock, MapPin, User, Sparkles } from "lucide-react";
import Link from "next/link";

const gradients = [
  'from-rose-400 via-pink-500 to-purple-500',
  'from-blue-400 via-cyan-500 to-teal-500',
  'from-amber-400 via-orange-500 to-red-500',
  'from-purple-400 via-violet-500 to-indigo-500',
  'from-green-400 via-emerald-500 to-teal-500',
  'from-pink-400 via-rose-500 to-red-500'
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services/with-providers')
      .then(r => r.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(services.map(s => s.category?.name).filter(Boolean))];

  const filteredServices = services.filter(service => {
    const categoryName = service.category?.name || 'Uncategorized';
    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.providerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-rose-primary mx-auto mb-4 animate-pulse" />
          <div className="text-lg text-gray-600">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-rose-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Beauty Services
            </h1>
          </div>
          <p className="text-gray-600 mb-6">Discover amazing beauty services from verified providers</p>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search services or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`h-40 bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {service.category?.name || 'Service'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{service.providerName}</p>
                    <p className="text-xs text-gray-500">{service.providerLocation || 'Nairobi'}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description || 'Professional beauty service'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1.5 text-rose-500" />
                      <span>{service.duration} mins</span>
                    </div>
                    <div className="flex items-center text-sm text-amber-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="font-medium">{(service.avgRating || 0).toFixed(1)}</span>
                      <span className="text-gray-400 ml-1">({service.totalReviews || 0})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                      KSh {parseFloat(service.basePrice).toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                      +{service.points} pts
                    </span>
                  </div>
                </div>

                <Link
                  href="/signup"
                  className="block w-full bg-gradient-to-r from-rose-500 to-purple-500 text-white text-center py-3 rounded-xl hover:from-rose-600 hover:to-purple-600 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
