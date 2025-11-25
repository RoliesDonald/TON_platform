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
  Download,
  Send,
  FileText,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"

const invoicesData = [
  {
    id: "INV-2024-156",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    issueDate: "2024-11-18",
    dueDate: "2024-12-18",
    status: "paid",
    paymentStatus: "paid",
    totalAmount: 1250.00,
    currency: "USD",
    taxAmount: 125.00,
    subtotal: 1125.00,
    items: [
      { description: "Brake Pad Replacement", quantity: 2, unitPrice: 450.00, total: 900.00 },
      { description: "Oil Change Service", quantity: 1, unitPrice: 225.00, total: 225.00 }
    ],
    notes: "Standard brake service with premium pads",
    paymentMethod: "Credit Card",
    paidDate: "2024-11-20",
    sentDate: "2024-11-18",
    createdDate: "2024-11-18T10:30:00Z"
  },
  {
    id: "INV-2024-155",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    issueDate: "2024-11-15",
    dueDate: "2024-12-15",
    status: "sent",
    paymentStatus: "unpaid",
    totalAmount: 875.50,
    currency: "USD",
    taxAmount: 79.59,
    subtotal: 795.91,
    items: [
      { description: "Tire Rotation", quantity: 1, unitPrice: 75.00, total: 75.00 },
      { description: "Wheel Alignment", quantity: 1, unitPrice: 120.00, total: 120.00 },
      { description: "Air Filter Replacement", quantity: 1, unitPrice: 45.00, total: 45.00 }
    ],
    notes: "Regular maintenance service",
    paymentMethod: null,
    paidDate: null,
    sentDate: "2024-11-15",
    createdDate: "2024-11-15T14:20:00Z"
  },
  {
    id: "INV-2024-154",
    customerName: "Mike Davis",
    customerEmail: "mike.davis@email.com",
    issueDate: "2024-11-10",
    dueDate: "2024-12-10",
    status: "overdue",
    paymentStatus: "unpaid",
    totalAmount: 2450.75,
    currency: "USD",
    taxAmount: 222.80,
    subtotal: 2227.95,
    items: [
      { description: "Transmission Service", quantity: 1, unitPrice: 1800.00, total: 1800.00 },
      { description: "Coolant Flush", quantity: 1, unitPrice: 150.00, total: 150.00 },
      { description: "Spark Plug Replacement", quantity: 4, unitPrice: 25.00, total: 100.00 }
    ],
    notes: "Major transmission service",
    paymentMethod: null,
    paidDate: null,
    sentDate: "2024-11-10",
    createdDate: "2024-11-10T09:15:00Z"
  },
  {
    id: "INV-2024-153",
    customerName: "Emily Wilson",
    customerEmail: "emily.w@email.com",
    issueDate: "2024-11-08",
    dueDate: "2024-12-08",
    status: "draft",
    paymentStatus: "unpaid",
    totalAmount: 567.25,
    currency: "USD",
    taxAmount: 51.57,
    subtotal: 515.68,
    items: [
      { description: "Battery Replacement", quantity: 1, unitPrice: 280.00, total: 280.00 },
      { description: "Diagnostic Fee", quantity: 1, unitPrice: 120.00, total: 120.00 }
    ],
    notes: "Battery replacement and diagnostic",
    paymentMethod: null,
    paidDate: null,
    sentDate: null,
    createdDate: "2024-11-08T16:45:00Z"
  },
  {
    id: "INV-2024-152",
    customerName: "Robert Brown",
    customerEmail: "r.brown@email.com",
    issueDate: "2024-11-05",
    dueDate: "2024-12-05",
    status: "sent",
    paymentStatus: "partial",
    totalAmount: 3680.00,
    currency: "USD",
    taxAmount: 334.55,
    subtotal: 3345.45,
    items: [
      { description: "Engine Oil Change", quantity: 1, unitPrice: 85.00, total: 85.00 },
      { description: "Brake Fluid Flush", quantity: 1, unitPrice: 150.00, total: 150.00 },
      { description: "Complete Brake Service", quantity: 1, unitPrice: 2500.00, total: 2500.00 }
    ],
    notes: "Complete brake system service",
    paymentMethod: "Bank Transfer",
    paidDate: null,
    sentDate: "2024-11-05",
    createdDate: "2024-11-05T11:30:00Z"
  }
]

const statuses = ["All", "draft", "sent", "paid", "overdue", "cancelled"]
const paymentStatuses = ["All", "unpaid", "partial", "paid"]

export default function AllInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
      case "draft":
        return <FileText className="h-4 w-4 text-gray-600" />
      case "sent":
        return <Send className="h-4 w-4 text-blue-600" />
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <X className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredData = invoicesData.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || invoice.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "All" || invoice.paymentStatus === selectedPaymentStatus

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const stats = {
    total: invoicesData.length,
    draft: invoicesData.filter(i => i.status === "draft").length,
    sent: invoicesData.filter(i => i.status === "sent").length,
    paid: invoicesData.filter(i => i.status === "paid").length,
    overdue: invoicesData.filter(i => i.status === "overdue").length,
    totalRevenue: invoicesData.filter(i => i.paymentStatus === "paid").reduce((sum, i) => sum + i.totalAmount, 0),
    outstandingAmount: invoicesData.filter(i => i.paymentStatus === "unpaid" || i.paymentStatus === "partial").reduce((sum, i) => sum + i.totalAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track all customer invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Not sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${stats.outstandingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">To be collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices by number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
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
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Payment" :
                     status === "unpaid" ? "Unpaid" :
                     status === "partial" ? "Partial" : "Paid"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices List</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {invoicesData.length} invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(invoice.status)}
                      <div>
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.items.length} items
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.customerName}</div>
                      <div className="text-sm text-muted-foreground">{invoice.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Issued: {invoice.issueDate}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: {invoice.dueDate}
                      </div>
                      {invoice.paidDate && (
                        <div className="text-xs text-green-600">
                          Paid: {invoice.paidDate}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">${invoice.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{invoice.currency}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(invoice.paymentStatus)}
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
                          View Invoice
                        </DropdownMenuItem>
                        {invoice.status === "draft" && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Invoice
                          </DropdownMenuItem>
                        )}
                        {invoice.status === "draft" && (
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Customer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Invoice
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