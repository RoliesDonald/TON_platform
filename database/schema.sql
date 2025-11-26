-- =================================================================
-- TON Vehicle Management System Database Schema
-- Based on Prisma Schema - Converted to PostgreSQL DDL
-- =================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- ENUMS
-- =================================================================

-- Company Types
CREATE TYPE company_type AS ENUM (
    'CUSTOMER',
    'VENDOR',
    'RENTAL_COMPANY',
    'SERVICE_MAINTENANCE',
    'FLEET_COMPANY',
    'INTERNAL',
    'CAR_USER',
    'SUPPLIER'
);

-- Company Status
CREATE TYPE company_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PROSPECT',
    'SUSPENDED',
    'ON_HOLD'
);

-- Company Role
CREATE TYPE company_role AS ENUM (
    'MAIN_COMPANY',
    'CHILD_COMPANY'
);

-- Vehicle Types
CREATE TYPE vehicle_type AS ENUM (
    'PASSENGER',
    'COMMERCIAL',
    'MOTORCYCLE'
);

-- Vehicle Categories
CREATE TYPE vehicle_category AS ENUM (
    'SEDAN',
    'HATCH_BACK',
    'MPV',
    'SUV',
    'CROSSOVER',
    'COUPE',
    'CABRIOLET',
    'STATION_WAGON',
    'ROADSTER',
    'MINI_VAN',
    'PICKUP',
    'SMALL_VAN',
    'MINI_BUS',
    'LIGHT_TRUCK',
    'BOX_TRUCK',
    'WING_BOX',
    'DUMP_TRUCK',
    'TANKER_TRUCK',
    'TRAILER',
    'FLATBED_TRUCK',
    'REFRIGERATED_TRUCK',
    'CAR_CARRIER',
    'CONCRETE_MIXER_TRUCK',
    'LOG_CARRIER_TRUCK',
    'MEDIUM_BUS',
    'BIG_BUS',
    'SCOOTER',
    'CUB_BIKE',
    'SPORT_BIKE',
    'NAKED_BIKE',
    'CRUISER',
    'TOURING_BIKE',
    'TRAIL_DUAL',
    'E_BIKE',
    'ALL_TERRAIN_VEHICLE',
    'MOPED'
);

-- Vehicle Fuel Types
CREATE TYPE vehicle_fuel_type AS ENUM (
    'GASOLINE',
    'DIESEL',
    'HYBRID',
    'ELECTRIC',
    'LPG',
    'CNG'
);

-- Vehicle Transmission Types
CREATE TYPE vehicle_transmission_type AS ENUM (
    'MANUAL/MT',
    'AUTOMATIC/AT',
    'CVT',
    'AMT',
    'SEMI_AUTOMATIC',
    'DCT/DSG',
    'ELECTRIC_CVT'
);

-- Vehicle Status
CREATE TYPE vehicle_status AS ENUM (
    'ACTIVE',
    'AVAILABLE',
    'IN_MAINTENANCE',
    'RENTED',
    'OUT_OF_SERVICE',
    'BRAKE_DOWN',
    'ON_HOLD'
);

-- Vehicle Ownership Status
CREATE TYPE vehicle_ownership_status AS ENUM (
    'OWNED',
    'RENT',
    'LEASE'
);

-- Employee Roles
CREATE TYPE employee_role AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'FLEET_PIC',
    'FLEET_MANAGER',
    'FLEET_STAFF',
    'SERVICE_MANAGER',
    'SERVICE_ADVISOR',
    'FINANCE_MANAGER',
    'FINANCE_STAFF',
    'SALES_MANAGER',
    'SALES_STAFF',
    'ACCOUNTING_MANAGER',
    'ACCOUNTING_STAFF',
    'WAREHOUSE_MANAGER',
    'WAREHOUSE_STAFF',
    'PURCHASING_MANAGER',
    'PURCHASING_STAFF',
    'MECHANIC',
    'USER',
    'DRIVER',
    'PIC'
);

-- Employee Positions
CREATE TYPE employee_position AS ENUM (
    'STAFF',
    'SUPERVISOR',
    'MANAGER',
    'SENIOR_MANAGER',
    'DIRECTOR',
    'VICE_PRESIDENT',
    'CHIEF_LEVEL'
);

-- Employee Status
CREATE TYPE employee_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'ON_LEAVE',
    'TERMINATED'
);

-- Gender
CREATE TYPE gender AS ENUM (
    'MALE',
    'FEMALE'
);

-- Part Variants
CREATE TYPE part_variant AS ENUM (
    'OEM',
    'AFTERMARKET',
    'RECONDITIONED',
    'USED',
    'GBOX'
);

