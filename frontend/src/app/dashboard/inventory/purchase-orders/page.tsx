"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  Truck,
  FileText,
  Calendar,
  DollarSign
} from "lucide-react"

const purchaseOrdersData = [
  {
    id: "PO-2024-156",
    supplier: "AutoParts Direct",
    supplierId: "S001",
    orderDate: "2024-11-18",
    expectedDeliveryDate: "2024-11-23",
    actualDeliveryDate: null,
    status: "pending",
    priority: "normal",
    totalAmount: 2450.75,
    currency: "USD",
    paymentTerms: "Net 30",
    paymentStatus: "unpaid",
    items: [
      { partId: "P001", partName: "Brake Pads - Front", quantity: 25, unitPrice: 45.99, total: 1149.75 },
      { partId: "P004", partName: "Air Filter", quantity: 30, unitPrice: 18.25, total: 547.50 },
      { partId: "P007", partName: "Oil Filter", quantity: 50, unitPrice: 12.50, total: 625.00 },
      { partId: "P010", partName: "Spark Plug", quantity: 20, unitPrice: 8.75, total: 175.00 }
    ],
    totalItems: 4,
    totalQuantity: 125,
    requestedBy: "John Manager",
    approvedBy: "Jane Supervisor",
    notes: "Regular monthly stock replenishment",
    trackingNumber: null,
    shippingMethod: "Standard Ground",
    createdDate: "2024-11-18T09:30:00Z"
  },
  {
    id: "PO-2024-155",
    supplier: "QuickParts",
    supplierId: "S002",
    orderDate: "2024-11-17",
    expectedDeliveryDate: "2024-11-19",
    actualDeliveryDate: "2024-11-19",
    status: "completed",
    priority: "high",
    totalAmount: 1875.00,
    currency: "USD",
    paymentTerms: "Net 15",
    paymentStatus: "paid",
    items: [
      { partId: "P002", partName: "Oil Filter", quantity: 75, unitPrice: 12.50, total: 937.50 },
      { partId: "P005", partName: "Radiator Hose", quantity: 15, unitPrice: 32.50, total: 487.50 },
      { partId: "P011", partName: "Transmission Fluid", quantity: 25, unitPrice: 18.00, total: 450.00 }
    ],
    totalItems: 3,
    totalQuantity: 115,
    requestedBy: "Sarah Manager",
    approvedBy: "Mike Director",
    notes: "Urgent order for low stock items",
    trackingNumber: "TRK123456789",
    shippingMethod: "Express",
    createdDate: "2024-11-17T14:15:00Z"
  },
  {
    id: "PO-2024-154",
    supplier: "Global Auto Supplies",
    supplierId: "S003",
    orderDate: "2024-11-15",
    expectedDeliveryDate: "2024-11-25",
    actualDeliveryDate: null,
    status: "in-transit",
    priority: "normal",
    totalAmount: 5670.25,
    currency: "USD",
    paymentTerms: "Net 45",
    paymentStatus: "partial",
    items: [
      { partId: "P012", partName: "Engine Oil 5W-30", quantity: 100, unitPrice: 28.50, total: 2850.00 },
      { partId: "P013", partName: "Brake Rotors", quantity: 20, unitPrice: 89.99, total: 1799.80 },
      { partId: "P014", partName: "Shock Absorbers", quantity: 15, unitPrice: 68.03, total: 1020.45 }
    ],
    totalItems: 3,
    totalQuantity: 135,
    requestedBy: "Tom Manager",
    approvedBy: "Lisa VP",
    notes: "Bulk order for winter stock",
    trackingNumber: "TRK987654321",
    shippingMethod: "Freight",
    createdDate: "2024-11-15T11:00:00Z"
  },
  {
    id: "PO-2024-153",
    supplier: "Premium Parts Co",
    supplierId: "S004",
    orderDate: "2024-11-10",
    expectedDeliveryDate: "2024-11-17",
    actualDeliveryDate: "2024-11-17",
    status: "completed",
    priority: "normal",
    totalAmount: 3420.50,
    currency: "USD",
    paymentTerms: "Net 30",
    paymentStatus: "paid",
    items: [
      { partId: "P015", partName: "OEM Brake Pads", quantity: 30, unitPrice: 65.99, total: 1979.70 },
      { partId: "P016", partName: "Premium Oil Filter", quantity: 40, unitPrice: 18.25, total: 730.00 },
      { partId: "P017", partName: "Performance Spark Plugs", quantity: 25, unitPrice: 28.43, total: 710.75 }
    ],
    totalItems: 3,
    totalQuantity: 95,
    requestedBy: "David Manager",
    approvedBy: "Jennifer Director",
    notes: "OEM parts for premium service",
    trackingNumber: "TRK555666777",
    shippingMethod: "Standard Ground",
    createdDate: "2024-11-10T16:45:00Z"
  },
  {
    id: "PO-2024-152",
    supplier: "AutoParts Direct",
    supplierId: "S001",
    orderDate: "2024-11-08",
    expectedDeliveryDate: "2024-11-22",
    actualDeliveryDate: null,
    status: "pending",
    priority: "low",
    totalAmount: 1250.00,
    currency: "USD",
    paymentTerms: "Net 30",
    paymentStatus: "unpaid",
    items: [
      { partId: "P018", partName: "Wiper Blades", quantity: 50, unitPrice: 15.00, total: 750.00 },
      { partId: "P019", partName: "Headlight Bulbs", quantity: 40, unitPrice: 12.50, total: 500.00 }
    ],
    totalItems: 2,
    totalQuantity: 90,
    requestedBy: "Rachel Manager",
    approvedBy: "Steve Supervisor",
    notes: "Regular maintenance supplies",
    trackingNumber: null,
    shippingMethod: "Standard Ground",
    createdDate: "2024-11-08T10:30:00Z"
  }
]

