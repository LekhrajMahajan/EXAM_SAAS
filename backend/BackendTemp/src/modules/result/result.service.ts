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
import Exam from "../exam/exam.model";
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

    /**
     * ONE AUTHORITATIVE SCORE CALCULATION ENGINE
     */
    private async authoritativeEvaluate(
        examId: string,
        candidateId: string,
        answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status?: string; options?: any[]; correctAnswer?: any[]; questionType?: string; marks?: number; negativeMarks?: number; }>,
        preFetchedExam?: any,
        preFetchedConfig?: Map<string, any>
    ) {
        const mongoose = require('mongoose');

        // Load Exam
        const exam = preFetchedExam || await mongoose.model("Exam").findById(examId).lean() as any;
        if (!exam) throw new Error(`Exam not found for ID: ${examId}`);

        let examSubjectConfigMap = preFetchedConfig;

        if (!examSubjectConfigMap) {
            // Prepare subject map from config
            examSubjectConfigMap = new Map<string, any>();
            for (const s of (exam.subjects || [])) {
                if (!s.subjectId) throw new Error("Missing subject configuration: subjectId is required");
                const subjectDoc = await mongoose.model("Subject").findById(s.subjectId).lean() as any;
                const numQ = Number(s.questions) || 0;
                
                if (s.marksPerQuestion === undefined || s.marksPerQuestion === null || s.marksPerQuestion === "") {
                    throw new Error(`Missing marksPerQuestion configuration for subject: ${s.subjectId}`);
                }
                const marksPerQ = Number(s.marksPerQuestion);
                if (marksPerQ < 0) throw new Error(`marksPerQuestion cannot be negative for subject: ${s.subjectId}`);

                const negMarksPerQ = (s.negativeMarksPerQuestion !== undefined && s.negativeMarksPerQuestion !== null && s.negativeMarksPerQuestion !== "") ? Number(s.negativeMarksPerQuestion) : 0;
                const maxM = numQ * marksPerQ;
                
                examSubjectConfigMap.set(String(s.subjectId), {
                    subjectId: s.subjectId,
                    subjectName: subjectDoc?.name || subjectDoc?.subjectName || s.name || "Unknown",
                    marksPerQuestion: marksPerQ,
                    negativeMarksPerQuestion: negMarksPerQ,
                    questions: numQ,
                    maxMarks: maxM,
                    sectionalCutoff: (s.sectionalCutoff !== undefined && s.sectionalCutoff !== null) ? Number(s.sectionalCutoff) : null,
                });
            }
        }

        let totalMaximumMarks = 0;
        let totalQuestionsConfig = 0;
        for (const cfg of examSubjectConfigMap.values()) {
            totalMaximumMarks += cfg.maxMarks;
            totalQuestionsConfig += cfg.questions;
        }

        let correctCount = 0;
        let wrongCount = 0;
        let unansweredCount = 0;
        let correctScore = 0;
        let negativeScore = 0;

        const subjectBreakdownMap = new Map<string, any>();

        for (const [subId, cfg] of examSubjectConfigMap.entries()) {
            subjectBreakdownMap.set(subId, {
                subjectId: cfg.subjectId,
                subjectName: cfg.subjectName,
                questionsAttempted: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                correctMarks: 0,
                negativeMarks: 0,
                marksObtained: 0,
                maxMarks: cfg.maxMarks,
            });
        }

        console.log(`[EVAL START] Candidate: ${candidateId} | Exam: ${examId}`);

        for (const item of answerItems) {
            // Detect not-attempted: support both legacy "NOT_VISITED" and new "Not Answered" status formats
            const statusLower = (item.status || "").toLowerCase();
            const notAttempted = item.candidateAnswer === null || item.candidateAnswer === undefined 
                || statusLower === "not_visited" || statusLower === "not answered" || statusLower === "not visited"
                || (!item.isAnswered && statusLower !== "answered" && statusLower !== "marked for review");

            // Try to find question in DB first
            let question = await mongoose.models.Question?.findById(item.questionId).lean() as any;

            // If question not found in DB, use embedded data from the answer item itself
            if (!question && item.options && Array.isArray(item.options)) {
                // Build a virtual question from the embedded data
                const correctOptions = item.options.filter((o: any) => o.isCorrect).map((o: any) => o.optionId || o.optionLabel);
                question = {
                    _id: item.questionId,
                    questionType: item.questionType || "SINGLE_CHOICE",
                    correctAnswer: (item.correctAnswer && item.correctAnswer.length > 0) ? item.correctAnswer : correctOptions,
                    options: item.options,
                    subjectId: null, // Will use fallback marks from item or exam config
                };
            }

            if (!question) {
                unansweredCount++;
                continue;
            }

            const subIdStr = question.subjectId ? String(question.subjectId) : "";
            let subjCfg = subIdStr ? examSubjectConfigMap.get(subIdStr) : undefined;

            // Fallback: if no subject config found (embedded questions have no subjectId),
            // use the per-item marks or the first subject config as default
            let marksForQ: number;
            let penaltyForQ: number;
            let se: any = null;

            if (subjCfg) {
                marksForQ = subjCfg.marksPerQuestion;
                penaltyForQ = subjCfg.negativeMarksPerQuestion;
                se = subjectBreakdownMap.get(subIdStr);
            } else {
                // Use marks embedded in the answer item, or fall back to exam-level defaults
                marksForQ = (item.marks !== undefined && item.marks !== null) ? Number(item.marks) : (exam.marksPerQuestion || 1);
                penaltyForQ = (item.negativeMarks !== undefined && item.negativeMarks !== null) ? Number(item.negativeMarks) : (exam.negativeMarksPerQuestion || 0);
                // Try to assign to the first subject breakdown entry for aggregation
                const firstSubId = subjectBreakdownMap.keys().next().value;
                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);
            }

            if (notAttempted) {
                unansweredCount++;
                continue;
            }

            // Determine correctness
            let isCorrect = false;
            const qType = question.questionType || item.questionType || "SINGLE_CHOICE";

            if (qType === "SINGLE_CHOICE" || qType === "TRUE_FALSE") {
                const selected = Array.isArray(item.candidateAnswer) ? String(item.candidateAnswer[0]) : String(item.candidateAnswer);
                // Check against correctAnswer array
                if (question.correctAnswer && question.correctAnswer.length > 0) {
                    isCorrect = question.correctAnswer.includes(selected);
                } else if (question.options && Array.isArray(question.options)) {
                    // Fallback: check options[].isCorrect
                    const correctOpt = question.options.find((o: any) => o.isCorrect);
                    if (correctOpt) {
                        isCorrect = (selected === correctOpt.optionId || selected === correctOpt.optionLabel);
                    }
                }
            } else if (qType === "MULTIPLE_CHOICE") {
                const selected = (Array.isArray(item.candidateAnswer) ? item.candidateAnswer : [item.candidateAnswer]).map(String).sort().join(",");
                let correctAns = "";
                if (question.correctAnswer && question.correctAnswer.length > 0) {
                    correctAns = [...question.correctAnswer].sort().join(",");
                } else if (question.options && Array.isArray(question.options)) {
                    correctAns = question.options.filter((o: any) => o.isCorrect).map((o: any) => o.optionId || o.optionLabel).sort().join(",");
                }
                isCorrect = correctAns === selected && correctAns.length > 0;
            } else if (qType === "NUMERICAL") {
                isCorrect = Number(item.candidateAnswer) === Number(question.correctAnswer?.[0]);
            }

            if (isCorrect) {
                correctCount++;
                correctScore += marksForQ;
                if (se) {
                    se.questionsAttempted++;
                    se.correctAnswers++;
                    se.correctMarks += marksForQ;
                }
            } else {
                wrongCount++;
                negativeScore += penaltyForQ;
                if (se) {
                    se.questionsAttempted++;
                    se.wrongAnswers++;
                    se.negativeMarks += penaltyForQ;
                }
            }
        }

        // Aggregate subjects
        for (const [subId, se] of subjectBreakdownMap.entries()) {
            se.marksObtained = se.correctMarks - se.negativeMarks;
        }

        // Invariants exactly ONCE
        const finalScore = correctScore - negativeScore;
        const totalMarks = totalMaximumMarks > 0 ? totalMaximumMarks : (exam.totalMarks || 0);
        const percentage = totalMarks > 0 ? Number(((finalScore / totalMarks) * 100).toFixed(2)) : 0;
        
        console.log(`[EVAL AGGREGATE] CorrectScore: ${correctScore} | NegativeScore: ${negativeScore} | FinalScore: ${finalScore} | MaxMarks: ${totalMarks} | %: ${percentage}`);

        // CUTOFFS
        // Overall
        let overallCutoffStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE" = "NOT_APPLICABLE";
        const hasMarksCutoff = exam.passingMarks !== undefined && exam.passingMarks !== null && Number(exam.passingMarks) > 0;
        const hasPercentCutoff = exam.overallQualifyingPercent !== undefined && exam.overallQualifyingPercent !== null && Number(exam.overallQualifyingPercent) > 0;
        if (exam.cutoffType === "PERCENTAGE" && hasPercentCutoff) {
            overallCutoffStatus = percentage >= Number(exam.overallQualifyingPercent) ? "QUALIFIED" : "NOT_QUALIFIED";
        } else if (exam.cutoffType === "MARKS" && hasMarksCutoff) {
            overallCutoffStatus = finalScore >= Number(exam.passingMarks) ? "QUALIFIED" : "NOT_QUALIFIED";
        } else if (hasMarksCutoff) {
            overallCutoffStatus = finalScore >= Number(exam.passingMarks) ? "QUALIFIED" : "NOT_QUALIFIED";
        }

        // Category
        let categoryCutoffStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE" = "NOT_APPLICABLE";
        let candidateCategory: string | null = null;
        if (candidateId) {
            const Candidate = mongoose.models.Candidate || mongoose.models.candidate;
            const ImportCandidate = mongoose.models.ImportCandidate || mongoose.models.importcandidate;
            const cand: any = (await Candidate?.findById(candidateId).lean()) || (await ImportCandidate?.findById(candidateId).lean());
            if (cand) candidateCategory = cand.category || null;
        }
        if (candidateCategory && exam.categoryWiseCutoff?.length > 0) {
            const catCutoff = exam.categoryWiseCutoff.find((c: any) =>
                c.category?.toUpperCase() === candidateCategory?.toUpperCase()
            );
            if (catCutoff && catCutoff.cutoffPercent !== undefined && catCutoff.cutoffPercent !== null) {
                categoryCutoffStatus = percentage >= Number(catCutoff.cutoffPercent) ? "QUALIFIED" : "NOT_QUALIFIED";
            }
        }

        // Sectional
        let sectionalCutoffStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE" = "NOT_APPLICABLE";
        let failedSectional = false;
        const subjectWiseBreakdown: any[] = [];
        for (const [subId, se] of subjectBreakdownMap.entries()) {
            const cfg = examSubjectConfigMap.get(subId);
            const cutoff = cfg?.sectionalCutoff ?? null;
            let sectionalStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE" = "NOT_APPLICABLE";
            if (exam.sectionalCutoffEnabled && cutoff !== null) {
                sectionalStatus = se.marksObtained >= cutoff ? "QUALIFIED" : "NOT_QUALIFIED";
                if (sectionalStatus === "NOT_QUALIFIED") failedSectional = true;
            }
            subjectWiseBreakdown.push({
                subjectId: se.subjectId,
                subjectName: se.subjectName,
                questionsAttempted: se.questionsAttempted,
                correctAnswers: se.correctAnswers,
                wrongAnswers: se.wrongAnswers,
                marksObtained: se.marksObtained,
                maxMarks: se.maxMarks,
                sectionalCutoff: cutoff,
                sectionalStatus,
            });
        }
        if (exam.sectionalCutoffEnabled) {
            sectionalCutoffStatus = failedSectional ? "NOT_QUALIFIED" : "QUALIFIED";
        }

        // Part/Group
        let groupCutoffStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE" = "NOT_APPLICABLE";
        let failedGroup = false;
        const partWiseBreakdown: any[] = [];
        if (exam.partWiseCutoffEnabled && Array.isArray(exam.parts) && exam.parts.length > 0) {
            for (const part of exam.parts) {
                const relevantSubs = subjectWiseBreakdown.filter((s: any) =>
                    part.subjectIds?.some((id: any) => String(id) === String(s.subjectId))
                );
                const partMarks = relevantSubs.reduce((sum: number, s: any) => sum + s.marksObtained, 0);
                const partMaxMarks = relevantSubs.reduce((sum: number, s: any) => sum + s.maxMarks, 0);
                let passed = true;
                if (part.cutoffType === "PERCENTAGE" && partMaxMarks > 0) {
                    passed = (partMarks / partMaxMarks) * 100 >= part.cutoffValue;
                } else {
                    passed = partMarks >= part.cutoffValue;
                }
                if (!passed) failedGroup = true;
                partWiseBreakdown.push({
                    partName: part.partName,
                    subjectIds: part.subjectIds,
                    marksObtained: partMarks,
                    maxMarks: partMaxMarks,
                    cutoffType: part.cutoffType || "MARKS",
                    cutoffValue: part.cutoffValue,
                    partStatus: passed ? "QUALIFIED" : "NOT_QUALIFIED"
                });
            }
            groupCutoffStatus = failedGroup ? "NOT_QUALIFIED" : "QUALIFIED";
        }

        const anyFail = overallCutoffStatus === "NOT_QUALIFIED"
            || categoryCutoffStatus === "NOT_QUALIFIED"
            || sectionalCutoffStatus === "NOT_QUALIFIED"
            || groupCutoffStatus === "NOT_QUALIFIED";

        const passStatus = anyFail ? "FAILED" : "PASSED";

        const attemptedQuestions = correctCount + wrongCount;

        console.log(`[EVAL DONE] Marks: ${finalScore}/${totalMarks}, %: ${percentage}`);

        return {
            attemptedQuestions,
            correctAnswers: correctCount,
            wrongAnswers: wrongCount,
            unansweredQuestions: unansweredCount,
            totalMarks,
            marksObtained: finalScore,
            negativeMarks: negativeScore,
            percentage,
            passStatus,
            category: candidateCategory,
            subjectWiseBreakdown,
            partWiseBreakdown,
            overallCutoffStatus,
            categoryCutoffStatus,
            sectionalCutoffStatus,
            groupCutoffStatus,
            sectionalCutoffApplied: !!exam.sectionalCutoffEnabled,
            partWiseCutoffApplied: !!exam.partWiseCutoffEnabled,
            categoryWiseCutoff: exam.categoryWiseCutoff || []
        };
    }

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
        
        const Exam = mongoose.models.Exam || mongoose.models.exam;
        const exam = await Exam.findById(examId);
        if (!exam) {
            return { generated: false, examId, message: "Exam not found" };
        }

        const submissions = await ExamSubmission.find({
            examId,
            submissionStatus: { $in: [SubmissionStatus.SUBMITTED, SubmissionStatus.AUTO_SUBMITTED] }
        });

        const CandidateExamAnswer = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
        // Query with both ObjectId and string examId since data may store either format
        const candidateAnswers = await CandidateExamAnswer.find({ 
            $or: [{ examId }, { examId: String(examId) }],
            submitReason: { $exists: true } 
        }).lean();

        if (!submissions.length && !candidateAnswers.length) {
            return {
                generated: false,
                examId,
                generatedBy,
                message: "No submitted candidates found for evaluation."
            };
        }

        // Pre-fetch Exam Subject Config ONCE
        const examSubjectConfigMap = new Map<string, any>();
        for (const s of (exam.subjects || [])) {
            if (s.subjectId) {
                const subjectDoc = await mongoose.model("Subject").findById(s.subjectId).lean() as any;
                const numQ = Number(s.questions) || 0;
                const marksPerQ = Number(s.marksPerQuestion) || 0;
                const negMarksPerQ = Number(s.negativeMarksPerQuestion) || 0;
                const maxM = numQ * marksPerQ;
                examSubjectConfigMap.set(String(s.subjectId), {
                    subjectId: s.subjectId,
                    subjectName: subjectDoc?.name || subjectDoc?.subjectName || s.name || "Unknown",
                    marksPerQuestion: marksPerQ,
                    negativeMarksPerQuestion: negMarksPerQ,
                    questions: numQ,
                    maxMarks: maxM,
                    sectionalCutoff: (s.sectionalCutoff !== undefined && s.sectionalCutoff !== null) ? Number(s.sectionalCutoff) : null,
                });
            }
        }

        let generatedCount = 0;
        const evaluatedCandidates = new Set<string>();

        for (const submission of submissions) {
            const candIdStr = String(submission.candidateId);
            if (evaluatedCandidates.has(candIdStr)) continue;
            evaluatedCandidates.add(candIdStr);

            const answers = await CandidateAnswer.find({
                examId,
                candidateId: submission.candidateId
            }).lean();

            let extractedAnswers: any[] = [];
            for (const a of answers as any[]) {
                if (a.results && Array.isArray(a.results)) {
                    for (const res of a.results) {
                        const statusLower = (res.status || "").toLowerCase();
                        extractedAnswers.push({
                            questionId: String(res.questionId),
                            candidateAnswer: res.candidateAnswer ?? res.selectedOption ?? res.selectedOptions ?? res.numericalAnswer ?? null,
                            isAnswered: statusLower === "answered" || statusLower === "marked for review" || !!(res.isAnswered),
                            status: res.status,
                            options: res.options,
                            correctAnswer: res.correctAnswer,
                            questionType: res.questionType,
                            marks: res.marks,
                            negativeMarks: res.negativeMarks,
                        });
                    }
                } else if (a.questionId) {
                    const statusLower = (a.questionStatus || a.status || "").toLowerCase();
                    extractedAnswers.push({
                        questionId: String(a.questionId),
                        candidateAnswer: a.selectedOption ?? a.selectedOptions ?? a.numericalAnswer ?? a.candidateAnswer ?? null,
                        isAnswered: statusLower === "answered" || statusLower === "marked for review" || !!(a.isAnswered),
                        status: a.questionStatus || a.status,
                    });
                }
            }

            const resultData = await this.authoritativeEvaluate(
                examId,
                candIdStr,
                extractedAnswers,
                exam,
                examSubjectConfigMap
            );

            await Result.findOneAndUpdate(
                { examId, candidateId: submission.candidateId },
                { $set: {
                    attendanceId: submission.attendanceId,
                    submissionId: submission._id,
                    candidateId: submission.candidateId,
                    candidateAssignmentId: submission.candidateAssignmentId,
                    examId: submission.examId,
                    paperId: submission.paperId,
                    subjectId: submission.subjectId,
                    companyId: submission.companyId,
                    examCenterId: submission.examCenterId,
                    examRoomId: submission.examRoomId,
                    ...resultData,
                    resultStatus: ResultStatus.EVALUATED,
                    evaluationMethod: EvaluationMethod.AUTO,
                    generatedBy,
                    createdBy: generatedBy,
                } },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
            
            generatedCount++;
        }

        for (const ca of candidateAnswers) {
            const candIdStr = String(ca.candidateId);
            if (evaluatedCandidates.has(candIdStr)) continue;
            evaluatedCandidates.add(candIdStr);

            const resultData = await this.authoritativeEvaluate(
                examId,
                candIdStr,
                (ca.results || []).map((a: any) => {
                    const statusLower = (a.status || "").toLowerCase();
                    return {
                        questionId: String(a.questionId),
                        candidateAnswer: a.candidateAnswer ?? a.selectedOption ?? a.selectedOptions ?? a.numericalAnswer ?? null,
                        isAnswered: statusLower === "answered" || statusLower === "marked for review" || !!(a.isAnswered),
                        status: a.status,
                        options: a.options,
                        correctAnswer: a.correctAnswer,
                        questionType: a.questionType,
                        marks: a.marks,
                        negativeMarks: a.negativeMarks,
                    };
                }),
                exam,
                examSubjectConfigMap
            );

            await Result.findOneAndUpdate(
                { examId, candidateId: ca.candidateId },
                { $set: {
                    submissionId: ca.submissionId || ca._id,
                    candidateId: ca.candidateId,
                    examId: ca.examId,
                    paperId: exam?.finalPaperId || exam?.paperId,
                    subjectId: exam.subjectId,
                    companyId: exam.companyId,
                    ...resultData,
                    resultStatus: ResultStatus.EVALUATED,
                    evaluationMethod: EvaluationMethod.AUTO,
                    generatedBy,
                    createdBy: generatedBy,
                } },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );

            generatedCount++;
        }

        if (generatedCount > 0) {
            await Exam.findByIdAndUpdate(examId, { isResultGenerated: true });
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
            .lean();

        if (!result) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Result not found");
        }

        let cName = '';
        let cAppNo = 'N/A';
        let cPhoto = '';
        let cId = (result.candidateId as any)?._id || result.candidateId;

        const ImportCandidate = mongoose.models.ImportCandidate || mongoose.model("ImportCandidate", new mongoose.Schema({}, { strict: false, collection: 'importcandidate' }));
        const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", new mongoose.Schema({}, { strict: false, collection: 'candidates' }));

        let cand: any = null;
        if (cId) {
            cand = await Candidate.findById(cId).lean();
            if (!cand) {
                cand = await ImportCandidate.findById(cId).lean();
            }
        }

        if (cand) {
            if (cand.firstName || cand.candidateFullName || cand.fullName || cand.name) {
                cName = cand.firstName ? `${cand.firstName} ${cand.lastName || ''}`.trim() : '';
                cName = cName || cand.candidateFullName || cand.fullName || cand.name || '';
                cAppNo = cand.applicationNumber || cand.enrollmentNo || cand.applicationNo || cAppNo;
                cPhoto = cand.photo || cand.candidatePhoto || cand.photoUrl || cand.profilePhoto || '';
            }
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
            if (candAns) {
                if (!cName) {
                    cName = candAns.name || candAns.candidateName || candAns.fullName || '';
                    cAppNo = candAns.applicationNo || candAns.applicationNumber || cAppNo;
                }
                if (!cPhoto) {
                    cPhoto = candAns.photo || candAns.photoUrl || candAns.candidatePhoto || candAns.profilePhoto || cPhoto;
                }
            }
        }
        
        
        const Exam = mongoose.models.Exam || mongoose.models.exam;
        const examObj = (await Exam.findById(result.examId).lean()) as any;
        const examSubjectConfigMap = new Map<string, any>();
        if (examObj && examObj.subjects) {
            for (const s of examObj.subjects) {
                if (s.subjectId) {
                    const marksPerQ = (s.marksPerQuestion !== undefined && s.marksPerQuestion !== null && s.marksPerQuestion !== "") ? Number(s.marksPerQuestion) : 0;
                    const negMarksPerQ = (s.negativeMarksPerQuestion !== undefined && s.negativeMarksPerQuestion !== null && s.negativeMarksPerQuestion !== "") ? Number(s.negativeMarksPerQuestion) : 0;
                    examSubjectConfigMap.set(String(s.subjectId), { marks: marksPerQ, negativeMarks: negMarksPerQ });
                }
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
                    correctAnswerText = question.correctAnswer.map((ansLetter: string) => {
                        const opt = (question.options || []).find((o: any) => o.optionId === ansLetter || o.optionLabel === ansLetter);
                        return opt?.optionText ? `${ansLetter} - ${opt.optionText.replace(/<[^>]*>?/gm, '')}` : ansLetter;
                    }).join(', ');
                    
                    if (question.questionType === "SINGLE_CHOICE" || question.questionType === "TRUE_FALSE") {
                        const ansLetter = answer.selectedOption || '';
                        const opt = (question.options || []).find((o: any) => o.optionId === ansLetter || o.optionLabel === ansLetter);
                        selectedAnswerText = opt?.optionText ? `${ansLetter} - ${opt.optionText.replace(/<[^>]*>?/gm, '')}` : ansLetter;
                        isCorrect = question.correctAnswer.includes(ansLetter);
                    } else if (question.questionType === "MULTIPLE_CHOICE") {
                        const selectedLetters = answer.selectedOptions || [];
                        selectedAnswerText = selectedLetters.map((ansLetter: string) => {
                            const opt = (question.options || []).find((o: any) => o.optionId === ansLetter || o.optionLabel === ansLetter);
                            return opt?.optionText ? `${ansLetter} - ${opt.optionText.replace(/<[^>]*>?/gm, '')}` : ansLetter;
                        }).join(', ');

                        const correctAns = [...question.correctAnswer].sort().join(",");
                        const selectedAns = [...selectedLetters].sort().join(",");
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
                    marks: isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : 0) : 0,
                    negativeMarks: (!isCorrect && answer.isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : 0) : 0
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
                     correctAnswerText = correctOptions.map((opt: any) => {
                         const txt = opt.optionText || opt.text;
                         return txt ? `${opt.optionId} - ${txt.replace(/<[^>]*>?/gm, '')}` : opt.optionId;
                     }).join(', ');
                     
                     const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer : [res.candidateAnswer];
                     selectedAnswerText = selectedOptions.map((optId: any) => {
                         const opt = res.options.find((o: any) => o.optionId === optId);
                         const txt = opt?.optionText || opt?.text;
                         return txt ? `${optId} - ${txt.replace(/<[^>]*>?/gm, '')}` : optId;
                     }).join(', ');
                     
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
                     marks = isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : 0) : 0;
                     negativeMarks = (!isCorrect && isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : 0) : 0;
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
