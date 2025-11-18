-- Create work_orders table
-- This table manages service and maintenance work orders

CREATE TABLE IF NOT EXISTS work_orders (
    id SERIAL PRIMARY KEY,
    wo_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    customer_address TEXT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    service_type VARCHAR(30) NOT NULL, -- routine_maintenance, repair, inspection, emergency, etc.
    priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- low, normal, high, critical, emergency
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, assigned, in_progress, on_hold, completed, cancelled
    description TEXT NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    assigned_mechanic_id INTEGER REFERENCES users(id),
    service_advisor_id INTEGER NOT NULL REFERENCES users(id),
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
-- This table tracks parts used in work orders

CREATE TABLE IF NOT EXISTS work_order_parts (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create work_order_labor table
-- This table tracks labor charges for work orders

CREATE TABLE IF NOT EXISTS work_order_labor (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    mechanic_id INTEGER NOT NULL REFERENCES users(id),
    description VARCHAR(200) NOT NULL,
    hours_worked DECIMAL(5, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (hours_worked * hourly_rate) STORED,
    work_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create work_order_photos table
-- This table stores photos related to work orders

CREATE TABLE IF NOT EXISTS work_order_photos (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    description VARCHAR(200),
    photo_type VARCHAR(30) NOT NULL, -- before, after, damage, progress, etc.
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create work_order_status_history table
-- This table tracks status changes for work orders

CREATE TABLE IF NOT EXISTS work_order_status_history (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_orders_wo_number ON work_orders(wo_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_customer ON work_orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_work_orders_vehicle_id ON work_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_service_type ON work_orders(service_type);
CREATE INDEX IF NOT EXISTS idx_work_orders_priority ON work_orders(priority);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_mechanic_id ON work_orders(assigned_mechanic_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_advisor_id ON work_orders(service_advisor_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_at ON work_orders(created_at);

CREATE INDEX IF NOT EXISTS idx_work_order_parts_work_order ON work_order_parts(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_parts_inventory_item ON work_order_parts(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_work_order_parts_warehouse ON work_order_parts(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_work_order_parts_used_at ON work_order_parts(used_at);

CREATE INDEX IF NOT EXISTS idx_work_order_labor_work_order ON work_order_labor(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_labor_mechanic ON work_order_labor(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_work_order_labor_work_date ON work_order_labor(work_date);

CREATE INDEX IF NOT EXISTS idx_work_order_photos_work_order ON work_order_photos(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_photos_type ON work_order_photos(photo_type);

CREATE INDEX IF NOT EXISTS idx_work_order_status_history_work_order ON work_order_status_history(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_status_history_changed_at ON work_order_status_history(changed_at);

-- Create triggers for updated_at
CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_order_parts_updated_at
    BEFORE UPDATE ON work_order_parts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_order_labor_updated_at
    BEFORE UPDATE ON work_order_labor
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to track work order status changes
CREATE OR REPLACE FUNCTION track_work_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO work_order_status_history (work_order_id, old_status, new_status, changed_by, notes)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.service_advisor_id, 'Status changed');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to track status changes
CREATE TRIGGER track_work_order_status_change_trigger
    AFTER UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION track_work_order_status_change();

-- Create function to generate work order numbers
CREATE OR REPLACE FUNCTION generate_work_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;

    -- Get next sequence number for this year
    SELECT LPAD((COALESCE(MAX(CAST(SUBSTRING(wo_number FROM 6 FOR 4) AS INTEGER)), 0) + 1)::TEXT, 4, '0')
    INTO sequence_num
    FROM work_orders
    WHERE wo_number LIKE 'WO-' || year_part || '-%';

    -- If no work orders exist for this year, start with 0001
    IF sequence_num IS NULL OR sequence_num = '' THEN
        sequence_num := '0001';
    END IF;

    NEW.wo_number := 'WO-' || year_part || '-' || sequence_num;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to generate work order numbers
CREATE TRIGGER generate_work_order_number_trigger
    BEFORE INSERT ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_work_order_number();

-- Insert sample work order for testing
INSERT INTO work_orders (customer_name, customer_phone, vehicle_id, service_type, priority, description, service_advisor_id)
SELECT 'John Doe', '555-0123', v.id, 'routine_maintenance', 'normal', 'Regular oil change and inspection', u.id
FROM vehicles v, users u
WHERE v.plate_number = 'ABC-123' AND u.email = 'admin@tonplatform.com'
LIMIT 1
ON CONFLICT (wo_number) DO NOTHING;