const statuses = ["All", "pending", "approved", "in-transit", "completed", "cancelled"]
const priorities = ["All", "low", "normal", "high", "urgent"]
const paymentStatuses = ["All", "unpaid", "partial", "paid"]

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
      case "in-transit":
        return <Badge className="bg-purple-100 text-purple-800">In Transit</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "normal":
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
      case "unpaid":
        return <Badge variant="outline">Unpaid</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "in-transit":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredData = purchaseOrdersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus
    const matchesPriority = selectedPriority === "All" || order.priority === selectedPriority
    const matchesPaymentStatus = selectedPaymentStatus === "All" || order.paymentStatus === selectedPaymentStatus

    return matchesSearch && matchesStatus && matchesPriority && matchesPaymentStatus
  })

  const stats = {
    total: purchaseOrdersData.length,
    pending: purchaseOrdersData.filter(o => o.status === "pending").length,
    inTransit: purchaseOrdersData.filter(o => o.status === "in-transit").length,
    completed: purchaseOrdersData.filter(o => o.status === "completed").length,
    totalValue: purchaseOrdersData.reduce((sum, o) => sum + o.totalAmount, 0),
    unpaidAmount: purchaseOrdersData.filter(o => o.paymentStatus === "unpaid").reduce((sum, o) => sum + o.totalAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Track and manage purchase orders from creation to delivery
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All orders value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${stats.unpaidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by PO number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority === "All" ? "All Priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Payment Statuses" :
                     status === "unpaid" ? "Unpaid" :
                     status === "partial" ? "Partial" : "Paid"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders List</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {purchaseOrdersData.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.totalItems} items ({order.totalQuantity} units)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.supplier}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.paymentTerms} • {order.shippingMethod}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Ordered: {order.orderDate}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expected: {order.expectedDeliveryDate}
                      </div>
                      {order.actualDeliveryDate && (
                        <div className="text-xs text-green-600">
                          Delivered: {order.actualDeliveryDate}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">${order.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{order.currency}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(order.priority)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
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
                          View Details
                        </DropdownMenuItem>
                        {order.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Check className="h-4 w-4 mr-2" />
                              Approve Order
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === "in-transit" && order.trackingNumber && (
                          <DropdownMenuItem>
                            <Truck className="h-4 w-4 mr-2" />
                            Track Shipment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <X className="h-4 w-4 mr-2" />
                          Cancel Order
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
  )
}