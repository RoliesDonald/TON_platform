"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  Clock,
  AlertCircle,
  CheckCircle,
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

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  vehicle: {
    plateNumber: string;
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  assignedMechanic: {
    id: string;
    name: string;
    specialization: string;
  } | null;
  estimatedTime: number;
  actualTime?: number;
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  description: string;
  notes: string;
  parts: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "1",
    workOrderNumber: "WO-2024-001",
    title: "Oil Change and Filter Replacement",
    priority: "medium",
    status: "in_progress",
    vehicle: {
      plateNumber: "B-1234-ABC",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      vin: "JTHBE5C21N1234567",
    },
    customer: {
      name: "John Smith",
      company: "Fleet Logistics Inc.",
      phone: "+1234567890",
      email: "john.smith@fleetlogistics.com",
    },
    assignedMechanic: {
      id: "1",
      name: "Mike Johnson",
      specialization: "General Maintenance",
    },
    estimatedTime: 2,
    actualTime: 1.5,
    estimatedCost: 150,
    actualCost: 145,
    createdAt: "2024-01-15T09:00:00Z",
    dueDate: "2024-01-15T17:00:00Z",
    description: "Regular oil change and oil filter replacement",
    notes: "Customer requested synthetic oil",
    parts: [
      { name: "Synthetic Engine Oil 5W-30", quantity: 5, unitPrice: 8 },
      { name: "Oil Filter", quantity: 1, unitPrice: 15 },
    ],
  },
  {
    id: "2",
    workOrderNumber: "WO-2024-002",
    title: "Brake Pad Replacement",
    priority: "high",
    status: "pending",
    vehicle: {
      plateNumber: "C-5678-DEF",
      make: "Honda",
      model: "CR-V",
      year: 2021,
      vin: "2HKRW1H88MH123456",
    },
    customer: {
      name: "Sarah Wilson",
      company: "Rental Cars Ltd.",
      phone: "+1234567891",
      email: "sarah.wilson@rentalcars.com",
    },
    assignedMechanic: {
      id: "2",
      name: "David Chen",
      specialization: "Brake Specialist",
    },
    estimatedTime: 3,
    estimatedCost: 350,
    createdAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-01-16T12:00:00Z",
    description: "Front brake pad replacement and rotor inspection",
    notes: "Customer reported squeaking noise when braking",
    parts: [
      { name: "Front Brake Pads", quantity: 2, unitPrice: 65 },
      { name: "Brake Fluid", quantity: 1, unitPrice: 25 },
    ],
  },
  {
    id: "3",
    workOrderNumber: "WO-2024-003",
    title: "Engine Diagnostics",
    priority: "urgent",
    status: "completed",
    vehicle: {
      plateNumber: "D-9012-GHI",
      make: "Ford",
      model: "Transit",
      year: 2020,
      vin: "1FTBW1CM5KK123456",
    },
    customer: {
      name: "Robert Brown",
      company: "Delivery Services Co.",
      phone: "+1234567892",
      email: "robert.brown@delivery.com",
    },
    assignedMechanic: {
      id: "3",
      name: "Tom Wilson",
      specialization: "Engine Diagnostics",
    },
    estimatedTime: 4,
    actualTime: 3.5,
    estimatedCost: 200,
    actualCost: 180,
    createdAt: "2024-01-14T14:00:00Z",
    dueDate: "2024-01-15T10:00:00Z",
    completedAt: "2024-01-15T09:30:00Z",
    description: "Engine warning light diagnosis and repair",
    notes: "Faulty oxygen sensor replaced",
    parts: [
      { name: "Oxygen Sensor", quantity: 1, unitPrice: 120 },
      { name: "Diagnostic Service", quantity: 1, unitPrice: 60 },
    ],
  },
  {
    id: "4",
    workOrderNumber: "WO-2024-004",
    title: "Transmission Service",
    priority: "medium",
    status: "in_progress",
    vehicle: {
      plateNumber: "E-3456-JKL",
      make: "Nissan",
      model: "Altima",
      year: 2023,
      vin: "1N4BL4EV9PC123456",
    },
    customer: {
      name: "Lisa Anderson",
      company: "Corporate Fleet",
      phone: "+1234567893",
      email: "lisa.anderson@corporate.com",
    },
    assignedMechanic: {
      id: "4",
      name: "Carlos Rodriguez",
      specialization: "Transmission Specialist",
    },
    estimatedTime: 5,
    estimatedCost: 450,
    createdAt: "2024-01-15T11:00:00Z",
    dueDate: "2024-01-16T15:00:00Z",
    description: "Transmission fluid change and filter replacement",
    notes: "60,000 mile service interval",
    parts: [
      { name: "Transmission Fluid", quantity: 8, unitPrice: 12 },
      { name: "Transmission Filter", quantity: 1, unitPrice: 45 },
    ],
  },
  {
    id: "5",
    workOrderNumber: "WO-2024-005",
    title: "AC System Repair",
    priority: "high",
    status: "pending",
    vehicle: {
      plateNumber: "F-7890-MNO",
      make: "Chevrolet",
      model: "Silverado",
      year: 2021,
      vin: "1GCVYCE16MZ123456",
    },
    customer: {
      name: "Michael Davis",
      company: "Construction LLC",
      phone: "+1234567894",
      email: "michael.davis@construction.com",
    },
    assignedMechanic: null,
    estimatedTime: 6,
    estimatedCost: 600,
    createdAt: "2024-01-15T13:00:00Z",
    dueDate: "2024-01-17T12:00:00Z",
    description: "AC compressor replacement and refrigerant recharge",
    notes: "AC not cooling, compressor failure suspected",
    parts: [
      { name: "AC Compressor", quantity: 1, unitPrice: 450 },
      { name: "Refrigerant R-134a", quantity: 3, unitPrice: 25 },
      { name: "AC Filter Dryer", quantity: 1, unitPrice: 35 },
    ],
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
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function WorkshopWorkordersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  useEffect(() => {
    let filtered = workOrders;

    if (searchTerm) {
      filtered = filtered.filter(
        (wo) =>
          wo.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wo.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wo.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((wo) => wo.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((wo) => wo.priority === priorityFilter);
    }

    setFilteredWorkOrders(filtered);
  }, [workOrders, searchTerm, statusFilter, priorityFilter]);

  const stats = {
    total: workOrders.length,
    pending: workOrders.filter((wo) => wo.status === "pending").length,
    inProgress: workOrders.filter((wo) => wo.status === "in_progress").length,
    completed: workOrders.filter((wo) => wo.status === "completed").length,
    urgent: workOrders.filter((wo) => wo.priority === "urgent").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">Manage workshop work orders and repairs</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Work Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Work Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
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
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((workOrder) => (
                <TableRow key={workOrder.id}>
                  <TableCell className="font-medium">{workOrder.workOrderNumber}</TableCell>
                  <TableCell>{workOrder.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.vehicle.make} {workOrder.vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">{workOrder.vehicle.plateNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{workOrder.customer.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {workOrder.assignedMechanic ? (
                      <div>
                        <div className="font-medium">{workOrder.assignedMechanic.name}</div>
                        <div className="text-sm text-muted-foreground">{workOrder.assignedMechanic.specialization}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(workOrder.priority)}>
                      {workOrder.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(workOrder.status)}>
                      {workOrder.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(workOrder.dueDate).toLocaleDateString()}</TableCell>
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
                              setSelectedWorkOrder(workOrder);
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
                          <DialogTitle>{workOrder.workOrderNumber} - {workOrder.title}</DialogTitle>
                          <DialogDescription>
                            Work order details and repair information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedWorkOrder && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Vehicle Information</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Make/Model:</span> {workOrder.vehicle.make} {workOrder.vehicle.model}</p>
                                  <p><span className="font-medium">Year:</span> {workOrder.vehicle.year}</p>
                                  <p><span className="font-medium">Plate Number:</span> {workOrder.vehicle.plateNumber}</p>
                                  <p><span className="font-medium">VIN:</span> {workOrder.vehicle.vin}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Name:</span> {workOrder.customer.name}</p>
                                  <p><span className="font-medium">Company:</span> {workOrder.customer.company}</p>
                                  <p><span className="font-medium">Phone:</span> {workOrder.customer.phone}</p>
                                  <p><span className="font-medium">Email:</span> {workOrder.customer.email}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Work Order Details</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Priority:</span> <Badge variant={getPriorityColor(workOrder.priority)}>{workOrder.priority}</Badge></p>
                                  <p><span className="font-medium">Status:</span> <Badge className={getStatusColor(workOrder.status)}>{workOrder.status.replace('_', ' ')}</Badge></p>
                                  <p><span className="font-medium">Created:</span> {new Date(workOrder.createdAt).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Due Date:</span> {new Date(workOrder.dueDate).toLocaleDateString()}</p>
                                  {workOrder.completedAt && (
                                    <p><span className="font-medium">Completed:</span> {new Date(workOrder.completedAt).toLocaleDateString()}</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Cost & Time</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-1">
                                  <p><span className="font-medium">Estimated Time:</span> {workOrder.estimatedTime} hours</p>
                                  {workOrder.actualTime && (
                                    <p><span className="font-medium">Actual Time:</span> {workOrder.actualTime} hours</p>
                                  )}
                                  <p><span className="font-medium">Estimated Cost:</span> ${workOrder.estimatedCost}</p>
                                  {workOrder.actualCost && (
                                    <p><span className="font-medium">Actual Cost:</span> ${workOrder.actualCost}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  <p>{workOrder.description}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Notes</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  <p>{workOrder.notes}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Parts & Labor</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-2">Part Name</th>
                                        <th className="text-center py-2">Quantity</th>
                                        <th className="text-right py-2">Unit Price</th>
                                        <th className="text-right py-2">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {workOrder.parts.map((part, index) => (
                                        <tr key={index} className="border-b">
                                          <td className="py-2">{part.name}</td>
                                          <td className="text-center py-2">{part.quantity}</td>
                                          <td className="text-right py-2">${part.unitPrice}</td>
                                          <td className="text-right py-2">${part.quantity * part.unitPrice}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
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