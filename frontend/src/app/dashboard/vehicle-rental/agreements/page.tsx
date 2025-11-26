"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface RentalAgreement {
  id: string;
  agreementNumber: string;
  companyName: string;
  companyLogo: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    vin: string;
  };
  rentalPeriod: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  financialDetails: {
    dailyRate: number;
    totalAmount: number;
    deposit: number;
    currency: string;
  };
  status: "active" | "expired" | "pending" | "terminated";
  driver: {
    name: string;
    licenseNumber: string;
    contactNumber: string;
  };
  createdAt: string;
  lastModified: string;
}

const mockAgreements: RentalAgreement[] = [
  {
    id: "1",
    agreementNumber: "RA-2024-001",
    companyName: "CityLink Rentals",
    companyLogo: "CL",
    vehicleDetails: {
      make: "Toyota",
      model: "Camry",
      year: 2024,
      plateNumber: "ABC-123",
      vin: "1HGBH41JXMN109186",
    },
    rentalPeriod: {
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      totalDays: 91,
    },
    financialDetails: {
      dailyRate: 45,
      totalAmount: 4095,
      deposit: 500,
      currency: "USD",
    },
    status: "active",
    driver: {
      name: "John Smith",
      licenseNumber: "DL123456789",
      contactNumber: "+1-555-0123",
    },
    createdAt: "2024-01-10T10:00:00Z",
    lastModified: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    agreementNumber: "RA-2024-002",
    companyName: "FleetWise Solutions",
    companyLogo: "FW",
    vehicleDetails: {
      make: "Honda",
      model: "CR-V",
      year: 2023,
      plateNumber: "XYZ-789",
      vin: "2HGBH41JXMN109187",
    },
    rentalPeriod: {
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      totalDays: 29,
    },
    financialDetails: {
      dailyRate: 55,
      totalAmount: 1595,
      deposit: 600,
      currency: "USD",
    },
    status: "expired",
    driver: {
      name: "Sarah Johnson",
      licenseNumber: "DL987654321",
      contactNumber: "+1-555-0456",
    },
    createdAt: "2024-01-28T09:15:00Z",
    lastModified: "2024-03-01T10:00:00Z",
  },
  {
    id: "3",
    agreementNumber: "RA-2024-003",
    companyName: "AutoLease Pro",
    companyLogo: "AL",
    vehicleDetails: {
      make: "Ford",
      model: "Transit",
      year: 2024,
      plateNumber: "DEF-456",
      vin: "3HGBH41JXMN109188",
    },
    rentalPeriod: {
      startDate: "2024-03-01",
      endDate: "2024-09-01",
      totalDays: 184,
    },
    financialDetails: {
      dailyRate: 75,
      totalAmount: 13800,
      deposit: 1000,
      currency: "USD",
    },
    status: "active",
    driver: {
      name: "Michael Brown",
      licenseNumber: "DL456789123",
      contactNumber: "+1-555-0789",
    },
    createdAt: "2024-02-25T11:30:00Z",
    lastModified: "2024-03-01T16:45:00Z",
  },
  {
    id: "4",
    agreementNumber: "RA-2024-004",
    companyName: "CityLink Rentals",
    companyLogo: "CL",
    vehicleDetails: {
      make: "Chevrolet",
      model: "Silverado",
      year: 2023,
      plateNumber: "GHI-012",
      vin: "4HGBH41JXMN109189",
    },
    rentalPeriod: {
      startDate: "2024-03-15",
      endDate: "2024-06-15",
      totalDays: 92,
    },
    financialDetails: {
      dailyRate: 85,
      totalAmount: 7820,
      deposit: 1200,
      currency: "USD",
    },
    status: "pending",
    driver: {
      name: "Robert Davis",
      licenseNumber: "DL789123456",
      contactNumber: "+1-555-0234",
    },
    createdAt: "2024-03-10T08:45:00Z",
    lastModified: "2024-03-14T13:20:00Z",
  },
  {
    id: "5",
    agreementNumber: "RA-2024-005",
    companyName: "FleetWise Solutions",
    companyLogo: "FW",
    vehicleDetails: {
      make: "Nissan",
      model: "Sentra",
      year: 2024,
      plateNumber: "JKL-345",
      vin: "5HGBH41JXMN109190",
    },
    rentalPeriod: {
      startDate: "2024-01-01",
      endDate: "2024-02-15",
      totalDays: 46,
    },
    financialDetails: {
      dailyRate: 40,
      totalAmount: 1840,
      deposit: 400,
      currency: "USD",
    },
    status: "terminated",
    driver: {
      name: "Emily Wilson",
      licenseNumber: "DL321654987",
      contactNumber: "+1-555-0567",
    },
    createdAt: "2023-12-28T14:00:00Z",
    lastModified: "2024-02-10T09:30:00Z",
  },
];

