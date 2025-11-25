"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Wrench,
  FileText,
  Download,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Eye
} from "lucide-react"
import Link from "next/link"

const reportsStats = [
  {
    title: "Fleet Utilization",
    value: "87%",
    change: "+5%",
    icon: Car,
    description: "Average vehicle utilization",
    color: "text-blue-600"
  },
  {
    title: "Revenue Growth",
    value: "+23%",
    change: "+8%",
    icon: TrendingUp,
    description: "Month over month growth",
    color: "text-green-600"
  },
  {
    title: "Maintenance Efficiency",
    value: "94%",
    change: "+2%",
    icon: Wrench,
    description: "On-time completion rate",
    color: "text-purple-600"
  },
  {
    title: "Total Revenue",
    value: "$234.5K",
    change: "+15%",
    icon: DollarSign,
    description: "This month's revenue",
    color: "text-orange-600"
  }
]

const reportsModules = [
  {
    title: "Fleet Performance",
    description: "Analyze vehicle utilization, performance metrics, and operational efficiency",
    icon: Car,
    href: "/dashboard/reports/fleet",
    color: "bg-blue-500",
    stats: {
      vehicles: "45 vehicles",
      utilization: "87% avg",
      efficiency: "94% on-time"
    }
  },
  {
    title: "Financial Reports",
    description: "Revenue analysis, cost tracking, and financial performance metrics",
    icon: DollarSign,
    href: "/dashboard/reports/financial",
    color: "bg-green-500",
    stats: {
      revenue: "$234.5K MTD",
      growth: "+23% MoM",
      profit: "18.5% margin"
    }
  },
  {
    title: "Maintenance Reports",
    description: "Maintenance schedules, completion rates, and service performance analytics",
    icon: Wrench,
    href: "/dashboard/reports/maintenance",
    color: "bg-purple-500",
    stats: {
      completed: "156 jobs",
      efficiency: "94% rate",
      downtime: "2.3% avg"
    }
  }
]

const recentReports = [
  {
    name: "Monthly Fleet Performance Report",
    type: "Fleet Performance",
    date: "2024-11-20",
    status: "completed",
    size: "2.4 MB",
    format: "PDF"
  },
  {
    name: "Q3 Financial Summary",
    type: "Financial Reports",
    date: "2024-11-18",
    status: "completed",
    size: "1.8 MB",
    format: "Excel"
  },
  {
    name: "Maintenance Efficiency Analysis",
    type: "Maintenance Reports",
    date: "2024-11-15",
    status: "processing",
    size: "-",
    format: "PDF"
  },
  {
    name: "Weekly Utilization Report",
    type: "Fleet Performance",
    date: "2024-11-14",
    status: "completed",
    size: "856 KB",
    format: "CSV"
  }
]

const quickInsights = [
  {
    title: "Top Performing Vehicle",
    value: "Van-003",
    change: "98% utilization",
    icon: Car,
    color: "text-green-600",
    description: "Most efficient vehicle this month"
  },
  {
    title: "Maintenance Alert",
    value: "3 vehicles",
    change: "due this week",
    icon: AlertCircle,
    color: "text-orange-600",
    description: "Scheduled maintenance required"
  },
  {
    title: "Revenue Driver",
    value: "Fleet Services",
    change: "65% of total",
    icon: TrendingUp,
    color: "text-blue-600",
    description: "Primary revenue source"
  },
  {
    title: "Cost Optimization",
    value: "$12.5K",
    change: "saved this month",
    icon: DollarSign,
    color: "text-green-600",
    description: "Through efficient scheduling"
  }
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Reports
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportsStats.map((stat) => (
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

      {/* Report Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportsModules.map((module) => (
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
                  View Reports
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>Key performance indicators and actionable insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickInsights.map((insight, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-lg ${insight.color} bg-opacity-10`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{insight.title}</div>
                  <div className={`font-semibold ${insight.color}`}>{insight.value}</div>
                  <div className="text-xs text-muted-foreground">{insight.change}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest generated reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {report.type} • {report.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={report.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {report.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Schedule</CardTitle>
            <CardDescription>Automated report generation schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Daily Utilization Report",
                  schedule: "Every day at 8:00 AM",
                  nextRun: "Today, 8:00 AM",
                  status: "active"
                },
                {
                  name: "Weekly Performance Summary",
                  schedule: "Every Monday at 9:00 AM",
                  nextRun: "Monday, 9:00 AM",
                  status: "active"
                },
                {
                  name: "Monthly Financial Report",
                  schedule: "1st of each month",
                  nextRun: "Dec 1, 9:00 AM",
                  status: "active"
                },
                {
                  name: "Quarterly Analytics",
                  schedule: "Start of quarter",
                  nextRun: "Jan 1, 2025",
                  status: "scheduled"
                }
              ].map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      schedule.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{schedule.name}</div>
                      <div className="text-xs text-muted-foreground">{schedule.schedule}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium">{schedule.nextRun}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {schedule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Key metrics visualization and trend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Fleet Utilization",
                current: 87,
                previous: 82,
                target: 90,
                unit: "%",
                icon: Car,
                color: "bg-blue-500"
              },
              {
                title: "Revenue Growth",
                current: 23,
                previous: 15,
                target: 25,
                unit: "%",
                icon: TrendingUp,
                color: "bg-green-500"
              },
              {
                title: "Maintenance Efficiency",
                current: 94,
                previous: 92,
                target: 95,
                unit: "%",
                icon: Wrench,
                color: "bg-purple-500"
              }
            ].map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${trend.color} bg-opacity-10`}>
                      <trend.icon className={`h-4 w-4 text-${trend.color.split('-')[1]}-600`} />
                    </div>
                    <h4 className="font-medium">{trend.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Target: {trend.target}{trend.unit}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current</span>
                    <span className="font-semibold">{trend.current}{trend.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${trend.color} h-2 rounded-full`}
                      style={{ width: `${(trend.current / trend.target) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Previous: {trend.previous}{trend.unit}</span>
                    <span className={
                      trend.current > trend.previous ? 'text-green-600' : 'text-red-600'
                    }>
                      {trend.current > trend.previous ? '+' : ''}
                      {trend.current - trend.previous}{trend.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}