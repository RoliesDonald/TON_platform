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
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail, MapPin, Star, Building } from "lucide-react"

const suppliersData = [
  {
    id: "S001",
    name: "AutoParts Direct",
    contactPerson: "John Smith",
    email: "john@autopartsdirect.com",
    phone: "+1-555-0123",
    address: "123 Industrial Ave, Detroit, MI 48201",
    city: "Detroit",
    state: "MI",
    zipCode: "48201",
    country: "USA",
    category: "General Parts",
    rating: 4.5,
    totalOrders: 156,
    totalValue: 125430.50,
    avgDeliveryTime: "3-5 days",
    paymentTerms: "Net 30",
    status: "active",
    lastOrderDate: "2024-11-15",
    productsOffered: 245,
    specializations: ["Brakes", "Filters", "Engine Parts"],
    certifications: ["ISO 9001", "ASE Certified"],
    createdDate: "2022-01-15",
    notes: "Reliable supplier with good quality parts. Best pricing for bulk orders."
  },
  {
    id: "S002",
    name: "QuickParts",
    contactPerson: "Sarah Johnson",
    email: "sarah@quickparts.com",
    phone: "+1-555-0124",
    address: "456 Commerce St, Chicago, IL 60601",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    category: "Fast Moving Parts",
    rating: 4.2,
    totalOrders: 98,
    totalValue: 78230.75,
    avgDeliveryTime: "1-2 days",
    paymentTerms: "Net 15",
    status: "active",
    lastOrderDate: "2024-11-18",
    productsOffered: 156,
    specializations: ["Filters", "Oil", "Fluids"],
    certifications: ["ISO 9001"],
    createdDate: "2022-06-20",
    notes: "Excellent for urgent orders. Fast delivery but slightly higher prices."
  },
  {
    id: "S003",
    name: "Global Auto Supplies",
    contactPerson: "Michael Chen",
    email: "mchen@globalautosupplies.com",
    phone: "+1-555-0125",
    address: "789 International Blvd, Los Angeles, CA 90001",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA",
    category: "Import Parts",
    rating: 3.8,
    totalOrders: 67,
    totalValue: 95670.25,
    avgDeliveryTime: "7-10 days",
    paymentTerms: "Net 45",
    status: "active",
    lastOrderDate: "2024-10-28",
    productsOffered: 189,
    specializations: ["European Parts", "Asian Parts", "OEM Parts"],
    certifications: ["ISO 9001", "OEM Certified"],
    createdDate: "2023-02-10",
    notes: "Good for specialty parts. Longer delivery times but competitive pricing."
  },
  {
    id: "S004",
    name: "Premium Parts Co",
    contactPerson: "Robert Williams",
    email: "rw@premiumparts.com",
    phone: "+1-555-0126",
    address: "321 Quality Lane, Boston, MA 02101",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    country: "USA",
    category: "Premium/OEM",
    rating: 4.7,
    totalOrders: 43,
    totalValue: 156890.00,
    avgDeliveryTime: "5-7 days",
    paymentTerms: "Net 30",
    status: "active",
    lastOrderDate: "2024-11-10",
    productsOffered: 87,
    specializations: ["OEM Parts", "Performance Parts", "Warranty Parts"],
    certifications: ["ISO 9001", "OEM Certified", "Warranty Certified"],
    createdDate: "2023-05-15",
    notes: "Premium quality parts with warranty. Excellent for high-end vehicles."
  },
  {
    id: "S005",
    name: "Budget Auto Parts",
    contactPerson: "Lisa Anderson",
    email: "lisa@budgetautoparts.com",
    phone: "+1-555-0127",
    address: "654 Economy Dr, Houston, TX 77001",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    country: "USA",
    category: "Economy Parts",
    rating: 3.2,
    totalOrders: 25,
    totalValue: 23450.00,
    avgDeliveryTime: "4-6 days",
    paymentTerms: "Prepaid",
    status: "inactive",
    lastOrderDate: "2024-08-15",
    productsOffered: 134,
    specializations: ["Aftermarket Parts", "Economy Brakes", "Basic Filters"],
    certifications: ["Basic Quality Certified"],
    createdDate: "2023-08-20",
    notes: "Budget-friendly options but quality can be inconsistent. Currently on hold."
  }
]

const categories = ["All", "General Parts", "Fast Moving Parts", "Import Parts", "Premium/OEM", "Economy Parts"]
const statuses = ["All", "active", "inactive", "pending"]

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    )
  }

  const filteredData = suppliersData.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || supplier.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || supplier.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: suppliersData.length,
    active: suppliersData.filter(s => s.status === "active").length,
    inactive: suppliersData.filter(s => s.status === "inactive").length,
    newThisMonth: suppliersData.filter(s => {
      const createdDate = new Date(s.createdDate)
      const thisMonth = new Date()
      return createdDate.getMonth() === thisMonth.getMonth() &&
             createdDate.getFullYear() === thisMonth.getFullYear()
    }).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage supplier information and relationships
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+{stats.newThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently trading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Suppliers</CardTitle>
            <Building className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">On hold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.1</div>
            <p className="text-xs text-muted-foreground">Across all suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name, contact, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
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

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers List</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {suppliersData.length} suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Information</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Order Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {supplier.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {supplier.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Building className="h-3 w-3 mr-1" />
                        {supplier.contactPerson}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {supplier.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{getRatingStars(supplier.rating)}</div>
                      <div className="text-xs text-muted-foreground">
                        {supplier.avgDeliveryTime} delivery
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {supplier.paymentTerms}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{supplier.totalOrders}</span> orders
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">${supplier.totalValue.toLocaleString()}</span> total
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {supplier.productsOffered} products
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(supplier.status)}
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Supplier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Building className="h-4 w-4 mr-2" />
                          View Orders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Supplier
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