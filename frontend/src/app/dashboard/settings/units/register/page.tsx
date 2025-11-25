"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Ruler,
  Plus,
  Save,
  ArrowLeft,
  Scale,
  Maximize2,
  Droplets,
  Package,
  Calculator,
  Thermometer,
  Grid,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UnitFormData {
  name: string;
  symbol: string;
  category: string;
  type: "weight" | "length" | "volume" | "quantity" | "area" | "temperature";
  status: "active" | "inactive";
  description: string;
  isBaseUnit: boolean;
  conversionFactor: string;
  baseUnit: string;
  notes: string;
}

const unitTypes = [
  { value: "weight", label: "Weight", icon: Scale, description: "Mass measurement units" },
  { value: "length", label: "Length", icon: Maximize2, description: "Distance measurement units" },
  { value: "volume", label: "Volume", icon: Droplets, description: "Volume measurement units" },
  { value: "quantity", label: "Quantity", icon: Package, description: "Count measurement units" },
  { value: "area", label: "Area", icon: Grid, description: "Area measurement units" },
  { value: "temperature", label: "Temperature", icon: Thermometer, description: "Temperature units" }
];

const mockBaseUnits = {
  weight: ["Kilogram", "Gram", "Pound", "Ounce"],
  length: ["Meter", "Centimeter", "Inch", "Foot"],
  volume: ["Liter", "Milliliter", "Gallon", "Cubic Meter"],
  quantity: ["Pieces", "Dozen", "Box", "Set"],
  area: ["Square Meter", "Square Foot", "Acre", "Hectare"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"]
};

export default function UnitRegistrationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<UnitFormData>({
    name: "",
    symbol: "",
    category: "",
    type: "weight",
    status: "active",
    description: "",
    isBaseUnit: false,
    conversionFactor: "",
    baseUnit: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Partial<UnitFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof UnitFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UnitFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Unit name is required";
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Unit symbol is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.isBaseUnit) {
      if (!formData.conversionFactor) {
        newErrors.conversionFactor = "Conversion factor is required for derived units";
      } else if (isNaN(Number(formData.conversionFactor)) || Number(formData.conversionFactor) <= 0) {
        newErrors.conversionFactor = "Conversion factor must be a positive number";
      }

      if (!formData.baseUnit) {
        newErrors.baseUnit = "Base unit is required for derived units";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would be an API call to save the unit
      console.log("Submitting unit data:", formData);

      // Show success message and redirect
      router.push("/dashboard/settings/units?success=Unit created successfully");
    } catch (error) {
      console.error("Error creating unit:", error);
      setErrors({ name: "Failed to create unit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      symbol: "",
      category: "",
      type: "weight",
      status: "active",
      description: "",
      isBaseUnit: false,
      conversionFactor: "",
      baseUnit: "",
      notes: ""
    });
    setErrors({});
  };

  const getSelectedTypeInfo = () => {
    return unitTypes.find(type => type.value === formData.type);
  };

  const formatConversionDisplay = () => {
    if (formData.isBaseUnit) {
      return "Base Unit";
    }
    if (formData.conversionFactor && formData.baseUnit) {
      return `1 ${formData.name} = ${formData.conversionFactor} ${formData.baseUnit}`;
    }
    return "Not configured";
  };

  const selectedTypeInfo = getSelectedTypeInfo();
  const IconComponent = selectedTypeInfo?.icon || Scale;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/settings/units">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Units
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Plus className="w-8 h-8 text-blue-600" />
                Register New Unit
              </h1>
              <p className="text-gray-600 mt-2">
                Create a new measurement unit for your system
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="conversion">Conversion</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 mt-6">
                  {/* Unit Type Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5" />
                        Unit Type
                      </CardTitle>
                      <CardDescription>
                        Select the type of measurement unit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unitTypes.map((type) => {
                          const TypeIcon = type.icon;
                          return (
                            <div
                              key={type.value}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                formData.type === type.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handleInputChange("type", type.value as any)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  formData.type === type.value ? "bg-blue-100" : "bg-gray-100"
                                }`}>
                                  <TypeIcon className={`h-5 w-5 ${
                                    formData.type === type.value ? "text-blue-600" : "text-gray-600"
                                  }`} />
                                </div>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-sm text-gray-500">{type.description}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Enter the basic details for the measurement unit
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Unit Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="e.g., Kilogram, Meter, Pieces"
                            className={errors.name ? "border-red-500" : ""}
                          />
                          {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="symbol">Unit Symbol *</Label>
                          <Input
                            id="symbol"
                            value={formData.symbol}
                            onChange={(e) => handleInputChange("symbol", e.target.value)}
                            placeholder="e.g., kg, m, pcs"
                            className={errors.symbol ? "border-red-500" : ""}
                          />
                          {errors.symbol && (
                            <p className="text-sm text-red-500 mt-1">{errors.symbol}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          placeholder="e.g., Weight, Length, Volume"
                          className={errors.category ? "border-red-500" : ""}
                        />
                        {errors.category && (
                          <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Provide a detailed description of this unit..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conversion" className="space-y-6 mt-6">
                  {/* Conversion Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Settings</CardTitle>
                      <CardDescription>
                        Configure conversion factors and base unit relationships
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isBaseUnit"
                          checked={formData.isBaseUnit}
                          onCheckedChange={(checked) => handleInputChange("isBaseUnit", checked as boolean)}
                        />
                        <Label htmlFor="isBaseUnit" className="text-sm font-medium">
                          This is a base unit
                        </Label>
                      </div>

                      {!formData.isBaseUnit && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="baseUnit">Base Unit *</Label>
                              <Select
                                value={formData.baseUnit}
                                onValueChange={(value) => handleInputChange("baseUnit", value)}
                              >
                                <SelectTrigger className={errors.baseUnit ? "border-red-500" : ""}>
                                  <SelectValue placeholder="Select base unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockBaseUnits[formData.type as keyof typeof mockBaseUnits]?.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.baseUnit && (
                                <p className="text-sm text-red-500 mt-1">{errors.baseUnit}</p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="conversionFactor">Conversion Factor *</Label>
                              <Input
                                id="conversionFactor"
                                value={formData.conversionFactor}
                                onChange={(e) => handleInputChange("conversionFactor", e.target.value)}
                                placeholder="e.g., 0.001, 1000, 2.54"
                                type="number"
                                step="any"
                                className={errors.conversionFactor ? "border-red-500" : ""}
                              />
                              {errors.conversionFactor && (
                                <p className="text-sm text-red-500 mt-1">{errors.conversionFactor}</p>
                              )}
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Conversion Formula:</strong> 1 {formData.name || "Unit"} = {formData.conversionFactor || "X"} {formData.baseUnit || "Base Unit"}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-6">
                  {/* Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Configure additional settings and notes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleInputChange("status", value as "active" | "inactive")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Any additional notes or special considerations..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating Unit...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Unit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview and Info */}
          <div className="space-y-6">
            {/* Preview Card */}
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-blue-50`}>
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{formData.name || "Unit Name"}</h4>
                        <p className="text-sm text-gray-600">{formData.symbol || "Symbol"}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{formData.category || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{formData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium capitalize ${
                          formData.status === "active" ? "text-green-600" : "text-gray-600"
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conversion:</span>
                        <span className="font-medium">{formatConversionDisplay()}</span>
                      </div>
                    </div>

                    {formData.description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Description:</p>
                        <p className="text-sm">{formData.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Help Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Base Units vs Derived Units</h4>
                  <p className="text-sm text-gray-600">
                    Base units are the fundamental units of measurement (like kilogram, meter).
                    Derived units are calculated based on base units (like gram = 0.001 × kilogram).
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Conversion Factor</h4>
                  <p className="text-sm text-gray-600">
                    The conversion factor represents how many base units equal one of your new unit.
                    For example, 1 gram = 0.001 kilograms.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use standard, recognizable unit names</li>
                    <li>• Keep symbols short and consistent</li>
                    <li>• Provide clear descriptions</li>
                    <li>• Test conversion factors before implementation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Validation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Unit Name</span>
                    {formData.name.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Unit Symbol</span>
                    {formData.symbol.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Category</span>
                    {formData.category.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {!formData.isBaseUnit && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Factor</span>
                        {formData.conversionFactor && !isNaN(Number(formData.conversionFactor)) && Number(formData.conversionFactor) > 0 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Base Unit</span>
                        {formData.baseUnit ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}