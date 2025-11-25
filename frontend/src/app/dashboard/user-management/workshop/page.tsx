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
  Wrench,
  Users,
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
  Star,
  DollarSign,
  Download,
} from "lucide-react";
import EmployeeRegistrationForm from "@/components/EmployeeRegistrationForm";

const workshopEmployees = [
  {
    id: "WS-001",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@tonserv.com",
    phone: "+1 (555) 234-5678",
    role: "Master Technician",
    department: "Technical",
    status: "active",
    hireDate: "2018-06-10",
    location: "Main Workshop",
    certifications: ["ASE Master", "EV Certified", "Hybrid Specialist"],
    specializations: ["Engine Diagnostics", "Electrical Systems", "Transmission"],
    serviceAppointments: 142,
    averageRating: 4.9,
    monthlyRevenue: 28500,
    lastActive: "2024-11-23 16:45",
    supervisor: "Maria Garcia",
    emergencyContact: "Ana Rodriguez (555-876-5432)",
  },
  {
    id: "WS-002",
    name: "Maria Garcia",
    email: "maria.garcia@tonserv.com",
    phone: "+1 (555) 345-6789",
    role: "Workshop Manager",
    department: "Management",
    status: "active",
    hireDate: "2017-03-15",
    location: "Main Workshop",
    certifications: ["Service Management", "Quality Control"],
    specializations: ["Operations Management", "Customer Relations", "Staff Training"],
    serviceAppointments: 0,
    averageRating: 4.8,
    monthlyRevenue: 0,
    lastActive: "2024-11-23 17:30",
    supervisor: "Regional Director",
    emergencyContact: "Jose Garcia (555-765-4321)",
  },
  {
    id: "WS-003",
    name: "James Wilson",
    email: "james.wilson@tonserv.com",
    phone: "+1 (555) 456-7890",
    role: "Service Advisor",
    department: "Customer Service",
    status: "active",
    hireDate: "2022-09-20",
    location: "Front Desk",
    certifications: ["Customer Service", "Sales Training"],
    specializations: ["Customer Consultation", "Service Scheduling", "Billing"],
    serviceAppointments: 89,
    averageRating: 4.7,
    monthlyRevenue: 15300,
    lastActive: "2024-11-23 18:00",
    supervisor: "Maria Garcia",
    emergencyContact: "Patricia Wilson (555-654-3210)",
  },
  {
    id: "WS-004",
    name: "Amanda Lee",
    email: "amanda.lee@tonserv.com",
    phone: "+1 (555) 567-8901",
    role: "Diagnostic Specialist",
    department: "Technical",
    status: "training",
    hireDate: "2024-10-01",
    location: "Main Workshop",
    certifications: ["OBD-II Certified"],
    specializations: ["Computer Diagnostics", "Sensor Systems"],
    serviceAppointments: 23,
    averageRating: 4.6,
    monthlyRevenue: 4200,
    lastActive: "2024-11-23 12:30",
    supervisor: "Carlos Rodriguez",
    emergencyContact: "David Lee (555-543-2109)",
  },
  {
    id: "WS-005",
    name: "Robert Johnson",
    email: "robert.johnson@tonserv.com",
    phone: "+1 (555) 678-9012",
    role: "Parts Specialist",
    department: "Parts & Inventory",
    status: "active",
    hireDate: "2021-04-12",
    location: "Parts Department",
    certifications: ["Parts Management", "Inventory Systems"],
    specializations: ["Parts Sourcing", "Vendor Relations"],
    serviceAppointments: 0,
    averageRating: 0,
    monthlyRevenue: 0,
    lastActive: "2024-11-23 15:15",
    supervisor: "Maria Garcia",
    emergencyContact: "Linda Johnson (555-432-1098)",
  },
  {
    id: "WS-006",
    name: "Sophie Martin",
    email: "sophie.martin@tonserv.com",
    phone: "+1 (555) 789-0123",
    role: "Junior Technician",
    department: "Technical",
    status: "on_leave",
    hireDate: "2023-07-15",
    location: "Main Workshop",
    certifications: ["ASE Entry Level"],
    specializations: ["Oil Changes", "Basic Maintenance", "Tire Service"],
    serviceAppointments: 67,
    averageRating: 4.4,
    monthlyRevenue: 8900,
    lastActive: "2024-11-18 14:20",
    supervisor: "Carlos Rodriguez",
    emergencyContact: "Pierre Martin (555-321-0987)",
  },
  {
    id: "WS-007",
    name: "Thomas Brown",
    email: "thomas.brown@tonserv.com",
    phone: "+1 (555) 890-1234",
    role: "Detail Specialist",
    department: "Detailing",
    status: "active",
    hireDate: "2022-12-01",
    location: "Detailing Bay",
    certifications: ["Auto Detailing", "Paint Protection"],
    specializations: ["Interior Detailing", "Exterior Polishing", "Ceramic Coating"],
    serviceAppointments: 45,
    averageRating: 4.8,
    monthlyRevenue: 7200,
    lastActive: "2024-11-23 16:00",
    supervisor: "Maria Garcia",
    emergencyContact: "Jennifer Brown (555-210-9876)",
  },
];

