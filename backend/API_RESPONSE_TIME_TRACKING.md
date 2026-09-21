# 📊 API Response-Time Tracking — Complete Reference

> **भाषा / Language:** Hinglish (Hindi + English)  
> **Generated:** 2026-09-21  
> **Backend:** Express + TypeScript + Mongoose

---

## 🔥 Kya Add Kiya Gaya? (What was added?)

| File | Kaam (Purpose) |
|------|---------------|
| `middleware/responseTime.ts` | Har request ka time measure karta hai aur console + DB mein save karta hai |
| `modules/api-metrics/apiMetric.model.ts` | MongoDB collection jahan metrics store hoti hain (30-din TTL ke saath) |
| `modules/api-metrics/apiMetric.service.ts` | MongoDB aggregation pipeline — group by route, avg/min/max/p95 |
| `modules/api-metrics/apiMetric.controller.ts` | HTTP controller — query params parse karke response deta hai |
| `modules/api-metrics/apiMetric.routes.ts` | Route definition, admin-only protected |
| `app.ts` *(modified)* | `responseTimeLogger` register kiya (before routes), `/api/v1/metrics` mount kiya |

---

## ⚙️ Architecture Flow

```
Incoming HTTP Request
        |
        v
  morgan("dev")          (existing)
        |
        v
  responseTimeLogger     <-- NEW (line ~119 in app.ts)
  . startTime = process.hrtime.bigint()
  . Attaches res.on('finish') listener
        |
        v
  webhookRoutes / express.json / cookieParser
        |
        v
  requestLogger (existing, authenticated only)
        |
        v
  [Auth Routes, API Routes, etc.]
        |
        v
Response sent -> res.on('finish') fires
        |
        |---> Console: [API] GET /api/v1/results/export/:id -> 200 (184ms)
        |
        +---> ApiMetric.create({ method, route, statusCode, durationMs, userId })
              (fire-and-forget, never blocks response)
```

---

## 📁 File Details

### 1. `middleware/responseTime.ts`

```typescript
// Har request pe:
// 1. process.hrtime.bigint() se nanosecond-accurate start time record karo
// 2. res.on('finish') pe durationMs calculate karo
// 3. Console log: [API] METHOD /route -> STATUS (Xms)
// 4. ApiMetric.create() -- fire-and-forget DB insert
```

**Console Output Example:**
```
[API] POST /api/v1/auth/login -> 200 (43ms)
[API] GET /api/v1/results/export/:id -> 200 (1842ms)
[API] GET /api/v1/exams -> 401 (3ms)
[API] DELETE /api/v1/users/:id -> 403 (6ms)
```

**Path Normalization (MongoDB ObjectId replace):**
```
/api/v1/results/export/64f2a1b3c4d5e6f7a8b9c0d1  ->  /api/v1/results/export/:id
/api/v1/candidates/64abc123def456789012abcd       ->  /api/v1/candidates/:id
```

---

### 2. `modules/api-metrics/apiMetric.model.ts`

**MongoDB Schema:**

| Field | Type | Notes |
|-------|------|-------|
| `method` | String | GET, POST, PUT, PATCH, DELETE |
| `route` | String | Normalized path (`:id` replaced) |
| `statusCode` | Number | HTTP status code |
| `durationMs` | Number | Response time in milliseconds |
| `userId` | ObjectId or null | Set if authenticated, null otherwise |
| `createdAt` | Date | Auto-set to `Date.now()` |

**Indexes:**
- `{ createdAt: 1 }` — TTL index, **expire after 30 days** (2,592,000 seconds)
- `{ createdAt: -1, method: 1, route: 1 }` — Compound index for fast aggregation queries

---

### 3. `modules/api-metrics/apiMetric.service.ts`

MongoDB Aggregation Pipeline steps:

```
$match -> $group -> $addFields (sort durations) -> $addFields (p95Index) -> $addFields (p95Value) -> $project -> $sort -> $limit
```

**p95 Calculation (MongoDB 7 ke bina bhi kaam karega):**
```
p95Index = floor(0.95 * totalCount)
p95DurationMs = sortedDurations[p95Index]
```

---

## 📡 Reporting Endpoint

```
GET /api/v1/metrics/response-times
```

**Auth:** `MASTER_ADMIN` ya `COMPANY_ADMIN` role required  
**Method:** GET  
**Protected:** YES (authenticate + authorize middleware)

