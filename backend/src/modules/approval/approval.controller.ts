import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { ApprovalService } from "./approval.service";

export function createApprovalController(service: ApprovalService<any>, entityName: string) {
  return {
    submit: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.submit(req.params.id as string);
      return sendResponse(res, HTTP_STATUS.OK, {
        success: true,
        message: `${entityName} submitted successfully.`,
        data: result,
      });
    }),

    review: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.review(req.params.id as string);
      return sendResponse(res, HTTP_STATUS.OK, {
        success: true,
        message: `${entityName} reviewed successfully.`,
        data: result,
      });
    }),

    approve: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.approve(req.params.id as string);
      return sendResponse(res, HTTP_STATUS.OK, {
        success: true,
        message: `${entityName} approved successfully.`,
        data: result,
      });
    }),

    publish: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.publish(req.params.id as string);
      return sendResponse(res, HTTP_STATUS.OK, {
        success: true,
        message: `${entityName} published successfully.`,
        data: result,
      });
    }),

    reject: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.reject(req.params.id as string, req.body.remarks || req.body.reason);
      return sendResponse(res, HTTP_STATUS.OK, {
        success: true,
        message: `${entityName} rejected successfully.`,
        data: result,
      });
    }),
  };
}
