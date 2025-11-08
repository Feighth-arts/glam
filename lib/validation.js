// Input validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

export const validateBookingData = (data) => {
  const errors = [];
  
  if (!data.serviceId) errors.push('Service ID is required');
  if (!data.providerId) errors.push('Provider ID is required');
  if (!data.bookingDatetime) errors.push('Booking date is required');
  if (!data.location || data.location.trim().length < 3) errors.push('Valid location is required');
  
  return { isValid: errors.length === 0, errors };
};

export const validateServiceData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 3) errors.push('Service name must be at least 3 characters');
  if (!data.price || data.price < 0) errors.push('Valid price is required');
  if (!data.duration || data.duration < 15) errors.push('Duration must be at least 15 minutes');
  
  return { isValid: errors.length === 0, errors };
};

export const validateUserData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!data.email || !validateEmail(data.email)) errors.push('Valid email is required');
  if (data.phone && !validatePhone(data.phone)) errors.push('Valid phone number is required');
  
  return { isValid: errors.length === 0, errors };
};
