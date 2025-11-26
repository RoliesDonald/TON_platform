-- =================================================================
-- TON Vehicle Management System Database Seed Data
-- =================================================================

-- Insert basic units first (required by other tables)
INSERT INTO units (name, symbol, unit_type, unit_category, description) VALUES
('Piece', 'pcs', 'MEASUREMENT', 'COUNT', 'Individual items'),
('Liter', 'L', 'MEASUREMENT', 'VOLUME', 'Liquid volume measurement'),
('Kilogram', 'kg', 'MEASUREMENT', 'WEIGHT', 'Weight measurement'),
('Meter', 'm', 'MEASUREMENT', 'LENGTH', 'Length measurement'),
('Hour', 'hr', 'TIME', 'DURATION', 'Time duration'),
('US Dollar', '$', 'CURRENCY', 'CURRENCY', 'US Currency');

-- Insert Companies
INSERT INTO companies (id, company_id, company_name, company_email, contact, address, city, tax_registered, company_type, status, company_role) VALUES
-- Rental Companies
('550e8400-e29b-41d4-a716-446655440001', 'RENTAL-001', 'CityLink Rentals', 'info@citylinkrentals.com', '+1-555-0101', '123 Main Street, Suite 100', 'New York', true, 'RENTAL_COMPANY', 'ACTIVE', 'MAIN_COMPANY'),
('550e8400-e29b-41d4-a716-446655440002', 'RENTAL-002', 'FleetWise Solutions', 'contact@fleetwise.com', '+1-555-0102', '456 Oak Avenue, Suite 200', 'Los Angeles', true, 'RENTAL_COMPANY', 'ACTIVE', 'MAIN_COMPANY'),
('550e8400-e29b-41d4-a716-446655440003', 'RENTAL-003', 'AutoLease Pro', 'support@autoleasepro.com', '+1-555-0103', '789 Pine Street, Suite 300', 'Chicago', true, 'RENTAL_COMPANY', 'ACTIVE', 'MAIN_COMPANY'),

-- Service Companies
('550e8400-e29b-41d4-a716-446655440004', 'SERVICE-001', 'QuickFix Auto Service', 'service@quickfix.com', '+1-555-0201', '321 Service Road', 'Houston', true, 'SERVICE_MAINTENANCE', 'ACTIVE', 'MAIN_COMPANY'),
('550e8400-e29b-41d4-a716-446655440005', 'SERVICE-002', 'ProMechanic Garage', 'info@promechanic.com', '+1-555-0202', '654 Workshop Blvd', 'Phoenix', true, 'SERVICE_MAINTENANCE', 'ACTIVE', 'MAIN_COMPANY'),

-- Parts Suppliers
('550e8400-e29b-41d4-a716-446655440006', 'SUPPLIER-001', 'AutoParts Direct', 'sales@autopartsdirect.com', '+1-555-0301', '987 Parts Way', 'Dallas', true, 'SUPPLIER', 'ACTIVE', 'MAIN_COMPANY'),
('550e8400-e29b-41d4-a716-446655440007', 'SUPPLIER-002', 'Global Components Inc', 'orders@globalcomponents.com', '+1-555-0302', '147 Supply Chain Drive', 'Miami', true, 'SUPPLIER', 'ACTIVE', 'MAIN_COMPANY'),

-- Internal/Management
('550e8400-e29b-41d4-a716-446655440008', 'INTERNAL-001', 'TON Management', 'admin@ton.com', '+1-555-0001', '1 Headquarters Plaza', 'San Francisco', true, 'INTERNAL', 'ACTIVE', 'MAIN_COMPANY');

-- Insert Employees
INSERT INTO employees (id, employee_id, name, email, password, phone_number, position, role, department, status, gender, company_id) VALUES
-- Super Admin
('550e8400-e29b-41d4-a716-446655440100', 'EMP-001', 'John Smith', 'admin@ton.com', '$2b$10$dummyhashedpassword', '+1-555-1001', 'CHIEF_LEVEL', 'SUPER_ADMIN', 'Management', 'ACTIVE', 'MALE', '550e8400-e29b-41d4-a716-446655440008'),

