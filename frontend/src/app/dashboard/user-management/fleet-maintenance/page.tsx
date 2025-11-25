"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Car,
  Wrench,
  Users,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Award,
  TrendingUp,
  Download,
} from "lucide-react";
import EmployeeRegistrationForm from "@/components/EmployeeRegistrationForm";

const fleetEmployees = [
  {
    id: "FM-001",
    name: "John Martinez",
    email: "john.martinez@tonserv.com",
    phone: "+1 (555) 123-4567",
    role: "Senior Mechanic",
    department: "Maintenance",
    status: "active",
    hireDate: "2022-03-15",
    location: "Central Fleet Center",
    certifications: ["ASE Certified", "EV Specialist"],
    specializations: ["Diesel Engines", "Transmission", "Brake Systems"],
    assignedVehicles: 8,
    workOrdersCompleted: 156,
    performanceRating: 4.8,
    lastActive: "2024-11-22 14:30",
    supervisor: "David Wilson",
    emergencyContact: "Maria Martinez (555-987-6543)",
  },
  {
    id: "FM-002",
    name: "Sarah Chen",
    email: "sarah.chen@tonserv.com",
    phone: "+1 (555) 234-5678",
    role: "Fleet Manager",
    department: "Operations",
    status: "active",
    hireDate: "2021-07-10",
    location: "Main Office",
    certifications: ["Fleet Management", "Logistics Certified"],
    specializations: ["Fleet Operations", "Scheduling", "Compliance"],
    assignedVehicles: 45,
    workOrdersCompleted: 0,
    performanceRating: 4.9,
    lastActive: "2024-11-23 09:15",
    supervisor: "Robert Johnson",
    emergencyContact: "Kevin Chen (555-876-5432)",
  },
  {
    id: "FM-003",
    name: "Michael Roberts",
    email: "michael.roberts@tonserv.com",
    phone: "+1 (555) 345-6789",
    role: "Vehicle Technician",
    department: "Maintenance",
    status: "on_leave",
    hireDate: "2023-01-20",
    location: "North Fleet Center",
    certifications: ["ASE Certified"],
    specializations: ["Electrical Systems", "Diagnostics"],
    assignedVehicles: 12,
    workOrdersCompleted: 87,
    performanceRating: 4.5,
    lastActive: "2024-11-15 16:45",
    supervisor: "John Martinez",
    emergencyContact: "Jennifer Roberts (555-765-4321)",
  },
  {
    id: "FM-004",
    name: "Lisa Thompson",
    email: "lisa.thompson@tonserv.com",
    phone: "+1 (555) 456-7890",
    role: "Parts Manager",
    department: "Inventory",
    status: "active",
    hireDate: "2020-11-05",
    location: "Warehouse",
    certifications: ["Inventory Management", "Supply Chain"],
    specializations: ["Parts Procurement", "Vendor Relations"],
    assignedVehicles: 0,
    workOrdersCompleted: 0,
    performanceRating: 4.7,
    lastActive: "2024-11-23 11:20",
    supervisor: "Sarah Chen",
    emergencyContact: "Mark Thompson (555-654-3210)",
  },
  {
    id: "FM-005",
    name: "David Wilson",
    email: "david.wilson@tonserv.com",
    phone: "+1 (555) 567-8901",
    role: "Maintenance Supervisor",
    department: "Maintenance",
    status: "active",
    hireDate: "2019-06-15",
    location: "Central Fleet Center",
    certifications: ["ASE Master", "Management Certified"],
    specializations: ["Team Leadership", "Quality Control"],
    assignedVehicles: 0,
    workOrdersCompleted: 23,
    performanceRating: 4.6,
    lastActive: "2024-11-23 13:45",
    supervisor: "Sarah Chen",
    emergencyContact: "Susan Wilson (555-543-2109)",
  },
  {
    id: "FM-006",
    name: "James Anderson",
    email: "james.anderson@tonserv.com",
    phone: "+1 (555) 678-9012",
    role: "Driver",
    department: "Operations",
    status: "active",
    hireDate: "2023-08-10",
    location: "Central Fleet Center",
    certifications: ["CDL Class A"],
    specializations: ["Heavy Vehicles", "Long Haul"],
    assignedVehicles: 1,
    workOrdersCompleted: 0,
    performanceRating: 4.4,
    lastActive: "2024-11-23 07:30",
    supervisor: "Sarah Chen",
    emergencyContact: "Linda Anderson (555-432-1098)",
  },
];

const departments = ["All", "Maintenance", "Operations", "Inventory"];
const statuses = ["All", "active", "on_leave", "inactive"];
const roles = [
  "All",
  "Fleet Manager",
  "Maintenance Supervisor",
  "Senior Mechanic",
  "Vehicle Technician",
  "Parts Manager",
  "Driver",
];

export default function FleetMaintenanceUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "on_leave":
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.7) return "text-green-600";
    if (rating >= 4.3) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredData = fleetEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "All" || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus;
    const matchesRole = selectedRole === "All" || employee.role === selectedRole;

    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  const stats = {
    total: fleetEmployees.length,
    active: fleetEmployees.filter((e) => e.status === "active").length,
    onLeave: fleetEmployees.filter((e) => e.status === "on_leave").length,
    departments: [...new Set(fleetEmployees.map((e) => e.department))].length,
    averagePerformance: (
      fleetEmployees.reduce((sum, e) => sum + e.performanceRating, 0) / fleetEmployees.length
    ).toFixed(1),
    totalWorkOrders: fleetEmployees.reduce((sum, e) => sum + e.workOrdersCompleted, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fleet Maintenance Business</h1>
          <p className="text-muted-foreground">Manage mechanics, drivers, and fleet operations staff</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <EmployeeRegistrationForm businessSector="fleet-maintenance" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Fleet maintenance staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.onLeave}</div>
            <p className="text-xs text-muted-foreground">Temporary leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Total departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averagePerformance}</div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalWorkOrders}</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {["Maintenance", "Operations", "Inventory"].map((dept) => {
          const deptEmployees = fleetEmployees.filter((e) => e.department === dept);
          return (
            <Card key={dept}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dept}</CardTitle>
                {dept === "Maintenance" ? (
                  <Wrench className="h-4 w-4 text-blue-600" />
                ) : dept === "Operations" ? (
                  <Car className="h-4 w-4 text-green-600" />
                ) : (
                  <Shield className="h-4 w-4 text-purple-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deptEmployees.length}</div>
                <div className="text-xs text-muted-foreground">
                  {deptEmployees.filter((e) => e.status === "active").length} active
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === "All" ? "All Roles" : role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Maintenance Employees</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {fleetEmployees.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Work Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {employee.id}</div>
                      <div className="text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {employee.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[150px]">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.role}</div>
                      <div className="text-sm text-muted-foreground">{employee.department}</div>
                      <div className="text-xs text-blue-600">Supervisor: {employee.supervisor}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`font-semibold ${getPerformanceColor(employee.performanceRating)}`}>
                        {employee.performanceRating}/5.0
                      </div>
                      <div className="text-xs text-muted-foreground">Performance rating</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {employee.assignedVehicles > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{employee.assignedVehicles}</span> vehicles
                        </div>
                      )}
                      {employee.workOrdersCompleted > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{employee.workOrdersCompleted}</span> WOs completed
                        </div>
                      )}
                      {employee.certifications.length > 0 && (
                        <div className="text-xs text-blue-600">
                          {employee.certifications.length} certifications
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(employee.status)}
                      <div className="text-xs text-muted-foreground">
                        Last active: {employee.lastActive.split(" ")[0]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Employee
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Performance Review
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Employee
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
    </div>
  );
}
