# Exam SaaS Backend API Workflows

This document outlines the **End-to-End Logical Workflows** for the Exam SaaS Platform. Instead of a flat list of 64 modules, this guide shows frontend developers **which APIs to call, and in what order**, to achieve full system functionality.

All API endpoints are relative to `{{BASE_URL}}/api/v1`.

---

## 1. System & Onboarding Flow
**Goal:** Authenticate the Master Admin, set up global plans, register a new company, and process the initial payment/subscription.

| Step | Action | Method | Endpoint |
| :--- | :--- | :--- | :--- |
| **1.1** | **Master Admin Login** | `POST` | `/auth/login` |
| **1.2** | **Get My Profile** | `GET` | `/auth/profile` |
| **1.3** | **View Master Dashboard** | `GET` | `/dashboard/overview` |
| **1.4** | **List Subscription Plans** | `GET` | `/plans` |
| **1.5** | **Register a Company** | `POST` | `/companies` |
| **1.6** | **Create Razorpay Order** | `POST` | `/payments/create-order` |
| **1.7** | **Verify Payment (Webhook/Sync)**| `POST` | `/companies/{id}/verify-payment` |
| **1.8** | **Approve Company** | `POST` | `/companies/{id}/approve` |

> [!TIP]
> Once a company is approved and payment is verified, the Company Admin will receive credentials via Email (`/email` module) to log into the system.

---

## 2. Organization Setup Flow
**Goal:** The Company Admin logs in and sets up their organization structure (Branches, Centers, Roles, and Staff).

| Step | Action | Method | Endpoint |
| :--- | :--- | :--- | :--- |
| **2.1** | **Company Admin Login** | `POST` | `/auth/login` |
| **2.2** | **Create Branches** | `POST` | `/branches` |
| **2.3** | **Create Exam Centers** | `POST` | `/centers` |
| **2.4** | **Manage Roles** | `GET` | `/roles` |
| **2.5** | **Assign Permissions to Roles** | `POST` | `/role-permissions` |
| **2.6** | **Create Staff / Employees** | `POST` | `/employees` |
| **2.7** | **Assign Employees to Centers** | `PATCH` | `/employees/{id}/assign-center` |

---

## 3. Content Creation Flow
**Goal:** The Academic team (Paper Setters/Reviewers) logs in to build the syllabus, question banks, and final exam papers.

| Step | Action | Method | Endpoint |
| :--- | :--- | :--- | :--- |
| **3.1** | **Create Subjects** | `POST` | `/subjects` |
| **3.2** | **Create Chapters & Topics** | `POST` | `/chapters` (and `/topics`) |
| **3.3** | **Upload/Create Questions** | `POST` | `/questions` |
| **3.4** | **Approve Questions** | `POST` | `/question-approval/{id}/approve` |
| **3.5** | **Create Exam Paper** | `POST` | `/papers` |
| **3.6** | **Map Questions to Paper** | `POST` | `/paper-questions/map` |
| **3.7** | **Approve Final Paper** | `POST` | `/paper-approval/{id}/approve` |

> [!WARNING]
> Questions and Papers **cannot** be used in a live exam until they pass the Approval Modules (`/question-approval` and `/paper-approval`).

---

## 4. Exam Scheduling & Logistics Flow
**Goal:** The Exam Manager schedules the exam, assigns centers, sets up shifts, allocates rooms/seats, and registers candidates.

| Step | Action | Method | Endpoint |
| :--- | :--- | :--- | :--- |
| **4.1** | **Create New Exam** | `POST` | `/exams` |
| **4.2** | **Create Exam Shifts** | `POST` | `/exam-shifts` |
| **4.3** | **Map Centers to Exam** | `POST` | `/exam-centers` |
| **4.4** | **Create/Assign Rooms** | `POST` | `/exam-rooms` |
| **4.5** | **Register Candidates** | `POST` | `/candidates` (or `/import-export/import`) |
| **4.6** | **Map Candidates to Exam** | `POST` | `/candidate-exam/assign` |
| **4.7** | **Auto Seat Allocation** | `POST` | `/seat-allocations/auto` |
| **4.8** | **Generate Admit Cards** | `POST` | `/admit-cards/generate` |
| **4.9** | **Approve Exam for Go-Live** | `POST` | `/exam-approval/{id}/approve` |

---

## 5. Candidate Execution Flow (Exam Day)
**Goal:** The candidate logs into the portal on exam day, gets verified via face/biometric, takes the test, and submits.

| Step | Action | Method | Endpoint |
| :--- | :--- | :--- | :--- |
| **5.1** | **Candidate Login** | `POST` | `/auth/login` |
| **5.2** | **Verify Identity (Biometric/Face)**| `POST` | `/face-verification/verify` |
| **5.3** | **Mark Attendance** | `POST` | `/attendance/mark` |
| **5.4** | **Fetch Live Exam Paper** | `GET` | `/candidate-exam/start` |
| **5.5** | **Save Answers (Auto-Save)** | `POST` | `/candidate-answers/save` |
| **5.6** | **Live Monitoring / WebSockets** | `WS` | `/websocket` (and `/live-monitoring`) |
| **5.7** | **Submit Final Exam** | `POST` | `/exam-submissions/submit` |

> [!IMPORTANT]
> Step 5.5 (`/candidate-answers/save`) should be called periodically (e.g., every 1-2 minutes or on every question change) to prevent data loss in case of a crash. 

---

## 6. Results & Post-Exam Flow
**Goal:** Calculate results, generate analytics, approve the final results, and distribute certificates/merit lists.

| Step | Action | Method | Endpoint |
| :--- | :--- | :--- | :--- |
| **6.1** | **Trigger Result Calculation** | `POST` | `/results/calculate` |
| **6.2** | **Review Results (Observer)** | `GET` | `/results/{examId}` |
| **6.3** | **Approve Final Results** | `POST` | `/result-approval/{id}/approve` |
| **6.4** | **Generate Merit List** | `POST` | `/merit-lists/generate` |
| **6.5** | **Generate Certificates** | `POST` | `/certificates/generate` |
| **6.6** | **Send Notifications (SMS/Email)** | `POST` | `/notifications/send-results` |
| **6.7** | **Generate Advanced Reports** | `GET` | `/reports/exam-analytics` |

---

## Utility Modules Reference
These modules are used passively or asynchronously throughout the workflows:
- `/system-settings`: Fetch global configurations (e.g. GST rates, timezone).
- `/health`: API to check if backend services (Mongo, Redis) are up.
- `/queue` & `/scheduler`: Background processing (e.g. bulk emails, report generation).
- `/audit-logs` & `/activity-logs`: For tracking system actions by admins.
- `/files` & `/pdf`: Handling image uploads (profiles/questions) and downloading PDFs (reports/invoices).
