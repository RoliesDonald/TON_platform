package rbac

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestPermissionDefinition tests the PermissionDefinition methods
func TestPermissionDefinition(t *testing.T) {
	t.Run("String", func(t *testing.T) {
		perm := PermissionDefinition{
			Resource: ResourceVehicle,
			Action:   ActionRead,
		}
		expected := "vehicle:read"
		assert.Equal(t, expected, perm.String())
	})

	t.Run("ParsePermission", func(t *testing.T) {
		testCases := []struct {
			input    string
			expected PermissionDefinition
			hasError bool
		}{
			{
				input: "vehicle:read",
				expected: PermissionDefinition{
					Resource: ResourceVehicle,
					Action:   ActionRead,
				},
				hasError: false,
			},
			{
				input: "work_order:create",
				expected: PermissionDefinition{
					Resource: ResourceWorkOrder,
					Action:   ActionCreate,
				},
				hasError: false,
			},
			{
				input:    "invalid_format",
				expected: PermissionDefinition{},
				hasError: true,
			},
			{
				input:    "too:many:parts",
				expected: PermissionDefinition{},
				hasError: true,
			},
		}

		for _, tc := range testCases {
			t.Run(fmt.Sprintf("ParsePermission(%s)", tc.input), func(t *testing.T) {
				result, err := ParsePermission(tc.input)
				if tc.hasError {
					assert.Error(t, err)
				} else {
					assert.NoError(t, err)
					assert.Equal(t, tc.expected, result)
				}
			})
		}
	})
}

// TestGetAllPermissionDefinitions tests the permission definition generation
func TestGetAllPermissionDefinitions(t *testing.T) {
	permissions := GetAllPermissionDefinitions()
	assert.Greater(t, len(permissions), 0, "Should generate at least one permission")

	// Check that all permissions have valid format
	for _, perm := range permissions {
		permStr := perm.String()
		parsed, err := ParsePermission(permStr)
		assert.NoError(t, err, fmt.Sprintf("Permission %s should be parsable", permStr))
		assert.Equal(t, perm, parsed, fmt.Sprintf("Parsed permission should match original for %s", permStr))
	}
}

// TestRolePermissionMap tests the role permission mapping functionality
func TestRolePermissionMap(t *testing.T) {
	rpm := GetDefaultRolePermissions()

	t.Run("HasPermission", func(t *testing.T) {
		testCases := []struct {
			role     string
			resource Resource
			action   Action
			expected bool
		}{
			{"Administrator", ResourceVehicle, ActionCreate, true},
			{"Administrator", ResourceSystem, ActionDelete, true}, // Admin has all permissions
			{"Service Advisor", ResourceVehicle, ActionRead, true},
			{"Service Advisor", ResourceVehicle, ActionDelete, false},
			{"Mechanic", ResourceWorkOrder, ActionRead, true},
			{"Mechanic", ResourceWorkOrder, ActionAssign, false},
			{"Accountant", ResourceInvoice, ActionCreate, true},
			{"Accountant", ResourceInventory, ActionUpdate, false},
			{"NonExistentRole", ResourceVehicle, ActionRead, false},
		}

		for _, tc := range testCases {
			t.Run(fmt.Sprintf("%s_%s_%s", tc.role, tc.resource, tc.action), func(t *testing.T) {
				result := rpm.HasPermission(tc.role, tc.resource, tc.action)
				assert.Equal(t, tc.expected, result)
			})
		}
	})

	t.Run("GetRolePermissions", func(t *testing.T) {
		testCases := []struct {
			role             string
			minPermsExpected int
		}{
			{"Administrator", 1},  // Should have at least 1 permission
			{"Service Advisor", 5}, // Should have multiple permissions
			{"Mechanic", 3},       // Should have some permissions
			{"NonExistentRole", 0}, // Should return empty slice
		}

		for _, tc := range testCases {
			t.Run(fmt.Sprintf("GetRolePermissions_%s", tc.role), func(t *testing.T) {
				permissions := rpm.GetRolePermissions(tc.role)
				assert.GreaterOrEqual(t, len(permissions), tc.minPermsExpected)
			})
		}
	})
}

// TestIsPermissionCombinationValid tests permission combination validation
func TestIsPermissionCombinationValid(t *testing.T) {
	testCases := []struct {
		resource Resource
		action   Action
		expected bool
	}{
		{ResourceVehicle, ActionCreate, true},
		{ResourceVehicle, ActionDelete, true},
		{ResourceWorkOrder, ActionApprove, true},
		{ResourceWorkOrder, ActionRead, true},
		{ResourceInventory, ActionImport, true},
		{ResourceInventory, ActionApprove, false}, // Should not be valid
		{ResourcePayment, ActionCreate, true},
		{ResourcePayment, ActionDelete, false}, // Should not be valid
		{ResourceSystem, ActionUpdate, true},
		{ResourceSystem, ActionDelete, false}, // Should not be valid
		{ResourceDashboard, ActionRead, true},
		{ResourceDashboard, ActionCreate, false}, // Should not be valid
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("%s_%s", tc.resource, tc.action), func(t *testing.T) {
			result := isPermissionCombinationValid(tc.resource, tc.action)
			assert.Equal(t, tc.expected, result)
		})
	}
}

