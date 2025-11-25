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
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react"

const quotationsData = [
  {
    id: "QT-2024-034",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1-555-0101",
    issueDate: "2024-11-18",
    validUntil: "2024-12-18",
    status: "accepted",
    totalAmount: 2450.75,
    currency: "USD",
    taxAmount: 222.80,
    subtotal: 2227.95,
    items: [
      { description: "Complete Brake Service", quantity: 1, unitPrice: 1800.00, total: 1800.00 },
      { description: "Coolant Flush", quantity: 1, unitPrice: 150.00, total: 150.00 },
      { description: "Diagnostic Fee", quantity: 1, unitPrice: 120.00, total: 120.00 }
    ],
    notes: "Complete brake system overhaul with premium parts",
    acceptedDate: "2024-11-20",
    sentDate: "2024-11-18",
    createdDate: "2024-11-18T10:30:00Z",
    convertedToInvoice: "INV-2024-158",
    followUpDate: "2024-11-25"
  },
  {
    id: "QT-2024-033",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1-555-0102",
    issueDate: "2024-11-15",
    validUntil: "2024-12-15",
    status: "pending",
    totalAmount: 1250.00,
    currency: "USD",
    taxAmount: 113.64,
    subtotal: 1136.36,
    items: [
      { description: "Oil Change Service", quantity: 1, unitPrice: 75.00, total: 75.00 },
      { description: "Tire Rotation", quantity: 1, unitPrice: 60.00, total: 60.00 },
      { description: "Air Filter Replacement", quantity: 1, unitPrice: 45.00, total: 45.00 }
    ],
    notes: "Regular maintenance package",
    acceptedDate: null,
    sentDate: "2024-11-15",
    createdDate: "2024-11-15T14:20:00Z",
    convertedToInvoice: null,
    followUpDate: "2024-11-22"
  },
  {
    id: "QT-2024-032",
    customerName: "Mike Davis",
    customerEmail: "mike.davis@email.com",
    customerPhone: "+1-555-0103",
    issueDate: "2024-11-10",
    validUntil: "2024-12-10",
    status: "rejected",
    totalAmount: 3450.00,
    currency: "USD",
    taxAmount: 313.64,
    subtotal: 3136.36,
    items: [
      { description: "Transmission Service", quantity: 1, unitPrice: 2500.00, total: 2500.00 },
      { description: "Wheel Alignment", quantity: 1, unitPrice: 120.00, total: 120.00 },
      { description: "Complete Fluid Change", quantity: 1, unitPrice: 500.00, total: 500.00 }
    ],
    notes: "Major transmission service and maintenance",
    acceptedDate: null,
    sentDate: "2024-11-10",
    createdDate: "2024-11-10T09:15:00Z",
    convertedToInvoice: null,
    followUpDate: "2024-11-17",
    rejectionReason: "Price too high - customer found cheaper alternative"
  },
  {
    id: "QT-2024-031",
    customerName: "Emily Wilson",
    customerEmail: "emily.w@email.com",
    customerPhone: "+1-555-0104",
    issueDate: "2024-11-08",
    validUntil: "2024-11-30",
    status: "expired",
    totalAmount: 875.50,
    currency: "USD",
    taxAmount: 79.59,
    subtotal: 795.91,
    items: [
      { description: "Battery Replacement", quantity: 1, unitPrice: 280.00, total: 280.00 },
      { description: "Alternator Replacement", quantity: 1, unitPrice: 450.00, total: 450.00 },
      { description: "Diagnostic Fee", quantity: 1, unitPrice: 65.91, total: 65.91 }
    ],
    notes: "Electrical system repair",
    acceptedDate: null,
    sentDate: "2024-11-08",
    createdDate: "2024-11-08T16:45:00Z",
    convertedToInvoice: null,
    followUpDate: "2024-11-15"
  },
  {
    id: "QT-2024-030",
    customerName: "Robert Brown",
    customerEmail: "r.brown@email.com",
    customerPhone: "+1-555-0105",
    issueDate: "2024-11-05",
    validUntil: "2024-12-05",
    status: "draft",
    totalAmount: 567.25,
    currency: "USD",
    taxAmount: 51.57,
    subtotal: 515.68,
    items: [
      { description: "Oil Change Premium Package", quantity: 1, unitPrice: 125.00, total: 125.00 },
      { description: "Brake Inspection", quantity: 1, unitPrice: 85.00, total: 85.00 },
      { description: "Multi-point Inspection", quantity: 1, unitPrice: 75.00, total: 75.00 }
    ],
    notes: "Premium maintenance package proposal",
    acceptedDate: null,
    sentDate: null,
    createdDate: "2024-11-05T11:30:00Z",
    convertedToInvoice: null,
    followUpDate: null
  },
  {
    id: "QT-2024-029",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.a@email.com",
    customerPhone: "+1-555-0106",
    issueDate: "2024-11-01",
    validUntil: "2024-12-01",
    status: "pending",
    totalAmount: 1890.00,
    currency: "USD",
    taxAmount: 171.82,
    subtotal: 1718.18,
    items: [
      { description: "Premium Brake Package", quantity: 1, unitPrice: 1200.00, total: 1200.00 },
      { description: "Suspension Check", quantity: 1, unitPrice: 200.00, total: 200.00 },
      { description: "Wheel Alignment", quantity: 1, unitPrice: 120.00, total: 120.00 },
      { description: "Premium Tire Rotation", quantity: 1, unitPrice: 198.18, total: 198.18 }
    ],
    notes: "Premium service package with lifetime warranty parts",
    acceptedDate: null,
    sentDate: "2024-11-02",
    createdDate: "2024-11-01T13:20:00Z",
    convertedToInvoice: null,
    followUpDate: "2024-11-08"
  }
]

