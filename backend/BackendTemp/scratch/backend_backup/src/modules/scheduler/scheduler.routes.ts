import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  getSchedulerJobs,
  getSchedulerJob,
  createSchedulerJob,
  updateSchedulerJob,
  runSchedulerJob,
  pauseSchedulerJob,
  resumeSchedulerJob,
  deleteSchedulerJob,
} from "./scheduler.controller";

import {
  createSchedulerSchema,
  updateSchedulerSchema,
  schedulerNameSchema,
  runSchedulerSchema,
  pauseSchedulerSchema,
  resumeSchedulerSchema,
  deleteSchedulerSchema,
} from "./scheduler.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Scheduler Jobs
|--------------------------------------------------------------------------
*/

router.get(
  "/jobs",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSchedulerJobs,
);

router.get(
  "/jobs/:name",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(schedulerNameSchema),

  getSchedulerJob,
);

router.post(
  "/jobs",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(createSchedulerSchema),

  createSchedulerJob,
);

router.patch(
  "/jobs/:name",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(updateSchedulerSchema),

  updateSchedulerJob,
);

router.post(
  "/jobs/:name/run",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(runSchedulerSchema),

  runSchedulerJob,
);

router.post(
  "/jobs/:name/pause",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(pauseSchedulerSchema),

  pauseSchedulerJob,
);

router.post(
  "/jobs/:name/resume",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(resumeSchedulerSchema),

  resumeSchedulerJob,
);

router.delete(
  "/jobs/:name",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(deleteSchedulerSchema),

  deleteSchedulerJob,
);

export default router;
