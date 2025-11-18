#!/bin/bash

# RBAC API Testing Script
# This script tests the Role-Based Access Control system endpoints

# Configuration
API_BASE_URL="http://localhost:8080/api/v1"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_test() {
    echo -e "\n${YELLOW}Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ Success: $1${NC}"
}

print_error() {
    echo -e "${RED}❌ Error: $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  Info: $1${NC}"
}

# Global variables for tokens
ADMIN_TOKEN=""
SERVICE_ADVISOR_TOKEN=""
MECHANIC_TOKEN=""

# Test functions
test_health_check() {
    print_header "Health Check"

    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$API_BASE_URL/../health")
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

    if [ "$http_code" = "200" ]; then
        print_success "Health check passed"
        echo "$body" | jq '.'
    else
        print_error "Health check failed with HTTP $http_code"
        echo "$body"
        exit 1
    fi
}

# Authentication functions
register_and_login_user() {
    local username=$1
    local email=$2
    local role=$3
    local token_var=$4

    print_test "Registering $username ($role)"

    register_response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$username\",
            \"email\": \"$email\",
            \"password\": \"SecurePass123!\",
            \"first_name\": \"Test\",
            \"last_name\": \"User\",
            \"role_id\": $role
        }" \
        "$API_BASE_URL/auth/register")

    register_http_code=$(echo $register_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # User might already exist, that's OK for testing
    if [ "$register_http_code" != "201" ] && [ "$register_http_code" != "409" ]; then
        print_error "Registration failed with HTTP $register_http_code"
        echo $register_response | sed -e 's/HTTPSTATUS:.*//g' | jq '.'
        return 1
    fi

    # Login user
    print_test "Logging in $username"
    login_response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"SecurePass123!\"
        }" \
        "$API_BASE_URL/auth/login")

    login_http_code=$(echo $login_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    login_body=$(echo $login_response | sed -e 's/HTTPSTATUS:.*//g')

    if [ "$login_http_code" = "200" ]; then
        token=$(echo $login_body | jq -r '.data.access_token')
        export "$token_var"="$token"
        print_success "$username logged in successfully"
        print_info "Token: ${token:0:50}..."
    else
        print_error "Login failed with HTTP $login_http_code"
        echo $login_body | jq '.'
        return 1
    fi
}

# API test functions
test_with_token() {
    local description=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    local token=$5
    local data=$6

    print_test "$description"

    auth_header=""
    if [ -n "$token" ]; then
        auth_header="-H \"Authorization: Bearer $token\""
    fi

    data_arg=""
    if [ -n "$data" ]; then
        data_arg="-d \"$data\""
    fi

    cmd="curl -s -w \"HTTPSTATUS:%{http_code}\" -X $method -H \"Content-Type: application/json\" $auth_header $data_arg \"$endpoint\""

    response=$(eval $cmd)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

    if [ "$http_code" = "$expected_status" ]; then
        print_success "$description (HTTP $http_code)"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "$body" | jq -r '.message // .data // .'
        fi
    else
        print_error "$description (Expected $expected_status, got $http_code)"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "$body" | jq -r '.message // .error // .'
        fi
    fi
}

test_role_management() {
    print_header "Role Management Tests"

    # Test getting all roles (should work with admin token)
    test_with_token "Get all roles (Admin)" \
        "GET" \
        "$API_BASE_URL/roles" \
        "200" \
        "$ADMIN_TOKEN"

    # Test getting permissions list
    test_with_token "Get all permissions (Admin)" \
        "GET" \
        "$API_BASE_URL/permissions" \
        "200" \
        "$ADMIN_TOKEN"

    # Test getting specific role (try role ID 1 which should be Administrator)
    test_with_token "Get Administrator role details" \
        "GET" \
        "$API_BASE_URL/roles/1" \
        "200" \
        "$ADMIN_TOKEN"

    # Test creating a new role (admin only)
    test_with_token "Create custom role" \
        "POST" \
        "$API_BASE_URL/roles" \
        "201" \
        "$ADMIN_TOKEN" \
        "{
            \"name\": \"Test Role\",
            \"description\": \"A role for testing purposes\"
        }"
}

