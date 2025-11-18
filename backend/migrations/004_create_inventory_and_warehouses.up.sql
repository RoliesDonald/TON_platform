-- Create warehouses table
-- This table defines storage locations for inventory

CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL, -- central, branch, small, mechanic
    location VARCHAR(200),
    address TEXT,
    manager_id INTEGER REFERENCES users(id),
    phone VARCHAR(20),
    email VARCHAR(100),
    capacity INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_items table
-- This table defines all parts and items in the inventory system

CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    part_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- engine, transmission, brakes, etc.
    brand VARCHAR(50),
    model VARCHAR(50),
    unit_price DECIMAL(10, 2) NOT NULL,
    supplier VARCHAR(100),
    supplier_sku VARCHAR(50),
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    weight DECIMAL(8, 2), -- kg
    dimensions VARCHAR(50), -- LxWxH
    barcode VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_stock table
-- This table tracks stock levels for items in different warehouses

CREATE TABLE IF NOT EXISTS inventory_stock (
    id SERIAL PRIMARY KEY,
    inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_count_date DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inventory_item_id, warehouse_id)
);

-- Create inventory_transactions table
-- This table tracks all stock movements and transactions

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id),
    from_warehouse_id INTEGER REFERENCES warehouses(id),
    to_warehouse_id INTEGER REFERENCES warehouses(id),
    transaction_type VARCHAR(30) NOT NULL, -- purchase, transfer, usage, adjustment, return, damage, loss
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    total_value DECIMAL(12, 2),
    reason TEXT,
    reference_type VARCHAR(50), -- work_order, purchase_order, adjustment, etc.
    reference_id INTEGER,
    performed_by INTEGER NOT NULL REFERENCES users(id),
    transaction_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_counts table
-- This table tracks periodic inventory counts for reconciliation

CREATE TABLE IF NOT EXISTS inventory_counts (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    count_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, approved
    counted_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    total_items INTEGER DEFAULT 0,
    discrepancies INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_count_items table
-- This table stores individual item counts during inventory count process

CREATE TABLE IF NOT EXISTS inventory_count_items (
    id SERIAL PRIMARY KEY,
    inventory_count_id INTEGER NOT NULL REFERENCES inventory_counts(id) ON DELETE CASCADE,
    inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id),
    expected_quantity INTEGER NOT NULL,
    counted_quantity INTEGER NOT NULL,
    variance INTEGER GENERATED ALWAYS AS (counted_quantity - expected_quantity) STORED,
    variance_value DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inventory_count_id, inventory_item_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_warehouses_name ON warehouses(name);
CREATE INDEX IF NOT EXISTS idx_warehouses_type ON warehouses(type);
CREATE INDEX IF NOT EXISTS idx_warehouses_manager_id ON warehouses(manager_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_is_active ON warehouses(is_active);

CREATE INDEX IF NOT EXISTS idx_inventory_items_part_number ON inventory_items(part_number);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_brand ON inventory_items(brand);
CREATE INDEX IF NOT EXISTS idx_inventory_items_is_active ON inventory_items(is_active);

CREATE INDEX IF NOT EXISTS idx_inventory_stock_item_warehouse ON inventory_stock(inventory_item_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_warehouse_id ON inventory_stock(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_low_stock ON inventory_stock(available_quantity) WHERE available_quantity <= 10;

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item_id ON inventory_transactions(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_from_warehouse ON inventory_transactions(from_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_to_warehouse ON inventory_transactions(to_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_performed_by ON inventory_transactions(performed_by);

CREATE INDEX IF NOT EXISTS idx_inventory_counts_warehouse_date ON inventory_counts(warehouse_id, count_date);
CREATE INDEX IF NOT EXISTS idx_inventory_counts_status ON inventory_counts(status);

-- Create triggers for updated_at
CREATE TRIGGER update_warehouses_updated_at
    BEFORE UPDATE ON warehouses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_stock_updated_at
    BEFORE UPDATE ON inventory_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_transactions_updated_at
    BEFORE UPDATE ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_counts_updated_at
    BEFORE UPDATE ON inventory_counts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_count_items_updated_at
    BEFORE UPDATE ON inventory_count_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update warehouse stock levels
CREATE OR REPLACE FUNCTION update_warehouse_stock_level()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE warehouses
        SET current_stock = (
            SELECT COALESCE(SUM(available_quantity), 0)
            FROM inventory_stock
            WHERE warehouse_id = NEW.warehouse_id
        )
        WHERE id = NEW.warehouse_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE warehouses
        SET current_stock = (
            SELECT COALESCE(SUM(available_quantity), 0)
            FROM inventory_stock
            WHERE warehouse_id = OLD.warehouse_id
        )
        WHERE id = OLD.warehouse_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to update warehouse stock levels
CREATE TRIGGER update_warehouse_stock_trigger
    AFTER INSERT OR UPDATE OR DELETE ON inventory_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_stock_level();

-- Insert default warehouses
INSERT INTO warehouses (name, type, location, address, capacity)
VALUES
    ('Central Warehouse', 'central', 'Main Facility', '123 Main St, City, State 12345', 10000),
    ('North Branch Warehouse', 'branch', 'North District', '456 North Ave, City, State 12345', 5000),
    ('South Branch Warehouse', 'branch', 'South District', '789 South Blvd, City, State 12345', 5000),
    ('Mechanic Workshop - Central', 'mechanic', 'Main Workshop', '123 Main St, City, State 12345', 1000)
ON CONFLICT (name) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory_items (part_number, name, description, category, brand, unit_price, min_stock_level, max_stock_level, reorder_point)
VALUES
    ('OIL-5W30-1L', '5W-30 Motor Oil 1L', 'High quality synthetic motor oil', 'fluids', 'Mobil', 15.99, 50, 200, 75),
    ('FILTER-OIL-GEN', 'Oil Filter Generic', 'Standard oil filter for most vehicles', 'filters', 'Generic', 8.99, 100, 500, 150),
    ('BRAKE-PAD-FRONT', 'Front Brake Pads', 'Ceramic brake pads for front wheels', 'brakes', 'Brembo', 89.99, 20, 100, 30),
    ('SPARK-PLAT-NGK', 'NGK Spark Plug', 'Iridium spark plug', 'electrical', 'NGK', 12.99, 100, 500, 200),
    ('BATTERY-12V-50AH', '12V 50Ah Battery', 'Maintenance-free car battery', 'batteries', 'Bosch', 149.99, 10, 50, 15)
ON CONFLICT (part_number) DO NOTHING;