export default function RentalAgreementsPage() {
  const [agreements, setAgreements] = useState<RentalAgreement[]>(mockAgreements);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAgreement, setSelectedAgreement] = useState<RentalAgreement | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "expired":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "terminated":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.vehicleDetails.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.driver.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || agreement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewAgreement = (agreement: RentalAgreement) => {
    setSelectedAgreement(agreement);
    setViewDialogOpen(true);
  };

  const handleDownloadAgreement = (agreement: RentalAgreement) => {
    // Placeholder for download functionality
    console.log("Downloading agreement:", agreement.agreementNumber);
  };

  const handleEditAgreement = (agreement: RentalAgreement) => {
    // Placeholder for edit functionality
    console.log("Editing agreement:", agreement.agreementNumber);
  };

  const handleDeleteAgreement = (agreement: RentalAgreement) => {
    // Placeholder for delete functionality
    console.log("Deleting agreement:", agreement.agreementNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rental Agreements</h1>
          <p className="text-muted-foreground">
            Manage and track all vehicle rental agreements
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Agreement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agreements.length}</div>
            <p className="text-xs text-muted-foreground">All rental agreements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agreements.filter(a => a.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Agreements</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {agreements.filter(a => a.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting activation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${agreements.filter(a => a.status === "active").reduce((sum, a) => sum + a.financialDetails.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From active agreements</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by agreement number, company, vehicle, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Agreements ({filteredAgreements.length})</CardTitle>
          <CardDescription>
            A comprehensive list of all vehicle rental agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement #</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell className="font-medium">{agreement.agreementNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{agreement.companyLogo}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agreement.companyName}</div>
                        <div className="text-sm text-muted-foreground">ID: {agreement.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {agreement.vehicleDetails.year} {agreement.vehicleDetails.make} {agreement.vehicleDetails.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {agreement.vehicleDetails.plateNumber} • {agreement.vehicleDetails.vin.slice(-8)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        {new Date(agreement.rentalPeriod.startDate).toLocaleDateString()} - {new Date(agreement.rentalPeriod.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {agreement.rentalPeriod.totalDays} days
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{agreement.driver.name}</div>
                      <div className="text-sm text-muted-foreground">{agreement.driver.contactNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${agreement.financialDetails.totalAmount.toLocaleString()} {agreement.financialDetails.currency}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agreement.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(agreement.status)}
                        {agreement.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewAgreement(agreement)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadAgreement(agreement)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditAgreement(agreement)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteAgreement(agreement)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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

      {/* View Agreement Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agreement Details - {selectedAgreement?.agreementNumber}</DialogTitle>
            <DialogDescription>
              Complete rental agreement information
            </DialogDescription>
          </DialogHeader>
          {selectedAgreement && (
            <div className="space-y-6">
              {/* Company and Vehicle Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Company Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{selectedAgreement.companyLogo}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedAgreement.companyName}</div>
                        <div className="text-sm text-muted-foreground">Rental Company</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Vehicle Information</h3>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {selectedAgreement.vehicleDetails.year} {selectedAgreement.vehicleDetails.make} {selectedAgreement.vehicleDetails.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Plate: {selectedAgreement.vehicleDetails.plateNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      VIN: {selectedAgreement.vehicleDetails.vin}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div>
                <h3 className="font-semibold mb-3">Rental Period</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <div className="text-sm font-medium">
                      {new Date(selectedAgreement.rentalPeriod.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <div className="text-sm font-medium">
                      {new Date(selectedAgreement.rentalPeriod.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <Label>Total Days</Label>
                    <div className="text-sm font-medium">{selectedAgreement.rentalPeriod.totalDays} days</div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h3 className="font-semibold mb-3">Financial Details</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Daily Rate</Label>
                    <div className="text-sm font-medium">
                      ${selectedAgreement.financialDetails.dailyRate} {selectedAgreement.financialDetails.currency}
                    </div>
                  </div>
                  <div>
                    <Label>Total Amount</Label>
                    <div className="text-sm font-medium">
                      ${selectedAgreement.financialDetails.totalAmount.toLocaleString()} {selectedAgreement.financialDetails.currency}
                    </div>
                  </div>
                  <div>
                    <Label>Deposit</Label>
                    <div className="text-sm font-medium">
                      ${selectedAgreement.financialDetails.deposit} {selectedAgreement.financialDetails.currency}
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedAgreement.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedAgreement.status)}
                        {selectedAgreement.status}
                      </div>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div>
                <h3 className="font-semibold mb-3">Driver Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Driver Name</Label>
                    <div className="text-sm font-medium">{selectedAgreement.driver.name}</div>
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <div className="text-sm font-medium">{selectedAgreement.driver.licenseNumber}</div>
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <div className="text-sm font-medium">{selectedAgreement.driver.contactNumber}</div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 className="font-semibold mb-3">Terms and Conditions</h3>
                <Textarea
                  placeholder="Rental agreement terms and conditions..."
                  defaultValue="This rental agreement is subject to the following terms and conditions:
1. The vehicle must be returned in the same condition as received.
2. The driver must maintain valid insurance throughout the rental period.
3. Any violations or fines incurred during the rental period are the responsibility of the driver.
4. The rental company reserves the right to terminate the agreement for any breach of terms."
                  readOnly
                  rows={6}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleDownloadAgreement(selectedAgreement!)}>
              <Download className="h-4 w-4 mr-2" />
              Download Agreement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}