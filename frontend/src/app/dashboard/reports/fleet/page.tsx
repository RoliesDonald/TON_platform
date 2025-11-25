"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Car,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  MapPin,
  Gauge,
  Fuel,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Download,
  Calendar,
  Filter
} from "lucide-react"

const fleetPerformanceData = [
  {
    vehicleId: "VAN-001",
    vehicleName: "Ford Transit-250",
    driver: "John Smith",
    utilization: 94,
    mileage: 45678,
    fuelEfficiency: 12.5,
    status: "active",
    lastService: "2024-10-15",
    nextService: "2024-12-15",
    totalTrips: 156,
    onTimeRate: 96,
    downtime: 2.1,
    location: "Downtown District",
    revenue: 15420.50,
    costs: 3420.25
  },
  {
    vehicleId: "VAN-002",
    vehicleName: "Mercedes Sprinter",
    driver: "Sarah Johnson",
    utilization: 87,
    mileage: 38945,
    fuelEfficiency: 11.8,
    status: "active",
    lastService: "2024-10-20",
    nextService: "2024-12-20",
    totalTrips: 142,
    onTimeRate: 92,
    downtime: 3.5,
    location: "Industrial Zone",
    revenue: 13890.75,
    costs: 3156.50
  },
  {
    vehicleId: "VAN-003",
    vehicleName: "RAM ProMaster",
    driver: "Mike Davis",
    utilization: 98,
    mileage: 52134,
    fuelEfficiency: 13.2,
    status: "active",
    lastService: "2024-11-01",
    nextService: "2025-01-01",
    totalTrips: 189,
    onTimeRate: 99,
    downtime: 1.2,
    location: "Suburban Area",
    revenue: 18765.25,
    costs: 3890.75
  },
  {
    vehicleId: "VAN-004",
    vehicleName: "Chevrolet Express",
    driver: "Emily Wilson",
    utilization: 72,
    mileage: 28456,
    fuelEfficiency: 10.9,
    status: "maintenance",
    lastService: "2024-11-10",
    nextService: "2024-11-25",
    totalTrips: 98,
    onTimeRate: 85,
    downtime: 8.7,
    location: "Service Center",
    revenue: 9234.50,
    costs: 2789.00
  },
  {
    vehicleId: "TRUCK-001",
    vehicleName: "Isuzu NPR",
    driver: "Robert Brown",
    utilization: 91,
    mileage: 67890,
    fuelEfficiency: 9.5,
    status: "active",
    lastService: "2024-10-05",
    nextService: "2024-12-05",
    totalTrips: 167,
    onTimeRate: 94,
    downtime: 2.8,
    location: "Warehouse District",
    revenue: 22567.00,
    costs: 5234.75
  }
]

const timeRanges = ["Today", "This Week", "This Month", "Last Month", "This Quarter", "This Year"]
const vehicleTypes = ["All", "Van", "Truck", "Service Vehicle"]

