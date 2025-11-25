"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Fuel,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Vehicle {
  id: string;
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  type: "sedan" | "suv" | "truck" | "van" | "motorcycle" | "bus";
  status: "active" | "maintenance" | "out_of_service" | "retired";
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  currentMileage: number;
  lastServiceDate: string;
  nextServiceDate: string;
  assignedDriver: string;
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  insuranceExpiry: string;
  registrationExpiry: string;
}

const vehicleTypeMap = {
  sedan: { label: "Sedan", icon: Car },
  suv: { label: "SUV", icon: Car },
  truck: { label: "Truck", icon: Car },
  van: { label: "Van", icon: Car },
  motorcycle: { label: "Motorcycle", icon: Car },
  bus: { label: "Bus", icon: Car },
};

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  maintenance: { label: "Maintenance", color: "bg-yellow-100 text-yellow-800", icon: Settings },
  out_of_service: { label: "Out of Service", color: "bg-red-100 text-red-800", icon: AlertCircle },
  retired: { label: "Retired", color: "bg-gray-100 text-gray-800", icon: Clock },
};

const fuelTypeMap = {
  gasoline: { label: "Gasoline", color: "bg-blue-100 text-blue-800" },
  diesel: { label: "Diesel", color: "bg-orange-100 text-orange-800" },
  electric: { label: "Electric", color: "bg-green-100 text-green-800" },
  hybrid: { label: "Hybrid", color: "bg-purple-100 text-purple-800" },
};