-- Spare Part Categories
CREATE TYPE spare_part_category AS ENUM (
    'ENGINE',
    'BRAKE',
    'SUSPENSION',
    'ELECTRICAL',
    'BODY',
    'TIRE',
    'LIGHTING',
    'EXHAUST',
    'COOLING',
    'STEERING',
    'TRANSMISSION',
    'INTERIOR',
    'EXTERIOR',
    'FILTERS',
    'FLUIDS',
    'TOOLS',
    'ACCESSORIES',
    'OTHER'
);

-- Spare Part Status
CREATE TYPE spare_part_status AS ENUM (
    'AVAILABLE',
    'LOW_STOCK',
    'OUT_OF_STOCK',
    'DISCONTINUED'
);

-- Work Order Progress Status
CREATE TYPE wo_progress_status AS ENUM (
    'DRAFT',
    'PENDING',
    'ON_PROCESS',
    'WAITING_APPROVAL',
    'WAITING_PART',
    'FINISHED',
    'CANCELED',
    'INVOICE_CREATED'
);

-- Work Order Task Status
CREATE TYPE work_order_task_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED',
    'CANCELED'
);

-- Work Order Priority
CREATE TYPE wo_priority_type AS ENUM (
    'NORMAL',
    'URGENT',
    'EMERGENCY'
);

-- Invoice Status
CREATE TYPE invoice_status AS ENUM (
    'DRAFT',
    'PENDING',
    'PAID',
    'CANCELED',
    'OVERDUE',
    'REJECTED',
    'SENT',
    'PARTIALLY_PAID'
);

-- Invoice Item Status
CREATE TYPE invoice_item_status AS ENUM (
    'DRAFT',
    'ISSUED',
    'PAID',
    'VOID'
);

-- Estimation Status
CREATE TYPE estimation_status AS ENUM (
    'DRAFT',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);

-- Purchase Order Status
CREATE TYPE purchase_order_status AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'COMPLETED',
    'CANCELED',
    'ORDERED',
    'SHIPPED',
    'RECEIVED',
    'PARTIALLY_RECEIVED'
);

-- Stock Transaction Types
CREATE TYPE stock_transaction_type AS ENUM (
    'IN',
    'OUT',
    'ADJUSTMENT',
    'TRANSFER',
    'RETURN'
);

-- Warehouse Types
CREATE TYPE warehouse_type AS ENUM (
    'CENTRAL_WAREHOUSE',
    'BRANCH_WAREHOUSE',
    'SERVICE_CAR_WAREHOUSE'
);

-- Unit Types
CREATE TYPE unit_type AS ENUM (
    'MEASUREMENT',
    'CURRENCY',
    'TIME',
    'OTHER'
);

-- Unit Categories
CREATE TYPE unit_category AS ENUM (
    'LENGTH',
    'WEIGHT',
    'VOLUME',
    'AREA',
    'COUNT',
    'CURRENCY',
    'DURATION',
    'OTHER'
);

-- Contract Status
CREATE TYPE contract_status AS ENUM (
    'ACTIVE',
    'EXPIRED',
    'PENDING'
);

-- Contract Type
CREATE TYPE contract_type AS ENUM (
    'RENTAL',
    'SERVICE_MAINTENANCE'
);

