"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Car,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Activity,
  Timer,
  DollarSign,
  ToolCase,
} from "lucide-react";

const maintenanceData = [
  {
    workOrderId: "WO-2024-156",
    vehicleId: "VAN-001",
    vehicleName: "Ford Transit-250",
    maintenanceType: "Scheduled",
    priority: "Medium",
    status: "Completed",
    scheduledDate: "2024-11-15",
    completedDate: "2024-11-17",
    technician: "John Smith",
    duration: 2.5,
    cost: 450.75,
    partsCost: 234.5,
    laborCost: 216.25,
    downtime: 0,
    issues: ["Oil change", "Brake inspection"],
    partsUsed: ["Oil filter", "Brake pads", "Oil 5W-30"],
    customerRating: 5,
    notes: "Regular scheduled maintenance completed on time",
  },
  {
    workOrderId: "WO-2024-155",
    vehicleId: "VAN-002",
    vehicleName: "Mercedes Sprinter",
    maintenanceType: "Emergency",
    priority: "High",
    status: "In Progress",
    scheduledDate: "2024-11-18",
    completedDate: null,
    technician: "Mike Johnson",
    duration: 4.0,
    cost: 1250.0,
    partsCost: 780.25,
    laborCost: 469.75,
    downtime: 1.5,
    issues: ["Transmission fluid leak", "Clutch adjustment"],
    partsUsed: ["Transmission gasket", "Clutch cable", "Transmission fluid"],
    customerRating: null,
    notes: "Emergency transmission repair in progress",
  },
  {
    workOrderId: "WO-2024-154",
    vehicleId: "VAN-003",
    vehicleName: "RAM ProMaster",
    maintenanceType: "Scheduled",
    priority: "Low",
    status: "Completed",
    scheduledDate: "2024-11-10",
    completedDate: "2024-11-11",
    technician: "Sarah Williams",
    duration: 1.5,
    cost: 234.25,
    partsCost: 125.0,
    laborCost: 109.25,
    downtime: 0.5,
    issues: ["Tire rotation", "Wheel alignment"],
    partsUsed: ["Tire rotation service", "Alignment adjustment"],
    customerRating: 4,
    notes: "Preventive maintenance completed",
  },
  {
    workOrderId: "WO-2024-153",
    vehicleId: "TRUCK-001",
    vehicleName: "Isuzu NPR",
    maintenanceType: "Scheduled",
    priority: "High",
    status: "Pending",
    scheduledDate: "2024-11-22",
    completedDate: null,
    technician: "Not Assigned",
    duration: 3.0,
    estimatedCost: 890.5,
    partsCost: null,
    laborCost: null,
    downtime: 1.0,
    issues: ["Engine tune-up", "Filter replacement"],
    partsUsed: [],
    customerRating: null,
    notes: "Major scheduled maintenance pending assignment",
  },
  {
    workOrderId: "WO-2024-152",
    vehicleId: "VAN-004",
    vehicleName: "Chevrolet Express",
    maintenanceType: "Emergency",
    priority: "Critical",
    status: "Completed",
    scheduledDate: "2024-11-12",
    completedDate: "2024-11-13",
    technician: "Robert Brown",
    duration: 6.5,
    cost: 2340.75,
    partsCost: 1567.5,
    laborCost: 773.25,
    downtime: 3.0,
    issues: ["Engine overheating", "Radiator replacement", "Water pump"],
    partsUsed: ["Radiator", "Water pump", "Coolant", "Hoses"],
    customerRating: 3,
    notes: "Emergency cooling system repair - significant downtime",
  },
];

const maintenanceTypes = ["All", "Scheduled", "Emergency", "Preventive", "Corrective"];
const priorities = ["All", "Low", "Medium", "High", "Critical"];
const statuses = ["All", "Pending", "In Progress", "Completed", "Cancelled"];

