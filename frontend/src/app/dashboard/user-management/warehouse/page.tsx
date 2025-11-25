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
  Warehouse,
  Package,
  Truck,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Award,
  TrendingUp,
  BarChart3,
  DollarSign,
  Clipboard,
  Shield,
  Download,
  Users,
} from "lucide-react";
import EmployeeRegistrationForm from "@/components/EmployeeRegistrationForm";

const warehouseEmployees = [
  {
    id: "WH-001",
    name: "Daniel Richardson",
    email: "daniel.richardson@tonserv.com",
    phone: "+1 (555) 456-7890",
    role: "Warehouse Manager",
    department: "Management",
    status: "active",
    hireDate: "2018-09-10",
    location: "Main Warehouse",
    certifications: ["Warehouse Management", "OSHA Certified", "Inventory Systems"],
    specializations: ["Operations Management", "Staff Training", "Safety Compliance"],
    ordersProcessed: 0,
    accuracyRating: 99.2,
    productivityScore: 95,
    teamSize: 15,
    lastActive: "2024-11-23 17:30",
    supervisor: "Regional Operations Director",
    emergencyContact: "Rebecca Richardson (555-654-3210)",
  },
  {
    id: "WH-002",
    name: "Maria Hernandez",
    email: "maria.hernandez@tonserv.com",
    phone: "+1 (555) 567-8901",
    role: "Inventory Supervisor",
    department: "Inventory",
    status: "active",
    hireDate: "2020-02-15",
    location: "Main Warehouse",
    certifications: ["Inventory Management", "Forklift Certified"],
    specializations: ["Stock Management", "Cycle Counting", "Quality Control"],
    ordersProcessed: 0,
    accuracyRating: 98.8,
    productivityScore: 92,
    teamSize: 6,
    lastActive: "2024-11-23 16:45",
    supervisor: "Daniel Richardson",
    emergencyContact: "Carlos Hernandez (555-543-2109)",
  },
  {
    id: "WH-003",
    name: "James Chen",
    email: "james.chen@tonserv.com",
    phone: "+1 (555) 678-9012",
    role: "Forklift Operator",
    department: "Operations",
    status: "active",
    hireDate: "2022-07-20",
    location: "Main Warehouse",
    certifications: ["Forklift Certified", "Safety Training"],
    specializations: ["Heavy Equipment", "Loading/Unloading", "Material Handling"],
    ordersProcessed: 342,
    accuracyRating: 97.5,
    productivityScore: 88,
    teamSize: 0,
    lastActive: "2024-11-23 15:20",
    supervisor: "Maria Hernandez",
    emergencyContact: "Lisa Chen (555-432-1098)",
  },
  {
    id: "WH-004",
    name: "Patricia Wilson",
    email: "patricia.wilson@tonserv.com",
    phone: "+1 (555) 789-0123",
    role: "Quality Control Specialist",
    department: "Quality",
    status: "active",
    hireDate: "2021-04-05",
    location: "Main Warehouse",
    certifications: ["Quality Control", "Inspection Certified"],
    specializations: ["Product Inspection", "Defect Reporting", "Quality Standards"],
    ordersProcessed: 156,
    accuracyRating: 99.1,
    productivityScore: 85,
    teamSize: 0,
    lastActive: "2024-11-23 14:15",
    supervisor: "Daniel Richardson",
    emergencyContact: "Robert Wilson (555-321-0987)",
  },
  {
    id: "WH-005",
    name: "Thomas Anderson",
    email: "thomas.anderson@tonserv.com",
    phone: "+1 (555) 890-1234",
    role: "Logistics Coordinator",
    department: "Logistics",
    status: "active",
    hireDate: "2019-11-12",
    location: "Shipping Department",
    certifications: ["Logistics Management", "Dispatch Training"],
    specializations: ["Route Planning", "Dispatch Coordination", "Carrier Relations"],
    ordersProcessed: 0,
    accuracyRating: 98.3,
    productivityScore: 90,
    teamSize: 4,
    lastActive: "2024-11-23 16:00",
    supervisor: "Daniel Richardson",
    emergencyContact: "Jennifer Anderson (555-210-9876)",
  },
  {
    id: "WH-006",
    name: "Lisa Thompson",
    email: "lisa.thompson@tonserv.com",
    phone: "+1 (555) 901-2345",
    role: "Picker/Packer",
    department: "Operations",
    status: "on_leave",
    hireDate: "2023-03-25",
    location: "Main Warehouse",
    certifications: ["Order Fulfillment", "Safety Training"],
    specializations: ["Order Picking", "Packing", "Labeling"],
    ordersProcessed: 478,
    accuracyRating: 96.8,
    productivityScore: 87,
    teamSize: 0,
    lastActive: "2024-11-15 13:45",
    supervisor: "Maria Hernandez",
    emergencyContact: "Michael Thompson (555-109-8765)",
  },
  {
    id: "WH-007",
    name: "Christopher Davis",
    email: "christopher.davis@tonserv.com",
    phone: "+1 (555) 012-3456",
    role: "Receiving Clerk",
    department: "Receiving",
    status: "active",
    hireDate: "2022-09-18",
    location: "Receiving Department",
    certifications: ["Receiving Operations", "Inspection Training"],
    specializations: ["Inbound Processing", "Vendor Communication", "Receiving Inspection"],
    ordersProcessed: 289,
    accuracyRating: 97.9,
    productivityScore: 86,
    teamSize: 0,
    lastActive: "2024-11-23 12:30",
    supervisor: "Maria Hernandez",
    emergencyContact: "Susan Davis (555-987-6543)",
  },
  {
    id: "WH-008",
    name: "Amanda Foster",
    email: "amanda.foster@tonserv.com",
    phone: "+1 (555) 123-4567",
    role: "Shipping Clerk",
    department: "Shipping",
    status: "training",
    hireDate: "2024-11-01",
    location: "Shipping Department",
    certifications: ["Basic Operations"],
    specializations: ["Outbound Processing", "Documentation"],
    ordersProcessed: 34,
    accuracyRating: 94.2,
    productivityScore: 75,
    teamSize: 0,
    lastActive: "2024-11-23 11:15",
    supervisor: "Thomas Anderson",
    emergencyContact: "David Foster (555-876-5432)",
  },
];

