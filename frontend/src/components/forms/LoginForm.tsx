"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { LoginFormData } from "@/types/auth";

// Form validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().optional(),
});

type LoginFormDataValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectTo }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormDataValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormDataValues) => {
    console.log('🎯 [LoginForm] Form submission started:', {
      email: data.email,
      passwordLength: data.password.length,
      rememberMe: data.rememberMe,
      timestamp: new Date().toISOString()
    });

    try {
      clearError();

      console.log('🚪 [LoginForm] Attempting login...');
      await login({
        email: data.email,
        password: data.password,
      });

      console.log('🎉 [LoginForm] Login successful! AuthContext state updated.');

      if (onSuccess) {
        onSuccess();
      }

      // Add a small delay to ensure AuthContext state is updated before redirect
      setTimeout(() => {
        // Check if we're on client side before redirecting
        if (typeof window !== 'undefined') {
          // Redirect if specified
          if (redirectTo) {
            console.log('🔄 [LoginForm] Redirecting to:', redirectTo);
            window.location.href = redirectTo;
          } else {
            // Default redirect based on user role would be handled by auth context
            console.log('🔄 [LoginForm] Redirecting to default: /dashboard');
            window.location.href = "/dashboard";
          }
        }
      }, 100); // 100ms delay
    } catch (error: any) {
      console.log('💥 [LoginForm] Login failed:', {
        errorMessage: error.message,
        errorCode: error.code,
        errorField: error.field,
        fullError: error
      });

      // Set form error from auth context
      if (error.field) {
        setError(error.field, { message: error.message });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-600 text-center">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">Sign in to your account</p>
        </div>

        {/* Error Alert */}
        {error && !error.field && (
          <div className="mb-6">
            <Alert variant="error" dismissible onDismiss={clearError}>
              {error.message}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            disabled={isLoading || isSubmitting}
            {...register("email")}
            autoComplete="email"
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-secondary-400 hover:text-secondary-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              disabled={isLoading || isSubmitting}
              {...register("password")}
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register("rememberMe")}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to TON Platform?</span>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/auth/register"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">© 2025 TON Platform. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginForm;
