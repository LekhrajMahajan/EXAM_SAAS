# CHUNK 15 — Part-Based Subject Gating + Sectional Timer Sequencing (Combined)

> Give this file to Antigravity alone. This builds directly on Chunk 9 (sectional time config), Chunk 10 (sectional time live enforcement), and Chunk 11 (Part-wise cutoff config) — all of which are already implemented in this codebase. Do not attach other chunks.

## ⏱ WHEN THIS RUNS
**LIVE, DURING the candidate's exam attempt.** This fixes a confirmed bug: the "Choose Starting Part" screen already exists and lets the candidate pick a Part (e.g. Part A = English + Reasoning), but the actual exam-taking screen currently ignores that choice and shows all subjects from all Parts as tabs immediately. This chunk makes Part selection actually gate which subjects are visible/accessible, and sequences it correctly with the existing per-subject timer (Chunk 10).

## The Complete Rule (confirmed with the project owner)
1. Candidate picks ONE starting Part on the Instructions screen (already built — e.g. "Part A: English Language, Reasoning"). This choice is locked in and cannot change once the exam starts.
2. Once the exam starts, **only the subjects belonging to the currently active Part are shown as tabs** — subjects from any other Part must be completely hidden, not just disabled/greyed out.
3. Within the active Part, each subject still runs its own individual countdown exactly as built in Chunk 10 (e.g. Reasoning gets its own 3 minutes; when it expires, auto-lock Reasoning and move to the next subject **within the same Part**).
4. Only after **every subject in the currently active Part is locked/completed** does the **next Part** become active — at which point its subjects (previously completely hidden) now appear as tabs, and the same per-subject sequencing (rule 3) applies to them.
5. If there are more than 2 Parts, the order after the candidate's chosen starting Part is: the remaining Parts in the order they appear in `exam.parts` (skip the one already chosen/completed).
6. When the very last subject of the very last Part expires, trigger the exam's existing auto-submit flow.

## Files to Touch
- Backend: the `ExamSubmission` model (same one extended in Chunk 10 with `sectionTimings`) — likely `backend/src/modules/exam-submission/`
- Backend: the answer-submission endpoint already modified in Chunk 10 for section-lock enforcement
- Backend: the endpoint that saves the candidate's starting-Part choice (locate this — the "Choose Starting Part" screen shown in the Instructions page must already call something to persist this choice; find it before assuming it needs to be created)
- Frontend: `frontend/src/features/exam-arena/` — the Instructions/starting-part-selection component, and the main exam-taking screen with the subject tabs

## Step 0 — Locate Existing Pieces First
Before writing anything:
1. Find where the "Choose Starting Part" selection (already visible in the Instructions screen) is submitted/saved — check if it already calls an API to store the choice, or if it's currently only frontend state that gets lost on navigating to the exam screen. This is likely the root cause of the bug — confirm it.
2. Confirm `sectionTimings` (from Chunk 10) and `exam.parts` (from Chunk 11) are both reachable from the exam-taking screen's current data-fetching logic.

## Backend Changes

### 1. `ExamSubmission` model — add Part-tracking fields (if not already present from Step 0's findings)
```ts
selectedStartingPartId: {
  type: Schema.Types.ObjectId,
  default: null,
},
partProgress: [
  {
    partId: { type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["ACTIVE", "LOCKED", "COMPLETED"],
      default: "LOCKED",
    },
  },
],
```