const departments = ["All", "Technical", "Management", "Customer Service", "Parts & Inventory", "Detailing"];
const statuses = ["All", "active", "training", "on_leave", "inactive"];
const roles = [
  "All",
  "Workshop Manager",
  "Master Technician",
  "Service Advisor",
  "Diagnostic Specialist",
  "Parts Specialist",
  "Junior Technician",
  "Detail Specialist",
];

export default function WorkshopUserManagement() {
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
    if (rating >= 4.7) return "text-green-600";
    if (rating >= 4.3) return "text-yellow-600";
    if (rating > 0) return "text-red-600";
    return "text-gray-400";
  };

  const filteredData = workshopEmployees.filter((employee) => {
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
    total: workshopEmployees.length,
    active: workshopEmployees.filter((e) => e.status === "active").length,
    training: workshopEmployees.filter((e) => e.status === "training").length,
    departments: [...new Set(workshopEmployees.map((e) => e.department))].length,
    averageRating: (
      workshopEmployees.filter((e) => e.averageRating > 0).reduce((sum, e) => sum + e.averageRating, 0) /
      workshopEmployees.filter((e) => e.averageRating > 0).length
    ).toFixed(1),
    totalAppointments: workshopEmployees.reduce((sum, e) => sum + e.serviceAppointments, 0),
    monthlyRevenue: workshopEmployees.reduce((sum, e) => sum + e.monthlyRevenue, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workshop Business</h1>
          <p className="text-muted-foreground">
            Manage technicians, service advisors, and workshop operations staff
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <EmployeeRegistrationForm businessSector="workshop" />
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
            <p className="text-xs text-muted-foreground">Workshop employees</p>
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
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Workshop areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(stats.monthlyRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">Monthly revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <div className="grid gap-4 md:grid-cols-5">
        {["Technical", "Management", "Customer Service", "Parts & Inventory", "Detailing"].map((dept) => {
          const deptEmployees = workshopEmployees.filter((e) => e.department === dept);
          const avgRating =
            deptEmployees.filter((e) => e.averageRating > 0).reduce((sum, e) => sum + e.averageRating, 0) /
              deptEmployees.filter((e) => e.averageRating > 0).length || 0;
          const monthlyRevenue = deptEmployees.reduce((sum, e) => sum + e.monthlyRevenue, 0);

          return (
            <Card key={dept}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dept}</CardTitle>
                {dept === "Technical" ? (
                  <Wrench className="h-4 w-4 text-blue-600" />
                ) : dept === "Management" ? (
                  <Settings className="h-4 w-4 text-purple-600" />
                ) : dept === "Customer Service" ? (
                  <Users className="h-4 w-4 text-green-600" />
                ) : dept === "Detailing" ? (
                  <Star className="h-4 w-4 text-yellow-600" />
                ) : (
                  <Award className="h-4 w-4 text-orange-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deptEmployees.length}</div>
                <div className="text-xs text-muted-foreground">
                  {deptEmployees.filter((e) => e.status === "active").length} active
                </div>
                {avgRating > 0 && (
                  <div className="text-xs text-blue-600 mt-1">{avgRating.toFixed(1)} avg rating</div>
                )}
                {monthlyRevenue > 0 && (
                  <div className="text-xs text-green-600">${(monthlyRevenue / 1000).toFixed(0)}K revenue</div>
                )}
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
          <CardTitle>Workshop Employees</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {workshopEmployees.length} employees
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
                <TableHead>Service Stats</TableHead>
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
                      {employee.averageRating > 0 ? (
                        <>
                          <div className={`font-semibold ${getPerformanceColor(employee.averageRating)}`}>
                            {employee.averageRating}/5.0
                          </div>
                          <div className="text-xs text-muted-foreground">Customer rating</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">No ratings</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {employee.serviceAppointments > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{employee.serviceAppointments}</span> appointments
                        </div>
                      )}
                      {employee.monthlyRevenue > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">${(employee.monthlyRevenue / 1000).toFixed(0)}K</span>{" "}
                          revenue
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
