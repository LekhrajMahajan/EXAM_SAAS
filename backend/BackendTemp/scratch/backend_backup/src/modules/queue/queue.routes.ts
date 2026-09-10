import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  addJob,
  addEmailJob,
  addPdfJob,
  addReportJob,
  getJob,
  getJobs,
  retryJob,
  removeJob,
  pauseQueue,
  resumeQueue,
  cleanQueue,
} from "./queue.controller";

import {
  createJobSchema,
  emailJobSchema,
  pdfJobSchema,
  reportJobSchema,
  jobIdSchema,
  retryJobSchema,
  removeJobSchema,
} from "./queue.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Jobs
|--------------------------------------------------------------------------
*/

router.post(
  "/job",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(createJobSchema),

  addJob,
);

router.post(
  "/email",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(emailJobSchema),

  addEmailJob,
);

router.post(
  "/pdf",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(pdfJobSchema),

  addPdfJob,
);

router.post(
  "/report",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(reportJobSchema),

  addReportJob,
);

/*
|--------------------------------------------------------------------------
| Get Jobs
|--------------------------------------------------------------------------
*/

router.get(
  "/jobs",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getJobs,
);

router.get(
  "/job/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(jobIdSchema),

  getJob,
);

/*
|--------------------------------------------------------------------------
| Job Actions
|--------------------------------------------------------------------------
*/

router.post(
  "/job/:id/retry",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(retryJobSchema),

  retryJob,
);

router.delete(
  "/job/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(removeJobSchema),

  removeJob,
);

/*
|--------------------------------------------------------------------------
| Queue Management
|--------------------------------------------------------------------------
*/

router.post(
  "/pause",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  pauseQueue,
);

router.post(
  "/resume",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  resumeQueue,
);

router.delete(
  "/clean",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  cleanQueue,
);

export default router;
