"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, ArrowLeft, Save, Upload, FileText, Camera, AlertCircle, Check, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VehicleFormData {
  // Basic Information
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  color: string;
  vehicleType: "sedan" | "suv" | "truck" | "van" | "motorcycle" | "bus";

  // Specifications
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "cng" | "lpg";
  transmission: "manual" | "automatic" | "cvt";
  drivetrain: "fwd" | "rwd" | "awd" | "4wd";
  engine: string;
  bodyStyle: string;

  // Purchase Information
  purchaseDate: string;
  purchasePrice: string;
  purchaseFrom: string;
  invoiceNumber: string;

  // Registration & Insurance
  registrationDate: string;
  registrationExpiry: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiry: string;

  // Current Status
  status: "active" | "maintenance" | "out_of_service" | "retired";
  currentMileage: string;
  assignedDriver: string;
  location: string;

  // Maintenance Information
  lastServiceDate: string;
  lastServiceMileage: string;
  nextServiceDate: string;
  nextServiceMileage: string;

  // Additional Information
  notes: string;
  features: string[];
  documents: File[];
}

const vehicleMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Tesla",
  "Jeep",
  "Ram",
  "GMC",
  "Buick",
  "Cadillac",
  "Lincoln",
  "Acura",
  "Infiniti",
  "Lexus",
  "Volvo",
  "Porsche",
  "Land Rover",
  "Jaguar",
  "Mini",
  "Mitsubishi",
  "Fiat",
];

const vehicleFeatures = [
  "Air Conditioning",
  "Power Steering",
  "Power Windows",
  "Power Locks",
  "Cruise Control",
  "Remote Start",
  "GPS Navigation",
  "Backup Camera",
  "Parking Sensors",
  "Blind Spot Monitoring",
  "Lane Assist",
  "Adaptive Cruise",
  "Bluetooth",
  "USB Ports",
  "Aux Input",
  "Premium Audio",
  "Sunroof",
  "Leather Seats",
  "Heated Seats",
  "Cooled Seats",
  "Third Row Seating",
  "Tow Package",
  "Roof Rack",
  "Running Boards",
  "Alloy Wheels",
];

