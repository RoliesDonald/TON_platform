"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Shield,
  Settings,
  Building,
  Car,
  Wrench,
  Package,
  Warehouse,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  MoreHorizontal,
  ArrowRight,
  UserPlus
} from "lucide-react"
import EmployeeRegistrationForm from "@/components/EmployeeRegistrationForm"
import Link from "next/link"

const userManagementStats = [
  {
    title: "Total Employees",
    value: "147",
    change: "+12 this month",
    icon: Users,
    description: "Across all business sectors",
    color: "text-blue-600"
  },
  {
    title: "Active Users",
    value: "134",
    change: "+8 this week",
    icon: Activity,
    description: "Currently active employees",
    color: "text-green-600"
  },
  {
    title: "New Hires",
    value: "18",
    change: "+4 vs last month",
    icon: UserPlus,
    description: "Recently onboarded",
    color: "text-purple-600"
  },
  {
    title: "Departments",
    value: "12",
    change: "+2 this quarter",
    icon: Building,
    description: "Total departments",
    color: "text-orange-600"
  }
]

const businessSectors = [
  {
    title: "Fleet Maintenance Business",
    description: "Manage drivers, mechanics, and fleet operations staff",
    icon: Car,
    href: "/dashboard/user-management/fleet-maintenance",
    color: "bg-blue-500",
    stats: {
      employees: "45 employees",
      departments: "4 departments",
      roles: "12 different roles"
    },
    recentActivity: "3 new mechanics hired",
    growth: "+8% this month"
  },
  {
    title: "Workshop Business",
    description: "Manage technicians, service advisors, and workshop staff",
    icon: Wrench,
    href: "/dashboard/user-management/workshop",
    color: "bg-orange-500",
    stats: {
      employees: "38 employees",
      departments: "3 departments",
      roles: "9 different roles"
    },
    recentActivity: "2 new technicians onboarded",
    growth: "+12% this month"
  },
  {
    title: "Vehicle Rental Business",
    description: "Manage rental agents, customer service, and support staff",
    icon: Package,
    href: "/dashboard/user-management/vehicle-rental",
    color: "bg-green-500",
    stats: {
      employees: "32 employees",
      departments: "3 departments",
      roles: "8 different roles"
    },
    recentActivity: "New branch manager hired",
    growth: "+5% this month"
  },
  {
    title: "Warehouse Business",
    description: "Manage warehouse staff, inventory managers, and logistics personnel",
    icon: Warehouse,
    href: "/dashboard/user-management/warehouse",
    color: "bg-purple-500",
    stats: {
      employees: "32 employees",
      departments: "2 departments",
      roles: "7 different roles"
    },
    recentActivity: "4 new warehouse operators",
    growth: "+15% this month"
  }
]

const recentEmployeeActivity = [
  {
    name: "John Martinez",
    action: "Added to Fleet Maintenance",
    role: "Senior Mechanic",
    time: "2 hours ago",
    avatar: "JM",
    sector: "fleet-maintenance"
  },
  {
    name: "Sarah Chen",
    action: "Role updated to Supervisor",
    role: "Workshop Supervisor",
    time: "4 hours ago",
    avatar: "SC",
    sector: "workshop"
  },
  {
    name: "Michael Roberts",
    action: "Completed onboarding",
    role: "Rental Agent",
    time: "1 day ago",
    avatar: "MR",
    sector: "vehicle-rental"
  },
  {
    name: "Lisa Thompson",
    action: "Department transfer approved",
    role: "Warehouse Manager",
    time: "2 days ago",
    avatar: "LT",
    sector: "warehouse"
  }
]

const upcomingTasks = [
  {
    title: "Performance Reviews",
    count: "12 reviews",
    due: "This week",
    priority: "high",
    type: "performance"
  },
  {
    title: "Training Sessions",
    count: "5 sessions",
    due: "Next week",
    priority: "medium",
    type: "training"
  },
  {
    title: "Contract Renewals",
    count: "8 renewals",
    due: "This month",
    priority: "high",
    type: "contract"
  },
  {
    title: "Onboarding Pending",
    count: "3 candidates",
    due: "Next 3 days",
    priority: "medium",
    type: "onboarding"
  }
]

export default function UserManagementPage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "fleet-maintenance":
        return "bg-blue-100 text-blue-800"
      case "workshop":
        return "bg-orange-100 text-orange-800"
      case "vehicle-rental":
        return "bg-green-100 text-green-800"
      case "warehouse":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage employees across all business sectors and departments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <EmployeeRegistrationForm businessSector="fleet-maintenance" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userManagementStats.map((stat) => (
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
                  stat.change.includes('+') ? 'text-green-600' :
                  stat.change.includes('-') ? 'text-red-600' : 'text-blue-600'
                }>
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Sectors */}
      <div className="grid gap-6 md:grid-cols-2">
        {businessSectors.map((sector) => (
          <Card key={sector.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${sector.color} text-white`}>
                  <sector.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{sector.title}</CardTitle>
                  <CardDescription>{sector.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {Object.entries(sector.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-semibold">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <div className="font-medium">{sector.recentActivity}</div>
                  <div className="text-xs text-muted-foreground">{sector.growth}</div>
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <Link href={sector.href}>
                <Button variant="outline" className="w-full">
                  Manage Users
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity and Upcoming Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Employee Activity</CardTitle>
            <CardDescription>Latest employee updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployeeActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {activity.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.name}</div>
                      <div className="text-xs text-muted-foreground">{activity.action}</div>
                      <div className="text-xs text-blue-600">{activity.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getSectorColor(activity.sector)} variant="outline" style={{fontSize: '10px'}}>
                      {activity.sector.replace('-', ' ')}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming HR Tasks</CardTitle>
            <CardDescription>Important deadlines and tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                      {
                        task.type === 'performance' ? <TrendingUp className="h-4 w-4" /> :
                        task.type === 'training' ? <Settings className="h-4 w-4" /> :
                        task.type === 'contract' ? <Shield className="h-4 w-4" /> :
                        <Users className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.count}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getPriorityColor(task.priority)} variant="outline" style={{fontSize: '10px'}}>
                      {task.priority}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{task.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}