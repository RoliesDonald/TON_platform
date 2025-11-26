"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tool,
  Clock,
  AlertCircle,
  CheckCircle,
  Car,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wrench,
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  MapPin,
} from "lucide-react";

interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerType: "rental_company" | "fleet_company";
  customerName: string;
  customerLogo: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    vin: string;
    mileage: number;
  };
  priority: "low" | "medium" | "high" | "urgent";
  category: "maintenance" | "repair" | "inspection" | "diagnostic";
  description: string;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
  assignedMechanic?: {
    id: string;
    name: string;
    avatar: string;
    specialties: string[];
  };
  location: string;
  estimatedDuration: number;
  estimatedCost: number;
  actualCost?: number;
  partsUsed: {
    name: string;
    quantity: number;
    cost: number;
  }[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: "junior_mechanic" | "senior_mechanic" | "service_advisor";
  specialties: string[];
  status: "available" | "busy" | "off_duty";
  activeWorkOrders: number;
  completedToday: number;
  efficiency: number;
  location: string;
  joinedAt: string;
}

const mockServiceRequests: ServiceRequest[] = [
  {
    id: "1",
    requestNumber: "SR-2024-001",
    customerType: "rental_company",
    customerName: "CityLink Rentals",
    customerLogo: "CL",
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2024,
      plateNumber: "ABC-123",
      vin: "1HGBH41JXMN109186",
      mileage: 15420,
    },
    priority: "high",
    category: "repair",
    description: "Engine overheating issue reported by customer. Vehicle stalls at idle.",
    status: "in_progress",
    assignedMechanic: {
      id: "M1",
      name: "John Smith",
      avatar: "JS",
      specialties: ["Engine Diagnostics", "Electrical Systems"],
    },
    location: "Downtown Workshop",
    estimatedDuration: 3,
    estimatedCost: 280,
    actualCost: 320,
    partsUsed: [
      { name: "Thermostat Assembly", quantity: 1, cost: 45 },
      { name: "Coolant", quantity: 2, cost: 30 },
    ],
    createdAt: "2024-03-25T08:30:00Z",
    updatedAt: "2024-03-25T14:15:00Z",
    completedAt: "2024-03-25T16:30:00Z",
  },
  {
    id: "2",
    requestNumber: "SR-2024-002",
    customerType: "fleet_company",
    customerName: "FleetMaster Logistics",
    customerLogo: "FL",
    vehicle: {
      make: "Ford",
      model: "Transit",
      year: 2023,
      plateNumber: "XYZ-789",
      vin: "2HGBH41JXMN109187",
      mileage: 32400,
    },
    priority: "medium",
    category: "maintenance",
    description: "Scheduled maintenance service - 30,000 mile service",
    status: "assigned",
    assignedMechanic: {
      id: "M2",
      name: "Sarah Johnson",
      avatar: "SJ",
      specialties: ["Preventive Maintenance", "Brake Systems"],
    },
    location: "Airport Branch",
    estimatedDuration: 4,
    estimatedCost: 450,
    partsUsed: [],
    createdAt: "2024-03-25T09:15:00Z",
    updatedAt: "2024-03-25T11:00:00Z",
  },
  {
    id: "3",
    requestNumber: "SR-2024-003",
    customerType: "rental_company",
    customerName: "AutoLease Pro",
    customerLogo: "AL",
    vehicle: {
      make: "Honda",
      model: "CR-V",
      year: 2024,
      plateNumber: "DEF-456",
      vin: "3HGBH41JXMN109188",
      mileage: 8750,
    },
    priority: "urgent",
    category: "diagnostic",
    description: "Check engine light on. Vehicle showing multiple error codes.",
    status: "pending",
    location: "Main Workshop",
    estimatedDuration: 2,
    estimatedCost: 150,
    partsUsed: [],
    createdAt: "2024-03-25T10:45:00Z",
    updatedAt: "2024-03-25T10:45:00Z",
  },
  {
    id: "4",
    requestNumber: "SR-2024-004",
    customerType: "fleet_company",
    customerName: "Global Transport Inc",
    customerLogo: "GT",
    vehicle: {
      make: "Chevrolet",
      model: "Silverado",
      year: 2023,
      plateNumber: "GHI-012",
      vin: "4HGBH41JXMN109189",
      mileage: 28600,
    },
    priority: "low",
    category: "inspection",
    description: "Pre-rental inspection required before vehicle deployment.",
    status: "completed",
    assignedMechanic: {
      id: "M3",
      name: "Michael Brown",
      avatar: "MB",
      specialties: ["Vehicle Inspections", "Quality Control"],
    },
    location: "Suburban Branch",
    estimatedDuration: 1,
    estimatedCost: 80,
    actualCost: 75,
    partsUsed: [],
    createdAt: "2024-03-25T07:00:00Z",
    updatedAt: "2024-03-25T09:30:00Z",
    completedAt: "2024-03-25T08:15:00Z",
  },
  {
    id: "5",
    requestNumber: "SR-2024-005",
    customerType: "rental_company",
    customerName: "CityLink Rentals",
    customerLogo: "CL",
    vehicle: {
      make: "Mercedes-Benz",
      model: "E-Class",
      year: 2024,
      plateNumber: "JKL-345",
      vin: "5HGBH41JXMN109190",
      mileage: 12400,
    },
    priority: "medium",
    category: "repair",
    description: "Air conditioning system not working properly. Blowing warm air.",
    status: "assigned",
    assignedMechanic: {
      id: "M4",
      name: "Emily Wilson",
      avatar: "EW",
      specialties: ["HVAC Systems", "Electrical Systems"],
    },
    location: "Downtown Workshop",
    estimatedDuration: 2.5,
    estimatedCost: 320,
    partsUsed: [],
    createdAt: "2024-03-25T11:30:00Z",
    updatedAt: "2024-03-25T13:45:00Z",
  },
];

