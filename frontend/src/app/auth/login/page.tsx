"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading && typeof window !== 'undefined') {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't render login page if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-10">
        {/* Logo and Header */}
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* TON Platform Logo */}
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TON</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-600">Teknologi Otomotif Nasional</h1>
              <p className="text-sm text-gray-500">Vehicle Rental • Workshop Service • Spare Parts</p>
            </div>
          </div>
        </div>
      </div>

      <LoginForm />
    </div>
  );
}
