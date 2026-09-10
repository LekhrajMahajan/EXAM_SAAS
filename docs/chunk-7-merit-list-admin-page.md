# CHUNK 7 of 8 — Build Admin Merit List Page (Frontend)

> Give this file to Antigravity alone, after Chunk 6 is done and verified. Do not attach other chunks.

## Goal
The `frontend/src/features/merit/` folder currently contains only empty 1-line stub files. This chunk builds the actual admin-facing Merit List page: a filterable, sortable table showing every candidate's rank, using backend endpoints that **already exist and work** (`meritList.controller.ts` — `getExamMeritList`, `statistics`, `publish`, `lock`, `unlock`, `archive`).

## Files to Touch
- `frontend/src/features/merit/api/index.ts`
- `frontend/src/features/merit/types/index.ts`
- **New file:** `frontend/src/features/merit/pages/MeritListPage.tsx`
- `frontend/src/features/merit/pages/index.ts`
- Router config file (same one touched in Chunk 6) — add a route for this new page

## Reference Components to Reuse (do not rebuild these patterns from scratch)
- `frontend/src/features/company/result/components/StatisticsGrid.tsx` — reuse this exact component/pattern for the summary cards at the top (Total / Generated / Published), backed by the already-working `GET /merit-list/statistics?examId=...` endpoint.
- `frontend/src/shared/components/datatable/` — use the existing shared data table component(s) found here for the main list, following whatever pattern is already used in `ResultListPage.tsx` or `ResultTable.tsx` in `frontend/src/features/company/result/`.
- `frontend/src/features/exam-manager/api/exam.api.ts` — reuse `examApi.getAll()` for the exam filter dropdown, same as done in `GenerateResultsPage.tsx`.

## Changes

### 1. `frontend/src/features/merit/types/index.ts`
Define the TypeScript type matching the backend `IMeritList` shape (see `backend/src/modules/merit-list/meritList.types.ts` for the exact fields — mirror `meritNumber`, `rank`, `overallRank`, `marksObtained`, `percentage`, `correctAnswers`, `wrongAnswers`, `negativeMarks`, `category`, `gender`, `meritStatus`, plus populate references for `candidateId` (expect it populated with at least `name`, `applicationNumber`/`rollNumber`, `photo` — check `backend/src/modules/candidate/candidate.model.ts` for the exact field names used there and match them) and `examId` (expect `examTitle`).

### 2. `frontend/src/features/merit/api/index.ts`
Add API functions wrapping the existing backend endpoints (do not invent new ones — all of these already exist in `meritList.routes.ts`):
```ts
export const meritApi = {
  getByExam: (examId: string) => apiClient.get(`/merit-list/exam/${examId}`),
  getStatistics: (examId?: string) => apiClient.get('/merit-list/statistics', { params: { examId } }),
  publish: (meritId: string) => apiClient.post(`/merit-list/${meritId}/publish`),
  unpublish: (meritId: string) => apiClient.post(`/merit-list/${meritId}/unpublish`),
  lock: (meritId: string) => apiClient.post(`/merit-list/${meritId}/lock`),
  unlock: (meritId: string) => apiClient.post(`/merit-list/${meritId}/unlock`),
  archive: (meritId: string) => apiClient.post(`/merit-list/${meritId}/archive`),
  regenerate: (examId: string) => apiClient.post('/merit-list/regenerate', { examId }),
};
```
Check the exact route paths/prefixes already registered in `meritList.routes.ts` and match them exactly — do not guess at paths, read the actual file first.

### 3. New file: `MeritListPage.tsx`
Layout (top to bottom):
- `PageHeader` with title "Merit List" (same component used in `GenerateResultsPage.tsx`)
- Filter bar (a `Card` or plain flex row): Exam dropdown (required, populate via `examApi.getAll()`), Category dropdown (`All`, `General`, `OBC`, `SC`, `ST`, `EWS`, `PwD`), Merit Status dropdown (`All`, `Draft`, `Generated`, `Published`, `Locked`)
- Summary cards row (reusing `StatisticsGrid.tsx` pattern) fed by `meritApi.getStatistics(selectedExamId)`
- Data table with columns, in this order: **Rank | Photo (small circular thumbnail) | Candidate Name | Application No. | Category | Marks Obtained | Percentage | Status badge (Qualified green / Not Qualified red, derived from percentage vs the exam's cutoff — if not directly available on the merit record, treat any record with `meritStatus` present as qualified for now and leave a `// TODO: wire actual qualify/fail flag once available on MeritList` comment) | Actions**
- Row actions: a "View" button linking to `/company/merit/:meritId` (the detail page — do not build this yet, this route will be built in Chunk 8, it's fine if it 404s for now)
- Toolbar buttons (top right, only enabled when an exam is selected): **Publish All** (loop `meritApi.publish` over all currently-`Generated` records shown), **Regenerate** (`meritApi.regenerate(examId)`)
- Client-side filtering by Category and Merit Status dropdowns (filter the already-fetched array — no need for new backend query params in this chunk).

### 4. `frontend/src/features/merit/pages/index.ts`
Export `MeritListPage` from this barrel file (currently empty stub).

### 5. Route registration
In the same router config file touched in Chunk 6, register `MeritListPage` at `/company/merit`, following the same pattern as the other `/company/result/*` routes already present.

## Acceptance Criteria (Definition of Done)
- Navigating to `/company/merit`, selecting an exam that already has merit records (created via Chunk 6), shows a populated table with correct rank order, candidate names, and photos.
- Category and Merit Status filters correctly narrow the visible rows.
- Summary cards show correct Total/Generated/Published counts matching what the backend `statistics` endpoint returns.
- Publish action correctly calls the backend and updates the row's status in the UI without a full page reload (refetch or optimistic update).
- No existing page, route, or shared component is broken by these changes.
