"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Search, AlertTriangle, TrendingUp, TrendingDown, Package, RefreshCw, MoreHorizontal } from "lucide-react"

const stockData = [
  {
    id: "P001",
    name: "Brake Pads - Front",
    sku: "BP-001-F",
    category: "Brakes",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 25,
    reorderQuantity: 50,
    unitCost: 35.99,
    supplier: "AutoParts Direct",
    lastReorder: "2024-10-15",
    daysOfSupply: 45,
    status: "healthy",
    trend: "stable"
  },
  {
    id: "P002",
    name: "Oil Filter",
    sku: "OF-002",
    category: "Filters",
    currentStock: 8,
    minStock: 25,
    maxStock: 100,
    reorderPoint: 30,
    reorderQuantity: 75,
    unitCost: 8.50,
    supplier: "QuickParts",
    lastReorder: "2024-09-20",
    daysOfSupply: 5,
    status: "critical",
    trend: "decreasing"
  },
  {
    id: "P003",
    name: "Spark Plug",
    sku: "SP-003",
    category: "Ignition",
    currentStock: 0,
    minStock: 30,
    maxStock: 100,
    reorderPoint: 35,
    reorderQuantity: 100,
    unitCost: 6.25,
    supplier: "AutoParts Direct",
    lastReorder: "2024-08-10",
    daysOfSupply: 0,
    status: "out-of-stock",
    trend: "stable"
  },
  {
    id: "P004",
    name: "Air Filter",
    sku: "AF-004",
    category: "Filters",
    currentStock: 67,
    minStock: 15,
    maxStock: 80,
    reorderPoint: 20,
    reorderQuantity: 40,
    unitCost: 14.75,
    supplier: "Global Auto Supplies",
    lastReorder: "2024-10-01",
    daysOfSupply: 67,
    status: "healthy",
    trend: "increasing"
  },
  {
    id: "P005",
    name: "Radiator Hose",
    sku: "RH-005",
    category: "Cooling",
    currentStock: 12,
    minStock: 10,
    maxStock: 50,
    reorderPoint: 15,
    reorderQuantity: 25,
    unitCost: 28.50,
    supplier: "QuickParts",
    lastReorder: "2024-09-15",
    daysOfSupply: 12,
    status: "low",
    trend: "decreasing"
  }
]

const categories = ["All", "Brakes", "Filters", "Ignition", "Cooling", "Electrical", "Suspension", "Transmission"]
const statuses = ["All", "healthy", "low", "critical", "out-of-stock"]

export default function StockLevelsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case "low":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  const getStockColor = (percentage: number) => {
    if (percentage === 0) return "bg-red-500"
    if (percentage < 25) return "bg-orange-500"
    if (percentage < 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const filteredData = stockData.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  const stats = {
    total: stockData.length,
    healthy: stockData.filter(item => item.status === "healthy").length,
    low: stockData.filter(item => item.status === "low").length,
    critical: stockData.filter(item => item.status === "critical").length,
    outOfStock: stockData.filter(item => item.status === "out-of-stock").length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stock Levels</h1>
          <p className="text-muted-foreground">
            Monitor inventory quantities, reorder points, and stock trends
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All parts tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.healthy}</div>
            <p className="text-xs text-muted-foreground">Adequate levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.low}</div>
            <p className="text-xs text-muted-foreground">Near reorder point</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Urgent reorder needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
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
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All Statuses" :
                     status === "healthy" ? "Healthy" :
                     status === "low" ? "Low Stock" :
                     status === "critical" ? "Critical" : "Out of Stock"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Levels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels Details</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {stockData.length} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Details</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Levels</TableHead>
                <TableHead>Reorder Info</TableHead>
                <TableHead>Days of Supply</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const stockPercentage = getStockPercentage(item.currentStock, item.maxStock)

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{item.currentStock}</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={stockPercentage}
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-muted-foreground w-10">
                            {Math.round(stockPercentage)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">At: </span>{item.reorderPoint}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Qty: </span>{item.reorderQuantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${item.unitCost.toFixed(2)} each
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className={`font-semibold ${
                          item.daysOfSupply === 0 ? 'text-red-600' :
                          item.daysOfSupply <= 7 ? 'text-orange-600' :
                          item.daysOfSupply <= 30 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {item.daysOfSupply}
                        </div>
                        <div className="text-xs text-muted-foreground">days</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(item.trend)}
                        <span className="text-sm capitalize">{item.trend}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
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
                            <Package className="h-4 w-4 mr-2" />
                            Create Purchase Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Update Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}