export default function MaintenanceReportsPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "Emergency":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "Preventive":
        return <Wrench className="h-4 w-4 text-green-600" />;
      default:
        return <ToolCase className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredData = maintenanceData.filter((maintenance) => {
    const matchesType = selectedType === "All" || maintenance.maintenanceType === selectedType;
    const matchesPriority = selectedPriority === "All" || maintenance.priority === selectedPriority;
    const matchesStatus = selectedStatus === "All" || maintenance.status === selectedStatus;

    return matchesType && matchesPriority && matchesStatus;
  });

  const stats = {
    total: filteredData.length,
    completed: filteredData.filter((m) => m.status === "Completed").length,
    inProgress: filteredData.filter((m) => m.status === "In Progress").length,
    pending: filteredData.filter((m) => m.status === "Pending").length,
    averageCost:
      filteredData.filter((m) => m.cost != null).reduce((sum, m) => sum + (m.cost || 0), 0) /
      filteredData.filter((m) => m.cost != null).length,
    totalCost: filteredData.reduce((sum, m) => sum + (m.cost || m.estimatedCost || 0), 0),
    averageDuration:
      filteredData.filter((m) => m.duration).reduce((sum, m) => sum + m.duration, 0) /
      filteredData.filter((m) => m.duration).length,
    totalDowntime: filteredData.reduce((sum, m) => sum + m.downtime, 0),
    averageRating:
      filteredData.filter((m) => m.customerRating != null).reduce((sum, m) => sum + (m.customerRating || 0), 0) /
      filteredData.filter((m) => m.customerRating != null).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Reports</h1>
          <p className="text-muted-foreground">
            Maintenance schedules, completion rates, and service performance analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {maintenanceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Maintenance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-green-600">{stats.completed} completed</span>
              <span className="text-blue-600">{stats.inProgress} in progress</span>
              <span className="text-yellow-600">{stats.pending} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((stats.completed / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">On-time completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageCost.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per work order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downtime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalDowntime}h</div>
            <p className="text-xs text-muted-foreground">Combined vehicle downtime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">Average satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Performance Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Work Order Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Scheduled", "Emergency", "Preventive", "Corrective"].map((type, index) => {
                const count = filteredData.filter((m) => m.maintenanceType === type).length;
                const percentage = (count / filteredData.length) * 100;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(type)}
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{count}</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Duration Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.averageDuration.toFixed(1)}h</div>
                <div className="text-sm text-muted-foreground">Average duration</div>
              </div>
              <div className="space-y-2">
                {filteredData
                  .filter((m) => m.duration)
                  .sort((a, b) => b.duration - a.duration)
                  .slice(0, 3)
                  .map((workOrder, index) => (
                    <div key={workOrder.workOrderId} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{workOrder.workOrderId}</span>
                      <span className="font-semibold">{workOrder.duration}h</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Technicians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                filteredData
                  .filter((m) => m.technician !== "Not Assigned")
                  .reduce((acc, workOrder) => {
                    if (!acc[workOrder.technician]) {
                      acc[workOrder.technician] = {
                        count: 0,
                        totalCost: 0,
                        totalDuration: 0,
                        averageRating: 0,
                      };
                    }
                    acc[workOrder.technician].count += 1;
                    acc[workOrder.technician].totalCost += workOrder.cost || 0;
                    acc[workOrder.technician].totalDuration += workOrder.duration || 0;
                    if (workOrder.customerRating) {
                      acc[workOrder.technician].averageRating += workOrder.customerRating;
                    }
                    return acc;
                  }, {} as Record<string, any>)
              )
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 3)
                .map(([technician, data]) => (
                  <div key={technician} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{technician}</span>
                      <span className="text-sm font-semibold">{data.count} jobs</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg cost: ${(data.totalCost / data.count).toFixed(0)} • Avg duration:{" "}
                      {(data.totalDuration / data.count).toFixed(1)}h
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm font-medium">Total Maintenance Cost</span>
                <span className="text-lg font-bold">${stats.totalCost.toLocaleString()}</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Parts</span>
                  </div>
                  <span className="font-medium">
                    ${filteredData.reduce((sum, m) => sum + (m.partsCost || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Labor</span>
                  </div>
                  <span className="font-medium">
                    ${filteredData.reduce((sum, m) => sum + (m.laborCost || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Downtime Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.totalDowntime}h</div>
                <div className="text-sm text-muted-foreground">Total downtime this period</div>
              </div>
              <div className="space-y-2">
                {filteredData
                  .filter((m) => m.downtime > 0)
                  .sort((a, b) => b.downtime - a.downtime)
                  .slice(0, 3)
                  .map((workOrder, index) => (
                    <div key={workOrder.workOrderId} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{workOrder.workOrderId}</span>
                        <span className="font-semibold text-red-600">{workOrder.downtime}h</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {workOrder.vehicleId} • {workOrder.issues.join(", ")}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Work Orders</CardTitle>
          <CardDescription>Detailed maintenance work order tracking and status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Downtime</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((workOrder) => (
                <TableRow key={workOrder.workOrderId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.workOrderId}</div>
                      <div className="text-xs text-muted-foreground">
                        {workOrder.scheduledDate}
                        {workOrder.completedDate && <span> • Completed: {workOrder.completedDate}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.vehicleId}</div>
                      <div className="text-sm text-muted-foreground">{workOrder.vehicleName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(workOrder.maintenanceType)}
                      <span className="text-sm">{workOrder.maintenanceType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(workOrder.priority)}</TableCell>
                  <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{workOrder.technician}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{workOrder.duration}h</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      ${workOrder.cost ? workOrder.cost.toLocaleString() : `${workOrder.estimatedCost}*`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm ${workOrder.downtime > 0 ? "text-red-600 font-semibold" : ""}`}>
                      {workOrder.downtime}h
                    </div>
                  </TableCell>
                  <TableCell>
                    {workOrder.customerRating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{workOrder.customerRating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                i < workOrder.customerRating ? "bg-yellow-400" : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Maintenance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Insights</CardTitle>
          <CardDescription>Key performance indicators and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Efficiency Score</h4>
                  <p className="text-sm text-muted-foreground">Excellent</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <p className="text-xs text-muted-foreground">On-time completion rate</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Cost Optimization</h4>
                  <p className="text-sm text-muted-foreground">Good</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">-$2,450</div>
              <p className="text-xs text-muted-foreground">Saved vs budget this month</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Maintenance Alerts</h4>
                  <p className="text-sm text-muted-foreground">3 vehicles due</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground">Vehicles overdue for scheduled maintenance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
