// Development authentication helper
export const getUserId = () => {
  if (process.env.DEV_MODE === 'true') {
    return process.env.DEV_USER_ID;
  }
  // TODO: Replace with real auth logic
  return null;
};

export const getUserRole = () => {
  if (process.env.DEV_MODE === 'true') {
    const userId = process.env.DEV_USER_ID;
    if (userId?.startsWith('admin')) return 'ADMIN';
    if (userId?.startsWith('prov')) return 'PROVIDER';
    if (userId?.startsWith('client')) return 'CLIENT';
  }
  // TODO: Replace with real auth logic
  return null;
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