// TestPermissionScenarios tests common permission scenarios
func TestPermissionScenarios(t *testing.T) {
	rpm := GetDefaultRolePermissions()

	t.Run("Service Advisor Scenario", func(t *testing.T) {
		role := "Service Advisor"

		// Can do their job
		assert.True(t, rpm.HasPermission(role, ResourceWorkOrder, ActionCreate))
		assert.True(t, rpm.HasPermission(role, ResourceWorkOrder, ActionRead))
		assert.True(t, rpm.HasPermission(role, ResourceCustomer, ActionCreate))
		assert.True(t, rpm.HasPermission(role, ResourceInvoice, ActionCreate))

		// Cannot do admin tasks
		assert.False(t, rpm.HasPermission(role, ResourceUser, ActionDelete))
		assert.False(t, rpm.HasPermission(role, ResourceRole, ActionCreate))
	})

	t.Run("Mechanic Scenario", func(t *testing.T) {
		role := "Mechanic"

		// Can do their job
		assert.True(t, rpm.HasPermission(role, ResourceWorkOrder, ActionRead))
		assert.True(t, rpm.HasPermission(role, ResourceWorkOrder, ActionUpdate))
		assert.True(t, rpm.HasPermission(role, ResourceVehicle, ActionRead))
		assert.True(t, rpm.HasPermission(role, ResourceInventory, ActionRead))

		// Cannot create work orders or manage customers
		assert.False(t, rpm.HasPermission(role, ResourceWorkOrder, ActionCreate))
		assert.False(t, rpm.HasPermission(role, ResourceCustomer, ActionCreate))
	})

	t.Run("Warehouse Staff Scenario", func(t *testing.T) {
		role := "Warehouse Staff"

		// Can manage inventory
		assert.True(t, rpm.HasPermission(role, ResourceInventory, ActionCreate))
		assert.True(t, rpm.HasPermission(role, ResourceInventory, ActionUpdate))
		assert.True(t, rpm.HasPermission(role, ResourceWarehouse, ActionUpdate))

		// Cannot access customer data or work orders
		assert.False(t, rpm.HasPermission(role, ResourceCustomer, ActionRead))
		assert.False(t, rpm.HasPermission(role, ResourceWorkOrder, ActionCreate))
	})

	t.Run("Accountant Scenario", func(t *testing.T) {
		role := "Accountant"

		// Can manage finances
		assert.True(t, rpm.HasPermission(role, ResourceInvoice, ActionCreate))
		assert.True(t, rpm.HasPermission(role, ResourceInvoice, ActionExport))
		assert.True(t, rpm.HasPermission(role, ResourcePayment, ActionRead))
		assert.True(t, rpm.HasPermission(role, ResourceReport, ActionExport))

		// Cannot manage operations
		assert.False(t, rpm.HasPermission(role, ResourceWorkOrder, ActionCreate))
		assert.False(t, rpm.HasPermission(role, ResourceInventory, ActionUpdate))
	})

	t.Run("Administrator Scenario", func(t *testing.T) {
		role := "Administrator"

		// Can do everything
		assert.True(t, rpm.HasPermission(role, ResourceUser, ActionDelete))
		assert.True(t, rpm.HasPermission(role, ResourceRole, ActionCreate))
		assert.True(t, rpm.HasPermission(role, ResourceSystem, ActionUpdate))
		assert.True(t, rpm.HasPermission(role, ResourceWorkOrder, ActionAssign))
	})
}

// GenerateTestData creates test data for RBAC testing
func GenerateTestData() map[string]interface{} {
	rpm := GetDefaultRolePermissions()

	// Sample role permission summaries
	roleSummaries := make(map[string]interface{})
	roles := []string{"Administrator", "Area Manager", "Service Advisor", "Mechanic", "Warehouse Staff", "Driver", "Accountant"}

	for _, role := range roles {
		permissions := rpm.GetRolePermissions(role)
		permissionStrings := make([]string, len(permissions))
		for i, perm := range permissions {
			permissionStrings[i] = perm.String()
		}

		roleSummaries[role] = map[string]interface{}{
			"permission_count": len(permissions),
			"permissions":      permissionStrings,
		}
	}

	return map[string]interface{}{
		"total_permissions": len(GetAllPermissionDefinitions()),
		"role_summaries":    roleSummaries,
		"resources":         []string{"user", "role", "vehicle", "work_order", "inventory", "invoice", "customer", "system", "report", "dashboard"},
		"actions":           []string{"create", "read", "update", "delete", "list", "export", "import", "approve", "reject", "assign"},
	}
}

// BenchmarkPermissionCheck benchmarks permission checking performance
func BenchmarkPermissionCheck(b *testing.B) {
	rpm := GetDefaultRolePermissions()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		rpm.HasPermission("Administrator", ResourceVehicle, ActionCreate)
		rpm.HasPermission("Service Advisor", ResourceWorkOrder, ActionRead)
		rpm.HasPermission("Mechanic", ResourceInventory, ActionRead)
		rpm.HasPermission("Accountant", ResourceInvoice, ActionCreate)
	}
}