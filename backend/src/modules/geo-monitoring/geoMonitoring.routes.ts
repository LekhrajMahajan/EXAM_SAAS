import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  recordLocation,
  getLatestLocation,
  getAllLatestLocations,
} from "./geoMonitoring.controller";
import {
  recordLocationSchema,
  getLatestLocationSchema,
  getAllLatestLocationsSchema,
} from "./geoMonitoring.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(recordLocationSchema),
  recordLocation
);

router.get(
  "/exam/:examId/entity/:entityId",
  authenticate,
  validate(getLatestLocationSchema),
  getLatestLocation
);

router.get(
  "/exam/:examId",
  authenticate,
  validate(getAllLatestLocationsSchema),
  getAllLatestLocations
);

export default router;