### Query Parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `from` | ISO 8601 date | Last 24 hours | Start of time range |
| `to` | ISO 8601 date | Now | End of time range |
| `limit` | Integer (1-500) | 20 | Max number of route groups to return |

### Example Request:

```http
GET /api/v1/metrics/response-times?from=2026-09-20T00:00:00Z&to=2026-09-21T00:00:00Z&limit=50
Authorization: Bearer <admin_jwt_token>
```

### Example Response:

```json
{
  "success": true,
  "meta": {
    "from": "2026-09-20T00:00:00.000Z",
    "to": "2026-09-21T00:00:00.000Z",
    "limit": 50,
    "count": 23
  },
  "data": [
    {
      "method": "POST",
      "route": "/api/v1/results/generate",
      "count": 12,
      "avgDurationMs": 3842.5,
      "minDurationMs": 2100,
      "maxDurationMs": 6200,
      "p95DurationMs": 5800,
      "errorCount": 1
    },
    {
      "method": "GET",
      "route": "/api/v1/results/export/:id",
      "count": 45,
      "avgDurationMs": 1284.3,
      "minDurationMs": 800,
      "maxDurationMs": 4100,
      "p95DurationMs": 3200,
      "errorCount": 0
    },
    {
      "method": "GET",
      "route": "/api/v1/candidates",
      "count": 230,
      "avgDurationMs": 187.2,
      "minDurationMs": 45,
      "maxDurationMs": 620,
      "p95DurationMs": 410,
      "errorCount": 3
    }
  ]
}
```

**Data Fields Explained (Matlab kya hai):**

| Field | Matlab (Meaning) |
|-------|-----------------|
| `method` | HTTP method (GET/POST/...) |
| `route` | Normalized endpoint path |
| `count` | Is time range mein kitni baar hit hua |
| `avgDurationMs` | Average response time (ms) |
| `minDurationMs` | Sabse tez response (ms) |
| `maxDurationMs` | Sabse slow response (ms) |
| `p95DurationMs` | 95% requests is time ke andar complete hue |
| `errorCount` | 4xx/5xx errors ki count |

---

## 🗂️ Saari API Routes — Response Time Tracking Table

> `responseTimeLogger` middleware **sabhi** routes ke pehle register hai, isliye har route ka time capture hoga.

