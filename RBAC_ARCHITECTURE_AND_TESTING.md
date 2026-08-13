# Enterprise RBAC Architecture & E2E Validation Manual

This technical manual documents the multi-tier Role-Based Access Control (RBAC) architecture, automated validation engine, security middleware pipelines, and diagnostic checklists implemented across the SaaS Exam platform.

---

## 1. RBAC Architecture Summary

The security framework enforces strict **multi-tenant data isolation** and hierarchical access governance across 28 operational modules. The architecture evaluates permissions through a deterministic priority hierarchy:

```
[Master Admin / System Override]
       ↓
[Company Tenant & Active Subscription Status]
       ↓
[Plan Feature Gating & Usage Limits (Starter / Pro / Enterprise)]
       ↓
[Assigned Operational Role & Hierarchy Tier]
       ↓
[RolePermission Matrix mappings]
       ↓
[UserPermission Granular Overrides (Grant / Deny / Expiration)]
       ↓
[Real-time Memory Cache (permissionCache & navigationCache)]
       ↓
[API & Frontend Execution (Routes, APIs, Sidebar, Buttons, Widgets)]
```

### Key Highlights:
- **Zero Hardcoded Permissions:** All roles, menu hierarchies, route access rules, and button visibility depend on database-driven permission keys (`<module>.<action>`) and real-time JWT context.
- **Immediate Real-Time Revocation:** Changes to subscription tiers, company status, role assignments, or user overrides instantly invalidate targeted in-memory caches, reflecting UI changes within milliseconds without waiting for token expiration.

---

## 2. Complete Execution Flows

### 2.1 Permission & Override Flow
1. User presents JWT containing user identity and tenant affiliation (`companyId`).
2. Engine checks if user is `MASTER_ADMIN` (universal wildcard `*`).
3. If not, engine retrieves cached permissions from fast in-memory `PermissionCache`.
4. Upon cache miss, engine resolves base operational role from Mongoose (`Role` + `RolePermission` collection).
5. Engine overlays active `UserPermission` records:
   - **Explicit Allow (`allowed: true`):** Appends key to granted permission set.
   - **Explicit Deny (`allowed: false`):** Strip key and revoke universal wildcards for that specific user.
   - **Expiration Verification:** Automatically ignores expired temporary overrides based on `effectiveUntil` / `expiresAt` timestamps.

### 2.2 Middleware & Authorization Pipeline
Every API request traversing the backend passes through sequential middleware gates:
1. `authenticate`: Cryptographically verifies JWT signature and extracts actor state.
2. `companyStatus`: Verifies that the tenant organization is `ACTIVE` and not suspended or deleted.
3. `requireSubscription`: Confirms subscription billing period is active (`endDate >= now`).
4. `authorize` / `authorizeMinHierarchyLevel`: Verifies operational role code and administrative hierarchy tiers (Tier 0 to Tier 100).
5. `requirePermission` / `requireAnyPermission`: Checks exact verb keys (`exams.create`) or module wildcard rules (`exams.*`).
6. `requireFeature`: Validates that the active subscription tier (`STARTER` / `PROFESSIONAL` / `ENTERPRISE`) includes the specific feature flag (e.g., AI proctoring, white-label branding).
7. `checkUsageLimit`: Evaluates numerical maximums before resource creation (e.g., maximum branches, centers, employees, candidates).

*Security Audit Loop:* Whenever any guard denies access, an asynchronous high-severity security event (`AuditAction.REJECT`) is logged to MongoDB with IP, user-agent, and failure context.

### 2.3 Dynamic Sidebar & UI Gating Flow
1. React layout invokes `getUserNavigation(user, query)`.
2. Service evaluates user role against company subscription tier and feature flags.
3. Menu items requiring unsupported features (e.g., Geo-Monitoring on Starter tier) are automatically purged from the tree.
4. Operational badges (Pending Approvals, Active Exams, Support Tickets, Notifications) are computed via real-time MongoDB document counting.
5. In the frontend React UI, `usePermission()` hooks and `<PermissionGuard>` components automatically hide action buttons (Create, Delete, Publish, Approve, Export) when permissions or subscription capabilities are missing.

---

## 3. Supported System Roles & Action Capabilities

