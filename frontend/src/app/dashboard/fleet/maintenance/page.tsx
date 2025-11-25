"use client"

import { useEffect, useState } from "react"
import {
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Plus,
  Filter,
  Search,
  Car,
  DollarSign,
  TrendingUp,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Flag
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface MaintenanceRecord {
  id: string
  vehicleId: string
  vehicleMake: string
  vehicleModel: string
  licensePlate: string
  maintenanceType: 'routine' | 'repair' | 'inspection' | 'emergency' | 'recall'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  scheduledDate: string
  estimatedCost: number
  actualCost: number
  duration: number // in hours
  technician: string
  serviceCenter: string
  mileageAtService: number
  partsUsed: string[]
  workOrderNumber?: string
  createdAt: string
  completedAt?: string
  nextMaintenanceDate?: string
}

interface MaintenanceStats {
  scheduledToday: number
  overdue: number
  inProgress: number
  completedThisMonth: number
  totalCostThisMonth: number
  upcomingThisWeek: number
}

const maintenanceTypeMap = {
  routine: { label: 'Routine Maintenance', color: 'bg-blue-100 text-blue-800' },
  repair: { label: 'Repair', color: 'bg-red-100 text-red-800' },
  inspection: { label: 'Inspection', color: 'bg-yellow-100 text-yellow-800' },
  emergency: { label: 'Emergency', color: 'bg-red-200 text-red-900' },
  recall: { label: 'Recall', color: 'bg-purple-100 text-purple-800' },
}

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Settings },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-800' },
}

