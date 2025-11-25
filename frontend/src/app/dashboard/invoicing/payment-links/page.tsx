"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Copy,
  Eye,
  Trash2,
  Link,
  CreditCard,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Share,
  QrCode,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";

const paymentLinksData = [
  {
    id: "PL-2024-089",
    title: "Brake Service Payment",
    description: "Payment for complete brake service",
    amount: 1250.0,
    currency: "USD",
    status: "active",
    paymentStatus: "unpaid",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    createdDate: "2024-11-18",
    expiryDate: "2024-12-18",
    linkUrl: "https://pay.tonservice.com/pl-2024-089",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    maxPayments: 1,
    paymentCount: 0,
    allowPartialPayment: false,
    sendReminder: true,
    notes: "Payment for brake pad replacement and service",
    paidDate: null,
    views: 15,
    conversions: 0,
  },
  {
    id: "PL-2024-088",
    title: "Oil Change Service",
    description: "Regular maintenance payment",
    amount: 75.0,
    currency: "USD",
    status: "active",
    paymentStatus: "paid",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    createdDate: "2024-11-15",
    expiryDate: "2024-12-15",
    linkUrl: "https://pay.tonservice.com/pl-2024-088",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    maxPayments: 1,
    paymentCount: 1,
    allowPartialPayment: false,
    sendReminder: true,
    notes: "Payment for oil change service",
    paidDate: "2024-11-16",
    views: 8,
    conversions: 1,
  },
  {
    id: "PL-2024-087",
    title: "Multiple Services Bundle",
    description: "Complete vehicle maintenance package",
    amount: 580.0,
    currency: "USD",
    status: "active",
    paymentStatus: "partial",
    customerName: "Mike Davis",
    customerEmail: "mike.davis@email.com",
    createdDate: "2024-11-10",
    expiryDate: "2024-12-10",
    linkUrl: "https://pay.tonservice.com/pl-2024-087",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    maxPayments: 3,
    paymentCount: 2,
    allowPartialPayment: true,
    sendReminder: true,
    notes: "Payment for multiple services - allows partial payments",
    paidDate: null,
    views: 25,
    conversions: 2,
  },
  {
    id: "PL-2024-086",
    title: "Diagnostic Fee",
    description: "Vehicle diagnostic service payment",
    amount: 120.0,
    currency: "USD",
    status: "expired",
    paymentStatus: "unpaid",
    customerName: "Emily Wilson",
    customerEmail: "emily.w@email.com",
    createdDate: "2024-10-20",
    expiryDate: "2024-11-20",
    linkUrl: "https://pay.tonservice.com/pl-2024-086",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    maxPayments: 1,
    paymentCount: 0,
    allowPartialPayment: false,
    sendReminder: false,
    notes: "Payment for diagnostic service",
    paidDate: null,
    views: 12,
    conversions: 0,
  },
  {
    id: "PL-2024-085",
    title: "Tire Service Payment",
    description: "Tire rotation and balancing",
    amount: 180.0,
    currency: "USD",
    status: "active",
    paymentStatus: "unpaid",
    customerName: "Robert Brown",
    customerEmail: "r.brown@email.com",
    createdDate: "2024-11-12",
    expiryDate: "2024-12-12",
    linkUrl: "https://pay.tonservice.com/pl-2024-085",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    maxPayments: 1,
    paymentCount: 0,
    allowPartialPayment: false,
    sendReminder: true,
    notes: "Payment for tire rotation and balancing service",
    paidDate: null,
    views: 6,
    conversions: 0,
  },
];

const statuses = ["All", "active", "expired", "disabled"];
const paymentStatuses = ["All", "paid", "partial", "unpaid"];

export default function PaymentLinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "disabled":
        return <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case "unpaid":
        return <Badge variant="outline">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const filteredData = paymentLinksData.filter((link) => {
    const matchesSearch =
      link.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || link.status === selectedStatus;
    const matchesPaymentStatus =
      selectedPaymentStatus === "All" || link.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const stats = {
    total: paymentLinksData.length,
    active: paymentLinksData.filter((l) => l.status === "active").length,
    expired: paymentLinksData.filter((l) => l.status === "expired").length,
    paid: paymentLinksData.filter((l) => l.paymentStatus === "paid").length,
    totalAmount: paymentLinksData.reduce((sum, l) => sum + l.amount, 0),
    totalRevenue: paymentLinksData
      .filter((l) => l.paymentStatus === "paid")
      .reduce((sum, l) => sum + l.amount, 0),
    averageConversion:
      paymentLinksData
        .filter((l) => l.views > 0)
        .reduce((sum, l) => sum + (l.conversions / l.views) * 100, 0) /
      paymentLinksData.filter((l) => l.views > 0).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Links</h1>
          <p className="text-muted-foreground">Create and manage payment links for quick customer payments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Bulk QR Codes
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Link
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All payment links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">No longer valid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Links</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">Successfully paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All links value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.averageConversion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Payment Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links by ID, title, or customer..."
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
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All"
                      ? "All Payment"
                      : status === "unpaid"
                      ? "Unpaid"
                      : status === "partial"
                      ? "Partial"
                      : "Paid"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Links</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {paymentLinksData.length} links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-muted-foreground">{link.id}</div>
                      <div className="text-xs text-muted-foreground">{link.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{link.customerName}</div>
                      <div className="text-sm text-muted-foreground">{link.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">${link.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{link.currency}</div>
                      {link.paymentCount > 0 && (
                        <div className="text-xs text-blue-600">
                          {link.paymentCount}/{link.maxPayments} payments
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {link.createdDate}
                      </div>
                      <div className="text-xs text-muted-foreground">Expires: {link.expiryDate}</div>
                      {link.paidDate && <div className="text-xs text-green-600">Paid: {link.paidDate}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(link.status)}
                      {getPaymentStatusBadge(link.paymentStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{link.views}</span> views
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {link.conversions} conversions
                        {link.views > 0 && (
                          <span className="text-blue-600 ml-1">
                            ({((link.conversions / link.views) * 100).toFixed(1)}%)
                          </span>
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
                        <DropdownMenuItem onClick={() => copyToClipboard(link.linkUrl)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="h-4 w-4 mr-2" />
                          Download QR Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {link.status === "active" && (
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Link
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
  );
}
