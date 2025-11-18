package domain

import "time"

// Invoice represents a billing invoice
type Invoice struct {
	ID              uint            `json:"id" gorm:"primaryKey"`
	InvoiceNumber   string          `json:"invoice_number" gorm:"uniqueIndex;not null"`
	WorkOrderID     *uint           `json:"work_order_id"`
	WorkOrder       *WorkOrder      `json:"work_order" gorm:"foreignKey:WorkOrderID"`
	CustomerName    string          `json:"customer_name" gorm:"not null"`
	CustomerEmail   string          `json:"customer_email"`
	CustomerPhone   string          `json:"customer_phone"`
	CustomerAddress string          `json:"customer_address"`
	Type            string          `json:"type" gorm:"not null"` // service, rental, parts, etc.
	Status          string          `json:"status" gorm:"not null"`
	Subtotal        float64         `json:"subtotal"`
	TaxAmount       float64         `json:"tax_amount"`
	TotalAmount     float64         `json:"total_amount" gorm:"not null"`
	DueDate         time.Time       `json:"due_date"`
	IssueDate       time.Time       `json:"issue_date" gorm:"not null"`
	PaidDate        *time.Time      `json:"paid_date"`
	InvoiceItems    []InvoiceItem   `json:"invoice_items" gorm:"foreignKey:InvoiceID"`
	Payments        []Payment       `json:"payments" gorm:"foreignKey:InvoiceID"`
	Notes           string          `json:"notes"`
	CreatedBy       uint            `json:"created_by" gorm:"not null"`
	CreatedUser     *User           `json:"created_user" gorm:"foreignKey:CreatedBy"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// InvoiceItem represents line items in an invoice
type InvoiceItem struct {
	ID          uint     `json:"id" gorm:"primaryKey"`
	InvoiceID   uint     `json:"invoice_id" gorm:"not null"`
	Invoice     Invoice  `json:"invoice" gorm:"foreignKey:InvoiceID"`
	Description string   `json:"description" gorm:"not null"`
	Quantity    int      `json:"quantity" gorm:"not null"`
	UnitPrice   float64  `json:"unit_price" gorm:"not null"`
	TotalPrice  float64  `json:"total_price" gorm:"not null"`
	TaxRate     float64  `json:"tax_rate" gorm:"default:0"`
	TaxAmount   float64  `json:"tax_amount"`
	ItemType    string   `json:"item_type" gorm:"not null"` // labor, parts, fees, etc.
	ReferenceID *uint    `json:"reference_id"` // Reference to work_order_part, inventory_item, etc.
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Payment represents a payment transaction
type Payment struct {
	ID              uint       `json:"id" gorm:"primaryKey"`
	InvoiceID       uint       `json:"invoice_id" gorm:"not null"`
	Invoice         Invoice    `json:"invoice" gorm:"foreignKey:InvoiceID"`
	PaymentNumber   string     `json:"payment_number" gorm:"uniqueIndex;not null"`
	Amount          float64    `json:"amount" gorm:"not null"`
	PaymentMethod   string     `json:"payment_method" gorm:"not null"`
	PaymentStatus   string     `json:"payment_status" gorm:"not null"`
	TransactionID   string     `json:"transaction_id"` // Payment gateway transaction ID
	Gateway         string     `json:"gateway"` // Payment gateway used
	PaymentDate     time.Time  `json:"payment_date" gorm:"not null"`
	ProcessedBy     uint       `json:"processed_by" gorm:"not null"`
	ProcessedUser   *User      `json:"processed_user" gorm:"foreignKey:ProcessedBy"`
	Notes           string     `json:"notes"`
	RefundAmount    float64    `json:"refund_amount" gorm:"default:0"`
	RefundReason    string     `json:"refund_reason"`
	RefundDate      *time.Time `json:"refund_date"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

// InvoiceType constants
const (
	InvoiceTypeService = "service"
	InvoiceTypeRental  = "rental"
	InvoiceTypeParts   = "parts"
	InvoiceTypeLabor   = "labor"
	InvoiceTypeFees    = "fees"
	InvoiceTypeOther   = "other"
)

// InvoiceStatus constants
const (
	InvoiceStatusDraft      = "draft"
	InvoiceStatusIssued     = "issued"
	InvoiceStatusSent       = "sent"
	InvoiceStatusPartial    = "partial"
	InvoiceStatusPaid       = "paid"
	InvoiceStatusOverdue    = "overdue"
	InvoiceStatusCancelled  = "cancelled"
	InvoiceStatusRefunded   = "refunded"
)

// PaymentMethod constants
const (
	PaymentMethodCash         = "cash"
	PaymentMethodCard         = "card"
	PaymentMethodBankTransfer = "bank_transfer"
	PaymentMethodCheck        = "check"
	PaymentMethodCredit       = "credit"
	PaymentMethodOnline       = "online"
	PaymentMethodMobile       = "mobile"
)

// PaymentStatus constants
const (
	PaymentStatusPending   = "pending"
	PaymentStatusProcessing = "processing"
	PaymentStatusCompleted = "completed"
	PaymentStatusFailed    = "failed"
	PaymentStatusCancelled = "cancelled"
	PaymentStatusRefunded  = "refunded"
	PaymentStatusPartiallyRefunded = "partially_refunded"
)

// PaymentGateway constants
const (
	GatewayStripe     = "stripe"
	GatewayPayPal     = "paypal"
	GatewaySquare     = "square"
	GatewayAuthorize  = "authorize"
	GatewayManual     = "manual"
)