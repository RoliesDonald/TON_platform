"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  Save,
  X,
  Upload,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Award,
  Users,
  Building,
  Car,
  Wrench,
  Package,
  Warehouse,
} from "lucide-react";

interface EmployeeRegistrationFormProps {
  businessSector: "fleet-maintenance" | "workshop" | "vehicle-rental" | "warehouse";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const businessSectorConfig = {
  "fleet-maintenance": {
    title: "Fleet Maintenance Employee",
    icon: Car,
    departments: [
      { value: "maintenance", label: "Maintenance" },
      { value: "operations", label: "Operations" },
      { value: "inventory", label: "Inventory" },
    ],
    roles: [
      { value: "senior-mechanic", label: "Senior Mechanic" },
      { value: "fleet-manager", label: "Fleet Manager" },
      { value: "vehicle-technician", label: "Vehicle Technician" },
      { value: "parts-manager", label: "Parts Manager" },
      { value: "maintenance-supervisor", label: "Maintenance Supervisor" },
      { value: "driver", label: "Driver" },
    ],
    certifications: [
      "ASE Certified",
      "EV Specialist",
      "CDL Class A",
      "CDL Class B",
      "Fleet Management",
      "Logistics Certified",
      "Inventory Management",
    ],
    specializations: [
      "Diesel Engines",
      "Transmission",
      "Brake Systems",
      "Electrical Systems",
      "Diagnostics",
      "Heavy Vehicles",
      "Long Haul",
      "Parts Procurement",
    ],
  },
  workshop: {
    title: "Workshop Employee",
    icon: Wrench,
    departments: [
      { value: "technical", label: "Technical" },
      { value: "management", label: "Management" },
      { value: "customer-service", label: "Customer Service" },
      { value: "parts-inventory", label: "Parts & Inventory" },
      { value: "detailing", label: "Detailing" },
    ],
    roles: [
      { value: "workshop-manager", label: "Workshop Manager" },
      { value: "master-technician", label: "Master Technician" },
      { value: "service-advisor", label: "Service Advisor" },
      { value: "diagnostic-specialist", label: "Diagnostic Specialist" },
      { value: "parts-specialist", label: "Parts Specialist" },
      { value: "junior-technician", label: "Junior Technician" },
      { value: "detail-specialist", label: "Detail Specialist" },
    ],
    certifications: [
      "ASE Master",
      "EV Certified",
      "Hybrid Specialist",
      "OBD-II Certified",
      "Service Management",
      "Quality Control",
      "Customer Service",
      "Sales Training",
      "Parts Management",
      "Inventory Systems",
      "Auto Detailing",
      "Paint Protection",
    ],
    specializations: [
      "Engine Diagnostics",
      "Electrical Systems",
      "Transmission",
      "Customer Relations",
      "Service Scheduling",
      "Computer Diagnostics",
      "Sensor Systems",
      "Vehicle Sourcing",
      "Vendor Relations",
      "Oil Changes",
      "Basic Maintenance",
      "Tire Service",
      "Interior Detailing",
      "Exterior Polishing",
      "Ceramic Coating",
    ],
  },
  "vehicle-rental": {
    title: "Vehicle Rental Employee",
    icon: Package,
    departments: [
      { value: "management", label: "Management" },
      { value: "customer-service", label: "Customer Service" },
      { value: "operations", label: "Operations" },
      { value: "support", label: "Support" },
    ],
    roles: [
      { value: "branch-manager", label: "Branch Manager" },
      { value: "senior-rental-agent", label: "Senior Rental Agent" },
      { value: "customer-service-representative", label: "Customer Service Representative" },
      { value: "fleet-coordinator", label: "Fleet Coordinator" },
      { value: "rental-agent", label: "Rental Agent" },
      { value: "insurance-specialist", label: "Insurance Specialist" },
    ],
    certifications: [
      "Rental Management",
      "Customer Service Excellence",
      "Airport Operations",
      "Fleet Management",
      "Insurance Processing",
      "Claims Handling",
      "Customer Service",
      "Multilingual Support",
      "Rental Operations",
    ],
    specializations: [
      "Operations Management",
      "Staff Training",
      "Business Development",
      "Customer Relations",
      "Booking Management",
      "Upselling",
      "Customer Support",
      "Complaint Resolution",
      "High-Volume Operations",
      "Airport Regulations",
      "Team Leadership",
      "Vehicle Scheduling",
      "Maintenance Coordination",
      "Logistics",
      "Insurance Coverage",
    ],
  },
  warehouse: {
    title: "Warehouse Employee",
    icon: Warehouse,
    departments: [
      { value: "management", label: "Management" },
      { value: "inventory", label: "Inventory" },
      { value: "operations", label: "Operations" },
      { value: "quality", label: "Quality" },
      { value: "logistics", label: "Logistics" },
      { value: "receiving", label: "Receiving" },
      { value: "shipping", label: "Shipping" },
    ],
    roles: [
      { value: "warehouse-manager", label: "Warehouse Manager" },
      { value: "inventory-supervisor", label: "Inventory Supervisor" },
      { value: "forklift-operator", label: "Forklift Operator" },
      { value: "quality-control-specialist", label: "Quality Control Specialist" },
      { value: "logistics-coordinator", label: "Logistics Coordinator" },
      { value: "picker-packer", label: "Picker/Packer" },
      { value: "receiving-clerk", label: "Receiving Clerk" },
      { value: "shipping-clerk", label: "Shipping Clerk" },
    ],
    certifications: [
      "Warehouse Management",
      "OSHA Certified",
      "Inventory Systems",
      "Forklift Certified",
      "Safety Training",
      "Quality Control",
      "Inspection Certified",
      "Logistics Management",
      "Dispatch Training",
      "Order Fulfillment",
      "Receiving Operations",
      "Inspection Training",
    ],
    specializations: [
      "Operations Management",
      "Staff Training",
      "Safety Compliance",
      "Stock Management",
      "Cycle Counting",
      "Quality Control",
      "Heavy Equipment",
      "Loading/Unloading",
      "Material Handling",
      "Product Inspection",
      "Defect Reporting",
      "Quality Standards",
      "Route Planning",
      "Dispatch Coordination",
    ],
  },
};

export default function EmployeeRegistrationForm({
  businessSector,
  trigger,
  onSuccess,
}: EmployeeRegistrationFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const config = businessSectorConfig[businessSector];
  const Icon = config.icon;

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",

    // Employment Information
    employeeId: "",
    department: "",
    role: "",
    hireDate: "",
    employmentType: "full-time",
    salary: "",
    workSchedule: "full-time",
    supervisor: "",
    workLocation: "",

    // Professional Information
    certifications: [] as string[],
    specializations: [] as string[],
    yearsOfExperience: "",
    previousEmployer: "",
    previousRole: "",
    education: "",
    skills: "",

    // System Information
    username: "",
    password: "",
    confirmPassword: "",
    accessLevel: "user",
    systemPermissions: [] as string[],

    // Additional Information
    notes: "",
    probationPeriod: "90",
    trainingRequired: true,
    backgroundCheckRequired: true,
    drugTestRequired: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item: string) => item !== value),
    }));
  };

  const generateEmployeeId = () => {
    const prefix =
      businessSector === "fleet-maintenance"
        ? "FM"
        : businessSector === "workshop"
        ? "WS"
        : businessSector === "vehicle-rental"
        ? "VR"
        : "WH";
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Employee registration data:", {
        ...formData,
        businessSector,
        employeeId: formData.employeeId || generateEmployeeId(),
      });

      setOpen(false);
      onSuccess?.();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        employeeId: "",
        department: "",
        role: "",
        hireDate: "",
        employmentType: "full-time",
        salary: "",
        workSchedule: "full-time",
        supervisor: "",
        workLocation: "",
        certifications: [],
        specializations: [],
        yearsOfExperience: "",
        previousEmployer: "",
        previousRole: "",
        education: "",
        skills: "",
        username: "",
        password: "",
        confirmPassword: "",
        accessLevel: "user",
        systemPermissions: [],
        notes: "",
        probationPeriod: "90",
        trainingRequired: true,
        backgroundCheckRequired: true,
        drugTestRequired: true,
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <UserPlus className="h-4 w-4 mr-2" />
      Add New Employee
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Register New {config.title}
          </DialogTitle>
          <DialogDescription>
            Fill in the employee information to add them to the {config.title} system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="system">System Access</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="emergencyContactName">Contact Name *</Label>
                        <Input
                          id="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                        <Input
                          id="emergencyContactPhone"
                          type="tel"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                        <Input
                          id="emergencyContactRelationship"
                          value={formData.emergencyContactRelationship}
                          onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Employment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        placeholder={generateEmployeeId()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hireDate">Hire Date *</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => handleInputChange("hireDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(value) => handleInputChange("employmentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="temporary">Temporary</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {config.departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="role">Role/Position *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => handleInputChange("role", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {config.roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supervisor">Supervisor</Label>
                      <Input
                        id="supervisor"
                        value={formData.supervisor}
                        onChange={(e) => handleInputChange("supervisor", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="workLocation">Work Location</Label>
                      <Input
                        id="workLocation"
                        value={formData.workLocation}
                        onChange={(e) => handleInputChange("workLocation", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary">Annual Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workSchedule">Work Schedule</Label>
                      <Select
                        value={formData.workSchedule}
                        onValueChange={(value) => handleInputChange("workSchedule", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time (40 hrs)</SelectItem>
                          <SelectItem value="part-time">Part Time ( 30 hrs)</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="shifts">Shift Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Certifications</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {config.certifications.map((cert) => (
                        <div key={cert} className="flex items-center space-x-2">
                          <Checkbox
                            id={cert}
                            checked={formData.certifications.includes(cert)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("certifications", cert, checked as boolean)
                            }
                          />
                          <Label htmlFor={cert} className="text-sm">
                            {cert}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Specializations</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {config.specializations.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={formData.specializations.includes(spec)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("specializations", spec, checked as boolean)
                            }
                          />
                          <Label htmlFor={spec} className="text-sm">
                            {spec}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="previousEmployer">Previous Employer</Label>
                      <Input
                        id="previousEmployer"
                        value={formData.previousEmployer}
                        onChange={(e) => handleInputChange("previousEmployer", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="previousRole">Previous Role</Label>
                      <Input
                        id="previousRole"
                        value={formData.previousRole}
                        onChange={(e) => handleInputChange("previousRole", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="Highest degree, field of study, institution..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Additional Skills</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      placeholder="Any additional relevant skills or qualifications..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    System Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        placeholder={formData.email.split("@")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accessLevel">Access Level</Label>
                      <Select
                        value={formData.accessLevel}
                        onValueChange={(value) => handleInputChange("accessLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any additional information about this employee..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Onboarding Requirements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trainingRequired"
                          checked={formData.trainingRequired}
                          onCheckedChange={(checked) =>
                            handleInputChange("trainingRequired", checked as boolean)
                          }
                        />
                        <Label htmlFor="trainingRequired">Training Required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="backgroundCheckRequired"
                          checked={formData.backgroundCheckRequired}
                          onCheckedChange={(checked) =>
                            handleInputChange("backgroundCheckRequired", checked as boolean)
                          }
                        />
                        <Label htmlFor="backgroundCheckRequired">Background Check Required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="drugTestRequired"
                          checked={formData.drugTestRequired}
                          onCheckedChange={(checked) =>
                            handleInputChange("drugTestRequired", checked as boolean)
                          }
                        />
                        <Label htmlFor="drugTestRequired">Drug Test Required</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="probationPeriod">Probation Period (days)</Label>
                    <Select
                      value={formData.probationPeriod}
                      onValueChange={(value) => handleInputChange("probationPeriod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="0">No probation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Register Employee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
