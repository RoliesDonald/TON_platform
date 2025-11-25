"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Wrench,
  User,
  Car,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WorkOrderData {
  // Basic Information
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  estimatedHours: number
  estimatedCost: number
  dueDate: string

  // Customer Information
  customerName: string
  customerEmail: string
  customerPhone: string

  // Vehicle Information
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleLicensePlate: string
  vehicleVin: string
  vehicleMileage: string

  // Assignment
  assignedTechnician: string

  // Parts
  parts: Array<{
    id: string
    name: string
    quantity: number
    unitCost: number
    total: number
  }>

  // Labor Items
  laborItems: Array<{
    id: string
    description: string
    hours: number
    rate: number
    total: number
  }>
}

const mockTechnicians = [
  { id: "1", name: "Tom Wilson", specialization: "Engine & Transmission" },
  { id: "2", name: "Mike Johnson", specialization: "General Mechanic" },
  { id: "3", name: "Sarah Davis", specialization: "Electrical & Diagnostics" },
  { id: "4", name: "James Brown", specialization: "Brake & Suspension" },
  { id: "5", name: "Unassigned", specialization: "" }
]

const mockParts = [
  "Engine Oil",
  "Oil Filter",
  "Air Filter",
  "Cabin Air Filter",
  "Brake Pads",
  "Brake Rotors",
  "Spark Plugs",
  "Fuel Filter",
  "Transmission Fluid",
  "Coolant",
  "Battery",
  "Alternator",
  "Starter Motor",
  "Water Pump",
  "Timing Belt",
  "Clutch Kit",
  "Shocks",
  "Struts",
  "Tire",
  "Wheel Bearing"
]

