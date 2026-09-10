# CHUNK 6 of 8 — Bulk Merit List Creation + "Generate Merit List" Screen

> Give this file to Antigravity alone, after Chunks 1–5 are done and verified. Do not attach other chunks.

## Goal
There is currently no way to create `MeritList` records in bulk from existing `Result` records for an exam — `meritList.service.ts` can only create one record at a time and requires a `Certificate` to already exist, which blocks the flow entirely. This chunk adds a bulk-create method, makes the certificate dependency optional, and adds a new "Generate Merit List" screen on the frontend.

## Files to Touch
- `backend/src/modules/merit-list/meritList.model.ts`
- `backend/src/modules/merit-list/meritList.types.ts`
- `backend/src/modules/merit-list/meritList.service.ts`
- `backend/src/modules/merit-list/meritList.controller.ts`
- `backend/src/modules/merit-list/meritList.routes.ts`
- `frontend/src/features/company/result/pages/GenerateResultsPage.tsx` (reference only, do not modify — copy its structure)
- **New file:** `frontend/src/features/company/result/pages/GenerateMeritListPage.tsx`
- Router config file where result pages are registered (find where `GenerateResultsPage` is registered as a route, and add the new page alongside it — same file)

## Backend Changes

### 1. `meritList.model.ts` — make `certificateId` optional
Find:
```ts
certificateId: {
  type: Schema.Types.ObjectId,
  ref: "Certificate",
  required: true,
  index: true,
},
```
Change `required: true` to `required: false`. Certificates should be generated after a merit list is published, not before — this dependency was backwards.

### 2. `meritList.types.ts` — update `IMeritList`
Change:
```ts
certificateId: Types.ObjectId;
```
to:
```ts
certificateId?: Types.ObjectId | null;
```

### 3. `meritList.service.ts` — two changes

**a) Update `create()`** to not fail when there's no certificate. Find the line that calls `this.validateCertificate(...)` and throws if not found — remove the hard failure; instead, try to fetch a certificate if one exists, and pass `certificateId: certificate?._id ?? null` without throwing when absent. If `validateCertificate` is only used here, you may simplify by wrapping the certificate lookup in a try/catch that resolves to `null` on failure, rather than removing the method entirely.

**b) Add a new method** `bulkCreateFromResults`:
```ts
async bulkCreateFromResults(examId: string, generatedBy: string) {
  const Result = mongoose.models.Result;
  const results = await Result.find({ examId, isDeleted: { $ne: true } });

  if (!results.length) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No results found for this exam. Generate results first.");
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const result of results) {
    const exists = await meritListRepository.findOne({ resultId: result._id });
    if (exists) {
      skippedCount++;
      continue;
    }

    await this.create({
      examId: result.examId,
      resultId: result._id,
      candidateId: result.candidateId,
      companyId: result.companyId,
      examCenterId: result.examCenterId,
      subjectId: result.subjectId,
      category: result.category || "GENERAL",
      gender: result.gender || "OTHER",
      marksObtained: result.marksObtained,
      percentage: result.percentage,
      createdBy: new mongoose.Types.ObjectId(generatedBy),
    } as any);

    createdCount++;
  }

  // Reuse the existing sort + rank logic unchanged
  const ranked = await this.generate(examId);

  return { createdCount, skippedCount, totalResults: results.length, ranked };
}
```
Note: check `meritListRepository` for a `findOne` method; if it doesn't already exist, add a simple `findOne(filter)` method to `meritList.repository.ts` following the same pattern as other repository methods already in that file (e.g. `findByExam`).

Also check that `this.create()` (already existing in this service) still works correctly with a `resultId` that has no matching `Certificate` — confirm change 3(a) above resolves this before finishing this chunk.

### 4. `meritList.controller.ts` — add new controller function
```ts
export const bulkCreateMeritListFromResults = asyncHandler(
  async (req: Request, res: Response) => {
    const examId = req.body.examId as string;
    const generatedBy = req.user!.userId as string;

    const result = await meritListService.bulkCreateFromResults(examId, generatedBy);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list generated from results successfully.",
      data: result,
    });
  },
);
```

### 5. `meritList.routes.ts` — register the new route
Add, following the same pattern/middleware already used for other POST routes in this file:
```ts
router.post("/generate-from-results", bulkCreateMeritListFromResults);
```

## Frontend Changes

### New file: `GenerateMeritListPage.tsx`
Copy the structure of `GenerateResultsPage.tsx` closely (same imports, same layout pattern, same `PageHeader`/`Card` usage), but:
- Fetch exams filtered to those where `isResultGenerated === true` (reuse the existing `examApi.getAll()` + `getDisplayStatus` filtering pattern already present in `GenerateResultsPage.tsx`).
- Form fields:
  - **Exam** dropdown (same as Generate Results page)
  - Read-only display block (not editable) showing, once an exam is selected: `Rank Type: {exam.rankType}`, and if `exam.categoryWiseCutoff` has entries, list them as `Category: Cutoff%` pairs. Fetch the selected exam's full details via `examApi.getById(examId)` when the dropdown selection changes.
- Submit handler calls `POST /merit-list/generate-from-results` with `{ examId }` instead of `/results/generate`.
- On success, show a toast with the returned `createdCount`/`skippedCount` and navigate to `/company/merit` (this route will be built in Chunk 7 — it's fine if it doesn't exist yet, just navigate to it).

### Route registration
Find the route file where `GenerateResultsPage` is registered as a page (likely near `/company/results/generate` or similar path). Add a new route entry for `GenerateMeritListPage` at a path like `/company/merit/generate`, following the exact same pattern used for the results route.

## Acceptance Criteria (Definition of Done)
- `POST /merit-list/generate-from-results` with a valid `examId` creates one `MeritList` record per `Result` (skipping ones that already exist), then ranks them using the existing unmodified `generate()` logic.
- Running it twice on the same exam does not create duplicates (skipped count reflects this).
- The new frontend page loads, lets the admin pick an exam, shows read-only rank type/category cutoff info, and successfully triggers generation.
- No existing merit-list or result functionality is broken.
