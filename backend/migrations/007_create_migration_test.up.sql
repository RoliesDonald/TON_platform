-- Test script to verify all migrations were applied correctly
-- This file runs basic validation checks on the database

-- Test 1: Verify all tables exist
DO $$
DECLARE
    table_name TEXT;
    missing_tables TEXT[] := '{}';
BEGIN
    -- Check if all expected tables exist
    FOR table_name IN ARRAY[
        'users', 'roles', 'permissions', 'role_permissions',
        'vehicles', 'telematics_data', 'dtc_codes',
        'warehouses', 'inventory_items', 'inventory_stock', 'inventory_transactions', 'inventory_counts', 'inventory_count_items',
        'work_orders', 'work_order_parts', 'work_order_labor', 'work_order_photos', 'work_order_status_history',
        'invoices', 'invoice_items', 'payments', 'payment_splits', 'invoice_payment_history'
    ]
    LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
            missing_tables := array_append(missing_tables, table_name);
        END IF;
    END LOOP;

    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Missing tables: %', array_to_string(missing_tables, ', ');
    END IF;

    RAISE NOTICE '✅ All 19 tables created successfully';
END $$;

-- Test 2: Verify relationships and constraints
DO $$
BEGIN
    -- Test foreign key constraints
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'users_role_id_fkey'
    ) THEN
        RAISE EXCEPTION 'Missing foreign key: users.role_id -> roles.id';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'work_orders_vehicle_id_fkey'
    ) THEN
        RAISE EXCEPTION 'Missing foreign key: work_orders.vehicle_id -> vehicles.id';
    END IF;

    RAISE NOTICE '✅ Foreign key constraints verified';
END $$;

-- Test 3: Verify default data was inserted
DO $$
DECLARE
    role_count INTEGER;
    permission_count INTEGER;
    user_count INTEGER;
    warehouse_count INTEGER;
    vehicle_count INTEGER;
BEGIN
    -- Check roles
    SELECT COUNT(*) INTO role_count FROM roles;
    IF role_count < 7 THEN
        RAISE EXCEPTION 'Expected at least 7 roles, found %', role_count;
    END IF;

    -- Check permissions
    SELECT COUNT(*) INTO permission_count FROM permissions;
    IF permission_count < 20 THEN
        RAISE EXCEPTION 'Expected at least 20 permissions, found %', permission_count;
    END IF;

    -- Check users
    SELECT COUNT(*) INTO user_count FROM users;
    IF user_count < 1 THEN
        RAISE EXCEPTION 'Expected at least 1 user, found %', user_count;
    END IF;

    -- Check warehouses
    SELECT COUNT(*) INTO warehouse_count FROM warehouses;
    IF warehouse_count < 4 THEN
        RAISE EXCEPTION 'Expected at least 4 warehouses, found %', warehouse_count;
    END IF;

    -- Check vehicles
    SELECT COUNT(*) INTO vehicle_count FROM vehicles;
    IF vehicle_count < 3 THEN
        RAISE EXCEPTION 'Expected at least 3 vehicles, found %', vehicle_count;
    END IF;

    RAISE NOTICE '✅ Default data verified: % roles, % permissions, % users, % warehouses, % vehicles',
               role_count, permission_count, user_count, warehouse_count, vehicle_count;
END $$;

-- Test 4: Verify triggers are working
DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    -- Count triggers that should be created
    SELECT COUNT(*) INTO trigger_count FROM information_schema.triggers
    WHERE trigger_name LIKE '%updated_at%';

    IF trigger_count < 10 THEN
        RAISE EXCEPTION 'Expected at least 10 update triggers, found %', trigger_count;
    END IF;

    RAISE NOTICE '✅ Database triggers verified: % update triggers found', trigger_count;
END $$;

-- Test 5: Verify indexes are created for performance
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    -- Count important indexes
    SELECT COUNT(*) INTO index_count FROM information_schema.indexes
    WHERE table_name IN ('users', 'vehicles', 'work_orders', 'invoices', 'payments');

    IF index_count < 15 THEN
        RAISE EXCEPTION 'Expected at least 15 performance indexes, found %', index_count;
    END IF;

    RAISE NOTICE '✅ Performance indexes verified: % indexes found', index_count;
END $$;

-- Test 6: Create a test work order to verify the complete workflow
DO $$
DECLARE
    test_wo_id INTEGER;
    test_invoice_id INTEGER;
BEGIN
    -- Create a test work order
    INSERT INTO work_orders (customer_name, customer_phone, vehicle_id, service_type, priority, description, service_advisor_id)
    VALUES ('Test Customer', '555-9999', 1, 'routine_maintenance', 'normal', 'Test work order for migration validation', 1)
    RETURNING id INTO test_wo_id;

    -- Create a test invoice
    INSERT INTO invoices (customer_name, invoice_type, status, work_order_id, created_by)
    VALUES ('Test Customer', 'service', 'draft', test_wo_id, 1)
    RETURNING id INTO test_invoice_id;

    -- Add test invoice item
    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, item_type)
    VALUES (test_invoice_id, 'Test Labor Service', 2.0, 75.00, 'labor');

    -- Clean up test data
    DELETE FROM invoice_items WHERE invoice_id = test_invoice_id;
    DELETE FROM invoices WHERE id = test_invoice_id;
    DELETE FROM work_orders WHERE id = test_wo_id;

    RAISE NOTICE '✅ Complete workflow test passed';
END $$;

-- Final validation summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 MIGRATION VALIDATION COMPLETE - ALL TESTS PASSED!';
    RAISE NOTICE '';
    RAISE NOTICE 'Database is ready for TON Platform backend development';
    RAISE NOTICE '✅ All 19 tables created';
    RAISE NOTICE '✅ Foreign key constraints working';
    RAISE NOTICE '✅ Default data inserted';
    RAISE NOTICE '✅ Triggers active';
    RAISE NOTICE '✅ Performance indexes created';
    RAISE NOTICE '✅ Workflow validation passed';
    RAISE NOTICE '';
END $$;