export default function FleetPerformancePage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month")
  const [selectedVehicleType, setSelectedVehicleType] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-green-600"
    if (utilization >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceRating = (utilization: number, onTimeRate: number) => {
    const score = (utilization + onTimeRate) / 2
    if (score >= 95) return { rating: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 85) return { rating: "Good", color: "bg-blue-100 text-blue-800" }
    if (score >= 75) return { rating: "Average", color: "bg-yellow-100 text-yellow-800" }
    return { rating: "Poor", color: "bg-red-100 text-red-800" }
  }

  const filteredData = fleetPerformanceData.filter(vehicle => {
    const matchesType = selectedVehicleType === "All" ||
      (selectedVehicleType === "Van" && vehicle.vehicleId.startsWith("VAN")) ||
      (selectedVehicleType === "Truck" && vehicle.vehicleId.startsWith("TRUCK"))
    return matchesType
  })

  const stats = {
    total: filteredData.length,
    active: filteredData.filter(v => v.status === "active").length,
    averageUtilization: Math.round(filteredData.reduce((sum, v) => sum + v.utilization, 0) / filteredData.length),
    totalMileage: filteredData.reduce((sum, v) => sum + v.mileage, 0),
    averageFuelEfficiency: (filteredData.reduce((sum, v) => sum + v.fuelEfficiency, 0) / filteredData.length).toFixed(1),
    totalTrips: filteredData.reduce((sum, v) => sum + v.totalTrips, 0),
    totalRevenue: filteredData.reduce((sum, v) => sum + v.revenue, 0),
    totalCosts: filteredData.reduce((sum, v) => sum + v.costs, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fleet Performance</h1>
          <p className="text-muted-foreground">
            Analyze vehicle utilization, efficiency, and operational metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
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

      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active • {stats.total - stats.active} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(stats.averageUtilization)}`}>
              {stats.averageUtilization}%
            </div>
            <p className="text-xs text-muted-foreground">
              Fleet-wide average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrips.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Completed trips {selectedTimeRange.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(stats.totalRevenue - stats.totalCosts).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue minus operating costs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Fuel Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.averageFuelEfficiency}</div>
                <div className="text-sm text-muted-foreground">MPG average</div>
              </div>
              <div className="space-y-2">
                {filteredData
                  .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
                  .slice(0, 3)
                  .map((vehicle, index) => (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between text-sm">
                      <span>{vehicle.vehicleId}</span>
                      <span className="font-medium">{vehicle.fuelEfficiency} MPG</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              On-Time Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(filteredData.reduce((sum, v) => sum + v.onTimeRate, 0) / filteredData.length)}%
                </div>
                <div className="text-sm text-muted-foreground">On-time delivery rate</div>
              </div>
              <div className="space-y-2">
                {filteredData
                  .sort((a, b) => b.onTimeRate - a.onTimeRate)
                  .slice(0, 3)
                  .map((vehicle, index) => (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between text-sm">
                      <span>{vehicle.vehicleId}</span>
                      <span className="font-medium">{vehicle.onTimeRate}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Mileage Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{(stats.totalMileage / 1000).toFixed(1)}K</div>
                <div className="text-sm text-muted-foreground">Total miles {selectedTimeRange.toLowerCase()}</div>
              </div>
              <div className="space-y-2">
                {filteredData
                  .sort((a, b) => b.mileage - a.mileage)
                  .slice(0, 3)
                  .map((vehicle, index) => (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between text-sm">
                      <span>{vehicle.vehicleId}</span>
                      <span className="font-medium">{(vehicle.mileage / 1000).toFixed(1)}K mi</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Performance Details</CardTitle>
          <CardDescription>
            Individual vehicle metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Fuel Efficiency</TableHead>
                <TableHead>Trips</TableHead>
                <TableHead>On-Time Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((vehicle) => {
                const performance = getPerformanceRating(vehicle.utilization, vehicle.onTimeRate)
                return (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.vehicleId}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.vehicleName}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.driver}</div>
                        <div className="text-xs text-muted-foreground">
                          {(vehicle.mileage / 1000).toFixed(1)}K miles
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`font-medium ${getUtilizationColor(vehicle.utilization)}`}>
                          {vehicle.utilization}%
                        </div>
                        <Progress value={vehicle.utilization} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{vehicle.fuelEfficiency} MPG</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{vehicle.totalTrips}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${
                        vehicle.onTimeRate >= 95 ? 'text-green-600' :
                        vehicle.onTimeRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {vehicle.onTimeRate}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${vehicle.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          ${(vehicle.revenue - vehicle.costs).toFixed(0)} profit
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(vehicle.status)}
                        <Badge className={performance.color} variant="outline">
                          {performance.rating}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Operational Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Utilization Analysis</CardTitle>
            <CardDescription>Vehicle utilization distribution and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "90-100%", count: 2, color: "bg-green-500" },
                { range: "75-89%", count: 2, color: "bg-blue-500" },
                { range: "50-74%", count: 1, color: "bg-yellow-500" },
                { range: "0-49%", count: 0, color: "bg-red-500" }
              ].map((segment, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm">{segment.range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className={`${segment.color} h-4 rounded-full`}
                      style={{ width: `${(segment.count / filteredData.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm font-medium text-right">{segment.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Alerts</CardTitle>
            <CardDescription>Vehicles requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredData
                .filter(v => {
                  const daysUntilService = Math.ceil((new Date(v.nextService).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return daysUntilService <= 7
                })
                .map((vehicle) => {
                  const daysUntilService = Math.ceil((new Date(vehicle.nextService).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <div>
                          <div className="font-medium">{vehicle.vehicleId}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.vehicleName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          daysUntilService <= 0 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {daysUntilService <= 0 ? 'Overdue' : `${daysUntilService} days`}
                        </div>
                        <div className="text-xs text-muted-foreground">to service</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}