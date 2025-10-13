"use client";

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/auth-helper';

export default function LogoutButton({ className = "" }) {
  return (
    <button
      onClick={logout}
      className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