const mockMechanics: Mechanic[] = [
  {
    id: "M1",
    name: "John Smith",
    avatar: "JS",
    email: "john.smith@tonworkshop.com",
    phone: "+1-555-0101",
    role: "senior_mechanic",
    specialties: ["Engine Diagnostics", "Electrical Systems", "Transmission"],
    status: "busy",
    activeWorkOrders: 2,
    completedToday: 3,
    efficiency: 92,
    location: "Downtown Workshop",
    joinedAt: "2022-01-15T00:00:00Z",
  },
  {
    id: "M2",
    name: "Sarah Johnson",
    avatar: "SJ",
    email: "sarah.johnson@tonworkshop.com",
    phone: "+1-555-0102",
    role: "senior_mechanic",
    specialties: ["Preventive Maintenance", "Brake Systems", "Suspension"],
    status: "busy",
    activeWorkOrders: 1,
    completedToday: 2,
    efficiency: 88,
    location: "Airport Branch",
    joinedAt: "2021-06-20T00:00:00Z",
  },
  {
    id: "M3",
    name: "Michael Brown",
    avatar: "MB",
    email: "michael.brown@tonworkshop.com",
    phone: "+1-555-0103",
    role: "junior_mechanic",
    specialties: ["Vehicle Inspections", "Oil Changes", "Tire Services"],
    status: "available",
    activeWorkOrders: 0,
    completedToday: 4,
    efficiency: 85,
    location: "Suburban Branch",
    joinedAt: "2023-03-10T00:00:00Z",
  },
  {
    id: "M4",
    name: "Emily Wilson",
    avatar: "EW",
    email: "emily.wilson@tonworkshop.com",
    phone: "+1-555-0104",
    role: "senior_mechanic",
    specialties: ["HVAC Systems", "Electrical Systems", "Diagnostics"],
    status: "busy",
    activeWorkOrders: 1,
    completedToday: 1,
    efficiency: 95,
    location: "Downtown Workshop",
    joinedAt: "2020-09-05T00:00:00Z",
  },
];

