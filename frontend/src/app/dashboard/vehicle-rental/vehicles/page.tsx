"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, canViewAllVehicles, canRegisterVehicles } from "@/contexts/AuthContext";
import { VehicleRentalGuard } from "@/components/VehicleRentalGuard";
import { vehicleApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Truck,
  Calendar,
  MapPin,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  AlertTriangle,
} from "lucide-react";

interface Vehicle {
  id: string;
  vehicleId: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    category: "sedan" | "suv" | "truck" | "van" | "luxury";
    plateNumber: string;
    vin: string;
    color: string;
    mileage: number;
  };
  specifications: {
    engine: string;
    transmission: "automatic" | "manual";
    fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
    seats: number;
    doors: number;
    features: string[];
  };
  rental: {
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    deposit: number;
    currency: string;
    available: boolean;
    availableFrom?: string;
    location: string;
    minimumRentalDays: number;
  };
  status: "available" | "rented" | "maintenance" | "reserved" | "unavailable";
  lastMaintenance: string;
  nextMaintenance: string;
  rating: number;
  rentalCount: number;
  createdAt: string;
  lastUpdated: string;
}

// Vehicles will be loaded from API via loadVehicles function

export default function AvailableVehiclesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load vehicles based on user role and permissions
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);

        let response;

        if (canViewAllVehicles(user)) {
          // Admin/Manager can see all vehicles
          response = await vehicleApi.getVehicles();
        } else if (user?.companyId) {
          // Vehicle rental company can only see their own vehicles
          response = await vehicleApi.getVehiclesByCompany(user.companyId);
        } else {
          // Default to empty list for users without vehicle permissions
          response = { success: true, data: [], message: "No vehicles available" };
        }

        if (response.success && response.data) {
          setVehicles(response.data);
        }
      } catch (error) {
        console.error("Error loading vehicles:", error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadVehicles();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "reserved":
        return "bg-purple-100 text-purple-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "rented":
        return <Truck className="h-4 w-4" />;
      case "maintenance":
        return <Settings className="h-4 w-4" />;
      case "reserved":
        return <Clock className="h-4 w-4" />;
      case "unavailable":
        return <XCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sedan":
        return "🚗";
      case "suv":
        return "🚙";
      case "truck":
        return "🚚";
      case "van":
        return "🚐";
      case "luxury":
        return "🏎️";
      default:
        return "🚗";
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleInfo.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${vehicle.vehicleInfo.make} ${vehicle.vehicleInfo.model}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || vehicle.vehicleInfo.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    // For now, navigate to edit page (you can create an edit page later)
    router.push(`/dashboard/vehicle-rental/vehicles/${vehicle.id}/edit`);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!selectedVehicle) return;

    setIsDeleting(true);
    try {
      const response = await vehicleApi.deleteVehicle(selectedVehicle.id);

      if (response.success) {
        setActionMessage({ type: 'success', text: 'Vehicle deleted successfully' });
        // Reload vehicles list
        setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));
      } else {
        setActionMessage({ type: 'error', text: response.error || 'Failed to delete vehicle' });
      }
    } catch (error) {
      setActionMessage({ type: 'error', text: 'An error occurred while deleting the vehicle' });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedVehicle(null);

      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedVehicle(null);
  };

  // Check if user can edit/delete vehicles (only admins or vehicle owners)
  const canManageVehicle = (vehicle: Vehicle) => {
    if (!user) return false;
    if (canViewAllVehicles(user)) return true; // Admin/Manager can manage all
    return user.role === "vehicle_rental_company" && vehicle.companyId === user.companyId;
  };

  return (
    <VehicleRentalGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Available Vehicles</h1>
            <p className="text-muted-foreground">
              {canViewAllVehicles(user)
                ? "Manage and track all rental vehicles from partner companies"
                : "Manage your rental vehicle fleet"}
            </p>
          </div>
          {canRegisterVehicles(user) && (
            <Button onClick={() => router.push("/dashboard/vehicle-rental/vehicles/register")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
              <p className="text-xs text-muted-foreground">All vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {vehicles.filter((v) => v.status === "available").length}
              </div>
              <p className="text-xs text-muted-foreground">Ready for rent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rented</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {vehicles.filter((v) => v.status === "rented").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently rented</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Settings className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {vehicles.filter((v) => v.status === "maintenance").length}
              </div>
              <p className="text-xs text-muted-foreground">Under maintenance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <span className="text-2xl">⭐</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(vehicles.reduce((sum, v) => sum + v.rating, 0) / vehicles.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Customer rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by vehicle ID, company, plate, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="w-48">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Categories</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Fleet ({filteredVehicles.length})</CardTitle>
            <CardDescription>
              Comprehensive list of all rental vehicles and their availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                        Loading vehicles...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {canViewAllVehicles(user)
                          ? "No vehicles found in the system"
                          : "No vehicles found in your fleet"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.vehicleId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{vehicle.companyLogo}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{vehicle.companyName}</div>
                            <div className="text-sm text-muted-foreground">ID: {vehicle.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(vehicle.vehicleInfo.category)}</span>
                            <div>
                              <div className="font-medium">
                                {vehicle.vehicleInfo.year} {vehicle.vehicleInfo.make}{" "}
                                {vehicle.vehicleInfo.model}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {vehicle.vehicleInfo.plateNumber} • {vehicle.vehicleInfo.color} •{" "}
                                {vehicle.vehicleInfo.mileage.toLocaleString()} mi
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{vehicle.rental.location}</div>
                            {vehicle.rental.available && vehicle.rental.availableFrom && (
                              <div className="text-xs text-muted-foreground">
                                From {new Date(vehicle.rental.availableFrom).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${vehicle.rental.dailyRate} {vehicle.rental.currency}
                        <div className="text-sm text-muted-foreground">
                          Min {vehicle.rental.minimumRentalDays} days
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vehicle.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(vehicle.status)}
                            {vehicle.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-medium">{vehicle.rating}</span>
                          <div className="text-sm text-muted-foreground">({vehicle.rentalCount})</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewVehicle(vehicle)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canManageVehicle(vehicle) && (
                              <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Vehicle
                              </DropdownMenuItem>
                            )}
                            {canManageVehicle(vehicle) && <DropdownMenuSeparator />}
                            {canManageVehicle(vehicle) && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteVehicle(vehicle)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Vehicle
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Vehicle Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vehicle Details - {selectedVehicle?.vehicleId}</DialogTitle>
              <DialogDescription>Complete vehicle information and rental details</DialogDescription>
            </DialogHeader>
            {selectedVehicle && (
              <div className="space-y-6">
                {/* Company and Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Company Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{selectedVehicle.companyLogo}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedVehicle.companyName}</div>
                          <div className="text-sm text-muted-foreground">Vehicle Owner</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Basic Information</h3>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {selectedVehicle.vehicleInfo.year} {selectedVehicle.vehicleInfo.make}{" "}
                        {selectedVehicle.vehicleInfo.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Category:{" "}
                        {selectedVehicle.vehicleInfo.category.charAt(0).toUpperCase() +
                          selectedVehicle.vehicleInfo.category.slice(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Color: {selectedVehicle.vehicleInfo.color}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mileage: {selectedVehicle.vehicleInfo.mileage.toLocaleString()} miles
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Specifications */}
                <div>
                  <h3 className="font-semibold mb-3">Vehicle Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Engine</Label>
                      <div className="text-sm font-medium">{selectedVehicle.specifications.engine}</div>
                    </div>
                    <div>
                      <Label>Transmission</Label>
                      <div className="text-sm font-medium capitalize">
                        {selectedVehicle.specifications.transmission}
                      </div>
                    </div>
                    <div>
                      <Label>Fuel Type</Label>
                      <div className="text-sm font-medium capitalize">
                        {selectedVehicle.specifications.fuelType}
                      </div>
                    </div>
                    <div>
                      <Label>Seats</Label>
                      <div className="text-sm font-medium">{selectedVehicle.specifications.seats} seats</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Features</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedVehicle.specifications.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rental Information */}
                <div>
                  <h3 className="font-semibold mb-3">Rental Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Daily Rate</Label>
                      <div className="text-sm font-medium">
                        ${selectedVehicle.rental.dailyRate} {selectedVehicle.rental.currency}
                      </div>
                    </div>
                    <div>
                      <Label>Weekly Rate</Label>
                      <div className="text-sm font-medium">
                        ${selectedVehicle.rental.weeklyRate} {selectedVehicle.rental.currency}
                      </div>
                    </div>
                    <div>
                      <Label>Monthly Rate</Label>
                      <div className="text-sm font-medium">
                        ${selectedVehicle.rental.monthlyRate} {selectedVehicle.rental.currency}
                      </div>
                    </div>
                    <div>
                      <Label>Deposit</Label>
                      <div className="text-sm font-medium">
                        ${selectedVehicle.rental.deposit} {selectedVehicle.rental.currency}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Label>Location</Label>
                      <div className="text-sm font-medium">{selectedVehicle.rental.location}</div>
                    </div>
                    <div>
                      <Label>Minimum Rental</Label>
                      <div className="text-sm font-medium">
                        {selectedVehicle.rental.minimumRentalDays} days
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedVehicle.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(selectedVehicle.status)}
                          {selectedVehicle.status}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Maintenance Information */}
                <div>
                  <h3 className="font-semibold mb-3">Maintenance Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Last Maintenance</Label>
                      <div className="text-sm font-medium">
                        {new Date(selectedVehicle.lastMaintenance).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label>Next Maintenance</Label>
                      <div className="text-sm font-medium">
                        {new Date(selectedVehicle.nextMaintenance).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="font-semibold mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer Rating</Label>
                      <div className="text-sm font-medium">
                        ⭐ {selectedVehicle.rating}/5.0 ({selectedVehicle.rentalCount} rentals)
                      </div>
                    </div>
                    <div>
                      <Label>Vehicle Status</Label>
                      <div className="text-sm text-muted-foreground">
                        {selectedVehicle.rental.available && selectedVehicle.rental.availableFrom
                          ? `Available from ${new Date(
                              selectedVehicle.rental.availableFrom
                            ).toLocaleDateString()}`
                          : selectedVehicle.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Identification */}
                <div>
                  <h3 className="font-semibold mb-3">Vehicle Identification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>License Plate</Label>
                      <div className="text-sm font-medium">{selectedVehicle.vehicleInfo.plateNumber}</div>
                    </div>
                    <div>
                      <Label>VIN</Label>
                      <div className="text-sm font-medium">{selectedVehicle.vehicleInfo.vin}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              {selectedVehicle && canManageVehicle(selectedVehicle) && (
                <Button onClick={() => handleEditVehicle(selectedVehicle!)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Vehicle
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Vehicle Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this vehicle from the system? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedVehicle && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-red-900">{selectedVehicle.vehicleId}</h4>
                      <p className="text-sm text-red-700">
                        {selectedVehicle.vehicleInfo.year} {selectedVehicle.vehicleInfo.make} {selectedVehicle.vehicleInfo.model}
                      </p>
                      <p className="text-sm text-red-600">
                        {selectedVehicle.companyName} • {selectedVehicle.vehicleInfo.plateNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteVehicle}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Vehicle
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Message */}
        {actionMessage && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            actionMessage.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              {actionMessage.text}
            </div>
          </div>
        )}
      </div>
    </VehicleRentalGuard>
  );
}