const departments = [
  "All",
  "Management",
  "Inventory",
  "Operations",
  "Quality",
  "Logistics",
  "Receiving",
  "Shipping",
];
const statuses = ["All", "active", "training", "on_leave", "inactive"];
const roles = [
  "All",
  "Warehouse Manager",
  "Inventory Supervisor",
  "Forklift Operator",
  "Quality Control Specialist",
  "Logistics Coordinator",
  "Picker/Packer",
  "Receiving Clerk",
  "Shipping Clerk",
];

export default function WarehouseUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "training":
        return <Badge className="bg-blue-100 text-blue-800">Training</Badge>;
      case "on_leave":
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 98) return "text-green-600";
    if (rating >= 95) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredData = warehouseEmployees.filter((employee) => {
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
    total: warehouseEmployees.length,
    active: warehouseEmployees.filter((e) => e.status === "active").length,
    training: warehouseEmployees.filter((e) => e.status === "training").length,
    departments: [...new Set(warehouseEmployees.map((e) => e.department))].length,
    averageAccuracy: (
      warehouseEmployees.reduce((sum, e) => sum + e.accuracyRating, 0) / warehouseEmployees.length
    ).toFixed(1),
    totalOrders: warehouseEmployees.reduce((sum, e) => sum + e.ordersProcessed, 0),
    averageProductivity: (
      warehouseEmployees.reduce((sum, e) => sum + e.productivityScore, 0) / warehouseEmployees.length
    ).toFixed(0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Business</h1>
          <p className="text-muted-foreground">
            Manage warehouse staff, inventory managers, and logistics personnel
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <EmployeeRegistrationForm businessSector="warehouse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Warehouse employees</p>
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
            <CardTitle className="text-sm font-medium">Training</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.training}</div>
            <p className="text-xs text-muted-foreground">In training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Warehouse areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Average accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.averageProductivity}%</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {["Management", "Inventory", "Operations", "Quality"].map((dept) => {
          const deptEmployees = warehouseEmployees.filter((e) => e.department === dept);
          const avgAccuracy =
            deptEmployees.reduce((sum, e) => sum + e.accuracyRating, 0) / deptEmployees.length || 0;
          const avgProductivity =
            deptEmployees.reduce((sum, e) => sum + e.productivityScore, 0) / deptEmployees.length || 0;
          const totalOrders = deptEmployees.reduce((sum, e) => sum + e.ordersProcessed, 0);

          return (
            <Card key={dept}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dept}</CardTitle>
                {dept === "Management" ? (
                  <Settings className="h-4 w-4 text-purple-600" />
                ) : dept === "Inventory" ? (
                  <Clipboard className="h-4 w-4 text-blue-600" />
                ) : dept === "Operations" ? (
                  <Package className="h-4 w-4 text-green-600" />
                ) : (
                  <Award className="h-4 w-4 text-yellow-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deptEmployees.length}</div>
                <div className="text-xs text-muted-foreground">
                  {deptEmployees.filter((e) => e.status === "active").length} active
                </div>
                {avgAccuracy > 0 && (
                  <div className="text-xs text-green-600 mt-1">{avgAccuracy.toFixed(1)}% accuracy</div>
                )}
                {avgProductivity > 0 && (
                  <div className="text-xs text-orange-600">{avgProductivity.toFixed(0)}% productivity</div>
                )}
                {totalOrders > 0 && <div className="text-xs text-blue-600">{totalOrders} orders</div>}
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
              <SelectTrigger className="w-[160px]">
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
              <SelectTrigger className="w-[180px]">
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
          <CardTitle>Warehouse Employees</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {warehouseEmployees.length} employees
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
                    <div className="space-y-1">
                      <div>
                        <div className={`font-semibold ${getPerformanceColor(employee.accuracyRating)}`}>
                          {employee.accuracyRating}% accuracy
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">{employee.productivityScore}%</span> productivity
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {employee.ordersProcessed > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{employee.ordersProcessed}</span> orders
                        </div>
                      )}
                      {employee.teamSize > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{employee.teamSize}</span> team members
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
                        Hired: {employee.hireDate.split("-")[0]}
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