-- =================================================================
-- TABLES
-- =================================================================

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255) UNIQUE NOT NULL,
    company_email VARCHAR(255),
    logo VARCHAR(255),
    contact VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    tax_registered BOOLEAN DEFAULT FALSE,
    company_type company_type NOT NULL,
    status company_status DEFAULT 'ACTIVE',
    company_role company_role NOT NULL,
    parent_company_id UUID REFERENCES companies(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for company_id
CREATE INDEX idx_companies_company_id ON companies(company_id);

-- Units Table (needed before other tables)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    symbol VARCHAR(255),
    unit_type unit_type NOT NULL,
    unit_category unit_category NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees Table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    photo VARCHAR(255),
    phone_number VARCHAR(255),
    address TEXT,
    position employee_position,
    role employee_role DEFAULT 'USER',
    department VARCHAR(255),
    status employee_status DEFAULT 'ACTIVE',
    tanggal_lahir TIMESTAMP WITH TIME ZONE,
    tanggal_bergabung TIMESTAMP WITH TIME ZONE,
    gender gender NOT NULL,
    company_id UUID REFERENCES companies(id),
    current_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_plate VARCHAR(255) UNIQUE NOT NULL,
    vehicle_make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    trim_level VARCHAR(255),
    vin_num VARCHAR(255) UNIQUE,
    engine_num VARCHAR(255) UNIQUE,
    chassis_num VARCHAR(255) UNIQUE,
    year_made INTEGER NOT NULL,
    color VARCHAR(255) NOT NULL,
    start_rent_date TIMESTAMP WITH TIME ZONE,
    end_rent_date TIMESTAMP WITH TIME ZONE,
    vehicle_type vehicle_type NOT NULL,
    vehicle_category vehicle_category NOT NULL,
    fuel_type vehicle_fuel_type NOT NULL,
    transmission_type vehicle_transmission_type NOT NULL,
    last_odometer INTEGER NOT NULL,
    last_service_date TIMESTAMP WITH TIME ZONE,
    status vehicle_status NOT NULL,
    notes TEXT,
    photo VARCHAR(255),
    description TEXT,
    owner_id UUID NOT NULL REFERENCES companies(id),
    car_user_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spare Parts Table
CREATE TABLE spare_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category spare_part_category NOT NULL,
    sub_category VARCHAR(255),
    stock_quantity INTEGER DEFAULT 0,
    initial_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    supplier_id UUID REFERENCES companies(id),
    status spare_part_status DEFAULT 'AVAILABLE',
    variant part_variant DEFAULT 'OEM',
    make VARCHAR(255),
    brand VARCHAR(255),
    manufacturer VARCHAR(255),
    created_by_id UUID REFERENCES employees(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    employee_id UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations Table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Orders Table
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wo_number VARCHAR(255) UNIQUE NOT NULL,
    wo_master VARCHAR(255) NOT NULL,
    wo_date TIMESTAMP WITH TIME ZONE NOT NULL,
    settled_odo INTEGER,
    remark TEXT NOT NULL,
    schedule_date TIMESTAMP WITH TIME ZONE,
    vehicle_location VARCHAR(255) NOT NULL,
    notes TEXT,
    vehicle_make VARCHAR(255) NOT NULL,
    progress_status wo_progress_status DEFAULT 'DRAFT',
    priority_type wo_priority_type DEFAULT 'NORMAL',
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    customer_id UUID NOT NULL REFERENCES companies(id),
    car_user_id UUID NOT NULL REFERENCES companies(id),
    vendor_id UUID NOT NULL REFERENCES companies(id),
    mechanic_id UUID REFERENCES employees(id),
    driver_id UUID REFERENCES employees(id),
    driver_contact VARCHAR(255),
    approved_by_id UUID REFERENCES employees(id),
    requested_by_id UUID REFERENCES employees(id),
    location_id UUID REFERENCES locations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Order Tasks Table
CREATE TABLE work_order_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id),
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    status work_order_task_status DEFAULT 'PENDING',
    assigned_to_id UUID REFERENCES employees(id),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    employee_id UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255),
    sub_category VARCHAR(255),
    tasks TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Details Table
CREATE TABLE service_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    service_id UUID NOT NULL REFERENCES services(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Order Services Table
CREATE TABLE work_order_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id),
    service_id UUID NOT NULL REFERENCES services(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_order_id, service_id)
);

-- Work Order Spare Parts Table
CREATE TABLE work_order_spare_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_order_id, spare_part_id)
);

-- Work Order Images Table
CREATE TABLE work_order_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id),
    image_url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Order Items Table
CREATE TABLE work_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_order_id, spare_part_id)
);

-- Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(255) UNIQUE NOT NULL,
    invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
    request_odo INTEGER NOT NULL,
    actual_odo INTEGER NOT NULL,
    remark TEXT,
    finished_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    status invoice_status DEFAULT 'DRAFT',
    wo_id UUID UNIQUE NOT NULL REFERENCES work_orders(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    accountant_id UUID REFERENCES employees(id),
    approved_by_id UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice Items Table
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status invoice_item_status DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(invoice_id, spare_part_id)
);

-- Invoice Services Table
CREATE TABLE invoice_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    service_id UUID NOT NULL REFERENCES services(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(invoice_id, service_id)
);

-- Estimations Table
CREATE TABLE estimations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimation_number VARCHAR(255) UNIQUE NOT NULL,
    estimation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    request_odo INTEGER NOT NULL,
    actual_odo INTEGER NOT NULL,
    remark TEXT NOT NULL,
    notes TEXT,
    finished_date TIMESTAMP WITH TIME ZONE,
    total_estimated_amount DECIMAL(10,2) NOT NULL,
    status estimation_status NOT NULL,
    work_order_id UUID UNIQUE NOT NULL REFERENCES work_orders(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    mechanic_id UUID REFERENCES employees(id),
    accountant_id UUID REFERENCES employees(id),
    approved_by_id UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estimation Items Table
CREATE TABLE estimation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimation_id UUID NOT NULL REFERENCES estimations(id),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(estimation_id, spare_part_id)
);

-- Estimation Services Table
CREATE TABLE estimation_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimation_id UUID NOT NULL REFERENCES estimations(id),
    service_id UUID NOT NULL REFERENCES services(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(estimation_id, service_id)
);

