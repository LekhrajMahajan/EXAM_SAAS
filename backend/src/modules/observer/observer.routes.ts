import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  assignObserver,
  getObservers,
  getObserverById,
  checkIn,
  checkOut,
  createIncident,
  updateIncident,
  getIncidents,
  getDashboard,
  getLiveObservers,
} from "./observer.controller";

import {
  assignObserverSchema,
  observerIdSchema,
  checkInSchema,
  checkOutSchema,
  createIncidentSchema,
  updateIncidentSchema,
  dashboardSchema,
  liveObserverSchema,
} from "./observer.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(dashboardSchema),

  getDashboard,
);

/*
|--------------------------------------------------------------------------
| Live Observers
|--------------------------------------------------------------------------
*/

router.get(
  "/live",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(liveObserverSchema),

  getLiveObservers,
);

/*
|--------------------------------------------------------------------------
| Assign Observer
|--------------------------------------------------------------------------
*/

router.post(
  "/assign",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(assignObserverSchema),

  assignObserver,
);

/*
|--------------------------------------------------------------------------
| Observer List
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.OBSERVER,
  ),

  getObservers,
);

/*
|--------------------------------------------------------------------------
| Observer Details
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",

  authenticate,

  validateRequest(observerIdSchema),

  getObserverById,
);

/*
|--------------------------------------------------------------------------
| Check In
|--------------------------------------------------------------------------
*/

router.patch(
  "/check-in",

  authenticate,

  authorize(UserRole.OBSERVER),

  validateRequest(checkInSchema),

  checkIn,
);

/*
|--------------------------------------------------------------------------
| Check Out
|--------------------------------------------------------------------------
*/

router.patch(
  "/check-out",

  authenticate,

  authorize(UserRole.OBSERVER),

  validateRequest(checkOutSchema),

  checkOut,
);

/*
|--------------------------------------------------------------------------
| Incident Report
|--------------------------------------------------------------------------
*/

router.post(
  "/incidents",

  authenticate,

  authorize(
    UserRole.OBSERVER,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(createIncidentSchema),

  createIncident,
);

router.patch(
  "/incidents/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(updateIncidentSchema),

  updateIncident,
);

router.get(
  "/incidents",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.OBSERVER,
  ),

  getIncidents,
);

export default router;
