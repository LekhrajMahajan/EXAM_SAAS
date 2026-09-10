# CHUNK 10 of 14 — Subject-wise Time Limit: Live Enforcement During Exam

> Give this file to Antigravity alone, after Chunk 9 is done and verified. Do not attach other chunks.

## ⏱ WHEN THIS RUNS
**LIVE, DURING the candidate's exam attempt.** This is neither "pre-decided config" nor "post-result calculation" — it is real-time behavior that reads the config saved in Chunk 9 and enforces it while the candidate is actively taking the exam.

## Goal
When `exam.sectionalTimeLimitEnabled` is true, the candidate's exam screen must run a **separate countdown per subject** instead of (or alongside) the single overall timer. When a subject's allotted time expires: the subject auto-locks, the UI auto-navigates to the next subject, and the candidate can never return to a locked subject — even by refreshing the page or calling the API directly.

## Step 0 — Locate the Relevant Files First
This codebase's live exam-taking screen is under `frontend/src/features/exam-arena/` (confirmed from the "English Language Questions" screenshot with subject tabs, timer, and question palette shown earlier in this project). Before making changes:
1. Find the component that renders the top timer bar and subject tabs (`ENGLISH LANGUAGE`, `QUANTITATIVE APTITUDE`, etc.).
2. Find the hook/state that tracks the countdown (likely a `useTimer` or similar hook).
3. Find the backend model that stores in-progress exam state per candidate — likely `ExamSubmission` (`backend/src/modules/exam-submission/`) — check for existing fields like `startedAt`, `timeRemaining`, or similar, used to persist the overall timer across page refreshes.
Do not proceed with edits until these three are identified — reference their actual names/paths in your changes instead of guessing.

## Backend Changes

### Exam submission model — add per-section timing state
In the `ExamSubmission` model (or whichever model was identified in Step 0 as tracking in-progress state), add:
```ts
sectionTimings: [
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    startedAt: { type: Date, default: null },
    lockedAt: { type: Date, default: null },
    isLocked: { type: Boolean, default: false },
  },
],
currentSubjectId: {
  type: Schema.Types.ObjectId,
  ref: "Subject",
  default: null,
},
```

### New/updated endpoint — server-side lock enforcement
Find the existing endpoint used to save a candidate's answer during the exam (likely something like `PATCH /exam-submission/:id/answer` or similar under `candidate-answer` module). Add a server-side check at the top of that handler:
```ts
const submission = await ExamSubmission.findById(submissionId);
const sectionTiming = submission.sectionTimings.find(
  (s) => String(s.subjectId) === String(question.subjectId)
);
if (sectionTiming?.isLocked) {
  throw new ApiError(HTTP_STATUS.FORBIDDEN, "This section is locked. Time for this subject has expired.");
}
```
This is critical — the frontend lock alone can be bypassed by calling the API directly, so the backend must independently reject answers submitted to a locked subject.

### New endpoint — lock a section
Add `POST /exam-submission/:id/lock-section` accepting `{ subjectId }`, which sets `isLocked: true` and `lockedAt: now` for that subject's entry in `sectionTimings`. This will be called by the frontend the moment a subject's timer hits zero (see below), and should also be idempotent (calling it twice for an already-locked section should not error).

## Frontend Changes (in the exam-arena feature identified in Step 0)

1. When `exam.sectionalTimeLimitEnabled` is true:
   - Replace the single overall countdown display with a **per-subject countdown**, computed from `sectionTiming.startedAt + subject.timeAllottedMinutes`.
   - On first entering a subject tab, if that subject has no `startedAt` yet, call an endpoint to record `startedAt = now` for it (add this alongside the existing lock-section endpoint, e.g. `POST /exam-submission/:id/start-section`).
   - When the per-subject countdown reaches zero:
     a. Call `POST /exam-submission/:id/lock-section` for the current subject.
     b. Auto-navigate to the next subject tab in order (reuse whatever tab-switching function already exists in this component).
     c. Show a brief toast: `"Time up for {subject name}. Moving to next section."`
   - Disable click/navigation to any subject tab where `sectionTiming.isLocked === true` — grey it out visually (reuse the existing tab styling, just add a disabled/locked visual state, e.g. a lock icon next to the tab label).
   - If the candidate refreshes the page mid-exam, on reload, fetch `sectionTimings` from the submission and correctly resume the countdown for the current unlocked subject (do not reset it), and correctly re-apply locked/disabled state to already-locked subjects.

2. When `exam.sectionalTimeLimitEnabled` is false: **no change at all** to current behavior — confirm the existing single overall-timer flow is completely untouched.

3. On the last subject's timer expiring (no next subject to move to), trigger the exam's existing auto-submit flow (reuse whatever function already handles "Submit Exam" when the overall timer hits zero today).

## Acceptance Criteria (Definition of Done)
- With `sectionalTimeLimitEnabled = false` (any existing exam), the exam-taking experience is pixel-for-pixel identical to before this chunk.
- With `sectionalTimeLimitEnabled = true`, each subject shows its own countdown; expiry auto-locks and auto-advances; locked subjects cannot be revisited via UI.
- Attempting to submit an answer to a locked subject via a direct API call (e.g. Postman) is rejected by the backend with a clear error, even if the frontend lock were somehow bypassed.
- Refreshing the browser mid-exam does not reset any subject's timer or unlock an already-locked subject.
- Exam auto-submits correctly when the last subject's time expires.
