# Global Dynamic System Integration Prompt

## Purpose

This document is a mandatory global instruction that must be included
with every Company Admin implementation prompt. It ensures every new
feature is production-ready, fully dynamic, and integrated with the
existing ExamGuard Pro Enterprise architecture.

------------------------------------------------------------------------

# Global Dynamic System Integration (Mandatory)

This instruction is mandatory for every Company Admin feature, module,
page, API, component, dashboard, report, workflow, and setting you
create.

Do NOT create standalone or isolated implementations.

Every feature must be fully integrated with the existing ExamGuard Pro
Enterprise architecture.

## Dynamic Implementation Rules

-   Read the complete existing frontend and backend before making
    changes.
-   Reuse existing architecture, services, repositories, models,
    validators, middleware, hooks, components, layouts, utilities and
    APIs.
-   Never create duplicate business logic.
-   Never create duplicate APIs.
-   Never hardcode data, IDs, permissions, plans, menus, widgets,
    feature visibility or limits.
-   Everything must come dynamically from the database and existing
    services.

## Dynamic Connections

Automatically integrate with: - Authentication - Authorization (RBAC) -
Company - Company Approval - Plans - Subscriptions - Payments -
Invoices - Email Service - Notifications - Activity Logs - Audit Logs -
Reports - Dashboard - Profile - Security - System Settings - Feature
Flags - Sidebar Navigation - Search - Filters - Pagination - Export /
Import - File Storage - Media Upload - Socket Events

## Role Based Access

Respect existing RBAC for every page, API, button, form, action and
menu.

## Subscription Based Access

Everything must be dynamically controlled by the active subscription
plan.

No hardcoded feature visibility.

## Master Admin Synchronization

Any configuration changed by Master Admin must automatically reflect
inside Company Admin.

## Database

-   Reuse existing collections.
-   Avoid duplicate data.
-   Maintain relationships.

## Backend Architecture

Controller ↓ Service ↓ Repository ↓ Database

Cross-module communication must happen through Services only.

## Validation

Apply frontend, backend, API, business, permission and subscription
validation.

## Audit

Automatically generate Activity Logs, Audit Logs and Notifications where
applicable.

## Real-Time

Automatically update dashboards, reports, counters, charts and widgets
when related data changes.

## Output

Provide: 1. Files Created 2. Files Modified 3. APIs Used 4. APIs Added
5. Database Changes 6. Dynamic Integrations Completed 7. Connected
Modules 8. Remaining Work

## Final Rules

-   Do not break existing functionality.
-   Do not modify unrelated modules.
-   Do not change UI unless required.
-   Deliver production-ready enterprise-quality code with fully dynamic
    behaviour.
