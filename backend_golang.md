**CONTEXT:**
You are the lead backend developer for the "TON Platform" project. Your primary instruction source is the **PRODUCT_SPEC_TON_FINAL_EN.md** file. All work must use **Golang** and **PostgreSQL**. The architecture must strictly follow the **Clean Architecture** pattern.

**TASK 1: Core Setup & User Management (EPIC 1 & Matrix)**
1.  Initialize the Golang project structure adhering to Clean Architecture (Domain, Service, Repository, Infrastructure).
2.  Implement the PostgreSQL connection and a basic migration for the core tables: `users`, `roles`, `permissions`, and `warehouses` (implementing the Besar, Cabang, Kecil hierarchy).
3.  Implement **JWT Authentication** and the **Role/Permission Middleware** required by the provided matrix.
4.  Provide the Golang `User` model, the `UserRepository` interface, and the `UserService` implementation for user registration/login.

**TASK 2: Work Order (WO) & Stock Transfer API (EPIC 2)**
1.  Implement the `WorkOrder` model and the service layer logic for API: `POST /api/v1/servicerequest` (Service Request initiation).
2.  Implement the API: `POST /api/v1/inventory/transfer`. The associated service logic must perform a database transaction to decrement stock from `from_warehouse_id` and increment stock at `to_warehouse_id` in the `inventory_transactions` table.

**TASK 3: Telematics Data Ingestion (EPIC 4)**
1.  Design the Golang struct models for `vehicle_telematics` and `vehicle_dtc_logs`.
2.  Create a high-throughput endpoint (suggesting a simple POST handler, or describe a gRPC handler) at `/api/v1/telematics/ingest` to receive raw GPS/Sensor data.
3.  Provide the *placeholder* Golang service logic to trigger an alert/log when a critical DTC is detected.

**OUTPUT REQUIREMENT:**
Provide the following Go files:
* `internal/domain/user.go` (Structs for User, Role, Permission)
* `internal/repository/user_postgres.go` (PostgreSQL implementation draft)
* `internal/service/workorder_service.go` (Logic draft for `servicerequest` and `inventory/transfer`)
* `cmd/api/middleware/auth.go` (JWT and basic Role Check middleware).