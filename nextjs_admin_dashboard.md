**CONTEXT:**
You are the frontend developer for the TON Web Application, which targets managerial and administrative roles (Manager, Accountant, Admin). Your instructions are based on **PRODUCT_SPEC_TON_FINAL_EN.md**. The technology stack is **Next.js**, **Tailwind CSS**, and **Shadcn UI**.

**PROJECT STATUS OVERVIEW:**
- Overall Completion: ~52%
- Backend (Go/PostgreSQL): 85% complete with solid architecture
- Frontend (Next.js): 70% complete with authentication working
- Critical Gap: API endpoints missing despite database being ready
- Timeline: MVP achievable in 3-4 weeks by completing missing APIs

**TECHNICAL STRENGTHS:**
- Clean Architecture: Proper separation (/internal/domain/, /service/, /repository/, /handler/)
- Comprehensive Database: Well-designed schemas with PostgreSQL + GORM
- Security: JWT + RBAC with 6 user roles implemented
- Authentication: Recently fixed SSR issues, login flow working perfectly

**CRITICAL API GAPS TO ADDRESS:**
- Many database schemas ready but API handlers missing
- Service layer implementations incomplete
- Real-time features not implemented (telematics, notifications)
- Payment gateway integration pending

**TASK 1: Project Setup & Layout**
1.  Initialize a Next.js project with Tailwind CSS and Shadcn UI configured.
2.  Create a basic **Main Layout Component** that includes a responsive sidebar navigation. The navigation links should dynamically adapt based on the user's role (e.g., Accountant sees 'Invoicing' but not 'Vehicle Tracking').

**TASK 2: Tracking Dashboard (Manager/SA Role)**
1.  Create a new page component at `/dashboard/tracking` accessible to the Manager Area role.
2.  The page must include a placeholder for a **Map Component** (e.g., placeholder div with instructions for Leaflet/Google Maps JS integration).
3.  Implement a simple list component next to the map placeholder that calls the placeholder API `GET /api/v1/vehicles/fleet-status` to display the `plate_number` and `realtime_status`.

**TASK 3: Invoicing and Payment UI (Accountant Role - EPIC 3)**
1.  Create the **Invoice Detail Screen** at `/invoices/[id]` accessible to the Accountant role.
2.  The screen must display mock invoice details and include two crucial buttons using Shadcn UI components:
    * **"Generate Payment Link"**: Calls the placeholder API `POST /api/v1/invoices/{id}/generate-payment`.
    * **"Check Status"**: Displays the current payment status (e.g., Pending, Paid) received from the API.

**IMPLEMENTATION PRIORITIES (Based on Project Status):**

**Priority 1: Core API Integration (Week 1)**
- Focus on integrating with existing backend APIs
- Complete missing service layer implementations
- Test authentication flow across all 6 user roles

**Priority 2: Real-time Features (Week 2)**
- Implement telematics data display components
- Add notification system UI components
- Create vehicle diagnostic data visualization

**Priority 3: Frontend Completion (Week 3)**
- Complete all specified components below
- Add comprehensive error handling and loading states
- Implement responsive design for mobile/tablet

**Priority 4: Payment Integration (Week 4)**
- Integrate payment gateway APIs once backend is ready
- Complete invoice management workflows
- Add payment status tracking UI

**OUTPUT REQUIREMENT:**
Provide the following Next.js/React components and structure:
* `components/Layout.tsx` (With dynamic sidebar logic placeholder).
* `app/dashboard/tracking/page.tsx` (Tracking Dashboard component).
* `app/invoices/[id]/page.tsx` (Invoice Detail Screen component).

**DEVELOPMENT NOTES:**
- Backend authentication is working - integrate with existing JWT system
- Database is properly designed with all required tables
- Focus on API integration rather than data structure concerns
- Implement proper error handling for missing/developing endpoints
- Use Shadcn UI components consistently for professional look