import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import meritListService from "./meritList.service";
import MeritList from "./meritList.model";


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
| Bulk Create Merit List From Results
|--------------------------------------------------------------------------
*/

export const bulkCreateMeritListFromResults = asyncHandler(
  async (req: Request, res: Response) => {
    const examId = req.body.examId as string;
    const generatedBy = req.user!.userId as string;

    const result = await meritListService.bulkCreateFromResults(examId, generatedBy);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit list generated from results successfully.",
      data: result,
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
    const examId = (req.params.id || req.body.examId || req.query.examId) as string;
    const userId = req.user?.userId;

    const merit = await meritListService.regenerate(examId, userId);

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
    const id = req.params.id as string;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {
        success: false,
        message: "Invalid merit list ID.",
      });
    }

    const merit = await MeritList.findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'examId',
        select: 'examTitle examCode rankType normalizationEnabled',
      })
      .populate({
        path: 'resultId',
        select: 'passStatus resultStatus marksObtained totalMarks percentage correctAnswers wrongAnswers negativeMarks subjectWiseBreakdown partWiseBreakdown attemptedQuestions totalQuestions',
      })
      .populate('certificateId')
      .lean();

    if (!merit) {
      return sendResponse(res, httpStatus.NOT_FOUND, {
        success: false,
        message: "Merit list record not found.",
      });
    }

    // Manual population of candidateId
    const ImportCandidate = mongoose.models.ImportCandidate || mongoose.model("ImportCandidate", new mongoose.Schema({}, { strict: false, collection: 'importcandidate' }));
    const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", new mongoose.Schema({}, { strict: false, collection: 'candidates' }));
    
    const candId = merit.candidateId;
    if (candId) {
      let cand = await Candidate.findById(candId).lean();
      if (!cand) cand = await ImportCandidate.findById(candId).lean();
      
      if (cand) {
        (merit as any).candidateId = cand;
        (merit as any).candidateName = (cand as any).fullName || (cand as any).firstName || (cand as any).candidateFullName || (cand as any).name || 'Unknown Candidate';
        (merit as any).applicationNumber = (cand as any).applicationNo || (cand as any).applicationNumber || (cand as any).enrollmentNo || '-';
      }
    }

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
    const examId = req.params.examId as string;

    const rawMerits = await MeritList.find({ examId, isDeleted: { $ne: true } })
      .sort({ overallRank: 1 })
      .populate({
        path: 'examId',
        select: 'examTitle examCode rankType normalizationEnabled',
      })
      .populate({
        path: 'resultId',
        select: 'passStatus resultStatus marksObtained totalMarks percentage correctAnswers wrongAnswers negativeMarks subjectWiseBreakdown partWiseBreakdown attemptedQuestions totalQuestions',
      })
      .lean();

    const ImportCandidate = mongoose.models.ImportCandidate || mongoose.model("ImportCandidate", new mongoose.Schema({}, { strict: false, collection: 'importcandidate' }));
    const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", new mongoose.Schema({}, { strict: false, collection: 'candidates' }));
    
    const merits = await Promise.all(rawMerits.map(async (m: any) => {
        const candId = m.candidateId?._id || m.candidateId;
        if (candId) {
            let cand = await Candidate.findById(candId).lean();
            if (!cand) cand = await ImportCandidate.findById(candId).lean();
            
            if (cand) {
                m.candidateId = cand;
                m.candidateName = cand.fullName || cand.firstName || cand.candidateFullName || cand.name || 'Unknown Candidate';
                m.applicationNumber = cand.applicationNo || cand.applicationNumber || cand.enrollmentNo || '-';
            }
        }
        return m;
    }));

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam merit list fetched successfully.",
      data: merits,
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (req.query.examId) filter.examId = req.query.examId;
    if (req.query.companyId) filter.companyId = req.query.companyId;
    if (req.query.meritStatus) filter.meritStatus = req.query.meritStatus;

    const [rawMeritLists, total] = await Promise.all([
      MeritList.find(filter)
        .sort({ overallRank: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'examId',
          select: 'examTitle examCode rankType normalizationEnabled',
        })
        .populate({
          path: 'resultId',
          select: 'passStatus resultStatus marksObtained totalMarks percentage correctAnswers wrongAnswers negativeMarks subjectWiseBreakdown attemptedQuestions totalQuestions',
        })
        .lean(),
      MeritList.countDocuments(filter),
    ]);

    const ImportCandidate = mongoose.models.ImportCandidate || mongoose.model("ImportCandidate", new mongoose.Schema({}, { strict: false, collection: 'importcandidate' }));
    const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", new mongoose.Schema({}, { strict: false, collection: 'candidates' }));
    
    const data = await Promise.all(rawMeritLists.map(async (m: any) => {
        const candId = m.candidateId;
        if (candId) {
            let cand = await Candidate.findById(candId).lean();
            if (!cand) cand = await ImportCandidate.findById(candId).lean();
            
            if (cand) {
                m.candidateId = cand;
                m.candidateName = cand.fullName || cand.firstName || cand.candidateFullName || cand.name || 'Unknown Candidate';
                m.applicationNumber = cand.applicationNo || cand.applicationNumber || cand.enrollmentNo || '-';
            }
        }
        return m;
    }));

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Merit lists fetched successfully.",
      data: {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