### 2. Endpoint to save the starting Part choice
If Step 0 found this already exists but doesn't correctly initialize `partProgress`, fix it; if it doesn't exist, add `POST /exam-submission/:id/select-starting-part` accepting `{ partId }`, which:
- Sets `selectedStartingPartId = partId`.
- Builds `partProgress` for ALL parts in `exam.parts`: the chosen part gets `status: "ACTIVE"`, all others get `status: "LOCKED"`, in the order described in Rule 5 above (store this order, e.g. as an `partOrder: [ObjectId]` array on the submission, so "which part comes next" doesn't need to be recomputed ambiguously later).
- Rejects the call if `partProgress` already exists on this submission (starting Part cannot be changed once set — matches the "You cannot change this after starting" text already shown in the UI).

### 3. Extend the section-lock check (built in Chunk 10) to also check Part gating
In the same answer-submission endpoint already modified in Chunk 10, after checking `sectionTiming.isLocked`, add a second check:
```ts
const subjectPartId = findPartForSubject(exam.parts, question.subjectId); // helper: which part does this subject belong to
const partEntry = submission.partProgress.find(p => String(p.partId) === String(subjectPartId));

if (!partEntry || partEntry.status !== "ACTIVE") {
  throw new ApiError(HTTP_STATUS.FORBIDDEN, "This subject is not part of your currently active section.");
}
```
This ensures a candidate cannot answer a question from a hidden/locked Part even via a direct API call.

### 4. Extend the "lock-section" endpoint (built in Chunk 10) to check Part completion
In `POST /exam-submission/:id/lock-section`, after marking the subject's `sectionTiming.isLocked = true`, add this logic right after:
```ts
// Check if every subject in the current active part is now locked
const activePart = submission.partProgress.find(p => p.status === "ACTIVE");
const subjectsInActivePart = exam.parts.find(p => String(p._id) === String(activePart.partId)).subjectIds;

const allLockedInPart = subjectsInActivePart.every((subjId) => {
  const timing = submission.sectionTimings.find(s => String(s.subjectId) === String(subjId));
  return timing?.isLocked === true;
});

if (allLockedInPart) {
  activePart.status = "COMPLETED";

  const nextPartId = submission.partOrder.find((pid) => {
    const entry = submission.partProgress.find(p => String(p.partId) === String(pid));
    return entry.status === "LOCKED";
  });

  if (nextPartId) {
    submission.partProgress.find(p => String(p.partId) === String(nextPartId)).status = "ACTIVE";
  }
  // if nextPartId is undefined, this was the last part — frontend will detect no ACTIVE part remains and trigger auto-submit
}

await submission.save();
```

## Frontend Changes (`frontend/src/features/exam-arena/`)

### 1. Starting Part selection screen
Ensure selecting a Part and clicking "I am ready to begin" actually calls the `select-starting-part` endpoint (from backend change #2) before navigating to the exam screen — this is likely the missing wire-up causing the bug.

### 2. Main exam-taking screen — subject tabs
- On load, fetch the submission's `partProgress` and `exam.parts`.
- Determine the currently `ACTIVE` part's `subjectIds`.
- **Only render tabs for subjects in that list.** Do not render other subjects' tabs at all (not even disabled/greyed — fully absent from the DOM), until their Part becomes `ACTIVE`.
- After each `lock-section` call (already happening per Chunk 10 when a subject's timer hits zero), re-fetch or locally update `partProgress`. If the active part changed (a new part became `ACTIVE`), replace the visible tab list with the new part's subjects, and auto-navigate to the first subject of the new part.
- If no part is `ACTIVE` anymore (all completed), trigger the existing auto-submit flow (same as Chunk 10's "last subject expires" behavior).

### 3. Handle refresh mid-exam
On page reload, re-fetch `partProgress` and `sectionTimings` together and correctly restore: which part is active, which subjects are visible, which are locked, and resume the current subject's countdown from where it left off (reuse the resume logic already built in Chunk 10).

## Acceptance Criteria (Definition of Done)
- Selecting "Part A" on the Instructions screen results in ONLY Part A's subjects (English, Reasoning) appearing as tabs when the exam starts — Part B's subjects (Quant, GA) are not visible anywhere on screen.
- When both Part A subjects' timers expire and lock, Part B's subjects automatically appear as tabs, and the first one auto-starts its own timer.
- A direct API call trying to submit an answer for a subject in a non-active Part is rejected by the backend.
- Refreshing the browser mid-exam correctly restores exactly which Part/subjects should be visible — no Part-B leakage after refresh, no lost progress.
- Exam auto-submits when the last subject of the last Part expires.