-- Fleet Managers
('550e8400-e29b-41d4-a716-446655440101', 'EMP-002', 'Sarah Johnson', 'sarah.j@citylinkrentals.com', '$2b$10$dummyhashedpassword', '+1-555-1002', 'MANAGER', 'FLEET_MANAGER', 'Fleet Management', 'ACTIVE', 'FEMALE', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440102', 'EMP-003', 'Michael Chen', 'michael.c@fleetwise.com', '$2b$10$dummyhashedpassword', '+1-555-1003', 'MANAGER', 'FLEET_MANAGER', 'Fleet Management', 'ACTIVE', 'MALE', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440103', 'EMP-004', 'Emily Davis', 'emily.d@autoleasepro.com', '$2b$10$dummyhashedpassword', '+1-555-1004', 'MANAGER', 'FLEET_MANAGER', 'Fleet Management', 'ACTIVE', 'FEMALE', '550e8400-e29b-41d4-a716-446655440003'),

-- Service Advisors
('550e8400-e29b-41d4-a716-446655440104', 'EMP-005', 'Robert Wilson', 'robert.w@quickfix.com', '$2b$10$dummyhashedpassword', '+1-555-2001', 'SUPERVISOR', 'SERVICE_ADVISOR', 'Service', 'ACTIVE', 'MALE', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440105', 'EMP-006', 'Lisa Martinez', 'lisa.m@promechanic.com', '$2b$10$dummyhashedpassword', '+1-555-2002', 'SUPERVISOR', 'SERVICE_ADVISOR', 'Service', 'ACTIVE', 'FEMALE', '550e8400-e29b-41d4-a716-446655440005'),

-- Mechanics
('550e8400-e29b-41d4-a716-446655440106', 'EMP-007', 'James Taylor', 'james.t@quickfix.com', '$2b$10$dummyhashedpassword', '+1-555-2003', 'STAFF', 'MECHANIC', 'Service', 'ACTIVE', 'MALE', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440107', 'EMP-008', 'Maria Garcia', 'maria.g@promechanic.com', '$2b$10$dummyhashedpassword', '+1-555-2004', 'STAFF', 'MECHANIC', 'Service', 'ACTIVE', 'FEMALE', '550e8400-e29b-41d4-a716-446655440005'),

-- Drivers
('550e8400-e29b-41d4-a716-446655440108', 'EMP-009', 'David Brown', 'david.b@citylinkrentals.com', '$2b$10$dummyhashedpassword', '+1-555-3001', 'STAFF', 'DRIVER', 'Operations', 'ACTIVE', 'MALE', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440109', 'EMP-010', 'Jennifer Lee', 'jennifer.l@fleetwise.com', '$2b$10$dummyhashedpassword', '+1-555-3002', 'STAFF', 'DRIVER', 'Operations', 'ACTIVE', 'FEMALE', '550e8400-e29b-41d4-a716-446655440002');

-- Insert Locations
INSERT INTO locations (id, name, address) VALUES
('550e8400-e29b-41d4-a716-446655440200', 'Downtown Office', '123 Main Street, Suite 100'),
('550e8400-e29b-41d4-a716-446655440201', 'Airport Location', '456 Airport Boulevard'),
('550e8400-e29b-41d4-a716-446655440202', 'Suburban Branch', '789 Suburban Drive'),
('550e8400-e29b-41d4-a716-446655440203', 'Industrial Park', '321 Industrial Way'),
('550e8400-e29b-41d4-a716-446655440204', 'Luxury Collection Center', '654 Premium Avenue');

-- Insert Vehicles (matching the mock data structure)
INSERT INTO vehicles (
    id, license_plate, vehicle_make, model, year_made, color,
    vehicle_type, vehicle_category, fuel_type, transmission_type,
    last_odometer, status, notes, description, owner_id
) VALUES
-- CityLink Rentals Vehicles
('550e8400-e29b-41d4-a716-446655440300', 'ABC-123', 'Toyota', 'Camry', 2024, 'Silver', 'PASSENGER', 'SEDAN', 'GASOLINE', 'AUTOMATIC/AT', 15420, 'AVAILABLE', 'Well-maintained sedan', 'Comfortable and reliable sedan for daily commuting', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440301', 'DEF-456', 'Chevrolet', 'Silverado', 2023, 'Black', 'COMMERCIAL', 'TRUCK', 'GASOLINE', 'AUTOMATIC/AT', 31500, 'IN_MAINTENANCE', 'Regular maintenance scheduled', 'Heavy-duty pickup for cargo transport', '550e8400-e29b-41d4-a716-446655440001'),

-- FleetWise Solutions Vehicles
('550e8400-e29b-41d4-a716-446655440302', 'XYZ-789', 'Honda', 'CR-V', 2023, 'Blue', 'PASSENGER', 'SUV', 'GASOLINE', 'AUTOMATIC/AT', 22800, 'RENTED', 'Currently on rental', 'Compact SUV with AWD capability', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440303', 'JKL-345', 'Mercedes-Benz', 'E-Class', 2024, 'Pearl White', 'PASSENGER', 'LUXURY', 'GASOLINE', 'AUTOMATIC/AT', 12400, 'RESERVED', 'Reserved for premium client', 'Luxury sedan with premium features', '550e8400-e29b-41d4-a716-446655440002'),

-- AutoLease Pro Vehicles
('550e8400-e29b-41d4-a716-446655440304', 'GHI-012', 'Ford', 'Transit', 2024, 'White', 'COMMERCIAL', 'VAN', 'GASOLINE', 'AUTOMATIC/AT', 8750, 'AVAILABLE', 'Cargo van ready for delivery', 'Spacious cargo van for business deliveries', '550e8400-e29b-41d4-a716-446655440003');

-- Insert Warehouses
INSERT INTO warehouses (id, name, location, warehouse_type, company_id) VALUES
('550e8400-e29b-41d4-a716-446655440400', 'Main Warehouse', '123 Storage Street', 'CENTRAL_WAREHOUSE', '550e8400-e29b-41d4-a716-446655440008'),
('550e8400-e29b-41d4-a716-446655440401', 'CityLink Parts Hub', '456 Parts Avenue', 'BRANCH_WAREHOUSE', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440402', 'FleetWise Inventory', '789 Fleet Road', 'BRANCH_WAREHOUSE', '550e8400-e29b-41d4-a716-446655440002');

-- Insert Spare Parts (matching the mock data structure)
INSERT INTO spare_parts (
    id, part_number, sku, part_name, description, price, category, sub_category,
    stock_quantity, min_stock_level, max_stock_level, status, variant,
    make, brand, manufacturer, unit_id
) VALUES
-- Engine Parts
('550e8400-e29b-41d4-a716-446655440500', 'ENG-001', 'OIL-FILTER-001', 'Engine Oil Filter', 'High-quality oil filter for passenger vehicles', 15.99, 'ENGINE', 'OIL_FILTERS', 50, 10, 100, 'AVAILABLE', 'OEM', 'Universal', 'Bosch', 'Robert Bosch GmbH', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440501', 'ENG-002', 'SPARK-PLUG-001', 'Iridium Spark Plug', 'Premium iridium spark plug set', 45.99, 'ENGINE', 'IGNITION', 30, 5, 50, 'AVAILABLE', 'OEM', 'NGK', 'NGK Spark Plug Co.', '550e8400-e29b-41d4-a716-446655440000'),

-- Brake Parts
('550e8400-e29b-41d4-a716-446655440502', 'BRAKE-001', 'BRAKE-PADS-001', 'Front Brake Pads', 'Ceramic brake pads for sedans and SUVs', 89.99, 'BRAKE', 'BRAKE_PADS', 25, 8, 40, 'AVAILABLE', 'OEM', 'Brembo', 'Brembo S.p.A.', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440503', 'BRAKE-002', 'BRAKE-ROTORS-001', 'Brake Rotors', 'Vented brake rotors for improved cooling', 125.99, 'BRAKE', 'BRAKE_ROTORS', 20, 5, 30, 'LOW_STOCK', 'AFTERMARKET', 'Wagner', 'Wagner Brake', '550e8400-e29b-41d4-a716-446655440000'),

-- Suspension Parts
('550e8400-e29b-41d4-a716-446655440504', 'SUSP-001', 'SHOCK-ABS-001', 'Shock Absorbers', 'Gas-charged shock absorbers', 79.99, 'SUSPENSION', 'SHOCK_ABSORBERS', 15, 4, 25, 'AVAILABLE', 'OEM', 'Monroe', 'Tenneco Inc.', '550e8400-e29b-41d4-a716-446655440000'),

-- Tires
('550e8400-e29b-41d4-a716-446655440505', 'TIRE-001', 'TIRE-ALL-SEASON-001', 'All-Season Tire', '215/60R16 all-season passenger tire', 125.99, 'TIRE', 'PASSENGER', 40, 20, 80, 'AVAILABLE', 'OEM', 'Michelin', 'Michelin North America', '550e8400-e29b-41d4-a716-446655440000'),

-- Fluids
('550e8400-e29b-41d4-a716-446655440506', 'FLUID-001', 'ENGINE-OIL-5W30', 'Engine Oil 5W-30', 'Synthetic engine oil 5W-30', 35.99, 'FLUIDS', 'ENGINE_OIL', 60, 15, 100, 'AVAILABLE', 'OEM', 'Mobil', 'ExxonMobil Corporation', '550e8400-e29b-41d4-a716-446655440001');

-- Insert Services
INSERT INTO services (id, name, description, price, category, sub_category, tasks) VALUES
-- Maintenance Services
('550e8400-e29b-41d4-a716-446655440600', 'Oil Change Service', 'Complete oil change with filter replacement', 49.99, 'Maintenance', 'Oil Service', '["Drain old oil", "Replace oil filter", "Add new oil", "Check fluid levels"]'),
('550e8400-e29b-41d4-a716-446655440601', 'Brake Inspection', 'Comprehensive brake system inspection', 89.99, 'Inspection', 'Brake Service', '["Inspect brake pads", "Check brake rotors", "Test brake fluid", "Verify brake lines"]'),
('550e8400-e29b-41d4-a716-446655440602', 'Tire Rotation', 'Rotate tires for even wear', 39.99, 'Maintenance', 'Tire Service', '["Remove tires", "Rotate positions", "Check tire pressure", "Inspect tire condition"]'),

-- Repair Services
('550e8400-e29b-41d4-a716-446655440603', 'Brake Pad Replacement', 'Replace front brake pads', 189.99, 'Repair', 'Brake Service', '["Remove wheels", "Replace brake pads", "Resurface rotors", "Bleed brake system"]'),
('550e8400-e29b-41d4-a716-446655440604', 'Battery Replacement', 'Replace car battery and test charging system', 159.99, 'Repair', 'Electrical', '["Test battery", "Remove old battery", "Install new battery", "Test charging system"]'),

-- Diagnostic Services
('550e8400-e29b-41d4-a716-446655440605', 'Full Vehicle Diagnostic', 'Complete computer diagnostic scan', 129.99, 'Diagnostic', 'General', '["Scan ECU", "Read error codes", "Check sensor data", "Generate report"]');

-- Insert Service Details
INSERT INTO service_details (id, name, quantity, price, service_id, unit_id) VALUES
('550e8400-e29b-41d4-a716-446655440700', 'Labor', 1.0, 35.00, '550e8400-e29b-41d4-a716-446655440600', '550e8400-e29b-41d4-a716-446655440104'),
('550e8400-e29b-41d4-a716-446655440701', 'Engine Oil', 5.0, 5.00, '550e8400-e29b-41d4-a716-446655440600', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440702', 'Oil Filter', 1.0, 12.00, '550e8400-e29b-41d4-a716-446655440600', '550e8400-e29b-41d4-a716-446655440000');

-- Insert Warehouse Stocks
INSERT INTO warehouse_stocks (id, spare_part_id, warehouse_id, current_stock) VALUES
-- Main Warehouse
('550e8400-e29b-41d4-a716-446655440800', '550e8400-e29b-41d4-a716-446655440500', '550e8400-e29b-41d4-a716-446655440400', 30),
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440400', 15),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440400', 20),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440400', 10),
('550e8400-e29b-41d4-a716-446655440804', '550e8400-e29b-41d4-a716-446655440504', '550e8400-e29b-41d4-a716-446655440400', 25),

-- CityLink Parts Hub
('550e8400-e29b-41d4-a716-446655440805', '550e8400-e29b-41d4-a716-446655440506', '550e8400-e29b-41d4-a716-446655440401', 30),

-- FleetWise Inventory
('550e8400-e29b-41d4-a716-446655440806', '550e8400-e29b-41d4-a716-446655440505', '550e8400-e29b-41d4-a716-446655440402', 20);

-- Insert Service Required Spare Parts
INSERT INTO service_required_spare_parts (id, service_id, spare_part_id, quantity, unit_id) VALUES
('550e8400-e29b-41d4-a716-446655440900', '550e8400-e29b-41d4-a716-446655440600', '550e8400-e29b-41d4-a716-446655440500', 1, '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440502', 2, '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440604', '550e8400-e29b-41d4-a716-446655440506', 1, '550e8400-e29b-41d4-a716-446655440101');

-- Insert Sample Work Orders
INSERT INTO work_orders (
    id, wo_number, wo_master, wo_date, settled_odo, remark, schedule_date,
    vehicle_location, vehicle_make, progress_status, priority_type,
    vehicle_id, customer_id, car_user_id, vendor_id, mechanic_id, location_id
) VALUES
-- Maintenance Work Orders
('550e8400-e29b-41d4-a716-446655441000', 'WO-2024-001', 'WO-001', '2024-03-15 09:00:00', 15500, 'Regular maintenance service', '2024-03-15 09:00:00', 'Downtown Office', 'Toyota', 'FINISHED', 'NORMAL', '550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440200'),
('550e8400-e29b-41d4-a716-446655441001', 'WO-2024-002', 'WO-002', '2024-03-18 14:00:00', 23000, 'Brake inspection and pad replacement', '2024-03-18 14:00:00', 'Airport Location', 'Honda', 'ON_PROCESS', 'NORMAL', '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440201'),

-- Diagnostic Work Orders
('550e8400-e29b-41d4-a716-446655441002', 'WO-2024-003', 'WO-003', '2024-03-20 10:30:00', 9000, 'Full diagnostic scan', '2024-03-20 10:30:00', 'Suburban Branch', 'Ford', 'WAITING_APPROVAL', 'NORMAL', '550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440107', '550e8400-e29b-41d4-a716-446655440202');

-- Insert Work Order Tasks
INSERT INTO work_order_tasks (id, work_order_id, task_name, description, status, assigned_to_id) VALUES
('550e8400-e29b-41d4-a716-446655441100', '550e8400-e29b-41d4-a716-446655441000', 'Oil Change', 'Replace engine oil and filter', 'COMPLETED', '550e8400-e29b-41d4-a716-446655440106'),
('550e8400-e29b-41d4-a716-446655441101', '550e8400-e29b-41d4-a716-446655441000', 'Multi-point Inspection', 'Complete vehicle inspection', 'COMPLETED', '550e8400-e29b-41d4-a716-446655440106'),

('550e8400-e29b-41d4-a716-446655441102', '550e8400-e29b-41d4-a716-446655441001', 'Brake Inspection', 'Inspect brake system components', 'COMPLETED', '550e8400-e29b-41d4-a716-446655440106'),
('550e8400-e29b-41d4-a716-446655441103', '550e8400-e29b-41d4-a716-446655441001', 'Brake Pad Replacement', 'Replace front brake pads', 'IN_PROGRESS', '550e8400-e29b-41d4-a716-446655440106'),

('550e8400-e29b-41d4-a716-446655441104', '550e8400-e29b-41d4-a716-446655441002', 'Diagnostic Scan', 'Perform ECU diagnostic scan', 'PENDING', '550e8400-e29b-41d4-a716-446655440107');

-- Insert Sample Sessions (for testing)
INSERT INTO sessions (id, user_id, valid) VALUES
('550e8400-e29b-41d4-a716-446655442000', '550e8400-e29b-41d4-a716-446655440100', true),
('550e8400-e29b-41d4-a716-446655442001', '550e8400-e29b-41d4-a716-446655440101', true),
('550e8400-e29b-41d4-a716-446655442002', '550e8400-e29b-41d4-a716-446655440102', true);

-- Update sequence tables
INSERT INTO work_order_sequence (id, vendor, year, month, sequence) VALUES
('550e8400-e29b-41d4-a716-446655443000', 'QL', 2024, 3, 1),
('550e8400-e29b-41d4-a716-446655443001', 'PM', 2024, 3, 1),
('550e8400-e29b-41d4-a716-446655443002', 'AL', 2024, 3, 1);

INSERT INTO contract_sequence (year, company_code, sequence) VALUES
(2024, 'TON', 1);