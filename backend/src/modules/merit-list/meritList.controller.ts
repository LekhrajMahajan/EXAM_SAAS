import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import meritListService from "./meritList.service";

/*
|--------------------------------------------------------------------------
| Create Merit List
|--------------------------------------------------------------------------
*/

export const createMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.create(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Merit list created successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Merit List
|--------------------------------------------------------------------------
*/

export const generateMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.generate(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list generated successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Publish Merit List
|--------------------------------------------------------------------------
*/

export const publishMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const publishedBy = req.user!.userId as string;

    const merit = await meritListService.publish(id, publishedBy);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list published successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Unpublish Merit List
|--------------------------------------------------------------------------
*/

export const unpublishMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.unpublish(req.params.id as string);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list unpublished successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Lock Merit List
|--------------------------------------------------------------------------
*/

export const lockMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const lockedBy = req.user!.userId as string;

    const merit = await meritListService.lock(id, lockedBy);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list locked successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Unlock Merit List
|--------------------------------------------------------------------------
*/

export const unlockMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.unlock(req.params.id as string);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list unlocked successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Regenerate Merit List
|--------------------------------------------------------------------------
*/

export const regenerateMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const examId = (req.body.examId || req.query.examId) as string;

    const merit = await meritListService.regenerate(examId);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list regenerated successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Archive Merit List
|--------------------------------------------------------------------------
*/

export const archiveMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.archive(req.params.id as string);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list archived successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Cancel Merit List
|--------------------------------------------------------------------------
*/

export const cancelMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.cancel(
      req.params.id as string,
      req.body.remarks as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list cancelled successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Merit List By Id
|--------------------------------------------------------------------------
*/

export const getMeritListById = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.getById(req.params.id as string);

    return sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list fetched successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Candidate Merit List
|--------------------------------------------------------------------------
*/

export const getCandidateMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.getByCandidate(
      req.params.candidateId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Candidate merit list fetched successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Exam Merit List
|--------------------------------------------------------------------------
*/

export const getExamMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.getByExam(req.params.examId as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam merit list fetched successfully.",
      data: merit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Merit Lists
|--------------------------------------------------------------------------
*/

export const getMeritLists = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await meritListService.getAll(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit lists fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Top 10
|--------------------------------------------------------------------------
*/

export const top10 = asyncHandler(async (req: Request, res: Response) => {
  const merit = await meritListService.top10(req.query.examId as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Top 10 candidates fetched successfully.",
    data: merit,
  });
});

/*
|--------------------------------------------------------------------------
| Top 100
|--------------------------------------------------------------------------
*/

export const top100 = asyncHandler(async (req: Request, res: Response) => {
  const merit = await meritListService.top100(req.query.examId as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Top 100 candidates fetched successfully.",
    data: merit,
  });
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashData = await meritListService.dashboard(
    req.query.examId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Merit dashboard fetched successfully.",
    data: dashData,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const stats = await meritListService.statistics(
    req.query.examId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Merit statistics fetched successfully.",
    data: stats,
  });
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const softDeleteMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await meritListService.delete(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreMeritList = asyncHandler(
  async (req: Request, res: Response) => {
    const merit = await meritListService.restore(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list restored successfully.",
      data: merit,
    });
  },
);
