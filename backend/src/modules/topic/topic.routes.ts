import { Router } from "express";

import {
  createTopic,
  getTopics,
  getTopicById,
  updateTopic,
  updateTopicStatus,
  deleteTopic,
  restoreTopic,
  getTopicStatistics,
} from "./topic.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createTopicSchema,
  updateTopicSchema,
  updateTopicStatusSchema,
} from "./topic.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getTopicStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Topic
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(createTopicSchema),
  createTopic,
);

/*
|--------------------------------------------------------------------------
| Get All Topics
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.QUESTION_SETTER,
    UserRole.PAPER_SETTER,
  ),
  getTopics,
);

/*
|--------------------------------------------------------------------------
| Get Topic By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.QUESTION_SETTER,
    UserRole.PAPER_SETTER,
  ),
  getTopicById,
);

/*
|--------------------------------------------------------------------------
| Update Topic
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateTopicSchema),
  updateTopic,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateTopicStatusSchema),
  updateTopicStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Topic
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  restoreTopic,
);

/*
|--------------------------------------------------------------------------
| Delete Topic
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  deleteTopic,
);

export default router;
