#!/bin/bash

# Database Migration Runner for TON Platform
# This script runs all database migrations in order

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[TON PLATFORM]${NC} $1"
}

# Database connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-ton_platform}"
DB_USER="${DB_USER:-ton_user}"
DB_PASSWORD="${DB_PASSWORD:-ton_password}"

MIGRATIONS_DIR="migrations"

print_header "Database Migration Runner"
echo "======================================"
echo "Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "User: $DB_USER"
echo "Migrations Directory: $MIGRATIONS_DIR"
echo ""

# Check if PostgreSQL is running
print_status "Checking database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    print_error "Cannot connect to PostgreSQL database"
    echo "Please ensure PostgreSQL is running and accessible"
    echo "Connection details: postgresql://$DB_USER:***@$DB_HOST:$DB_PORT/postgres"
    exit 1
fi

print_status "✅ Database connection successful"

# Check if database exists, create if not
print_status "Checking database existence..."
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    print_status "Creating database: $DB_NAME"
    PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
fi

print_status "✅ Database '$DB_NAME' is ready"

# Function to run migration up
run_migration_up() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file" ".up.sql")

    print_status "Running migration: $migration_name"

    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration_file"; then
        print_status "✅ Migration completed: $migration_name"
        return 0
    else
        print_error "❌ Migration failed: $migration_name"
        return 1
    fi
}

# Function to run migration down
run_migration_down() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file" ".down.sql")

    print_status "Rolling back migration: $migration_name"

    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration_file"; then
        print_status "✅ Rollback completed: $migration_name"
        return 0
    else
        print_error "❌ Rollback failed: $migration_name"
        return 1
    fi
}

# Get migration action
ACTION=${1:-up}

case $ACTION in
    "up")
        print_header "Running UP migrations"
        echo "========================"

        # Get all .up.sql files and run them in order
        for migration in $(ls -1 "$MIGRATIONS_DIR"/*.up.sql | sort); do
            if ! run_migration_up "$migration"; then
                print_error "Migration failed. Stopping execution."
                exit 1
            fi
            echo ""
        done

        print_header "Migration Summary"
        echo "==================="
        print_status "✅ All UP migrations completed successfully"
        echo ""
        echo "Database schema is now ready for TON Platform backend!"
        ;;

    "down")
        print_warning "ROLLING BACK ALL MIGRATIONS"
        echo "This will delete all data and schema!"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_header "Running DOWN migrations"
            echo "=========================="

            # Get all .down.sql files and run them in reverse order
            for migration in $(ls -1 "$MIGRATIONS_DIR"/*.down.sql | sort -r); do
                if ! run_migration_down "$migration"; then
                    print_error "Rollback failed. Stopping execution."
                    exit 1
                fi
                echo ""
            done

            print_status "✅ All DOWN migrations completed"
        else
            print_status "Rollback cancelled"
        fi
        ;;

    "status")
        print_header "Migration Status"
        echo "=================="

        # List all available migrations
        echo "Available UP migrations:"
        ls -1 "$MIGRATIONS_DIR"/*.up.sql 2>/dev/null | sed 's/^/  /' || echo "  No .up.sql files found"
        echo ""
        echo "Available DOWN migrations:"
        ls -1 "$MIGRATIONS_DIR"/*.down.sql 2>/dev/null | sed 's/^/  /' || echo "  No .down.sql files found"
        echo ""

        # Show current database tables
        print_status "Current database tables:"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt" 2>/dev/null | sed 's/^/  /' || echo "  No tables found"
        ;;

    "test")
        print_header "Running Migration Tests"
        echo "============================="

        if [ -f "$MIGRATIONS_DIR/007_create_migration_test.up.sql" ]; then
            if run_migration_up "$MIGRATIONS_DIR/007_create_migration_test.up.sql"; then
                print_status "✅ All migration tests passed!"
            else
                print_error "❌ Migration tests failed!"
                exit 1
            fi
        else
            print_warning "Migration test file not found"
        fi
        ;;

    *)
        echo "Usage: $0 {up|down|status|test}"
        echo ""
        echo "Commands:"
        echo "  up     - Run all UP migrations (default)"
        echo "  down   - Rollback all DOWN migrations"
        echo "  status - Show migration status and current database tables"
        echo "  test   - Run migration validation tests"
        echo ""
        exit 1
        ;;
esac

echo ""
print_header "Migration runner complete"
echo "============================="