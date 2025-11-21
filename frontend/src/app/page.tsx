'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      if (isAuthenticated) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/auth/login';
      }
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TON Platform...</p>
        </div>
      </div>
    );
  }

  return null;
}