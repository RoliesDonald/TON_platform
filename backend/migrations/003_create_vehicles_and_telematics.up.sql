-- Create vehicles table
-- This table stores all vehicle information in the fleet

CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30),
    type VARCHAR(30) NOT NULL, -- sedan, suv, truck, motorcycle, etc.
    category VARCHAR(30) NOT NULL, -- rental, workshop, customer, company
    status VARCHAR(30) NOT NULL DEFAULT 'available',
    odometer INTEGER DEFAULT 0,
    engine_type VARCHAR(20), -- gasoline, diesel, electric, hybrid
    fuel_type VARCHAR(20),
    transmission VARCHAR(20), -- manual, automatic, cvt
    last_service_date DATE,
    next_service_date DATE,
    insurance_expiry DATE,
    registration_expiry DATE,
    location VARCHAR(100),
    assigned_to VARCHAR(100), -- driver, mechanic, etc.
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create telematics_data table
-- This table stores real-time vehicle telematics information

CREATE TABLE IF NOT EXISTS telematics_data (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    speed DECIMAL(5, 2), -- km/h
    heading DECIMAL(5, 2), -- degrees
    altitude DECIMAL(8, 2), -- meters
    engine_status VARCHAR(20), -- on, off, idle, etc.
    fuel_level DECIMAL(5, 2), -- percentage
    engine_temperature DECIMAL(5, 2), -- celsius
    oil_pressure DECIMAL(6, 2), -- kPa
    battery_voltage DECIMAL(5, 2), -- volts
    engine_rpm INTEGER,
    total_distance DECIMAL(10, 2), -- km
    fuel_consumption DECIMAL(6, 2), -- L/100km
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dtc_codes table (Diagnostic Trouble Codes)
-- This table stores vehicle diagnostic error codes

CREATE TABLE IF NOT EXISTS dtc_codes (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL, -- e.g., P0171, C1234, etc.
    severity VARCHAR(20) NOT NULL, -- info, warning, error, critical
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_active ON vehicles(is_active);

CREATE INDEX IF NOT EXISTS idx_telematics_data_vehicle_id ON telematics_data(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_telematics_data_timestamp ON telematics_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_telematics_data_location ON telematics_data(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_dtc_codes_vehicle_id ON dtc_codes(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_dtc_codes_code ON dtc_codes(code);
CREATE INDEX IF NOT EXISTS idx_dtc_codes_severity ON dtc_codes(severity);
CREATE INDEX IF NOT EXISTS idx_dtc_codes_is_active ON dtc_codes(is_active);

-- Create triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_telematics_data_updated_at
    BEFORE UPDATE ON telematics_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dtc_codes_updated_at
    BEFORE UPDATE ON dtc_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update last_seen in dtc_codes
CREATE OR REPLACE FUNCTION update_dtc_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE dtc_codes
    SET last_seen = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dtc_last_seen_trigger
    BEFORE UPDATE ON dtc_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_dtc_last_seen();

-- Insert sample vehicle data for testing
INSERT INTO vehicles (plate_number, make, model, year, color, type, category, status, engine_type, fuel_type)
VALUES
    ('ABC-123', 'Toyota', 'Camry', 2020, 'Silver', 'sedan', 'rental', 'available', 'gasoline', 'gasoline'),
    ('XYZ-789', 'Ford', 'F-150', 2021, 'Blue', 'truck', 'workshop', 'in_maintenance', 'gasoline', 'gasoline'),
    ('DEF-456', 'Honda', 'CR-V', 2019, 'White', 'suv', 'company', 'available', 'gasoline', 'gasoline')
ON CONFLICT (plate_number) DO NOTHING;