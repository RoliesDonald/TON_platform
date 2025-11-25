"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Target,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react"

const financialData = [
  {
    month: "November 2024",
    revenue: 234567.89,
    costs: 191234.56,
    profit: 43333.33,
    profitMargin: 18.5,
    invoices: 156,
    paidInvoices: 142,
    outstandingInvoices: 14,
    expenses: 85432.12,
    operatingCosts: 72345.23,
    maintenanceCosts: 18934.45,
    fuelCosts: 23456.78,
    laborCosts: 45678.90,
    insuranceCosts: 12345.67,
    otherCosts: 15678.54
  },
  {
    month: "October 2024",
    revenue: 198234.45,
    costs: 165789.23,
    profit: 32445.22,
    profitMargin: 16.4,
    invoices: 142,
    paidInvoices: 128,
    outstandingInvoices: 14,
    expenses: 71234.89,
    operatingCosts: 62345.67,
    maintenanceCosts: 15678.90,
    fuelCosts: 21234.56,
    laborCosts: 39876.54,
    insuranceCosts: 11234.78,
    otherCosts: 14234.67
  },
  {
    month: "September 2024",
    revenue: 212456.78,
    costs: 178567.34,
    profit: 33889.44,
    profitMargin: 16.0,
    invoices: 148,
    paidInvoices: 135,
    outstandingInvoices: 13,
    expenses: 78901.23,
    operatingCosts: 67890.45,
    maintenanceCosts: 17345.67,
    fuelCosts: 19876.54,
    laborCosts: 41234.78,
    insuranceCosts: 11890.34,
    otherCosts: 13989.12
  }
]

const revenueStreams = [
  {
    category: "Fleet Services",
    revenue: 156789.45,
    percentage: 66.8,
    growth: 12.5,
    color: "bg-blue-500"
  },
  {
    category: "Maintenance Contracts",
    revenue: 45678.90,
    percentage: 19.5,
    growth: 8.3,
    color: "bg-green-500"
  },
  {
    category: "Emergency Services",
    revenue: 23456.34,
    percentage: 10.0,
    growth: 15.7,
    color: "bg-orange-500"
  },
  {
    category: "Consulting",
    revenue: 8643.20,
    percentage: 3.7,
    growth: 5.2,
    color: "bg-purple-500"
  }
]

const expenseCategories = [
  {
    category: "Labor Costs",
    amount: 45678.90,
    percentage: 23.9,
    change: -5.2,
    color: "bg-red-500"
  },
  {
    category: "Fuel Costs",
    amount: 23456.78,
    percentage: 12.3,
    change: 8.7,
    color: "bg-orange-500"
  },
  {
    category: "Maintenance",
    amount: 18934.45,
    percentage: 9.9,
    change: 3.1,
    color: "bg-yellow-500"
  },
  {
    category: "Insurance",
    amount: 12345.67,
    percentage: 6.5,
    change: 2.4,
    color: "bg-blue-500"
  },
  {
    category: "Other Operating",
    amount: 90818.76,
    percentage: 47.4,
    change: -1.8,
    color: "bg-gray-500"
  }
]

const timeRanges = ["This Month", "Last Month", "This Quarter", "Last Quarter", "This Year", "Last Year"]