export default function CreateWorkOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [workOrder, setWorkOrder] = useState<WorkOrderData>({
    // Basic Information
    title: "",
    description: "",
    priority: "medium",
    estimatedHours: 1,
    estimatedCost: 100,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Customer Information
    customerName: "",
    customerEmail: "",
    customerPhone: "",

    // Vehicle Information
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: new Date().getFullYear().toString(),
    vehicleLicensePlate: "",
    vehicleVin: "",
    vehicleMileage: "",

    // Assignment
    assignedTechnician: "5", // Default to Unassigned

    // Parts
    parts: [],

    // Labor Items
    laborItems: []
  })

  const calculateTotals = () => {
    const partsTotal = workOrder.parts.reduce((sum, part) => sum + part.total, 0)
    const laborTotal = workOrder.laborItems.reduce((sum, labor) => sum + labor.total, 0)
    const total = partsTotal + laborTotal

    return {
      partsTotal,
      laborTotal,
      total,
      estimatedHours: workOrder.laborItems.reduce((sum, labor) => sum + labor.hours, workOrder.estimatedHours)
    }
  }

  const addPart = () => {
    const newPart = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitCost: 0,
      total: 0
    }
    setWorkOrder(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }))
  }

  const updatePart = (id: string, field: keyof typeof newPart, value: string | number) => {
    setWorkOrder(prev => ({
      ...prev,
      parts: prev.parts.map(part =>
        part.id === id
          ? { ...part, [field]: field === 'name' ? value : Number(value) }
          : part
      ).map(part => ({
        ...part,
        total: part.quantity * part.unitCost
      }))
    }))
  }

  const removePart = (id: string) => {
    setWorkOrder(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== id)
    }))
  }

  const addLaborItem = () => {
    const newLaborItem = {
      id: Date.now().toString(),
      description: "",
      hours: 1,
      rate: 100,
      total: 100
    }
    setWorkOrder(prev => ({
      ...prev,
      laborItems: [...prev.laborItems, newLaborItem]
    }))
  }

  const updateLaborItem = (id: string, field: keyof typeof newLaborItem, value: string | number) => {
    setWorkOrder(prev => ({
      ...prev,
      laborItems: prev.laborItems.map(labor =>
        labor.id === id
          ? { ...labor, [field]: Number(value) }
          : labor
      ).map(labor => ({
        ...labor,
        total: labor.hours * labor.rate
      }))
    }))
  }

  const removeLaborItem = (id: string) => {
    setWorkOrder(prev => ({
      ...prev,
      laborItems: prev.laborItems.filter(labor => labor.id !== id)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!workOrder.title || !workOrder.customerName || !workOrder.vehicleMake || !workOrder.vehicleModel) {
        throw new Error("Please fill in all required fields")
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/workorders/active")
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create work order")
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateTotals()

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Success!</strong> Work order has been created successfully. Redirecting to active work orders...
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Work Order</h1>
          <p className="text-muted-foreground">Create a new work order with customer and vehicle details</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Work Order Title *</Label>
                    <Input
                      id="title"
                      value={workOrder.title}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Brake System Repair"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={workOrder.priority}
                      onValueChange={(value: any) => setWorkOrder(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={workOrder.description}
                    onChange={(e) => setWorkOrder(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the work to be performed"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={workOrder.dueDate}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technician">Assign Technician</Label>
                    <Select
                      value={workOrder.assignedTechnician}
                      onValueChange={(value) => setWorkOrder(prev => ({ ...prev, assignedTechnician: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTechnicians.map(tech => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                            {tech.specialization && <span className="text-sm text-gray-500 ml-2">({tech.specialization})</span>}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={workOrder.customerName}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={workOrder.customerEmail}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="john.smith@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={workOrder.customerPhone}
                    onChange={(e) => setWorkOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Make *</Label>
                    <Input
                      id="vehicleMake"
                      value={workOrder.vehicleMake}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleMake: e.target.value }))}
                      placeholder="Toyota"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model *</Label>
                    <Input
                      id="vehicleModel"
                      value={workOrder.vehicleModel}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleModel: e.target.value }))}
                      placeholder="Camry"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Year</Label>
                    <Input
                      id="vehicleYear"
                      value={workOrder.vehicleYear}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleYear: e.target.value }))}
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleLicensePlate">License Plate</Label>
                    <Input
                      id="vehicleLicensePlate"
                      value={workOrder.vehicleLicensePlate}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleLicensePlate: e.target.value }))}
                      placeholder="ABC-123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleVin">VIN</Label>
                    <Input
                      id="vehicleVin"
                      value={workOrder.vehicleVin}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleVin: e.target.value }))}
                      placeholder="1HGBH41JXMN109186"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMileage">Mileage</Label>
                    <Input
                      id="vehicleMileage"
                      value={workOrder.vehicleMileage}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleMileage: e.target.value }))}
                      placeholder="45000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Parts
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={addPart}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.parts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No parts added</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.parts.map((part) => (
                      <div key={part.id} className="border rounded-lg p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={part.name}
                            onValueChange={(value) => {
                              const selectedPart = mockParts.find(p => p === value)
                              updatePart(part.id, 'name', value)
                              if (selectedPart) {
                                // Auto-populate unit cost based on part
                                const unitCost = Math.random() * 200 + 20 // Random cost between $20-$220
                                updatePart(part.id, 'unitCost', unitCost)
                              }
                            }}
                          >
                            <SelectTrigger className="col-span-2">
                              <SelectValue placeholder="Select part" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockParts.map(partName => (
                                <SelectItem key={partName} value={partName}>{partName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            value={part.quantity}
                            onChange={(e) => updatePart(part.id, 'quantity', e.target.value)}
                            placeholder="Qty"
                            min="1"
                          />
                          <Input
                            type="number"
                            value={part.unitCost}
                            onChange={(e) => updatePart(part.id, 'unitCost', e.target.value)}
                            placeholder="Cost"
                            step="0.01"
                            min="0"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm">${part.total.toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePart(part.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Labor Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Labor Items
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={addLaborItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.laborItems.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No labor items added</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.laborItems.map((labor) => (
                      <div key={labor.id} className="border rounded-lg p-3 space-y-2">
                        <Input
                          value={labor.description}
                          onChange={(e) => updateLaborItem(labor.id, 'description', e.target.value)}
                          placeholder="Labor description"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            value={labor.hours}
                            onChange={(e) => updateLaborItem(labor.id, 'hours', e.target.value)}
                            placeholder="Hours"
                            step="0.1"
                            min="0"
                          />
                          <Input
                            type="number"
                            value={labor.rate}
                            onChange={(e) => updateLaborItem(labor.id, 'rate', e.target.value)}
                            placeholder="Rate"
                            step="1"
                            min="0"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm">${labor.total.toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLaborItem(labor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Parts Total:</span>
                  <span className="text-sm font-medium">${totals.partsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Labor Total:</span>
                  <span className="text-sm font-medium">${totals.laborTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Hours:</span>
                  <span className="text-sm font-medium">{totals.estimatedHours.toFixed(1)}h</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-bold text-lg">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Work Order
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}