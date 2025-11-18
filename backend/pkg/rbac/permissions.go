package rbac

import (
	"fmt"
	"strings"
)

// Permission represents a system permission
type Permission struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Resource    string `json:"resource"`
	Action      string `json:"action"`
}

// Resource defines system resources for permissions
type Resource string

const (
	// User management resources
	ResourceUser       Resource = "user"
	ResourceRole       Resource = "role"
	ResourcePermission Resource = "permission"

	// Vehicle management resources
	ResourceVehicle       Resource = "vehicle"
	ResourceVehicleType   Resource = "vehicle_type"
	ResourceVehicleStatus Resource = "vehicle_status"

	// Work order resources
	ResourceWorkOrder     Resource = "work_order"
	ResourceWorkOrderItem Resource = "work_order_item"
	ResourceServiceType   Resource = "service_type"

	// Inventory resources
	ResourceInventory     Resource = "inventory"
	ResourceWarehouse     Resource = "warehouse"
	ResourceInventoryItem Resource = "inventory_item"
	ResourceStockMovement Resource = "stock_movement"

	// Invoice and payment resources
	ResourceInvoice     Resource = "invoice"
	ResourceInvoiceItem Resource = "invoice_item"
	ResourcePayment     Resource = "payment"
	ResourcePaymentMethod Resource = "payment_method"

	// Customer resources
	ResourceCustomer Resource = "customer"
	ResourceCustomerVehicle Resource = "customer_vehicle"

	// Telematics resources
	ResourceTelematics Resource = "telematics"
	ResourceGPSData   Resource = "gps_data"
	ResourceDiagnostics Resource = "diagnostics"

	// Reports and analytics
	ResourceReport   Resource = "report"
	ResourceAnalytics Resource = "analytics"
	ResourceDashboard Resource = "dashboard"

	// System resources
	ResourceSystem   Resource = "system"
	ResourceConfig   Resource = "config"
	ResourceAuditLog Resource = "audit_log"
)

// Action defines permission actions
type Action string

const (
	ActionCreate Action = "create"
	ActionRead   Action = "read"
	ActionUpdate Action = "update"
	ActionDelete Action = "delete"
	ActionList   Action = "list"
	ActionExport Action = "export"
	ActionImport Action = "import"
	ActionApprove Action = "approve"
	ActionReject  Action = "reject"
	ActionAssign  Action = "assign"
	ActionUnassign Action = "unassign"
)

// PermissionDefinition defines a permission with resource and action
type PermissionDefinition struct {
	Resource Resource `json:"resource"`
	Action   Action   `json:"action"`
}

// String returns the permission string in format "resource:action"
func (p PermissionDefinition) String() string {
	return fmt.Sprintf("%s:%s", p.Resource, p.Action)
}

// ParsePermission parses a permission string into resource and action
func ParsePermission(permStr string) (PermissionDefinition, error) {
	parts := strings.Split(permStr, ":")
	if len(parts) != 2 {
		return PermissionDefinition{}, fmt.Errorf("invalid permission format: %s", permStr)
	}

	return PermissionDefinition{
		Resource: Resource(parts[0]),
		Action:   Action(parts[1]),
	}, nil
}

// GetAllPermissionDefinitions returns all possible permission combinations
func GetAllPermissionDefinitions() []PermissionDefinition {
	resources := []Resource{
		ResourceUser, ResourceRole, ResourcePermission,
		ResourceVehicle, ResourceVehicleType, ResourceVehicleStatus,
		ResourceWorkOrder, ResourceWorkOrderItem, ResourceServiceType,
		ResourceInventory, ResourceWarehouse, ResourceInventoryItem, ResourceStockMovement,
		ResourceInvoice, ResourceInvoiceItem, ResourcePayment, ResourcePaymentMethod,
		ResourceCustomer, ResourceCustomerVehicle,
		ResourceTelematics, ResourceGPSData, ResourceDiagnostics,
		ResourceReport, ResourceAnalytics, ResourceDashboard,
		ResourceSystem, ResourceConfig, ResourceAuditLog,
	}

	actions := []Action{
		ActionCreate, ActionRead, ActionUpdate, ActionDelete,
		ActionList, ActionExport, ActionImport,
		ActionApprove, ActionReject, ActionAssign, ActionUnassign,
	}

	var permissions []PermissionDefinition
	for _, resource := range resources {
		for _, action := range actions {
			// Add some logic to filter unnecessary combinations
			if isPermissionCombinationValid(resource, action) {
				permissions = append(permissions, PermissionDefinition{
					Resource: resource,
					Action:   action,
				})
			}
		}
	}

	return permissions
}

