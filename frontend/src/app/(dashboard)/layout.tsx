// frontend/src/app/(dashboard)/layout.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

// Auth check logic remains the same
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setIsAuthenticated(true);
      }
    }
  }, []);
  return { isAuthenticated };
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Squares2X2Icon },
    { name: 'Appointments', href: '/appointments', icon: CalendarDaysIcon },
    { name: 'Doctors', href: '/doctors', icon: UserGroupIcon },
  ];

  if (!isClient || !isAuthenticated) {
    return null;
  }

  // This is the original, simpler layout JSX
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-16 text-white text-2xl font-bold border-b border-gray-700">
          Allo Health
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
          <div className="flex-grow" /> {/* Spacer */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}