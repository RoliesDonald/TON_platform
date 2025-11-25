"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Wrench,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Timer,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface QuickStats {
  totalWorkOrders: number
  activeWorkOrders: number
  completedToday: number
  pendingAssignment: number
  averageCompletionTime: string
  todayRevenue: number
}

interface RecentActivity {
  id: string
  type: "created" | "completed" | "assigned" | "cancelled"
  title: string
  description: string
  timestamp: string
  workOrderNumber: string
}

export default function WorkOrdersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    fetchWorkOrderData()
  }, [])

  const fetchWorkOrderData = async () => {
    try {
      // Mock stats data
      const mockStats: QuickStats = {
        totalWorkOrders: 156,
        activeWorkOrders: 12,
        completedToday: 8,
        pendingAssignment: 3,
        averageCompletionTime: "2.5 hours",
        todayRevenue: 3245.50
      }

      // Mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: "1",
          type: "completed",
          title: "Work Order Completed",
          description: "WO-2024-089: Transmission repair completed successfully",
          timestamp: "30 minutes ago",
          workOrderNumber: "WO-2024-089"
        },
        {
          id: "2",
          type: "created",
          title: "New Work Order",
          description: "WO-2024-095: Oil change service for John Smith",
          timestamp: "1 hour ago",
          workOrderNumber: "WO-2024-095"
        },
        {
          id: "3",
          type: "assigned",
          title: "Work Order Assigned",
          description: "WO-2024-094: Brake repair assigned to Mike Johnson",
          timestamp: "2 hours ago",
          workOrderNumber: "WO-2024-094"
        },
        {
          id: "4",
          type: "created",
          title: "Emergency Work Order",
          description: "WO-2024-096: Engine diagnostic requested - urgent",
          timestamp: "3 hours ago",
          workOrderNumber: "WO-2024-096"
        },
        {
          id: "5",
          type: "completed",
          title: "Work Order Completed",
          description: "WO-2024-088: AC repair completed ahead of schedule",
          timestamp: "4 hours ago",
          workOrderNumber: "WO-2024-088"
        }
      ]

      setTimeout(() => {
        setStats(mockStats)
        setRecentActivity(mockActivity)
        setLoading(false)
      }, 1000)

    } catch (error) {
      console.error("Failed to fetch work order data:", error)
      setLoading(false)
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'created': return <Plus className="h-4 w-4 text-blue-500" />
      case 'assigned': return <Users className="h-4 w-4 text-purple-500" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'completed': return "bg-green-100 text-green-800 border-green-200"
      case 'created': return "bg-blue-100 text-blue-800 border-blue-200"
      case 'assigned': return "bg-purple-100 text-purple-800 border-purple-200"
      case 'cancelled': return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Work Orders</h1>
            <p className="text-muted-foreground">Manage and track all work orders</p>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track all work orders and service operations</p>
        </div>
        <Button onClick={() => router.push("/dashboard/workorders/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Work Order
        </Button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Work Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkOrders}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active Work Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeWorkOrders}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pending Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingAssignment}</div>
              <p className="text-xs text-muted-foreground">Need technician</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Completion Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCompletionTime}</div>
              <p className="text-xs text-muted-foreground">Per work order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.todayRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From completed work</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common work order management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => router.push("/dashboard/workorders/active")}
              >
                <Activity className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">View Active Work Orders</div>
                  <div className="text-xs text-muted-foreground">
                    See all pending and in-progress orders
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 mt-2" />
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => router.push("/dashboard/workorders/create")}
              >
                <Plus className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Create New Work Order</div>
                  <div className="text-xs text-muted-foreground">
                    Start a new service request
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 mt-2" />
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => router.push("/dashboard/workorders/history")}
              >
                <Calendar className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Work Order History</div>
                  <div className="text-xs text-muted-foreground">
                    View completed and cancelled orders
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 mt-2" />
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => router.push("/dashboard/fleet")}
              >
                <Timer className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Schedule Maintenance</div>
                  <div className="text-xs text-muted-foreground">
                    Plan routine service appointments
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 mt-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest work order updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // Navigate to appropriate page based on activity type
                    if (activity.type === 'completed' || activity.type === 'cancelled') {
                      router.push("/dashboard/workorders/history")
                    } else {
                      router.push("/dashboard/workorders/active")
                    }
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <Badge className={getActivityColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/workorders/active")}
              >
                View All Work Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Priority Tasks
          </CardTitle>
          <CardDescription>
            Urgent work orders requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                <span className="text-sm font-medium">2 work orders</span>
              </div>
              <p className="text-sm text-gray-600">Critical repairs requiring immediate attention</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => router.push("/dashboard/workorders/active")}
              >
                View Details
              </Button>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-100 text-orange-800">High Priority</Badge>
                <span className="text-sm font-medium">5 work orders</span>
              </div>
              <p className="text-sm text-gray-600">Important repairs to be completed today</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => router.push("/dashboard/workorders/active")}
              >
                View Details
              </Button>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-800">Pending Assignment</Badge>
                <span className="text-sm font-medium">3 work orders</span>
              </div>
              <p className="text-sm text-gray-600">Work orders waiting for technician assignment</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => router.push("/dashboard/workorders/active")}
              >
                Assign Technicians
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}