# Tasks: TON Platform - Integrated Business Management System

**Input**: Design documents from `/specs/001-ton-platform-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tasks include test cases for critical functionality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/internal/`, `backend/cmd/`, `backend/migrations/`
- **Frontend**: `frontend/src/`, `frontend/components/`
- **Mobile**: `mobile/lib/`
- **Database**: `database/migrations/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend project structure following Clean Architecture
- [ ] T002 Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)
- [ ] T003 [P] Create frontend Next.js project with TypeScript and Tailwind
- [ ] T004 [P] Initialize Flutter project with Riverpod state management
- [ ] T005 [P] Configure ESLint, Prettier, and Go formatting tools
- [ ] T006 Setup Docker Compose with PostgreSQL and Redis services
- [ ] T007 [P] Configure environment-based settings management

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Setup PostgreSQL database with initial schema and migrations
- [ ] T009 [P] Implement JWT authentication framework with bcrypt password hashing
- [ ] T010 [P] Create role-based access control (RBAC) middleware for 6 user roles
- [ ] T011 [P] Setup API routing structure with Gin framework
- [ ] T012 Implement error handling and logging infrastructure
- [ ] T013 Create base domain entities (User, Role, Permission) in backend/internal/domain/
- [ ] T014 Setup database connection and transaction handling
- [ ] T015 Configure CORS, rate limiting, and security middleware

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core User Management & Authentication (Priority: P1) 🎯 MVP

**Goal**: Secure user registration, authentication, and role-based access control for all business sectors

**Independent Test**: Create different user types (Mechanic, Service Advisor, Warehouse Staff, Driver, Area Manager, Accountant) and verify each can only access their designated features

### Tests for User Story 1

- [ ] T016 [P] [US1] Contract test for user registration endpoint in tests/contract/test_auth.go
- [ ] T017 [P] [US1] Integration test for role-based access control in tests/integration/test_rbac.go
- [ ] T018 [P] [US1] Unit test for JWT token generation and validation in tests/unit/test_jwt.go

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create User repository interface in backend/internal/repository/user_postgres.go
- [ ] T020 [P] [US1] Implement UserService in backend/internal/service/auth_service.go
- [ ] T021 [US1] Create authentication handlers in backend/internal/handler/auth_handler.go
- [ ] T022 [US1] Implement user registration endpoint POST /api/v1/auth/register
- [ ] T023 [US1] Implement user login endpoint POST /api/v1/auth/login
- [ ] T024 [US1] Add token refresh endpoint POST /api/v1/auth/refresh
- [ ] T025 [US1] Create role assignment functionality for administrators
- [ ] T026 [P] [US1] Design frontend login page in frontend/src/app/auth/login/page.tsx
- [ ] T027 [P] [US1] Implement auth context provider in frontend/src/contexts/AuthContext.tsx
- [ ] T028 [US1] Create role-based navigation components in frontend/src/components/Layout.tsx
- [ ] T029 [US1] Add user profile management pages for each role type

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Vehicle Asset & Fleet Management (Priority: P1) 🎯 MVP

**Goal**: Register, track, and monitor all vehicle assets including status, location, and maintenance history

**Independent Test**: Register vehicles, assign them to different business operations, and verify status changes correctly across all relevant views

### Tests for User Story 2

- [ ] T030 [P] [US2] Contract test for vehicle registration endpoints in tests/contract/test_vehicle.go
- [ ] T031 [P] [US2] Integration test for vehicle status updates in tests/integration/test_fleet.go

### Implementation for User Story 2

- [ ] T032 [P] [US2] Create Vehicle domain model in backend/internal/domain/vehicle.go
- [ ] T033 [P] [US2] Create Vehicle repository in backend/internal/repository/vehicle_postgres.go
- [ ] T034 [US2] Implement VehicleService in backend/internal/service/vehicle_service.go
- [ ] T035 [US2] Create vehicle handlers in backend/internal/handler/vehicle_handler.go
- [ ] T036 [US2] Implement vehicle registration endpoint POST /api/v1/vehicles
- [ ] T037 [US2] Implement vehicle status update endpoint PUT /api/v1/vehicles/{id}/status
- [ ] T038 [US2] Create vehicle listing endpoint GET /api/v1/vehicles with filtering
- [ ] T039 [P] [US2] Design vehicle registry dashboard in frontend/src/app/vehicles/page.tsx
- [ ] T040 [P] [US2] Create vehicle detail view component in frontend/src/components/VehicleDetail.tsx
- [ ] T041 [US2] Implement vehicle status management interface
- [ ] T042 [US2] Add vehicle search and filtering functionality

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Workshop Service Order Management (Priority: P1) 🎯 MVP

**Goal**: Create, assign, and track work orders for vehicle maintenance and repairs with parts usage tracking

**Independent Test**: Create work orders, assign to mechanics, and track through completion including parts usage and time tracking

### Tests for User Story 3

- [ ] T043 [P] [US3] Contract test for work order lifecycle endpoints in tests/contract/test_workorder.go
- [ ] T044 [P] [US3] Integration test for mechanic assignment workflow in tests/integration/test_workshop.go

### Implementation for User Story 3

- [ ] T045 [P] [US3] Create WorkOrder domain model in backend/internal/domain/workorder.go
- [ ] T046 [P] [US3] Create WorkOrder repository in backend/internal/repository/workorder_postgres.go
- [ ] T047 [US3] Implement WorkOrderService in backend/internal/service/workorder_service.go
- [ ] T048 [US3] Create work order handlers in backend/internal/handler/workorder_handler.go
- [ ] T049 [US3] Implement work order creation endpoint POST /api/v1/workorders
- [ ] T050 [US3] Implement work order assignment endpoint PUT /api/v1/workorders/{id}/assign
- [ ] T051 [US3] Create work order progress update endpoint PUT /api/v1/workorders/{id}/progress
- [ ] T052 [US3] Implement work order completion endpoint PUT /api/v1/workorders/{id}/complete
- [ ] T053 [P] [US3] Design work order management dashboard in frontend/src/app/workorders/page.tsx
- [ ] T054 [P] [US3] Create work order detail component in frontend/src/components/WorkOrderDetail.tsx
- [ ] T055 [US3] Implement mechanic assignment interface for Service Advisors
- [ ] T056 [P] [US3] Create mobile work order view for mechanics in mobile/lib/features/workorder/
- [ ] T057 [US3] Add parts usage recording functionality to work orders

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Multi-Location Inventory Management (Priority: P1) 🎯 MVP

**Goal**: Manage spare parts inventory across multiple warehouse locations with real-time stock tracking

**Independent Test**: Manage inventory across multiple locations, transfer stock between locations, and verify real-time stock accuracy

### Tests for User Story 4

- [ ] T058 [P] [US4] Contract test for inventory management endpoints in tests/contract/test_inventory.go
- [ ] T059 [P] [US4] Integration test for stock transfer workflow in tests/integration/test_inventory.go

### Implementation for User Story 4

- [ ] T060 [P] [US4] Create InventoryItem and Warehouse domain models in backend/internal/domain/inventory.go
- [ ] T061 [P] [US4] Create Inventory repository in backend/internal/repository/inventory_postgres.go
- [ ] T062 [US4] Implement InventoryService in backend/internal/service/inventory_service.go
- [ ] T063 [US4] Create inventory handlers in backend/internal/handler/inventory_handler.go
- [ ] T064 [US4] Implement inventory listing endpoint GET /api/v1/inventory
- [ ] T065 [US4] Create stock intake endpoint POST /api/v1/inventory/intake
- [ ] T066 [US4] Implement stock transfer endpoint POST /api/v1/inventory/transfer
- [ ] T067 [US4] Create stock adjustment endpoint POST /api/v1/inventory/adjustment
- [ ] T068 [P] [US4] Design inventory management dashboard in frontend/src/app/inventory/page.tsx
- [ ] T069 [P] [US4] Create warehouse selection component in frontend/src/components/WarehouseSelector.tsx
- [ ] T070 [US4] Implement stock transfer interface with source/destination selection
- [ ] T071 [P] [US4] Create mobile inventory management for warehouse staff in mobile/lib/features/inventory/

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - Digital Invoicing & Payment Processing (Priority: P2)

**Goal**: Generate invoices for completed services and process payments through multiple payment gateways

**Independent Test**: Create invoices for different service types, generate payment links, and process payments through the system

### Tests for User Story 5

- [ ] T072 [P] [US5] Contract test for invoice generation endpoints in tests/contract/test_invoice.go
- [ ] T073 [P] [US5] Integration test for payment processing workflow in tests/integration/test_payment.go

### Implementation for User Story 5

- [ ] T074 [P] [US5] Create Invoice and Payment domain models in backend/internal/domain/invoice.go
- [ ] T075 [P] [US5] Create Invoice repository in backend/internal/repository/invoice_postgres.go
- [ ] T076 [US5] Implement InvoiceService in backend/internal/service/invoice_service.go
- [ ] T077 [US5] Create PaymentService with gateway integration in backend/internal/service/payment_service.go
- [ ] T078 [US5] Create invoice handlers in backend/internal/handler/invoice_handler.go
- [ ] T079 [US5] Implement invoice generation endpoint POST /api/v1/invoices
- [ ] T080 [US5] Create payment link generation endpoint POST /api/v1/invoices/{id}/generate-payment
- [ ] T081 [US5] Implement payment webhook endpoint POST /api/v1/payments/webhook
- [ ] T082 [P] [US5] Design invoice management interface in frontend/src/app/invoices/page.tsx
- [ ] T083 [P] [US5] Create invoice detail component with payment status in frontend/src/components/InvoiceDetail.tsx
- [ ] T084 [US5] Implement payment status tracking and reconciliation interface

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 6 - Real-time Telematics & Vehicle Tracking (Priority: P2)

**Goal**: Monitor vehicle locations, engine diagnostics, and usage patterns through integrated telematics

**Independent Test**: Integrate with telematics devices, receive GPS/OBD2 data, and display vehicle status on tracking dashboards

### Tests for User Story 6

- [ ] T085 [P] [US6] Contract test for telematics data ingestion endpoint in tests/contract/test_telematics.go
- [ ] T086 [P] [US6] Integration test for vehicle tracking dashboard in tests/integration/test_tracking.go

### Implementation for User Story 6

- [ ] T087 [P] [US6] Create Telematics domain models in backend/internal/domain/telematics.go
- [ ] T088 [P] [US6] Create Telematics repository in backend/internal/repository/telematics_postgres.go
- [ ] T089 [US6] Implement TelematicsService in backend/internal/service/telematics_service.go
- [ ] T090 [US6] Create telematics handlers in backend/internal/handler/telematics_handler.go
- [ ] T091 [US6] Implement telematics data ingestion endpoint POST /api/v1/telematics/ingest
- [ ] T092 [US6] Create vehicle status endpoint GET /api/v1/vehicles/{id}/realtime-status
- [ ] T093 [US6] Implement DTC alert processing and automatic service request generation
- [ ] T094 [P] [US6] Design real-time tracking dashboard in frontend/src/app/tracking/page.tsx
- [ ] T095 [P] [US6] Create vehicle map component with real-time updates in frontend/src/components/VehicleMap.tsx
- [ ] T096 [US6] Implement DTC code display and alert interface
- [ ] T097 [US6] Add vehicle location history and route tracking

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 9: User Story 7 - Mobile Field Operations Support (Priority: P2)

**Goal**: Mobile applications for field staff including job management, parts usage, and vehicle inspections

**Independent Test**: Deploy mobile apps to different user types and verify they can perform their complete workflow from mobile devices

### Tests for User Story 7

- [ ] T098 [P] [US7] Contract test for mobile API endpoints in tests/contract/test_mobile.go
- [ ] T099 [P] [US7] Integration test for offline synchronization in tests/integration/test_mobile_sync.go

### Implementation for User Story 7

- [ ] T100 [P] [US7] Create mobile authentication state management in mobile/lib/providers/auth_provider.dart
- [ ] T101 [P] [US7] Implement offline data storage with Hive in mobile/lib/core/storage/
- [ ] T102 [US7] Create synchronization service for offline data in mobile/lib/core/sync/
- [ ] T103 [P] [US7] Design mechanic job sheet interface in mobile/lib/features/workorder/screens/job_sheet_detail_screen.dart
- [ ] T104 [P] [US7] Create mobile inventory management interface in mobile/lib/features/inventory/
- [ ] T105 [US7] Implement driver vehicle tracking interface in mobile/lib/features/tracking/
- [ ] T106 [US7] Add parts usage recording with barcode scanning capability
- [ ] T107 [US7] Create vehicle inspection forms and checklists
- [ ] T108 [US7] Implement push notifications for work order assignments
- [ ] T109 [US7] Add offline-first functionality for all critical operations

**Checkpoint**: At this point, User Story 7 should be fully functional and testable independently

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, optimization, and production readiness

- [ ] T110 [P] Implement comprehensive error handling and user-friendly error messages
- [ ] T111 [P] Add logging and monitoring for all critical business operations
- [ ] T112 [P] Implement data validation and sanitization across all endpoints
- [ ] T113 [P] Add performance optimization and caching strategies
- [ ] T114 [P] Create comprehensive API documentation
- [ ] T115 [P] Implement backup and disaster recovery procedures
- [ ] T116 [P] Add security scanning and vulnerability assessment
- [ ] T117 [P] Create deployment scripts and CI/CD pipeline
- [ ] T118 [P] Implement user training materials and documentation
- [ ] T119 [P] Add comprehensive testing coverage (unit, integration, E2E)

**Final Checkpoint**: Complete, production-ready TON Platform system

---

## Dependencies

### User Story Completion Order
1. **User Story 1** (Authentication) - Foundation for all other stories
2. **User Story 2** (Vehicles) - Core asset management
3. **User Story 3** (Work Orders) - Core business operations
4. **User Story 4** (Inventory) - Supporting operations
5. **User Story 5** (Invoicing) - Business operations
6. **User Story 6** (Telematics) - Enhanced functionality
7. **User Story 7** (Mobile) - Field operations

### Parallel Execution Opportunities
- **Phase 1**: All setup tasks (T001-T007) can run in parallel
- **Phase 2**: All foundational tasks (T008-T015) can run in parallel after setup
- **Within each User Story**: Model and repository creation tasks can run in parallel
- **Frontend/Backend**: UI components can be developed in parallel with backend APIs
- **Testing**: Test cases can be written in parallel with implementation

## Implementation Strategy

### MVP Scope (First Release)
- **User Story 1**: Complete authentication and role management
- **User Story 2**: Basic vehicle registry and status tracking
- **User Story 3**: Work order creation and assignment workflow
- **User Story 4**: Single-location inventory management

### Incremental Delivery
- **Phase 1**: Deploy authentication system for user testing
- **Phase 2**: Add vehicle management and basic operations
- **Phase 3**: Implement complete workshop management
- **Phase 4**: Add inventory management
- **Phase 5+**: Enhanced features (payments, telematics, mobile)

## Summary

- **Total Tasks**: 119
- **Tasks per User Story**:
  - US1 (Authentication): 14 tasks
  - US2 (Vehicles): 12 tasks
  - US3 (Work Orders): 15 tasks
  - US4 (Inventory): 14 tasks
  - US5 (Invoicing): 13 tasks
  - US6 (Telematics): 13 tasks
  - US7 (Mobile): 10 tasks
- **Parallel Opportunities**: 64 parallelizable tasks (54%)
- **MVP Tasks**: 43 tasks (Setup + Foundational + US1-US4)

**Next Steps**: Proceed with Phase 1-4 for MVP delivery, then incrementally add remaining user stories based on business priorities and user feedback.