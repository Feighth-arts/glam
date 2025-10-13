// Simple authentication helper
export const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  // Server-side: check env for dev mode
  if (process.env.DEV_MODE === 'true') {
    return process.env.DEV_USER_ID;
  }
  return null;
};

export const getUserRole = () => {
  const userId = getUserId();
  if (userId?.startsWith('admin')) return 'ADMIN';
  if (userId?.startsWith('prov')) return 'PROVIDER';
  if (userId?.startsWith('client')) return 'CLIENT';
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
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