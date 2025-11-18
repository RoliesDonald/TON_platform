-- Drop inventory and warehouses migration
DROP TRIGGER IF EXISTS update_warehouse_stock_trigger ON inventory_stock;
DROP FUNCTION IF EXISTS update_warehouse_stock_level();
DROP TABLE IF EXISTS inventory_count_items;
DROP TABLE IF EXISTS inventory_counts;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS inventory_stock;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS warehouses;