export default function FinancialReportsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month")
  const [selectedReport, setSelectedReport] = useState("overview")

  const currentMonth = financialData[0]
  const previousMonth = financialData[1]

  const monthlyGrowth = {
    revenue: ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1),
    costs: ((currentMonth.costs - previousMonth.costs) / previousMonth.costs * 100).toFixed(1),
    profit: ((currentMonth.profit - previousMonth.profit) / previousMonth.profit * 100).toFixed(1)
  }

  const getGrowthIcon = (growth: string) => {
    return parseFloat(growth) >= 0 ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: string) => {
    return parseFloat(growth) >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">
            Revenue analysis, cost tracking, and financial performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.revenue.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(monthlyGrowth.revenue)}
              <span className={getGrowthColor(monthlyGrowth.revenue)}>
                {monthlyGrowth.revenue}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.costs.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(monthlyGrowth.costs)}
              <span className={getGrowthColor(monthlyGrowth.costs)}>
                {monthlyGrowth.costs}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${currentMonth.profit.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getGrowthIcon(monthlyGrowth.profit)}
              <span className={getGrowthColor(monthlyGrowth.profit)}>
                {monthlyGrowth.profit}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.profitMargin}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Progress value={currentMonth.profitMargin} className="flex-1 h-2" />
              <span>{(currentMonth.profitMargin / 20 * 100).toFixed(0)}% of target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stream.color}`}></div>
                      <span className="text-sm font-medium">{stream.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">${stream.revenue.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {stream.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={stream.percentage} className="flex-1 h-2" />
                    <span className={`text-xs flex items-center ${getGrowthColor(stream.growth.toString())}`}>
                      {getGrowthIcon(stream.growth.toString())}
                      {stream.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((expense, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${expense.color}`}></div>
                      <span className="text-sm font-medium">{expense.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">${expense.amount.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {expense.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={expense.percentage} className="flex-1 h-2" />
                    <span className={`text-xs flex items-center ${getGrowthColor(expense.change.toString())}`}>
                      {getGrowthIcon(expense.change.toString())}
                      {expense.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Analysis */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Invoice Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Invoices</span>
                <span className="font-semibold">{currentMonth.invoices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Paid</span>
                <span className="font-semibold text-green-600">{currentMonth.paidInvoices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600">Outstanding</span>
                <span className="font-semibold text-orange-600">{currentMonth.outstandingInvoices}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Rate</span>
                  <span className="font-semibold">
                    {((currentMonth.paidInvoices / currentMonth.invoices) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Cash Flow Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Inflow</span>
                  <span className="font-semibold text-green-600">+${(currentMonth.revenue - (currentMonth.revenue * 0.1)).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Outflow</span>
                  <span className="font-semibold text-red-600">-${currentMonth.costs.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net Cash Flow</span>
                  <span className={`font-bold ${currentMonth.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentMonth.profit > 0 ? '+' : ''}${currentMonth.profit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance vs Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue Target</span>
                  <span className="font-semibold">$250,000</span>
                </div>
                <Progress value={(currentMonth.revenue / 250000) * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>${currentMonth.revenue.toLocaleString()}</span>
                  <span>{((currentMonth.revenue / 250000) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget Limit</span>
                  <span className="font-semibold">$200,000</span>
                </div>
                <Progress value={(currentMonth.costs / 200000) * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>${currentMonth.costs.toLocaleString()}</span>
                  <span>{((currentMonth.costs / 200000) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Trends</CardTitle>
          <CardDescription>3-month financial performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Costs</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Payment Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.map((month, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell>${month.revenue.toLocaleString()}</TableCell>
                  <TableCell>${month.costs.toLocaleString()}</TableCell>
                  <TableCell className={month.profit > 0 ? "text-green-600" : "text-red-600"}>
                    ${month.profit.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={month.profitMargin >= 15 ? "text-green-600" : "text-orange-600"}>
                        {month.profitMargin}%
                      </span>
                      {month.profitMargin >= 15 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div>{month.invoices}</div>
                      <div className="text-xs text-muted-foreground">
                        {month.paidInvoices} paid
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className={
                        (month.paidInvoices / month.invoices) >= 0.9 ? "text-green-600" : "text-orange-600"
                      }>
                        {((month.paidInvoices / month.invoices) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financial Health Indicators */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profitability Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">Positive</span>
            </div>
            <p className="text-xs text-muted-foreground">3-month growth trend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Budget Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">On Track</span>
            </div>
            <p className="text-xs text-muted-foreground">Within budget limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cash Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">Healthy</span>
            </div>
            <p className="text-xs text-muted-foreground">Positive cash flow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">+{monthlyGrowth.revenue}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}