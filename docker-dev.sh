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
    echo "  clean         Remove all containers and volumes"
    echo "  status        Show status of all services"
    echo ""
}

# Start services
start_services() {
    print_header "Starting TON Platform services..."

    case $1 in
        "db")
            print_status "Starting database services only..."
            docker-compose up -d postgres redis
            ;;
        "backend")
            print_status "Starting database and backend services..."
            docker-compose --profile backend up -d
            ;;
        "frontend")
            print_status "Starting all services including frontend..."
            docker-compose --profile backend --profile frontend up -d
            ;;
        "full")
            print_status "Starting all services..."
            docker-compose --profile backend --profile frontend up -d
            ;;
        *)
            print_status "Starting database services only (default)..."
            docker-compose up -d postgres redis
            print_warning "Use '$0 backend' to include backend service"
            print_warning "Use '$0 frontend' or '$0 full' to include all services"
            ;;
    esac

    print_status "Services started successfully!"
    sleep 2
    docker-compose ps
}

# Stop services
stop_services() {
    print_header "Stopping TON Platform services..."
    docker-compose down
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
    docker-compose logs -f
}

# Clean up
clean_all() {
    print_header "Cleaning up TON Platform environment..."
    print_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Show status
show_status() {
    print_header "TON Platform Service Status"
    docker-compose ps
}

# Main script logic
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
    "clean")
        clean_all
        ;;
    "status")
        show_status
        ;;
    *)
        show_usage
        exit 1
        ;;
esac