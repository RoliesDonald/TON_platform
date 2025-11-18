package domain

import "time"

// WorkOrder represents a service work order in the system
type WorkOrder struct {
	ID              uint            `json:"id" gorm:"primaryKey"`
	WONumber        string          `json:"wo_number" gorm:"uniqueIndex;not null"`
	CustomerName    string          `json:"customer_name" gorm:"not null"`
	CustomerPhone   string          `json:"customer_phone"`
	CustomerEmail   string          `json:"customer_email"`
	VehicleID       uint            `json:"vehicle_id" gorm:"not null"`
	Vehicle         Vehicle         `json:"vehicle" gorm:"foreignKey:VehicleID"`
	ServiceType     string          `json:"service_type" gorm:"not null"`
	Priority        string          `json:"priority" gorm:"not null"`
	Status          string          `json:"status" gorm:"not null"`
	Description     string          `json:"description" gorm:"not null"`
	AssignedMechanicID *uint        `json:"assigned_mechanic_id"`
	AssignedMechanic *User          `json:"assigned_mechanic" gorm:"foreignKey:AssignedMechanicID"`
	ServiceAdvisorID uint           `json:"service_advisor_id" gorm:"not null"`
	ServiceAdvisor   *User          `json:"service_advisor" gorm:"foreignKey:ServiceAdvisorID"`
	EstimatedCost   float64         `json:"estimated_cost"`
	ActualCost      float64         `json:"actual_cost"`
	EstimatedHours  float64         `json:"estimated_hours"`
	ActualHours     float64         `json:"actual_hours"`
	StartDate       *time.Time      `json:"start_date"`
	CompletionDate  *time.Time      `json:"completion_date"`
	PartsUsed       []WorkOrderPart `json:"parts_used" gorm:"foreignKey:WorkOrderID"`
	Notes           string          `json:"notes"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// WorkOrderPart represents parts used in a work order
type WorkOrderPart struct {
	ID           uint        `json:"id" gorm:"primaryKey"`
	WorkOrderID  uint        `json:"work_order_id" gorm:"not null"`
	WorkOrder    WorkOrder   `json:"work_order" gorm:"foreignKey:WorkOrderID"`
	PartID       uint        `json:"part_id" gorm:"not null"`
	Part         InventoryItem `json:"part" gorm:"foreignKey:PartID"`
	Quantity     int         `json:"quantity" gorm:"not null"`
	UnitPrice    float64     `json:"unit_price" gorm:"not null"`
	TotalPrice   float64     `json:"total_price" gorm:"not null"`
	UsedAt       time.Time   `json:"used_at"`
	CreatedAt    time.Time   `json:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at"`
}

// WorkOrderStatus constants
const (
	StatusPending     = "pending"
	StatusAssigned    = "assigned"
	StatusInProgress  = "in_progress"
	StatusOnHold      = "on_hold"
	StatusCompleted   = "completed"
	StatusCancelled   = "cancelled"
	StatusWaitingForParts = "waiting_for_parts"
)

// ServiceType constants
const (
	ServiceTypeRoutine = "routine_maintenance"
	ServiceTypeRepair  = "repair"
	ServiceTypeInspection = "inspection"
	ServiceTypeEmergency = "emergency"
	ServiceTypeCustomization = "customization"
)

// WorkOrderPriority constants
const (
	PriorityLow      = "low"
	PriorityNormal   = "normal"
	PriorityHigh     = "high"
	PriorityCritical = "critical"
	PriorityEmergency = "emergency"
)