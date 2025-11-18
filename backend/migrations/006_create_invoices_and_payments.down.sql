-- Drop invoices and payments migration
DROP TRIGGER IF EXISTS update_invoice_totals_trigger ON invoice_items;
DROP FUNCTION IF EXISTS update_invoice_totals();
DROP TRIGGER IF EXISTS generate_payment_number_trigger ON payments;
DROP FUNCTION IF EXISTS generate_payment_number();
DROP TRIGGER IF EXISTS generate_invoice_number_trigger ON invoices;
DROP FUNCTION IF EXISTS generate_invoice_number();
DROP TABLE IF EXISTS invoice_payment_history;
DROP TABLE IF EXISTS payment_splits;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;