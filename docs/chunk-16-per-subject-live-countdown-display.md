# CHUNK 16 — Per-Subject Live Countdown Display on the Active Tab

> Give this file to Antigravity alone, after Chunk 15 is done and verified. Do not attach other chunks. This is a UI-only addition — no new backend logic is needed since all the timing data already exists from Chunk 10.

## ⏱ WHEN THIS RUNS
**LIVE, DURING the candidate's exam attempt.** Pure display change on the exam-taking screen. No new data needs to be computed — `sectionTimings` (candidate's per-subject start time) and `subject.timeAllottedMinutes` (from Chunk 9) already exist and already drive the lock/auto-advance logic from Chunk 10. This chunk only adds a visible countdown next to the tab label.

## Goal
Currently the subject tabs (e.g. `[ENGLISH LANGUAGE] [QUANTITATIVE APTITUDE] [REASONING] [GENERAL AWARENESS]`) show only the subject name. Add a live, reverse-counting timer next to the **currently active subject's tab only**, showing time remaining for that specific subject — in addition to (not replacing) the existing overall exam timer already shown at the top of the screen.

## Files to Touch
- `frontend/src/features/exam-arena/` — the component rendering the subject tab bar (the same one modified in Chunk 15 for Part-based tab visibility)

## Exact Behavior

1. **Only the currently active subject's tab** shows a countdown, formatted as `MM:SS`, positioned next to (or below) the subject name inside that tab — e.g.:
   ```
   [ REASONING  02:47 ]   [ ENGLISH LANGUAGE ]
   ```
   (Reasoning is active and counting down; English is visible — because it's in the same active Part per Chunk 15 — but not yet started, so it shows no timer, or optionally shows its total allotted time as a static, non-counting label like `03:00` to preview how long it will get once it becomes active — pick whichever is simpler given the existing tab component's structure, but the countdown itself must only animate/tick for the truly active subject.)

2. **Locked/completed subjects** (already visited and expired, per Chunk 10's `isLocked` flag) should NOT show a ticking countdown — if their tab is still visible at all (e.g. within the same completed Part, before the UI moves fully to the next Part), show a static `00:00` or a small lock icon instead, not a live number.

3. **Computation**: derive the countdown the same way the existing lock/auto-advance logic in Chunk 10 already does — `remainingSeconds = (subject.timeAllottedMinutes * 60) - secondsElapsedSince(sectionTiming.startedAt)`. Reuse this exact calculation (or the existing timer hook/state from Chunk 10) rather than writing a second, separate timer instance that could drift out of sync with the one already driving the auto-lock behavior. If Chunk 10 already exposes a `remainingSeconds` (or similar) value in component state/props, use that value directly for this display rather than recalculating it independently.

4. **The overall exam timer** (top bar, e.g. `00:10:17`) is untouched — it keeps counting down the full exam duration exactly as it does today, completely independent of this per-subject display.

5. This countdown must correctly resume after a page refresh, using the same resume logic already built in Chunk 10 for the underlying timer — do not reset the displayed countdown to the full allotted time on reload if time has already elapsed.

## Acceptance Criteria (Definition of Done)
- The currently active subject's tab shows a live `MM:SS` countdown that visibly ticks down once per second.
- No other visible tab shows a ticking countdown — at most a static label or lock indicator.
- The countdown reaches `00:00` at exactly the same moment the existing Chunk 10 auto-lock/auto-advance logic fires — the two must be driven by the same underlying time source, not two independently-drifting timers.
- The overall exam timer at the top of the screen is unchanged in position, behavior, or value.
- Refreshing the page shows the correct remaining time immediately, not a reset full countdown.