export default function MaintenanceStatusPage() {
  const [loading, setLoading] = useState(true)
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchMaintenanceData()
  }, [])

  const fetchMaintenanceData = async () => {
    try {
      // Mock maintenance statistics
      const mockStats: MaintenanceStats = {
        scheduledToday: 8,
        overdue: 3,
        inProgress: 5,
        completedThisMonth: 24,
        totalCostThisMonth: 12450.75,
        upcomingThisWeek: 18
      }

      // Mock maintenance records
      const mockRecords: MaintenanceRecord[] = [
        {
          id: "1",
          vehicleId: "1",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          licensePlate: "ABC-1234",
          maintenanceType: "routine",
          status: "scheduled",
          priority: "medium",
          title: "Oil Change and Filter",
          description: "Regular oil change service with oil filter replacement",
          scheduledDate: "2024-01-24T09:00:00Z",
          estimatedCost: 65.00,
          actualCost: 0,
          duration: 1,
          technician: "John Smith",
          serviceCenter: "Main Service Center",
          mileageAtService: 15420,
          partsUsed: ["Engine Oil 5W-30", "Oil Filter"],
          workOrderNumber: "WO-2024-105",
          createdAt: "2024-01-20T10:30:00Z",
          nextMaintenanceDate: "2024-04-24T09:00:00Z"
        },
        {
          id: "2",
          vehicleId: "2",
          vehicleMake: "Ford",
          vehicleModel: "F-150",
          licensePlate: "XYZ-5678",
          maintenanceType: "repair",
          status: "in_progress",
          priority: "high",
          title: "Brake System Repair",
          description: "Replace front brake pads and resurface rotors",
          scheduledDate: "2024-01-23T10:00:00Z",
          estimatedCost: 450.00,
          actualCost: 0,
          duration: 3,
          technician: "Mike Johnson",
          serviceCenter: "Main Service Center",
          mileageAtService: 8932,
          partsUsed: ["Front Brake Pads", "Brake Fluid"],
          workOrderNumber: "WO-2024-106",
          createdAt: "2024-01-22T14:20:00Z"
        },
        {
          id: "3",
          vehicleId: "3",
          vehicleMake: "Tesla",
          vehicleModel: "Model 3",
          licensePlate: "EV-9012",
          maintenanceType: "inspection",
          status: "completed",
          priority: "low",
          title: "Annual Inspection",
          description: "Annual safety and emissions inspection",
          scheduledDate: "2024-01-20T08:00:00Z",
          estimatedCost: 150.00,
          actualCost: 145.50,
          duration: 2,
          technician: "Sarah Davis",
          serviceCenter: "Tesla Service Center",
          mileageAtService: 12340,
          partsUsed: [],
          workOrderNumber: "WO-2024-103",
          createdAt: "2024-01-15T11:45:00Z",
          completedAt: "2024-01-20T10:15:00Z",
          nextMaintenanceDate: "2025-01-20T08:00:00Z"
        },
        {
          id: "4",
          vehicleId: "4",
          vehicleMake: "Ford",
          vehicleModel: "Transit",
          licensePlate: "TRK-3456",
          maintenanceType: "emergency",
          status: "overdue",
          priority: "critical",
          title: "Transmission Fluid Leak",
          description: "Emergency repair for transmission fluid leak",
          scheduledDate: "2024-01-22T08:00:00Z",
          estimatedCost: 1200.00,
          actualCost: 0,
          duration: 6,
          technician: "Robert Wilson",
          serviceCenter: "Transmission Specialist",
          mileageAtService: 45670,
          partsUsed: ["Transmission Gasket Set", "Transmission Fluid"],
          workOrderNumber: "WO-2024-107",
          createdAt: "2024-01-21T09:30:00Z"
        },
        {
          id: "5",
          vehicleId: "5",
          vehicleMake: "Honda",
          vehicleModel: "Civic",
          licensePlate: "HON-6789",
          maintenanceType: "routine",
          status: "scheduled",
          priority: "low",
          title: "Tire Rotation",
          description: "Regular tire rotation and balance check",
          scheduledDate: "2024-01-25T14:00:00Z",
          estimatedCost: 45.00,
          actualCost: 0,
          duration: 1,
          technician: "Emily Brown",
          serviceCenter: "Quick Lube Center",
          mileageAtService: 7654,
          partsUsed: [],
          workOrderNumber: "WO-2024-108",
          createdAt: "2024-01-19T16:45:00Z",
          nextMaintenanceDate: "2024-04-25T14:00:00Z"
        },
        {
          id: "6",
          vehicleId: "6",
          vehicleMake: "BMW",
          vehicleModel: "X5",
          licensePlate: "BMW-0123",
          maintenanceType: "recall",
          status: "scheduled",
          priority: "high",
          title: "Airbag Recall Service",
          description: "Manufacturer recall for airbag replacement",
          scheduledDate: "2024-01-26T10:00:00Z",
          estimatedCost: 0,
          actualCost: 0,
          duration: 2,
          technician: "Jennifer Taylor",
          serviceCenter: "BMW Dealership",
          mileageAtService: 19876,
          partsUsed: ["Airbag Module", "Sensors"],
          workOrderNumber: "WO-2024-109",
          createdAt: "2024-01-18T13:20:00Z"
        }
      ]

      setTimeout(() => {
        setMaintenanceRecords(mockRecords)
        setMaintenanceStats(mockStats)
        setLoading(false)
      }, 1000)

    } catch (error) {
      console.error("Failed to fetch maintenance data:", error)
      setLoading(false)
    }
  }

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = searchTerm === "" ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.maintenanceType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const scheduledRecords = filteredRecords.filter(r => r.status === 'scheduled')
  const inProgressRecords = filteredRecords.filter(r => r.status === 'in_progress')
  const overdueRecords = filteredRecords.filter(r => r.status === 'overdue')
  const completedRecords = filteredRecords.filter(r => r.status === 'completed')

  const getStatusBadge = (status: MaintenanceRecord['status']) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: MaintenanceRecord['priority']) => {
    const config = priorityConfig[priority]
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: MaintenanceRecord['maintenanceType']) => {
    const config = maintenanceTypeMap[type]
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Status</h1>
          <p className="text-muted-foreground">Track and manage all vehicle maintenance activities</p>
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
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Status</h1>
          <p className="text-muted-foreground">Track and manage all vehicle maintenance activities</p>
        </div>
        <Button onClick={() => {/* TODO: Navigate to schedule maintenance */}}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Maintenance Statistics */}
      {maintenanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{maintenanceStats.scheduledToday}</div>
              <p className="text-xs text-muted-foreground">Maintenance appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{maintenanceStats.overdue}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-yellow-500" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{maintenanceStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Currently being serviced</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${maintenanceStats.totalCostThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {maintenanceStats.completedThisMonth} completed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduledRecords.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressRecords.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueRecords.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRecords.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Recent Maintenance Activity
              </CardTitle>
              <CardDescription>
                Latest maintenance records across all statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search maintenance records..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="recall">Recall</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Maintenance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.slice(0, 10).map((record) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {record.vehicleMake} {record.vehicleModel}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.licensePlate}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.title}</div>
                            <div className="text-sm text-gray-500">
                              {record.mileageAtService.toLocaleString()} mi
                            </div>
                            <div className="mt-1">
                              {getTypeBadge(record.maintenanceType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(record.status)}
                            <div className="mt-1">
                              {getPriorityBadge(record.priority)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(record.scheduledDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.scheduledDate).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{record.technician}</div>
                          <div className="text-xs text-gray-500">{record.serviceCenter}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            ${record.actualCost || record.estimatedCost}
                          </div>
                          {record.workOrderNumber && (
                            <div className="text-xs text-gray-500">
                              {record.workOrderNumber}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Work Order
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="mr-2 h-4 w-4" />
                                Report Issue
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>
                Upcoming maintenance appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          {getPriorityBadge(record.priority)}
                          {getTypeBadge(record.maintenanceType)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Vehicle:</span> {record.vehicleMake} {record.vehicleModel} ({record.licensePlate})
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(record.scheduledDate).toLocaleDateString()} at {new Date(record.scheduledDate).toLocaleTimeString()}
                          </div>
                          <div>
                            <span className="font-medium">Technician:</span> {record.technician}
                          </div>
                          <div>
                            <span className="font-medium">Service Center:</span> {record.serviceCenter}
                          </div>
                          <div>
                            <span className="font-medium">Est. Cost:</span> ${record.estimatedCost}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {record.duration} hours
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>Cancel</DropdownMenuItem>
                          <DropdownMenuItem>Add Notes</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* In Progress Tab */}
        <TabsContent value="in_progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currently In Progress</CardTitle>
              <CardDescription>
                Maintenance work currently being performed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          {getPriorityBadge(record.priority)}
                          <Badge className="bg-yellow-100 text-yellow-800 animate-pulse">
                            <Settings className="mr-1 h-3 w-3" />
                            In Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Vehicle:</span> {record.vehicleMake} {record.vehicleModel} ({record.licensePlate})
                          </div>
                          <div>
                            <span className="font-medium">Started:</span> {new Date(record.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Technician:</span> {record.technician}
                          </div>
                          <div>
                            <span className="font-medium">Service Center:</span> {record.serviceCenter}
                          </div>
                          <div>
                            <span className="font-medium">Work Order:</span> {record.workOrderNumber}
                          </div>
                          <div>
                            <span className="font-medium">Est. Completion:</span> {record.duration} hours
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                          <DropdownMenuItem>Update Progress</DropdownMenuItem>
                          <DropdownMenuItem>Add Parts</DropdownMenuItem>
                          <DropdownMenuItem>Contact Technician</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue Tab */}
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Maintenance</CardTitle>
              <CardDescription className="text-red-600">
                Critical maintenance that requires immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueRecords.map((record) => (
                  <div key={record.id} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Overdue
                          </Badge>
                          {getPriorityBadge(record.priority)}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{record.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Vehicle:</span> {record.vehicleMake} {record.vehicleModel} ({record.licensePlate})
                          </div>
                          <div>
                            <span className="font-medium">Was Due:</span> {new Date(record.scheduledDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Days Overdue:</span> {Math.ceil((new Date().getTime() - new Date(record.scheduledDate).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div>
                            <span className="font-medium">Technician:</span> {record.technician}
                          </div>
                          <div>
                            <span className="font-medium">Service Center:</span> {record.serviceCenter}
                          </div>
                          <div>
                            <span className="font-medium">Est. Cost:</span> ${record.estimatedCost}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Schedule Now
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Mark as Urgent</DropdownMenuItem>
                            <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                            <DropdownMenuItem>Postpone (Emergency)</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Maintenance</CardTitle>
              <CardDescription>
                Finished maintenance work and service records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          {getStatusBadge(record.status)}
                          {getTypeBadge(record.maintenanceType)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Vehicle:</span> {record.vehicleMake} {record.vehicleModel} ({record.licensePlate})
                          </div>
                          <div>
                            <span className="font-medium">Completed:</span> {record.completedAt ? new Date(record.completedAt).toLocaleDateString() : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Final Cost:</span> ${record.actualCost}
                          </div>
                          <div>
                            <span className="font-medium">Work Order:</span> {record.workOrderNumber}
                          </div>
                          <div>
                            <span className="font-medium">Technician:</span> {record.technician}
                          </div>
                          <div>
                            <span className="font-medium">Service Center:</span> {record.serviceCenter}
                          </div>
                          <div>
                            <span className="font-medium">Mileage:</span> {record.mileageAtService.toLocaleString()} mi
                          </div>
                          <div>
                            <span className="font-medium">Next Due:</span> {record.nextMaintenanceDate ? new Date(record.nextMaintenanceDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        {record.partsUsed.length > 0 && (
                          <div className="mt-3">
                            <span className="font-medium text-sm">Parts Used: </span>
                            <span className="text-sm text-gray-600">{record.partsUsed.join(', ')}</span>
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
                          <DropdownMenuItem>View Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Next Service</DropdownMenuItem>
                          <DropdownMenuItem>Leave Review</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}