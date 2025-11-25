"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Trash2,
  Save,
  Send,
  Download,
  Eye,
  Calculator,
  User,
  Calendar,
  FileText
} from "lucide-react"

const customers = [
  { id: "C001", name: "John Smith", email: "john.smith@email.com", phone: "+1-555-0101" },
  { id: "C002", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1-555-0102" },
  { id: "C003", name: "Mike Davis", email: "mike.davis@email.com", phone: "+1-555-0103" },
  { id: "C004", name: "Emily Wilson", email: "emily.w@email.com", phone: "+1-555-0104" },
  { id: "C005", name: "Robert Brown", email: "r.brown@email.com", phone: "+1-555-0105" }
]

const services = [
  { id: "S001", name: "Oil Change", description: "Standard oil change service", price: 75.00 },
  { id: "S002", name: "Brake Pad Replacement", description: "Front brake pad replacement", price: 450.00 },
  { id: "S003", name: "Tire Rotation", description: "Rotate and balance tires", price: 60.00 },
  { id: "S004", name: "Battery Replacement", description: "New battery installation", price: 280.00 },
  { id: "S005", name: "Diagnostic Service", description: "Full vehicle diagnostic", price: 120.00 },
  { id: "S006", name: "Wheel Alignment", description: "Four-wheel alignment", price: 120.00 },
  { id: "S007", name: "Air Filter Replacement", description: "Engine air filter replacement", price: 45.00 }
]

export default function CreateInvoicePage() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unitPrice: 0, total: 0 }
  ])
  const [taxRate, setTaxRate] = useState(10)

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
  }

  const addItem = () => {
    setItems([...items, {
      id: Math.max(...items.map(item => item.id), 0) + 1,
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleServiceSelect = (itemId: number, serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateItem(itemId, 'description', `${service.name} - ${service.description}`)
      updateItem(itemId, 'unitPrice', service.price)
      updateItem(itemId, 'quantity', 1)
    }
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">
            Generate a new invoice for your customer
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
            <CardDescription>Select or enter customer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCustomerData && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <p className="font-medium">{selectedCustomerData.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomerData.email}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomerData.phone}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Items
                </CardTitle>
                <CardDescription>Add services and parts to the invoice</CardDescription>
              </div>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-end gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor={`service-${item.id}`} className="text-xs">Service/Part</Label>
                    <Select onValueChange={(value) => handleServiceSelect(item.id, value)}>
                      <SelectTrigger id={`service-${item.id}`}>
                        <SelectValue placeholder="Select service or enter custom" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ${service.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`description-${item.id}`} className="text-xs">Description</Label>
                    <Input
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="w-20">
                    <Label htmlFor={`quantity-${item.id}`} className="text-xs">Qty</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="w-28">
                    <Label htmlFor={`price-${item.id}`} className="text-xs">Unit Price</Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="w-24">
                    <Label className="text-xs">Total</Label>
                    <div className="text-right font-medium">
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes and Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Add any notes or special instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or special instructions for the customer..."
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({taxRate}%):</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used invoice templates and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Oil Change Invoice</div>
                <div className="text-sm text-muted-foreground">Quick template for oil service</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Brake Service Invoice</div>
                <div className="text-sm text-muted-foreground">Complete brake work template</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Maintenance Package</div>
                <div className="text-sm text-muted-foreground">Regular maintenance bundle</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Diagnostic Service</div>
                <div className="text-sm text-muted-foreground">Vehicle diagnostic template</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}