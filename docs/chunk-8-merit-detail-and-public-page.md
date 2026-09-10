# CHUNK 8 of 8 — Merit Detail Page + Public "Check My Merit Status" Page

> Give this file to Antigravity alone, after Chunk 7 is done and verified. Do not attach other chunks. This is the final chunk.

## Goal
Build two remaining pages:
1. **Admin/detail view** of a single candidate's merit record (linked from the "View" button built in Chunk 7).
2. **Public, no-login page** where a candidate enters their application/roll number and sees their own rank, marks, and subject-wise breakdown (using the `subjectWiseBreakdown` data added to `Result` in Chunk 5).

## Files to Touch
- **New file:** `frontend/src/features/merit/pages/MeritDetailPage.tsx`
- **New file:** `frontend/src/features/merit/pages/PublicMeritCheckPage.tsx`
- `frontend/src/features/merit/api/index.ts` (add two functions)
- `frontend/src/features/merit/pages/index.ts` (export the two new pages)
- Router config file (same one touched in Chunks 6 and 7)

## Reference Components to Reuse
- The candidate photo + name + application number header block already built for the Exam Instructions screen (see the "Candidate" info block in the exam-arena feature, `frontend/src/features/exam-arena/`) — match that visual pattern for consistency, don't design a new header style from scratch.
- `frontend/src/features/company/result/pages/ResultDetailsPage.tsx` — this page already renders a question-by-question breakdown; reuse its layout conventions for the new subject-wise summary table (but do NOT reuse its hardcoded `subject: 'General'` placeholder — that was flagged as a bug; use the real `subjectWiseBreakdown` array from the `Result` document instead, fetched via the merit record's linked `resultId`).

## Backend Check (read-only, no backend changes needed if these already exist)
Confirm these two endpoints already exist and work as expected before starting:
- `GET /merit-list/:id` (`getMeritListById` in `meritList.controller.ts`) — returns a single merit record.
- `GET /merit-list/candidate/:candidateId` (`getCandidateMeritList`) — returns a candidate's merit record(s).

If the response from either does not include the linked `Result` document's `subjectWiseBreakdown` (added in Chunk 5), extend `meritList.repository.ts`'s relevant find method to `.populate('resultId')` so the subject breakdown is available on the frontend without an extra API call. Only make this backend change if it's actually missing — check first.

## Frontend Changes

### 1. `frontend/src/features/merit/api/index.ts` — add
```ts
getById: (meritId: string) => apiClient.get(`/merit-list/${meritId}`),
getByCandidate: (candidateId: string) => apiClient.get(`/merit-list/candidate/${candidateId}`),
```

### 2. New file: `MeritDetailPage.tsx`
Route param: `:meritId`. On mount, call `meritApi.getById(meritId)`.

Layout:
- Header block: candidate photo (circular), name, application number, exam title — same visual style as referenced above.
- Prominent rank display: large `Rank #{overallRank}` (and, if `rankType === 'CATEGORY_WISE'` on the linked exam, also show the category-specific rank alongside it — fetch the exam via the merit record's `examId` to check `rankType`).
- Score summary cards: Marks Obtained / Total Marks, Percentage, Correct/Wrong counts, Status badge (Qualified/Not Qualified).
- **Subject-wise breakdown table**, columns: Subject | Correct | Wrong | Marks Obtained | Max Marks | Sectional Cutoff | Status — populated from the linked Result's `subjectWiseBreakdown` array (see Backend Check above for how this data reaches the frontend).
- Merit metadata footer: Merit Number, Merit Status, Published date if applicable.

### 3. New file: `PublicMeritCheckPage.tsx`
This page must NOT require authentication — check how other public/no-login pages in this app are routed (look at how the candidate exam-taking flow or admit-card download flow is set up, since those are also accessed without a normal admin login) and follow the same routing/auth-bypass pattern.

Layout:
- Simple centered card: "Check Your Merit Status" heading, an input for Application Number / Roll Number, and a "Check Status" button.
- On submit: look up the candidate by application number first (check if a public "find candidate by application number" endpoint already exists in `backend/src/modules/candidate/`; if one exists, use it — if not, do NOT create a new public backend endpoint in this chunk, and instead just leave a clear `// TODO: requires a public candidate-lookup-by-application-number endpoint before this page is functional` comment, and stub the UI so the layout is ready but the search itself shows a "coming soon" state). This avoids exposing a new unauthenticated data-lookup endpoint without a deliberate security review, which is out of scope for this chunk.
- If a public lookup path is confirmed to exist, call `meritApi.getByCandidate(candidateId)` after resolving the candidate, and render the same detail layout as `MeritDetailPage.tsx` (extract the shared display portion into a small reusable component, e.g. `MeritDetailView.tsx`, used by both pages, to avoid duplicating the layout).

### 4. `frontend/src/features/merit/pages/index.ts`
Export both new pages.

### 5. Route registration
- `MeritDetailPage` → `/company/merit/:meritId` (admin-only route, same auth guard pattern as the rest of `/company/*` routes)
- `PublicMeritCheckPage` → `/merit-status` or similar public path (no admin auth guard — follow the pattern of whatever other public route already exists in this app, e.g. the exam instructions/exam-arena public routes)

## Acceptance Criteria (Definition of Done)
- Clicking "View" on any row in the `MeritListPage` (built in Chunk 7) opens `MeritDetailPage` and shows correct rank, score, and subject-wise breakdown for that specific candidate.
- `PublicMeritCheckPage` is reachable without logging in as an admin/company user.
- If no public candidate-lookup endpoint exists yet, the public page still renders its layout cleanly with a clear "coming soon" / TODO state rather than crashing or silently failing.
- No existing route, page, or auth guard is broken.
