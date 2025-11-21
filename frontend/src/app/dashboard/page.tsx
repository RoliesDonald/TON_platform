"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import {
  Car,
  Wrench,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
  Settings,
  MapPin,
  FileText,
  Calendar,
  ClipboardList,
  Scan,
  Truck,
  Hand,
  Map,
  Clock,
  CreditCard,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();

  // Role-specific dashboard content
  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case "Administrator":
        return {
          title: "Administrator Dashboard",
          description: "Complete system overview and administrative controls",
          quickActions: [
            { label: "Manage Users", href: "/dashboard/users", icon: Users },
            { label: "System Settings", href: "/dashboard/settings", icon: Settings },
            { label: "View Reports", href: "/dashboard/reports", icon: TrendingUp },
          ],
          stats: [
            { label: "Total Users", value: "1,234", change: "+12%" },
            { label: "Active Vehicles", value: "856", change: "+5%" },
            { label: "Revenue", value: "$284,391", change: "+18%" },
            { label: "Work Orders", value: "452", change: "-3%" },
          ],
        };

      case "Area Manager":
        return {
          title: "Regional Dashboard",
          description: "Regional operations overview and performance metrics",
          quickActions: [
            { label: "My Locations", href: "/dashboard/locations", icon: MapPin },
            { label: "Staff Management", href: "/dashboard/staff", icon: Users },
            { label: "Regional Reports", href: "/dashboard/reports", icon: FileText },
          ],
          stats: [
            { label: "Locations", value: "12", change: "+2" },
            { label: "Staff Members", value: "89", change: "+8%" },
            { label: "Regional Revenue", value: "$124,823", change: "+22%" },
            { label: "Customer Satisfaction", value: "4.8", change: "+0.2" },
          ],
        };

      case "Service Advisor":
        return {
          title: "Service Dashboard",
          description: "Customer service and appointment management",
          quickActions: [
            { label: "New Appointment", href: "/dashboard/appointments/new", icon: Calendar },
            { label: "Customer Search", href: "/dashboard/customers", icon: Users },
            { label: "Service Orders", href: "/dashboard/service-orders", icon: ClipboardList },
          ],
          stats: [
            { label: "Today's Appointments", value: "24", change: "+4" },
            { label: "Pending Orders", value: "18", change: "-2" },
            { label: "Customers Served", value: "156", change: "+12" },
            { label: "Avg Service Time", value: "2.3h", change: "-0.5h" },
          ],
        };

      case "Mechanic":
        return {
          title: "Mechanic Dashboard",
          description: "Workshop workspace and assigned tasks",
          quickActions: [
            { label: "My Work Orders", href: "/dashboard/work-orders", icon: ClipboardList },
            { label: "Vehicle Diagnostics", href: "/dashboard/diagnostics", icon: Scan },
            { label: "Parts Request", href: "/dashboard/parts-request", icon: Package },
          ],
          stats: [
            { label: "Active Jobs", value: "6", change: "+1" },
            { label: "Completed Today", value: "4", change: "+2" },
            { label: "Parts Used", value: "23", change: "+8" },
            { label: "Hours Worked", value: "7.5", change: "+0.5" },
          ],
        };

      case "Warehouse Staff":
        return {
          title: "Warehouse Dashboard",
          description: "Inventory management and warehouse operations",
          quickActions: [
            { label: "Stock Check", href: "/dashboard/inventory/check", icon: Package },
            { label: "Receive Shipment", href: "/dashboard/receiving", icon: Truck },
            { label: "Order Picking", href: "/dashboard/picking", icon: Hand },
          ],
          stats: [
            { label: "Low Stock Items", value: "14", change: "-3" },
            { label: "Orders Today", value: "82", change: "+15" },
            { label: "Items Shipped", value: "234", change: "+45" },
            { label: "Accuracy Rate", value: "99.2%", change: "+0.3%" },
          ],
        };

      case "Driver":
        return {
          title: "Driver Dashboard",
          description: "Vehicle assignments and delivery operations",
          quickActions: [
            { label: "Current Route", href: "/dashboard/route", icon: Map },
            { label: "Vehicle Status", href: "/dashboard/vehicle", icon: Car },
            { label: "Time Sheet", href: "/dashboard/time-sheet", icon: Clock },
          ],
          stats: [
            { label: "Deliveries Today", value: "12", change: "+3" },
            { label: "Distance Covered", value: "156 km", change: "+45 km" },
            { label: "On-Time Rate", value: "95%", change: "+2%" },
            { label: "Fuel Used", value: "18.5 L", change: "+2.1 L" },
          ],
        };

      case "Accountant":
        return {
          title: "Financial Dashboard",
          description: "Financial reporting and billing management",
          quickActions: [
            { label: "Create Invoice", href: "/dashboard/invoices/new", icon: FileText },
            { label: "Payment Processing", href: "/dashboard/payments", icon: CreditCard },
            { label: "Financial Reports", href: "/dashboard/financial-reports", icon: TrendingUp },
          ],
          stats: [
            { label: "Pending Invoices", value: "28", change: "-5" },
            { label: "Revenue MTD", value: "$89,234", change: "+15%" },
            { label: "Expenses", value: "$34,821", change: "+8%" },
            { label: "Profit Margin", value: "61%", change: "+3%" },
          ],
        };

      default:
        return {
          title: "Dashboard",
          description: "Welcome to TON Platform",
          quickActions: [],
          stats: [],
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  // Icon mapping
  const Icons = {
    Users,
    Settings,
    TrendingUp,
    Car,
    Wrench,
    Package,
    MapPin,
    FileText,
    Calendar,
    ClipboardList,
    Scan,
    Truck,
    Hand,
    Map,
    Clock,
    CreditCard,
    AlertCircle,
  };

  return (
    <DashboardLayout title={roleContent.title} description={roleContent.description}>
      {/* Welcome Card */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Welcome back, {user?.first_name}!</h2>
              <p className="text-sm text-gray-500 mt-1">
                Here's what's happening with your {user?.role?.toLowerCase()} dashboard today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Your Role</p>
              <p className="text-lg font-medium text-primary-600">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {roleContent.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roleContent.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      stat.change.startsWith("+")
                        ? "bg-green-100 text-green-800"
                        : stat.change.startsWith("-")
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {roleContent.quickActions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleContent.quickActions.map((action, index) => {
              const Icon = Icons[action.icon as keyof typeof Icons];
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Business Modules Overview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 text-primary-600 mr-3" />
              <h4 className="text-lg font-medium text-gray-900">Vehicle Rental</h4>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Manage vehicle fleet, rentals, bookings, and customer reservations
            </p>
            <Link
              href="/dashboard/vehicles"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Manage Vehicles →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Wrench className="h-8 w-8 text-primary-600 mr-3" />
              <h4 className="text-lg font-medium text-gray-900">Workshop Service</h4>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Handle work orders, repairs, maintenance scheduling, and service history
            </p>
            <Link
              href="/dashboard/workshop"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Workshop Operations →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-primary-600 mr-3" />
              <h4 className="text-lg font-medium text-gray-900">Spare Parts Shop</h4>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Manage inventory, parts catalog, sales, and supplier relationships
            </p>
            <Link
              href="/dashboard/inventory"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Inventory Management →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
