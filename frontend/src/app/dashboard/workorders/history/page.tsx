"use client"

import { useState, useEffect } from "react"
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  User,
  Truck,
  FileText,
  Eye,
  Download,
  Search,
  MoreHorizontal,
  XCircle,
  DollarSign,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WorkOrderHistory {
  id: string
  workOrderNumber: string
  status: "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  title: string
  description: string
  customerName: string
  customerEmail: string
  vehicleInfo: {
    make: string
    model: string
    year: number
    licensePlate: string
    vin: string
  }
  assignedTechnician: string
  estimatedHours: number
  actualHours: number
  estimatedCost: number
  actualCost: number
  createdDate: string
  completedDate: string
  completionTime: string
  invoiceNumber?: string
  paymentStatus: "paid" | "pending" | "overdue"
  customerRating?: number
  customerFeedback?: string
  parts: Array<{
    name: string
    quantity: number
    unitCost: number
  }>
  laborItems: Array<{
    description: string
    hours: number
    rate: number
  }>
}

export default function WorkOrderHistoryPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrderHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchWorkOrderHistory()
  }, [])

  const fetchWorkOrderHistory = async () => {
    try {
      // Mock historical work orders data
      const mockHistory: WorkOrderHistory[] = [
        {
          id: "1",
          workOrderNumber: "WO-2024-089",
          status: "completed",
          priority: "high",
          title: "Transmission Repair",
          description: "Complete transmission overhaul and clutch replacement",
          customerName: "Michael Anderson",
          customerEmail: "michael.anderson@email.com",
          vehicleInfo: {
            make: "Ford",
            model: "Mustang",
            year: 2017,
            licensePlate: "MUS-123",
            vin: "1FA6P8CF0H5123456"
          },
          assignedTechnician: "Tom Wilson",
          estimatedHours: 8.0,
          actualHours: 9.5,
          estimatedCost: 2500.00,
          actualCost: 2650.00,
          createdDate: "2024-11-15T08:00:00Z",
          completedDate: "2024-11-18T16:30:00Z",
          completionTime: "3 days, 8.5 hours",
          invoiceNumber: "INV-2024-089",
          paymentStatus: "paid",
          customerRating: 5,
          customerFeedback: "Excellent service! The car runs like new again.",
          parts: [
            { name: "Transmission Rebuild Kit", quantity: 1, unitCost: 1200.00 },
            { name: "Clutch Kit", quantity: 1, unitCost: 450.00 }
          ],
          laborItems: [
            { description: "Transmission removal and installation", hours: 6.0, rate: 150.00 },
            { description: "Transmission rebuild", hours: 3.5, rate: 150.00 }
          ]
        },
        {
          id: "2",
          workOrderNumber: "WO-2024-088",
          status: "completed",
          priority: "medium",
          title: "Air Conditioning Repair",
          description: "AC system recharge and leak detection",
          customerName: "Jennifer Martinez",
          customerEmail: "jennifer.m@email.com",
          vehicleInfo: {
            make: "Honda",
            model: "Accord",
            year: 2019,
            licensePlate: "ACC-456",
            vin: "1HGCV1F3XKA123456"
          },
          assignedTechnician: "Mike Johnson",
          estimatedHours: 2.0,
          actualHours: 1.75,
          estimatedCost: 280.00,
          actualCost: 265.00,
          createdDate: "2024-11-14T09:00:00Z",
          completedDate: "2024-11-14T11:45:00Z",
          completionTime: "Same day, 1.75 hours",
          invoiceNumber: "INV-2024-088",
          paymentStatus: "paid",
          customerRating: 4,
          customerFeedback: "Great service, AC is working perfectly!",
          parts: [
            { name: "AC Recharge Kit", quantity: 1, unitCost: 45.00 },
            { name: "AC Oil", quantity: 1, unitCost: 15.00 }
          ],
          laborItems: [
            { description: "AC system diagnosis", hours: 1.0, rate: 120.00 },
            { description: "AC recharge and leak check", hours: 0.75, rate: 120.00 }
          ]
        },
        {
          id: "3",
          workOrderNumber: "WO-2024-087",
          status: "cancelled",
          priority: "urgent",
          title: "Engine Replacement",
          description: "Complete engine replacement due to catastrophic failure",
          customerName: "David Thompson",
          customerEmail: "david.thompson@email.com",
          vehicleInfo: {
            make: "Chevrolet",
            model: "Silverado",
            year: 2015,
            licensePlate: "SIL-789",
            vin: "1GCNKPEG0FA123456"
          },
          assignedTechnician: "Unassigned",
          estimatedHours: 20.0,
          actualHours: 0,
          estimatedCost: 8500.00,
          actualCost: 0,
          createdDate: "2024-11-12T10:00:00Z",
          completedDate: "2024-11-13T14:00:00Z",
          completionTime: "Cancelled after 1 day",
          invoiceNumber: undefined,
          paymentStatus: "pending",
          parts: [],
          laborItems: []
        },
        {
          id: "4",
          workOrderNumber: "WO-2024-086",
          status: "completed",
          priority: "low",
          title: "Battery Replacement",
          description: "Replace car battery and check charging system",
          customerName: "Sarah Williams",
          customerEmail: "sarah.w@email.com",
          vehicleInfo: {
            make: "Toyota",
            model: "Corolla",
            year: 2020,
            licensePlate: "COR-321",
            vin: "2T1BURHE8LC123456"
          },
          assignedTechnician: "Tom Wilson",
          estimatedHours: 0.5,
          actualHours: 0.5,
          estimatedCost: 200.00,
          actualCost: 195.00,
          createdDate: "2024-11-10T13:00:00Z",
          completedDate: "2024-11-10T13:30:00Z",
          completionTime: "30 minutes",
          invoiceNumber: "INV-2024-086",
          paymentStatus: "paid",
          customerRating: 5,
          parts: [
            { name: "Car Battery", quantity: 1, unitCost: 120.00 }
          ],
          laborItems: [
            { description: "Battery replacement", hours: 0.5, rate: 150.00 }
          ]
        },
        {
          id: "5",
          workOrderNumber: "WO-2024-085",
          status: "completed",
          priority: "medium",
          title: "Brake System Overhaul",
          description: "Complete brake system service including pads, rotors, and fluid flush",
          customerName: "Robert Johnson",
          customerEmail: "robert.j@email.com",
          vehicleInfo: {
            make: "Nissan",
            model: "Altima",
            year: 2018,
            licensePlate: "ALT-654",
            vin: "1N4AL3AP9JC123456"
          },
          assignedTechnician: "Mike Johnson",
          estimatedHours: 4.0,
          actualHours: 3.75,
          estimatedCost: 680.00,
          actualCost: 665.00,
          createdDate: "2024-11-08T08:30:00Z",
          completedDate: "2024-11-09T12:15:00Z",
          completionTime: "1 day, 3.75 hours",
          invoiceNumber: "INV-2024-085",
          paymentStatus: "overdue",
          customerRating: 4,
          customerFeedback: "Good work but took a bit longer than expected.",
          parts: [
            { name: "Front Brake Pads", quantity: 2, unitCost: 65.00 },
            { name: "Front Rotors", quantity: 2, unitCost: 85.00 },
            { name: "Rear Brake Pads", quantity: 2, unitCost: 55.00 },
            { name: "Brake Fluid", quantity: 1, unitCost: 25.00 }
          ],
          laborItems: [
            { description: "Brake pad replacement", hours: 2.0, rate: 125.00 },
            { description: "Rotor resurfacing", hours: 1.0, rate: 125.00 },
            { description: "Brake fluid flush", hours: 0.75, rate: 125.00 }
          ]
        }
      ]

      setTimeout(() => {
        setWorkOrders(mockHistory)
        setLoading(false)
      }, 1000)

    } catch (error) {
      console.error("Failed to fetch work order history:", error)
      setLoading(false)
    }
  }

  const getStatusIcon = (status: WorkOrderHistory['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: WorkOrderHistory['status']) => {
    switch (status) {
      case 'completed': return "bg-green-100 text-green-800 border-green-200"
      case 'cancelled': return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: WorkOrderHistory['priority']) => {
    switch (priority) {
      case 'urgent': return "bg-red-100 text-red-800 border-red-200"
      case 'high': return "bg-orange-100 text-orange-800 border-orange-200"
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'low': return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return "bg-green-100 text-green-800 border-green-200"
      case 'pending': return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'overdue': return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">Not rated</span>
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ))
  }

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = workOrder.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workOrder.vehicleInfo.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || workOrder.status === statusFilter
    const matchesPriority = priorityFilter === "all" || workOrder.priority === priorityFilter
    const matchesPayment = paymentFilter === "all" || workOrder.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesPayment
  })

  // Pagination
  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage)
  const paginatedWorkOrders = filteredWorkOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Work Order History</h1>
            <p className="text-muted-foreground">View completed and cancelled work orders</p>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
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
          <h1 className="text-3xl font-bold">Work Order History</h1>
          <p className="text-muted-foreground">View completed and cancelled work orders</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold">
                {workOrders.filter(wo => wo.status === 'completed').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <span className="text-2xl font-bold">
                {workOrders.filter(wo => wo.status === 'cancelled').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold">
                ${workOrders
                  .filter(wo => wo.status === 'completed')
                  .reduce((sum, wo) => sum + wo.actualCost, 0)
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-yellow-400 text-2xl">★★★★☆</div>
              <span className="text-2xl font-bold">4.2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by work order, customer, vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Work Orders ({filteredWorkOrders.length} total)</CardTitle>
          <CardDescription>
            Completed and cancelled work orders with full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWorkOrders.map((workOrder) => (
                  <TableRow key={workOrder.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{workOrder.workOrderNumber}</div>
                        <div className="text-sm text-gray-500">{workOrder.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {workOrder.invoiceNumber && `Invoice: ${workOrder.invoiceNumber}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workOrder.status)}
                        <Badge className={getStatusColor(workOrder.status)}>
                          {workOrder.status.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{workOrder.customerName}</div>
                        <div className="text-sm text-gray-500">{workOrder.customerEmail}</div>
                        <div className="text-xs text-gray-400">{workOrder.vehicleInfo.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{workOrder.vehicleInfo.make} {workOrder.vehicleInfo.model}</div>
                        <div className="text-gray-500">{workOrder.vehicleInfo.year}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {workOrder.assignedTechnician || "Unassigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{workOrder.actualHours}h</div>
                        <div className="text-gray-500">of {workOrder.estimatedHours}h</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">${workOrder.actualCost.toFixed(2)}</div>
                        <div className="text-gray-500">
                          ${workOrder.actualCost > workOrder.estimatedCost ? '+' : ''}{(workOrder.actualCost - workOrder.estimatedCost).toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentColor(workOrder.paymentStatus)}>
                        {workOrder.paymentStatus.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {renderStars(workOrder.customerRating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(workOrder.completedDate)}</div>
                        <div className="text-gray-500">{workOrder.completionTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {workOrder.invoiceNumber && (
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Wrench className="mr-2 h-4 w-4" />
                            Create Similar Work Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredWorkOrders.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            /* Pagination */
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredWorkOrders.length)} of {filteredWorkOrders.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}