-- Purchase Orders Table
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(255) UNIQUE NOT NULL,
    po_date TIMESTAMP WITH TIME ZONE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES companies(id),
    delivery_address TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 11,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE,
    status purchase_order_status DEFAULT 'DRAFT',
    requested_by_id UUID REFERENCES employees(id),
    approved_by_id UUID REFERENCES employees(id),
    remark TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Order Items Table
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(po_id, spare_part_id)
);

-- Warehouses Table
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    warehouse_type warehouse_type DEFAULT 'BRANCH_WAREHOUSE',
    company_id UUID REFERENCES companies(id),
    parent_warehouse_id UUID REFERENCES warehouses(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warehouse Stocks Table
CREATE TABLE warehouse_stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    current_stock INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(spare_part_id, warehouse_id)
);

-- Stock Transactions Table
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(255) UNIQUE NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type stock_transaction_type NOT NULL,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    source_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    target_warehouse_id UUID REFERENCES warehouses(id),
    quantity INTEGER NOT NULL,
    notes TEXT,
    processed_by_id UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Required Spare Parts Table
CREATE TABLE service_required_spare_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    unit_id UUID NOT NULL REFERENCES units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, spare_part_id)
);

-- Spare Part Suitable Vehicles Table
CREATE TABLE spare_part_suitable_vehicles (
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    vehicle_make VARCHAR(255) NOT NULL,
    vehicle_model VARCHAR(255) NOT NULL,
    trim_level VARCHAR(255),
    model_year INTEGER,
    PRIMARY KEY (spare_part_id, vehicle_make, vehicle_model)
);

-- Contracts Table
CREATE TABLE contracts (
    id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
    contract_number VARCHAR(255) UNIQUE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status contract_status NOT NULL,
    type contract_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    company_code VARCHAR(255),
    customer_code VARCHAR(255),
    company_id UUID NOT NULL REFERENCES companies(id)
);

-- Contracted Services Table
CREATE TABLE contracted_services (
    id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
    contract_id VARCHAR(255) NOT NULL REFERENCES contracts(id),
    service_id UUID NOT NULL REFERENCES services(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Contract Sequence Table
CREATE TABLE contract_sequence (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    company_code VARCHAR(255) NOT NULL,
    sequence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(year, company_code)
);

-- Work Order Sequence Table
CREATE TABLE work_order_sequence (
    id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
    vendor VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    sequence INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor, year, month)
);

-- Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    valid BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- INDEXES
-- =================================================================

-- Performance indexes
CREATE INDEX idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX idx_vehicles_car_user_id ON vehicles(car_user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);

CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_email ON employees(email);

CREATE INDEX idx_work_orders_vehicle_id ON work_orders(vehicle_id);
CREATE INDEX idx_work_orders_customer_id ON work_orders(customer_id);
CREATE INDEX idx_work_orders_vendor_id ON work_orders(vendor_id);
CREATE INDEX idx_work_orders_status ON work_orders(progress_status);
CREATE INDEX idx_work_orders_date ON work_orders(wo_date);

CREATE INDEX idx_spare_parts_supplier_id ON spare_parts(supplier_id);
CREATE INDEX idx_spare_parts_category ON spare_parts(category);
CREATE INDEX idx_spare_parts_part_number ON spare_parts(part_number);

CREATE INDEX idx_invoices_vehicle_id ON invoices(vehicle_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

CREATE INDEX idx_warehouse_stocks_spare_part_id ON warehouse_stocks(spare_part_id);
CREATE INDEX idx_warehouse_stocks_warehouse_id ON warehouse_stocks(warehouse_id);

-- =================================================================
-- TRIGGERS FOR UPDATED_AT
-- =================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spare_parts_updated_at BEFORE UPDATE ON spare_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_order_tasks_updated_at BEFORE UPDATE ON work_order_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_order_services_updated_at BEFORE UPDATE ON work_order_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_order_spare_parts_updated_at BEFORE UPDATE ON work_order_spare_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_order_images_updated_at BEFORE UPDATE ON work_order_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_order_items_updated_at BEFORE UPDATE ON work_order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_services_updated_at BEFORE UPDATE ON invoice_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estimations_updated_at BEFORE UPDATE ON estimations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estimation_items_updated_at BEFORE UPDATE ON estimation_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estimation_services_updated_at BEFORE UPDATE ON estimation_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_order_items_updated_at BEFORE UPDATE ON purchase_order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouse_stocks_updated_at BEFORE UPDATE ON warehouse_stocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_transactions_updated_at BEFORE UPDATE ON stock_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_required_spare_parts_updated_at BEFORE UPDATE ON service_required_spare_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_details_updated_at BEFORE UPDATE ON service_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_order_sequence_updated_at BEFORE UPDATE ON work_order_sequence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();