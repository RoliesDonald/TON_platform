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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Ruler,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Download,
  Upload,
  Package,
  Scale,
  Maximize2,
  Droplets,
  Calculator,
  Thermometer,
  Grid
} from "lucide-react";
import Link from "next/link";

interface Unit {
  id: string;
  name: string;
  symbol: string;
  category: string;
  type: "weight" | "length" | "volume" | "quantity" | "area" | "temperature";
  status: "active" | "inactive";
  description?: string;
  conversionFactor?: number;
  baseUnit?: string;
  createdAt: string;
  lastModified: string;
}

const mockUnits: Unit[] = [
  {
    id: "U001",
    name: "Kilogram",
    symbol: "kg",
    category: "Weight",
    type: "weight",
    status: "active",
    description: "Base unit for mass measurement",
    conversionFactor: 1,
    baseUnit: "Kilogram",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15"
  },
  {
    id: "U002",
    name: "Gram",
    symbol: "g",
    category: "Weight",
    type: "weight",
    status: "active",
    description: "1000 grams = 1 kilogram",
    conversionFactor: 0.001,
    baseUnit: "Kilogram",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15"
  },
  {
    id: "U003",
    name: "Centimeter",
    symbol: "cm",
    category: "Length",
    type: "length",
    status: "active",
    description: "100 centimeters = 1 meter",
    conversionFactor: 0.01,
    baseUnit: "Meter",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15"
  },
  {
    id: "U004",
    name: "Pieces",
    symbol: "pcs",
    category: "Quantity",
    type: "quantity",
    status: "active",
    description: "Individual unit count",
    conversionFactor: 1,
    baseUnit: "Pieces",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15"
  },
  {
    id: "U005",
    name: "Meter",
    symbol: "m",
    category: "Length",
    type: "length",
    status: "active",
    description: "Base unit for length measurement",
    conversionFactor: 1,
    baseUnit: "Meter",
    createdAt: "2024-01-15",
    lastModified: "2024-01-15"
  },
  {
    id: "U006",
    name: "Liter",
    symbol: "L",
    category: "Volume",
    type: "volume",
    status: "active",
    description: "Base unit for volume measurement",
    conversionFactor: 1,
    baseUnit: "Liter",
    createdAt: "2024-01-16",
    lastModified: "2024-01-16"
  },
  {
    id: "U007",
    name: "Milliliter",
    symbol: "mL",
    category: "Volume",
    type: "volume",
    status: "active",
    description: "1000 milliliters = 1 liter",
    conversionFactor: 0.001,
    baseUnit: "Liter",
    createdAt: "2024-01-16",
    lastModified: "2024-01-16"
  },
  {
    id: "U008",
    name: "Square Meter",
    symbol: "m²",
    category: "Area",
    type: "area",
    status: "active",
    description: "Base unit for area measurement",
    conversionFactor: 1,
    baseUnit: "Square Meter",
    createdAt: "2024-01-17",
    lastModified: "2024-01-17"
  },
  {
    id: "U009",
    name: "Celsius",
    symbol: "°C",
    category: "Temperature",
    type: "temperature",
    status: "active",
    description: "Temperature measurement scale",
    conversionFactor: 1,
    baseUnit: "Celsius",
    createdAt: "2024-01-18",
    lastModified: "2024-01-18"
  },
  {
    id: "U010",
    name: "Ton",
    symbol: "t",
    category: "Weight",
    type: "weight",
    status: "inactive",
    description: "1 ton = 1000 kilograms",
    conversionFactor: 1000,
    baseUnit: "Kilogram",
    createdAt: "2024-01-19",
    lastModified: "2024-01-20"
  }
];

const typeIcons = {
  weight: Scale,
  length: Maximize2,
  volume: Droplets,
  quantity: Package,
  area: Grid,
  temperature: Thermometer,
};

const typeColors = {
  weight: "text-blue-600 bg-blue-50",
  length: "text-green-600 bg-green-50",
  volume: "text-cyan-600 bg-cyan-50",
  quantity: "text-purple-600 bg-purple-50",
  area: "text-orange-600 bg-orange-50",
  temperature: "text-red-600 bg-red-50",
};

export default function UnitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>(mockUnits);

  const categories = ["all", ...Array.from(new Set(mockUnits.map(unit => unit.category)))];
  const types = ["all", ...Array.from(new Set(mockUnits.map(unit => unit.type)))];
  const statuses = ["all", "active", "inactive"];

  useEffect(() => {
    let filtered = mockUnits;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(unit =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(unit => unit.category === filterCategory);
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(unit => unit.type === filterType);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(unit => unit.status === filterStatus);
    }

    setFilteredUnits(filtered);
  }, [searchTerm, filterCategory, filterType, filterStatus]);

  const getUnitIcon = (type: string) => {
    const IconComponent = typeIcons[type as keyof typeof typeIcons] || Package;
    return IconComponent;
  };

  const getUnitTypeColor = (type: string) => {
    return typeColors[type as keyof typeof typeColors] || "text-gray-600 bg-gray-50";
  };

  const exportUnits = () => {
    const csvContent = [
      ["ID", "Name", "Symbol", "Category", "Type", "Status", "Description", "Conversion Factor", "Base Unit", "Created At"].join(","),
      ...filteredUnits.map(unit => [
        unit.id,
        unit.name,
        unit.symbol,
        unit.category,
        unit.type,
        unit.status,
        unit.description || "",
        unit.conversionFactor || "",
        unit.baseUnit || "",
        unit.createdAt
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'units_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Ruler className="w-8 h-8 text-blue-600" />
              Units Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage measurement units, categories, and conversion rules
            </p>
          </div>
          <Link href="/dashboard/settings/units/register">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Unit
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUnits.length}</div>
              <p className="text-xs text-muted-foreground">All units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Units</CardTitle>
              <Ruler className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUnits.filter(u => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Calculator className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockUnits.map(unit => unit.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">Unit categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
              <Filter className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredUnits.length}</div>
              <p className="text-xs text-muted-foreground">Current filter</p>
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
                    placeholder="Search units..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterType("all");
                  setFilterStatus("all");
                }}
              >
                Clear Filters
              </Button>

              <Button variant="outline" onClick={exportUnits}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Units Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Units List</CardTitle>
                <CardDescription>
                  Manage your measurement units and their properties
                </CardDescription>
              </div>
              <Badge variant="outline">
                {filteredUnits.length} of {mockUnits.length} units
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => {
                  const IconComponent = getUnitIcon(unit.type);
                  const typeColorClass = getUnitTypeColor(unit.type);

                  return (
                    <TableRow key={unit.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${typeColorClass}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{unit.name}</div>
                            {unit.description && (
                              <div className="text-sm text-gray-500">{unit.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{unit.symbol}</TableCell>
                      <TableCell>{unit.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {unit.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={unit.status === "active" ? "default" : "secondary"}>
                          {unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {unit.conversionFactor && unit.baseUnit && (
                          <span>
                            {unit.conversionFactor} × {unit.baseUnit}
                          </span>
                        )}
                        {(!unit.conversionFactor || !unit.baseUnit) && (
                          <span className="text-gray-400">Base unit</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(unit.createdAt).toLocaleDateString()}
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
                              Edit Unit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Unit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredUnits.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No units found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}