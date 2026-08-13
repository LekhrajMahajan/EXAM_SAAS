import companyService from "../company/company.service";
import subjectService from "../subject/subject.service";

import paperRepository from "./paper.repository";
import paperQuestionRepository from "../paper-question/paperQuestion.repository";
import staffAssignmentRepository from "../staff-assignment/staffAssignment.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { IPaper, PaperApprovalStatus, PaperStatus } from "./paper.types";
import { BaseService } from "../../common/base.service";
import mongoose from "mongoose";
import Question from "../question-bank/question.model";
import PaperQuestion from "../paper-question/paperQuestion.model";
import Exam from "../exam/exam.model";
import User from "../user/user.model";
import Employee from "../employee/employee.model";
import { UserStatus } from "../user/user.types";
import { EmployeeStatus } from "../employee/employee.types";
import Paper from "./paper.model";

class PaperService extends BaseService<IPaper> {
  constructor() {
    super(paperRepository, "Paper");
  }
  /*
  |--------------------------------------------------------------------------
  | Create Paper
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IPaper>) {
    await companyService.getActiveById(payload.companyId!.toString());
    await subjectService.getActiveById(payload.subjectId!.toString());

    const existingCode = await paperRepository.findByPaperCode(
      payload.companyId!.toString(),
      payload.paperCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Paper code already exists.");
    }

    const existingName = await paperRepository.findByPaperName(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.paperName!,
    );

    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Paper name already exists.");
    }

    return await super.create(payload);
  }



  /*
  |--------------------------------------------------------------------------
  | Update Paper
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IPaper>) {
    const paper = await super.getById(id);

    if (paper.approvalStatus === PaperApprovalStatus.PUBLISHED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Published paper cannot be edited.",
      );
    }

    const companyId =
      (paper.companyId as any)._id?.toString() ?? paper.companyId.toString();

    const subjectId =
      (paper.subjectId as any)._id?.toString() ?? paper.subjectId.toString();

    if (payload.paperCode && payload.paperCode !== paper.paperCode) {
      const exists = await paperRepository.findByPaperCode(
        companyId,
        payload.paperCode,
      );

      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Paper code already exists.");
      }
    }

    if (payload.paperName && payload.paperName !== paper.paperName) {
      const exists = await paperRepository.findByPaperName(
        companyId,
        subjectId,
        payload.paperName,
      );

      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Paper name already exists.");
      }
    }

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Preview
  |--------------------------------------------------------------------------
  */

