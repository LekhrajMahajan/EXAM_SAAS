import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendResponse } from '../../utils/response';
import HTTP_STATUS from 'http-status';
import { asyncHandler } from '../../utils/asyncHandler';

export const getTestDbData = asyncHandler(async (req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) {
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, { success: false, message: 'DB not connected' });
  }

  const appNo = req.query.applicationNo || 'UPSC-2026-ECANDIDATE-002';
  
  const cands = await db.collection('importcandidates').find({ applicationNo: { $regex: appNo, $options: 'i' } }).toArray();
  const nativeCands = await db.collection('candidates').find({ applicationNo: { $regex: appNo, $options: 'i' } }).toArray();
  const allCands = [...cands, ...nativeCands];
  
  // Try exactly what login tries
  const examId = "6aabe8da696de247aaf02f70";
  
  const results = [];
  
  for (let cand of allCands) {
    const checkCandidateId = cand.candidateId ? cand.candidateId : cand._id;
    const existingSubmission = await db.collection('candidateexamanswer').findOne({ 
      $or: [
        { candidateId: cand._id, examId: new mongoose.Types.ObjectId(examId) },
        { candidateId: checkCandidateId, examId: new mongoose.Types.ObjectId(examId) },
        { candidateId: cand._id.toString(), examId: examId },
        { applicationNo: cand.applicationNo, examId: new mongoose.Types.ObjectId(examId) },
        { applicationNo: cand.applicationNo, examId: examId }
      ]
    });
    
    results.push({
      candId: cand._id,
      checkCandidateId,
      foundSubmission: !!existingSubmission,
      submission: existingSubmission
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Test DB queried successfully.",
    data: {
      candidates: allCands,
      results
    }
  });
});
