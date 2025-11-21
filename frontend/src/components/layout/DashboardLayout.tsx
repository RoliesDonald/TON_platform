'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import ClientOnlyAuth from '@/components/auth/ClientOnlyAuth';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  description,
  actions,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ClientOnlyAuth>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-64">
          <Header
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />

          <main className="pt-16">
            {/* Page header */}
            {(title || description || actions) && (
              <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {/* Breadcrumbs */}
                      <div className="mb-2">
                        <Breadcrumbs />
                      </div>

                      {/* Page title and description */}
                      {title && (
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                      )}
                      {description && (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                      )}
                    </div>

                    {/* Page actions */}
                    {actions && (
                      <div className="ml-4 flex-shrink-0">
                        {actions}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Page content */}
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ClientOnlyAuth>
  );
};

export default DashboardLayout;