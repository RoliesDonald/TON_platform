# 🚀 Spec: TON Platform V2.1 - Integrated Business Management System

**Status:** Ready for Development
**Priority:** Critical
**Target MVP Release:** Q3 2026
**Assignee:** [TBD]
**Labels:** golang, postgres, flutter, nextjs, telematics, obd2, payment-gateway, inventory, clean-arch

---

## 🎯 Vision & Goals

To build a unified platform that serves as the operational backbone for the **Vehicle Rental, Workshop Service, and Spare Parts Shop** businesses. The platform aims to automate Work Orders (WO), manage multi-location inventory, support cashless billing, and provide **real-time asset visibility** through Telematics (GPS/OBD2).

---

## 🛠️ Mandatory Technology Stack

| Component | Technology | Notes |
| :--- | :--- | :--- |
| **Backend** | **Go (Golang)** | RESTful API, Clean Architecture, High Concurrency. |
| **Database** | **PostgreSQL** | Primary storage, ACID Transactions, JSONB. |
| **Frontend Web** | **Next.js** (React) | Full access for managerial/administrative roles. |
| **Web UI/Styling**| **Tailwind CSS** & **Shadcn UI** | Utility-first and consistent components. |
| **Mobile Apps** | **Flutter** | iOS & Android for field operational roles (Mechanics, Drivers, Warehouse Staff). |
| **Mobile State** | **Riverpod** | Simple, type-safe, and robust state management. |

---

## 🔒 Role & Permission Matrix (Critical)

Permissions must be enforced via middleware in the Golang Backend.

| Sector | Critical Role | Mobile Access | Key Permission Focus |
| :--- | :--- | :--- | :--- |
| **Workshop Service** | Junior/Senior Mechanic | Yes | Update Job Sheet, Check/Request Small Warehouse Stock. **Engine Scanning (Mobile).** |
| **Workshop Service** | Service Advisor | Web/Mobile | Create/Close WO, Cost Estimation, Customer Communication. |
| **Spare Parts Shop** | Warehouse Staff | Yes | Record Stock In/Out/Transfers between Warehouses. |
| **Rental Customer** | Driver/Coordinator | Yes | Submit Service Request (PS), **Track Assigned Unit.** |
| **Rental Company** | Area Manager | Web/Mobile | Approve PS Allocation, **Fleet Tracking Dashboard.** |
| **All Sectors** | Accountant | Web | Billing, Payment Reconciliation (Web Access Required). |

---

## 📦 Epic 1: Core Backend & Database Setup (Golang/PostgreSQL)

**Goal:** Set up a secure, stable, and foundational Backend framework.

### Tasks
* [ ] Initialize Golang project structure (Clean Architecture/Hexagonal).
* [ ] Configure PostgreSQL connection, migrations, and *transaction handling*.
* [ ] Implement **JWT Authentication** and **Role/Permission Middleware** in Golang.
* [ ] Implement database schema for **Warehouse Hierarchy** (`warehouses`): Large (Central), Branch, Small (Operational Unit).
* [ ] Create schema and basic CRUD for **Vehicle Assets** (`vehicles`) and **Spare Parts Master** (`items`).

---

## 🚚 Epic 2: Work Order (WO) & Inventory Flow Logic

**Goal:** Implement end-to-end WO flow and stock transfer connecting all sectors.

### Tasks
* [ ] **API: `POST /api/v1/servicerequest`**: Endpoint for Service Request (PS) initiation by Driver/Coordinator.
* [ ] **API: `PUT /api/v1/workorders/{id}/assign`**: Endpoint for WO assignment to an **Operational Unit** (Mechanic) by PIC/SA.
* [ ] **Service Logic (Mechanic):** Implement Golang logic to record spare part usage from the **Small Mechanic Warehouse** (reducing stock).
* [ ] **API: `POST /api/v1/inventory/transfer`**: Endpoint to record stock transfers between Warehouses (e.g., Branch to Small) with `inventory_transactions` logging.
* [ ] **Notification System:** Implement a *push notification placeholder* for new WO assignment notifications to Mechanics.

---

## 💳 Epic 3: Payment Gateway & Invoicing Integration

**Goal:** Enable billing and cashless payments for WO/Rental Contracts.

### Tasks (Backend - Golang)
* [ ] Design and implement **`invoices`** and **`payments`** tables (including status and *payment_gateway_id*).
* [ ] **Payment Gateway API Client:** Create a Golang service (e.g., `PaymentService`) for PG integration (creating transactions, getting payment URLs).
* [ ] **API: `POST /api/v1/invoices/{id}/generate-payment`**: Endpoint called by Accountant to generate a new *payment link*.
* [ ] **API: Webhook Listener:** Create a **Secure Endpoint `POST /api/v1/payments/webhook`** to receive and validate payment status notifications (`paid`, `failed`) from the PG.
* [ ] **Service Logic:** Logic to update the *invoice* status to 'Paid' and record the transaction in the `payments` table upon receiving a valid webhook.

---

## ⚙️ Epic 4: Telematics & Engine Diagnostic Integration

**Goal:** Build a *data ingestion pipeline* and APIs to receive, store, and present data from Telematics devices (GPS/OBD2).

### Tasks (Backend - Golang)
* [ ] Design and implement **`vehicle_telematics`** (real-time GPS/Sensor data) and **`vehicle_dtc_logs`** (OBD2 error codes) tables.
* [ ] **Data Ingestion API:** Create a high-throughput endpoint (e.g., using *websocket* or gRPC) to receive the GPS/Sensor data *stream* from telematics devices.
* [ ] **Service Logic (DTC Alert):** Implement logic to analyze Diagnostic Trouble Codes (DTCs). If a critical code is detected, trigger a notification and/or **Automatic Work Order creation**.
* [ ] **API: `GET /api/v1/vehicles/{id}/realtime-status`**: Endpoint to retrieve the latest location and engine status.

---

## 💻 Epic 5: Frontend Web & Mobile UI/UX

**Goal:** Implement the user interface for all roles and key features.

### Tasks (Frontend Web - Next.js)
* [ ] **Login & Dashboard:** Login page, and Manager dashboard displaying WO metrics and Fleet Utilization.
* [ ] **Tracking Dashboard (Map):** Create a map page (using Google Maps/Leaflet) for Managers/SAs to view **All Fleet** locations and route history.
* [ ] **Vehicle Detail Page:** Add a new tab to display diagnostic data (DTCs, Temp, RPM) received from Epic 4.
* [ ] **Invoice Screen:** Billing page with the *Generate Payment Link* feature and *real-time status updates* for payments.

### Tasks (Mobile App - Flutter/Riverpod)
* [ ] **Initial Setup:** Flutter project setup with Riverpod and *secure storage* for tokens.
* [ ] **Job Sheet Detail Screen (Mechanic):**
    * [ ] Implement **Part Usage Module** (calling stock transfer API).
    * [ ] **Engine Scan (OBD2) Button:** Calls the DTC API to display current error codes.
    * [ ] Implement **Offline Mode Logic** (using Hive/Sqflite) for progress recording.
* [ ] **Tracking Map (Driver/Coordinator):** Map page to view the location of the unit currently being rented/used.