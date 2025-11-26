"use client";

import { useState, useEffect } from "react";
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

export default function VehicleRegistrationPage() {
  console.log("🚗 VEHICLE REGISTRATION PAGE LOADED");
  const router = useRouter();
  const { user } = useAuth();
  console.log("👤 Current User:", user);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Get company info from logged-in user
  const companyInfo = getUserCompanyInfo(user);
  console.log("🏢 Company Info from getUserCompanyInfo:", companyInfo);

  // Initialize form with company info directly
  const getInitialFormData = (): VehicleFormData => {
    const companyId = companyInfo?.companyId || "";
    console.log("🏢 Initial Company Info:", companyInfo);
    console.log("✅ Initial companyId:", companyId);

    return {
      // Company Assignment - automatically set from logged-in user
      companyId: companyId,

      // Basic Vehicle Information
      make: "",
      model: "",
      year: "",
      category: "sedan",
      plateNumber: "",
      vin: "",
      color: "",
      mileage: "",

      // Vehicle Specifications
      engine: "",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: "",
      doors: "",
      features: [],

      // Rental Information
      dailyRate: "",
      weeklyRate: "",
      monthlyRate: "",
      deposit: "",
      currency: "USD",
      available: true,
      availableFrom: "",
      location: "",
      minimumRentalDays: "1",

      // Maintenance Information
      lastMaintenance: "",
      nextMaintenance: "",

      // Performance
      rating: "0.0",
    };
  };

  const [formData, setFormData] = useState<VehicleFormData>(getInitialFormData);

  // Set today's date as default for last maintenance
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      lastMaintenance: today,
      nextMaintenance: nextMonth,
    }));
  }, []);

  const handleInputChange = (field: keyof VehicleFormData, value: string | boolean | string[]) => {
    console.log(`🔄 Field Change: ${field} =`, value);
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      console.log(`📝 Updated Form Data (${field}):`, updated);
      return updated;
    });

    // Clear error for this field when user starts typing
    if (errors[field]) {
      console.log(`✨ Clearing error for field: ${field}`);
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];

    setSelectedFeatures(newFeatures);
    handleInputChange("features", newFeatures);
  };

  const validateAndSubmit = async () => {
    console.log("=== VEHICLE REGISTRATION SUBMISSION START ===");
    console.log("1. Company Info Check:", companyInfo);
    console.log("2. Current Form Data:", formData);
    console.log("3. Selected Features:", selectedFeatures);

    // Validate company info first
    if (!companyInfo) {
      console.log("❌ VALIDATION FAILED: No company info found");
      setErrors({ companyId: "Company information not found. Please log in again." });
      return;
    }

    console.log("✅ Company Info Valid:", companyInfo);

    // Validate form data
    const validation = validateVehicle(formData);
    console.log("4. Form Validation Result:", validation);

    if (!validation.isValid) {
      console.log("❌ VALIDATION FAILED:", validation.errors);
      setErrors(validation.errors);

      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      console.log("5. Scrolling to error field:", firstErrorField);
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    }

    console.log("✅ Form Validation Passed");

    // Submit form
    try {
      setIsSaving(true);
      console.log("6. Submitting to API...");

      const response = await vehicleApi.createVehicle(
        formData,
        companyInfo.companyName || 'Unknown Company',
        companyInfo.companyLogo || 'UC'
      );

      console.log("7. API Response:", response);

      if (response.success) {
        console.log("✅ Vehicle registered successfully!");
        router.push("/dashboard/vehicle-rental/vehicles?success=Vehicle registered successfully");
      } else {
        console.log("❌ API returned error:", response.error);
        setErrors({ make: response.error || "Failed to register vehicle" });
      }
    } catch (error) {
      console.error("❌ CATCH: Error registering vehicle:", error);
      setErrors({ make: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSaving(false);
      console.log("=== VEHICLE REGISTRATION SUBMISSION END ===");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <VehicleRentalGuard requireRegistration={true}>
      <div className="container mx-auto p-6 max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
            <h1 className="text-3xl font-bold">Register New Vehicle</h1>
          </div>
          <p className="text-muted-foreground">
            Add a new vehicle to the rental fleet with detailed specifications and rental information
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            validateAndSubmit();
          }}
          className="space-y-8"
        >
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Vehicle will be registered under your company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-lg">
                  {companyInfo?.companyLogo || "CO"}
                </div>
                <div>
                  <div className="font-medium text-lg">{companyInfo?.companyName}</div>
                  <div className="text-sm text-muted-foreground">Vehicle Rental Company</div>
                </div>
                <Badge variant="default" className="ml-auto">
                  Active Company
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Basic Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Basic Vehicle Information
              </CardTitle>
              <CardDescription>Enter the fundamental details about the vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota, Honda, Ford"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    className={errors.make ? "border-red-500" : ""}
                  />
                  {errors.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Camry, CR-V, F-150"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className={errors.model ? "border-red-500" : ""}
                  />
                  {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="e.g., 2024"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className={errors.year ? "border-red-500" : ""}
                  />
                  {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: "sedan" | "suv" | "truck" | "van" | "luxury" | "light-truck") =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="light-truck">Light Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="plateNumber">License Plate *</Label>
                  <Input
                    id="plateNumber"
                    placeholder="e.g., ABC-123"
                    value={formData.plateNumber}
                    onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                    className={errors.plateNumber ? "border-red-500" : ""}
                  />
                  {errors.plateNumber && <p className="text-sm text-red-500 mt-1">{errors.plateNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="vin">VIN *</Label>
                  <Input
                    id="vin"
                    placeholder="17-character VIN"
                    maxLength={17}
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                    className={errors.vin ? "border-red-500" : ""}
                  />
                  {errors.vin && <p className="text-sm text-red-500 mt-1">{errors.vin}</p>}
                </div>

                <div>
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Silver, Black, White"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className={errors.color ? "border-red-500" : ""}
                  />
                  {errors.color && <p className="text-sm text-red-500 mt-1">{errors.color}</p>}
                </div>

                <div>
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    placeholder="e.g., 15000"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                    className={errors.mileage ? "border-red-500" : ""}
                  />
                  {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Vehicle Specifications
              </CardTitle>
              <CardDescription>Technical specifications and features of the vehicle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="engine">Engine *</Label>
                  <Input
                    id="engine"
                    placeholder="e.g., 2.5L Inline-4"
                    value={formData.engine}
                    onChange={(e) => handleInputChange("engine", e.target.value)}
                    className={errors.engine ? "border-red-500" : ""}
                  />
                  {errors.engine && <p className="text-sm text-red-500 mt-1">{errors.engine}</p>}
                </div>

                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value: "automatic" | "manual" | "cvt") =>
                      handleInputChange("transmission", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value: "gasoline" | "diesel" | "electric" | "hybrid") =>
                      handleInputChange("fuelType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="seats">Seats *</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="e.g., 5"
                    value={formData.seats}
                    onChange={(e) => handleInputChange("seats", e.target.value)}
                    className={errors.seats ? "border-red-500" : ""}
                  />
                  {errors.seats && <p className="text-sm text-red-500 mt-1">{errors.seats}</p>}
                </div>

                <div>
                  <Label htmlFor="doors">Doors *</Label>
                  <Input
                    id="doors"
                    type="number"
                    min="1"
                    max="6"
                    placeholder="e.g., 4"
                    value={formData.doors}
                    onChange={(e) => handleInputChange("doors", e.target.value)}
                    className={errors.doors ? "border-red-500" : ""}
                  />
                  {errors.doors && <p className="text-sm text-red-500 mt-1">{errors.doors}</p>}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Vehicle Features</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the features available in this vehicle
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {commonFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={`feature-${feature}`} className="text-sm font-normal cursor-pointer">
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
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Rental Information
              </CardTitle>
              <CardDescription>Set pricing and availability details for the vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dailyRate">Daily Rate ($) *</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 45.00"
                    value={formData.dailyRate}
                    onChange={(e) => handleInputChange("dailyRate", e.target.value)}
                    className={errors.dailyRate ? "border-red-500" : ""}
                  />
                  {errors.dailyRate && <p className="text-sm text-red-500 mt-1">{errors.dailyRate}</p>}
                </div>

                <div>
                  <Label htmlFor="weeklyRate">Weekly Rate ($) *</Label>
                  <Input
                    id="weeklyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 280.00"
                    value={formData.weeklyRate}
                    onChange={(e) => handleInputChange("weeklyRate", e.target.value)}
                    className={errors.weeklyRate ? "border-red-500" : ""}
                  />
                  {errors.weeklyRate && <p className="text-sm text-red-500 mt-1">{errors.weeklyRate}</p>}
                </div>

                <div>
                  <Label htmlFor="monthlyRate">Monthly Rate ($) *</Label>
                  <Input
                    id="monthlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1200.00"
                    value={formData.monthlyRate}
                    onChange={(e) => handleInputChange("monthlyRate", e.target.value)}
                    className={errors.monthlyRate ? "border-red-500" : ""}
                  />
                  {errors.monthlyRate && <p className="text-sm text-red-500 mt-1">{errors.monthlyRate}</p>}
                </div>

                <div>
                  <Label htmlFor="deposit">Deposit ($) *</Label>
                  <Input
                    id="deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 500.00"
                    value={formData.deposit}
                    onChange={(e) => handleInputChange("deposit", e.target.value)}
                    className={errors.deposit ? "border-red-500" : ""}
                  />
                  {errors.deposit && <p className="text-sm text-red-500 mt-1">{errors.deposit}</p>}
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minimumRentalDays">Minimum Rental Days *</Label>
                  <Input
                    id="minimumRentalDays"
                    type="number"
                    min="1"
                    placeholder="e.g., 1"
                    value={formData.minimumRentalDays}
                    onChange={(e) => handleInputChange("minimumRentalDays", e.target.value)}
                    className={errors.minimumRentalDays ? "border-red-500" : ""}
                  />
                  {errors.minimumRentalDays && (
                    <p className="text-sm text-red-500 mt-1">{errors.minimumRentalDays}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="location">Rental Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Downtown Office, Airport Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                </div>

                <div className="md:col-span-1">
                  <Label htmlFor="availableFrom">Available From (optional)</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => handleInputChange("available", checked as boolean)}
                    />
                    <Label htmlFor="available" className="text-base font-medium cursor-pointer">
                      Vehicle is immediately available for rent
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Maintenance Information
              </CardTitle>
              <CardDescription>Record maintenance schedule and vehicle performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastMaintenance">Last Maintenance Date *</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={formData.lastMaintenance}
                    onChange={(e) => handleInputChange("lastMaintenance", e.target.value)}
                    className={errors.lastMaintenance ? "border-red-500" : ""}
                  />
                  {errors.lastMaintenance && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastMaintenance}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nextMaintenance">Next Maintenance Date *</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={formData.nextMaintenance}
                    onChange={(e) => handleInputChange("nextMaintenance", e.target.value)}
                    className={errors.nextMaintenance ? "border-red-500" : ""}
                  />
                  {errors.nextMaintenance && (
                    <p className="text-sm text-red-500 mt-1">{errors.nextMaintenance}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="rating">Initial Rating (0-5)</Label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="e.g., 4.5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Leave as 0.0 for new vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>Please correct the errors above before submitting the form.</AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Register Vehicle
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </VehicleRentalGuard>
  );
}
