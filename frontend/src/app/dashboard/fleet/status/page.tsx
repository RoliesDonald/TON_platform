"use client";

import { useEffect, useState } from "react";
import {
  Car,
  CheckCircle,
  AlertCircle,
  Settings,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  Fuel,
  Calendar,
  Activity,
  Battery,
  Wrench,
  Navigation,
  MoreVertical,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleStatus {
  id: string;
  vehicleId: string;
  make: string;
  model: string;
  licensePlate: string;
  status: "active" | "idle" | "maintenance" | "out_of_service" | "traveling";
  location: string;
  driver: string;
  lastUpdate: string;
  fuelLevel: number;
  engineStatus: "normal" | "warning" | "error";
  batteryLevel?: number;
  mileage: number;
  speed?: number;
  heading?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface FleetOverview {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  maintenanceVehicles: number;
  outOfServiceVehicles: number;
  travelingVehicles: number;
  averageFuelLevel: number;
  vehiclesNeedingService: number;
  vehiclesWithIssues: number;
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  idle: { label: "Idle", color: "bg-blue-100 text-blue-800", icon: Clock },
  maintenance: { label: "Maintenance", color: "bg-yellow-100 text-yellow-800", icon: Settings },
  out_of_service: { label: "Out of Service", color: "bg-red-100 text-red-800", icon: AlertCircle },
  traveling: { label: "Traveling", color: "bg-purple-100 text-purple-800", icon: Navigation },
};

const engineStatusConfig = {
  normal: { label: "Normal", color: "bg-green-100 text-green-800" },
  warning: { label: "Warning", color: "bg-yellow-100 text-yellow-800" },
  error: { label: "Error", color: "bg-red-100 text-red-800" },
};

export default function FleetStatusPage() {
  const [loading, setLoading] = useState(true);
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [fleetOverview, setFleetOverview] = useState<FleetOverview | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  useEffect(() => {
    fetchFleetStatus();
    const interval = setInterval(fetchFleetStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFleetStatus = async () => {
    try {
      // Mock fleet overview data
      const mockFleetOverview: FleetOverview = {
        totalVehicles: 156,
        activeVehicles: 89,
        idleVehicles: 34,
        maintenanceVehicles: 12,
        outOfServiceVehicles: 8,
        travelingVehicles: 13,
        averageFuelLevel: 73,
        vehiclesNeedingService: 15,
        vehiclesWithIssues: 6,
      };

      // Mock vehicle status data
      const mockVehicleStatuses: VehicleStatus[] = [
        {
          id: "1",
          vehicleId: "1",
          make: "Toyota",
          model: "Camry",
          licensePlate: "ABC-1234",
          status: "active",
          location: "Main Office",
          driver: "John Smith",
          lastUpdate: "2024-01-23T10:30:00Z",
          fuelLevel: 85,
          engineStatus: "normal",
          mileage: 15420,
          batteryLevel: 95,
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        {
          id: "2",
          vehicleId: "2",
          make: "Ford",
          model: "F-150",
          licensePlate: "XYZ-5678",
          status: "traveling",
          location: "Route 95 North",
          driver: "Mike Johnson",
          lastUpdate: "2024-01-23T10:28:00Z",
          fuelLevel: 62,
          engineStatus: "normal",
          mileage: 8932,
          speed: 65,
          heading: 0,
          coordinates: { lat: 40.758, lng: -73.9855 },
        },
        {
          id: "3",
          vehicleId: "3",
          make: "Tesla",
          model: "Model 3",
          licensePlate: "EV-9012",
          status: "maintenance",
          location: "Service Center",
          driver: "Sarah Davis",
          lastUpdate: "2024-01-23T09:15:00Z",
          fuelLevel: 100,
          engineStatus: "normal",
          mileage: 12340,
          batteryLevel: 78,
        },
        {
          id: "4",
          vehicleId: "4",
          make: "Ford",
          model: "Transit",
          licensePlate: "TRK-3456",
          status: "active",
          location: "Warehouse A",
          driver: "Robert Wilson",
          lastUpdate: "2024-01-23T10:25:00Z",
          fuelLevel: 45,
          engineStatus: "warning",
          mileage: 45670,
          coordinates: { lat: 40.7589, lng: -73.9851 },
        },
        {
          id: "5",
          vehicleId: "5",
          make: "Toyota",
          model: "Prius",
          licensePlate: "PRI-7890",
          status: "idle",
          location: "Regional Office",
          driver: "Emily Brown",
          lastUpdate: "2024-01-23T10:20:00Z",
          fuelLevel: 71,
          engineStatus: "normal",
          mileage: 28940,
          batteryLevel: 88,
        },
        {
          id: "6",
          vehicleId: "6",
          make: "Honda",
          model: "Civic",
          licensePlate: "HON-6789",
          status: "traveling",
          location: "Highway 101",
          driver: "David Martinez",
          lastUpdate: "2024-01-23T10:27:00Z",
          fuelLevel: 38,
          engineStatus: "normal",
          mileage: 7654,
          speed: 72,
          heading: 270,
          coordinates: { lat: 34.0522, lng: -118.2437 },
        },
        {
          id: "7",
          vehicleId: "7",
          make: "BMW",
          model: "X5",
          licensePlate: "BMW-0123",
          status: "active",
          location: "Executive Office",
          driver: "Jennifer Taylor",
          lastUpdate: "2024-01-23T10:29:00Z",
          fuelLevel: 91,
          engineStatus: "normal",
          mileage: 19876,
          coordinates: { lat: 37.7749, lng: -122.4194 },
        },
        {
          id: "8",
          vehicleId: "8",
          make: "Mercedes",
          model: "Sprinter",
          licensePlate: "MER-4567",
          status: "out_of_service",
          location: "Maintenance Yard",
          driver: "Unassigned",
          lastUpdate: "2024-01-23T08:45:00Z",
          fuelLevel: 15,
          engineStatus: "error",
          mileage: 78230,
        },
      ];

      setTimeout(() => {
        setFleetOverview(mockFleetOverview);
        setVehicleStatuses(mockVehicleStatuses);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch fleet status:", error);
      setLoading(false);
    }
  };

  const filteredVehicles = vehicleStatuses.filter((vehicle) => {
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesLocation = locationFilter === "all" || vehicle.location === locationFilter;
    return matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: VehicleStatus["status"]) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getEngineStatusBadge = (status: VehicleStatus["engineStatus"]) => {
    const config = engineStatusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getFuelIcon = (level: number) => {
    if (level > 75) return <Fuel className="h-4 w-4 text-green-500" />;
    if (level > 50) return <Fuel className="h-4 w-4 text-yellow-500" />;
    if (level > 25) return <Fuel className="h-4 w-4 text-orange-500" />;
    return <Fuel className="h-4 w-4 text-red-500" />;
  };

  const uniqueLocations = Array.from(new Set(vehicleStatuses.map((v) => v.location)));

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Status</h1>
          <p className="text-muted-foreground">Real-time fleet status and vehicle tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Skeleton key={i} className="h-20 w-full" />
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
      <div>
        <h1 className="text-3xl font-bold">Vehicle Status</h1>
        <p className="text-muted-foreground">Real-time fleet status and vehicle tracking</p>
      </div>

      {/* Fleet Overview */}
      {fleetOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Total Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetOverview.totalVehicles}</div>
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
              <div className="text-2xl font-bold text-green-600">{fleetOverview.activeVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((fleetOverview.activeVehicles / fleetOverview.totalVehicles) * 100)}% of fleet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Navigation className="h-4 w-4 text-purple-500" />
                Traveling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{fleetOverview.travelingVehicles}</div>
              <p className="text-xs text-muted-foreground">Currently on route</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-yellow-500" />
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{fleetOverview.maintenanceVehicles}</div>
              <p className="text-xs text-muted-foreground">Being serviced</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Fuel Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Fuel Level</span>
                <span className="text-lg font-bold">{fleetOverview?.averageFuelLevel}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${fleetOverview?.averageFuelLevel}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {vehicleStatuses.filter((v) => v.fuelLevel < 25).length} vehicles need fuel
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Service Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Need Service</span>
                <span className="text-lg font-bold text-yellow-600">
                  {fleetOverview?.vehiclesNeedingService}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Have Issues</span>
                <span className="text-lg font-bold text-red-600">{fleetOverview?.vehiclesWithIssues}</span>
              </div>
              <div className="text-xs text-gray-500">
                {vehicleStatuses.filter((v) => v.engineStatus !== "normal").length} with engine warnings
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Driver Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Assigned Drivers</span>
                <span className="text-lg font-bold">
                  {vehicleStatuses.filter((v) => v.driver !== "Unassigned").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available</span>
                <span className="text-lg font-bold text-green-600">{fleetOverview?.idleVehicles}</span>
              </div>
              <div className="text-xs text-gray-500">
                {vehicleStatuses.filter((v) => v.driver === "Unassigned").length} vehicles unassigned
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Vehicle Status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Vehicle Status
              </CardTitle>
              <CardDescription>
                Real-time status of all fleet vehicles (Updates every 30 seconds)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="traveling">Traveling</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="content-evenly gap-4 grid grid-cols-2 sm:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <div className="font-medium text-lg">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.licensePlate} • {vehicle.mileage.toLocaleString()} mi
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      {getStatusBadge(vehicle.status)}
                      {getEngineStatusBadge(vehicle.engineStatus)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">{vehicle.location}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">{vehicle.driver}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getFuelIcon(vehicle.fuelLevel)}
                        <div>
                          <div className="text-sm font-medium">Fuel: {vehicle.fuelLevel}%</div>
                          {vehicle.batteryLevel !== undefined && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Battery className="h-3 w-3" />
                              Battery: {vehicle.batteryLevel}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {vehicle.status === "traveling" && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Navigation className="h-4 w-4 text-blue-500" />
                          Speed: {vehicle.speed} mph
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Heading: {vehicle.heading}°
                        </div>
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <MapPin className="mr-2 h-4 w-4" />
                        View on Map
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Car className="mr-2 h-4 w-4" />
                        Vehicle Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Contact Driver
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Schedule Maintenance
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
