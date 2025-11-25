"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Package,
  Ruler,
  Plus,
  Search,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Shield,
  Bell,
  Database,
  Globe,
  Building
} from "lucide-react";
import Link from "next/link";

interface SystemStats {
  totalUnits: number;
  activeUnits: number;
  categories: number;
  recentUpdates: number;
}

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
  }
];

const systemMenuItems = [
  {
    title: "Units",
    description: "Manage measurement units (kg, cm, pcs, etc.)",
    icon: Ruler,
    href: "/dashboard/settings/units",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Categories",
    description: "Organize units by categories and types",
    icon: Package,
    href: "/dashboard/settings/categories",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Conversions",
    description: "Configure unit conversion rules and factors",
    icon: BarChart3,
    href: "/dashboard/settings/conversions",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "User Roles",
    description: "Manage system user roles and permissions",
    icon: Users,
    href: "/dashboard/settings/roles",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Security",
    description: "Security settings and authentication",
    icon: Shield,
    href: "/dashboard/settings/security",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    title: "Notifications",
    description: "Configure system notifications and alerts",
    icon: Bell,
    href: "/dashboard/settings/notifications",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    title: "Database",
    description: "Database configuration and backup settings",
    icon: Database,
    href: "/dashboard/settings/database",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    title: "Localization",
    description: "Language, currency, and regional settings",
    icon: Globe,
    href: "/dashboard/settings/localization",
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  },
  {
    title: "Company Info",
    description: "Company details and business information",
    icon: Building,
    href: "/dashboard/settings/company",
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  }
];

export default function SystemSettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<SystemStats>({
    totalUnits: 0,
    activeUnits: 0,
    categories: 0,
    recentUpdates: 0
  });
  const [recentUnits, setRecentUnits] = useState<Unit[]>([]);

  useEffect(() => {
    // Calculate stats from mock data
    const activeUnitCount = mockUnits.filter(unit => unit.status === "active").length;
    const categoryCount = new Set(mockUnits.map(unit => unit.category)).size;
    const recentCount = mockUnits.filter(unit => {
      const updatedAt = new Date(unit.lastModified);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return updatedAt >= weekAgo;
    }).length;

    setStats({
      totalUnits: mockUnits.length,
      activeUnits: activeUnitCount,
      categories: categoryCount,
      recentUpdates: recentCount
    });

    setRecentUnits(mockUnits.slice(0, 5));
  }, []);

  const filteredMenuItems = systemMenuItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Configure and manage your system settings and preferences
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Ruler className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUnits}</div>
              <p className="text-xs text-muted-foreground">Measurement units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Units</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUnits}</div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
              <p className="text-xs text-muted-foreground">Unit categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
              <Settings className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentUpdates}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Navigate to different system settings sections
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search settings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${item.bgColor}`}>
                            <IconComponent className={`h-6 w-6 ${item.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Units */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Units</CardTitle>
                <CardDescription>
                  Recently added or modified measurement units
                </CardDescription>
              </div>
              <Link href="/dashboard/settings/units">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{unit.name}</h4>
                      <p className="text-sm text-gray-600">{unit.symbol} • {unit.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={unit.status === "active" ? "default" : "secondary"}>
                      {unit.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(unit.lastModified).toLocaleDateString()}
                    </span>
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