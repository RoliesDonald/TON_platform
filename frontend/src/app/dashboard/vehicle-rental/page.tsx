"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  FileText
} from "lucide-react";
import Link from "next/link";

interface VehicleRentalCompany {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  status: "active" | "inactive" | "pending";
  rating: number;
  totalVehicles: number;
  availableVehicles: number;
  rentalAgreements: number;
  monthlyRevenue: number;
  establishedYear: number;
  specialties: string[];
  certifications: string[];
  lastContractDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

const mockRentalCompanies: VehicleRentalCompany[] = [
  {
    id: "VRC001",
    name: "Premium Fleet Rentals",
    contactPerson: "John Anderson",
    email: "john@premiumfleet.com",
    phone: "+1-555-0101",
    address: "123 Business Avenue",
    city: "New York",
    country: "USA",
    website: "https://premiumfleet.com",
    status: "active",
    rating: 4.8,
    totalVehicles: 150,
    availableVehicles: 45,
    rentalAgreements: 23,
    monthlyRevenue: 85000,
    establishedYear: 2015,
    specialties: ["Luxury Vehicles", "SUVs", "Vans"],
    certifications: ["ISO 9001", "AAA Certified"],
    lastContractDate: "2024-01-15",
    nextReviewDate: "2024-07-15",
    createdAt: "2023-06-01",
    updatedAt: "2024-01-20"
  },
  {
    id: "VRC002",
    name: "City Car Rentals",
    contactPerson: "Sarah Martinez",
    email: "sarah@citycar.com",
    phone: "+1-555-0102",
    address: "456 Downtown Street",
    city: "Los Angeles",
    country: "USA",
    website: "https://citycarrentals.com",
    status: "active",
    rating: 4.5,
    totalVehicles: 200,
    availableVehicles: 78,
    rentalAgreements: 45,
    monthlyRevenue: 62000,
    establishedYear: 2018,
    specialties: ["Economy Cars", "Hybrids", "Compact"],
    certifications: ["EPA Certified", "Green Business"],
    lastContractDate: "2024-02-01",
    nextReviewDate: "2024-08-01",
    createdAt: "2023-08-15",
    updatedAt: "2024-02-10"
  },
  {
    id: "VRC003",
    name: "Truck & Van Solutions",
    contactPerson: "Michael Thompson",
    email: "michael@truckvan.com",
    phone: "+1-555-0103",
    address: "789 Industrial Park",
    city: "Chicago",
    country: "USA",
    status: "pending",
    rating: 4.2,
    totalVehicles: 75,
    availableVehicles: 15,
    rentalAgreements: 8,
    monthlyRevenue: 45000,
    establishedYear: 2012,
    specialties: ["Commercial Trucks", "Cargo Vans", "Moving Trucks"],
    certifications: ["DOT Certified", "OSHA Compliant"],
    lastContractDate: "2023-12-15",
    nextReviewDate: "2024-06-15",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-25"
  },
  {
    id: "VRC004",
    name: "EcoDrive Rentals",
    contactPerson: "Emily Chen",
    email: "emily@ecodrive.com",
    phone: "+1-555-0104",
    address: "321 Green Street",
    city: "San Francisco",
    country: "USA",
    website: "https://ecodrive.rentals",
    status: "active",
    rating: 4.9,
    totalVehicles: 80,
    availableVehicles: 35,
    rentalAgreements: 18,
    monthlyRevenue: 38000,
    establishedYear: 2020,
    specialties: ["Electric Vehicles", "Hybrids", "Bikes"],
    certifications: ["Green Certified", "Carbon Neutral"],
    lastContractDate: "2024-01-10",
    nextReviewDate: "2024-07-10",
    createdAt: "2023-09-20",
    updatedAt: "2024-01-15"
  },
  {
    id: "VRC005",
    name: "International Fleet Partners",
    contactPerson: "David Kumar",
    email: "david@ifp.com",
    phone: "+1-555-0105",
    address: "555 Global Plaza",
    city: "Miami",
    country: "USA",
    status: "inactive",
    rating: 3.8,
    totalVehicles: 120,
    availableVehicles: 5,
    rentalAgreements: 2,
    monthlyRevenue: 15000,
    establishedYear: 2008,
    specialties: ["International Vehicles", "Luxury", "Exotic Cars"],
    certifications: ["International Transport", "Premium Certified"],
    lastContractDate: "2023-08-20",
    nextReviewDate: "2024-02-20",
    createdAt: "2023-05-10",
    updatedAt: "2024-01-05"
  }
];

const specialties = ["all", "Luxury Vehicles", "Economy Cars", "SUVs", "Trucks", "Vans", "Electric Vehicles", "Hybrids"];
const statuses = ["all", "active", "inactive", "pending"];
const cities = ["all", "New York", "Los Angeles", "Chicago", "San Francisco", "Miami"];

export default function VehicleRentalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filteredCompanies, setFilteredCompanies] = useState<VehicleRentalCompany[]>(mockRentalCompanies);

  const stats = {
    totalCompanies: mockRentalCompanies.length,
    activeCompanies: mockRentalCompanies.filter(c => c.status === "active").length,
    totalVehicles: mockRentalCompanies.reduce((sum, c) => sum + c.totalVehicles, 0),
    availableVehicles: mockRentalCompanies.reduce((sum, c) => sum + c.availableVehicles, 0),
    monthlyRevenue: mockRentalCompanies.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    averageRating: (mockRentalCompanies.reduce((sum, c) => sum + c.rating, 0) / mockRentalCompanies.length).toFixed(1)
  };

  useEffect(() => {
    let filtered = mockRentalCompanies;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(company => company.status === filterStatus);
    }

    // Apply city filter
    if (filterCity !== "all") {
      filtered = filtered.filter(company => company.city === filterCity);
    }

    // Apply specialty filter
    if (filterSpecialty !== "all") {
      filtered = filtered.filter(company => company.specialties.includes(filterSpecialty));
    }

    setFilteredCompanies(filtered);
  }, [searchTerm, filterStatus, filterCity, filterSpecialty]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-600" />
              Vehicle Rental Companies
            </h1>
            <p className="text-gray-600 mt-2">
              Manage vehicle rental company partnerships and rental agreements
            </p>
          </div>
          <Link href="/dashboard/vehicle-rental/register">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Register Company
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">Registered partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCompanies}</div>
              <p className="text-xs text-muted-foreground">Currently operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
              <Car className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Partner vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableVehicles.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ready for rental</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
              <p className="text-xs text-muted-foreground">From partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city === "all" ? "All Cities" : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty === "all" ? "All Specialties" : specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterCity("all");
                  setFilterSpecialty("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rental Companies</CardTitle>
                <CardDescription>
                  Manage your vehicle rental company partnerships and their fleets
                </CardDescription>
              </div>
              <Badge variant="outline">
                {filteredCompanies.length} of {mockRentalCompanies.length} companies
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fleet</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-gray-500">
                          Est. {company.establishedYear}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.contactPerson}</div>
                        <div className="text-sm text-gray-500">{company.email}</div>
                        <div className="text-sm text-gray-500">{company.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.city}</div>
                        <div className="text-sm text-gray-500">{company.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(company.status)}
                        <Badge variant={getStatusBadgeVariant(company.status)}>
                          {company.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.totalVehicles} total</div>
                        <div className="text-sm text-green-600">{company.availableVehicles} available</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{company.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${(company.monthlyRevenue / 1000).toFixed(0)}k/mo
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
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Company
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Agreements
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Car className="mr-2 h-4 w-4" />
                            View Fleet
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Company
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No companies found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and contract renewals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRentalCompanies.slice(0, 3).map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{company.name}</h4>
                      <p className="text-sm text-gray-600">
                        {company.rentalAgreements} active rental agreements
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Next Review</div>
                    <div className="text-sm text-gray-500">
                      {new Date(company.nextReviewDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}