| Route Prefix | Module | Auth Required |
|-------------|--------|:---:|
| `/api/v1/auth` | Authentication | No |
| `/api/v1/webhooks` | Webhooks | No |
| `/api/v1/companies` | Companies | Yes |
| `/api/v1/employees` | Employees | Yes |
| `/api/v1/roles` | Roles | Yes |
| `/api/v1/permissions` | Permissions | Yes |
| `/api/v1/users` | Users | Yes |
| `/api/v1/centers` | Centers | Yes |
| `/api/v1/rooms` | Rooms | Yes |
| `/api/v1/seats` | Seats | Yes |
| `/api/v1/candidates` | Candidates | Yes |
| `/api/v1/import-candidate` | Import Candidates | Yes |
| `/api/v1/subjects` | Subjects | Yes |
| `/api/v1/chapters` | Chapters | Yes |
| `/api/v1/topics` | Topics | Yes |
| `/api/v1/questions` | Question Bank | Yes |
| `/api/v1/question-approval` | Question Approval | Yes |
| `/api/v1/papers` | Papers | Yes |
| `/api/v1/paper-questions` | Paper Questions | Yes |
| `/api/v1/paper-approval` | Paper Approval | Yes |
| `/api/v1/exams` | Exams | Yes |
| `/api/v1/staff-assignments` | Staff Assignments | Yes |
| `/api/v1/exam-approval` | Exam Approval | Yes |
| `/api/v1/result-approval` | Result Approval | Yes |
| `/api/v1/exam-shifts` | Exam Shifts | Yes |
| `/api/v1/shifts` | Shifts | Yes |
| `/api/v1/exam-centers` | Exam Centers | Yes |
| `/api/v1/exam-rooms` | Exam Rooms | Yes |
| `/api/v1/seat-allocations` | Seat Allocations | Yes |
| `/api/v1/candidate-exam` | Candidate Exam | Yes |
| `/api/v1/admit-cards` | Admit Cards | Yes |
| `/api/v1/attendance` | Attendance | Yes |
| `/api/v1/entry-checker` | Entry Checker | Yes |
| `/api/v1/face-verification` | Face Verification | Yes |
| `/api/v1/exam-submissions` | Exam Submissions | Yes |
| `/api/v1/candidate-answers` | Candidate Answers | Yes |
| `/api/v1/live-monitoring` | Live Monitoring | Yes |
| `/api/v1/activity-logs` | Activity Logs | Yes |
| `/api/v1/analytics` | Analytics | Yes |
| `/api/v1/audit-logs` | Audit Logs | Yes |
| `/api/v1/biometric-verification` | Biometric Verification | Yes |
| `/api/v1/certificates` | Certificates | Yes |
| `/api/v1/dashboard` | Dashboard | Yes |
| `/api/v1/email` | Email | Yes |
| `/api/v1/files` | File Storage | Yes |
| `/api/v1/health` | Health Check | No |
| `/api/v1/import-export` | Import / Export | Yes |
| `/api/v1/notifications` | Notifications | Yes |
| `/api/v1/pdf` | PDF | Yes |
| `/api/v1/push-notifications` | Push Notifications | Yes |
| `/api/v1/qr` | QR Codes | Yes |
| `/api/v1/question-history` | Question History | Yes |
| `/api/v1/queue` | Queue | Yes |
| `/api/v1/reports` | Reports | Yes |
| `/api/v1/results` | Results | Yes |
| `/api/v1/scheduler` | Scheduler | Yes |
| `/api/v1/search` | Search | Yes |
| `/api/v1/sms` | SMS | Yes |
| `/api/v1/system-settings` | System Settings | Yes |
| `/api/v1/websocket` | WebSocket | Yes |
| `/api/v1/geo-monitoring` | Geo Monitoring | Yes |
| `/api/v1/trust-scores` | Trust Scores | Yes |
| `/api/v1/payments` | Payments | Yes |
| `/api/v1/plans` | Plans | Yes |
| `/api/v1/subscriptions` | Subscriptions | Yes |
| `/api/v1/security` | Security | Yes |
| `/api/v1/support-tickets` | Support Tickets | Yes |
| `/api/v1/onboarding` | Onboarding | Yes |
| `/api/v1/invoices` | Invoices | Yes |
| `/api/v1/sidebar` | Sidebar | Yes |
| `/api/v1/system` | Organization Seeder | Yes |
| `/api/v1/rbac-validator` | RBAC Validator | Yes |
| `/api/v1/assignments` | Staff Assignments | Yes |
| `/api/v1/center-system-network` | Center Network | Yes |
| `/api/v1/center-assign-exam-staff` | Center Staff | Yes |
| `/api/v1/center-assign-candidate-attendance` | Candidate Attendance | Yes |
| `/api/v1/center-payments` | Center Payments | Yes |
| `/api/v1/import-center-assign-exam` | Import Center Exam | Yes |
| **`/api/v1/metrics`** | **API Metrics (NEW)** | **Yes (Admin only)** |
| `/debug-cands` | Debug (temporary) | No |
| `/` | Root Health Check | No |
| `/health` | Health | No |

---

## ⚡ Performance Notes

- **responseTimeLogger** sirf ek `res.on('finish')` listener attach karta hai — zero overhead request ke doran
- **DB insert** fire-and-forget hai — response kabhi block nahi hoga
- **TTL index** ensure karta hai collection 30 din baad automatically clean ho jaaye
- **p95 aggregation** pure MongoDB pipeline mein hai — application level pe koi processing nahi

---

## 🔧 Existing Code Mein Changes

| File | Change |
|------|--------|
| `middleware/requestLogger.ts` | **Kuch nahi badla** — untouched |
| `morgan` setup | **Kuch nahi badla** — untouched |
| Any business logic files | **Kuch nahi badla** — purely additive |

Sirf `app.ts` mein **2 imports** aur **2 `app.use()` calls** add kiye gaye.

---

## 🚀 Quick Test Commands

```bash
# Test karo ki middleware kaam kar raha hai
curl http://localhost:5000/api/v1/health

# Console mein ye dikna chahiye:
# [API] GET /api/v1/health -> 200 (Xms)

# Admin token ke saath metrics dekho
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:5000/api/v1/metrics/response-times?limit=10"

# Last 7 din ka data
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:5000/api/v1/metrics/response-times?from=2026-09-14T00:00:00Z&limit=20"
```