const statuses = ["All", "draft", "sent", "pending", "accepted", "rejected", "expired"]

export default function AllQuotationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>
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
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredData = quotationsData.filter(quotation => {
    const matchesSearch = quotation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerPhone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || quotation.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: quotationsData.length,
    draft: quotationsData.filter(q => q.status === "draft").length,
    sent: quotationsData.filter(q => q.status === "sent").length,
    pending: quotationsData.filter(q => q.status === "pending").length,
    accepted: quotationsData.filter(q => q.status === "accepted").length,
    rejected: quotationsData.filter(q => q.status === "rejected").length,
    expired: quotationsData.filter(q => q.status === "expired").length,
    totalValue: quotationsData.reduce((sum, q) => sum + q.totalAmount, 0),
    acceptedValue: quotationsData.filter(q => q.status === "accepted").reduce((sum, q) => sum + q.totalAmount, 0),
    conversionRate: quotationsData.filter(q => q.status !== "draft" && q.status !== "sent").length > 0
      ? (quotationsData.filter(q => q.status === "accepted").length /
         quotationsData.filter(q => q.status !== "draft" && q.status !== "sent").length * 100).toFixed(1)
      : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Quotations</h1>
          <p className="text-muted-foreground">
            Manage customer quotations and estimates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Quotation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All quotes</p>
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
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">Won quotes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All quotes value</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quotations Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.sent + stats.pending + stats.accepted + stats.rejected + stats.expired}
            </div>
            <p className="text-xs text-muted-foreground">Active quotes in pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Accepted Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.acceptedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalValue > 0 ? ((stats.acceptedValue / stats.totalValue) * 100).toFixed(1) : 0}% of total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${(stats.totalValue - stats.acceptedValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Pending opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotations by number, customer name, email, or phone..."
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
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotations List</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {quotationsData.length} quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(quotation.status)}
                      <div>
                        <div className="font-medium">{quotation.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {quotation.items.length} items
                        </div>
                        {quotation.convertedToInvoice && (
                          <div className="text-xs text-green-600">
                            → {quotation.convertedToInvoice}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quotation.customerName}</div>
                      <div className="text-sm text-muted-foreground">{quotation.customerEmail}</div>
                      <div className="text-xs text-muted-foreground">{quotation.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Issued: {quotation.issueDate}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Valid until: {quotation.validUntil}
                      </div>
                      {quotation.acceptedDate && (
                        <div className="text-xs text-green-600">
                          Accepted: {quotation.acceptedDate}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">${quotation.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{quotation.currency}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(quotation.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {quotation.followUpDate ? (
                        <div className="text-sm">
                          <span className="font-medium">{quotation.followUpDate}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No follow-up</div>
                      )}
                      {quotation.rejectionReason && (
                        <div className="text-xs text-red-600" title={quotation.rejectionReason}>
                          {quotation.rejectionReason.length > 20
                            ? `${quotation.rejectionReason.substring(0, 20)}...`
                            : quotation.rejectionReason
                          }
                        </div>
                      )}
                    </div>
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
                          View Quotation
                        </DropdownMenuItem>
                        {quotation.status === "draft" && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Quotation
                          </DropdownMenuItem>
                        )}
                        {quotation.status === "draft" && (
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Customer
                          </DropdownMenuItem>
                        )}
                        {quotation.status === "accepted" && !quotation.convertedToInvoice && (
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Invoice
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {quotation.status === "pending" && (
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Quotation
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