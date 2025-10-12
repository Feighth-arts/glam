// API client utility functions
const API_BASE = '';

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
};

// Specific API functions
export const servicesApi = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiClient.get(`/api/services?${searchParams}`);
  },
  create: (data) => apiClient.post('/api/services', data)
};

export const userApi = {
  getProfile: () => apiClient.get('/api/users/profile'),
  updateProfile: (data) => apiClient.put('/api/users/profile', data)
};

export const bookingsApi = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiClient.get(`/api/bookings?${searchParams}`);
  },
  create: (data) => apiClient.post('/api/bookings', data)
};

export const dashboardApi = {
  getData: () => apiClient.get('/api/dashboard')
};