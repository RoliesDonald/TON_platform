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
  Download,
  Filter,
  MoreHorizontal,
  Eye,
  Receipt,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText
} from "lucide-react"

const paymentHistoryData = [
  {
    id: "PAY-2024-1234",
    invoiceId: "INV-2024-156",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    amount: 1250.00,
    currency: "USD",
    paymentMethod: "Credit Card",
    paymentStatus: "completed",
    paymentDate: "2024-11-20",
    transactionId: "txn_1234567890",
    gateway: "Stripe",
    fees: 37.50,
    netAmount: 1212.50,
    refundAmount: 0,
    description: "Payment for brake pad replacement service",
    metadata: {
      cardType: "Visa",
      last4: "4242",
      brand: "Visa",
      country: "US"
    },
    createdBy: "system",
    createdAt: "2024-11-20T14:30:00Z",
    updatedAt: "2024-11-20T14:30:00Z"
  },
  {
    id: "PAY-2024-1233",
    invoiceId: "INV-2024-155",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    amount: 875.50,
    currency: "USD",
    paymentMethod: "Bank Transfer",
    paymentStatus: "completed",
    paymentDate: "2024-11-19",
    transactionId: "BT_9876543210",
    gateway: "Bank Transfer",
    fees: 0.00,
    netAmount: 875.50,
    refundAmount: 0,
    description: "Payment for tire rotation and alignment service",
    metadata: {
      bankName: "Chase Bank",
      accountType: "Checking",
      transferType: "ACH"
    },
    createdBy: "manual",
    createdAt: "2024-11-19T10:15:00Z",
    updatedAt: "2024-11-19T10:15:00Z"
  },
  {
    id: "PAY-2024-1232",
    invoiceId: "INV-2024-154",
    customerName: "Mike Davis",
    customerEmail: "mike.davis@email.com",
    amount: 2450.75,
    currency: "USD",
    paymentMethod: "Credit Card",
    paymentStatus: "failed",
    paymentDate: "2024-11-18",
    transactionId: "txn_5555555555",
    gateway: "Stripe",
    fees: 0.00,
    netAmount: 0.00,
    refundAmount: 0,
    description: "Failed payment for transmission service",
    metadata: {
      failureReason: "Insufficient funds",
      cardType: "Mastercard",
      last4: "5555"
    },
    createdBy: "system",
    createdAt: "2024-11-18T16:45:00Z",
    updatedAt: "2024-11-18T16:45:00Z"
  },
  {
    id: "PAY-2024-1231",
    invoiceId: "INV-2024-153",
    customerName: "Emily Wilson",
    customerEmail: "emily.w@email.com",
    amount: 567.25,
    currency: "USD",
    paymentMethod: "PayPal",
    paymentStatus: "completed",
    paymentDate: "2024-11-17",
    transactionId: "PP_7777777777",
    gateway: "PayPal",
    fees: 16.92,
    netAmount: 550.33,
    refundAmount: 125.00,
    description: "Payment for battery replacement - partial refund processed",
    metadata: {
      paypalEmail: "buyer@paypal.com",
      refundDate: "2024-11-18",
      refundReason: "Service adjustment"
    },
    createdBy: "system",
    createdAt: "2024-11-17T09:20:00Z",
    updatedAt: "2024-11-18T14:30:00Z"
  },
  {
    id: "PAY-2024-1230",
    invoiceId: "INV-2024-152",
    customerName: "Robert Brown",
    customerEmail: "r.brown@email.com",
    amount: 3680.00,
    currency: "USD",
    paymentMethod: "Credit Card",
    paymentStatus: "partial",
    paymentDate: "2024-11-15",
    transactionId: "txn_9999999999",
    gateway: "Stripe",
    fees: 110.40,
    netAmount: 3570.00,
    refundAmount: 0,
    description: "Partial payment for complete brake service",
    metadata: {
      cardType: "Visa",
      last4: "1111",
      installmentPlan: "2 of 3 payments"
    },
    createdBy: "system",
    createdAt: "2024-11-15T11:00:00Z",
    updatedAt: "2024-11-15T11:00:00Z"
  },
  {
    id: "PAY-2024-1229",
    invoiceId: "INV-2024-151",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.a@email.com",
    amount: 450.00,
    currency: "USD",
    paymentMethod: "Cash",
    paymentStatus: "completed",
    paymentDate: "2024-11-14",
    transactionId: "CASH_001",
    gateway: "Manual",
    fees: 0.00,
    netAmount: 450.00,
    refundAmount: 0,
    description: "Cash payment for oil change service",
    metadata: {
      paymentType: "Cash",
      recordedBy: "John Doe"
    },
    createdBy: "manual",
    createdAt: "2024-11-14T15:30:00Z",
    updatedAt: "2024-11-14T15:30:00Z"
  }
]

