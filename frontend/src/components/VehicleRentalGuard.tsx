"use client";

import { useEffect } from "react";
import { useAuth, canRegisterVehicles } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock } from "lucide-react";

interface VehicleRentalGuardProps {
  children: React.ReactNode;
  requireRegistration?: boolean; // If true, requires vehicle rental registration permissions
}

export function VehicleRentalGuard({ children, requireRegistration = false }: VehicleRentalGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && requireRegistration && !canRegisterVehicles(user)) {
      router.push("/dashboard");
      return;
    }
  }, [user, isLoading, router, requireRegistration]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requireRegistration && !canRegisterVehicles(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <Lock className="h-4 w-4" />
            <AlertDescription>Access Denied: You dont have permission to register vehicles.</AlertDescription>
          </Alert>

          <div className="text-center p-6 bg-card rounded-lg border">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">Vehicle Rental Access Required</h2>
            <p className="text-muted-foreground mb-4">
              Only registered vehicle rental companies can add vehicles to the system.
            </p>
            <button onClick={() => router.push("/dashboard")} className="text-primary hover:underline">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
