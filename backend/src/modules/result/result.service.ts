import mongoose, { ClientSession } from "mongoose";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import attendanceService from "../attendance/attendance.service";
import examSubmissionService from "../exam-submission/examSubmission.service";
import candidateAnswerService from "../candidate-answer/candidateAnswer.service";
import paperService from "../paper/paper.service";
import paperQuestionService from "../paper-question/paperQuestion.service";
import questionService from "../question-bank/question.service";

import resultRepository, {
    ResultQuery,
} from "./result.repository";

import {
    IResult,
    ResultStatus,
    PassStatus,
    EvaluationMethod,
} from "./result.types";

import { BaseService } from "../../common/base.service";

import ExamSubmission from "../exam-submission/examSubmission.model";
import CandidateAnswer from "../candidate-answer/candidateAnswer.model";
import Question from "../question-bank/question.model";
import Paper from "../paper/paper.model";
import Result from "./result.model";
import { SubmissionStatus } from "../exam-submission/examSubmission.types";

class ResultService extends BaseService<IResult> {
    constructor() {
        super(resultRepository, "Result");
    }



    /*
    |--------------------------------------------------------------------------
    | Validate Submission
    |--------------------------------------------------------------------------
    */

    private async validateSubmission(
        submissionId: string
    ) {

        return examSubmissionService.getById(
            submissionId
        );

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
    | Create Result
    |--------------------------------------------------------------------------
    */

    async create(
        payload: Partial<IResult>
    ) {

        if (payload.attendanceId) {
            await this.validateAttendance(
                payload.attendanceId.toString()
            );
        }

        if (payload.submissionId) {
            await this.validateSubmission(
                payload.submissionId.toString()
            );
        }

        try {

            const result =
                await super.create(

                    {

                        ...payload,

                        attemptedQuestions: payload.attemptedQuestions ?? 0,

                        correctAnswers: payload.correctAnswers ?? 0,

                        wrongAnswers: payload.wrongAnswers ?? 0,

                        unansweredQuestions:
                            payload.unansweredQuestions ?? payload.totalQuestions ?? 0,

                        marksObtained: payload.marksObtained ?? 0,

                        negativeMarks: payload.negativeMarks ?? 0,

                        percentage: payload.percentage ?? 0,

                        passStatus:
                            payload.passStatus ?? PassStatus.FAILED,

                        resultStatus:
                            payload.resultStatus ?? ResultStatus.DRAFT,

                        evaluationMethod:
                            payload.evaluationMethod ?? EvaluationMethod.AUTO,

                        evaluationVersion: payload.evaluationVersion ?? 1,

                    }

                );

            return result;

        } catch (error) {

            throw error;

        }

    }



    /*
    |--------------------------------------------------------------------------
    | Get By Candidate
    |--------------------------------------------------------------------------
    */

    async getByCandidate(
        candidateId: string
    ) {

        return resultRepository.findByCandidate(
            candidateId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get By Exam
    |--------------------------------------------------------------------------
    */

    async getByExam(
        examId: string
    ) {

        return resultRepository.findByExam(
            examId
        );

    }



    /*
    |--------------------------------------------------------------------------
    | Evaluate Result
    |--------------------------------------------------------------------------
    */

    async evaluate(
        resultId: string
    ) {

        const result =
            await super.getById(
                resultId
            );

        const subId = (result.submissionId as any)?._id || result.submissionId;
        const CandidateExamAnswer = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
        const candAnsDoc = await CandidateExamAnswer.findOne({ 
            $or: [
                { _id: subId }, 
                { submissionId: subId }, 
                { _id: String(subId) }, 
                { submissionId: String(subId) }
            ] 
        }).lean();

        let candidateAnswers: any[] = [];
        if (candAnsDoc && (candAnsDoc as any).results && Array.isArray((candAnsDoc as any).results)) {
            candidateAnswers = (candAnsDoc as any).results;
        }

        if (!candidateAnswers.length) {
            // Do not throw, just use empty array, it will result in 0 marks
            console.warn("Candidate answers not found in candidateexamanswer collection for submission:", result.submissionId);
        }

        /*
        |--------------------------------------------------------------------------
        | Load Paper Questions
        |--------------------------------------------------------------------------
        */

        const paperQuestions =
            await paperQuestionService.getByPaper(
                result.paperId.toString()
            );

        if (!paperQuestions.length) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Paper questions not found."

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Evaluation Variables
        |--------------------------------------------------------------------------
        */

        let attemptedQuestions = 0;

        let correctAnswers = 0;

        let wrongAnswers = 0;

        let unansweredQuestions = 0;

        let obtainedMarks = 0;

        let negativeMarks = 0;

        /*
        |--------------------------------------------------------------------------
        | Evaluate Every Question
        |--------------------------------------------------------------------------
        */

        for (const paperQuestion of paperQuestions) {

            const answer =
                candidateAnswers.find(

                    candidateAnswer =>

                        candidateAnswer.questionId.toString() ===

                        paperQuestion.questionId.toString()

                );

            if (!answer || !answer.isAnswered) {

                unansweredQuestions++;

                continue;

            }

            attemptedQuestions++;

            const question =
                await questionService.getById(
                    paperQuestion.questionId.toString()
                );

            const evaluation =
                this.evaluateAnswer(
                    answer,
                    question,
                    paperQuestion
                );

            if (evaluation.correct) {

                correctAnswers++;

                obtainedMarks +=
                    evaluation.marks;

            } else {

                wrongAnswers++;

                negativeMarks +=
                    evaluation.negativeMarks;

            }

        }

        /*
        |--------------------------------------------------------------------------
        | Final Marks
        |--------------------------------------------------------------------------
        */

        obtainedMarks =
            obtainedMarks - negativeMarks;

        if (obtainedMarks < 0) {

            obtainedMarks = 0;

        }

        const percentage =
            this.calculatePercentage(

                obtainedMarks,

                result.totalMarks

            );

        const passStatus =
            this.calculatePassStatus(

                obtainedMarks,

                result.passingMarks

            );

        return super.update(

            resultId,

            {

                attemptedQuestions,

                correctAnswers,

                wrongAnswers,

                unansweredQuestions,

                marksObtained: obtainedMarks,

                negativeMarks,

                percentage,

                passStatus,

                resultStatus:
                    ResultStatus.EVALUATED,

                evaluatedAt:
                    new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Evaluate Single Answer
    |--------------------------------------------------------------------------
    */

    private evaluateAnswer(
        answer: any,
        question: any,
        paperQuestion: any
    ) {
        let correct = false;
        
        // Extract the actual answer value. It could be 'candidateAnswer' (from candidateexamanswer) 
        // or 'selectedOption' (legacy)
        const selectedOpt = answer.candidateAnswer !== undefined ? answer.candidateAnswer : answer.selectedOption;
        const selectedOpts = answer.candidateAnswers !== undefined ? answer.candidateAnswers : answer.selectedOptions;

        switch (question.questionType) {
            case "SINGLE_CHOICE":
                correct = selectedOpt === question.correctAnswer[0];
                break;
            case "MULTIPLE_CHOICE":
                correct = JSON.stringify([...(selectedOpts || [])].sort()) === JSON.stringify([...question.correctAnswer].sort());
                break;
            case "TRUE_FALSE":
                correct = selectedOpt === question.correctAnswer[0];
                break;

            case "NUMERICAL":

                correct =

                    Number(

                        answer.numericalAnswer

                    ) ===

                    Number(

                        question.correctAnswer[0]

                    );

                break;

            default:

                correct = false;

        }

        return {

            correct,

            marks:

                correct

                    ? paperQuestion.marks

                    : 0,

            negativeMarks:

                correct

                    ? 0

                    : paperQuestion.negativeMarks,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Percentage
    |--------------------------------------------------------------------------
    */

    private calculatePercentage(

        obtainedMarks: number,

        totalMarks: number

    ): number {

        if (totalMarks <= 0) {

            return 0;

        }

        return Number(

            (

                (obtainedMarks / totalMarks) * 100

            ).toFixed(2)

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Pass Status
    |--------------------------------------------------------------------------
    */

    private calculatePassStatus(

        obtainedMarks: number,

        passingMarks: number

    ): PassStatus {

        return obtainedMarks >= passingMarks

            ? PassStatus.PASSED

            : PassStatus.FAILED;

    }

    /*
    |--------------------------------------------------------------------------
    | Publish Result
    |--------------------------------------------------------------------------
    */

    async publish(

        resultId: string,

        publishedBy: string

    ) {

        const result =
            await super.getById(resultId);

        if (

            result.resultStatus !==
            ResultStatus.EVALUATED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Only evaluated results can be published."

            );

        }

        return super.update(

            resultId,

            {

                resultStatus:
                    ResultStatus.PUBLISHED,

                publishedBy: new mongoose.Types.ObjectId(publishedBy) as any,

                publishedAt: new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Approve Result
    |--------------------------------------------------------------------------
    */

    async approve(

        resultId: string,

        approvedBy: string

    ) {

        const result =
            await super.getById(resultId);

        if (

            result.resultStatus !==
            ResultStatus.PUBLISHED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Result must be published first."

            );

        }

        return super.update(

            resultId,

            {

                resultStatus:
                    ResultStatus.APPROVED,

                approvedBy: new mongoose.Types.ObjectId(approvedBy) as any,

                approvedAt: new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Reject Result
    |--------------------------------------------------------------------------
    */

    async reject(

        resultId: string,

        remarks: string

    ) {

        const result =
            await super.getById(resultId);

        if (

            result.resultStatus ===
            ResultStatus.APPROVED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Approved result cannot be rejected."

            );

        }

        return super.update(

            resultId,

            {

                resultStatus:
                    ResultStatus.REJECTED,

                remarks,

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Re-Evaluate
    |--------------------------------------------------------------------------
    */

    async reEvaluate(
        resultId: string
    ) {

        const result =
            await super.getById(
                resultId
            );

        await super.update(

            resultId,

            {

                evaluationVersion:

                    result.evaluationVersion + 1,

                resultStatus:

                    ResultStatus.DRAFT,

            }

        );

        return this.evaluate(
            resultId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Rank
    |--------------------------------------------------------------------------
    */

    async generateRank(
        examId: string
    ) {

        const results =
            await resultRepository.findByExam(
                examId
            );

        if (!results.length) {

            return [];

        }

        /*
        |--------------------------------------------------------------------------
        | Sort
        |--------------------------------------------------------------------------
        */

        const sorted = [...results].sort(

            (a, b) => {

                if (
                    b.marksObtained !==
                    a.marksObtained
                ) {

                    return (
                        b.marksObtained -
                        a.marksObtained
                    );

                }

                if (
                    b.correctAnswers !==
                    a.correctAnswers
                ) {

                    return (
                        b.correctAnswers -
                        a.correctAnswers
                    );

                }

                return (
                    a.negativeMarks -
                    b.negativeMarks
                );

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Assign Rank
        |--------------------------------------------------------------------------
        */

        let currentRank = 1;

        for (

            let index = 0;

            index < sorted.length;

            index++

        ) {

            if (index > 0) {

                const previous =
                    sorted[index - 1];

                const current =
                    sorted[index];

                const isTie =

                    previous.marksObtained ===
                        current.marksObtained &&

                    previous.correctAnswers ===
                        current.correctAnswers &&

                    previous.negativeMarks ===
                        current.negativeMarks;

                if (!isTie) {

                    currentRank =
                        index + 1;

                }

            }

            await super.update(

                sorted[index]._id.toString(),

                {

                    rank: currentRank,

                }

            );

        }

        return sorted;

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Results
    |--------------------------------------------------------------------------
    */

    async generateResults(payload: any) {
        const { examId, generatedBy } = payload;
        
        // 1. Fetch exam to handle fallbacks and ensure it exists
        const Exam = mongoose.models.Exam || mongoose.models.exam;
        const exam = await Exam.findById(examId);

        if (!exam) {
            return { generated: false, examId, message: "Exam not found" };
        }

        // 2. Find all standard submitted candidates for the exam
        const submissions = await ExamSubmission.find({
            examId,
            submissionStatus: { $in: [SubmissionStatus.SUBMITTED, SubmissionStatus.AUTO_SUBMITTED] }
        });

        // 3. Find candidateexamanswer submissions (the unstructured ones)
        const CandidateExamAnswer = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
        const candidateAnswers = await CandidateExamAnswer.find({ examId, submitReason: { $exists: true } });

        if (!submissions.length && !candidateAnswers.length) {
            return {
                generated: false,
                examId,
                generatedBy,
                message: "No submitted candidates found for evaluation."
            };
        }

        let generatedCount = 0;

        // Process Standard Submissions
        for (const submission of submissions) {
            // Check if result already exists to prevent duplicates if not forceRegenerate
            if (!payload.forceRegenerate) {
                const existingResult = await Result.findOne({ examId, candidateId: submission.candidateId });
                if (existingResult) continue;
            }

            // Fetch answers for this candidate
            const answers = await CandidateAnswer.find({
                examId,
                candidateId: submission.candidateId
            });

            let correct = 0;
            let wrong = 0;
            let skipped = 0;
            let obtainedMarks = 0;
            let negativeMarks = 0;

            // Evaluate each answer
            for (const answer of answers) {
                if (!answer.isAnswered) {
                    skipped++;
                    continue;
                }

                const question = await Question.findById(answer.questionId);
                if (!question) {
                    skipped++;
                    continue;
                }

                const marksForQuestion = question.marks || 1;
                const penaltyForQuestion = payload.negativeMarking ? (question.negativeMarks || 0) : 0;
                
                let isCorrect = false;

                // Compare based on question type
                if (question.questionType === "SINGLE_CHOICE" || question.questionType === "TRUE_FALSE") {
                    if (question.correctAnswer.includes(answer.selectedOption || "")) {
                        isCorrect = true;
                    }
                } else if (question.questionType === "MULTIPLE_CHOICE") {
                    const correctAns = question.correctAnswer.sort().join(",");
                    const selectedAns = (answer.selectedOptions || []).sort().join(",");
                    if (correctAns === selectedAns && correctAns.length > 0) {
                        isCorrect = true;
                    }
                }

                if (isCorrect) {
                    correct++;
                    obtainedMarks += marksForQuestion;
                } else {
                    wrong++;
                    negativeMarks += penaltyForQuestion;
                }
            }

            const paper = await Paper.findById(submission.paperId);
            if (!paper) {
                skipped += answers.length;
                continue; // Skip if paper not found
            }

            // Calculate final scores
            const finalMarks = Math.max(0, obtainedMarks - negativeMarks);
            const totalMarks = paper.totalMarks || 100;
            const percentage = (finalMarks / totalMarks) * 100;
            
            let grade = "F";
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 50) grade = "D";

            const resultStatus = percentage >= (paper.passingMarks || 35) ? PassStatus.PASSED : PassStatus.FAILED;

            // Create Result
            await Result.create({
                attendanceId: submission.attendanceId,
                submissionId: submission._id,
                candidateId: submission.candidateId,
                candidateAssignmentId: submission.candidateAssignmentId,
                examId: submission.examId,
                paperId: submission.paperId,
                subjectId: submission.subjectId,
                companyId: submission.companyId,
                branchId: submission.branchId,
                examCenterId: submission.examCenterId,
                examRoomId: submission.examRoomId,
                totalQuestions: submission.totalQuestions,
                attemptedQuestions: correct + wrong,
                correctAnswers: correct,
                wrongAnswers: wrong,
                unansweredQuestions: skipped,
                totalMarks: totalMarks,
                marksObtained: finalMarks,
                negativeMarks: negativeMarks,
                passingMarks: paper.passingMarks || 35,
                percentage,
                passStatus: resultStatus,
                resultStatus: ResultStatus.EVALUATED,
                evaluationMethod: EvaluationMethod.AUTO,
                generatedBy,
                createdBy: generatedBy
            });
            
            generatedCount++;
        }

        // Process CandidateExamAnswer Submissions (Fallback)
        for (const ca of candidateAnswers) {
            // Check if result already exists
            if (!payload.forceRegenerate) {
                const existingResult = await Result.findOne({ examId, candidateId: ca.candidateId });
                // If it exists but has 0 marks, let's delete it so it regenerates correctly
                if (existingResult && existingResult.marksObtained > 0) {
                    continue;
                }
                if (existingResult) {
                    await Result.deleteOne({ _id: existingResult._id });
                }
            }

            const activePaperId = exam?.finalPaperId || exam?.paperId;
            const paper = activePaperId ? await Paper.findById(activePaperId) : null;
            if (!paper) continue; // Skip if paper not found

            let correct = 0;
            let wrong = 0;
            let skipped = 0;
            let obtainedMarks = 0;
            let negativeMarks = 0;

            const resultsData = ca.results || [];
            
            for (const res of resultsData) {
                if (res.status === "NOT_VISITED" || res.status === "MARKED_FOR_REVIEW" || res.candidateAnswer === null || res.candidateAnswer === undefined) {
                    skipped++;
                    continue;
                }

                const marksForQuestion = res.marks || 1;
                const penaltyForQuestion = payload.negativeMarking ? (res.negativeMarks || 0) : 0;
                
                let isCorrect = false;

                if (res.options && Array.isArray(res.options)) {
                    const correctOptions = res.options.filter((opt: any) => opt.isCorrect).map((opt: any) => String(opt.optionId));
                    const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer.map(String) : [String(res.candidateAnswer)];
                    
                    const correctAnsStr = [...correctOptions].sort().join(",");
                    const selectedAnsStr = [...selectedOptions].sort().join(",");
                    
                    if (correctAnsStr === selectedAnsStr && correctAnsStr.length > 0) {
                        isCorrect = true;
                    }
                } else {
                    // Fallback if options are not embedded
                    const question = await mongoose.models.Question.findById(res.questionId);
                    if (question) {
                        if (question.questionType === "SINGLE_CHOICE" || question.questionType === "TRUE_FALSE") {
                            const selectedOption = Array.isArray(res.candidateAnswer) ? String(res.candidateAnswer[0]) : String(res.candidateAnswer);
                            if (question.correctAnswer.includes(selectedOption)) {
                                isCorrect = true;
                            }
                        } else if (question.questionType === "MULTIPLE_CHOICE") {
                            const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer.map(String) : [String(res.candidateAnswer)];
                            const correctAns = [...question.correctAnswer].sort().join(",");
                            const selectedAns = selectedOptions.sort().join(",");
                            if (correctAns === selectedAns && correctAns.length > 0) {
                                isCorrect = true;
                            }
                        }
                    } else {
                        skipped++;
                        continue;
                    }
                }

                if (isCorrect) {
                    correct++;
                    obtainedMarks += marksForQuestion;
                } else {
                    wrong++;
                    negativeMarks += penaltyForQuestion;
                }
            }

            const finalMarks = Math.max(0, obtainedMarks - negativeMarks);
            const totalMarks = paper.totalMarks || 100;
            const percentage = (totalMarks > 0) ? (finalMarks / totalMarks) * 100 : 0;
            const totalQuestions = resultsData.length || 0;
            
            let grade = "F";
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 50) grade = "D";

            const resultStatus = percentage >= (paper.passingMarks || 35) ? PassStatus.PASSED : PassStatus.FAILED;

            await Result.create({
                submissionId: ca.submissionId || ca._id,
                candidateId: ca.candidateId,
                examId: ca.examId,
                paperId: activePaperId,
                subjectId: exam.subjectId,
                companyId: exam.companyId,
                branchId: exam.branchId,
                totalQuestions: totalQuestions,
                attemptedQuestions: correct + wrong,
                correctAnswers: correct,
                wrongAnswers: wrong,
                unansweredQuestions: skipped,
                totalMarks: totalMarks,
                marksObtained: finalMarks,
                negativeMarks: negativeMarks,
                passingMarks: paper.passingMarks || 35,
                percentage,
                passStatus: resultStatus,
                resultStatus: ResultStatus.EVALUATED,
                evaluationMethod: EvaluationMethod.AUTO,
                generatedBy,
                createdBy: generatedBy
            });

            generatedCount++;
        }

        return {
            generated: true,
            examId,
            generatedCount,
            generatedBy
        };
    }

    async updateMany(filter: any, update: any) {
        return Result.updateMany(filter, update);
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

            passed,

            failed,

        ] = await Promise.all([

            resultRepository.count(
                examId
            ),

            resultRepository.countPassed(
                examId
            ),

            resultRepository.countFailed(
                examId
            ),

        ]);

        return {

            total,

            passed,

            failed,

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
            await this.dashboard(
                examId
            );

        const percentage =
            dashboard.total === 0

                ? 0

                : Number(

                      (

                          (dashboard.passed /

                              dashboard.total) *

                          100

                      ).toFixed(2)

                  );

        return {

            ...dashboard,

            passPercentage:
                percentage,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Pass Percentage
    |--------------------------------------------------------------------------
    */

    async passPercentage(
        examId: string
    ) {

        const total =
            await resultRepository.count(
                examId
            );

        const passed =
            await resultRepository.countPassed(
                examId
            );

        return {

            total,

            passed,

            percentage:

                total === 0

                    ? 0

                    : Number(

                          (

                              (passed / total) *

                              100

                          ).toFixed(2)

                      ),

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Merit List
    |--------------------------------------------------------------------------
    */

    async meritList(
        examId: string,
        limit = 100
    ) {

        const results =
            await resultRepository.findByExam(
                examId
            );

        return results

            .filter(

                result =>

                    result.resultStatus ===
                    ResultStatus.APPROVED

            )

            .sort(

                (a, b) => {

                    if (
                        b.marksObtained !==
                        a.marksObtained
                    ) {

                        return (
                            b.marksObtained -
                            a.marksObtained
                        );

                    }

                    return (
                        a.rank ?? 999999
                    ) -

                    (
                        b.rank ?? 999999
                    );

                }

            )

            .slice(0, limit);

    }

    /*
    |--------------------------------------------------------------------------
    | Topper
    |--------------------------------------------------------------------------
    */

    async topper(
        examId: string
    ) {

        const meritList =
            await this.meritList(
                examId,
                1
            );

        return meritList.length

            ? meritList[0]

            : null;

    }

    async softDelete(
        resultId: string
    ) {
        return super.delete(resultId);
    }



    /*
    |--------------------------------------------------------------------------
    | Get Details (Questions & Answers)
    |--------------------------------------------------------------------------
    */

    async getDetails(resultId: string) {
        const result = await Result.findById(resultId)
            .populate('examId', 'examTitle examCode')
            .populate('candidateId', 'firstName lastName enrollmentNo applicationNumber photo')
            .lean();

        if (!result) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Result not found");
        }

        let cName = '';
        let cAppNo = 'N/A';
        let cPhoto = '';
        let cId = (result.candidateId as any)?._id;

        if (result.candidateId && typeof result.candidateId === 'object' && !mongoose.Types.ObjectId.isValid(result.candidateId as any)) {
            const cand = result.candidateId as any;
            cName = cand.firstName ? `${cand.firstName} ${cand.lastName || ''}`.trim() : '';
            cName = cName || cand.candidateFullName || cand.fullName || cand.name || '';
            cAppNo = cand.applicationNumber || cand.enrollmentNo || cand.applicationNo || cAppNo;
            cPhoto = cand.photo || '';
        }

        let candAns: any = null;
        const candidateExamAnswerCollection = mongoose.connection.db!.collection('candidateexamanswer');
        
        const subId = (result.submissionId as any)?._id || result.submissionId;
        const query: any[] = [];
        if (subId) {
            query.push({ _id: subId }, { submissionId: subId }, { _id: String(subId) }, { submissionId: String(subId) });
        }
        if (result.candidateId) {
            const candId = (result.candidateId as any)._id || result.candidateId;
            query.push({ candidateId: candId }, { candidateId: String(candId) });
        }
        
        if (query.length > 0) {
            const examId = (result.examId as any)?._id || result.examId;
            if (examId) {
                candAns = await candidateExamAnswerCollection.findOne({ 
                    $or: query,
                    examId: { $in: [examId, String(examId)] }
                });
            }
            if (!candAns) {
                candAns = await candidateExamAnswerCollection.findOne({ $or: query });
            }
            if (candAns && !cName) {
                cName = candAns.name || candAns.candidateName || '';
                cAppNo = candAns.applicationNo || cAppNo;
            }
        }
        
        cName = cName || 'Unknown Candidate';

        const candidateAnswers = await CandidateAnswer.find({
            candidateId: result.candidateId,
            examId: result.examId
        }).lean();

        let questionsDetails: any[] = [];

        if (candidateAnswers.length > 0) {
            const questionIds = candidateAnswers.map(ans => ans.questionId);
            const questions = await Question.find({ _id: { $in: questionIds } }).lean();

            questionsDetails = candidateAnswers.map((answer: any) => {
                const question = questions.find(q => q._id.toString() === answer.questionId.toString());
                
                let isCorrect = false;
                let correctAnswerText = '';
                let selectedAnswerText = '';

                if (question) {
                    correctAnswerText = question.correctAnswer.join(', ');
                    
                    if (question.questionType === "SINGLE_CHOICE" || question.questionType === "TRUE_FALSE") {
                        selectedAnswerText = answer.selectedOption || '';
                        isCorrect = question.correctAnswer.includes(selectedAnswerText);
                    } else if (question.questionType === "MULTIPLE_CHOICE") {
                        selectedAnswerText = (answer.selectedOptions || []).join(', ');
                        const correctAns = [...question.correctAnswer].sort().join(",");
                        const selectedAns = [...(answer.selectedOptions || [])].sort().join(",");
                        isCorrect = correctAns === selectedAns && correctAns.length > 0;
                    }
                }

                return {
                    questionId: answer.questionId,
                    questionText: question?.question || 'Unknown Question',
                    questionType: answer.questionType || question?.questionType,
                    isAnswered: answer.isAnswered,
                    selectedAnswer: selectedAnswerText,
                    correctAnswer: correctAnswerText,
                    isCorrect,
                    marks: isCorrect ? (question?.marks || 1) : 0,
                    negativeMarks: (!isCorrect && answer.isAnswered) ? (question?.negativeMarks || 0) : 0
                };
            });
        } else if (candAns && candAns.results && Array.isArray(candAns.results)) {
            const resultsData = candAns.results;
            const questionIds = resultsData.map((ans: any) => ans.questionId).filter(Boolean);
            const questions = await Question.find({ _id: { $in: questionIds } }).lean();

            questionsDetails = resultsData.map((res: any) => {
                const question = questions.find(q => q._id.toString() === res.questionId?.toString());
                
                const isAnswered = res.status !== "NOT_VISITED" && res.candidateAnswer !== null && res.candidateAnswer !== undefined;
                let isCorrect = false;
                let correctAnswerText = '';
                let selectedAnswerText = '';
                let qType = res.questionType || question?.questionType;
                let marks = 0;
                let negativeMarks = 0;

                if (res.options && Array.isArray(res.options)) {
                     const correctOptions = res.options.filter((opt: any) => opt.isCorrect);
                     correctAnswerText = correctOptions.map((opt: any) => opt.text || opt.optionId).join(', ');
                     
                     const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer : [res.candidateAnswer];
                     selectedAnswerText = selectedOptions.join(', ');
                     
                     const correctAnsStr = correctOptions.map((opt: any) => String(opt.optionId)).sort().join(",");
                     const selectedAnsStr = selectedOptions.map(String).sort().join(",");
                     
                     if (correctAnsStr === selectedAnsStr && correctAnsStr.length > 0) {
                         isCorrect = true;
                     }
                } else if (question) {
                     correctAnswerText = question.correctAnswer.join(', ');
                     const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer.map(String) : [String(res.candidateAnswer)];
                     selectedAnswerText = selectedOptions.join(', ');

                     if (qType === "SINGLE_CHOICE" || qType === "TRUE_FALSE") {
                          isCorrect = question.correctAnswer.includes(selectedOptions[0]);
                     } else if (qType === "MULTIPLE_CHOICE") {
                          const correctAns = [...question.correctAnswer].sort().join(",");
                          const selectedAns = selectedOptions.sort().join(",");
                          isCorrect = correctAns === selectedAns && correctAns.length > 0;
                     }
                }

                if (isAnswered) {
                     marks = isCorrect ? (res.marks || question?.marks || 1) : 0;
                     negativeMarks = !isCorrect ? (res.negativeMarks || question?.negativeMarks || 0) : 0;
                }

                return {
                    questionId: res.questionId,
                    questionText: res.questionText || question?.question || 'Unknown Question',
                    questionType: qType,
                    isAnswered: isAnswered,
                    selectedAnswer: selectedAnswerText,
                    correctAnswer: correctAnswerText,
                    isCorrect,
                    marks,
                    negativeMarks
                };
            });
        }

        return {
            id: result._id,
            candidate: {
                id: cId,
                name: cName,
                applicationNumber: cAppNo,
                photo: cPhoto
            },
            exam: {
                id: (result.examId as any)?._id,
                name: (result.examId as any)?.examTitle || 'Unknown Exam',
            },
            marks: {
                totalMarks: result.totalMarks,
                obtainedMarks: result.marksObtained,
                percentage: result.percentage,
                correctAnswers: result.correctAnswers,
                wrongAnswers: result.wrongAnswers,
                unanswered: result.unansweredQuestions,
                negativeMarks: result.negativeMarks
            },
            grade: result.percentage >= 90 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 70 ? 'B' : result.percentage >= 60 ? 'C' : 'D',
            status: result.resultStatus,
            answers: questionsDetails
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Permanently
    |--------------------------------------------------------------------------
    */

    async permanentDelete(
        resultId: string
    ) {

        await super.getById(
            resultId
        );

        return resultRepository.permanentDelete(
            resultId
        );

    }

}

export default new ResultService();
