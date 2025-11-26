"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Award,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  UserCheck,
  UserX,
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
import { Progress } from "@/components/ui/progress";

interface Mechanic {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: "active" | "on_leave" | "busy" | "available";
  department: string;
  hireDate: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  averageJobTime: number;
  efficiency: number;
  currentWorkload: number;
  maxWorkload: number;
  skills: string[];
  certifications: Array<{
    name: string;
    issuedBy: string;
    issueDate: string;
    expiryDate: string;
  }>;
  currentJobs: Array<{
    id: string;
    workOrderNumber: string;
    vehicle: string;
    status: string;
    estimatedCompletion: string;
  }>;
  schedule: Array<{
    date: string;
    shift: string;
    startTime: string;
    endTime: string;
  }>;
  location: {
    workshop: string;
    bay?: string;
  };
  performance: {
    monthlyJobs: number;
    customerSatisfaction: number;
    qualityScore: number;
    utilizationRate: number;
  };
}

const mockMechanics: Mechanic[] = [
  {
    id: "1",
    employeeId: "MECH-001",
    name: "Mike Johnson",
    email: "mike.johnson@workshop.com",
    phone: "+1234567890",
    specialization: "Engine Specialist",
    status: "active",
    department: "Engine Repair",
    hireDate: "2020-03-15",
    rating: 4.8,
    totalJobs: 450,
    completedJobs: 425,
    averageJobTime: 3.5,
    efficiency: 94,
    currentWorkload: 3,
    maxWorkload: 5,
    skills: ["Engine Diagnostics", "Engine Repair", "Transmission", "Oil Change", "Tune-ups"],
    certifications: [
      {
        name: "ASE Master Technician",
        issuedBy: "ASE",
        issueDate: "2021-01-15",
        expiryDate: "2024-01-15",
      },
      {
        name: "Engine Performance Specialist",
        issuedBy: "ASE",
        issueDate: "2022-06-10",
        expiryDate: "2025-06-10",
      },
    ],
    currentJobs: [
      {
        id: "1",
        workOrderNumber: "WO-2024-001",
        vehicle: "Toyota Camry - B-1234-ABC",
        status: "in_progress",
        estimatedCompletion: "2024-01-15T17:00:00Z",
      },
      {
        id: "2",
        workOrderNumber: "WO-2024-006",
        vehicle: "Honda Accord - G-3456-PQR",
        status: "pending",
        estimatedCompletion: "2024-01-16T10:00:00Z",
      },
    ],
    schedule: [
      {
        date: "2024-01-15",
        shift: "Day",
        startTime: "08:00",
        endTime: "17:00",
      },
      {
        date: "2024-01-16",
        shift: "Day",
        startTime: "08:00",
        endTime: "17:00",
      },
    ],
    location: {
      workshop: "Main Workshop",
      bay: "A-3",
    },
    performance: {
      monthlyJobs: 28,
      customerSatisfaction: 96,
      qualityScore: 92,
      utilizationRate: 75,
    },
  },
  {
    id: "2",
    employeeId: "MECH-002",
    name: "David Chen",
    email: "david.chen@workshop.com",
    phone: "+1234567891",
    specialization: "Brake Specialist",
    status: "active",
    department: "Brake & Suspension",
    hireDate: "2019-07-22",
    rating: 4.7,
    totalJobs: 380,
    completedJobs: 365,
    averageJobTime: 2.8,
    efficiency: 96,
    currentWorkload: 2,
    maxWorkload: 5,
    skills: ["Brake Repair", "Suspension", "Wheel Alignment", "Inspection"],
    certifications: [
      {
        name: "Brake System Specialist",
        issuedBy: "ASE",
        issueDate: "2020-03-10",
        expiryDate: "2023-03-10",
      },
      {
        name: "Suspension & Steering",
        issuedBy: "ASE",
        issueDate: "2021-09-15",
        expiryDate: "2024-09-15",
      },
    ],
    currentJobs: [
      {
        id: "3",
        workOrderNumber: "WO-2024-002",
        vehicle: "Honda CR-V - C-5678-DEF",
        status: "in_progress",
        estimatedCompletion: "2024-01-16T12:00:00Z",
      },
    ],
    schedule: [
      {
        date: "2024-01-15",
        shift: "Day",
        startTime: "08:00",
        endTime: "17:00",
      },
    ],
    location: {
      workshop: "Main Workshop",
      bay: "B-1",
    },
    performance: {
      monthlyJobs: 32,
      customerSatisfaction: 94,
      qualityScore: 89,
      utilizationRate: 80,
    },
  },
  {
    id: "3",
    employeeId: "MECH-003",
    name: "Tom Wilson",
    email: "tom.wilson@workshop.com",
    phone: "+1234567892",
    specialization: "General Maintenance",
    status: "on_leave",
    department: "General Service",
    hireDate: "2021-01-10",
    rating: 4.6,
    totalJobs: 280,
    completedJobs: 270,
    averageJobTime: 2.5,
    efficiency: 96,
    currentWorkload: 0,
    maxWorkload: 5,
    skills: ["Oil Change", "Filter Replacement", "Inspection", "Battery Service"],
    certifications: [
      {
        name: "Automotive Service Excellence",
        issuedBy: "ASE",
        issueDate: "2021-06-20",
        expiryDate: "2024-06-20",
      },
    ],
    currentJobs: [],
    schedule: [],
    location: {
      workshop: "Main Workshop",
      bay: "C-2",
    },
    performance: {
      monthlyJobs: 24,
      customerSatisfaction: 92,
      qualityScore: 88,
      utilizationRate: 60,
    },
  },
  {
    id: "4",
    employeeId: "MECH-004",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@workshop.com",
    phone: "+1234567893",
    specialization: "Transmission Specialist",
    status: "available",
    department: "Transmission & Drivetrain",
    hireDate: "2018-11-05",
    rating: 4.9,
    totalJobs: 520,
    completedJobs: 510,
    averageJobTime: 4.2,
    efficiency: 98,
    currentWorkload: 1,
    maxWorkload: 5,
    skills: ["Transmission Repair", "Clutch", "Differential", "CV Joints"],
    certifications: [
      {
        name: "Transmission Specialist",
        issuedBy: "ASE",
        issueDate: "2019-04-15",
        expiryDate: "2022-04-15",
      },
      {
        name: "Drivetrain Expert",
        issuedBy: "ASE",
        issueDate: "2020-11-20",
        expiryDate: "2023-11-20",
      },
    ],
    currentJobs: [
      {
        id: "4",
        workOrderNumber: "WO-2024-004",
        vehicle: "Nissan Altima - E-3456-JKL",
        status: "in_progress",
        estimatedCompletion: "2024-01-16T15:00:00Z",
      },
    ],
    schedule: [
      {
        date: "2024-01-15",
        shift: "Day",
        startTime: "08:00",
        endTime: "17:00",
      },
    ],
    location: {
      workshop: "Main Workshop",
      bay: "D-1",
    },
    performance: {
      monthlyJobs: 30,
      customerSatisfaction: 98,
      qualityScore: 95,
      utilizationRate: 70,
    },
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "available":
      return "bg-blue-100 text-blue-800";
    case "busy":
      return "bg-orange-100 text-orange-800";
    case "on_leave":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <UserCheck className="h-4 w-4" />;
    case "available":
      return <UserPlus className="h-4 w-4" />;
    case "busy":
      return <Clock className="h-4 w-4" />;
    case "on_leave":
      return <UserX className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getWorkloadColor = (current: number, max: number) => {
  const percentage = (current / max) * 100;
  if (percentage >= 80) return "text-red-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-green-600";
};

const getRatingStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
  }

  return stars;
};