export default function VehicleRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>({
    vin: "",
    licensePlate: "",
    make: "",
    model: "",
    year: "",
    trim: "",
    color: "",
    vehicleType: "sedan",
    fuelType: "gasoline",
    transmission: "automatic",
    drivetrain: "fwd",
    engine: "",
    bodyStyle: "",
    purchaseDate: "",
    purchasePrice: "",
    purchaseFrom: "",
    invoiceNumber: "",
    registrationDate: "",
    registrationExpiry: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiry: "",
    status: "active",
    currentMileage: "",
    assignedDriver: "",
    location: "",
    lastServiceDate: "",
    lastServiceMileage: "",
    nextServiceDate: "",
    nextServiceMileage: "",
    notes: "",
    features: [],
    documents: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vinData, setVinData] = useState<any>(null);
  const [isSearchingVin, setIsSearchingVin] = useState(false);

  const steps = [
    { id: 1, title: "Basic Information", description: "Vehicle identification and details" },
    { id: 2, title: "Specifications", description: "Technical specifications" },
    { id: 3, title: "Purchase & Registration", description: "Purchase, registration and insurance" },
    { id: 4, title: "Status & Maintenance", description: "Current status and maintenance history" },
    { id: 5, title: "Review & Complete", description: "Review all information and submit" },
  ];

  useEffect(() => {
    if (formData.vin.length === 17) {
      searchVin();
    }
  }, [formData.vin]);

  const searchVin = async () => {
    setIsSearchingVin(true);
    try {
      // Mock VIN lookup - in real app, this would call VIN decoder API
      setTimeout(() => {
        setVinData({
          make: "Toyota",
          model: "Camry",
          year: "2023",
          trim: "SE",
          fuelType: "gasoline",
          transmission: "automatic",
          drivetrain: "fwd",
          engine: "2.5L I4",
        });
        setIsSearchingVin(false);
      }, 1000);
    } catch (error) {
      setIsSearchingVin(false);
    }
  };

  const handleVinDataApply = () => {
    if (vinData) {
      setFormData((prev) => ({
        ...prev,
        make: vinData.make || prev.make,
        model: vinData.model || prev.model,
        year: vinData.year || prev.year,
        trim: vinData.trim || prev.trim,
        fuelType: vinData.fuelType || prev.fuelType,
        transmission: vinData.transmission || prev.transmission,
        drivetrain: vinData.drivetrain || prev.drivetrain,
        engine: vinData.engine || prev.engine,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.vin.trim()) newErrors.vin = "VIN is required";
        else if (formData.vin.length !== 17) newErrors.vin = "VIN must be 17 characters";
        if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
        if (!formData.make.trim()) newErrors.make = "Make is required";
        if (!formData.model.trim()) newErrors.model = "Model is required";
        if (!formData.year.trim()) newErrors.year = "Year is required";
        break;
      case 2:
        if (!formData.engine.trim()) newErrors.engine = "Engine specification is required";
        break;
      case 3:
        if (!formData.purchaseDate) newErrors.purchaseDate = "Purchase date is required";
        if (!formData.purchasePrice.trim()) newErrors.purchasePrice = "Purchase price is required";
        if (!formData.registrationDate) newErrors.registrationDate = "Registration date is required";
        if (!formData.registrationExpiry) newErrors.registrationExpiry = "Registration expiry is required";
        break;
      case 4:
        if (!formData.currentMileage.trim()) newErrors.currentMileage = "Current mileage is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setSaving(true);
    try {
      // Mock API call to save vehicle
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Vehicle registration data:", formData);

      // Redirect to vehicle list
      router.push("/dashboard/fleet/vehicles");
    } catch (error) {
      console.error("Failed to register vehicle:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-fit mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicles
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Register New Vehicle</h1>
          <p className="text-muted-foreground">Add a new vehicle to the fleet</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > step.id ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
            </div>
            <div className="ml-3 hidden sm:block">
              <div
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-px mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vin">VIN Number</Label>
                  <Input
                    id="vin"
                    placeholder="1HGBH41JXMN109186"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    className={errors.vin ? "border-red-500" : ""}
                  />
                  {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
                  {isSearchingVin && (
                    <div className="flex items-center gap-2 mt-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Searching VIN database...</span>
                    </div>
                  )}
                  {vinData && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Vehicle data found</p>
                          <p className="text-xs text-green-600">
                            {vinData.year} {vinData.make} {vinData.model}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleVinDataApply}>
                          Apply Data
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    placeholder="ABC-1234"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                    className={errors.licensePlate ? "border-red-500" : ""}
                  />
                  {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
                    <SelectTrigger className={errors.make ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleMakes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="Camry"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className={errors.model ? "border-red-500" : ""}
                  />
                  {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className={errors.year ? "border-red-500" : ""}
                  />
                  {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="trim">Trim</Label>
                  <Input
                    id="trim"
                    placeholder="SE"
                    value={formData.trim}
                    onChange={(e) => handleInputChange("trim", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="Black"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value: any) => handleInputChange("vehicleType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value: any) => handleInputChange("fuelType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                      <SelectItem value="lpg">LPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value: any) => handleInputChange("transmission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="drivetrain">Drivetrain</Label>
                  <Select
                    value={formData.drivetrain}
                    onValueChange={(value: any) => handleInputChange("drivetrain", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fwd">Front Wheel Drive (FWD)</SelectItem>
                      <SelectItem value="rwd">Rear Wheel Drive (RWD)</SelectItem>
                      <SelectItem value="awd">All Wheel Drive (AWD)</SelectItem>
                      <SelectItem value="4wd">Four Wheel Drive (4WD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="engine">Engine</Label>
                  <Input
                    id="engine"
                    placeholder="2.5L I4"
                    value={formData.engine}
                    onChange={(e) => handleInputChange("engine", e.target.value)}
                    className={errors.engine ? "border-red-500" : ""}
                  />
                  {errors.engine && <p className="text-red-500 text-sm mt-1">{errors.engine}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="bodyStyle">Body Style</Label>
                <Input
                  id="bodyStyle"
                  placeholder="4-Door Sedan"
                  value={formData.bodyStyle}
                  onChange={(e) => handleInputChange("bodyStyle", e.target.value)}
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {vehicleFeatures.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="mr-2"
                      />
                      <label htmlFor={feature} className="text-sm">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Purchase & Registration */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">Purchase Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                      className={errors.purchaseDate ? "border-red-500" : ""}
                    />
                    {errors.purchaseDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.purchaseDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      placeholder="25000"
                      value={formData.purchasePrice}
                      onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                      className={errors.purchasePrice ? "border-red-500" : ""}
                    />
                    {errors.purchasePrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.purchasePrice}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="purchaseFrom">Purchased From</Label>
                    <Input
                      id="purchaseFrom"
                      placeholder="Toyota Dealership"
                      value={formData.purchaseFrom}
                      onChange={(e) => handleInputChange("purchaseFrom", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="INV-2023-001"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">Registration Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="registrationDate">Registration Date</Label>
                    <Input
                      id="registrationDate"
                      type="date"
                      value={formData.registrationDate}
                      onChange={(e) => handleInputChange("registrationDate", e.target.value)}
                      className={errors.registrationDate ? "border-red-500" : ""}
                    />
                    {errors.registrationDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.registrationDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="registrationExpiry">Registration Expiry</Label>
                    <Input
                      id="registrationExpiry"
                      type="date"
                      value={formData.registrationExpiry}
                      onChange={(e) => handleInputChange("registrationExpiry", e.target.value)}
                      className={errors.registrationExpiry ? "border-red-500" : ""}
                    />
                    {errors.registrationExpiry && (
                      <p className="text-red-500 text-sm mt-1">{errors.registrationExpiry}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      placeholder="State Farm"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      placeholder="POL-123456789"
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => handleInputChange("insurancePolicyNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                    <Input
                      id="insuranceExpiry"
                      type="date"
                      value={formData.insuranceExpiry}
                      onChange={(e) => handleInputChange("insuranceExpiry", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Documents</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload vehicle documents
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleDocumentUpload}
                        />
                        <p className="mt-1 text-xs text-gray-500">Registration, insurance, title, etc.</p>
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => removeDocument(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Status & Maintenance */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Current Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="out_of_service">Out of Service</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentMileage">Current Mileage</Label>
                  <Input
                    id="currentMileage"
                    type="number"
                    placeholder="0"
                    value={formData.currentMileage}
                    onChange={(e) => handleInputChange("currentMileage", e.target.value)}
                    className={errors.currentMileage ? "border-red-500" : ""}
                  />
                  {errors.currentMileage && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentMileage}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="assignedDriver">Assigned Driver</Label>
                  <Input
                    id="assignedDriver"
                    placeholder="John Smith"
                    value={formData.assignedDriver}
                    onChange={(e) => handleInputChange("assignedDriver", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Main Office"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">Maintenance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastServiceDate">Last Service Date</Label>
                    <Input
                      id="lastServiceDate"
                      type="date"
                      value={formData.lastServiceDate}
                      onChange={(e) => handleInputChange("lastServiceDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastServiceMileage">Last Service Mileage</Label>
                    <Input
                      id="lastServiceMileage"
                      type="number"
                      placeholder="0"
                      value={formData.lastServiceMileage}
                      onChange={(e) => handleInputChange("lastServiceMileage", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextServiceDate">Next Service Date</Label>
                    <Input
                      id="nextServiceDate"
                      type="date"
                      value={formData.nextServiceDate}
                      onChange={(e) => handleInputChange("nextServiceDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextServiceMileage">Next Service Mileage</Label>
                    <Input
                      id="nextServiceMileage"
                      type="number"
                      placeholder="0"
                      value={formData.nextServiceMileage}
                      onChange={(e) => handleInputChange("nextServiceMileage", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional information about the vehicle..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Complete */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Please review all information before submitting the vehicle registration.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">VIN:</span>
                      <span>{formData.vin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Plate:</span>
                      <span>{formData.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span>
                        {formData.year} {formData.make} {formData.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>{formData.vehicleType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Purchase Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date:</span>
                      <span>{formData.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span>${formData.purchasePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchased From:</span>
                      <span>{formData.purchaseFrom}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Current Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge>{formData.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Mileage:</span>
                      <span>{formData.currentMileage} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned Driver:</span>
                      <span>{formData.assignedDriver || "Unassigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span>{formData.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Specifications</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span>{formData.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transmission:</span>
                      <span>{formData.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drivetrain:</span>
                      <span>{formData.drivetrain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engine:</span>
                      <span>{formData.engine}</span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.features.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.documents.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Documents</h3>
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < steps.length ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering Vehicle...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Register Vehicle
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
