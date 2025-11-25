"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  CreditCard,
  Download,
  ArrowLeft,
  Copy,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
  part_number?: string
  labor_hours?: number
}

interface Invoice {
  id: string
  invoice_number: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  vehicle: {
    make: string
    model: string
    year: number
    vin: string
    license_plate: string
  }
  work_order_id: string
  issue_date: string
  due_date: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  payment_link?: string
  payment_status: "pending" | "partial" | "paid" | "failed"
  notes?: string
  created_at: string
  updated_at: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface PaymentLinkResponse {
  success: boolean
  data: {
    payment_url: string
    payment_id: string
    expires_at: string
  }
  message?: string
}

export default function InvoiceDetail() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatingPayment, setGeneratingPayment] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoice()
  }, [invoiceId])

  const fetchInvoice = async () => {
    try {
      setError(null)
      // This would call the actual API in production
      // const response = await fetch(`/api/v1/invoices/${invoiceId}`)
      // const result: ApiResponse<Invoice> = await response.json()

      // Mock data for demonstration
      const mockInvoice: Invoice = {
        id: invoiceId,
        invoice_number: `INV-${invoiceId.padStart(6, '0')}`,
        customer: {
          name: "John Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, New York, NY 10001"
        },
        vehicle: {
          make: "Ford",
          model: "F-150",
          year: 2022,
          vin: "1FTEW1EG5PFA12345",
          license_plate: "ABC-123"
        },
        work_order_id: "WO-2024-001",
        issue_date: "2024-11-15",
        due_date: "2024-12-15",
        status: "sent",
        items: [
          {
            id: "1",
            description: "Oil Change Service",
            quantity: 1,
            unit_price: 89.99,
            total: 89.99,
            labor_hours: 1
          },
          {
            id: "2",
            description: "Engine Air Filter",
            quantity: 1,
            unit_price: 24.99,
            total: 24.99,
            part_number: "AF-12345"
          },
          {
            id: "3",
            description: "Cabin Air Filter",
            quantity: 1,
            unit_price: 19.99,
            total: 19.99,
            part_number: "CF-67890"
          },
          {
            id: "4",
            description: "Brake Fluid Flush",
            quantity: 1,
            unit_price: 149.99,
            total: 149.99,
            labor_hours: 2
          }
        ],
        subtotal: 284.96,
        tax: 22.80,
        total: 307.76,
        payment_status: "pending",
        notes: "Vehicle was serviced on time. All parts were replaced with genuine OEM components.",
        created_at: "2024-11-15T10:30:00Z",
        updated_at: "2024-11-15T14:45:00Z"
      }

      // Simulate API delay
      setTimeout(() => {
        setInvoice(mockInvoice)
        setPaymentLink(mockInvoice.payment_link || null)
        setLoading(false)
      }, 1000)

    } catch (err) {
      setError("Failed to fetch invoice details. Please try again.")
      setLoading(false)
    }
  }

  const generatePaymentLink = async () => {
    if (!invoice) return

    try {
      setGeneratingPayment(true)
      setError(null)

      // This would call the actual API in production
      // const response = await fetch(`/api/v1/invoices/${invoiceId}/generate-payment`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })
      // const result: PaymentLinkResponse = await response.json()

      // Mock response for demonstration
      const mockPaymentResponse: PaymentLinkResponse = {
        success: true,
        data: {
          payment_url: `https://payment.ton.com/pay/${invoiceId}`,
          payment_id: `PAY-${Date.now()}`,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        }
      }

      // Simulate API delay
      setTimeout(() => {
        if (mockPaymentResponse.success) {
          setPaymentLink(mockPaymentResponse.data.payment_url)
          setInvoice(prev => prev ? {
            ...prev,
            payment_link: mockPaymentResponse.data.payment_url
          } : null)
        } else {
          setError(mockPaymentResponse.message || "Failed to generate payment link")
        }
        setGeneratingPayment(false)
      }, 2000)

    } catch (err) {
      setError("Failed to generate payment link. Please try again.")
      setGeneratingPayment(false)
    }
  }

  const checkPaymentStatus = async () => {
    if (!invoice) return

    try {
      setCheckingStatus(true)
      setError(null)

      // This would call the actual API in production
      // const response = await fetch(`/api/v1/invoices/${invoiceId}/payment-status`)
      // const result = await response.json()

      // Mock status update for demonstration
      setTimeout(() => {
        setInvoice(prev => prev ? {
          ...prev,
          payment_status: "paid",
          status: "paid",
          updated_at: new Date().toISOString()
        } : null)
        setCheckingStatus(false)
      }, 1500)

    } catch (err) {
      setError("Failed to check payment status. Please try again.")
      setCheckingStatus(false)
    }
  }

  const copyPaymentLink = async () => {
    if (paymentLink) {
      try {
        await navigator.clipboard.writeText(paymentLink)
        // In a real app, you'd show a toast notification here
        alert("Payment link copied to clipboard!")
      } catch (err) {
        setError("Failed to copy payment link")
      }
    }
  }

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800 border-green-200"
      case 'sent':
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 'overdue':
        return "bg-red-100 text-red-800 border-red-200"
      case 'draft':
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: Invoice['payment_status']) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800 border-green-200"
      case 'partial':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'failed':
        return "bg-red-100 text-red-800 border-red-200"
      case 'pending':
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Invoice not found"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{invoice.invoice_number}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon(invoice.status)}
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {invoice.customer.name}</p>
                    <p><strong>Email:</strong> {invoice.customer.email}</p>
                    <p><strong>Phone:</strong> {invoice.customer.phone}</p>
                    <p><strong>Address:</strong> {invoice.customer.address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Vehicle Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Make:</strong> {invoice.vehicle.make}</p>
                    <p><strong>Model:</strong> {invoice.vehicle.model}</p>
                    <p><strong>Year:</strong> {invoice.vehicle.year}</p>
                    <p><strong>VIN:</strong> {invoice.vehicle.vin}</p>
                    <p><strong>License:</strong> {invoice.vehicle.license_plate}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Invoice Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span><strong>Issue Date:</strong> {new Date(invoice.issue_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</span>
                    </div>
                    <p><strong>Work Order:</strong> {invoice.work_order_id}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Payment Status</h4>
                  <div className="space-y-2">
                    <Badge className={getPaymentStatusColor(invoice.payment_status)}>
                      {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(invoice.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium border-b pb-2">
                  <div className="col-span-3">Description</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Total</div>
                </div>

                {invoice.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-6 gap-4 text-sm border-b pb-3">
                    <div className="col-span-3">
                      <p className="font-medium">{item.description}</p>
                      {item.part_number && (
                        <p className="text-xs text-muted-foreground">Part #: {item.part_number}</p>
                      )}
                      {item.labor_hours && (
                        <p className="text-xs text-muted-foreground">{item.labor_hours} labor hours</p>
                      )}
                    </div>
                    <div className="text-right">{item.quantity}</div>
                    <div className="text-right">${item.unit_price.toFixed(2)}</div>
                    <div className="text-right font-medium">${item.total.toFixed(2)}</div>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%):</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Payment Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generatePaymentLink}
                disabled={generatingPayment || invoice.payment_status === "paid"}
                className="w-full"
              >
                {generatingPayment ? (
                  "Generating..."
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Generate Payment Link
                  </>
                )}
              </Button>

              <Button
                onClick={checkPaymentStatus}
                disabled={checkingStatus}
                variant="outline"
                className="w-full"
              >
                {checkingStatus ? (
                  "Checking..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check Status
                  </>
                )}
              </Button>

              {paymentLink && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Link:</label>
                  <div className="flex gap-2">
                    <Input
                      value={paymentLink}
                      readOnly
                      className="flex-1 text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={copyPaymentLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => window.open(paymentLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment:</span>
                  <Badge className={getPaymentStatusColor(invoice.payment_status)}>
                    {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}