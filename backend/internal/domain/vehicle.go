package domain

import "time"

// Vehicle represents a vehicle in the TON Platform system
type Vehicle struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	PlateNumber  string    `json:"plate_number" gorm:"uniqueIndex;not null"`
	Make         string    `json:"make" gorm:"not null"`
	Model        string    `json:"model" gorm:"not null"`
	Year         int       `json:"year" gorm:"not null"`
	VIN          string    `json:"vin" gorm:"uniqueIndex"`
	Color        string    `json:"color"`
	Type         string    `json:"type" gorm:"not null"` // sedan, truck, motorcycle, etc.
	Category     string    `json:"category" gorm:"not null"` // rental, workshop, customer
	Status       string    `json:"status" gorm:"not null"` // available, rented, in_maintenance, out_of_service
	Odometer     int       `json:"odometer"`
	LastService  time.Time `json:"last_service"`
	NextService  time.Time `json:"next_service"`
	Location     string    `json:"location"`
	AssignedTo   string    `json:"assigned_to"` // driver, mechanic, etc.
	Notes        string    `json:"notes"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// VehicleStatus constants
const (
	StatusAvailable       = "available"
	StatusRented          = "rented"
	StatusInMaintenance   = "in_maintenance"
	StatusOutOfService    = "out_of_service"
	StatusReserved        = "reserved"
)

// VehicleType constants
const (
	TypeSedan     = "sedan"
	TypeSUV       = "suv"
	TypeTruck     = "truck"
	TypeVan       = "van"
	TypeMotorcycle = "motorcycle"
	TypeBus       = "bus"
)

// VehicleCategory constants
const (
	CategoryRental   = "rental"
	CategoryWorkshop = "workshop"
	CategoryCustomer = "customer"
	CategoryCompany  = "company"
)

// TelematicsData represents real-time vehicle telematics information
type TelematicsData struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	VehicleID    uint      `json:"vehicle_id" gorm:"not null"`
	Vehicle      Vehicle   `json:"vehicle" gorm:"foreignKey:VehicleID"`
	Latitude     float64   `json:"latitude"`
	Longitude    float64   `json:"longitude"`
	Speed        float64   `json:"speed"`
	Heading      float64   `json:"heading"`
	Altitude     float64   `json:"altitude"`
	EngineStatus string    `json:"engine_status"`
	FuelLevel    float64   `json:"fuel_level"`
	EngineTemp   float64   `json:"engine_temp"`
	OilPressure  float64   `json:"oil_pressure"`
	BatteryLevel float64   `json:"battery_level"`
	Timestamp    time.Time `json:"timestamp"`
	CreatedAt    time.Time `json:"created_at"`
}

// DTCCode represents a Diagnostic Trouble Code
type DTCCode struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	VehicleID   uint      `json:"vehicle_id" gorm:"not null"`
	Vehicle     Vehicle   `json:"vehicle" gorm:"foreignKey:VehicleID"`
	Code        string    `json:"code" gorm:"not null"`
	Severity    string    `json:"severity" gorm:"not null"` // info, warning, error, critical
	Description string    `json:"description"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	FirstSeen   time.Time `json:"first_seen"`
	LastSeen    time.Time `json:"last_seen"`
	ResolvedAt  *time.Time `json:"resolved_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}