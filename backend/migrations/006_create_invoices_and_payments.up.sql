-- Create invoices table
-- This table manages customer invoices and billing

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    work_order_id INTEGER REFERENCES work_orders(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    invoice_type VARCHAR(30) NOT NULL, -- service, rental, parts, labor, fees, other
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, issued, sent, partial, paid, overdue, cancelled, refunded
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00, -- percentage
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    final_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total_amount - discount_amount) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    notes TEXT,
    terms TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice_items table
-- This table stores line items for invoices

CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_percent/100)) STORED,
    tax_amount DECIMAL(12, 2) GENERATED ALWAYS AS (line_total * tax_rate/100) STORED,
    total_with_tax DECIMAL(12, 2) GENERATED ALWAYS AS (line_total + tax_amount) STORED,
    item_type VARCHAR(30) NOT NULL, -- labor, parts, fees, taxes, other
    reference_type VARCHAR(30), -- work_order_part, work_order_labor, etc.
    reference_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
-- This table tracks all payment transactions

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- cash, card, bank_transfer, check, credit, online, mobile
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, cancelled, refunded, partially_refunded
    transaction_id VARCHAR(100), -- Payment gateway transaction ID
    gateway VARCHAR(30), -- stripe, paypal, square, authorize, manual
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    processed_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    refund_amount DECIMAL(12, 2) DEFAULT 0,
    refund_reason VARCHAR(200),
    refund_date DATE,
    gateway_response JSONB, -- Store gateway response data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_splits table
-- This table handles split payments across multiple methods

CREATE TABLE IF NOT EXISTS payment_splits (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    split_method VARCHAR(30) NOT NULL,
    split_amount DECIMAL(12, 2) NOT NULL,
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice_payment_history table
-- This table tracks payment history for invoices

CREATE TABLE IF NOT EXISTS invoice_payment_history (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),
    payment_id INTEGER REFERENCES payments(id),
    action VARCHAR(30) NOT NULL, -- payment, refund, adjustment, write_off
    amount DECIMAL(12, 2) NOT NULL,
    balance_after DECIMAL(12, 2) NOT NULL,
    performed_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_work_order_id ON invoices(work_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_name ON invoices(customer_name);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_item_type ON invoice_items(item_type);
CREATE INDEX IF NOT EXISTS idx_invoice_items_reference ON invoice_items(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_sort_order ON invoice_items(sort_order);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_number ON payments(payment_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_gateway ON payments(gateway);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_processed_by ON payments(processed_by);

CREATE INDEX IF NOT EXISTS idx_payment_splits_payment_id ON payment_splits(payment_id);

CREATE INDEX IF NOT EXISTS idx_invoice_payment_history_invoice_id ON invoice_payment_history(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payment_history_action ON invoice_payment_history(action);
CREATE INDEX IF NOT EXISTS idx_invoice_payment_history_created_at ON invoice_payment_history(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    month_part TEXT;
    sequence_num TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    month_part := LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::TEXT, 2, '0');

    -- Get next sequence number for this month/year
    SELECT LPAD((COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 9 FOR 4) AS INTEGER)), 0) + 1)::TEXT, 4, '0')
    INTO sequence_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year_part || month_part || '-%';

    -- If no invoices exist for this month, start with 0001
    IF sequence_num IS NULL OR sequence_num = '' THEN
        sequence_num := '0001';
    END IF;

    NEW.invoice_number := 'INV-' || year_part || month_part || '-' || sequence_num;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to generate invoice numbers
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Create function to generate payment numbers
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;

    -- Get next sequence number for this year
    SELECT LPAD((COALESCE(MAX(CAST(SUBSTRING(payment_number FROM 8 FOR 6) AS INTEGER)), 0) + 1)::TEXT, 6, '0')
    INTO sequence_num
    FROM payments
    WHERE payment_number LIKE 'PAY-' || year_part || '%';

    -- If no payments exist for this year, start with 000001
    IF sequence_num IS NULL OR sequence_num = '' THEN
        sequence_num := '000001';
    END IF;

    NEW.payment_number := 'PAY-' || year_part || '-' || sequence_num;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to generate payment numbers
CREATE TRIGGER generate_payment_number_trigger
    BEFORE INSERT ON payments
    FOR EACH ROW
    EXECUTE FUNCTION generate_payment_number();

-- Create function to update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE invoices
    SET
        subtotal = COALESCE((SELECT SUM(line_total) FROM invoice_items WHERE invoice_id = NEW.invoice_id), 0),
        tax_amount = COALESCE((SELECT SUM(tax_amount) FROM invoice_items WHERE invoice_id = NEW.invoice_id), 0),
        total_amount = COALESCE((SELECT SUM(total_with_tax) FROM invoice_items WHERE invoice_id = NEW.invoice_id), 0)
    WHERE id = NEW.invoice_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update invoice totals
CREATE TRIGGER update_invoice_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_totals();

-- Insert sample invoice for testing
INSERT INTO invoices (customer_name, invoice_type, status, created_by)
SELECT 'John Doe', 'service', 'draft', u.id
FROM users u
WHERE u.email = 'admin@tonplatform.com'
LIMIT 1
ON CONFLICT (invoice_number) DO NOTHING;