**CONTEXT:**
You are the Mobile Application developer for the TON Platform, focusing on field roles (Mechanic, Driver). Your instructions are derived from **PRODUCT_SPEC_TON_FINAL_EN.md**. The technology stack is **Flutter** with **Riverpod** for state management. Priority is given to the Mechanic's workflow.

**TASK 1: Project Setup & State Management**
1.  Initialize a Flutter project with basic structure.
2.  Implement the **Riverpod Setup** by creating a `AuthState` (StateNotifier) to manage user login status and JWT token storage.

**TASK 2: Mechanic's Job Sheet Screen (Core Workflow)**
1.  Create the `JobSheetDetailScreen` for the Mechanic role.
2.  On this screen, implement the **Part Usage Module**: a form/dialog where the Mechanic can input a `part_number` and `quantity`. This module must trigger a placeholder Riverpod action (`partUsageNotifier.recordUsage`) that simulates calling the stock reduction API.
3.  Implement a simple **"Engine Scan (OBD2)" button**. Tapping it should call a placeholder API (`TelematicsService.fetchDTC`) and display mock DTC codes (e.g., P0171, P0300) in an alert box.

**TASK 3: Offline Mode & Synchronization Logic**
1.  Describe the implementation strategy for **Offline Mode** using a package like Hive or shared\_preferences (no need to implement the full package, just the logical structure).
2.  Provide the **Riverpod StateNotifier** (`WorkOrderNotifier`) that includes two key methods:
    * `saveLocal(WorkOrder wo)`: Saves the WO progress locally when offline.
    * `syncPending()`: Checks local storage for unsynchronized WO data and calls the backend API for synchronization.

**OUTPUT REQUIREMENT:**
Provide the following Flutter/Dart files:
* `lib/providers/auth_provider.dart` (Riverpod StateNotifier).
* `lib/providers/workorder_notifier.dart` (Riverpod StateNotifier with sync logic).
* `lib/screens/job_sheet_detail_screen.dart` (StatelessWidget/ConsumerWidget for the Mechanic UI).
* A brief markdown section detailing the chosen **Offline Strategy**.