### Mandatory System Roles (18 Tiers):
1. **Master Admin (`MASTER_ADMIN`):** Tier 0 universal governance.
2. **Company Admin (`COMPANY_ADMIN`):** Full tenant administration across all company modules.
3. **Admin (`ADMIN`):** General administrative operator.
4. **Branch Manager (`BRANCH_MANAGER`):** Regional operations, branches, and candidate management.
5. **Center Manager (`CENTER_MANAGER`):** Venue amenities, testing room verification, and check-ins.
6. **Exam Manager (`EXAM_MANAGER`):** Shift scheduling and test execution supervision.
7. **Paper Setter (`PAPER_SETTER`):** Test paper design and scoring rule configuration.
8. **Question Setter (`QUESTION_SETTER`):** Item authoring in the unified question bank.
9. **Biometric Verifier (`BIOMETRIC_VERIFIER`):** Facial and fingerprint matching at exam venues.
10. **Entry Checker (`ENTRY_CHECKER`):** Admit card gate verification and shift attendance check-in.
11. **Observer (`OBSERVER`):** Compliance oversight and procedure inspection.
12. **Government Authority (`GOVT_AUTHORITY`):** Official regulatory audit inspection access.
13. **Technical Manager (`TECHNICAL_MANAGER`):** System health, video monitoring storage, and API key management.
14. **Invigilator (`INVIGILATOR`):** Live classroom supervision and room attendance marking.
15. **AI Proctor (`AI_PROCTOR`):** Automated suspicious video anomaly inspection.
16. **Command Center (`COMMAND_CENTER`):** Live surveillance across streaming video and GPS maps.
17. **Candidate (`CANDIDATE`):** Examinee account access to attempt exams and download scorecards.
18. **Custom Roles (`CUSTOM_ROLES`):** Tenant-created flexible roles matching custom business workflows.

### Verified Permission Actions:
- `Create`, `Read`, `Update`, `Delete`, `Approve`, `Reject`, `Export`, `Import`, `Publish`, `Assign`, `Download`, `Upload`, `Print`, `Share`, `Deactivate`.

---

## 4. Testing Checklist & Automated Diagnostic Engine

An automated diagnostic test suite is integrated into the application via the `rbacValidator.service.ts` engine and accessible via API:
- `POST /api/v1/rbac-validator/run`
- `GET /api/v1/rbac-validator/report`

### Verification Checklist:
- [x] **Role Existence:** Verifies all 18 standard role schemas exist in database catalogs.
- [x] **Verb Coverage:** Confirms all 15 core actions map cleanly to wildcard permission rules.
- [x] **Subscription Tier Enforcement:** Validates proper rejection of gated operations across Starter, Professional, and Enterprise tiers.
- [x] **User Override Evaluation:** Confirms explicit user grants override default role rules, and expired overrides are properly ignored.
- [x] **Multi-Tenant Boundaries:** Ensures strict query isolation (`companyId`) preventing cross-tenant resource leakage.
- [x] **Audit Denial Logging:** Verifies that denied requests produce immutable security audit trails in Mongoose.
- [x] **Sub-Millisecond Telemetry:** Measures memory cache hits (< 1ms) vs. MongoDB database fallback resolution (< 15ms).

---

## 5. Known Limitations

1. **In-Memory Cache Scaling:** The current `PermissionCache` and `navigationCache` rely on local Node.js Map structures with TTLs. In multi-instance clustering or Kubernetes pods, targeted cache invalidation occurs locally per instance.
2. **WebSocket Real-Time Logout:** Currently, real-time UI synchronization relies on API cache invalidation; open browser sessions refresh their UI upon next API fetch or page route transition rather than receiving proactive WebSocket forced-logout triggers.

---

## 6. Future Extension Points

1. **Redis Distributed Caching:** Replace in-memory `PermissionCache` with Redis Pub/Sub channels to broadcast instantaneous invalidations across globally distributed microservice replicas.
2. **Attribute-Based Access Control (ABAC):** Extend the permission evaluation engine to support context-sensitive ABAC policies (e.g., restricting exam manager actions strictly to designated geographical IP CIDR blocks or normal office working hours).
3. **Proactive WebSocket Revocation:** Integrate with the WebSocket notifications engine to push immediate state refresh events directly to React clients when an admin revokes permissions mid-session.
