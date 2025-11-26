"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Truck,
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ServiceRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed";
  category: "maintenance" | "repair" | "inspection" | "diagnostics" | "emergency";
  source: "phone" | "email" | "website" | "walk_in" | "mobile_app";
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    customerType: "individual" | "fleet" | "rental";
  };
  vehicle: {
    plateNumber: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    mileage: number;
  };
  assignedMechanic: {
    id: string;
    name: string;
    specialization: string;
  } | null;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  attachments: string[];
  resolution?: string;
}

const mockServiceRequests: ServiceRequest[] = [
  {
    id: "1",
    requestNumber: "SR-2024-001",
    title: "Engine Overheating Issue",
    description: "Vehicle temperature gauge rising to hot, coolant smell noticed",
    priority: "urgent",
    status: "assigned",
    category: "repair",
    source: "phone",
    customer: {
      name: "John Smith",
      company: "Fleet Logistics Inc.",
      phone: "+1234567890",
      email: "john.smith@fleetlogistics.com",
      customerType: "fleet",
    },
    vehicle: {
      plateNumber: "B-1234-ABC",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      vin: "JTHBE5C21N1234567",
      mileage: 45000,
    },
    assignedMechanic: {
      id: "1",
      name: "Mike Johnson",
      specialization: "Engine Specialist",
    },
    estimatedCompletionDate: "2024-01-15T17:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    notes: "Customer reports steam coming from engine bay. Advised to stop driving vehicle.",
    attachments: ["engine_bay_photo.jpg", "temperature_gauge.jpg"],
  },
  {
    id: "2",
    requestNumber: "SR-2024-002",
    title: "Brake Squealing Noise",
    description: "Loud squealing noise when applying brakes, especially at low speeds",
    priority: "medium",
    status: "in_progress",
    category: "repair",
    source: "email",
    customer: {
      name: "Sarah Wilson",
      company: "Rental Cars Ltd.",
      phone: "+1234567891",
      email: "sarah.wilson@rentalcars.com",
      customerType: "rental",
    },
    vehicle: {
      plateNumber: "C-5678-DEF",
      make: "Honda",
      model: "CR-V",
      year: 2021,
      vin: "2HKRW1H88MH123456",
      mileage: 32000,
    },
    assignedMechanic: {
      id: "2",
      name: "David Chen",
      specialization: "Brake Specialist",
    },
    estimatedCompletionDate: "2024-01-16T12:00:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    notes: "Noise started yesterday. Customer is concerned about safety.",
    attachments: [],
  },
  {
    id: "3",
    requestNumber: "SR-2024-003",
    title: "Routine Maintenance Service",
    description: "Scheduled 60,000 mile service including oil change, filter replacement, and general inspection",
    priority: "low",
    status: "resolved",
    category: "maintenance",
    source: "website",
    customer: {
      name: "Robert Brown",
      company: "Delivery Services Co.",
      phone: "+1234567892",
      email: "robert.brown@delivery.com",
      customerType: "fleet",
    },
    vehicle: {
      plateNumber: "D-9012-GHI",
      make: "Ford",
      model: "Transit",
      year: 2020,
      vin: "1FTBW1CM5KK123456",
      mileage: 60000,
    },
    assignedMechanic: {
      id: "3",
      name: "Tom Wilson",
      specialization: "General Maintenance",
    },
    estimatedCompletionDate: "2024-01-14T16:00:00Z",
    actualCompletionDate: "2024-01-14T15:30:00Z",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    notes: "Service completed ahead of schedule. Vehicle ready for pickup.",
    attachments: ["service_report.pdf"],
    resolution: "Completed routine maintenance, replaced oil filter, cabin filter, and performed comprehensive inspection. Vehicle in excellent condition.",
  },
  {
    id: "4",
    requestNumber: "SR-2024-004",
    title: "Air Conditioning Not Cooling",
    description: "AC system blowing warm air, no cooling effect",
    priority: "high",
    status: "open",
    category: "repair",
    source: "mobile_app",
    customer: {
      name: "Lisa Anderson",
      company: "Corporate Fleet",
      phone: "+1234567893",
      email: "lisa.anderson@corporate.com",
      customerType: "fleet",
    },
    vehicle: {
      plateNumber: "E-3456-JKL",
      make: "Nissan",
      model: "Altima",
      year: 2023,
      vin: "1N4BL4EV9PC123456",
      mileage: 15000,
    },
    assignedMechanic: null,
    estimatedCompletionDate: "2024-01-17T15:00:00Z",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    notes: "Customer reported issue started suddenly. AC was working fine yesterday.",
    attachments: [],
  },
  {
    id: "5",
    requestNumber: "SR-2024-005",
    title: "Check Engine Light On",
    description: "Check engine light illuminated, vehicle running normally",
    priority: "medium",
    status: "open",
    category: "diagnostics",
    source: "walk_in",
    customer: {
      name: "Michael Davis",
      company: "Construction LLC",
      phone: "+1234567894",
      email: "michael.davis@construction.com",
      customerType: "fleet",
    },
    vehicle: {
      plateNumber: "F-7890-MNO",
      make: "Chevrolet",
      model: "Silverado",
      year: 2021,
      vin: "1GCVYCE16MZ123456",
      mileage: 35000,
    },
    assignedMechanic: null,
    estimatedCompletionDate: "2024-01-16T10:00:00Z",
    createdAt: "2024-01-15T13:00:00Z",
    updatedAt: "2024-01-15T13:00:00Z",
    notes: "Customer brought vehicle directly to workshop. Light came on this morning.",
    attachments: ["dashboard_light.jpg"],
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "assigned":
      return "bg-purple-100 text-purple-800";
    case "open":
      return "bg-yellow-100 text-yellow-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "emergency":
      return "bg-red-100 text-red-800";
    case "repair":
      return "bg-orange-100 text-orange-800";
    case "maintenance":
      return "bg-blue-100 text-blue-800";
    case "inspection":
      return "bg-green-100 text-green-800";
    case "diagnostics":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "email":
      return <Mail className="h-4 w-4" />;
    case "website":
    case "mobile_app":
      return <MessageSquare className="h-4 w-4" />;
    case "walk_in":
      return <User className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function WorkshopServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    let filtered = serviceRequests;

    if (searchTerm) {
      filtered = filtered.filter(
        (sr) =>
          sr.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sr.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sr.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((sr) => sr.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((sr) => sr.priority === priorityFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((sr) => sr.category === categoryFilter);
    }

    setFilteredRequests(filtered);
  }, [serviceRequests, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const stats = {
    total: serviceRequests.length,
    open: serviceRequests.filter((sr) => sr.status === "open").length,
    assigned: serviceRequests.filter((sr) => sr.status === "assigned").length,
    inProgress: serviceRequests.filter((sr) => sr.status === "in_progress").length,
    resolved: serviceRequests.filter((sr) => sr.status === "resolved").length,
    urgent: serviceRequests.filter((sr) => sr.priority === "urgent").length,
  };

  const handleResolveRequest = (requestId: string) => {
    if (resolutionNote.trim()) {
      setServiceRequests((prev) =>
        prev.map((sr) =>
          sr.id === requestId
            ? {
                ...sr,
                status: "resolved" as const,
                actualCompletionDate: new Date().toISOString(),
                resolution: resolutionNote,
                updatedAt: new Date().toISOString(),
              }
            : sr
        )
      );
      setResolutionNote("");
      setSelectedRequest(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground">Manage customer service requests and support tickets</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Service Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.assigned}</p>
                <p className="text-sm text-muted-foreground">Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.urgent}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search service requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inspection">Inspection</SelectItem>
            <SelectItem value="diagnostics">Diagnostics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requestNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {request.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{request.customer.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.vehicle.make} {request.vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">{request.vehicle.plateNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSourceIcon(request.source)}
                      <span className="capitalize">{request.source.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(request.category)}>
                      {request.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setSelectedRequest(request);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{request.requestNumber} - {request.title}</DialogTitle>
                          <DialogDescription>
                            Service request details and resolution information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Request Information</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Request #:</span> {request.requestNumber}</p>
                                  <p><span className="font-medium">Priority:</span> <Badge variant={getPriorityColor(request.priority)}>{request.priority}</Badge></p>
                                  <p><span className="font-medium">Status:</span> <Badge className={getStatusColor(request.status)}>{request.status.replace('_', ' ')}</Badge></p>
                                  <p><span className="font-medium">Category:</span> <Badge className={getCategoryColor(request.category)}>{request.category}</Badge></p>
                                  <p><span className="font-medium">Source:</span> <div className="inline-flex items-center space-x-1">{getSourceIcon(request.source)}<span>{request.source.replace('_', ' ')}</span></div></p>
                                  <p><span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Last Updated:</span> {new Date(request.updatedAt).toLocaleDateString()}</p>
                                  {request.estimatedCompletionDate && (
                                    <p><span className="font-medium">Est. Completion:</span> {new Date(request.estimatedCompletionDate).toLocaleDateString()}</p>
                                  )}
                                  {request.actualCompletionDate && (
                                    <p><span className="font-medium">Actual Completion:</span> {new Date(request.actualCompletionDate).toLocaleDateString()}</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Name:</span> {request.customer.name}</p>
                                  <p><span className="font-medium">Company:</span> {request.customer.company}</p>
                                  <p><span className="font-medium">Type:</span> <span className="capitalize">{request.customer.customerType}</span></p>
                                  <p><span className="font-medium">Phone:</span> {request.customer.phone}</p>
                                  <p><span className="font-medium">Email:</span> {request.customer.email}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Vehicle Information</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Make/Model:</span> {request.vehicle.make} {request.vehicle.model}</p>
                                  <p><span className="font-medium">Year:</span> {request.vehicle.year}</p>
                                  <p><span className="font-medium">Plate Number:</span> {request.vehicle.plateNumber}</p>
                                  <p><span className="font-medium">VIN:</span> {request.vehicle.vin}</p>
                                  <p><span className="font-medium">Mileage:</span> {request.vehicle.mileage.toLocaleString()} miles</p>
                                </div>
                              </div>
                              {request.assignedMechanic && (
                                <div>
                                  <h4 className="font-semibold mb-2">Assigned Mechanic</h4>
                                  <div className="bg-muted p-3 rounded-lg space-y-1">
                                    <p><span className="font-medium">Name:</span> {request.assignedMechanic.name}</p>
                                    <p><span className="font-medium">Specialization:</span> {request.assignedMechanic.specialization}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="md:col-span-2 space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  <p>{request.description}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Notes</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  <p>{request.notes}</p>
                                </div>
                              </div>
                              {request.attachments.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Attachments</h4>
                                  <div className="bg-muted p-3 rounded-lg">
                                    {request.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer">
                                        <FileText className="h-4 w-4" />
                                        <span>{attachment}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {request.resolution && (
                                <div>
                                  <h4 className="font-semibold mb-2">Resolution</h4>
                                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                    <p>{request.resolution}</p>
                                  </div>
                                </div>
                              )}
                              {request.status !== "resolved" && request.status !== "closed" && (
                                <div>
                                  <h4 className="font-semibold mb-2">Resolve Request</h4>
                                  <div className="space-y-3">
                                    <Textarea
                                      placeholder="Enter resolution details..."
                                      value={resolutionNote}
                                      onChange={(e) => setResolutionNote(e.target.value)}
                                      className="min-h-[100px]"
                                    />
                                    <Button
                                      onClick={() => handleResolveRequest(request.id)}
                                      disabled={!resolutionNote.trim()}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Resolved
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}