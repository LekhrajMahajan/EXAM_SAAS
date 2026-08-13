import mongoose, { ClientSession } from "mongoose";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import attendanceService from "../attendance/attendance.service";
import examService from "../exam/exam.service";
import candidateAnswerService from "../candidate-answer/candidateAnswer.service";

import examSubmissionRepository, {
    ExamSubmissionQuery,
} from "./examSubmission.repository";

import {
    IExamSubmission,
    SubmissionStatus,
} from "./examSubmission.types";

import { BaseService } from "../../common/base.service";

class ExamSubmissionService extends BaseService<IExamSubmission> {
    constructor() {
        super(examSubmissionRepository, "Exam submission");
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Attendance
    |--------------------------------------------------------------------------
    */

    private async validateAttendance(
        attendanceId: string
    ) {

        return attendanceService.getById(
            attendanceId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Exam
    |--------------------------------------------------------------------------
    */

    private async validateExam(
        examId: string
    ) {

        return examService.getActiveById(
            examId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Create Submission
    |--------------------------------------------------------------------------
    */

    async create(
        payload: Partial<IExamSubmission>
    ) {

        if (!payload.attendanceId) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Attendance Id is required."

            );

        }

        await this.validateAttendance(
            payload.attendanceId.toString()
        );

        await this.validateExam(
            payload.examId!.toString()
        );

        const exists =
            await examSubmissionRepository.existsByAttendance(
                payload.attendanceId.toString()
            );

        if (exists) {

            throw new ApiError(

                HTTP_STATUS.CONFLICT,

                "Submission already exists."

            );

        }

        const session: ClientSession =
            await mongoose.startSession();

        session.startTransaction();

        try {

            const submission =
                await super.create(

                    {

                        ...payload,

                        submissionStatus:
                            SubmissionStatus.NOT_STARTED,

                        answeredQuestions: 0,

                        unansweredQuestions:
                            payload.totalQuestions ?? 0,

                        reviewQuestions: 0,

                    },

                    session

                );

            await session.commitTransaction();

            session.endSession();

            return submission;

        } catch (error) {

            await session.abortTransaction();

            session.endSession();

            throw error;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Start Exam
    |--------------------------------------------------------------------------
    */

    async startExam(
        submissionId: string
    ) {

        await super.getById(
            submissionId
        );

        return examSubmissionRepository.startExam(
            submissionId
        );

    }



    /*
    |--------------------------------------------------------------------------
    | Get By Attendance
    |--------------------------------------------------------------------------
    */

    async getByAttendance(
        attendanceId: string
    ) {

        return examSubmissionRepository.findByAttendance(
            attendanceId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get Candidate Submissions
    |--------------------------------------------------------------------------
    */

    async getCandidateSubmissions(
        candidateId: string
    ) {

        return examSubmissionRepository.findByCandidate(
            candidateId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get Exam Submissions
    |--------------------------------------------------------------------------
    */

    async getExamSubmissions(
        examId: string
    ) {

        return examSubmissionRepository.findByExam(
            examId
        );

    }



    /*
    |--------------------------------------------------------------------------
    | Resume Exam
    |--------------------------------------------------------------------------
    */

    async resumeExam(
        submissionId: string
    ) {

        const submission =
            await super.getById(
                submissionId
            );

        if (
            submission.submissionStatus ===
            SubmissionStatus.SUBMITTED
        ) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Exam has already been submitted."
            );

        }

        if (
            submission.submissionStatus ===
            SubmissionStatus.AUTO_SUBMITTED
        ) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Exam has already been auto submitted."
            );

        }

        return examSubmissionRepository.resumeExam(
            submissionId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Pause Exam
    |--------------------------------------------------------------------------
    */

    async pauseExam(
        submissionId: string
    ) {

        const submission =
            await super.getById(
                submissionId
            );

        if (
            submission.submissionStatus !==
            SubmissionStatus.IN_PROGRESS
        ) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Exam is not in progress."
            );

        }

        return examSubmissionRepository.pauseExam(
            submissionId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Heartbeat
    |--------------------------------------------------------------------------
    */

    async heartbeat(
        submissionId: string
    ) {

        await super.getById(
            submissionId
        );

        return examSubmissionRepository.updateHeartbeat(
            submissionId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Update Remaining Time
    |--------------------------------------------------------------------------
    */

    async updateRemainingTime(

        submissionId: string,

        remainingTime: number

    ) {

        const submission =
            await super.getById(
                submissionId
            );

        if (
            submission.submissionStatus ===
            SubmissionStatus.SUBMITTED
        ) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Exam already submitted."
            );

        }

        if (remainingTime < 0) {

            remainingTime = 0;

        }

        return examSubmissionRepository.updateRemainingTime(

            submissionId,

            remainingTime

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Update Progress
    |--------------------------------------------------------------------------
    */

    async updateProgress(

        submissionId: string,

        answeredQuestions: number,

        unansweredQuestions: number,

        reviewQuestions: number

    ) {

        await super.getById(
            submissionId
        );

        return examSubmissionRepository.updateProgress(

            submissionId,

            answeredQuestions,

            unansweredQuestions,

            reviewQuestions

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Submit Exam
    |--------------------------------------------------------------------------
    */

    async submitExam(
        submissionId: string
    ) {

        const submission =
            await super.getById(
                submissionId
            );

        if (
            submission.submissionStatus ===
            SubmissionStatus.SUBMITTED
        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Exam already submitted."

            );

        }

        if (
            submission.submissionStatus ===
            SubmissionStatus.AUTO_SUBMITTED
        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Exam already auto submitted."

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Candidate Answers
        |--------------------------------------------------------------------------
        */

        const progress =
            await candidateAnswerService.submissionProgress(
                submissionId
            );

        /*
        |--------------------------------------------------------------------------
        | Synchronize Progress
        |--------------------------------------------------------------------------
        */

        await examSubmissionRepository.updateProgress(

            submissionId,

            progress.answered,

            progress.unanswered,

            progress.review

        );

        /*
        |--------------------------------------------------------------------------
        | Submit
        |--------------------------------------------------------------------------
        */

        return examSubmissionRepository.submitExam(
            submissionId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Auto Submit
    |--------------------------------------------------------------------------
    */

    async autoSubmit(
        submissionId: string
    ) {

        const submission =
            await super.getById(
                submissionId
            );

        if (
            submission.submissionStatus ===
            SubmissionStatus.SUBMITTED
        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Exam already submitted."

            );

        }

        const progress =
            await candidateAnswerService.submissionProgress(
                submissionId
            );

        await examSubmissionRepository.updateProgress(

            submissionId,

            progress.answered,

            progress.unanswered,

            progress.review

        );

        return examSubmissionRepository.autoSubmit(
            submissionId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Can Candidate Modify Answers
    |--------------------------------------------------------------------------
    */

    async canModifyAnswers(
        submissionId: string
    ): Promise<boolean> {

        const submission =
            await super.getById(
                submissionId
            );

        return [

            SubmissionStatus.NOT_STARTED,

            SubmissionStatus.IN_PROGRESS,

            SubmissionStatus.PAUSED,

        ].includes(
            submission.submissionStatus
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Is Submitted
    |--------------------------------------------------------------------------
    */

    async isSubmitted(
        submissionId: string
    ): Promise<boolean> {

        const submission =
            await super.getById(
                submissionId
            );

        return [

            SubmissionStatus.SUBMITTED,

            SubmissionStatus.AUTO_SUBMITTED,

        ].includes(
            submission.submissionStatus
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    async dashboard(
        examId?: string
    ) {

        const [

            total,

            submitted,

            inProgress,

            paused,

            autoSubmitted,

        ] = await Promise.all([

            examSubmissionRepository.count(examId),

            examSubmissionRepository.countSubmitted(examId),

            examSubmissionRepository.countInProgress(examId),

            examSubmissionRepository.countPaused(examId),

            examSubmissionRepository.countAutoSubmitted(examId),

        ]);

        return {

            total,

            submitted,

            inProgress,

            paused,

            autoSubmitted,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    async statistics(
        examId?: string
    ) {

        const dashboard =
            await this.dashboard(examId);

        return {

            ...dashboard,

            submissionPercentage:

                dashboard.total === 0

                    ? 0

                    : Number(

                        (

                            (dashboard.submitted /

                                dashboard.total) * 100

                        ).toFixed(2)

                    ),

        };

    }

    async softDelete(
        id: string
    ) {
        return super.delete(id);
    }



}

export default new ExamSubmissionService();
