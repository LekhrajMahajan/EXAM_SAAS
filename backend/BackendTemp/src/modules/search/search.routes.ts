import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { validate as validateRequest } from "../../middleware/validate";

import {
  globalSearch,
  searchByEntity,
  getSuggestions,
} from "./search.controller";

import {
  globalSearchSchema,
  searchSuggestionSchema,
  candidateSearchSchema,
  employeeSearchSchema,
  companySearchSchema,
  branchSearchSchema,
  centerSearchSchema,
  subjectSearchSchema,
  chapterSearchSchema,
  topicSearchSchema,
  questionSearchSchema,
  paperSearchSchema,
  examSearchSchema,
  resultSearchSchema,
  certificateSearchSchema,
} from "./search.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Search Suggestions
|--------------------------------------------------------------------------
*/

router.get(
  "/suggestions",
  authenticate,
  validateRequest(searchSuggestionSchema),
  getSuggestions,
);

/*
|--------------------------------------------------------------------------
| Global Search
|--------------------------------------------------------------------------
*/

router.get(
  "/global",
  authenticate,
  validateRequest(globalSearchSchema),
  globalSearch,
);

/*
|--------------------------------------------------------------------------
| Entity-Specific Search
|--------------------------------------------------------------------------
*/

// For individual entities, since they share similar query structures but might diverge later,
// we could either route them individually or have a single dynamic route.
// Based on the validation file, we have specific schemas for each, so let's map them.

router.get(
  "/candidate",
  authenticate,
  validateRequest(candidateSearchSchema),
  (req, res, next) => { req.params.entity = "CANDIDATE"; next(); },
  searchByEntity,
);

router.get(
  "/employee",
  authenticate,
  validateRequest(employeeSearchSchema),
  (req, res, next) => { req.params.entity = "EMPLOYEE"; next(); },
  searchByEntity,
);

router.get(
  "/company",
  authenticate,
  validateRequest(companySearchSchema),
  (req, res, next) => { req.params.entity = "COMPANY"; next(); },
  searchByEntity,
);

router.get(
  "/branch",
  authenticate,
  validateRequest(branchSearchSchema),
  (req, res, next) => { req.params.entity = "BRANCH"; next(); },
  searchByEntity,
);

router.get(
  "/center",
  authenticate,
  validateRequest(centerSearchSchema),
  (req, res, next) => { req.params.entity = "CENTER"; next(); },
  searchByEntity,
);

router.get(
  "/subject",
  authenticate,
  validateRequest(subjectSearchSchema),
  (req, res, next) => { req.params.entity = "SUBJECT"; next(); },
  searchByEntity,
);

router.get(
  "/chapter",
  authenticate,
  validateRequest(chapterSearchSchema),
  (req, res, next) => { req.params.entity = "CHAPTER"; next(); },
  searchByEntity,
);

router.get(
  "/topic",
  authenticate,
  validateRequest(topicSearchSchema),
  (req, res, next) => { req.params.entity = "TOPIC"; next(); },
  searchByEntity,
);

router.get(
  "/question",
  authenticate,
  validateRequest(questionSearchSchema),
  (req, res, next) => { req.params.entity = "QUESTION"; next(); },
  searchByEntity,
);

router.get(
  "/paper",
  authenticate,
  validateRequest(paperSearchSchema),
  (req, res, next) => { req.params.entity = "PAPER"; next(); },
  searchByEntity,
);

router.get(
  "/exam",
  authenticate,
  validateRequest(examSearchSchema),
  (req, res, next) => { req.params.entity = "EXAM"; next(); },
  searchByEntity,
);

router.get(
  "/result",
  authenticate,
  validateRequest(resultSearchSchema),
  (req, res, next) => { req.params.entity = "RESULT"; next(); },
  searchByEntity,
);

router.get(
  "/certificate",
  authenticate,
  validateRequest(certificateSearchSchema),
  (req, res, next) => { req.params.entity = "CERTIFICATE"; next(); },
  searchByEntity,
);

// Fallback dynamic route if needed, though explicit is better
router.get(
  "/:entity",
  authenticate,
  // We can't easily validate against all schemas here without custom middleware, 
  // but explicit routes above handle the primary use cases.
  searchByEntity,
);

export default router;
