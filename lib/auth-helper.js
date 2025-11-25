import { prisma } from './prisma';

export const getUserId = (request) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  if (request?.headers) {
    return request.headers.get('x-user-id');
  }
  return null;
};

export const getUserRole = (request) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  if (request?.headers) {
    return request.headers.get('x-user-role');
  }
  return null;
};

export const checkUserStatus = async (userId) => {
  if (!userId) return { valid: false, reason: 'No user ID' };
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, role: true }
  });
  
  if (!user) return { valid: false, reason: 'User not found' };
  if (user.status === 'SUSPENDED') return { valid: false, reason: 'Account suspended' };
  if (user.status === 'INACTIVE') return { valid: false, reason: 'Account inactive' };
  
  return { valid: true, user };
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  }
};