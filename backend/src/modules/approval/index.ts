import { ApprovalService } from "./approval.service";
import { createApprovalController } from "./approval.controller";
import { createApprovalRoutes } from "./approval.routes";

import Paper from "../paper/paper.model";
import { PaperApprovalStatus } from "../paper/paper.types";

import Exam from "../exam/exam.model";
import { ExamApprovalStatus } from "../exam/exam.types";

import Question from "../question-bank/question.model";
import { ApprovalStatus as QuestionApprovalStatus } from "../question-bank/question.types";

import Result from "../result/result.model";
import { ResultStatus } from "../result/result.types";

/*
|--------------------------------------------------------------------------
| Paper Approval
|--------------------------------------------------------------------------
*/

const paperApprovalService = new ApprovalService(Paper, {
  entityName: "Paper",
  statusField: "approvalStatus",
  reasonField: "remarks",
  statusMap: {
    submit: PaperApprovalStatus.SUBMITTED,
    review: PaperApprovalStatus.REVIEWED,
    approve: PaperApprovalStatus.APPROVED,
    reject: PaperApprovalStatus.REJECTED,
    publish: PaperApprovalStatus.PUBLISHED,
  },
});

export const paperApprovalRoutes = createApprovalRoutes(
  createApprovalController(paperApprovalService, "Paper")
);

/*
|--------------------------------------------------------------------------
| Exam Approval
|--------------------------------------------------------------------------
*/

const examApprovalService = new ApprovalService(Exam, {
  entityName: "Exam",
  statusField: "approvalStatus",
  reasonField: "remarks",
  statusMap: {
    submit: ExamApprovalStatus.SUBMITTED,
    review: ExamApprovalStatus.REVIEWED,
    approve: ExamApprovalStatus.APPROVED,
    reject: ExamApprovalStatus.REJECTED,
    publish: ExamApprovalStatus.PUBLISHED,
  },
});

export const examApprovalRoutes = createApprovalRoutes(
  createApprovalController(examApprovalService, "Exam")
);

/*
|--------------------------------------------------------------------------
| Question Approval
|--------------------------------------------------------------------------
*/

const questionApprovalService = new ApprovalService(Question, {
  entityName: "Question",
  statusField: "approvalStatus",
  reasonField: "remarks",
  statusMap: {
    submit: QuestionApprovalStatus.SUBMITTED,
    review: QuestionApprovalStatus.REVIEWED,
    approve: QuestionApprovalStatus.APPROVED,
    reject: QuestionApprovalStatus.REJECTED,
    publish: QuestionApprovalStatus.PUBLISHED,
  },
});

export const questionApprovalRoutes = createApprovalRoutes(
  createApprovalController(questionApprovalService, "Question")
);

/*
|--------------------------------------------------------------------------
| Result Approval
|--------------------------------------------------------------------------
*/

export const resultApprovalService = new ApprovalService(Result, {
  entityName: "Result",
  statusField: "resultStatus",
  reasonField: "remarks",
  statusMap: {
    approve: ResultStatus.APPROVED,
    reject: ResultStatus.REJECTED,
    publish: ResultStatus.PUBLISHED,
  },
});

export const resultApprovalRoutes = createApprovalRoutes(
  createApprovalController(resultApprovalService, "Result")
);