const paymentStatuses = ["All", "completed", "failed", "partial", "pending", "refunded"]
const paymentMethods = ["All", "Credit Card", "Bank Transfer", "PayPal", "Cash", "Check"]
const gateways = ["All", "Stripe", "PayPal", "Bank Transfer", "Manual"]

export default function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedMethod, setSelectedMethod] = useState("All")
  const [selectedGateway, setSelectedGateway] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      case "refunded":
        return <Badge className="bg-purple-100 text-purple-800">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case "Bank Transfer":
        return <Receipt className="h-4 w-4 text-green-600" />
      case "PayPal":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "Cash":
        return <DollarSign className="h-4 w-4 text-green-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredData = paymentHistoryData.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || payment.paymentStatus === selectedStatus
    const matchesMethod = selectedMethod === "All" || payment.paymentMethod === selectedMethod
    const matchesGateway = selectedGateway === "All" || payment.gateway === selectedGateway

    return matchesSearch && matchesStatus && matchesMethod && matchesGateway
  })

  const stats = {
    total: paymentHistoryData.length,
    completed: paymentHistoryData.filter(p => p.paymentStatus === "completed").length,
    failed: paymentHistoryData.filter(p => p.paymentStatus === "failed").length,
    partial: paymentHistoryData.filter(p => p.paymentStatus === "partial").length,
    totalAmount: paymentHistoryData.reduce((sum, p) => sum + p.amount, 0),
    totalNet: paymentHistoryData.reduce((sum, p) => sum + p.netAmount, 0),
    totalFees: paymentHistoryData.reduce((sum, p) => sum + p.fees, 0),
    totalRefunds: paymentHistoryData.reduce((sum, p) => sum + p.refundAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">
            Track and analyze all payment transactions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Unsuccessful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
            <p className="text-xs text-muted-foreground">Installments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${stats.totalNet.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Processing Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-${stats.totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAmount > 0 ? ((stats.totalFees / stats.totalAmount) * 100).toFixed(2) : 0}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${stats.totalRefunds.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAmount > 0 ? ((stats.totalRefunds / stats.totalAmount) * 100).toFixed(2) : 0}% refunded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${paymentHistoryData.length > 0 ? (stats.totalAmount / paymentHistoryData.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paymentHistoryData.length > 0 ? ((stats.completed / paymentHistoryData.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments by ID, customer, invoice, or transaction..."
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
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "All" ? "All Methods" : method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGateway} onValueChange={setSelectedGateway}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                {gateways.map((gateway) => (
                  <SelectItem key={gateway} value={gateway}>
                    {gateway === "All" ? "All Gateways" : gateway}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {paymentHistoryData.length} payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method & Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.id}</div>
                      <div className="text-sm text-muted-foreground">Invoice: {payment.invoiceId}</div>
                      <div className="text-xs text-muted-foreground">TXN: {payment.transactionId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.customerName}</div>
                      <div className="text-sm text-muted-foreground">{payment.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                      {payment.fees > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Fee: ${payment.fees.toFixed(2)} | Net: ${payment.netAmount.toFixed(2)}
                        </div>
                      )}
                      {payment.refundAmount > 0 && (
                        <div className="text-xs text-red-600">
                          Refunded: ${payment.refundAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <div>
                        <div className="font-medium">{payment.paymentMethod}</div>
                        <div className="text-xs text-muted-foreground">{payment.gateway}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {payment.paymentDate}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.paymentMethod === "Credit Card" && payment.metadata.cardType && (
                          `${payment.metadata.cardType} •••• ${payment.metadata.last4}`
                        )}
                      </div>
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {payment.paymentStatus === "completed" && payment.refundAmount === 0 && (
                          <DropdownMenuItem className="text-orange-600">
                            <TrendingDown className="h-4 w-4 mr-2" />
                            Process Refund
                          </DropdownMenuItem>
                        )}
                        {payment.paymentStatus === "failed" && (
                          <DropdownMenuItem className="text-blue-600">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Retry Payment
                          </DropdownMenuItem>
                        )}
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