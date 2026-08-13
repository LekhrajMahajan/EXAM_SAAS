import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

export interface ApprovalRouteRoles {
  submit?: UserRole[];
  review?: UserRole[];
  approve?: UserRole[];
  reject?: UserRole[];
  publish?: UserRole[];
}

export function createApprovalRoutes(controller: any, roles?: ApprovalRouteRoles) {
  const router = Router();

  const defaultRoles = [
    UserRole.MASTER_ADMIN,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
  ];

  if (controller.submit) {
    router.patch(
      "/:id/submit",
      authenticate,
      authorize(...(roles?.submit || defaultRoles)),
      controller.submit
    );
  }

  if (controller.review) {
    router.patch(
      "/:id/review",
      authenticate,
      authorize(...(roles?.review || defaultRoles)),
      controller.review
    );
  }

  if (controller.approve) {
    router.patch(
      "/:id/approve",
      authenticate,
      authorize(...(roles?.approve || defaultRoles)),
      controller.approve
    );
  }

  if (controller.reject) {
    router.patch(
      "/:id/reject",
      authenticate,
      authorize(...(roles?.reject || defaultRoles)),
      controller.reject
    );
  }

  if (controller.publish) {
    router.patch(
      "/:id/publish",
      authenticate,
      authorize(...(roles?.publish || defaultRoles)),
      controller.publish
    );
  }

  return router;
}
