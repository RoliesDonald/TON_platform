"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Save,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Star,
  Car,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Upload,
  FileText,
  Users,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { vehicleRentalApi, type VehicleRentalCompanyFormData, validateVehicleRentalCompany } from "@/lib/api";

const vehicleTypes = [
  "Economy Cars",
  "Compact Cars",
  "Mid-size Cars",
  "Full-size Cars",
  "Luxury Cars",
  "SUVs",
  "Trucks",
  "Vans",
  "Electric Vehicles",
  "Hybrids",
  "Motorcycles",
  "Bicycles",
  "Specialty Vehicles",
];

const specialties = [
  "Luxury Vehicles",
  "Economy Cars",
  "SUVs",
  "Electric Vehicles",
  "Hybrids",
  "Commercial Trucks",
  "Cargo Vans",
  "Moving Trucks",
  "International Vehicles",
  "Exotic Cars",
  "Green Transportation",
  "Corporate Fleets",
  "Event Transportation",
];

const availableCertifications = [
  "ISO 9001",
  "AAA Certified",
  "EPA Certified",
  "Green Business",
  "DOT Certified",
  "OSHA Compliant",
  "International Transport",
  "Premium Certified",
  "Carbon Neutral",
  "Safety Certified",
];

export default function VehicleRentalRegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<VehicleRentalCompanyFormData>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    establishedYear: "",
    businessLicense: "",
    taxId: "",
    description: "",
    totalVehicles: "",
    vehicleTypes: [],
    specialties: [],
    status: "pending",
    contractStart: "",
    contractEnd: "",
    commissionRate: "",
    monthlyRevenue: "",
    bankName: "",
    bankAccount: "",
    certifications: [],
    insuranceProvider: "",
    insurancePolicy: "",
    insuranceExpiry: "",
    notes: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleRentalCompanyFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (
    field: keyof VehicleRentalCompanyFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const validation = validateVehicleRentalCompany(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use API service to create company
      const response = await vehicleRentalApi.createCompany(formData);

      if (response.success) {
        console.log("Company created successfully:", response.data);

        // Show success message and redirect
        router.push("/dashboard/vehicle-rental?success=Company registered successfully");
      } else {
        // Handle API error
        console.error("API Error:", response.error);
        setErrors({ name: response.error || "Failed to register company. Please try again." });
      }
    } catch (error) {
      console.error("Unexpected error registering company:", error);
      setErrors({
        name: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "ID",
      postalCode: "",
      establishedYear: "",
      businessLicense: "",
      taxId: "",
      description: "",
      totalVehicles: "",
      vehicleTypes: [],
      specialties: [],
      status: "pending",
      contractStart: "",
      contractEnd: "",
      commissionRate: "",
      monthlyRevenue: "",
      bankName: "",
      bankAccount: "",
      certifications: [],
      insuranceProvider: "",
      insurancePolicy: "",
      insuranceExpiry: "",
      notes: "",
      agreedToTerms: false,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/vehicle-rental">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Plus className="w-8 h-8 text-blue-600" />
                Register Vehicle Rental Company
              </h1>
              <p className="text-gray-600 mt-2">
                Add a new vehicle rental company to your partnership network
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="fleet">Fleet Info</TabsTrigger>
                  <TabsTrigger value="partnership">Partnership</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 mt-6">
                  {/* Company Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>
                        Enter the basic details about the vehicle rental company
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Company Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="e.g., Premium Fleet Rentals"
                            className={errors.name ? "border-red-500" : ""}
                          />
                          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                          <Label htmlFor="contactPerson">Contact Person *</Label>
                          <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                            placeholder="e.g., John Anderson"
                            className={errors.contactPerson ? "border-red-500" : ""}
                          />
                          {errors.contactPerson && (
                            <p className="text-sm text-red-500 mt-1">{errors.contactPerson}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="e.g., contact@company.com"
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="e.g., +1-555-0123"
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="e.g., https://company.com"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Address Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Address Information</CardTitle>
                      <CardDescription>Company location and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="e.g., 123 Business Avenue"
                          className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="e.g., New York"
                            className={errors.city ? "border-red-500" : ""}
                          />
                          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            placeholder="e.g., NY"
                          />
                        </div>

                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange("postalCode", e.target.value)}
                            placeholder="e.g., 10001"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => handleInputChange("country", value)}
                        >
                          <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="ID">Indonesia</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Details</CardTitle>
                      <CardDescription>Company background and legal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="establishedYear">Established Year *</Label>
                          <Input
                            id="establishedYear"
                            type="number"
                            value={formData.establishedYear}
                            onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                            placeholder="e.g., 2015"
                            className={errors.establishedYear ? "border-red-500" : ""}
                          />
                          {errors.establishedYear && (
                            <p className="text-sm text-red-500 mt-1">{errors.establishedYear}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="businessLicense">Business License # *</Label>
                          <Input
                            id="businessLicense"
                            value={formData.businessLicense}
                            onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                            placeholder="e.g., BL-12345678"
                            className={errors.businessLicense ? "border-red-500" : ""}
                          />
                          {errors.businessLicense && (
                            <p className="text-sm text-red-500 mt-1">{errors.businessLicense}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="taxId">Tax ID *</Label>
                        <Input
                          id="taxId"
                          value={formData.taxId}
                          onChange={(e) => handleInputChange("taxId", e.target.value)}
                          placeholder="e.g., 12-3456789"
                          className={errors.taxId ? "border-red-500" : ""}
                        />
                        {errors.taxId && <p className="text-sm text-red-500 mt-1">{errors.taxId}</p>}
                      </div>

                      <div>
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Provide a brief description of the company and its services..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fleet" className="space-y-6 mt-6">
                  {/* Fleet Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Fleet Information</CardTitle>
                      <CardDescription>
                        Details about the company vehicle fleet and specialties
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="totalVehicles">Total Vehicles *</Label>
                        <Input
                          id="totalVehicles"
                          type="number"
                          value={formData.totalVehicles}
                          onChange={(e) => handleInputChange("totalVehicles", e.target.value)}
                          placeholder="e.g., 150"
                          className={errors.totalVehicles ? "border-red-500" : ""}
                        />
                        {errors.totalVehicles && (
                          <p className="text-sm text-red-500 mt-1">{errors.totalVehicles}</p>
                        )}
                      </div>

                      <div>
                        <Label>Vehicle Types *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {vehicleTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`vehicle-${type}`}
                                checked={formData.vehicleTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleInputChange("vehicleTypes", [...formData.vehicleTypes, type]);
                                  } else {
                                    handleInputChange(
                                      "vehicleTypes",
                                      formData.vehicleTypes.filter((t) => t !== type)
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={`vehicle-${type}`} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.vehicleTypes && (
                          <p className="text-sm text-red-500 mt-1">{errors.vehicleTypes}</p>
                        )}
                      </div>

                      <div>
                        <Label>Specialties</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {specialties.map((specialty) => (
                            <div key={specialty} className="flex items-center space-x-2">
                              <Checkbox
                                id={`specialty-${specialty}`}
                                checked={formData.specialties.includes(specialty)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleInputChange("specialties", [...formData.specialties, specialty]);
                                  } else {
                                    handleInputChange(
                                      "specialties",
                                      formData.specialties.filter((s) => s !== specialty)
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={`specialty-${specialty}`} className="text-sm">
                                {specialty}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="partnership" className="space-y-6 mt-6">
                  {/* Partnership Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Partnership Details</CardTitle>
                      <CardDescription>Contract and financial arrangement details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status">Partnership Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleInputChange("status", value as "pending" | "active" | "inactive")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contractStart">Contract Start Date *</Label>
                          <Input
                            id="contractStart"
                            type="date"
                            value={formData.contractStart}
                            onChange={(e) => handleInputChange("contractStart", e.target.value)}
                            className={errors.contractStart ? "border-red-500" : ""}
                          />
                          {errors.contractStart && (
                            <p className="text-sm text-red-500 mt-1">{errors.contractStart}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="contractEnd">Contract End Date *</Label>
                          <Input
                            id="contractEnd"
                            type="date"
                            value={formData.contractEnd}
                            onChange={(e) => handleInputChange("contractEnd", e.target.value)}
                            className={errors.contractEnd ? "border-red-500" : ""}
                          />
                          {errors.contractEnd && (
                            <p className="text-sm text-red-500 mt-1">{errors.contractEnd}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="commissionRate">Commission Rate (%) *</Label>
                        <Input
                          id="commissionRate"
                          type="number"
                          step="0.01"
                          value={formData.commissionRate}
                          onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                          placeholder="e.g., 15.5"
                          className={errors.commissionRate ? "border-red-500" : ""}
                        />
                        {errors.commissionRate && (
                          <p className="text-sm text-red-500 mt-1">{errors.commissionRate}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="monthlyRevenue">Expected Monthly Revenue</Label>
                          <Input
                            id="monthlyRevenue"
                            type="number"
                            value={formData.monthlyRevenue}
                            onChange={(e) => handleInputChange("monthlyRevenue", e.target.value)}
                            placeholder="e.g., 50000"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={formData.bankName}
                            onChange={(e) => handleInputChange("bankName", e.target.value)}
                            placeholder="e.g., Chase Bank"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bankAccount">Bank Account Number</Label>
                        <Input
                          id="bankAccount"
                          value={formData.bankAccount}
                          onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                          placeholder="e.g., ****1234"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6 mt-6">
                  {/* Compliance & Certifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance & Certifications</CardTitle>
                      <CardDescription>Insurance, certifications, and regulatory compliance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                          <Input
                            id="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                            placeholder="e.g., State Farm Insurance"
                          />
                        </div>

                        <div>
                          <Label htmlFor="insurancePolicy">Policy Number</Label>
                          <Input
                            id="insurancePolicy"
                            value={formData.insurancePolicy}
                            onChange={(e) => handleInputChange("insurancePolicy", e.target.value)}
                            placeholder="e.g., POL-12345678"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="insuranceExpiry">Insurance Expiry Date</Label>
                        <Input
                          id="insuranceExpiry"
                          type="date"
                          value={formData.insuranceExpiry}
                          onChange={(e) => handleInputChange("insuranceExpiry", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Certifications</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {availableCertifications.map((cert) => (
                            <div key={cert} className="flex items-center space-x-2">
                              <Checkbox
                                id={`cert-${cert}`}
                                checked={formData.certifications.includes(cert)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleInputChange("certifications", [...formData.certifications, cert]);
                                  } else {
                                    handleInputChange(
                                      "certifications",
                                      formData.certifications.filter((c) => c !== cert)
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={`cert-${cert}`} className="text-sm">
                                {cert}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Any additional notes or special requirements..."
                          rows={4}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) =>
                            handleInputChange("agreedToTerms", checked as boolean)
                          }
                        />
                        <Label htmlFor="agreedToTerms" className="text-sm">
                          I agree to the terms and conditions and confirm that all provided information is
                          accurate
                        </Label>
                      </div>
                      {errors.agreedToTerms && <p className="text-sm text-red-500">{errors.agreedToTerms}</p>}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering Company...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Register Company
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview and Help */}
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
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{formData.name || "Company Name"}</h4>
                        <p className="text-sm text-gray-600">{formData.contactPerson || "Contact Person"}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{formData.email || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{formData.phone || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{formData.city || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Vehicles:</span>
                        <span className="font-medium">{formData.totalVehicles || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium capitalize ${
                            formData.status === "active"
                              ? "text-green-600"
                              : formData.status === "inactive"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {formData.status || "pending"}
                        </span>
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
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Business License</li>
                    <li>• Tax Identification Number</li>
                    <li>• Insurance Policy Certificate</li>
                    <li>• Vehicle Registration Documents</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Partnership Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Access to our fleet management platform</li>
                    <li>• Increased visibility and customer base</li>
                    <li>• Streamlined booking and payment processing</li>
                    <li>• Analytics and reporting tools</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Commission Structure</h4>
                  <p className="text-sm text-gray-600">
                    Commission rates are typically between 10-20% depending on fleet size, vehicle types, and
                    partnership level. Rates are negotiable for larger fleets.
                  </p>
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
                    <span>Company Name</span>
                    {formData.name.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Contact Person</span>
                    {formData.contactPerson.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Email Address</span>
                    {formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Phone Number</span>
                    {formData.phone.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Address</span>
                    {formData.address.trim() && formData.city.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Business License</span>
                    {formData.businessLicense.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Vehicles</span>
                    {formData.totalVehicles &&
                    !isNaN(Number(formData.totalVehicles)) &&
                    Number(formData.totalVehicles) > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Contract Dates</span>
                    {formData.contractStart && formData.contractEnd ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Terms Agreement</span>
                    {formData.agreedToTerms ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
