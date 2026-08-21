import {
    ClientSession,
    QueryFilter as FilterQuery,
    Types,
} from "mongoose";

import ExamSubmission from "./examSubmission.model";

import {
    IExamSubmission,
    ExamSubmissionDocument,
    SubmissionStatus,
} from "./examSubmission.types";

export interface ExamSubmissionQuery {
    page?: number;
    limit?: number;
    candidateId?: string;
    attendanceId?: string;
    examId?: string;
    paperId?: string;
    companyId?: string;
    examCenterId?: string;
    submissionStatus?: SubmissionStatus;
}

import { BaseRepository } from "../../common/base.repository";

class ExamSubmissionRepository extends BaseRepository<IExamSubmission> {
    constructor() {
        super(ExamSubmission, ["candidateId", "examId", "paperId", "attendanceId"]);
    }



    /*
    |--------------------------------------------------------------------------
    | Find By Attendance
    |--------------------------------------------------------------------------
    */
    async findByAttendance(
        attendanceId: string
    ) {
        return ExamSubmission.findOne({
            attendanceId: new Types.ObjectId(attendanceId),
            isDeleted: false,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */
    async findByCandidate(
        candidateId: string
    ) {
        return ExamSubmission.find({
            candidateId: new Types.ObjectId(candidateId),
            isDeleted: false,
        })
        .sort({
            createdAt: -1,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Find By Exam
    |--------------------------------------------------------------------------
    */
    async findByExam(
        examId: string
    ) {
        return ExamSubmission.find({
            examId: new Types.ObjectId(examId),
            isDeleted: false,
        });
    }



    /*
    |--------------------------------------------------------------------------
    | Update Progress
    |--------------------------------------------------------------------------
    */
    async updateProgress(
        id: string,
        answeredQuestions: number,
        unansweredQuestions: number,
        reviewQuestions: number
    ) {
        return this.update(id, {
            answeredQuestions,
            unansweredQuestions,
            reviewQuestions,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Heartbeat
    |--------------------------------------------------------------------------
    */
    async updateHeartbeat(
        id: string
    ) {
        return this.update(id, {
            lastHeartbeatAt: new Date(),
        });
    }



    /*
    |--------------------------------------------------------------------------
    | Start Exam
    |--------------------------------------------------------------------------
    */
    async startExam(
        id: string
    ) {
        return this.update(id, {
            submissionStatus: SubmissionStatus.IN_PROGRESS,
            startedAt: new Date(),
            lastHeartbeatAt: new Date(),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Resume Exam
    |--------------------------------------------------------------------------
    */
    async resumeExam(
        id: string
    ) {
        return this.update(id, {
            submissionStatus: SubmissionStatus.IN_PROGRESS,
            lastHeartbeatAt: new Date(),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Pause Exam
    |--------------------------------------------------------------------------
    */
    async pauseExam(
        id: string
    ) {
        return this.update(id, {
            submissionStatus: SubmissionStatus.PAUSED,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Submit Exam
    |--------------------------------------------------------------------------
    */
    async submitExam(
        id: string
    ) {
        return this.update(id, {
            submissionStatus: SubmissionStatus.SUBMITTED,
            submittedAt: new Date(),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Auto Submit
    |--------------------------------------------------------------------------
    */
    async autoSubmit(
        id: string
    ) {
        return this.update(id, {
            submissionStatus: SubmissionStatus.AUTO_SUBMITTED,
            autoSubmitted: true,
            submittedAt: new Date(),
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Remaining Time
    |--------------------------------------------------------------------------
    */
    async updateRemainingTime(
        id: string,
        remainingTime: number
    ) {
        return this.update(id, {
            remainingTime,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Count
    |--------------------------------------------------------------------------
    */
    async count(
        examId?: any
    ): Promise<number> {
        if (typeof examId === 'object') {
            return super.count(examId);
        }
        const filter: FilterQuery<ExamSubmissionDocument> = {
            isDeleted: false,
        };
        if (examId)
            filter.examId = new Types.ObjectId(examId);
        return ExamSubmission.countDocuments(filter);
    }    /*
    |--------------------------------------------------------------------------
    | Count Submitted
    |--------------------------------------------------------------------------
    */
    async countSubmitted(
        examId?: string
    ) {
        const filter: FilterQuery<ExamSubmissionDocument> = {
            isDeleted: false,
            submissionStatus: SubmissionStatus.SUBMITTED,
        };
        if (examId)
            filter.examId = new Types.ObjectId(examId);
        return ExamSubmission.countDocuments(filter);
    }

    /*
    |--------------------------------------------------------------------------
    | Count In Progress
    |--------------------------------------------------------------------------
    */
    async countInProgress(
        examId?: string
    ) {
        const filter: FilterQuery<ExamSubmissionDocument> = {
            isDeleted: false,
            submissionStatus: SubmissionStatus.IN_PROGRESS,
        };
        if (examId)
            filter.examId = new Types.ObjectId(examId);
        return ExamSubmission.countDocuments(filter);
    }

    /*
    |--------------------------------------------------------------------------
    | Find Deleted By Id
    |--------------------------------------------------------------------------
    */
    async findDeletedById(
        id: string
    ): Promise<ExamSubmissionDocument | null> {
        return ExamSubmission.findOne({
            _id: id,
            isDeleted: true,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Exists By Attendance
    |--------------------------------------------------------------------------
    */
    async existsByAttendance(
        attendanceId: string
    ): Promise<boolean> {
        const exists = await ExamSubmission.exists({
            attendanceId: new Types.ObjectId(attendanceId),
            isDeleted: false,
        });
        return !!exists;
    }

    /*
    |--------------------------------------------------------------------------
    | Count Paused
    |--------------------------------------------------------------------------
    */
    async countPaused(
        examId?: string
    ): Promise<number> {
        const filter: FilterQuery<ExamSubmissionDocument> = {
            isDeleted: false,
            submissionStatus: SubmissionStatus.PAUSED,
        };
        if (examId) {
            filter.examId = new Types.ObjectId(examId);
        }
        return ExamSubmission.countDocuments(filter);
    }

    /*
    |--------------------------------------------------------------------------
    | Count Auto Submitted
    |--------------------------------------------------------------------------
    */
    async countAutoSubmitted(
        examId?: string
    ): Promise<number> {
        const filter: FilterQuery<ExamSubmissionDocument> = {
            isDeleted: false,
            submissionStatus: SubmissionStatus.AUTO_SUBMITTED,
        };
        if (examId) {
            filter.examId = new Types.ObjectId(examId);
        }
        return ExamSubmission.countDocuments(filter);
    }



    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */
    async permanentDelete(
        id: string
    ): Promise<ExamSubmissionDocument | null> {
        return ExamSubmission.findByIdAndDelete(id);
    }
}

export default new ExamSubmissionRepository();
