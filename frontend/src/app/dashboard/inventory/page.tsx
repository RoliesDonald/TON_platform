"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  TrendingUp,
  Users,
  ClipboardList,
  Plus,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const inventoryStats = [
  {
    title: "Total Parts",
    value: "1,247",
    change: "+12%",
    icon: Package,
    description: "Different parts in inventory"
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "-8%",
    icon: TrendingUp,
    description: "Items requiring reorder"
  },
  {
    title: "Active Suppliers",
    value: "45",
    change: "+5%",
    icon: Users,
    description: "Registered suppliers"
  },
  {
    title: "Pending Orders",
    value: "8",
    change: "+2",
    icon: ClipboardList,
    description: "Purchase orders pending"
  }
]

const inventoryModules = [
  {
    title: "Parts Inventory",
    description: "Manage and track all vehicle parts and components",
    icon: Package,
    href: "/dashboard/inventory/parts",
    color: "bg-blue-500",
    stats: {
      total: "1,247 parts",
      categories: "15 categories",
      value: "$125,430"
    }
  },
  {
    title: "Stock Levels",
    description: "Monitor stock quantities and reorder points",
    icon: TrendingUp,
    href: "/dashboard/inventory/stock",
    color: "bg-green-500",
    stats: {
      total: "23 low stock",
      "in stock": "1,124 items",
      "out of stock": "5 items"
    }
  },
  {
    title: "Suppliers",
    description: "Manage supplier information and relationships",
    icon: Users,
    href: "/dashboard/inventory/suppliers",
    color: "bg-purple-500",
    stats: {
      total: "45 suppliers",
      active: "42 active",
      new: "3 this month"
    }
  },
  {
    title: "Purchase Orders",
    description: "Track and manage purchase orders",
    icon: ClipboardList,
    href: "/dashboard/inventory/purchase-orders",
    color: "bg-orange-500",
    stats: {
      total: "156 orders",
      pending: "8 pending",
      completed: "148 completed"
    }
  }
]

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage parts, stock levels, suppliers, and purchase orders
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inventoryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={
                  stat.change.startsWith('+') ? 'text-green-600' :
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-blue-600'
                }>
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Modules */}
      <div className="grid gap-6 md:grid-cols-2">
        {inventoryModules.map((module) => (
          <Card key={module.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${module.color} text-white`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {Object.entries(module.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-semibold">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
              <Link href={module.href}>
                <Button variant="outline" className="w-full">
                  Open {module.title}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest inventory updates and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Low Stock Alert",
                item: "Brake Pads - Front",
                quantity: "5 units remaining",
                time: "2 hours ago",
                type: "warning"
              },
              {
                action: "New Purchase Order",
                item: "PO-2024-156",
                quantity: "25 items",
                time: "4 hours ago",
                type: "success"
              },
              {
                action: "Supplier Updated",
                item: "AutoParts Direct",
                quantity: "Contact info updated",
                time: "1 day ago",
                type: "info"
              },
              {
                action: "Stock Received",
                item: "Oil Filters",
                quantity: "100 units",
                time: "2 days ago",
                type: "success"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                <Badge
                  variant={
                    activity.type === 'warning' ? 'destructive' :
                    activity.type === 'success' ? 'default' : 'secondary'
                  }
                >
                  {activity.action}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{activity.item}</p>
                  <p className="text-sm text-muted-foreground">{activity.quantity}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}