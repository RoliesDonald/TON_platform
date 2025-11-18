package domain

import "time"

// Warehouse represents a storage location
type Warehouse struct {
	ID          uint             `json:"id" gorm:"primaryKey"`
	Name        string           `json:"name" gorm:"uniqueIndex;not null"`
	Type        string           `json:"type" gorm:"not null"`
	Location    string           `json:"location"`
	Address     string           `json:"address"`
	ManagerID   *uint            `json:"manager_id"`
	Manager     *User            `json:"manager" gorm:"foreignKey:ManagerID"`
	Capacity    int              `json:"capacity"`
	IsActive    bool             `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

// InventoryItem represents a spare part or item in inventory
type InventoryItem struct {
	ID              uint                  `json:"id" gorm:"primaryKey"`
	PartNumber      string                `json:"part_number" gorm:"uniqueIndex;not null"`
	Name            string                `json:"name" gorm:"not null"`
	Description     string                `json:"description"`
	Category        string                `json:"category" gorm:"not null"`
	Brand           string                `json:"brand"`
	Model           string                `json:"model"`
	UnitPrice       float64               `json:"unit_price" gorm:"not null"`
	Supplier        string                `json:"supplier"`
	SupplierSKU     string                `json:"supplier_sku"`
	MinStockLevel   int                   `json:"min_stock_level"`
	MaxStockLevel   int                   `json:"max_stock_level"`
	ReorderPoint    int                   `json:"reorder_point"`
	IsActive        bool                  `json:"is_active" gorm:"default:true"`
	InventoryStocks []InventoryStock      `json:"inventory_stocks" gorm:"foreignKey:InventoryItemID"`
	CreatedAt       time.Time             `json:"created_at"`
	UpdatedAt       time.Time             `json:"updated_at"`
}

// InventoryStock represents stock levels for items in different warehouses
type InventoryStock struct {
	ID             uint            `json:"id" gorm:"primaryKey"`
	InventoryItemID uint            `json:"inventory_item_id" gorm:"not null"`
	InventoryItem  InventoryItem   `json:"inventory_item" gorm:"foreignKey:InventoryItemID"`
	WarehouseID    uint            `json:"warehouse_id" gorm:"not null"`
	Warehouse      Warehouse       `json:"warehouse" gorm:"foreignKey:WarehouseID"`
	Quantity       int             `json:"quantity" gorm:"not null"`
	ReservedQuantity int           `json:"reserved_quantity" gorm:"default:0"`
	AvailableQuantity int          `json:"available_quantity" gorm:"not null"`
	LastCountDate  *time.Time      `json:"last_count_date"`
	LastUpdated    time.Time       `json:"last_updated"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
}

// InventoryTransaction represents stock movements
type InventoryTransaction struct {
ID             uint                 `json:"id" gorm:"primaryKey"`
TransactionNumber string            `json:"transaction_number" gorm:"uniqueIndex;not null"`
InventoryItemID uint               `json:"inventory_item_id" gorm:"not null"`
InventoryItem  InventoryItem        `json:"inventory_item" gorm:"foreignKey:InventoryItemID"`
FromWarehouseID *uint               `json:"from_warehouse_id"`
FromWarehouse   *Warehouse          `json:"from_warehouse" gorm:"foreignKey:FromWarehouseID"`
ToWarehouseID   uint                `json:"to_warehouse_id" gorm:"not null"`
ToWarehouse     Warehouse           `json:"to_warehouse" gorm:"foreignKey:ToWarehouseID"`
TransactionType string              `json:"transaction_type" gorm:"not null"`
Quantity        int                 `json:"quantity" gorm:"not null"`
UnitPrice       float64             `json:"unit_price"`
TotalValue      float64             `json:"total_value"`
Reason          string              `json:"reason"`
ReferenceType   string              `json:"reference_type"` // work_order, purchase_order, adjustment, etc.
ReferenceID     *uint               `json:"reference_id"`
PerformedBy     uint                `json:"performed_by" gorm:"not null"`
PerformedUser   *User               `json:"performed_user" gorm:"foreignKey:PerformedBy"`
TransactionDate time.Time           `json:"transaction_date" gorm:"not null"`
Notes           string              `json:"notes"`
CreatedAt       time.Time           `json:"created_at"`
UpdatedAt       time.Time           `json:"updated_at"`
}

// WarehouseType constants
const (
	WarehouseTypeCentral  = "central"
	WarehouseTypeBranch    = "branch"
	WarehouseTypeSmall     = "small"
	WarehouseTypeMechanic  = "mechanic"
)

// InventoryCategory constants
const (
	CategoryEngine      = "engine"
	CategoryTransmission = "transmission"
	CategoryBrakes      = "brakes"
	CategorySuspension  = "suspension"
	CategoryElectrical  = "electrical"
	CategoryBody        = "body"
	CategoryTires       = "tires"
	CategoryFluids      = "fluids"
	CategoryFilters     = "filters"
	CategoryBatteries   = "batteries"
	CategoryLighting    = "lighting"
	CategoryTools       = "tools"
	CategoryAccessories = "accessories"
)

// TransactionType constants
const (
	TransactionTypePurchase    = "purchase"
	TransactionTypeTransfer    = "transfer"
	TransactionTypeUsage       = "usage"
	TransactionTypeAdjustment  = "adjustment"
	TransactionTypeReturn      = "return"
	TransactionTypeDamage      = "damage"
	TransactionTypeLoss        = "loss"
)