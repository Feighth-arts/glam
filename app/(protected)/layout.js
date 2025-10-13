"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    // Check role-based access
    const role = userId.startsWith('admin') ? 'admin' : 
                 userId.startsWith('prov') ? 'provider' : 
                 userId.startsWith('client') ? 'client' : null;

    if (!role) {
      router.push('/login');
      return;
    }

    // Redirect if accessing wrong dashboard
    if (pathname.startsWith('/admin') && role !== 'admin') {
      router.push(`/${role}/dashboard`);
    } else if (pathname.startsWith('/provider') && role !== 'provider') {
      router.push(`/${role}/dashboard`);
    } else if (pathname.startsWith('/client') && role !== 'client') {
      router.push(`/${role}/dashboard`);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
