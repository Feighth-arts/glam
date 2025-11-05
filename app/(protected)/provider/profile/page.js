"use client";
import { useState, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  X, 
  Edit3,
  Star,
  Award,
  Calendar,
  Users,
  Clock,
  Scissors,
  Sparkles
} from "lucide-react";

// UpdateProfileForm Component
function UpdateProfileForm({ profile, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    location: profile?.location || "",
    experience: profile?.experience || "",
    license: profile?.license || "",
    specialty: profile?.specialty || "",
    workingDays: profile?.workingDays || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    workingHours: profile?.workingHours || {
      start: "09:00",
      end: "18:00"
    },
    serviceAvailability: profile?.serviceAvailability || []
  });
  const [errors, setErrors] = useState({});
  const [tempTimeSlot, setTempTimeSlot] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  const [availableServices, setAvailableServices] = useState([]);
  
  useEffect(() => {
    // Fetch available services for the form
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const services = await response.json();
          setAvailableServices(services.map(s => ({ id: s.id, name: s.name })));
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day]
      }
    }));
  };

  const handleTimeChange = (timeType, value) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [timeType]: value
      }
    }));
  };

  const addServiceTimeSlot = () => {
    if (!selectedService || !tempTimeSlot) return;
    
    const serviceData = availableServices.find(s => s.id === parseInt(selectedService));
    if (!serviceData) return;

    setFormData(prev => {
      const existingServiceIndex = prev.serviceAvailability.findIndex(s => s.serviceId === parseInt(selectedService));
      
      if (existingServiceIndex >= 0) {
        const updatedAvailability = [...prev.serviceAvailability];
        if (!updatedAvailability[existingServiceIndex].timeSlots.includes(tempTimeSlot)) {
          updatedAvailability[existingServiceIndex].timeSlots.push(tempTimeSlot);
        }
        return { ...prev, serviceAvailability: updatedAvailability };
      } else {
        return {
          ...prev,
          serviceAvailability: [
            ...prev.serviceAvailability,
            { serviceId: parseInt(selectedService), serviceName: serviceData.name, timeSlots: [tempTimeSlot] }
          ]
        };
      }
    });
    
    setTempTimeSlot('');
  };

  const removeServiceTimeSlot = (serviceId, timeSlot) => {
    setFormData(prev => ({
      ...prev,
      serviceAvailability: prev.serviceAvailability.map(service => 
        service.serviceId === serviceId
          ? { ...service, timeSlots: service.timeSlots.filter(t => t !== timeSlot) }
          : service
      ).filter(service => service.timeSlots.length > 0)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.experience && (isNaN(formData.experience) || formData.experience < 0)) {
      newErrors.experience = 'Experience must be a positive number';
    }

    // Check if at least one day is selected
    const hasWorkingDay = Object.values(formData.workingDays).some(day => day);
    if (!hasWorkingDay) {
      newErrors.workingDays = 'Please select at least one working day';
    }

    // Validate working hours
    if (formData.workingHours.start >= formData.workingHours.end) {
      newErrors.workingHours = 'Start time must be before end time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          className="block text-sm font-medium mb-2" 
          style={{ color: '#0A1014' }}
        >
          Full Name *
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
          style={{ 
            borderColor: errors.name ? '#F43F5E' : '#E5E7EB',
            '--tw-ring-color': '#F43F5E'
          }}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <span className="text-sm mt-1 block" style={{ color: '#F43F5E' }}>
            {errors.name}
          </span>
        )}
      </div>

      <div>
        <label 
          className="block text-sm font-medium mb-2" 
          style={{ color: '#0A1014' }}
        >
          Beauty Specialty
        </label>
        <input
          name="specialty"
          value={formData.specialty}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
          style={{ 
            borderColor: '#E5E7EB',
            '--tw-ring-color': '#F43F5E'
          }}
          placeholder="e.g., Nail Artist, Hair Stylist, Makeup Artist"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label 
            className="block text-sm font-medium mb-2" 
            style={{ color: '#0A1014' }}
          >
            Phone Number
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
            style={{ 
              borderColor: '#E5E7EB',
              '--tw-ring-color': '#F43F5E'
            }}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium mb-2" 
            style={{ color: '#0A1014' }}
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
            style={{ 
              borderColor: errors.email ? '#F43F5E' : '#E5E7EB',
              '--tw-ring-color': '#F43F5E'
            }}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <span className="text-sm mt-1 block" style={{ color: '#F43F5E' }}>
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div>
        <label 
          className="block text-sm font-medium mb-2" 
          style={{ color: '#0A1014' }}
        >
          Salon/Studio Location
        </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
          style={{ 
            borderColor: '#E5E7EB',
            '--tw-ring-color': '#F43F5E'
          }}
          placeholder="City, State or Address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label 
            className="block text-sm font-medium mb-2" 
            style={{ color: '#0A1014' }}
          >
            Years of Experience
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            min="0"
            max="50"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
            style={{ 
              borderColor: errors.experience ? '#F43F5E' : '#E5E7EB',
              '--tw-ring-color': '#F43F5E'
            }}
            placeholder="0"
          />
          {errors.experience && (
            <span className="text-sm mt-1 block" style={{ color: '#F43F5E' }}>
              {errors.experience}
            </span>
          )}
        </div>

        <div>
          <label 
            className="block text-sm font-medium mb-2" 
            style={{ color: '#0A1014' }}
          >
            License/Certification
          </label>
          <input
            name="license"
            value={formData.license}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
            style={{ 
              borderColor: '#E5E7EB',
              '--tw-ring-color': '#F43F5E'
            }}
            placeholder="e.g., Cosmetology License #12345"
          />
        </div>
      </div>

      {/* Working Days */}
      <div>
        <label 
          className="block text-sm font-medium mb-3" 
          style={{ color: '#0A1014' }}
        >
          Working Days *
        </label>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleDayToggle(key)}
              className="py-2 px-2 text-sm font-medium rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: formData.workingDays[key] ? '#F43F5E' : '#F7F7F7',
                color: formData.workingDays[key] ? '#FFFFFF' : '#0A1014',
                border: `2px solid ${formData.workingDays[key] ? '#F43F5E' : '#E5E7EB'}`
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.workingDays && (
          <span className="text-sm mt-1 block" style={{ color: '#F43F5E' }}>
            {errors.workingDays}
          </span>
        )}
      </div>

      {/* Working Hours */}
      <div>
        <label 
          className="block text-sm font-medium mb-3" 
          style={{ color: '#0A1014' }}
        >
          Working Hours *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1" style={{ color: '#0A1014' }}>
              Start Time
            </label>
            <input
              type="time"
              value={formData.workingHours.start}
              onChange={(e) => handleTimeChange('start', e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
              style={{ 
                borderColor: errors.workingHours ? '#F43F5E' : '#E5E7EB',
                '--tw-ring-color': '#F43F5E'
              }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#0A1014' }}>
              End Time
            </label>
            <input
              type="time"
              value={formData.workingHours.end}
              onChange={(e) => handleTimeChange('end', e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:border-transparent transition-all"
              style={{ 
                borderColor: errors.workingHours ? '#F43F5E' : '#E5E7EB',
                '--tw-ring-color': '#F43F5E'
              }}
            />
          </div>
        </div>
        {errors.workingHours && (
          <span className="text-sm mt-1 block" style={{ color: '#F43F5E' }}>
            {errors.workingHours}
          </span>
        )}
      </div>

      {/* Service Time Slots Management */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#0A1014' }}>Service Time Slots</label>
        
        <div className="flex gap-2 mb-4">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
            style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#F43F5E' }}
          >
            <option value="">Select Service</option>
            {availableServices.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          <input
            type="time"
            value={tempTimeSlot}
            onChange={(e) => setTempTimeSlot(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
            style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#F43F5E' }}
          />
          <button
            type="button"
            onClick={addServiceTimeSlot}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90"
            style={{ backgroundColor: '#F43F5E' }}
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {formData.serviceAvailability.map((service, index) => (
            <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#F7F7F7' }}>
              <h4 className="font-medium mb-2" style={{ color: '#0A1014' }}>{service.serviceName}</h4>
              <div className="flex flex-wrap gap-2">
                {service.timeSlots.map((time, timeIndex) => (
                  <span
                    key={timeIndex}
                    className="px-3 py-1 text-sm rounded-full flex items-center gap-2"
                    style={{ backgroundColor: '#F43F5E', color: '#FFFFFF' }}
                  >
                    {time}
                    <button
                      type="button"
                      onClick={() => removeServiceTimeSlot(service.serviceId, time)}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t" style={{ borderColor: 'rgba(244, 63, 94, 0.1)' }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
          style={{ 
            backgroundColor: '#F7F7F7',
            color: '#0A1014'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
          style={{ 
            backgroundColor: isSubmitting ? '#E11D48' : '#F43F5E'
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Main ProviderProfile Component
export default function ProviderProfile({ profile: initialProfile = {} }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const response = await fetch('/api/users/profile', {
        headers: { 'x-user-id': userId, 'x-user-role': userRole }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      
      setProfile({
        name: data.name || "Provider",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        experience: data.experience || "0",
        license: data.license || "",
        avatar: data.avatar || "",
        specialty: data.specialty || "Beauty Service Provider",
        rating: data.stats?.avgRating || 0,
        clients: data.stats?.totalClients || 0,
        joinDate: new Date(data.createdAt).getFullYear().toString() || "2024",
        verified: data.verified || false,
        workingDays: data.workingDays || {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false
        },
        workingHours: data.workingHours || {
          start: "09:00",
          end: "18:00"
        },
        ...initialProfile
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      setProfile(prev => ({
        ...prev,
        ...updatedData
      }));
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const formatWorkingDays = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const workingDaysList = days
      .filter(day => profile.workingDays[day])
      .map(day => dayLabels[days.indexOf(day)]);
    
    if (workingDaysList.length === 0) return 'No working days set';
    if (workingDaysList.length === 7) return 'Every day';
    if (workingDaysList.length >= 5) return `${workingDaysList.slice(0, -1).join(', ')} & ${workingDaysList.slice(-1)}`;
    return workingDaysList.join(', ');
  };

  const formatWorkingHours = () => {
    if (!profile.workingHours.start || !profile.workingHours.end) return 'Not set';
    
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${formatTime(profile.workingHours.start)} - ${formatTime(profile.workingHours.end)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ 
        background: `linear-gradient(135deg, #F7F7F7 0%, #FFE4E6 100%)`
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Main Profile Card */}
        <div 
          className="shadow-2xl rounded-3xl overflow-hidden border"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(244, 63, 94, 0.1)'
          }}
        >
          
          {/* Hero Section */}
          <div className="relative">
            {/* Background Pattern */}
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)`
              }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-8 left-8 text-white/30">
                  <Sparkles size={24} />
                </div>
                <div className="absolute top-16 right-12 text-white/30">
                  <Scissors size={20} />
                </div>
                <div className="absolute bottom-12 left-16 text-white/30">
                  <Sparkles size={18} />
                </div>
                <div className="absolute bottom-8 right-8 text-white/30">
                  <Scissors size={22} />
                </div>
              </div>
            </div>

            <div className="relative px-8 py-12">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="relative">
                    <div 
                      className="w-32 h-32 rounded-full p-1 shadow-2xl"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold overflow-hidden"
                        style={{ 
                          background: `linear-gradient(135deg, #F7F7F7 0%, #FFE4E6 100%)`,
                          color: '#0A1014'
                        }}
                      >
                        {profile.avatar ? (
                          <img 
                            src={'/user.png'} 
                            // src={profile.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          profile.name?.charAt(0) || "S"
                        )}
                      </div>
                    </div>
                    {profile.verified && (
                      <div 
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-lg"
                        style={{ 
                          backgroundColor: '#FCD34D',
                          borderColor: '#FFFFFF'
                        }}
                      >
                        <Award size={16} style={{ color: '#0A1014' }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left text-white">
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                      {profile.name}
                    </h1>
                    <p className="text-xl font-medium opacity-90">
                      {profile.specialty || "Beauty Service Provider"}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-sm opacity-80 mt-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} style={{ color: '#FCD34D' }} className="fill-current" />
                        <span className="font-semibold text-white">{profile.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{profile.clients}+ clients</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Since {profile.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setOpen(true)}
                  className="group text-white border px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              
              <div 
                className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border"
                style={{ 
                  backgroundColor: '#F7F7F7',
                  borderColor: 'rgba(10, 16, 20, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                    style={{ backgroundColor: '#F43F5E' }}
                  >
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F43F5E' }}>Phone</p>
                    <p className="font-semibold" style={{ color: '#0A1014' }}>{profile.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div 
                className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border"
                style={{ 
                  backgroundColor: '#F7F7F7',
                  borderColor: 'rgba(10, 16, 20, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                    style={{ backgroundColor: '#E11D48' }}
                  >
                    <Mail size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#E11D48' }}>Email</p>
                    <p className="font-semibold truncate" style={{ color: '#0A1014' }}>{profile.email || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div 
                className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border"
                style={{ 
                  backgroundColor: '#F7F7F7',
                  borderColor: 'rgba(10, 16, 20, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                    style={{ backgroundColor: '#F43F5E' }}
                  >
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F43F5E' }}>Location</p>
                    <p className="font-semibold" style={{ color: '#0A1014' }}>{profile.location || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div 
                className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border"
                style={{ 
                  backgroundColor: '#F7F7F7',
                  borderColor: 'rgba(10, 16, 20, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)`
                    }}
                  >
                    <Briefcase size={20} style={{ color: '#0A1014' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#FBBF24' }}>Experience</p>
                    <p className="font-semibold" style={{ color: '#0A1014' }}>
                      {profile.experience ? `${profile.experience} Years` : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border md:col-span-2"
                style={{ 
                  backgroundColor: '#F7F7F7',
                  borderColor: 'rgba(10, 16, 20, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                    style={{ backgroundColor: '#E11D48' }}
                  >
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#E11D48' }}>License</p>
                    <p className="font-semibold" style={{ color: '#0A1014' }}>{profile.license || "Not provided"}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Working Schedule Section */}
            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(244, 63, 94, 0.1)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#0A1014' }}>Working Schedule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div 
                  className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border"
                  style={{ 
                    backgroundColor: '#F7F7F7',
                    borderColor: 'rgba(10, 16, 20, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                      style={{ backgroundColor: '#F43F5E' }}
                    >
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F43F5E' }}>Working Days</p>
                      <p className="font-semibold" style={{ color: '#0A1014' }}>{formatWorkingDays()}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="group p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border"
                  style={{ 
                    backgroundColor: '#F7F7F7',
                    borderColor: 'rgba(10, 16, 20, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)`
                      }}
                    >
                      <Clock size={20} style={{ color: '#0A1014' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#FBBF24' }}>Working Hours</p>
                      <p className="font-semibold" style={{ color: '#0A1014' }}>{formatWorkingHours()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(244, 63, 94, 0.1)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                
                <div className="space-y-2">
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: '#F43F5E' }}
                  >
                    {profile.rating}
                  </div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(profile.rating) ? "fill-current" : ""}
                        style={{ color: '#FCD34D' }}
                      />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: '#0A1014' }}>Average Rating</p>
                </div>

                <div className="space-y-2">
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: '#FCD34D' }}
                  >
                    {profile.clients}+
                  </div>
                  <p className="text-sm" style={{ color: '#0A1014' }}>Happy Clients</p>
                </div>

                <div className="space-y-2">
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: '#E11D48' }}
                  >
                    {profile.experience}+
                  </div>
                  <p className="text-sm" style={{ color: '#0A1014' }}>Years Experience</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div 
            className="rounded-3xl shadow-2xl w-full max-w-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
              style={{ 
                backgroundColor: '#F7F7F7'
              }}
            >
              <X size={20} style={{ color: '#0A1014' }} />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#0A1014' }}>
                  Update Profile
                </h2>
                <p style={{ color: 'rgba(10, 16, 20, 0.7)' }}>
                  Keep your beauty service information up to date
                </p>
              </div>
              
              <UpdateProfileForm 
                profile={profile} 
                onClose={() => setOpen(false)}
                onUpdate={handleProfileUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}