-- Drop work orders migration
DROP TRIGGER IF EXISTS generate_work_order_number_trigger ON work_orders;
DROP FUNCTION IF EXISTS generate_work_order_number();
DROP TRIGGER IF EXISTS track_work_order_status_change_trigger ON work_orders;
DROP FUNCTION IF EXISTS track_work_order_status_change();
DROP TABLE IF EXISTS work_order_status_history;
DROP TABLE IF EXISTS work_order_photos;
DROP TABLE IF EXISTS work_order_labor;
DROP TABLE IF EXISTS work_order_parts;
DROP TABLE IF EXISTS work_orders;