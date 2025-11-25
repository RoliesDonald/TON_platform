"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Plus,
  CreditCard,
  History,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowRight,
  Clock
} from "lucide-react"
import Link from "next/link"

const billingStats = [
  {
    title: "Total Invoices",
    value: "248",
    change: "+15%",
    icon: FileText,
    description: "This month's invoices",
    color: "text-blue-600"
  },
  {
    title: "Outstanding Amount",
    value: "$12,450",
    change: "+8%",
    icon: DollarSign,
    description: "Unpaid invoices",
    color: "text-red-600"
  },
  {
    title: "This Month Revenue",
    value: "$45,680",
    change: "+23%",
    icon: TrendingUp,
    description: "Paid invoices",
    color: "text-green-600"
  },
  {
    title: "Payment Links",
    value: "18",
    change: "+5",
    icon: CreditCard,
    description: "Active payment links",
    color: "text-purple-600"
  }
]

const billingModules = [
  {
    title: "All Invoices",
    description: "View and manage all customer invoices",
    icon: FileText,
    href: "/dashboard/invoicing/invoices",
    color: "bg-blue-500",
    stats: {
      total: "248 invoices",
      draft: "12 draft",
      sent: "236 sent"
    }
  },
  {
    title: "Create Invoice",
    description: "Generate new invoices for customers",
    icon: Plus,
    href: "/dashboard/invoicing/create",
    color: "bg-green-500",
    stats: {
      action: "Create new",
      templates: "5 templates",
      recurring: "3 recurring"
    }
  },
  {
    title: "Payment Links",
    description: "Create and manage payment links",
    icon: CreditCard,
    href: "/dashboard/invoicing/payment-links",
    color: "bg-purple-500",
    stats: {
      total: "18 active",
      paid: "145 paid",
      conversion: "78%"
    }
  },
  {
    title: "Payment History",
    description: "Track all payment transactions",
    icon: History,
    href: "/dashboard/invoicing/payment-history",
    color: "bg-orange-500",
    stats: {
      total: "1,234 payments",
      value: "$234,560",
      thisMonth: "$45,680"
    }
  },
  {
    title: "All Quotations",
    description: "Manage customer quotations and estimates",
    icon: FileText,
    href: "/dashboard/invoicing/quotations",
    color: "bg-teal-500",
    stats: {
      total: "67 quotes",
      accepted: "45 accepted",
      pending: "22 pending"
    }
  }
]

const recentActivity = [
  {
    action: "Invoice Paid",
    item: "INV-2024-156",
    customer: "John Smith",
    amount: "$1,250.00",
    time: "2 hours ago",
    type: "success"
  },
  {
    action: "Invoice Overdue",
    item: "INV-2024-152",
    customer: "Sarah Johnson",
    amount: "$875.50",
    time: "4 hours ago",
    type: "warning"
  },
  {
    action: "Payment Link Created",
    item: "PL-2024-089",
    customer: "Mike Davis",
    amount: "$450.00",
    time: "1 day ago",
    type: "info"
  },
  {
    action: "Quote Accepted",
    item: "QT-2024-034",
    customer: "Emily Wilson",
    amount: "$2,340.00",
    time: "2 days ago",
    type: "success"
  },
  {
    action: "New Invoice Created",
    item: "INV-2024-157",
    customer: "Robert Brown",
    amount: "$3,680.00",
    time: "3 days ago",
    type: "info"
  }
]

export default function InvoicingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoicing & Billing</h1>
          <p className="text-muted-foreground">
            Manage invoices, quotations, and payment processing
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {billingStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
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

      {/* Billing Modules */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {billingModules.map((module) => (
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
          <CardDescription>Latest invoicing and billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                <Badge
                  variant={
                    activity.type === 'warning' ? 'destructive' :
                    activity.type === 'success' ? 'default' : 'secondary'
                  }
                  className="flex items-center gap-1"
                >
                  {activity.type === 'warning' && <AlertCircle className="h-3 w-3" />}
                  {activity.type === 'success' && <TrendingUp className="h-3 w-3" />}
                  {activity.type === 'info' && <Clock className="h-3 w-3" />}
                  {activity.action}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{activity.item}</p>
                  <p className="text-sm text-muted-foreground">{activity.customer}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{activity.amount}</div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Create Invoice</h3>
                <p className="text-sm text-muted-foreground">Generate new invoice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Create Quote</h3>
                <p className="text-sm text-muted-foreground">New quotation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Payment Link</h3>
                <p className="text-sm text-muted-foreground">Quick payment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Overdue Report</h3>
                <p className="text-sm text-muted-foreground">View overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}