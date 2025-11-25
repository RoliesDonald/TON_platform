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
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react"

const partsData = [
  {
    id: "P001",
    name: "Brake Pads - Front",
    sku: "BP-001-F",
    category: "Brakes",
    quantity: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 45.99,
    supplier: "AutoParts Direct",
    location: "A-1-15",
    status: "in-stock",
    lastUpdated: "2024-11-20"
  },
  {
    id: "P002",
    name: "Oil Filter",
    sku: "OF-002",
    category: "Filters",
    quantity: 8,
    minStock: 25,
    maxStock: 100,
    unitPrice: 12.50,
    supplier: "QuickParts",
    location: "B-2-08",
    status: "low-stock",
    lastUpdated: "2024-11-19"
  },
  {
    id: "P003",
    name: "Spark Plug",
    sku: "SP-003",
    category: "Ignition",
    quantity: 0,
    minStock: 30,
    maxStock: 100,
    unitPrice: 8.75,
    supplier: "AutoParts Direct",
    location: "C-3-12",
    status: "out-of-stock",
    lastUpdated: "2024-11-18"
  },
  {
    id: "P004",
    name: "Air Filter",
    sku: "AF-004",
    category: "Filters",
    quantity: 67,
    minStock: 15,
    maxStock: 80,
    unitPrice: 18.25,
    supplier: "Global Auto Supplies",
    location: "B-2-09",
    status: "in-stock",
    lastUpdated: "2024-11-20"
  },
  {
    id: "P005",
    name: "Radiator Hose",
    sku: "RH-005",
    category: "Cooling",
    quantity: 12,
    minStock: 10,
    maxStock: 50,
    unitPrice: 32.50,
    supplier: "QuickParts",
    location: "D-4-05",
    status: "in-stock",
    lastUpdated: "2024-11-17"
  }
]

const categories = ["All", "Brakes", "Filters", "Ignition", "Cooling", "Electrical", "Suspension", "Transmission"]
const suppliers = ["All", "AutoParts Direct", "QuickParts", "Global Auto Supplies", "Premium Parts Co"]

export default function PartsInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSupplier, setSelectedSupplier] = useState("All")
  const [filteredParts, setFilteredParts] = useState(partsData)

  const getStatusBadge = (status: string, quantity: number, minStock: number) => {
    if (quantity === 0) return <Badge variant="destructive">Out of Stock</Badge>
    if (quantity <= minStock) return <Badge variant="outline">Low Stock</Badge>
    return <Badge variant="default">In Stock</Badge>
  }

  const filteredData = partsData.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || part.category === selectedCategory
    const matchesSupplier = selectedSupplier === "All" || part.supplier === selectedSupplier

    return matchesSearch && matchesCategory && matchesSupplier
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parts Inventory</h1>
          <p className="text-muted-foreground">
            Manage and track all vehicle parts and components
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-xs text-muted-foreground">Need immediate reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,430</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Parts</CardTitle>
          <CardDescription>Search and filter parts by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts by name or SKU..."
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
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parts List</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {partsData.length} parts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{part.name}</div>
                      <div className="text-sm text-muted-foreground">SKU: {part.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>{part.category}</TableCell>
                  <TableCell>
                    <div className="text-right">
                      <div className="font-medium">{part.quantity}</div>
                      <div className="text-xs text-muted-foreground">
                        Min: {part.minStock} | Max: {part.maxStock}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${part.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{part.supplier}</TableCell>
                  <TableCell>{part.location}</TableCell>
                  <TableCell>
                    {getStatusBadge(part.status, part.quantity, part.minStock)}
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
                          Edit Part
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Part
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