"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save, Car, Wrench, DollarSign, Settings, Star, Building } from "lucide-react";
import { VehicleFormData, validateVehicle, vehicleApi, vehicleRentalApi } from "@/lib/api";
import { useAuth, getUserCompanyInfo, isVehicleRentalCompany } from "@/contexts/AuthContext";
import { VehicleRentalGuard } from "@/components/VehicleRentalGuard";

const commonFeatures = [
  "Bluetooth",
  "Backup Camera",
  "Cruise Control",
  "Lane Assist",
  "GPS Navigation",
  "USB Charging",
  "Apple CarPlay",
  "Android Auto",
  "Sunroof",
  "Leather Seats",
  "Heated Seats",
  "Climate Control",
  "Premium Audio",
  "Wi-Fi Hotspot",
  "Remote Start",
  "Keyless Entry",
  "Parking Sensors",
  "360° Camera",
  "Adaptive Cruise",
  "Blind Spot Detection",
];

interface EditVehiclePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditVehiclePage({ params }: EditVehiclePageProps) {
  // Unwrap the params Promise for Next.js 15+
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;

  console.log("🚗 EDIT VEHICLE PAGE LOADED", vehicleId);
  const router = useRouter();
  const { user } = useAuth();
  console.log("👤 Current User:", user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>> & { _form?: string }>({});
  const [vehicleNotFound, setVehicleNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState<VehicleFormData>({
    // Basic Information
    companyId: "",

    // Vehicle Information - flat structure as expected by VehicleFormData
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    category: "sedan",
    plateNumber: "",
    vin: "",
    color: "",
    mileage: "0",

    // Vehicle Specifications - flat structure
    engine: "",
    transmission: "manual",
    fuelType: "gasoline",
    seats: "5",
    doors: "4",
    features: [],

    // Rental Information - flat structure
    dailyRate: "0",
    weeklyRate: "0",
    monthlyRate: "0",
    deposit: "0",
    currency: "USD",
    available: true,
    availableFrom: "",
    location: "",
    minimumRentalDays: "1",

    // Maintenance Information
    lastMaintenance: "",
    nextMaintenance: "",

    // Performance
    rating: "0",
  });

  // Load vehicle data on component mount
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setIsLoading(true);
        console.log("🔄 Loading vehicle data for ID:", vehicleId);

        const response = await vehicleApi.getVehicle(vehicleId);

        if (response.success && response.data) {
          const vehicle = response.data;
          console.log("✅ Vehicle data loaded:", vehicle);

          // Pre-fill form with existing vehicle data (transform from nested API to flat form structure)
          setFormData({
            companyId: vehicle.companyId,

            // Vehicle Information - flat structure
            make: vehicle.vehicleInfo.make,
            model: vehicle.vehicleInfo.model,
            year: vehicle.vehicleInfo.year.toString(),
            category: vehicle.vehicleInfo.category,
            plateNumber: vehicle.vehicleInfo.plateNumber,
            vin: vehicle.vehicleInfo.vin,
            color: vehicle.vehicleInfo.color,
            mileage: vehicle.vehicleInfo.mileage.toString(),

            // Specifications - flat structure
            engine: vehicle.specifications?.engine || "",
            transmission: vehicle.specifications?.transmission || "manual",
            fuelType: vehicle.specifications?.fuelType || "gasoline",
            seats: vehicle.specifications?.seats?.toString() || "5",
            doors: vehicle.specifications?.doors?.toString() || "4",
            features: vehicle.specifications?.features || [],

            // Rental Information - flat structure
            dailyRate: vehicle.rental?.dailyRate?.toString() || "0",
            weeklyRate: vehicle.rental?.weeklyRate?.toString() || "0",
            monthlyRate: vehicle.rental?.monthlyRate?.toString() || "0",
            deposit: vehicle.rental?.deposit?.toString() || "0",
            currency: vehicle.rental?.currency || "USD",
            available: vehicle.rental?.available ?? true,
            availableFrom: vehicle.rental?.availableFrom || "",
            location: vehicle.rental?.location || "",
            minimumRentalDays: vehicle.rental?.minimumRentalDays?.toString() || "1",

            // Maintenance Information
            lastMaintenance: vehicle.lastMaintenance || "",
            nextMaintenance: vehicle.nextMaintenance || "",

            // Performance
            rating: vehicle.rating?.toString() || "0",
          });
        } else {
          console.error("❌ Vehicle not found:", response.error);
          setVehicleNotFound(true);
        }
      } catch (error) {
        console.error("❌ Error loading vehicle:", error);
        setVehicleNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
  }, [vehicleId]);

