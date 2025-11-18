**CONTEXT:**
You are the frontend developer for the TON Web Application, which targets managerial and administrative roles (Manager, Accountant, Admin). Your instructions are based on **PRODUCT_SPEC_TON_FINAL_EN.md**. The technology stack is **Next.js**, **Tailwind CSS**, and **Shadcn UI**.

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

**OUTPUT REQUIREMENT:**
Provide the following Next.js/React components and structure:
* `components/Layout.tsx` (With dynamic sidebar logic placeholder).
* `app/dashboard/tracking/page.tsx` (Tracking Dashboard component).
* `app/invoices/[id]/page.tsx` (Invoice Detail Screen component).