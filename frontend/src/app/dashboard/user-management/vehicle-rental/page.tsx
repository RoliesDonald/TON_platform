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
  Package,
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
  Car,
  Headphones,
  FileText,
  Download,
} from "lucide-react";
import EmployeeRegistrationForm from "@/components/EmployeeRegistrationForm";

const rentalEmployees = [
  {
    id: "VR-001",
    name: "Jennifer Adams",
    email: "jennifer.adams@tonserv.com",
    phone: "+1 (555) 345-6789",
    role: "Branch Manager",
    department: "Management",
    status: "active",
    hireDate: "2019-04-15",
    location: "Downtown Branch",
    certifications: ["Rental Management", "Customer Service Excellence"],
    specializations: ["Operations Management", "Staff Training", "Business Development"],
    rentalsProcessed: 0,
    customerRating: 4.8,
    monthlyRevenue: 0,
    teamSize: 8,
    lastActive: "2024-11-23 17:45",
    supervisor: "Regional Director",
    emergencyContact: "Michael Adams (555-765-4321)",
  },
  {
    id: "VR-002",
    name: "Kevin Martinez",
    email: "kevin.martinez@tonserv.com",
    phone: "+1 (555) 456-7890",
    role: "Senior Rental Agent",
    department: "Customer Service",
    status: "active",
    hireDate: "2021-08-20",
    location: "Downtown Branch",
    certifications: ["Customer Service", "Rental Operations"],
    specializations: ["Customer Relations", "Booking Management", "Upselling"],
    rentalsProcessed: 234,
    customerRating: 4.7,
    monthlyRevenue: 18500,
    teamSize: 0,
    lastActive: "2024-11-23 16:30",
    supervisor: "Jennifer Adams",
    emergencyContact: "Lisa Martinez (555-654-3210)",
  },
  {
    id: "VR-003",
    name: "Rachel Thompson",
    email: "rachel.thompson@tonserv.com",
    phone: "+1 (555) 567-8901",
    role: "Customer Service Representative",
    department: "Customer Service",
    status: "active",
    hireDate: "2023-01-10",
    location: "Airport Branch",
    certifications: ["Customer Service", "Multilingual Support"],
    specializations: ["Customer Support", "Complaint Resolution", "Bookings"],
    rentalsProcessed: 156,
    customerRating: 4.9,
    monthlyRevenue: 12300,
    teamSize: 0,
    lastActive: "2024-11-23 18:15",
    supervisor: "David Kim",
    emergencyContact: "Robert Thompson (555-543-2109)",
  },
  {
    id: "VR-004",
    name: "David Kim",
    email: "david.kim@tonserv.com",
    phone: "+1 (555) 678-9012",
    role: "Airport Branch Manager",
    department: "Management",
    status: "active",
    hireDate: "2020-07-01",
    location: "Airport Branch",
    certifications: ["Airport Operations", "Fleet Management"],
    specializations: ["High-Volume Operations", "Airport Regulations", "Team Leadership"],
    rentalsProcessed: 0,
    customerRating: 4.6,
    monthlyRevenue: 0,
    teamSize: 12,
    lastActive: "2024-11-23 17:00",
    supervisor: "Regional Director",
    emergencyContact: "Soo Kim (555-432-1098)",
  },
  {
    id: "VR-005",
    name: "Amanda Foster",
    email: "amanda.foster@tonserv.com",
    phone: "+1 (555) 789-0123",
    role: "Fleet Coordinator",
    department: "Operations",
    status: "active",
    hireDate: "2022-03-15",
    location: "Central Fleet Office",
    certifications: ["Fleet Management", "Vehicle Maintenance"],
    specializations: ["Vehicle Scheduling", "Maintenance Coordination", "Logistics"],
    rentalsProcessed: 0,
    customerRating: 0,
    monthlyRevenue: 0,
    teamSize: 0,
    lastActive: "2024-11-23 15:45",
    supervisor: "Jennifer Adams",
    emergencyContact: "James Foster (555-321-0987)",
  },
  {
    id: "VR-006",
    name: "Christopher Lee",
    email: "christopher.lee@tonserv.com",
    phone: "+1 (555) 890-1234",
    role: "Rental Agent",
    department: "Customer Service",
    status: "training",
    hireDate: "2024-10-15",
    location: "Downtown Branch",
    certifications: ["Customer Service Basic"],
    specializations: ["Basic Rental Operations", "Customer Greeting"],
    rentalsProcessed: 28,
    customerRating: 4.3,
    monthlyRevenue: 2100,
    teamSize: 0,
    lastActive: "2024-11-23 14:20",
    supervisor: "Kevin Martinez",
    emergencyContact: "Michelle Lee (555-210-9876)",
  },
  {
    id: "VR-007",
    name: "Melissa Garcia",
    email: "melissa.garcia@tonserv.com",
    phone: "+1 (555) 901-2345",
    role: "Insurance Specialist",
    department: "Support",
    status: "active",
    hireDate: "2022-11-05",
    location: "Head Office",
    certifications: ["Insurance Processing", "Claims Handling"],
    specializations: ["Insurance Coverage", "Claims Processing", "Risk Assessment"],
    rentalsProcessed: 0,
    customerRating: 0,
    monthlyRevenue: 0,
    teamSize: 0,
    lastActive: "2024-11-23 12:30",
    supervisor: "Jennifer Adams",
    emergencyContact: "Carlos Garcia (555-109-8765)",
  },
];

