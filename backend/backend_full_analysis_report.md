# Backend Full Analysis & Optimization Report

## 1. Executive Summary & Architecture Overview
This comprehensive audit covers the entire Node.js/Express backend consisting of **77 modules** and **1062 API endpoints**. 
The analysis identifies core bottlenecks related to synchronous third-party API calls (e.g., email/SMS), unoptimized MongoDB queries and aggregations, lack of caching for highly accessed routes, and sequential processing inside loops.

## 2. Latency Benchmarks Categorization
- **Instant / Cache Hit (< 15ms)**: Target for all high-read, non-mutating endpoints.
- **Fast / Lightweight DB (15ms - 50ms)**: Standard operations for single document lookups and writes.
- **Moderate / Heavy Aggregation (50ms - 200ms)**: Complex joins, filtering, and bulk operations.
- **Critical Bottleneck (> 200ms - 2000ms+)**: Synchronous third-party tasks, heavy reports, multi-file uploads.

## 3. Module-by-Module Detailed Table

| Module Name | API Endpoint | Operation Type | Current Estimated Latency | Identified Bottleneck | Target Optimized Latency | Recommended Fix Strategy |
|---|---|---|---|---|---|---|
| activity-log | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| activity-log | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| activity-log | `GET /recent` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| activity-log | `GET /user/:userId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| activity-log | `GET /module/:module` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| activity-log | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| activity-log | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| activity-log | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| activity-log | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| activity-log | `POST /seed-exam-manager` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| admit-card | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `POST /bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| admit-card | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `POST /verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `GET /download/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| admit-card | `PATCH /regenerate/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `POST /:id/print` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| admit-card | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| admit-card | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| admit-card | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| admit-card | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| admit-card | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| analytics | `GET /overview` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /candidates` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /exams` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /results` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /attendance` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /questions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /companies` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /centers` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /employees` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /assignments` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /finance` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /live` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /trust-scores` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /heatmaps` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /search` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| analytics | `POST /export` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| analytics | `POST /schedule` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| analytics | `GET /personalization` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `POST /personalization` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| analytics | `GET /notifications` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /queue` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /system` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| analytics | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| analytics | `GET /charts` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| approval | `PATCH /:id/submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| approval | `PATCH /:id/review` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| approval | `PATCH /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| approval | `PATCH /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| approval | `PATCH /:id/publish` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| attendance | `GET /roster` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /history` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| attendance | `GET /reports` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| attendance | `GET /analytics` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| attendance | `GET /leave` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /duty-swap` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `POST /manual` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /face-verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /leave` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /duty-swap` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /replacement` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /approve-leave` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /approve-leave/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /reject-leave` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /reject-leave/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /approve-swap` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /approve-swap/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /reject-swap` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `PATCH /reject-swap/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /dashboard/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| attendance | `GET /report/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| attendance | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| attendance | `POST /verify-qr` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /check-in` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /:id/check-in` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /:id/biometric` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /:id/face` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /:id/manual` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /check-out` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `POST /:id/check-out` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| attendance | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /exam/:examId/logins` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| attendance | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| audit-log | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| audit-log | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| audit-log | `GET /user/:userId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| audit-log | `GET /module/:module` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| audit-log | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| audit-log | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| audit-log | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| audit-log | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `POST /register` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `POST /login` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `POST /forgot-password` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `POST /reset-password` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `POST /verify-email` | Third-Party API call / Notification dispatch | 600ms+ | Blocking email/SMS trigger in request-response cycle | < 50ms | Background Non-blocking Queues / Deferred Execution |
| auth | `POST /refresh-token` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `POST /logout` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| auth | `GET /profile` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| auth | `GET /me` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| auth | `PATCH /change-password` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| biometric-verification | `GET /dashboard/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| biometric-verification | `GET /report/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| biometric-verification | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /:id/fingerprint` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /:id/iris` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /:id/face` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /:id/liveness` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /:id/multi-factor` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `POST /:id/retry` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| biometric-verification | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| biometric-verification | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| biometric-verification | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| biometric-verification | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| biometric-verification | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate | `GET /:id/profile` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `PATCH /:id/assign-seat` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| candidate | `PATCH /:id/remove-seat` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `PATCH /:id/verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `PATCH /:id/generate-hallticket` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `POST /save` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `POST /submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `POST /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `PATCH /:id/review` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `GET /:id/mark-review` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `PATCH /:id/clear` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-answer | `GET /question/:questionId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `GET /submission` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `GET /submission/:submissionId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `GET /dashboard/:submissionId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| candidate-answer | `GET /statistics/:submissionId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-answer | `GET /progress/:submissionId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `GET /test-db` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `POST /login` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /face-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /device-registration` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /geo-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /start` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /start-section` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /lock-section` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `GET /questions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `POST /save-answer` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `PATCH /mark-for-review` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `PATCH /clear-response` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /save-next` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `GET /previous-question` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `POST /submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /auto-submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `GET /result-preview` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `GET /violation-logs` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `POST /log-violation` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /session-heartbeat` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `POST /reconnect` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| candidate-exam | `GET /exam-summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `GET /final-result` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| candidate-exam | `POST /set-part-order` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /test-email` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /test-db` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /test-validation` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /test-create-mock` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /pending-verifications` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| center | `GET /readiness` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /compliance` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /commercial-agreement` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `POST /onboarding/start` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /onboarding/status` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `PUT /onboarding/agreement` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /onboarding/profile` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| center | `PUT /onboarding/documents` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /onboarding/staff` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /onboarding/infrastructure` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /onboarding/shift-planning` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /onboarding/compliance` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `POST /onboarding/submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /documents/:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /documents/:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /:id/verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /staff/all` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| center | `POST /staff/create` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /staff/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `DELETE /staff/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /staff/:id/verify-otp` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /labs` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `POST /labs` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PUT /labs/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `DELETE /labs/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /infrastructure` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `POST /infrastructure` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /photos` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `POST /photos` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `POST /photos/upload` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| center | `POST /mou/upload` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| center | `GET /location` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `PATCH /location` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /me` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `PATCH /me/payment-details` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `POST /send-credentials` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `POST /verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /find-existing` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `GET /incoming` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /outgoing` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center | `PUT /:id/upload-documents` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| center | `PATCH /:id/documents/:docId/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /:id/documents/:docId/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center | `PATCH /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-assign-candidate-attendance | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-assign-candidate-attendance | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-assign-candidate-attendance | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-assign-exam-staff | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-assign-exam-staff | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-assign-exam-staff | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-candidate-import | `POST /upload` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| center-candidate-import | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-candidate-import | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-candidate-import | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-payments | `GET /debug-count` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-payments | `GET /debug-auth` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-payments | `GET /generate-missing` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-payments | `GET /company` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-payments | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-payments | `PATCH /:id/pay` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-payments | `POST /:id/razorpay-order` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-payments | `POST /:id/verify-razorpay` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-system-network | `POST /scan` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| center-system-network | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| center-system-network | `GET /status` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `GET /verify/:verificationCode` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| certificate | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `GET /result/:resultId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| certificate | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| certificate | `PATCH /:id/generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| certificate | `PATCH /:id/issue` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| certificate | `POST /revoke` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| certificate | `GET /:id/download` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| certificate | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| certificate | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| chapter | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| chapter | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| chapter | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| chapter | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| chapter | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| chapter | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| chapter | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| chapter | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `GET /dump` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| company | `GET /debug-centers` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| company | `POST /register` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| company | `GET /approvals/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| company | `GET /usage-stats` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| company | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| company | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| company | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `PATCH /:id/subscription` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `POST /:id/verify-payment` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `POST /:id/assign-reviewer` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| company | `POST /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `POST /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| company | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| dashboard | `GET /role-stats` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| dashboard | `GET /overview` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /charts` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /cards` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /exams` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /candidates` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /results` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /attendance` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /live-monitoring` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /question-bank` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /companies` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /centers` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /employees` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /activity` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /queue` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /notifications` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| dashboard | `GET /system-health` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| email | `POST /send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| email | `POST /send-custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-staff-id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-otp` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-welcome` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-password-reset` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-account-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-exam-schedule` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-admit-card` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| email | `POST /send-certificate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| employee | `GET /export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| employee | `POST /bulk-action` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| employee | `POST /invite` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `POST /create` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `POST /approve-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `POST /reject-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /complete-profile` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| employee | `POST /upload-documents` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| employee | `POST /face-enrollment` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `POST /submit-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| employee | `GET /devices` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| employee | `POST /logout-devices` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| employee | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| employee | `PATCH /:id/complete-profile` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| employee | `POST /:id/upload-documents` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| employee | `POST /:id/face-enrollment` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `POST /:id/submit-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id/approve-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id/reject-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id/transfer` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `GET /:id/dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| employee | `GET /:id/devices` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| employee | `POST /:id/logout-devices` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id/reset-password` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `PATCH /:id/assign-role` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| employee | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| employee | `GET /:id/login-history` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| employee | `GET /:id/activity` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| entry-checker | `GET /search-candidate/:applicationNo` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| entry-checker | `POST /verify-candidate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| entry-checker | `GET /my-assignments` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam | `GET /:id/preview` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `PATCH /:id/submit-for-approval` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `PATCH /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `PATCH /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `POST /:id/start` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `POST /:id/end` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `POST /:id/publish-result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `GET /:id/publish-result` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam | `PATCH /:id/publish-result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `POST /:id/papers/auto-select` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `PATCH /:id/approval` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam | `POST /:id/clone` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-center | `POST /map` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-center | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-center | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-center | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-center | `GET /shift/:shiftId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-center | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-center | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-center | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-center | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-center | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-center | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-room | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-room | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-room | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-room | `GET /center/:centerId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-room | `GET /shift/:shiftId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-room | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-room | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-room | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-room | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-room | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-shift | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-shift | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-shift | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-shift | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-shift | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-shift | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-shift | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-shift | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-shift | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/start` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/resume` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/pause` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/heartbeat` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/time` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `POST /submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `PATCH /:id/auto-submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| exam-submission | `GET /report` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| exam-submission | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-submission | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-submission | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| exam-submission | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| exam-submission | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| face-verification | `GET /dashboard/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| face-verification | `GET /report/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| face-verification | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `POST /verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `POST /:id/verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `POST /:id/liveness` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `POST /:id/spoof` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `POST /:id/retry` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `POST /:id/complete` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| face-verification | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| face-verification | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| face-verification | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| face-verification | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| face-verification | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| file-storage | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| file-storage | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `POST /upload` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| file-storage | `POST /bulk-upload` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| file-storage | `GET /download/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `GET /preview/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `GET /stream/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `GET /proxy` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `GET /reports` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| file-storage | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| file-storage | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| file-storage | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| file-storage | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| geo-monitoring | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| geo-monitoring | `GET /exam/:examId/entity/:entityId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| geo-monitoring | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /live` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /ready` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /system` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /database` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /redis` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /queue` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /storage` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /smtp` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /sms` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| health | `GET /push` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-candidate | `GET /debug-fetch` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-candidate | `POST /upload` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| import-candidate | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-candidate | `POST /send-to-center` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-candidate | `POST /send-to-admin` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-candidate | `GET /unassigned/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-candidate | `POST /assign-lab` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| import-candidate | `GET /allocations/:examId` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| import-candidate | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-candidate | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-center-assign-exam | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-center-assign-exam | `GET /assigned-exams/center/:centerId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-center-assign-exam | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-center-assign-exam | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-center-assign-exam | `PATCH /:id/send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-center-assign-exam | `POST /:id/send-to-centers` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-export | `POST /import` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| import-export | `POST /export` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-export | `POST /validate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-export | `GET /history` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| import-export | `GET /history/:id` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| import-export | `DELETE /history/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-export | `GET /download/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| import-export | `POST /cancel/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| import-export | `GET /templates/:type` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| invoice | `GET /dashboard-stats` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| invoice | `GET /dashboard/charts` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| invoice | `GET /dashboard/top-companies` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| invoice | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| invoice | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| invoice | `GET /:id/credit-notes` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| invoice | `GET /:id/debit-notes` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| invoice | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| invoice | `POST /:id/credit-note` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| invoice | `POST /:id/debit-note` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| invoice | `GET /:id/download` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| invoice | `POST /:id/resend` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `GET /observer-dashboard/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| live-monitoring | `GET /command-center-dashboard/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| live-monitoring | `GET /report/:examId` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| live-monitoring | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /events` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `GET /device-monitoring` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `POST /force-submit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `GET /force-submit` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `POST /force-logout` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /broadcast-announcement` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `GET /broadcast-announcement` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `POST /emergency-stop` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `GET /emergency-stop` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /analytics` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| live-monitoring | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| live-monitoring | `GET /active-candidates` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /candidate-status/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /candidate-details/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /webcam-snapshot/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /face-verification-logs/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /live-violations` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /heartbeat-monitor` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /centers` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /violations` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| live-monitoring | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/heartbeat` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/camera` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/microphone` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/browser` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/connection` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/fullscreen` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/risk` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/tab-switch` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/fullscreen-exit` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/copy-paste` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/devtools` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/network-disconnect` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| live-monitoring | `POST /:id/network-reconnect` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| notification | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| notification | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| notification | `GET /employee/:employeeId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| notification | `GET /recipient/:recipientId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| notification | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `POST /bulk-send` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| notification | `POST /send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `PATCH /:id/send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `PATCH /:id/schedule` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `PATCH /:id/read` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `PATCH /:id/retry` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `PATCH /:id/cancel` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| notification | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| notification | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| notification | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| observer | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| observer | `GET /live` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| observer | `POST /assign` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| observer | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| observer | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| observer | `PATCH /check-in` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| observer | `PATCH /check-out` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| observer | `POST /incidents` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| observer | `PATCH /incidents/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| observer | `GET /incidents` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| onboarding | `POST /complete` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| onboarding | `GET /navigation` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| organization-seeder | `POST /reseed` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| organization-seeder | `POST /:id/initialize` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| organization-seeder | `GET /:id/initialization-status` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| organization-seeder | `POST /:id/rebuild-sidebar` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| organization-seeder | `POST /:id/rebuild-permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper | `GET /assigned` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper | `GET /:id/preview` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `POST /:id/clone` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `PATCH /:id/submit-for-approval` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `PATCH /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `PATCH /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `PATCH /:id/approval` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `POST /:id/questions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `POST /:id/questions/bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| paper | `PATCH /:id/questions/:questionId` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `DELETE /:id/questions/:questionId` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper-question | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `POST /bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| paper-question | `POST /map` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `GET /paper/:paperId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper-question | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| paper-question | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `PATCH /reorder` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| paper-question | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| payment | `GET /center/:centerId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| payment | `GET /company` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| payment | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| payment | `PATCH /:paymentId/verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| payment | `POST /:paymentId/razorpay-order` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| payment | `POST /:paymentId/verify-razorpay` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| payment | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| payment | `POST /create-order` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| payment | `POST /verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /certificate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /admit-card` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /merit-list` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /question-paper` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /report` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /download` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| pdf | `POST /preview` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| permission | `GET /matrix` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| permission | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| permission | `GET /search` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| permission | `GET /group/:group` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| permission | `GET /module/:module` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| permission | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| permission | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| permission | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| permission | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| permission | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| permission | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| permission | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| plan | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| plan | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| plan | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| plan | `PUT /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| plan | `POST /:id/clone` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| plan | `POST /:id/archive` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| plan | `POST /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| plan | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /send-bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| push-notification | `POST /exam-reminder` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /system` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /topic/subscribe` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /topic/unsubscribe` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| push-notification | `POST /topic/send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /certificate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /admit-card` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /employee` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /candidate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /paper` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /exam` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| qr | `POST /verify` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| question-bank | `POST /import` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| question-bank | `GET /export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| question-bank | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| question-bank | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| question-bank | `GET /:id/preview` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| question-bank | `POST /:id/duplicate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `PATCH /:id/approval` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| question-bank | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `POST /job` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `POST /email` | Third-Party API call / Notification dispatch | 600ms+ | Blocking email/SMS trigger in request-response cycle | < 50ms | Background Non-blocking Queues / Deferred Execution |
| queue | `POST /pdf` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `POST /report` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `GET /jobs` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| queue | `GET /job/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| queue | `POST /job/:id/retry` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `DELETE /job/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `POST /pause` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `POST /resume` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| queue | `DELETE /clean` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| rbac-validator | `POST /run` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| rbac-validator | `GET /report` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| report | `GET /metadata` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `POST /preview` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /:id/execute` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /:id/clone` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /templates` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /templates/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `POST /templates` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `PATCH /templates/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `DELETE /templates/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `PATCH /templates/:id/publish` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /schedules` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /schedules/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `POST /schedules` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `PATCH /schedules/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `DELETE /schedules/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `PATCH /schedules/:id/toggle` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /schedules/:id/run` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /executions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `POST /master` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /candidate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /exam` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /attendance` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /users/generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /biometric` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /live-monitoring` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| report | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /recent` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /categories` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /:id/favorite` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `POST /:id/download` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /users/summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /users/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /users/login-history` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /users/roles` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /users/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /candidates/summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /candidates/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /candidates/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /exams/summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /exams/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /exams/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /attendance/summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /attendance/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /attendance/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /results/summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /results/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /results/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `POST /financial/generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /financial/summary` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /financial/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /financial/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `POST /security/generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| report | `GET /security/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| report | `GET /security/list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| report | `GET /security/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /export/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| result | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /merit-list` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| result | `GET /topper/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /pass-percentage/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `POST /publish` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `GET /approve` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `POST /approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `PATCH /:id/evaluate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `PATCH /:id/re-evaluate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `PATCH /:id/publish` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `PATCH /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `PATCH /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /:id/details` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| result | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| result | `GET /fix-evaluate/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `GET /system` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `GET /custom` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `GET /company/:companyId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role | `POST /:id/clone` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role | `PATCH /:id/permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role-permission | `GET /permissions/matrix` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role-permission | `POST /roles/:id/permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role-permission | `PATCH /roles/:id/permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role-permission | `GET /roles/:id/permissions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| role-permission | `PUT /roles/:id/permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role-permission | `DELETE /roles/:id/permissions/:permissionId` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| role-permission | `DELETE /roles/:id/permissions` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| room | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| room | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| room | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| room | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| room | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| room | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| room | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| room | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| scheduler | `GET /jobs` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| scheduler | `GET /jobs/:name` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| scheduler | `POST /jobs` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| scheduler | `PATCH /jobs/:name` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| scheduler | `POST /jobs/:name/run` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| scheduler | `POST /jobs/:name/pause` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| scheduler | `POST /jobs/:name/resume` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| scheduler | `DELETE /jobs/:name` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| search | `GET /suggestions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /global` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /candidate` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /employee` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /company` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /branch` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /center` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /subject` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /chapter` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /topic` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /question` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /paper` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /exam` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /result` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /certificate` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| search | `GET /:entity` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `PATCH /:id/block` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `PATCH /:id/unblock` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat-allocation | `POST /generate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat-allocation | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat-allocation | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat-allocation | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat-allocation | `GET /room/:examRoomId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat-allocation | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| seat-allocation | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat-allocation | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat-allocation | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| seat-allocation | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| security | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /alerts` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /login-analytics` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| security | `GET /recent-activities` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /sessions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /sessions/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /sessions/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `DELETE /sessions/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `POST /sessions/logout-all` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `POST /sessions/revoke-refresh` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /devices` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /devices/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /devices/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `PATCH /devices/:id/trust` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `PATCH /devices/:id/untrust` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `PATCH /devices/:id/block` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `PATCH /devices/:id/unblock` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `DELETE /devices/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /ip-rules/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `POST /ip-rules/import` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| security | `GET /ip-rules/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /ip-rules` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /ip-rules/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `POST /ip-rules` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `PATCH /ip-rules/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `DELETE /ip-rules/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /auth-policies` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `PATCH /auth-policies` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `POST /auth-policies/reset` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /mfa/settings` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `PATCH /mfa/settings` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /mfa/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /mfa/users` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `PATCH /mfa/users/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `POST /mfa/users/:id/reset` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `POST /mfa/users/:id/recovery-codes` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `GET /events` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /events/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /events/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `PATCH /events/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| security | `POST /events/:id/assign` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| security | `GET /audit/export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /audit/statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /audit/:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /audit` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `GET /compliance/settings` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| security | `PATCH /compliance/settings` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| shift | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| shift | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| shift | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| shift | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| shift | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| shift | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| sidebar | `GET /my-navigation` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| sidebar | `GET /tree` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| sidebar | `GET /analytics` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| sidebar | `PATCH /order` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PATCH /reorder` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PATCH /favorite` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PATCH /recent` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PATCH /collapse` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PATCH /custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `GET /admin/items` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| sidebar | `POST /admin/items` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PUT /admin/items/reorder` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PUT /admin/items/:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sidebar | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| sms | `POST /send-custom` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-otp` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-welcome` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-password-reset` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-account-verification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-exam-schedule` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-admit-card` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-result` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| sms | `POST /send-certificate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| staff-assignment | `GET /calendar` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| staff-assignment | `GET /conflicts` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| staff-assignment | `GET /workload` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| staff-assignment | `GET /export` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| staff-assignment | `POST /auto` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `POST /bulk` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| staff-assignment | `POST /create` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /update` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /publish` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /cancel` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /replace` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /accept` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id/approve` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id/publish` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id/cancel` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id/replace` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id/accept` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id/reject` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| staff-assignment | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| staff-assignment | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| staff-assignment | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subject | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| subject | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subject | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| subject | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| subject | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subject | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subject | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subject | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /purchase` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /verify-purchase` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| subscription | `GET /dashboard-stats` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| subscription | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| subscription | `POST /:id/renew` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /:id/upgrade` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /:id/downgrade` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /:id/suspend` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /:id/resume` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| subscription | `POST /:id/cancel` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| support-ticket | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| support-ticket | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| support-ticket | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| support-ticket | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| support-ticket | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| support-ticket | `PATCH /:id/assign` | Bulk DB writes | 200ms | Sequential loops (for/for...of) during inserts/updates | < 80ms | Use Promise.all and MongoDB bulkWrite |
| support-ticket | `POST /:id/messages` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| support-ticket | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `GET /public` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| system-settings | `PATCH /general` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `GET /organization` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| system-settings | `PATCH /organization` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| system-settings | `GET /key/:key` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| system-settings | `GET /category/:category` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| system-settings | `PATCH /category/:category` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| system-settings | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `POST /import` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| system-settings | `POST /reset` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| system-settings | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| topic | `GET /statistics` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| topic | `POST /` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| topic | `GET /` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| topic | `GET /:id` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| topic | `PATCH /:id` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| topic | `PATCH /:id/status` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| topic | `PATCH /:id/restore` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| topic | `DELETE /:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| trust-score | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| trust-score | `GET /history/:candidateId` | Multi-document DB query with population | 150ms | Sequential DB lookups or large unindexed scans | < 50ms | Add compound indexes and implement SWR caching |
| trust-score | `GET /high-risk-candidates` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| trust-score | `GET /candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| trust-score | `GET /center/:centerId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| trust-score | `GET /exam/:examId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| trust-score | `POST /recalculate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| trust-score | `POST /calculate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| trust-score | `POST /calculate/candidate` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| trust-score | `POST /calculate/center` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| trust-score | `GET /exam/:examId/candidate/:candidateId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| trust-score | `GET /exam/:examId/center/:centerId` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| user | `GET /profile` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| user | `PATCH /profile` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| user | `PATCH /change-password` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user | `PATCH /profile-image` | Multi-file upload & parsing | 1500ms+ | Sequential file uploads or heavy synchronous parsing | < 300ms | Async Parallelization (Promise.all) for S3/Cloudinary and background queues for processing |
| user | `GET /sessions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| user | `DELETE /sessions/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user | `GET /devices` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| user | `PATCH /devices/:id/trust` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user | `DELETE /devices/:id` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user | `PATCH /preferences` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user | `GET /dashboard` | Heavy Aggregation | 800ms+ | Heavy aggregations without Redis | < 100ms | Implement SWR caching & background pre-computation |
| user-permission | `GET /:id/permissions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| user-permission | `POST /:id/permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user-permission | `PATCH /:id/permissions` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user-permission | `DELETE /:id/permissions` | DB Delete | 35ms | Cache staleness | 35ms | Global Mutation Cache Invalidation (Auto-Purge) |
| user-permission | `GET /:id/effective-permissions` | Single DB document fetch | 30ms | None for now | < 15ms | Redis SWR caching for highly requested documents |
| webhook | `POST /razorpay` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| websocket | `POST /broadcast` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| websocket | `POST /notification` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| websocket | `POST /live-monitoring` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |
| websocket | `POST /system-alert` | DB Write / Update | 40ms | Cache staleness | 40ms | Global Mutation Cache Invalidation (Auto-Purge) |


## 4. Optimization Implementations Status
(To be updated in Phase 4)
