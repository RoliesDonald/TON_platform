#!/bin/bash

# TON Platform Docker Development Script
# This script helps manage the Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Cannot connect to Docker daemon. Please check Docker is running and you have permissions."
        print_status "Try: sudo systemctl start docker"
        print_status "Or add your user to docker group: sudo usermod -aG docker \$USER"
        print_status "Then log out and log back in, or use: sudo $0 $*"
        exit 1
    fi
}

# Check if docker compose is available
check_docker_compose() {
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
}

# Initialize database if needed
init_database() {
    print_status "Checking database initialization..."

    # Check if postgres container is running
    if docker compose ps postgres | grep -q "Up"; then
        print_status "PostgreSQL is already running"
        return 0
    fi

    print_status "Starting PostgreSQL for initialization..."
    docker compose up -d postgres

    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
        if docker compose exec -T postgres pg_isready -U ton_user -d ton_platform &> /dev/null; then
            print_status "PostgreSQL is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_warning "PostgreSQL startup timed out, but continuing..."
        fi
        sleep 2
    done
}

# Function to print colored output
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

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start         Start all services (database only by default)"
    echo "  stop          Stop all services"
    echo "  restart       Restart all services"
    echo "  logs          Show logs for all services"
    echo "  db            Start only database services"
    echo "  backend       Start database and backend"
    echo "  frontend      Start database, backend, and frontend"
    echo "  full          Start all services including backend and frontend"
    echo "  init          Initialize database with demo data"
    echo "  connect       Test database connection"
    echo "  clean         Remove all containers and volumes"
    echo "  status        Show status of all services"
    echo ""
    echo "Database Management:"
    echo "  The script automatically handles database creation and demo data"
    echo "  PostgreSQL: localhost:5432 (user: ton_user, db: ton_platform)"
    echo "  Redis: localhost:6379"
    echo ""
    echo "Examples:"
    echo "  $0 full                    # Start complete stack"
    echo "  $0 init                    # Initialize database only"
    echo "  $0 connect                 # Test database connection"
    echo "  sudo $0 backend            # Start with database permissions"
    echo ""
}

# Start services
start_services() {
    print_header "Starting TON Platform services..."

    # Check Docker availability first
    check_docker
    check_docker_compose

    # Handle permissions first
    handle_permissions

    case $1 in
        "db")
            print_status "Starting database services only..."
            docker compose up -d postgres
            sleep 5
            manage_database
            test_database
            docker compose up -d redis
            ;;
        "backend")
            print_status "Starting database and backend services..."
            docker compose up -d postgres
            sleep 5
            manage_database
            test_database
            docker compose up -d redis
            docker compose --profile backend up -d
            ;;
        "frontend")
            print_status "Starting all services including frontend..."
            docker compose up -d postgres
            sleep 5
            manage_database
            test_database
            docker compose up -d redis
            docker compose --profile backend up -d
            docker compose --profile frontend up -d
            ;;
        "full")
            print_status "Starting all services..."
            docker compose up -d postgres
            sleep 5
            manage_database
            test_database
            docker compose up -d redis
            docker compose --profile backend up -d
            docker compose --profile frontend up -d
            ;;
        "init")
            print_status "Initializing database only..."
            docker compose up -d postgres
            sleep 5
            manage_database
            test_database
            ;;
        "connect")
            print_status "Testing database connection..."
            test_database
            ;;
        *)
            print_status "Starting database services only (default)..."
            docker compose up -d postgres
            sleep 5
            manage_database
            test_database
            docker compose up -d redis
            print_warning "Use '$0 backend' to include backend service"
            print_warning "Use '$0 frontend' or '$0 full' to include all services"
            ;;
    esac

    print_status "Services started successfully!"
    print_status "Access URLs:"
    print_status "  Frontend: http://localhost:3000"
    print_status "  Backend API: http://localhost:8080"
    print_status "  Database: localhost:5432"
    print_status "  Redis: localhost:6379"
    print_status ""
    print_status "Database Commands:"
    print_status "  $0 init     - Initialize database only"
    print_status "  $0 connect  - Test database connection"
    print_status ""
    sleep 3
    docker compose ps
}

# Stop services
stop_services() {
    print_header "Stopping TON Platform services..."
    docker compose down
    print_status "All services stopped!"
}

# Restart services
restart_services() {
    print_header "Restarting TON Platform services..."
    stop_services
    sleep 2
    start_services $1
}

# Show logs
show_logs() {
    print_header "Showing logs for TON Platform services..."
    docker compose logs -f
}