  const handleInputChange = (field: keyof VehicleFormData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof VehicleFormData]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...(prev.features || []), feature]
        : (prev.features || []).filter((f) => f !== feature),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateVehicle(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      console.log("🔄 Updating vehicle:", vehicleId, formData);

      // Get company info for API call
      const companyInfo = getUserCompanyInfo(user);
      if (!companyInfo) {
        setErrors({ _form: "Company information not found" });
        return;
      }
      const response = await vehicleApi.updateVehicle(
        vehicleId,
        formData,
        companyInfo.companyName || "",
        companyInfo.companyLogo || ""
      );

      if (response.success) {
        setSuccessMessage("Vehicle updated successfully!");

        // Redirect back to vehicle list after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/vehicle-rental/vehicles");
        }, 2000);
      } else {
        setErrors({ _form: response.error || "Failed to update vehicle" });
      }
    } catch (error) {
      console.error("❌ Error updating vehicle:", error);
      setErrors({ _form: "An error occurred while updating the vehicle" });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching vehicle data
  if (isLoading) {
    return (
      <VehicleRentalGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading vehicle data...</span>
        </div>
      </VehicleRentalGuard>
    );
  }

  // Show error if vehicle not found
  if (vehicleNotFound) {
    return (
      <VehicleRentalGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-4">
              The vehicle you&apos;re trying to edit doesn&apos;t exist or you don&apos;t have permission to edit it.
            </p>
            <Button onClick={() => router.push("/dashboard/vehicle-rental/vehicles")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </div>
        </div>
      </VehicleRentalGuard>
    );
  }

  return (
    <VehicleRentalGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/vehicle-rental/vehicles")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vehicles
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
            </div>
            <p className="text-gray-600">Update vehicle information and rental details</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Form Error */}
          {errors._form && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{errors._form}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Vehicle identification and classification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="make">Company</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => handleInputChange("companyId", value)}
                  >
                    <SelectTrigger className={errors.companyId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={formData.companyId}>
                        {formData.companyId === "admin-access"
                          ? "System Administration"
                          : formData.companyId === user?.companyId
                          ? user?.companyName || "Your Company"
                          : formData.companyId || "Unknown Company"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>Make, model, year and basic vehicle details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => handleInputChange("make", e.target.value)}
                      placeholder="e.g., Toyota"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && (
                      <p className="text-red-500 text-sm mt-1">{errors.make}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      placeholder="e.g., Camry"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && (
                      <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        handleInputChange("year", parseInt(e.target.value))
                      }
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="coupe">Coupe</SelectItem>
                        <SelectItem value="convertible">Convertible</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="e.g., White"
                      className={errors.color ? "border-red-500" : ""}
                    />
                    {errors.color && (
                      <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) =>
                        handleInputChange("mileage", parseInt(e.target.value))
                      }
                      min="0"
                      placeholder="e.g., 15000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && (
                      <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="plateNumber">License Plate</Label>
                    <Input
                      id="plateNumber"
                      value={formData.plateNumber}
                      onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                      placeholder="e.g., ABC-123"
                      className={errors.plateNumber ? "border-red-500" : ""}
                    />
                    {errors.plateNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.plateNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="vin">VIN Number</Label>
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => handleInputChange("vin", e.target.value)}
                      placeholder="e.g., 1HGBH41JXMN109186"
                      className={errors.vin ? "border-red-500" : ""}
                    />
                    {errors.vin && (
                      <p className="text-red-500 text-sm mt-1">{errors.vin}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Specifications
                </CardTitle>
                <CardDescription>Technical specifications and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="engine">Engine</Label>
                    <Input
                      id="engine"
                      value={formData.engine || ""}
                      onChange={(e) => handleInputChange("engine", e.target.value)}
                      placeholder="e.g., 2.5L 4-Cylinder"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      value={formData.transmission || "manual"}
                      onValueChange={(value) =>
                        handleInputChange("transmission", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                        <SelectItem value="dual-clutch">Dual Clutch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      value={formData.fuelType || "gasoline"}
                      onValueChange={(value) => handleInputChange("fuelType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">Gasoline</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="plugin-hybrid">Plugin Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="seats">Number of Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      value={formData.seats || 5}
                      onChange={(e) =>
                        handleInputChange("seats", parseInt(e.target.value))
                      }
                      min="1"
                      max="20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doors">Number of Doors</Label>
                    <Input
                      id="doors"
                      type="number"
                      value={formData.doors || 4}
                      onChange={(e) =>
                        handleInputChange("doors", parseInt(e.target.value))
                      }
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-base font-medium">Features</Label>
                  <p className="text-sm text-gray-500 mb-4">Select available features</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {commonFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={formData.features?.includes(feature) || false}
                          onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Rental Information
                </CardTitle>
                <CardDescription>Pricing and availability settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      value={formData.dailyRate || 0}
                      onChange={(e) =>
                        handleInputChange("dailyRate", parseFloat(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      placeholder="e.g., 50"
                      className={errors.dailyRate ? "border-red-500" : ""}
                    />
                    {errors.dailyRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.dailyRate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="weeklyRate">Weekly Rate ($)</Label>
                    <Input
                      id="weeklyRate"
                      type="number"
                      value={formData.weeklyRate || 0}
                      onChange={(e) =>
                        handleInputChange("weeklyRate", parseFloat(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      placeholder="e.g., 300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyRate">Monthly Rate ($)</Label>
                    <Input
                      id="monthlyRate"
                      type="number"
                      value={formData.monthlyRate || 0}
                      onChange={(e) =>
                        handleInputChange("monthlyRate", parseFloat(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      placeholder="e.g., 1000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="deposit">Security Deposit ($)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      value={formData.deposit || 0}
                      onChange={(e) =>
                        handleInputChange("deposit", parseFloat(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      placeholder="e.g., 500"
                      className={errors.deposit ? "border-red-500" : ""}
                    />
                    {errors.deposit && (
                      <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="minimumRentalDays">Minimum Rental Days</Label>
                    <Input
                      id="minimumRentalDays"
                      type="number"
                      value={formData.minimumRentalDays || 1}
                      onChange={(e) =>
                        handleInputChange("minimumRentalDays", parseInt(e.target.value))
                      }
                      min="1"
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Pickup Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Downtown Office, Airport"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={formData.available ?? true}
                    onCheckedChange={(checked) => handleInputChange("available", checked)}
                  />
                  <Label htmlFor="available">Available for rental</Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/vehicle-rental/vehicles")}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Vehicle
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </VehicleRentalGuard>
  );
}