test_rbac_demo_endpoints() {
    print_header "RBAC Demo Endpoint Tests"

    print_info "Testing with Service Advisor token"
    echo "Service Advisor should be able to:"

    test_with_token "Read vehicles" \
        "GET" \
        "$API_BASE_URL/demo/vehicles" \
        "200" \
        "$SERVICE_ADVISOR_TOKEN"

    test_with_token "Create work orders" \
        "POST" \
        "$API_BASE_URL/demo/work-orders" \
        "200" \
        "$SERVICE_ADVISOR_TOKEN"

    test_with_token "Read inventory" \
        "GET" \
        "$API_BASE_URL/demo/inventory" \
        "403" \
        "$SERVICE_ADVISOR_TOKEN" \
        ""  # Should fail

    test_with_token "Access dashboard" \
        "GET" \
        "$API_BASE_URL/demo/dashboards/main" \
        "403" \
        "$SERVICE_ADVISOR_TOKEN" \
        ""  # Should fail

    print_info "Testing with Mechanic token"
    echo "Mechanic should be able to:"

    test_with_token "Read work orders" \
        "GET" \
        "$API_BASE_URL/demo/work-orders" \
        "200" \
        "$MECHANIC_TOKEN"

    test_with_token "Read inventory" \
        "GET" \
        "$API_BASE_URL/demo/inventory" \
        "200" \
        "$MECHANIC_TOKEN"

    test_with_token "Create vehicles" \
        "POST" \
        "$API_BASE_URL/demo/vehicles" \
        "403" \
        "$MECHANIC_TOKEN" \
        ""  # Should fail

    test_with_token "Create work orders" \
        "POST" \
        "$API_BASE_URL/demo/work-orders" \
        "403" \
        "$MECHANIC_TOKEN" \
        ""  # Should fail
}

test_permission_combinations() {
    print_header "Permission Combination Tests"

    # Test multi-permission endpoint
    test_with_token "Multi-permission endpoint (Service Advisor - should work)" \
        "GET" \
        "$API_BASE_URL/demo/multi-permission" \
        "200" \
        "$SERVICE_ADVISOR_TOKEN"

    test_with_token "Multi-permission endpoint (Mechanic - should work)" \
        "GET" \
        "$API_BASE_URL/demo/multi-permission" \
        "200" \
        "$MECHANIC_TOKEN"

    # Test resource owner endpoint
    test_with_token "Resource owner endpoint" \
        "GET" \
        "$API_BASE_URL/demo/my-work-orders/123" \
        "403" \
        "$SERVICE_ADVISOR_TOKEN" \
        ""  # Should fail since we don't have proper resource ownership setup
}

test_admin_functions() {
    print_header "Admin Function Tests"

    # Test admin dashboard access
    test_with_token "Admin dashboard access" \
        "GET" \
        "$API_BASE_URL/admin/dashboard" \
        "200" \
        "$ADMIN_TOKEN"

    # Test that Service Advisor cannot access admin dashboard
    test_with_token "Admin dashboard access (Service Advisor - should fail)" \
        "GET" \
        "$API_BASE_URL/admin/dashboard" \
        "403" \
        "$SERVICE_ADVISOR_TOKEN" \
        ""

    # Test protected user info endpoint
    test_with_token "Protected user info (Admin)" \
        "GET" \
        "$API_BASE_URL/protected/me" \
        "200" \
        "$ADMIN_TOKEN"

    test_with_token "Protected user info (Service Advisor)" \
        "GET" \
        "$API_BASE_URL/protected/me" \
        "200" \
        "$SERVICE_ADVISOR_TOKEN"
}

# Main execution
main() {
    print_header "TON Platform RBAC API Tests"
    print_info "Started at: $TIMESTAMP"

    # Check if required tools are available
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        print_error "jq is required but not installed"
        exit 1
    fi

    # Run tests
    test_health_check

    # Setup authentication tokens
    print_header "Authentication Setup"
    register_and_login_user "admin" "admin@tonplatform.com" "1" "ADMIN_TOKEN"
    register_and_login_user "serviceadvisor" "sa@tonplatform.com" "4" "SERVICE_ADVISOR_TOKEN"  # Assuming role ID 4 is Service Advisor
    register_and_login_user "mechanic" "mechanic@tonplatform.com" "5" "MECHANIC_TOKEN"  # Assuming role ID 5 is Mechanic

    # Check if we got tokens
    if [ -z "$ADMIN_TOKEN" ] || [ -z "$SERVICE_ADVISOR_TOKEN" ] || [ -z "$MECHANIC_TOKEN" ]; then
        print_error "Failed to obtain authentication tokens. Check role IDs in database."
        print_info "You may need to update the role IDs in the script."
        exit 1
    fi

    # Run RBAC tests
    test_role_management
    test_rbac_demo_endpoints
    test_permission_combinations
    test_admin_functions

    print_header "Test Summary"
    print_success "RBAC API tests completed"
    print_info "Review the output above for any failed tests"
    print_info "You can now test individual endpoints using the stored tokens"
    print_info ""
    print_info "Admin Token: ${ADMIN_TOKEN:0:50}..."
    print_info "Service Advisor Token: ${SERVICE_ADVISOR_TOKEN:0:50}..."
    print_info "Mechanic Token: ${MECHANIC_TOKEN:0:50}..."
}

# Help function
show_help() {
    echo "TON Platform RBAC API Testing Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -u, --url      API base URL (default: http://localhost:8080/api/v1)"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run tests against localhost"
    echo "  $0 --url https://api.tonplatform.com/api/v1  # Run tests against production"
    echo ""
    echo "Prerequisites:"
    echo "  - curl"
    echo "  - jq"
    echo "  - Running TON Platform API server"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -u|--url)
            API_BASE_URL="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main