# Clean up
clean_all() {
    print_header "Cleaning up TON Platform environment..."
    print_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v --remove-orphans
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Show status
show_status() {
    print_header "TON Platform Service Status"
    check_docker
    docker compose ps
}

# Handle permissions and fix Docker group membership
handle_permissions() {
    if ! docker info &> /dev/null; then
        print_warning "Docker requires elevated permissions."

        # Try to add user to docker group and fix permissions
        if command -v sudo &> /dev/null; then
            print_status "Adding user to docker group..."
            if sudo usermod -aG docker $USER; then
                print_status "✅ User added to docker group!"
                print_warning "⚠️  You must log out and log back in for changes to take effect."
                print_status "After logging back in, run: $0 $*"

                # Set up Docker for current session
                print_status "Setting up Docker for current session..."
                if [ -S "/var/run/docker.sock" ]; then
                    sudo chmod 666 /var/run/docker.sock 2>/dev/null
                    sudo chown $USER:docker /var/run/docker.sock 2>/dev/null || true
                    export DOCKER_HOST=unix:///var/run/docker.sock
                    print_status "✅ Docker permissions fixed for current session!"
                fi

                # Restart Docker daemon if possible
                if command -v systemctl &> /dev/null; then
                    sudo systemctl restart docker 2>/dev/null || print_warning "Could not restart Docker daemon"
                elif command -v service &> /dev/null; then
                    sudo service docker restart 2>/dev/null || print_warning "Could not restart Docker service"
                fi

                # Wait for Docker to be ready
                sleep 3

                # Test Docker access
                if docker info &> /dev/null; then
                    print_status "✅ Docker access successful!"
                    return 0
                else
                    print_warning "Docker access still requires logout/login"
                    print_status "Please log out and log back in, then run: $0 $*"
                    return 1
                fi
            else
                print_error "❌ Failed to add user to docker group"
                print_status "Manual setup required:"
                print_status "  sudo usermod -aG docker $USER"
                print_status "  Then log out and log back in"
                exit 1
            fi
        else
            print_error "❌ Sudo not available. Manual setup required:"
            print_status "1. Add user to docker group with: sudo usermod -aG docker $USER"
            print_status "2. Log out and log back in"
            print_status "3. Run this script again: $0 $*"
            exit 1
        fi
    else
        print_status "✅ Docker access confirmed!"
        return 0
    fi
}

# Database connection management
manage_database() {
    print_status "Managing database connections..."

    # Create database if it doesn't exist
    print_status "Creating database if needed..."
    docker compose exec -T postgres psql -U ton_user -d postgres -c "CREATE DATABASE ton_platform;" 2>/dev/null || print_status "Database already exists"

    # Run database migrations
    if [ -f "backend/migrations/001_init.sql" ]; then
        print_status "Running database migrations..."
        docker compose exec -T postgres psql -U ton_user -d ton_platform < backend/migrations/001_init.sql 2>/dev/null || print_warning "Migration failed or already applied"
    fi

    # Create demo users if tables exist
    print_status "Creating demo users..."
    docker compose exec -T postgres psql -U ton_user -d ton_platform -c "
        INSERT INTO users (username, email, first_name, last_name, password_hash, role, is_active, created_at, updated_at)
        VALUES
        ('admin', 'admin@tonplatform.com', 'Admin', 'User', '\$2a\$10\$demo\$hash', 'Administrator', true, NOW(), NOW()),
        ('sarah.mechanic', 'sarah@tonplatform.com', 'Sarah', 'Williams', '\$2a\$10\$demo\$hash', 'Fleet Manager', true, NOW(), NOW()),
        ('michael.service', 'michael@tonplatform.com', 'Michael', 'Brown', '\$2a\$10\$demo\$hash', 'Service Advisor', true, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING;
    " 2>/dev/null || print_warning "Demo users already exist or tables not ready"

    print_status "Database setup completed!"
}

# Test database connection
test_database() {
    print_status "Testing database connection..."
    if docker compose exec -T postgres pg_isready -U ton_user -d ton_platform &> /dev/null; then
        print_status "✅ Database connection successful!"
        return 0
    else
        print_error "❌ Database connection failed!"
        return 1
    fi
}

# Alternative approach without sudo
try_local_setup() {
    print_status "Attempting to run services locally without Docker..."

    # Check if we can start frontend locally
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        print_status "Frontend is available locally. Run: cd frontend && npm run dev"
        print_status "Frontend will be available at: http://localhost:3000"
    fi

    # Check if we can start backend locally
    if [ -d "backend" ] && [ -f "backend/simple_server.go" ]; then
        print_status "Backend is available locally. Check Go installation and run:"
        print_status "  cd backend && export PATH=\$HOME/go/bin:\$PATH && go run simple_server.go"
        print_status "Backend API will be available at: http://localhost:8080"
    fi

    print_warning "Database (PostgreSQL) and Redis require Docker installation or local setup"
}

# Check if Docker is available, if not offer local alternatives
check_environment() {
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        print_status "Docker is available - using containerized setup"
        return 0
    else
        print_warning "Docker is not available or requires elevated permissions"
        print_status "Falling back to local development setup..."
        try_local_setup
        return 1
    fi
}

# Main script logic
if ! check_environment; then
    exit 0
fi

# Handle Docker permissions automatically
if handle_permissions; then
    print_status "✅ Docker permissions ready!"

    # If no arguments provided, default to starting full stack
    if [ -z "$1" ]; then
        print_status "No command provided, defaulting to 'full' stack startup..."
        start_services "full"
        exit $?
    fi
fi

case $1 in
    "start")
        start_services $2
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services $2
        ;;
    "logs")
        show_logs
        ;;
    "db")
        start_services "db"
        ;;
    "backend")
        start_services "backend"
        ;;
    "frontend")
        start_services "frontend"
        ;;
    "full")
        start_services "full"
        ;;
    "init")
        start_services "init"
        ;;
    "connect")
        start_services "connect"
        ;;
    "clean")
        clean_all
        ;;
    "status")
        show_status
        ;;
    "fix-permissions"|"fix"|"setup")
        # Run permission handling and then proceed with full stack
        if handle_permissions; then
            print_status "✅ Permissions fixed! Starting full stack..."
            start_services "full"
        else
            print_error "❌ Could not fix Docker permissions"
            exit 1
        fi
        ;;
    *)
        show_usage
        exit 1
        ;;
esac


# docker compose --profile full up -d)
