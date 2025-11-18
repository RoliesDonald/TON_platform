-- Create roles table
-- This table defines user roles in the system

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
-- This table defines granular permissions for different resources

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
-- This table links roles to permissions (many-to-many relationship)

CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Create triggers for updated_at
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('Administrator', 'Full system access with all permissions'),
    ('Area Manager', 'Manages fleet operations and approvals'),
    ('Accountant', 'Handles billing, invoicing, and financial operations'),
    ('Service Advisor', 'Manages work orders and customer communications'),
    ('Mechanic', 'Performs vehicle maintenance and repairs'),
    ('Warehouse Staff', 'Manages inventory and stock operations'),
    ('Driver', 'Vehicle operators and coordinators')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
-- User management permissions
('users.create', 'users', 'create', 'Create new user accounts'),
('users.read', 'users', 'read', 'View user information'),
('users.update', 'users', 'update', 'Update user information'),
('users.delete', 'users', 'delete', 'Delete user accounts'),

-- Vehicle management permissions
('vehicles.create', 'vehicles', 'create', 'Add new vehicles to the system'),
('vehicles.read', 'vehicles', 'read', 'View vehicle information'),
('vehicles.update', 'vehicles', 'update', 'Update vehicle information'),
('vehicles.delete', 'vehicles', 'delete', 'Remove vehicles from the system'),
('vehicles.track', 'vehicles', 'track', 'Track vehicle location and status'),

-- Work order permissions
('work_orders.create', 'work_orders', 'create', 'Create new work orders'),
('work_orders.read', 'work_orders', 'read', 'View work orders'),
('work_orders.update', 'work_orders', 'update', 'Update work order status'),
('work_orders.delete', 'work_orders', 'delete', 'Delete work orders'),
('work_orders.assign', 'work_orders', 'assign', 'Assign work orders to mechanics'),

-- Inventory permissions
('inventory.create', 'inventory', 'create', 'Add new inventory items'),
('inventory.read', 'inventory', 'read', 'View inventory information'),
('inventory.update', 'inventory', 'update', 'Update inventory information'),
('inventory.delete', 'inventory', 'delete', 'Remove inventory items'),
('inventory.transfer', 'inventory', 'transfer', 'Transfer stock between warehouses'),

-- Invoice and payment permissions
('invoices.create', 'invoices', 'create', 'Create new invoices'),
('invoices.read', 'invoices', 'read', 'View invoice information'),
('invoices.update', 'invoices', 'update', 'Update invoice information'),
('invoices.delete', 'invoices', 'delete', 'Delete invoices'),
('payments.process', 'payments', 'process', 'Process payments and refunds'),

-- Report permissions
('reports.read', 'reports', 'read', 'View system reports and analytics'),
('reports.export', 'reports', 'export', 'Export reports to various formats')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
-- Administrator gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Administrator'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Area Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Area Manager' AND p.resource IN ('vehicles', 'work_orders', 'reports')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Accountant permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Accountant' AND p.resource IN ('invoices', 'payments', 'reports')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Service Advisor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Service Advisor' AND p.resource IN ('work_orders', 'vehicles')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Mechanic permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Mechanic' AND p.resource IN ('work_orders', 'inventory', 'vehicles')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Warehouse Staff permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Warehouse Staff' AND p.resource = 'inventory'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Driver permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Driver' AND p.resource IN ('vehicles', 'work_orders')
ON CONFLICT (role_id, permission_id) DO NOTHING;