"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Truck,
  FileText,
  Eye,
  Edit,
  Filter,
  Search,
  MoreHorizontal,
  XCircle,
  Timer,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "on_hold";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  customerName: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin: string;
  };
  assignedTechnician: string;
  estimatedHours: number;
  actualHours?: number;
  estimatedCost: number;
  actualCost?: number;
  createdDate: string;
  dueDate: string;
  completionDate?: string;
  parts: Array<{
    name: string;
    quantity: number;
    unitCost: number;
  }>;
  laborItems: Array<{
    description: string;
    hours: number;
    rate: number;
  }>;
}

export default function ActiveWorkOrdersPage() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      // Mock data for demonstration
      const mockWorkOrders: WorkOrder[] = [
        {
          id: "1",
          workOrderNumber: "WO-2024-001",
          status: "in_progress",
          priority: "high",
          title: "Brake System Repair",
          description: "Replace front brake pads and rotors, inspect brake lines",
          customerName: "John Smith",
          vehicleInfo: {
            make: "Toyota",
            model: "Camry",
            year: 2020,
            licensePlate: "ABC-123",
            vin: "4T1B11HK6LU123456",
          },
          assignedTechnician: "Mike Johnson",
          estimatedHours: 3.5,
          actualHours: 2.0,
          estimatedCost: 450.0,
          actualCost: 380.0,
          createdDate: "2024-11-20T08:00:00Z",
          dueDate: "2024-11-22T17:00:00Z",
          parts: [
            { name: "Front Brake Pads", quantity: 2, unitCost: 65.0 },
            { name: "Front Rotors", quantity: 2, unitCost: 85.0 },
          ],
          laborItems: [
            { description: "Brake pad replacement", hours: 1.5, rate: 120.0 },
            { description: "Rotor replacement", hours: 0.5, rate: 120.0 },
          ],
        },
        {
          id: "2",
          workOrderNumber: "WO-2024-002",
          status: "pending",
          priority: "medium",
          title: "Oil Change Service",
          description: "Regular oil and filter change, multi-point inspection",
          customerName: "Sarah Davis",
          vehicleInfo: {
            make: "Honda",
            model: "CR-V",
            year: 2019,
            licensePlate: "XYZ-789",
            vin: "2HKRM2H58KH456789",
          },
          assignedTechnician: "Unassigned",
          estimatedHours: 1.0,
          estimatedCost: 65.0,
          createdDate: "2024-11-21T09:30:00Z",
          dueDate: "2024-11-21T18:00:00Z",
          parts: [
            { name: "Engine Oil", quantity: 5, unitCost: 8.5 },
            { name: "Oil Filter", quantity: 1, unitCost: 12.0 },
          ],
          laborItems: [
            { description: "Oil change service", hours: 0.5, rate: 95.0 },
            { description: "Multi-point inspection", hours: 0.5, rate: 95.0 },
          ],
        },
        {
          id: "3",
          workOrderNumber: "WO-2024-003",
          status: "completed",
          priority: "urgent",
          title: "Engine Diagnostic",
          description: "Check engine light diagnosis, fuel system inspection",
          customerName: "Robert Brown",
          vehicleInfo: {
            make: "Ford",
            model: "F-150",
            year: 2018,
            licensePlate: "DEF-456",
            vin: "1FTEW1EG5JKF12345",
          },
          assignedTechnician: "Tom Wilson",
          estimatedHours: 2.0,
          actualHours: 2.5,
          estimatedCost: 250.0,
          actualCost: 275.0,
          createdDate: "2024-11-19T10:00:00Z",
          dueDate: "2024-11-20T16:00:00Z",
          completionDate: "2024-11-20T14:30:00Z",
          parts: [{ name: "O2 Sensor", quantity: 1, unitCost: 120.0 }],
          laborItems: [
            { description: "Diagnostic time", hours: 1.5, rate: 100.0 },
            { description: "O2 sensor replacement", hours: 1.0, rate: 100.0 },
          ],
        },
        {
          id: "4",
          workOrderNumber: "WO-2024-004",
          status: "on_hold",
          priority: "low",
          title: "Tire Rotation",
          description: "Rotate tires, check tire pressure and alignment",
          customerName: "Emily Johnson",
          vehicleInfo: {
            make: "Chevrolet",
            model: "Malibu",
            year: 2021,
            licensePlate: "GHI-012",
            vin: "1G1ZD5ST1MF123456",
          },
          assignedTechnician: "Mike Johnson",
          estimatedHours: 0.75,
          estimatedCost: 45.0,
          createdDate: "2024-11-18T14:00:00Z",
          dueDate: "2024-11-23T17:00:00Z",
          parts: [],
          laborItems: [
            { description: "Tire rotation", hours: 0.5, rate: 60.0 },
            { description: "Tire pressure check", hours: 0.25, rate: 60.0 },
          ],
        },
      ];

      setTimeout(() => {
        setWorkOrders(mockWorkOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch work orders:", error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status: WorkOrder["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Timer className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "on_hold":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: WorkOrder["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "on_hold":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: WorkOrder["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredWorkOrders = workOrders.filter((workOrder) => {
    const matchesSearch =
      workOrder.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.vehicleInfo.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || workOrder.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || workOrder.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Active Work Orders</h1>
            <p className="text-muted-foreground">Manage current work orders and their status</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Active Work Orders</h1>
          <p className="text-muted-foreground">Manage current work orders and their status</p>
        </div>

        <Button onClick={() => router.push("../../../dashboard/workorders/create")}>
          <Wrench className="mr-2 h-4 w-4" />
          Create Work Order
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold">
                {workOrders.filter((wo) => wo.status === "pending").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Timer className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold">
                {workOrders.filter((wo) => wo.status === "in_progress").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-600">On Hold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <span className="text-2xl font-bold">
                {workOrders.filter((wo) => wo.status === "on_hold").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold">
                {workOrders.filter((wo) => wo.status === "completed").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by work order, customer, vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders ({filteredWorkOrders.length})</CardTitle>
          <CardDescription>Active work orders and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Est. Hours</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.map((workOrder) => (
                  <TableRow key={workOrder.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{workOrder.workOrderNumber}</div>
                        <div className="text-sm text-gray-500">{workOrder.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workOrder.status)}
                        <Badge className={getStatusColor(workOrder.status)}>
                          {workOrder.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(workOrder.priority)}>
                        {workOrder.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{workOrder.customerName}</div>
                        <div className="text-sm text-gray-500">{workOrder.vehicleInfo.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {workOrder.vehicleInfo.make} {workOrder.vehicleInfo.model}
                        </div>
                        <div className="text-gray-500">{workOrder.vehicleInfo.year}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {workOrder.assignedTechnician === "Unassigned" ? (
                          <Badge variant="outline">Unassigned</Badge>
                        ) : (
                          workOrder.assignedTechnician
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {workOrder.actualHours ? (
                          <div>
                            <div>{workOrder.actualHours}h</div>
                            <div className="text-gray-500">of {workOrder.estimatedHours}h</div>
                          </div>
                        ) : (
                          workOrder.estimatedHours + "h"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        ${workOrder.actualCost?.toFixed(2) || workOrder.estimatedCost.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(workOrder.dueDate)}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Work Order
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredWorkOrders.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