// isPermissionCombinationValid checks if a resource-action combination makes sense
func isPermissionCombinationValid(resource Resource, action Action) bool {
	switch resource {
	case ResourceVehicle:
		return action == ActionCreate || action == ActionRead || action == ActionUpdate ||
			   action == ActionDelete || action == ActionList || action == ActionExport
	case ResourceWorkOrder:
		return action == ActionCreate || action == ActionRead || action == ActionUpdate ||
			   action == ActionDelete || action == ActionList || action == ActionAssign ||
			   action == ActionApprove || action == ActionReject
	case ResourceInventory:
		return action == ActionRead || action == ActionUpdate || action == ActionList ||
			   action == ActionImport || action == ActionExport
	case ResourcePayment:
		return action == ActionCreate || action == ActionRead || action == ActionList
	case ResourceSystem:
		return action == ActionRead || action == ActionUpdate || action == ActionList
	case ResourceReport:
		return action == ActionRead || action == ActionList || action == ActionExport
	case ResourceDashboard:
		return action == ActionRead
	default:
		// Default allow all actions
		return true
	}
}

// RolePermissionMap defines which roles have which permissions
type RolePermissionMap map[string][]PermissionDefinition

// GetDefaultRolePermissions returns default permissions for each role
func GetDefaultRolePermissions() RolePermissionMap {
	return RolePermissionMap{
		"Administrator": GetAllPermissionDefinitions(), // Admin has all permissions

		"Area Manager": {
			// User management (limited)
			{Resource: ResourceUser, Action: ActionRead},
			{Resource: ResourceUser, Action: ActionList},
			{Resource: ResourceUser, Action: ActionUpdate},

			// Vehicle management
			{Resource: ResourceVehicle, Action: ActionCreate},
			{Resource: ResourceVehicle, Action: ActionRead},
			{Resource: ResourceVehicle, Action: ActionUpdate},
			{Resource: ResourceVehicle, Action: ActionDelete},
			{Resource: ResourceVehicle, Action: ActionList},
			{Resource: ResourceVehicle, Action: ActionExport},

			// Work orders
			{Resource: ResourceWorkOrder, Action: ActionCreate},
			{Resource: ResourceWorkOrder, Action: ActionRead},
			{Resource: ResourceWorkOrder, Action: ActionUpdate},
			{Resource: ResourceWorkOrder, Action: ActionList},
			{Resource: ResourceWorkOrder, Action: ActionAssign},
			{Resource: ResourceWorkOrder, Action: ActionApprove},
			{Resource: ResourceWorkOrder, Action: ActionReject},

			// Inventory
			{Resource: ResourceInventory, Action: ActionRead},
			{Resource: ResourceInventory, Action: ActionUpdate},
			{Resource: ResourceInventory, Action: ActionList},
			{Resource: ResourceInventory, Action: ActionImport},
			{Resource: ResourceInventory, Action: ActionExport},

			// Reports and analytics
			{Resource: ResourceReport, Action: ActionRead},
			{Resource: ResourceReport, Action: ActionList},
			{Resource: ResourceReport, Action: ActionExport},
			{Resource: ResourceDashboard, Action: ActionRead},
		},

		"Service Advisor": {
			// Vehicle management
			{Resource: ResourceVehicle, Action: ActionRead},
			{Resource: ResourceVehicle, Action: ActionUpdate},
			{Resource: ResourceVehicle, Action: ActionList},

			// Work orders
			{Resource: ResourceWorkOrder, Action: ActionCreate},
			{Resource: ResourceWorkOrder, Action: ActionRead},
			{Resource: ResourceWorkOrder, Action: ActionUpdate},
			{Resource: ResourceWorkOrder, Action: ActionList},
			{Resource: ResourceWorkOrderItem, Action: ActionCreate},
			{Resource: ResourceWorkOrderItem, Action: ActionRead},
			{Resource: ResourceWorkOrderItem, Action: ActionUpdate},
			{Resource: ResourceWorkOrderItem, Action: ActionDelete},

			// Customer management
			{Resource: ResourceCustomer, Action: ActionCreate},
			{Resource: ResourceCustomer, Action: ActionRead},
			{Resource: ResourceCustomer, Action: ActionUpdate},
			{Resource: ResourceCustomer, Action: ActionList},
			{Resource: ResourceCustomerVehicle, Action: ActionCreate},
			{Resource: ResourceCustomerVehicle, Action: ActionRead},
			{Resource: ResourceCustomerVehicle, Action: ActionUpdate},

			// Invoices
			{Resource: ResourceInvoice, Action: ActionCreate},
			{Resource: ResourceInvoice, Action: ActionRead},
			{Resource: ResourceInvoice, Action: ActionUpdate},
			{Resource: ResourceInvoice, Action: ActionList},
		},

		"Mechanic": {
			// Vehicle management
			{Resource: ResourceVehicle, Action: ActionRead},
			{Resource: ResourceVehicle, Action: ActionUpdate},
			{Resource: ResourceVehicle, Action: ActionList},

			// Work orders (assigned to them)
			{Resource: ResourceWorkOrder, Action: ActionRead},
			{Resource: ResourceWorkOrder, Action: ActionUpdate},
			{Resource: ResourceWorkOrder, Action: ActionList},
			{Resource: ResourceWorkOrderItem, Action: ActionRead},
			{Resource: ResourceWorkOrderItem, Action: ActionUpdate},

			// Inventory (parts usage)
			{Resource: ResourceInventory, Action: ActionRead},
			{Resource: ResourceInventory, Action: ActionList},
			{Resource: ResourceInventoryItem, Action: ActionRead},
		},

		"Warehouse Staff": {
			// Inventory management
			{Resource: ResourceInventory, Action: ActionCreate},
			{Resource: ResourceInventory, Action: ActionRead},
			{Resource: ResourceInventory, Action: ActionUpdate},
			{Resource: ResourceInventory, Action: ActionDelete},
			{Resource: ResourceInventory, Action: ActionList},
			{Resource: ResourceInventoryItem, Action: ActionCreate},
			{Resource: ResourceInventoryItem, Action: ActionRead},
			{Resource: ResourceInventoryItem, Action: ActionUpdate},
			{Resource: ResourceInventoryItem, Action: ActionDelete},
			{Resource: ResourceInventoryItem, Action: ActionList},
			{Resource: ResourceStockMovement, Action: ActionCreate},
			{Resource: ResourceStockMovement, Action: ActionRead},
			{Resource: ResourceStockMovement, Action: ActionList},
			{Resource: ResourceWarehouse, Action: ActionRead},
			{Resource: ResourceWarehouse, Action: ActionUpdate},
			{Resource: ResourceWarehouse, Action: ActionList},
		},

		"Driver": {
			// Vehicle management (assigned vehicles)
			{Resource: ResourceVehicle, Action: ActionRead},
			{Resource: ResourceVehicle, Action: ActionList},

			// Work orders (assigned)
			{Resource: ResourceWorkOrder, Action: ActionRead},
			{Resource: ResourceWorkOrder, Action: ActionList},

			// Telematics
			{Resource: ResourceTelematics, Action: ActionRead},
			{Resource: ResourceGPSData, Action: ActionRead},
			{Resource: ResourceDiagnostics, Action: ActionRead},
		},

		"Accountant": {
			// Invoices and payments
			{Resource: ResourceInvoice, Action: ActionCreate},
			{Resource: ResourceInvoice, Action: ActionRead},
			{Resource: ResourceInvoice, Action: ActionUpdate},
			{Resource: ResourceInvoice, Action: ActionList},
			{Resource: ResourceInvoice, Action: ActionExport},
			{Resource: ResourcePayment, Action: ActionCreate},
			{Resource: ResourcePayment, Action: ActionRead},
			{Resource: ResourcePayment, Action: ActionList},
			{Resource: ResourcePayment, Action: ActionExport},
			{Resource: ResourcePaymentMethod, Action: ActionRead},
			{Resource: ResourcePaymentMethod, Action: ActionList},

			// Financial reports
			{Resource: ResourceReport, Action: ActionRead},
			{Resource: ResourceReport, Action: ActionList},
			{Resource: ResourceReport, Action: ActionExport},

			// Customer information (billing)
			{Resource: ResourceCustomer, Action: ActionRead},
			{Resource: ResourceCustomer, Action: ActionList},
		},
	}
}

// HasPermission checks if a role has a specific permission
func (rpm RolePermissionMap) HasPermission(roleName string, resource Resource, action Action) bool {
	permissions, exists := rpm[roleName]
	if !exists {
		return false
	}

	for _, perm := range permissions {
		if perm.Resource == resource && perm.Action == action {
			return true
		}
	}

	return false
}

// GetRolePermissions returns all permissions for a role
func (rpm RolePermissionMap) GetRolePermissions(roleName string) []PermissionDefinition {
	permissions, exists := rpm[roleName]
	if !exists {
		return []PermissionDefinition{}
	}
	return permissions
}