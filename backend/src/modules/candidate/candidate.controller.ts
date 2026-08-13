import { Request, Response } from "express";

import candidateService from "./candidate.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Candidate
|--------------------------------------------------------------------------
*/

export const createCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Candidate created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Candidates
|--------------------------------------------------------------------------
*/

export const getCandidates = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      companyId: req.query.companyId as string,
      branchId: req.query.branchId as string,
      centerId: req.query.centerId as string,
      examId: req.query.examId as string,
      seatId: req.query.seatId as string,
      gender: req.query.gender as string,
      category: req.query.category as string,
      status: req.query.status as string,
      biometricVerified:
        req.query.biometricVerified !== undefined
          ? req.query.biometricVerified === "true"
          : undefined,
      faceVerified:
        req.query.faceVerified !== undefined
          ? req.query.faceVerified === "true"
          : undefined,
      hallTicketGenerated:
        req.query.hallTicketGenerated !== undefined
          ? req.query.hallTicketGenerated === "true"
          : undefined,
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidates fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Candidate By Id
|--------------------------------------------------------------------------
*/

export const getCandidateById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Candidate
|--------------------------------------------------------------------------
*/

export const updateCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Candidate Status
|--------------------------------------------------------------------------
*/

export const updateCandidateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Assign Seat
|--------------------------------------------------------------------------
*/

export const assignSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await candidateService.assignSeat(
    req.params.id as string,
    req.body.seatId,
    req.body.examId,
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat assigned successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Remove Seat
|--------------------------------------------------------------------------
*/

export const removeSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await candidateService.removeSeat(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat removed successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Verify Candidate
|--------------------------------------------------------------------------
*/

export const verifyCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.verify(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate verified successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Hall Ticket
|--------------------------------------------------------------------------
*/

export const generateHallTicket = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.generateHallTicket(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Hall ticket generated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Candidate
|--------------------------------------------------------------------------
*/

export const deleteCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Candidate
|--------------------------------------------------------------------------
*/

export const restoreCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Statistics
|--------------------------------------------------------------------------
*/

export const getCandidateStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateService.statistics(
      req.query.companyId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate statistics fetched successfully.",
      data: result,
    });
  },
);