const departments = ["All", "Management", "Customer Service", "Operations", "Support"];
const statuses = ["All", "active", "training", "on_leave", "inactive"];
const roles = [
  "All",
  "Branch Manager",
  "Senior Rental Agent",
  "Customer Service Representative",
  "Fleet Coordinator",
  "Rental Agent",
  "Insurance Specialist",
];

export default function VehicleRentalUserManagement() {
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

  const filteredData = rentalEmployees.filter((employee) => {
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
    total: rentalEmployees.length,
    active: rentalEmployees.filter((e) => e.status === "active").length,
    training: rentalEmployees.filter((e) => e.status === "training").length,
    departments: [...new Set(rentalEmployees.map((e) => e.department))].length,
    averageRating: (
      rentalEmployees.filter((e) => e.customerRating > 0).reduce((sum, e) => sum + e.customerRating, 0) /
      rentalEmployees.filter((e) => e.customerRating > 0).length
    ).toFixed(1),
    totalRentals: rentalEmployees.reduce((sum, e) => sum + e.rentalsProcessed, 0),
    monthlyRevenue: rentalEmployees.reduce((sum, e) => sum + e.monthlyRevenue, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Rental Business</h1>
          <p className="text-muted-foreground">Manage rental agents, customer service, and support staff</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <EmployeeRegistrationForm businessSector="vehicle-rental" />
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
            <p className="text-xs text-muted-foreground">Rental business staff</p>
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
            <p className="text-xs text-muted-foreground">Business areas</p>
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
            <CardTitle className="text-sm font-medium">Rentals</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalRentals}</div>
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

      {/* Branch Performance */}
      <div className="grid gap-4 md:grid-cols-3">
        {["Downtown Branch", "Airport Branch", "Central Fleet Office"].map((branch) => {
          const branchEmployees = rentalEmployees.filter((e) => e.location === branch);
          const avgRating =
            branchEmployees
              .filter((e) => e.customerRating > 0)
              .reduce((sum, e) => sum + e.customerRating, 0) /
              branchEmployees.filter((e) => e.customerRating > 0).length || 0;
          const monthlyRevenue = branchEmployees.reduce((sum, e) => sum + e.monthlyRevenue, 0);
          const totalRentals = branchEmployees.reduce((sum, e) => sum + e.rentalsProcessed, 0);

          return (
            <Card key={branch}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{branch}</CardTitle>
                <MapPin className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branchEmployees.length}</div>
                <div className="text-xs text-muted-foreground">
                  {branchEmployees.filter((e) => e.status === "active").length} active
                </div>
                {avgRating > 0 && (
                  <div className="text-xs text-blue-600 mt-1">{avgRating.toFixed(1)} avg rating</div>
                )}
                {totalRentals > 0 && <div className="text-xs text-purple-600">{totalRentals} rentals</div>}
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
          <CardTitle>Vehicle Rental Employees</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {rentalEmployees.length} employees
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
                <TableHead>Business Stats</TableHead>
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
                      {employee.customerRating > 0 ? (
                        <>
                          <div className={`font-semibold ${getPerformanceColor(employee.customerRating)}`}>
                            {employee.customerRating}/5.0
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
                      {employee.rentalsProcessed > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{employee.rentalsProcessed}</span> rentals
                        </div>
                      )}
                      {employee.monthlyRevenue > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">${(employee.monthlyRevenue / 1000).toFixed(0)}K</span>{" "}
                          revenue
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
