-- Drop vehicles and telematics migration
DROP TRIGGER IF EXISTS update_dtc_last_seen_trigger ON dtc_codes;
DROP FUNCTION IF EXISTS update_dtc_last_seen();
DROP TABLE IF EXISTS dtc_codes;
DROP TABLE IF EXISTS telematics_data;
DROP TABLE IF EXISTS vehicles;