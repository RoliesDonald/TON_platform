-- Fixed version of inventory and warehouses migration
-- This fixes the missing work order tables issue

-- Fix the missing work_order tables first
CREATE TABLE IF NOT EXISTS work_orders (
    id SERIAL PRIMARY KEY,
    wo_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    customer_address TEXT,
    vehicle_id INTEGER NOT NULL,
    service_type VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    description TEXT NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    assigned_mechanic_id INTEGER,
    service_advisor_id INTEGER NOT NULL,
    estimated_cost DECIMAL(10, 2),
    estimated_hours DECIMAL(5, 2),
    actual_cost DECIMAL(10, 2) DEFAULT 0,
    actual_hours DECIMAL(5, 2) DEFAULT 0,
    start_date TIMESTAMP,
    completion_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create work_order_parts table
CREATE TABLE IF NOT EXISTS work_order_parts (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL,
    inventory_item_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_by INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints after tables are created
ALTER TABLE work_orders ADD CONSTRAINT fk_work_orders_vehicle_id
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id);

ALTER TABLE work_orders ADD CONSTRAINT fk_work_orders_mechanic_id
    FOREIGN KEY (assigned_mechanic_id) REFERENCES users(id);

ALTER TABLE work_orders ADD CONSTRAINT fk_work_orders_advisor_id
    FOREIGN KEY (service_advisor_id) REFERENCES users(id);

ALTER TABLE work_order_parts ADD CONSTRAINT fk_work_order_parts_work_order_id
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE;

ALTER TABLE work_order_parts ADD CONSTRAINT fk_work_order_parts_inventory_item_id
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id);

ALTER TABLE work_order_parts ADD CONSTRAINT fk_work_order_parts_warehouse_id
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id);

ALTER TABLE work_order_parts ADD CONSTRAINT fk_work_order_parts_used_by
    FOREIGN KEY (used_by) REFERENCES users(id);

-- Create proper invoice_items table without generated column dependencies
CREATE TABLE IF NOT EXISTS invoice_items_fixed (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) NOT NULL,
    total_with_tax DECIMAL(12, 2) NOT NULL,
    item_type VARCHAR(30) NOT NULL,
    reference_type VARCHAR(30),
    reference_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing now that tables exist
INSERT INTO work_orders (customer_name, customer_phone, service_type, priority, description, service_advisor_id)
VALUES ('Test Customer', '555-9999', 'routine_maintenance', 'normal', 'Test work order', 1)
ON CONFLICT DO NOTHING;

-- Update existing inventory_stock to add missing warehouses
UPDATE inventory_stock SET warehouse_id = 1 WHERE warehouse_id IS NULL;
UPDATE inventory_transactions SET to_warehouse_id = 1 WHERE to_warehouse_id IS NULL;