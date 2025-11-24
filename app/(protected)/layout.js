"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CacheProvider } from '@/lib/cache-context';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    if (!userId || !userRole) {
      router.push('/login');
      return;
    }

    const role = userRole.toLowerCase();

    // Redirect if accessing wrong dashboard
    if (pathname.startsWith('/admin') && role !== 'admin') {
      router.push(`/${role}/dashboard`);
    } else if (pathname.startsWith('/provider') && role !== 'provider') {
      router.push(`/${role}/dashboard`);
    } else if (pathname.startsWith('/client') && role !== 'client') {
      router.push(`/${role}/dashboard`);
    }
  }, [pathname, router]);

  return <CacheProvider>{children}</CacheProvider>;
}