export default function VehiclesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // Mock vehicle data
      const mockVehicles: Vehicle[] = [
        {
          id: "1",
          vin: "1HGBH41JXMN109186",
          licensePlate: "ABC-1234",
          make: "Toyota",
          model: "Camry",
          year: 2022,
          type: "sedan",
          status: "active",
          fuelType: "gasoline",
          currentMileage: 15420,
          lastServiceDate: "2024-01-15",
          nextServiceDate: "2024-04-15",
          assignedDriver: "John Smith",
          location: "Main Office",
          purchaseDate: "2022-03-01",
          purchasePrice: 25000,
          insuranceExpiry: "2024-12-31",
          registrationExpiry: "2024-06-30",
        },
        {
          id: "2",
          vin: "2FTRX18W1XCA12345",
          licensePlate: "XYZ-5678",
          make: "Ford",
          model: "F-150",
          year: 2023,
          type: "truck",
          status: "active",
          fuelType: "gasoline",
          currentMileage: 8932,
          lastServiceDate: "2024-02-01",
          nextServiceDate: "2024-05-01",
          assignedDriver: "Mike Johnson",
          location: "Warehouse",
          purchaseDate: "2023-01-15",
          purchasePrice: 45000,
          insuranceExpiry: "2025-01-31",
          registrationExpiry: "2024-09-30",
        },
        {
          id: "3",
          vin: "5YJ3E1EA7JF000005",
          licensePlate: "EV-9012",
          make: "Tesla",
          model: "Model 3",
          year: 2023,
          type: "sedan",
          status: "maintenance",
          fuelType: "electric",
          currentMileage: 12340,
          lastServiceDate: "2024-01-20",
          nextServiceDate: "2024-03-20",
          assignedDriver: "Sarah Davis",
          location: "Service Center",
          purchaseDate: "2023-06-01",
          purchasePrice: 55000,
          insuranceExpiry: "2024-11-30",
          registrationExpiry: "2024-07-31",
        },
        {
          id: "4",
          vin: "1FTSW21R88EB15724",
          licensePlate: "TRK-3456",
          make: "Ford",
          model: "Transit",
          year: 2021,
          type: "van",
          status: "active",
          fuelType: "diesel",
          currentMileage: 45670,
          lastServiceDate: "2024-01-10",
          nextServiceDate: "2024-04-10",
          assignedDriver: "Robert Wilson",
          location: "Delivery Route A",
          purchaseDate: "2021-08-15",
          purchasePrice: 35000,
          insuranceExpiry: "2024-10-15",
          registrationExpiry: "2024-08-31",
        },
        {
          id: "5",
          vin: "JTDKB20U993045678",
          licensePlate: "PRI-7890",
          make: "Toyota",
          model: "Prius",
          year: 2022,
          type: "sedan",
          status: "active",
          fuelType: "hybrid",
          currentMileage: 28940,
          lastServiceDate: "2024-01-25",
          nextServiceDate: "2024-04-25",
          assignedDriver: "Emily Brown",
          location: "Regional Office",
          purchaseDate: "2022-05-01",
          purchasePrice: 28000,
          insuranceExpiry: "2024-09-15",
          registrationExpiry: "2024-06-15",
        },
        {
          id: "6",
          vin: "4T1BF1FKXCU123456",
          licensePlate: "LEX-2345",
          make: "Lexus",
          model: "ES 350",
          year: 2020,
          type: "sedan",
          status: "out_of_service",
          fuelType: "gasoline",
          currentMileage: 67890,
          lastServiceDate: "2023-12-01",
          nextServiceDate: "2024-03-01",
          assignedDriver: "Unassigned",
          location: "Maintenance Yard",
          purchaseDate: "2020-03-01",
          purchasePrice: 42000,
          insuranceExpiry: "2024-08-31",
          registrationExpiry: "2024-05-31",
        },
        {
          id: "7",
          vin: "1HGCM82633A004352",
          licensePlate: "HON-6789",
          make: "Honda",
          model: "Civic",
          year: 2023,
          type: "sedan",
          status: "active",
          fuelType: "gasoline",
          currentMileage: 7654,
          lastServiceDate: "2024-02-10",
          nextServiceDate: "2024-05-10",
          assignedDriver: "David Martinez",
          location: "Sales Office",
          purchaseDate: "2023-04-01",
          purchasePrice: 24000,
          insuranceExpiry: "2025-02-28",
          registrationExpiry: "2024-10-31",
        },
        {
          id: "8",
          vin: "WBAJB1C50BC123456",
          licensePlate: "BMW-0123",
          make: "BMW",
          model: "X5",
          year: 2022,
          type: "suv",
          status: "active",
          fuelType: "gasoline",
          currentMileage: 19876,
          lastServiceDate: "2024-01-30",
          nextServiceDate: "2024-04-30",
          assignedDriver: "Jennifer Taylor",
          location: "Executive Office",
          purchaseDate: "2022-09-01",
          purchasePrice: 65000,
          insuranceExpiry: "2024-12-15",
          registrationExpiry: "2024-09-15",
        },
      ];

      setTimeout(() => {
        setVehicles(mockVehicles);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchTerm === "" ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const getStatusBadge = (status: Vehicle["status"]) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getFuelTypeBadge = (fuelType: Vehicle["fuelType"]) => {
    const config = fuelTypeMap[fuelType];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Vehicle List</h1>
            <p className="text-muted-foreground">Manage and view all fleet vehicles</p>
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
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
          <h1 className="text-3xl font-bold">Vehicle List</h1>
          <p className="text-muted-foreground">Manage and view all fleet vehicles</p>
        </div>
        <Button onClick={() => router.push("/dashboard/fleet/vehicles/register")}>
          <Plus className="mr-2 h-4 w-4" />
          Register Vehicle
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Car className="h-4 w-4" />
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">In fleet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter((v) => v.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-yellow-500" />
              In Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {vehicles.filter((v) => v.status === "maintenance").length}
            </div>
            <p className="text-xs text-muted-foreground">Being serviced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Out of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {vehicles.filter((v) => v.status === "out_of_service").length}
            </div>
            <p className="text-xs text-muted-foreground">Unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
          <CardDescription>
            Complete list of all vehicles in the fleet with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.licensePlate} • {vehicle.year}
                        </div>
                        <div className="text-xs text-gray-400">VIN: {vehicle.vin}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm">{vehicle.assignedDriver}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{vehicle.location}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{vehicle.currentMileage.toLocaleString()} mi</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(vehicle.nextServiceDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const daysUntilService = Math.ceil(
                            (new Date(vehicle.nextServiceDate).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          if (daysUntilService < 0) {
                            return <span className="text-red-500">Overdue</span>;
                          } else if (daysUntilService <= 7) {
                            return <span className="text-yellow-500">Due Soon</span>;
                          } else {
                            return <span className="text-green-500">{daysUntilService} days</span>;
                          }
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>{getFuelTypeBadge(vehicle.fuelType)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/fleet/vehicles/${vehicle.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/fleet/vehicles/${vehicle.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Vehicle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/fleet/vehicles/${vehicle.id}/maintenance`)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Schedule Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Vehicle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length}{" "}
                vehicles
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
