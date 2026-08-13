import mongoose, { ClientSession } from "mongoose";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import examSubmissionService from "../exam-submission/examSubmission.service";
import candidateAnswerRepository, {
    CandidateAnswerQuery,
} from "./candidateAnswer.repository";
import {
    ICandidateAnswer,
    QuestionStatus,
} from "./candidateAnswer.types";
import { BaseService } from "../../common/base.service";

class CandidateAnswerService extends BaseService<ICandidateAnswer> {
    constructor() {
        super(candidateAnswerRepository, "Candidate answer");
    }
    /*
    |--------------------------------------------------------------------------
    | Validate Submission
    |--------------------------------------------------------------------------
    */
    private async validateSubmission(
        submissionId: string
    ) {
        const submission =
            await examSubmissionService.getById(
                submissionId
            );

        if (!submission) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Exam submission not found."
            );
        }

        return submission;
    }

    /*
    |--------------------------------------------------------------------------
    | Create Answer
    |--------------------------------------------------------------------------
    */
    async create(
        payload: Partial<ICandidateAnswer>
    ) {
        await this.validateSubmission(
            payload.submissionId!.toString()
        );

        const session: ClientSession =
            await mongoose.startSession();

        session.startTransaction();

        try {
            const answer =
                await super.create(
                    payload as any,
                    session
                );

            await session.commitTransaction();
            session.endSession();

            return answer;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Save Answer
    |--------------------------------------------------------------------------
    */
    async saveAnswer(
        submissionId: string,
        questionId: string,
        payload: Partial<ICandidateAnswer>
    ) {
        await this.validateSubmission(
            submissionId
        );

        payload.lastSavedAt = new Date();
        payload.isAnswered = true;
        payload.questionStatus =
            payload.isMarkedForReview
                ? QuestionStatus.ANSWERED_AND_MARKED
                : QuestionStatus.ANSWERED;

        const saved = await candidateAnswerRepository.saveAnswer(
            submissionId,
            questionId,
            payload
        );

        const progress = await this.submissionProgress(submissionId);
        await examSubmissionService.updateProgress(
            submissionId,
            progress.answered,
            progress.unanswered,
            progress.review
        );

        return saved;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Answer
    |--------------------------------------------------------------------------
    */
    async update(
        id: string,
        payload: Partial<ICandidateAnswer>
    ) {
        const answer = await super.getById(id);

        payload.lastSavedAt = new Date();

        return super.update(
            id,
            payload
        );
    }



    /*
    |--------------------------------------------------------------------------
    | Mark For Review
    |--------------------------------------------------------------------------
    */
    async markForReview(
        id: string,
        review: boolean
    ) {
        const answer = await super.getById(id);

        const marked = await candidateAnswerRepository.markForReview(
            id,
            review
        );

        const progress = await this.submissionProgress(answer.submissionId.toString());
        await examSubmissionService.updateProgress(
            answer.submissionId.toString(),
            progress.answered,
            progress.unanswered,
            progress.review
        );

        return marked;
    }

    /*
    |--------------------------------------------------------------------------
    | Clear Answer
    |--------------------------------------------------------------------------
    */
    async clearAnswer(
        id: string
    ) {
        const answer = await super.getById(id);

        const cleared = await candidateAnswerRepository.clearAnswer(id);

        const progress = await this.submissionProgress(answer.submissionId.toString());
        await examSubmissionService.updateProgress(
            answer.submissionId.toString(),
            progress.answered,
            progress.unanswered,
            progress.review
        );

        return cleared;
    }

    /*
    |--------------------------------------------------------------------------
    | Get Submission Answers
    |--------------------------------------------------------------------------
    */
    async getSubmissionAnswers(
        submissionId: string
    ) {
        await this.validateSubmission(
            submissionId
        );

        return candidateAnswerRepository.findBySubmission(
            submissionId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Submission Progress
    |--------------------------------------------------------------------------
    */
    async submissionProgress(
        submissionId: string
    ) {
        const answers =
            await candidateAnswerRepository.findBySubmission(
                submissionId
            );

        const totalQuestions =
            answers.length;

        const answered =
            answers.filter(
                answer => answer.isAnswered
            ).length;

        const review =
            answers.filter(
                answer => answer.isMarkedForReview
            ).length;

        const unanswered =
            totalQuestions - answered;

        return {
            totalQuestions,
            answered,
            unanswered,
            review,
            completedPercentage:
                totalQuestions === 0
                    ? 0
                    : Number(
                        (
                            (answered / totalQuestions) * 100
                        ).toFixed(2)
                    ),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */
    async statistics(
        submissionId: string
    ) {
        await this.validateSubmission(
            submissionId
        );

        return candidateAnswerRepository.statistics(
            submissionId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    async dashboard(
        submissionId: string
    ) {
        await this.validateSubmission(
            submissionId
        );

        return candidateAnswerRepository.dashboard(
            submissionId
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Total Time Spent
    |--------------------------------------------------------------------------
    */
    async totalTimeSpent(
        submissionId: string
    ) {
        const answers =
            await candidateAnswerRepository.findBySubmission(
                submissionId
            );

        const totalTimeSpent =
            answers.reduce(
                (
                    total,
                    answer
                ) => total + answer.timeSpent,
                0
            );

        return {
            submissionId,
            totalTimeSpent,
        };
    }
}

export default new CandidateAnswerService();
