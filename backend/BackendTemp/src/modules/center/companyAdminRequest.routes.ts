import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";
import {
  createAdminRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getRequestById,
  uploadRequestDocuments,
  approveRequestDocument,
  rejectRequestDocument,
  approveFullRequest,
  rejectFullRequest,
  findExistingCenter,
} from "./companyAdminRequest.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| Detection: Check if a center already exists before creating
| GET /api/v1/centers/admin-requests/find-existing
|--------------------------------------------------------------------------
*/
router.get(
  "/find-existing",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  findExistingCenter
);

/*
|--------------------------------------------------------------------------
| Company Admin: Create a new request to an existing center
| POST /api/v1/centers/admin-requests
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  createAdminRequest
);

/*
|--------------------------------------------------------------------------
| Center Manager: Get all incoming requests for their center
| GET /api/v1/centers/admin-requests/incoming
|--------------------------------------------------------------------------
*/
router.get(
  "/incoming",
  authenticate,
  authorize(UserRole.CENTER_MANAGER),
  getIncomingRequests
);

/*
|--------------------------------------------------------------------------
| Company Admin: Get all outgoing requests sent by their company
| GET /api/v1/centers/admin-requests/outgoing
|--------------------------------------------------------------------------
*/
router.get(
  "/outgoing",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getOutgoingRequests
);

/*
|--------------------------------------------------------------------------
| Get a single request by ID (shared - center manager or company admin)
| GET /api/v1/centers/admin-requests/:id
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.CENTER_MANAGER),
  getRequestById
);

/*
|--------------------------------------------------------------------------
| Center Manager: Upload documents for the request
| PUT /api/v1/centers/admin-requests/:id/upload-documents
|--------------------------------------------------------------------------
*/
router.put(
  "/:id/upload-documents",
  authenticate,
  authorize(UserRole.CENTER_MANAGER),
  uploadRequestDocuments
);

/*
|--------------------------------------------------------------------------
| Company Admin: Approve a single document
| PATCH /api/v1/centers/admin-requests/:id/documents/:docId/approve
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/documents/:docId/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  approveRequestDocument
);

/*
|--------------------------------------------------------------------------
| Company Admin: Reject a single document
| PATCH /api/v1/centers/admin-requests/:id/documents/:docId/reject
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/documents/:docId/reject",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  rejectRequestDocument
);

/*
|--------------------------------------------------------------------------
| Company Admin: Approve the full request (all docs verified)
| PATCH /api/v1/centers/admin-requests/:id/approve
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  approveFullRequest
);

/*
|--------------------------------------------------------------------------
| Company Admin: Reject the full request permanently
| PATCH /api/v1/centers/admin-requests/:id/reject
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/reject",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  rejectFullRequest
);

export default router;
