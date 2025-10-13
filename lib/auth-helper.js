// Simple authentication helper
export const getUserId = (request) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  // Server-side: read from headers
  if (request?.headers) {
    return request.headers.get('x-user-id');
  }
  return null;
};

export const getUserRole = (request) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  // Server-side: read from headers
  if (request?.headers) {
    return request.headers.get('x-user-role');
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  }
};

export const requireAuth = (handler) => {
  return async (req, res) => {
    const userId = getUserId();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    req.userId = userId;
    req.userRole = getUserRole();
    return handler(req, res);
  };
};