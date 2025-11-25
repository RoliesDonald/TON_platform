"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, AlertCircle, CheckCircle, Clock, Fuel, Battery } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Vehicle {
  id: string
  plate_number: string
  vehicle_type: string
  driver_name?: string
  realtime_status: "active" | "idle" | "maintenance" | "offline"
  location?: {
    lat: number
    lng: number
    address?: string
  }
  last_update: string
  fuel_level?: number
  battery_status?: number
}

interface ApiResponse {
  success: boolean
  data: Vehicle[]
  message?: string
}

export default function TrackingDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    fetchVehicles()
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchVehicles, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchVehicles = async () => {
    try {
      setError(null)
      // This would call the actual API in production
      // const response = await fetch('/api/v1/vehicles/fleet-status')
      // const result: ApiResponse = await response.json()

      // Mock data for demonstration
      const mockVehicles: Vehicle[] = [
        {
          id: "1",
          plate_number: "ABC-123",
          vehicle_type: "Truck",
          driver_name: "John Smith",
          realtime_status: "active",
          location: {
            lat: 40.7128,
            lng: -74.0060,
            address: "123 Main St, New York, NY"
          },
          last_update: new Date().toISOString(),
          fuel_level: 75,
          battery_status: 90
        },
        {
          id: "2",
          plate_number: "XYZ-789",
          vehicle_type: "Van",
          driver_name: "Sarah Johnson",
          realtime_status: "idle",
          location: {
            lat: 40.7580,
            lng: -73.9855,
            address: "456 Park Ave, New York, NY"
          },
          last_update: new Date(Date.now() - 5 * 60000).toISOString(),
          fuel_level: 45,
          battery_status: 85
        },
        {
          id: "3",
          plate_number: "DEF-456",
          vehicle_type: "Truck",
          realtime_status: "maintenance",
          location: {
            lat: 40.7489,
            lng: -73.9680,
            address: "789 Service Center, Queens, NY"
          },
          last_update: new Date(Date.now() - 120 * 60000).toISOString(),
          fuel_level: 20,
          battery_status: 60
        },
        {
          id: "4",
          plate_number: "GHI-012",
          vehicle_type: "Delivery Van",
          driver_name: "Mike Wilson",
          realtime_status: "offline",
          last_update: new Date(Date.now() - 180 * 60000).toISOString(),
          fuel_level: 10,
          battery_status: 25
        }
      ]

      // Simulate API delay
      setTimeout(() => {
        setVehicles(mockVehicles)
        setLoading(false)
      }, 1000)

    } catch (err) {
      setError("Failed to fetch vehicle data. Please try again.")
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Vehicle['realtime_status']) => {
    switch (status) {
      case 'active':
        return <Navigation className="h-4 w-4 text-green-500" />
      case 'idle':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'offline':
        return <CheckCircle className="h-4 w-4 text-gray-400" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Vehicle['realtime_status']) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 border-green-200"
      case 'idle':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'maintenance':
        return "bg-orange-100 text-orange-800 border-orange-200"
      case 'offline':
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatLastUpdate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.realtime_status] = (acc[vehicle.realtime_status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vehicle Tracking</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Tracking</h1>
          <p className="text-muted-foreground">Real-time fleet monitoring and management</p>
        </div>
        <Button onClick={fetchVehicles} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Navigation className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold">{statusCounts.active || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Idle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <span className="text-3xl font-bold">{statusCounts.idle || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-600">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <span className="text-3xl font-bold">{statusCounts.maintenance || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-gray-400" />
              <span className="text-3xl font-bold">{statusCounts.offline || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">
                <strong>Map Component Placeholder</strong><br />
                Integration point for Leaflet/Google Maps<br />
                Display vehicle locations and routes
              </p>
              <Button variant="outline" className="mt-4" size="sm">
                Configure Map Integration
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedVehicle?.id === vehicle.id ? "bg-muted/50 border-primary" : ""
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{vehicle.plate_number}</h4>
                        <Badge variant="outline" className="text-xs">
                          {vehicle.vehicle_type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(vehicle.realtime_status)}
                        <Badge className={getStatusColor(vehicle.realtime_status)}>
                          {vehicle.realtime_status}
                        </Badge>
                      </div>

                      {vehicle.driver_name && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Driver: {vehicle.driver_name}
                        </p>
                      )}

                      {vehicle.location?.address && (
                        <p className="text-sm text-muted-foreground mb-2">
                          📍 {vehicle.location.address}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {vehicle.fuel_level !== undefined && (
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" />
                            {vehicle.fuel_level}%
                          </div>
                        )}
                        {vehicle.battery_status !== undefined && (
                          <div className="flex items-center gap-1">
                            <Battery className="h-3 w-3" />
                            {vehicle.battery_status}%
                          </div>
                        )}
                        <span>Updated {formatLastUpdate(vehicle.last_update)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details: {selectedVehicle.plate_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Status Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Status:</span>
                    <Badge className={getStatusColor(selectedVehicle.realtime_status)}>
                      {selectedVehicle.realtime_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span>{formatLastUpdate(selectedVehicle.last_update)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Location Information</h4>
                <div className="space-y-2 text-sm">
                  {selectedVehicle.location?.address && (
                    <div>
                      <span className="block text-muted-foreground">Address:</span>
                      {selectedVehicle.location.address}
                    </div>
                  )}
                  {selectedVehicle.location && (
                    <div className="flex justify-between">
                      <span>Coordinates:</span>
                      <span>{selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Vehicle Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vehicle Type:</span>
                    <span>{selectedVehicle.vehicle_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver:</span>
                    <span>{selectedVehicle.driver_name || "Not assigned"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}