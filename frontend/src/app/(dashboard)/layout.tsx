
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between bg-gray-800 text-white h-14 px-4 z-50">
        <span className="font-bold">Allo Health</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 transform md:translate-x-0 transition-transform duration-200 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden md:flex items-center justify-center h-16 text-white text-2xl font-bold border-b border-gray-700">
          Allo Health
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-2 mt-14 md:mt-0">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setSidebarOpen(false)} // close on mobile nav click
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
          <div className="flex-grow" />
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto w-full mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