  async getPreview(id: string) {
    const paper = await Paper.findById(id).populate("examId");
    if (!paper) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Paper not found");

    const questions = await paperQuestionRepository.findByPaperId(id);

    return {
      paper,
      questions,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Clone Paper
  |--------------------------------------------------------------------------
  */

  async clone(
    id: string,
    payload: {
      paperName: string;
      paperCode: string;
      copyQuestions?: boolean;
      copyInstructions?: boolean;
      copySettings?: boolean;
      approvalStatus?: PaperApprovalStatus;
    },
  ) {
    const original = await paperRepository.findById(id);

    if (!original) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Original paper not found.");
    }

    const companyIdStr = (original.companyId as any)._id?.toString() || original.companyId.toString();
    const subjectIdStr = (original.subjectId as any)._id?.toString() || original.subjectId.toString();

    const existingCode = await paperRepository.findByPaperCode(
      companyIdStr,
      payload.paperCode,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Paper code already exists.");
    }

    const newPaperData: Partial<IPaper> = {
      companyId: companyIdStr as any,
      subjectId: subjectIdStr as any,
      paperName: payload.paperName,
      paperCode: payload.paperCode,
      description: original.description,
      
      // Settings
      duration: payload.copySettings ? original.duration : 60,
      totalQuestions: original.totalQuestions,
      totalMarks: original.totalMarks,
      passingMarks: payload.copySettings ? original.passingMarks : 0,
      negativeMarking: payload.copySettings ? original.negativeMarking : false,
      negativeMarks: payload.copySettings ? original.negativeMarks : 0,
      shuffleQuestions: payload.copySettings ? original.shuffleQuestions : false,
      shuffleOptions: payload.copySettings ? original.shuffleOptions : false,
      
      // Instructions
      instructions: payload.copyInstructions ? original.instructions : [],
      
      // Sections
      sections: original.sections.map(sec => ({
        sectionCode: sec.sectionCode,
        sectionName: sec.sectionName,
        instructions: payload.copyInstructions ? sec.instructions : "",
        totalQuestions: sec.totalQuestions,
        totalMarks: sec.totalMarks,
        optionalQuestions: sec.optionalQuestions,
        displayOrder: sec.displayOrder
      })),

      approvalStatus: payload.approvalStatus || PaperApprovalStatus.DRAFT,
      status: PaperStatus.INACTIVE,
    };

    const newPaper = await paperRepository.create(newPaperData);

    if (payload.copyQuestions) {
      const originalQuestions = await paperQuestionRepository.findByPaperId(id);
      
      if (originalQuestions.length > 0) {
        const clonedQuestions = originalQuestions.map((oq: any) => ({
          paperId: newPaper._id as any,
          questionId: oq.questionId._id || oq.questionId,
          sectionCode: oq.sectionCode,
          questionOrder: oq.questionOrder,
          displayOrder: oq.displayOrder,
          marks: oq.marks,
          negativeMarks: oq.negativeMarks,
          isCompulsory: oq.isCompulsory,
          status: oq.status,
        }));
        
        await paperQuestionRepository.bulkCreate(clonedQuestions);
      }
    }

    return newPaper;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: PaperStatus) {
    const paper = await super.getById(id);

    return await super.updateStatus(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Submit For Approval
  |--------------------------------------------------------------------------
  */

  async submitForApproval(
    id: string,
    payload: { approvalStatus?: string; submittedBy?: string; remarks?: string },
  ) {
    const paper = await super.getById(id);
    const status = (payload.approvalStatus as PaperApprovalStatus) || PaperApprovalStatus.SUBMITTED;

    // Disconnect Paper Setter
    if (paper.assignedTo) {
      const employee = await Employee.findById(paper.assignedTo);
      if (employee) {
        employee.status = EmployeeStatus.INACTIVE;
        await employee.save();

        if (employee.userId) {
          const authRepo = require("../auth/auth.repository").default;
          await authRepo.update(employee.userId.toString(), { status: "DISCONNECTED" } as any);
        }
      }
    }

    return await paperRepository.updateApproval(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Approve Paper
  |--------------------------------------------------------------------------
  */

  async approvePaper(
    id: string,
    payload: { approvalStatus?: string; approvedBy?: string; approvalRemarks?: string },
  ) {
    const paper = await super.getById(id);
    const status = (payload.approvalStatus as PaperApprovalStatus) || PaperApprovalStatus.APPROVED;

    return await paperRepository.updateApproval(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Reject Paper
  |--------------------------------------------------------------------------
  */

  async rejectPaper(
    id: string,
    payload: { approvalStatus?: string; rejectedBy?: string; rejectionReason?: string; rejectionRemarks?: string },
  ) {
    const paper = await super.getById(id);
    const status = (payload.approvalStatus as PaperApprovalStatus) || PaperApprovalStatus.REJECTED;

    return await paperRepository.updateApproval(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Approval
  |--------------------------------------------------------------------------
  */

  async updateApproval(id: string, approvalStatus: PaperApprovalStatus) {
    const paper = await super.getById(id);

    return await paperRepository.updateApproval(id, approvalStatus);
  }



  /*
  |--------------------------------------------------------------------------
  | Paper Question Management (Phase 6)
  |--------------------------------------------------------------------------
  */

  async addQuestion(paperId: string, payload: any) {
    const paper = await super.getById(paperId);
    
    // Validate options count (2, 4, or 5 only)
    const optionsCount = payload.options?.length || 0;
    if (![2, 4, 5].includes(optionsCount)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Questions must have exactly 2, 4, or 5 options.");
    }
    
    // Validate at least one correct option
    const hasCorrect = payload.options.some((o: any) => o.isCorrect === true);
    if (!hasCorrect) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Question must have a correct option selected.");
    }

    // Validation against Exam limits
    let targetLimit = paper.totalQuestions;
    if (paper.examId && payload.subjectName) {
      const exam = await Exam.findById(paper.examId);
      if (exam) {
        const subjectReq = exam.subjects?.find(s => s.name === payload.subjectName);
        if (subjectReq) {
          targetLimit = subjectReq.questions;
        }
      }
    }

    // Since questions are filtered by subjectName in Phase 6...
    // Count existing questions for this subject in the paper
    // We'll need to join Question to count properly, but for now we count based on what's in PaperQuestion joined with Question
    const existingPaperQuestions = await PaperQuestion.find({ paperId: paper._id, isDeleted: false }).populate("questionId");
    const existingSubjectQuestions = existingPaperQuestions.filter((pq: any) => pq.sectionCode?.toUpperCase() === payload.subjectName?.toUpperCase()); 
    // Ideally we'll add subjectName to Question schema if missing. But let's assume we count properly later.

    if (existingSubjectQuestions.length >= targetLimit) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Maximum question limit reached for subject ${payload.subjectName || ''}. Limit: ${targetLimit}`);
    }

    // Check for duplicate question
    const isDuplicate = existingPaperQuestions.some(
      (pq: any) => pq.questionId?.question?.trim().toLowerCase() === payload.question.trim().toLowerCase()
    );
    if (isDuplicate) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "This question already exists in the paper.");
    }

    try {
      // 1. Create Question
      const question = new Question({
        ...payload,
        companyId: paper.companyId,
        subjectId: paper.subjectId,
        questionCode: payload.questionCode || `Q${Math.floor(10000 + Math.random() * 90000)}`,
        createdBy: paper.assignedTo,
      });
      await question.save();

      // 2. Map to Paper
      const paperQuestion = new PaperQuestion({
        paperId: paper._id,
        questionId: question._id,
        sectionCode: payload.subjectName || "DEFAULT", // Using subject name as section for now
        questionOrder: existingSubjectQuestions.length + 1,
        displayOrder: existingSubjectQuestions.length + 1,
        marks: payload.marks || 1,
        negativeMarks: payload.negativeMarks || 0,
        createdBy: paper.assignedTo,
      });
      await paperQuestion.save();

      return { question, paperQuestion };
    } catch (error) {
      throw error;
    }
  }

  async addBulkQuestions(paperId: string, payload: { subjectName: string, questions: any[] }) {
    const paper = await super.getById(paperId);
    
    // Validate Exam limits
    let targetLimit = paper.totalQuestions;
    if (paper.examId && payload.subjectName) {
      const exam = await Exam.findById(paper.examId);
      if (exam) {
        const subjectReq = exam.subjects?.find(s => s.name === payload.subjectName);
        if (subjectReq) {
          targetLimit = subjectReq.questions;
        }
      }
    }

    const existingPaperQuestions = await PaperQuestion.find({ paperId: paper._id, isDeleted: false }).populate("questionId");
    const currentCount = existingPaperQuestions.filter((pq: any) => pq.sectionCode?.toUpperCase() === payload.subjectName?.toUpperCase()).length;
    
    const availableSlots = targetLimit - currentCount;
    if (availableSlots <= 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Subject limit of ${targetLimit} already reached.`);
    }

    try {
      let qOrder = currentCount + 1;
      const createdQuestions: any[] = [];
      const createdMappings: any[] = [];
      const warnings: string[] = [];

      for (const qPayload of payload.questions) {
        // Stop if we have successfully created enough valid questions to fill the quota
        if (createdQuestions.length >= availableSlots) {
          break;
        }

        // Validation
        const optionsCount = qPayload.options?.length || 0;
        if (![2, 4, 5].includes(optionsCount)) {
          warnings.push(`Question "${qPayload.question}" skipped: Must have exactly 2, 4, or 5 options.`);
          continue;
        }
        const hasCorrect = qPayload.options.some((o: any) => o.isCorrect === true);
        if (!hasCorrect) {
          warnings.push(`Question "${qPayload.question}" skipped: Must have a correct option selected.`);
          continue;
        }

        // Check for duplicates
        const isDuplicateInPaper = existingPaperQuestions.some(
          (pq: any) => pq.questionId?.question?.trim().toLowerCase() === qPayload.question.trim().toLowerCase()
        );
        const isDuplicateInBatch = createdQuestions.some(
          (cq: any) => cq.question?.trim().toLowerCase() === qPayload.question.trim().toLowerCase()
        );

        if (isDuplicateInPaper || isDuplicateInBatch) {
          warnings.push(`Duplicate question found: "${qPayload.question}". This question already exists.`);
          continue;
        }

        const question = new Question({
          ...qPayload,
          companyId: paper.companyId,
          subjectId: paper.subjectId, // From paper
          questionCode: qPayload.questionCode || `Q${Math.floor(10000 + Math.random() * 90000)}`,
          createdBy: paper.assignedTo,
        });
        await question.save();
        createdQuestions.push(question);

        const paperQuestion = new PaperQuestion({
          paperId: paper._id,
          questionId: question._id,
          sectionCode: payload.subjectName || "DEFAULT",
          questionOrder: qOrder,
          displayOrder: qOrder,
          marks: qPayload.marks || 1,
          negativeMarks: qPayload.negativeMarks || 0,
          createdBy: paper.assignedTo,
        });
        await paperQuestion.save();
        createdMappings.push(paperQuestion);

        qOrder++;
      }

      return { questions: createdQuestions, mappings: createdMappings, warnings };
    } catch (error) {
      throw error;
    }
  }

  async updateQuestion(paperId: string, questionId: string, payload: any) {
    const paper = await super.getById(paperId);
    
    // Check if paper is editable
    if (paper.approvalStatus === PaperApprovalStatus.PUBLISHED || paper.approvalStatus === PaperApprovalStatus.SUBMITTED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot edit questions in a submitted or published paper.");
    }

    const question = await Question.findOneAndUpdate(
      { _id: questionId, companyId: paper.companyId },
      { $set: payload },
      { new: true }
    );

    if (!question) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Question not found.");
    return question;
  }

  async removeQuestion(paperId: string, questionId: string) {
    const paper = await super.getById(paperId);
    
    if (paper.approvalStatus === PaperApprovalStatus.PUBLISHED || paper.approvalStatus === PaperApprovalStatus.SUBMITTED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot remove questions in a submitted or published paper.");
    }

    try {
      const pqDeleted = await PaperQuestion.findOneAndDelete({ paperId: paper._id, questionId: questionId });
      const qDeleted = await Question.findByIdAndDelete(questionId);
      
      console.log(`[DEBUG DELETE] PaperQuestion deleted: ${!!pqDeleted}, Question deleted: ${!!qDeleted} for questionId: ${questionId}`);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  // --------------------------------------------------------------------------
  // Get Assigned Papers with Auto Create
  // --------------------------------------------------------------------------

  async getAssignedPapersWithAutoCreate(employeeId: string, companyId?: string) {
    const assignments = await staffAssignmentRepository.findActiveByEmployee(employeeId, companyId);
    
    // Filter for PAPER_SETTER role
    const paperSetterAssignments = assignments.filter(a => a.role === 'PAPER_SETTER' && a.examId);
    
    if (paperSetterAssignments.length === 0) {
      return { papers: [], total: 0, page: 1, limit: 100, totalPages: 0 };
    }

    const assignedPapers = [];

    for (const assignment of paperSetterAssignments) {
      const examIdStr = (assignment.examId as any)._id?.toString() || assignment.examId.toString();
      
      // Check if paper exists for this exam assigned to this employee
      let paper = await Paper.findOne({ examId: examIdStr, assignedTo: employeeId, isDeleted: false }).populate("examId");
      
      if (!paper) {
        // Fetch Exam to get details
        const exam = await Exam.findById(examIdStr);
        if (exam) {
          // Auto create paper
          let totalQuestions = 0;
          if (exam.subjects && exam.subjects.length > 0) {
            exam.subjects.forEach(sub => {
              totalQuestions += sub.questions;
            });
          }

          const pCode = `P${Math.floor(100000 + Math.random() * 900000)}`;
          const newPaper = new Paper({
            companyId: assignment.companyId,
            examId: examIdStr,
            assignedTo: employeeId,
            paperCode: pCode,
            paperName: `${exam.examTitle} - Paper Set ${pCode}`,
            duration: exam.duration || 60,
            totalQuestions: totalQuestions || 1,
            totalMarks: exam.totalMarks || 1,
            passingMarks: exam.passingMarks || 0,
            approvalStatus: PaperApprovalStatus.DRAFT,
            status: PaperStatus.ACTIVE,
          });
          
          await newPaper.save();
          paper = await Paper.findById(newPaper._id).populate("examId");
        }
      }
      
      if (paper) {
        assignedPapers.push(paper);
      }
    }

    return {
      papers: assignedPapers,
      total: assignedPapers.length,
      page: 1,
      limit: 100,
      totalPages: 1
    };
  }

  // --------------------------------------------------------------------------
  // Statistics
  // --------------------------------------------------------------------------

  async statistics(companyId?: string) {
    const totalPapers = await paperRepository.count(companyId);

    const activePapers = await paperRepository.countByStatus(
      PaperStatus.ACTIVE,
      companyId,
    );

    const inactivePapers = await paperRepository.countByStatus(
      PaperStatus.INACTIVE,
      companyId,
    );

    const archivedPapers = await paperRepository.countByStatus(
      PaperStatus.ARCHIVED,
      companyId,
    );

    const draftPapers = await paperRepository.countByApproval(
      PaperApprovalStatus.DRAFT,
      companyId,
    );

    const approvedPapers = await paperRepository.countByApproval(
      PaperApprovalStatus.APPROVED,
      companyId,
    );

    const publishedPapers = await paperRepository.countByApproval(
      PaperApprovalStatus.PUBLISHED,
      companyId,
    );

    return {
      totalPapers,
      activePapers,
      inactivePapers,
      archivedPapers,
      draftPapers,
      approvedPapers,
      publishedPapers,
    };
  }
}

export default new PaperService();