export default function WorkshopMechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>(mockMechanics);
  const [filteredMechanics, setFilteredMechanics] = useState<Mechanic[]>(mockMechanics);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

  useEffect(() => {
    let filtered = mechanics;

    if (searchTerm) {
      filtered = filtered.filter(
        (mechanic) =>
          mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mechanic.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mechanic.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mechanic.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((mechanic) => mechanic.status === statusFilter);
    }

    if (specializationFilter !== "all") {
      filtered = filtered.filter((mechanic) => mechanic.specialization === specializationFilter);
    }

    setFilteredMechanics(filtered);
  }, [mechanics, searchTerm, statusFilter, specializationFilter]);

  const stats = {
    total: mechanics.length,
    active: mechanics.filter((m) => m.status === "active").length,
    available: mechanics.filter((m) => m.status === "available").length,
    busy: mechanics.filter((m) => m.status === "busy").length,
    onLeave: mechanics.filter((m) => m.status === "on_leave").length,
    avgRating: (mechanics.reduce((sum, m) => sum + m.rating, 0) / mechanics.length).toFixed(1),
  };

  const specializations = Array.from(new Set(mechanics.map((m) => m.specialization)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mechanic Assignments</h1>
          <p className="text-muted-foreground">Manage workshop mechanics and their assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Mechanic
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Mechanics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.busy}</p>
                <p className="text-sm text-muted-foreground">Busy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.onLeave}</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
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
              placeholder="Search mechanics..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
        <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mechanics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mechanics List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mechanic</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMechanics.map((mechanic) => (
                <TableRow key={mechanic.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{mechanic.name}</div>
                      <div className="text-sm text-muted-foreground">{mechanic.employeeId}</div>
                      <div className="text-sm text-muted-foreground">{mechanic.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{mechanic.specialization}</div>
                      <div className="text-sm text-muted-foreground">{mechanic.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(mechanic.status)}
                      <Badge className={getStatusColor(mechanic.status)}>
                        {mechanic.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`font-medium ${getWorkloadColor(mechanic.currentWorkload, mechanic.maxWorkload)}`}>
                        {mechanic.currentWorkload}/{mechanic.maxWorkload}
                      </div>
                      <Progress
                        value={(mechanic.currentWorkload / mechanic.maxWorkload) * 100}
                        className="w-20 h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(mechanic.rating)}
                      <span className="text-sm text-muted-foreground ml-1">({mechanic.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm">{mechanic.efficiency}% efficiency</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mechanic.performance.monthlyJobs} jobs/month
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{mechanic.location.workshop}</div>
                        {mechanic.location.bay && (
                          <div className="text-xs text-muted-foreground">Bay {mechanic.location.bay}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
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
                              setSelectedMechanic(mechanic);
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
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{mechanic.name} - Mechanic Details</DialogTitle>
                          <DialogDescription>
                            Complete mechanic profile and performance information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedMechanic && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Basic Information</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">Employee ID:</span>
                                    <span>{mechanic.employeeId}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">Email:</span>
                                    <span>{mechanic.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{mechanic.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Hired: {new Date(mechanic.hireDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Wrench className="h-4 w-4" />
                                    <span>{mechanic.specialization}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Rating:</span>
                                    <div className="flex items-center space-x-1">
                                      {getRatingStars(mechanic.rating)}
                                      <span>({mechanic.rating})</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Efficiency:</span>
                                    <span>{mechanic.efficiency}%</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Total Jobs:</span>
                                    <span>{mechanic.totalJobs}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Completed:</span>
                                    <span>{mechanic.completedJobs}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Avg Job Time:</span>
                                    <span>{mechanic.averageJobTime}h</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Workload:</span>
                                    <span className={getWorkloadColor(mechanic.currentWorkload, mechanic.maxWorkload)}>
                                      {mechanic.currentWorkload}/{mechanic.maxWorkload}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Monthly Performance</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span>Monthly Jobs:</span>
                                    <span>{mechanic.performance.monthlyJobs}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Customer Satisfaction:</span>
                                    <span>{mechanic.performance.customerSatisfaction}%</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Quality Score:</span>
                                    <span>{mechanic.performance.qualityScore}%</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Utilization Rate:</span>
                                    <span>{mechanic.performance.utilizationRate}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Current Jobs & Schedule */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Current Jobs</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  {mechanic.currentJobs.length > 0 ? (
                                    <div className="space-y-3">
                                      {mechanic.currentJobs.map((job) => (
                                        <div key={job.id} className="border-l-2 border-blue-500 pl-3">
                                          <div className="font-medium">{job.workOrderNumber}</div>
                                          <div className="text-sm text-muted-foreground">{job.vehicle}</div>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                              {job.status.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                              Est: {new Date(job.estimatedCompletion).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">No current jobs assigned</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Schedule</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  {mechanic.schedule.length > 0 ? (
                                    <div className="space-y-2">
                                      {mechanic.schedule.map((shift, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span>{new Date(shift.date).toLocaleDateString()}</span>
                                          <span>{shift.shift} ({shift.startTime} - {shift.endTime})</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">No scheduled shifts</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Location</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{mechanic.location.workshop}</span>
                                  </div>
                                  {mechanic.location.bay && (
                                    <div>
                                      <span className="font-medium">Bay:</span> {mechanic.location.bay}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Skills & Certifications */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Skills</h4>
                                <div className="bg-muted p-3 rounded-lg">
                                  <div className="flex flex-wrap gap-2">
                                    {mechanic.skills.map((skill, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Certifications</h4>
                                <div className="bg-muted p-3 rounded-lg space-y-3">
                                  {mechanic.certifications.map((cert, index) => (
                                    <div key={index} className="border-l-2 border-green-500 pl-3">
                                      <div className="flex items-center space-x-2">
                                        <Award className="h-4 w-4 text-green-500" />
                                        <span className="font-medium">{cert.name}</span>
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Issued by: {cert.issuedBy}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Valid: {new Date(cert.issueDate).toLocaleDateString()} - {new Date(cert.expiryDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                  ))}
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