export default function WorkshopServicePage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [mechanics, setMechanics] = useState<Mechanic[]>(mockMechanics);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "assigned":
        return <Users className="h-4 w-4" />;
      case "in_progress":
        return <Wrench className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workshop Service</h1>
          <p className="text-muted-foreground">
            Manage vehicle maintenance and repair services for rental and fleet companies
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Service Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceRequests.filter(r => r.status === "in_progress" || r.status === "assigned").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {serviceRequests.filter(r => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Waiting for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Mechanics</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mechanics.filter(m => m.status === "available").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mechanics.reduce((sum, m) => sum + m.completedToday, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Jobs finished today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(mechanics.reduce((sum, m) => sum + m.efficiency, 0) / mechanics.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Team performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Mechanics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Mechanic Team Status</CardTitle>
          <CardDescription>
            Current availability and performance of workshop mechanics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mechanics.map((mechanic) => (
              <div
                key={mechanic.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{mechanic.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{mechanic.name}</div>
                    <div className="text-sm text-muted-foreground">{mechanic.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      mechanic.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {mechanic.status === "available" ? "Available" : "Busy"}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {mechanic.activeWorkOrders} active
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background text-sm ring-offset-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="w-48">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background text-sm ring-offset-background"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>
            Active and recent service requests from rental and fleet companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requestNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{request.customerLogo}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.customerType === "rental_company" ? "Rental" : "Fleet"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.vehicle.plateNumber} • {request.vehicle.mileage.toLocaleString()} mi
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {request.category.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.assignedMechanic ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {request.assignedMechanic.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{request.assignedMechanic.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {request.assignedMechanic.specialties[0]}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status.replace("_", " ")}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Request
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Service Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Request Details - {selectedRequest?.requestNumber}</DialogTitle>
            <DialogDescription>
              Complete service request information and progress
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Customer and Vehicle Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{selectedRequest.customerLogo}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedRequest.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedRequest.customerType === "rental_company" ? "Rental Company" : "Fleet Company"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Vehicle Information</h3>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {selectedRequest.vehicle.year} {selectedRequest.vehicle.make} {selectedRequest.vehicle.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Plate: {selectedRequest.vehicle.plateNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      VIN: {selectedRequest.vehicle.vin}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mileage: {selectedRequest.vehicle.mileage.toLocaleString()} miles
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="font-semibold mb-3">Service Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Category</Label>
                    <div className="text-sm font-medium capitalize">
                      {selectedRequest.category.replace("_", " ")}
                    </div>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge className={getPriorityColor(selectedRequest.priority)}>
                      {selectedRequest.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedRequest.location}
                    </div>
                  </div>
                  <div>
                    <Label>Estimated Duration</Label>
                    <div className="text-sm font-medium">{selectedRequest.estimatedDuration} hours</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Label>Description</Label>
                  <div className="text-sm font-medium">{selectedRequest.description}</div>
                </div>
              </div>

              {/* Assignment and Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Assignment</h3>
                  {selectedRequest.assignedMechanic ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{selectedRequest.assignedMechanic.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedRequest.assignedMechanic.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedRequest.assignedMechanic.specialties.join(", ")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Not assigned yet</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Status</h3>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status.replace("_", " ")}
                    </div>
                  </Badge>
                </div>
              </div>

              {/* Cost and Parts */}
              <div>
                <h3 className="font-semibold mb-3">Cost and Parts Used</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Estimated Cost</Label>
                    <div className="text-sm font-medium">
                      ${selectedRequest.estimatedCost}
                    </div>
                  </div>
                  <div>
                    <Label>Actual Cost</Label>
                    <div className="text-sm font-medium">
                      ${selectedRequest.actualCost || "Pending"}
                    </div>
                  </div>
                </div>
                {selectedRequest.partsUsed.length > 0 && (
                  <div className="mt-4">
                    <Label>Parts Used</Label>
                    <div className="space-y-1 mt-2">
                      {selectedRequest.partsUsed.map((part, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{part.name} (x{part.quantity})</span>
                          <span>${part.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}