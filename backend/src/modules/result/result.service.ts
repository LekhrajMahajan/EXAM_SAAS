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
import Question from "../question-bank/question.model";
import PaperQuestion from "../paper-question/paperQuestion.model";
import ExamSubmission from "../exam-submission/examSubmission.model";
import CandidateAnswer from "../candidate-answer/candidateAnswer.model";
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
        answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status?: string; options?: any[]; correctAnswer?: any; questionType?: string; marks?: number; negativeMarks?: number; subjectId?: any; isCorrect?: boolean; subjectName?: string; }>,
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
            let idx = 0;
            for (const s of (exam.subjects || [])) {
                idx++;
                const key = String(s.subjectId || s._id || s.name || idx);
                const subjectDoc = s.subjectId ? await mongoose.model("Subject").findById(s.subjectId).lean() as any : null;
                const numQ = Number(s.questions) || 0;
                
                if (s.marksPerQuestion === undefined || s.marksPerQuestion === null || s.marksPerQuestion === "") {
                    // Fall back to 1 for resilience against legacy data
                    s.marksPerQuestion = 1;
                }
                const marksPerQ = Number(s.marksPerQuestion);
                if (marksPerQ < 0) throw new Error(`marksPerQuestion cannot be negative for subject: ${key}`);

                // Subject-level negativeMarksPerQuestion OR fall back to exam-level negativeMarks field
                const examLevelNegMarks = Number(exam.negativeMarks) || 0;
                const subjectNegMarks = (s.negativeMarksPerQuestion !== undefined && s.negativeMarksPerQuestion !== null && s.negativeMarksPerQuestion !== "" && Number(s.negativeMarksPerQuestion) > 0)
                    ? Number(s.negativeMarksPerQuestion)
                    : examLevelNegMarks;
                const negMarksPerQ = subjectNegMarks;
                const maxM = numQ * marksPerQ;
                
                examSubjectConfigMap.set(key, {
                    subjectId: key,
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
                // Initialize totalQuestions directly from exam config (reliable fallback)
                // Will be overridden by actual PaperQuestion count if available
                totalQuestions: cfg.questions || 0,
                questionsAttempted: 0,
                unansweredQuestions: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                correctMarks: 0,
                negativeMarks: 0,
                marksObtained: 0,
                maxMarks: cfg.maxMarks,
            });
        }

        console.log(`[EVAL START] Candidate: ${candidateId} | Exam: ${examId}`);
        console.log(`[EVAL CONFIG] Subjects loaded: ${examSubjectConfigMap.size}`);
        for (const [subId, cfg] of examSubjectConfigMap.entries()) {
            console.log(`  Subject ${cfg.subjectName} (${subId}): marks=${cfg.marksPerQuestion}, negMarks=${cfg.negativeMarksPerQuestion}`);
        }

        // PRE-BUILD: questionId -> subjectConfig map from PaperQuestion collection
        // This is the AUTHORITATIVE mapping - PaperQuestion links questions to exam subjects
        const qIdToSubjCfg = new Map<string, any>();
        const pqIdToMasterQ = new Map<string, any>();
        try {
            const paperId = exam.finalPaperId || exam.paperId;
            if (paperId && PaperQuestion) {
                const paperQs = await PaperQuestion.find({ paperId }).populate({
                    path: "questionId",
                    populate: { path: "subjectId", select: "name subjectName" }
                }).lean() as any[];
                console.log(`[EVAL] PaperQuestions found: ${paperQs.length} for paperId: ${paperId}`);
                for (const pq of paperQs) {
                    const masterQ = pq.questionId || {};
                    const qIdStr = String(masterQ._id || pq.questionId);
                    
                    // Match by subjectId first if available
                    let mappedCfg = null;
                    const pqSubId = masterQ.subjectId || pq.subjectId;
                    if (pqSubId && examSubjectConfigMap.has(String(pqSubId))) {
                        mappedCfg = examSubjectConfigMap.get(String(pqSubId));
                    } 
                    if (!mappedCfg) {
                        const secLower = (pq.sectionCode || "").toString().toLowerCase().trim();
                        const masterSubjName = (masterQ.subjectId && typeof masterQ.subjectId === 'object' ? (masterQ.subjectId.name || masterQ.subjectId.subjectName || "") : "").toString().toLowerCase().trim();
                        for (const [k, cfg] of examSubjectConfigMap.entries()) {
                            if ((secLower && String(cfg.subjectName).toLowerCase().trim() === secLower) || 
                                (masterSubjName && String(cfg.subjectName).toLowerCase().trim() === masterSubjName) || 
                                (pqSubId && k === String(pqSubId))) {
                                mappedCfg = cfg;
                                break;
                            }
                        }
                    }
                    if (mappedCfg) {
                        qIdToSubjCfg.set(qIdStr, mappedCfg);
                        if (pq._id) {
                            qIdToSubjCfg.set(String(pq._id), mappedCfg);
                            pqIdToMasterQ.set(String(pq._id), masterQ);
                        }
                        // Note: totalQuestions is already initialized from cfg.questions (exam config)
                        // so we don't need to increment here to avoid double-counting
                    }
                }
                console.log(`[EVAL] Mapped ${qIdToSubjCfg.size} questions to subject configs via PaperQuestion`);
            }
        } catch (pqErr) {
            console.warn('[EVAL] PaperQuestion pre-fetch failed:', pqErr);
        }

        // PRE-FETCH: all question documents in ONE batch query
        const allQuestionIds = answerItems.map(i => {
            const pqMaster = pqIdToMasterQ.get(String(i.questionId));
            return pqMaster ? String(pqMaster._id || pqMaster) : String(i.questionId);
        }).filter(Boolean);
        const questionDocs: any[] = Question ? await Question.find({ _id: { $in: allQuestionIds } }).populate("subjectId", "name subjectName").lean() : [];
        const questionDocMap = new Map<string, any>();
        for (const q of questionDocs) {
            questionDocMap.set(String(q._id), q);
        }
        console.log(`[EVAL] Questions fetched from DB: ${questionDocs.length} of ${allQuestionIds.length}`);

        // Get first subject config as universal fallback for any unmatched question
        const firstSubjCfg = examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0] : null;
        console.log(`[EVAL] Fallback subject config: marks=${firstSubjCfg?.marksPerQuestion}, negMarks=${firstSubjCfg?.negativeMarksPerQuestion}`);

        for (const item of answerItems) {
            // Detect not-attempted
            const statusLower = (item.status || "").toLowerCase();
            const notAttempted = item.candidateAnswer === null || item.candidateAnswer === undefined 
                || statusLower === "not_visited" || statusLower === "not answered" || statusLower === "not visited"
                || (!item.isAnswered && statusLower !== "answered" && statusLower !== "marked for review");

            // Get question from pre-fetched batch
            const resolvedMasterId = pqIdToMasterQ.has(String(item.questionId)) 
                ? String(pqIdToMasterQ.get(String(item.questionId))._id) 
                : String(item.questionId);
            let question = questionDocMap.get(resolvedMasterId);

            // If not in DB, build virtual question from embedded options
            if (!question && item.options && Array.isArray(item.options)) {
                const correctOptions = item.options.filter((o: any) => o.isCorrect).map((o: any) => o.optionId || o.optionLabel);
                question = {
                    _id: item.questionId,
                    questionType: item.questionType || "SINGLE_CHOICE",
                    correctAnswer: (item.correctAnswer && item.correctAnswer.length > 0) ? item.correctAnswer : correctOptions,
                    options: item.options,
                    subjectId: null,
                };
            }

            if (!question) {
                unansweredCount++;
                continue;
            }

            if (notAttempted) {
                unansweredCount++;
                
                // We skip unanswered questions here and calculate them mathematically at the end
                continue;
            }

            // RESOLVE subject config: PaperQuestion map first, then question.subjectId, then fallback
            const qIdStr = String(item.questionId);
            let subjCfg = qIdToSubjCfg.get(qIdStr);
            if (!subjCfg && question.subjectId) {
                const qSubjIdStr = String(question.subjectId._id || question.subjectId);
                subjCfg = examSubjectConfigMap.get(qSubjIdStr);
            }
            if (!subjCfg) {
                const qSecLower = (question.sectionCode || "").toString().toLowerCase().trim();
                const qSubjName = (question.subjectId && typeof question.subjectId === 'object' ? (question.subjectId.name || question.subjectId.subjectName || "") : "").toString().toLowerCase().trim();
                for (const [k, cfg] of examSubjectConfigMap.entries()) {
                    if ((qSecLower && String(cfg.subjectName).toLowerCase().trim() === qSecLower) || 
                        (qSubjName && String(cfg.subjectName).toLowerCase().trim() === qSubjName) || 
                        (question.subjectId && k === String(question.subjectId._id || question.subjectId))) {
                        subjCfg = cfg;
                        break;
                    }
                }
            }
            if (!subjCfg) {
                subjCfg = firstSubjCfg; // Always fall back to first subject config
            }

            const examLevelMarks = Number((exam as any).marksPerQuestion) || Number((exam as any).marks) || 1;
            const examLevelNeg = Number((exam as any).negativeMarks) || 0;
            
            const marksForQ: number = (subjCfg?.marksPerQuestion !== undefined && subjCfg?.marksPerQuestion !== null) ? Number(subjCfg.marksPerQuestion) : examLevelMarks;
            const penaltyForQ: number = (subjCfg?.negativeMarksPerQuestion !== undefined && subjCfg?.negativeMarksPerQuestion !== null) ? Number(subjCfg.negativeMarksPerQuestion) : examLevelNeg;
            let se: any = null;
            if (subjCfg && subjectBreakdownMap.has(String(subjCfg.subjectId))) {
                se = subjectBreakdownMap.get(String(subjCfg.subjectId));
            } else {
                const firstSubId = subjectBreakdownMap.keys().next().value;
                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);
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

            item.isCorrect = isCorrect;
            item.marks = marksForQ;
            item.negativeMarks = penaltyForQ;
            
            let correctAnsText = "";
            if (question.correctAnswer && question.correctAnswer.length > 0) {
                correctAnsText = [...question.correctAnswer].join(", ");
            } else if (question.options && Array.isArray(question.options)) {
                correctAnsText = question.options.filter((o: any) => o.isCorrect).map((o: any) => o.optionId || o.optionLabel).join(", ");
            }
            item.correctAnswer = correctAnsText;
            item.subjectName = se ? se.subjectName : "Unknown Subject";

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
            // Calculate unanswered questions strictly from total - attempted
            if (se.totalQuestions > 0) {
                se.unansweredQuestions = Math.max(0, se.totalQuestions - se.questionsAttempted);
            }
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
                totalQuestions: se.totalQuestions || 0,
                questionsAttempted: se.questionsAttempted,
                unansweredQuestions: se.unansweredQuestions || 0,
                correctAnswers: se.correctAnswers,
                wrongAnswers: se.wrongAnswers,
                correctMarks: se.correctMarks,
                negativeMarks: se.negativeMarks,
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
        const passStatus = anyFail ? PassStatus.FAILED : PassStatus.PASSED;

        const attemptedQuestions = correctCount + wrongCount;

        console.log(`[EVAL DONE] Marks: ${finalScore}/${totalMarks}, %: ${percentage}`);

        return {
            totalQuestions: totalQuestionsConfig || (exam.totalQuestions || 0),
            attemptedQuestions,
            correctAnswers: correctCount,
            wrongAnswers: wrongCount,
            unansweredQuestions: unansweredCount,
            totalMarks,
            marksObtained: finalScore,
            correctMarks: correctScore,
            negativeMarks: negativeScore,
            percentage,
            passStatus: passStatus as PassStatus,
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
        const result = await super.getById(resultId);
        const subId = (result.submissionId as any)?._id || result.submissionId;
        const CandidateExamAnswerModel = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
        const candAnsDoc = await CandidateExamAnswerModel.findOne({ 
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
            console.warn("Candidate answers not found in candidateexamanswer collection for submission:", result.submissionId);
        }

        let extractedAnswers: any[] = [];
        for (const res of candidateAnswers) {
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

        const examIdStr = (result.examId as any)?._id ? String((result.examId as any)._id) : String(result.examId);
        const candIdStr = (result.candidateId as any)?._id ? String((result.candidateId as any)._id) : String(result.candidateId);

        const resultData = await this.authoritativeEvaluate(
            examIdStr,
            candIdStr,
            extractedAnswers
        );

        // Update the CandidateExamAnswer with evaluated marks
        await CandidateExamAnswerModel.updateOne(
            { $or: [{ _id: subId }, { submissionId: subId }, { _id: String(subId) }, { submissionId: String(subId) }] },
            { $set: { results: extractedAnswers } }
        );

        return super.update(
            resultId,
            {
                ...resultData,
                resultStatus: ResultStatus.EVALUATED,
                evaluatedAt: new Date(),
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
        }).sort({ _id: -1 }).lean();

        const CandidateExamAnswer = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
        // Query with both ObjectId and string examId since data may store either format
        const candidateAnswers = await CandidateExamAnswer.find({ 
            $or: [{ examId }, { examId: String(examId) }],
            submitReason: { $exists: true } 
        }).sort({ _id: -1 }).lean();

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
        let idx = 0;
        for (const s of (exam.subjects || [])) {
            idx++;
            const key = String(s.subjectId || s._id || s.name || idx);
            const subjectDoc = s.subjectId ? await mongoose.model("Subject").findById(s.subjectId).lean() as any : null;
            const numQ = Number(s.questions) || 0;
            
            if (s.marksPerQuestion === undefined || s.marksPerQuestion === null || s.marksPerQuestion === "") {
                s.marksPerQuestion = 1;
            }
            const marksPerQ = Number(s.marksPerQuestion);
            const examLevelNegMarks2 = Number(exam.negativeMarks) || 0;
            const subjectNegMarks2 = (s.negativeMarksPerQuestion !== undefined && s.negativeMarksPerQuestion !== null && Number(s.negativeMarksPerQuestion) > 0)
                ? Number(s.negativeMarksPerQuestion)
                : examLevelNegMarks2;
            const negMarksPerQ = subjectNegMarks2;
            const maxM = numQ * marksPerQ;
            
            examSubjectConfigMap.set(key, {
                subjectId: key,
                subjectName: subjectDoc?.name || subjectDoc?.subjectName || s.name || "Unknown",
                marksPerQuestion: marksPerQ,
                negativeMarksPerQuestion: negMarksPerQ,
                questions: numQ,
                maxMarks: maxM,
                sectionalCutoff: (s.sectionalCutoff !== undefined && s.sectionalCutoff !== null) ? Number(s.sectionalCutoff) : null,
            });
        }

        let generatedCount = 0;
        const evaluatedCandidates = new Set<string>();

        for (const submission of submissions) {
            if (String(submission.examId) !== String(examId) && String(submission.examId) !== String((exam as any)._id)) {
                continue;
            }
            const candIdStr = String(submission.candidateId);
            if (evaluatedCandidates.has(candIdStr)) continue;
            evaluatedCandidates.add(candIdStr);

            const subId = (submission as any).submissionId || submission._id;
            const CandidateExamAnswerModel = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
            const candAns = await CandidateExamAnswerModel.findOne({
                $or: [{ _id: subId }, { submissionId: subId }, { _id: String(subId) }, { submissionId: String(subId) }]
            }).lean();

            let extractedAnswers: any[] = [];
            if (candAns && (candAns as any).results && Array.isArray((candAns as any).results)) {
                for (const res of (candAns as any).results) {
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
            }

            const resultData = await this.authoritativeEvaluate(
                examId,
                candIdStr,
                extractedAnswers,
                exam,
                examSubjectConfigMap
            );

            // Update the CandidateExamAnswer with evaluated marks
            await CandidateExamAnswerModel.updateOne(
                { $or: [{ _id: subId }, { submissionId: subId }, { _id: String(subId) }, { submissionId: String(subId) }] },
                { $set: { results: extractedAnswers } }
            );

            await Result.findOneAndUpdate(
                { examId, candidateId: submission.candidateId },
                { $set: {
                    attendanceId: submission.attendanceId,
                    submissionId: submission._id,
                    candidateId: submission.candidateId,
                    candidateAssignmentId: submission.candidateAssignmentId,
                    examId: examId, // enforce correct examId
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
            if (String(ca.examId) !== String(examId) && String(ca.examId) !== String((exam as any)._id)) {
                continue;
            }
            const candIdStr = String(ca.candidateId);
            if (evaluatedCandidates.has(candIdStr)) continue;
            evaluatedCandidates.add(candIdStr);

            const extractedAnswers = (ca.results || []).map((a: any) => {
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
            });

            const resultData = await this.authoritativeEvaluate(
                examId,
                candIdStr,
                extractedAnswers,
                exam,
                examSubjectConfigMap
            );

            // Update CandidateExamAnswer with evaluated marks
            const subId = ca.submissionId || ca._id;
            await CandidateExamAnswer.updateOne(
                { _id: ca._id },
                { $set: { results: extractedAnswers } }
            );

            await Result.findOneAndUpdate(
                { examId, candidateId: ca.candidateId },
                { $set: {
                    submissionId: ca.submissionId || ca._id,
                    candidateId: ca.candidateId,
                    examId: examId, // enforce correct examId
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
        const examIdToFind = (result.examId as any)?._id || result.examId;
        const examObj = (await Exam.findById(examIdToFind).lean()) as any;
        const examSubjectConfigMap = new Map<string, any>();
        if (examObj && examObj.subjects) {
            const examLevelNeg = Number(examObj.negativeMarks) || 0;
            let idx = 0;
            for (const s of examObj.subjects) {
                idx++;
                const key = String(s.subjectId || s._id || s.name || idx);
                const subjectDoc = s.subjectId ? await mongoose.model("Subject").findById(s.subjectId).lean() as any : null;
                const marksPerQ = (s.marksPerQuestion !== undefined && s.marksPerQuestion !== null && s.marksPerQuestion !== "") ? Number(s.marksPerQuestion) : 0;
                // Use subject-level negativeMarksPerQuestion if > 0, else fall back to exam-level negativeMarks
                const subNeg = (s.negativeMarksPerQuestion !== undefined && s.negativeMarksPerQuestion !== null && Number(s.negativeMarksPerQuestion) > 0) ? Number(s.negativeMarksPerQuestion) : examLevelNeg;
                examSubjectConfigMap.set(key, { 
                    marks: marksPerQ, 
                    negativeMarks: subNeg,
                    subjectName: subjectDoc?.name || subjectDoc?.subjectName || s.name || s.subjectName || "Unknown Subject"
                });
            }
        }
        
        cName = cName || 'Unknown Candidate';

        const candidateAnswers = await CandidateAnswer.find({
            candidateId: result.candidateId,
            examId: result.examId
        }).lean();

        let questionsDetails: any[] = [];

        // Build PaperQuestion -> subjectConfig map for reliable question->subject resolution
        const qIdToSubjCfgForDetails = new Map<string, any>();
        const pqIdToMasterQForDetails = new Map<string, any>();
        const qIdToDisplayOrder = new Map<string, number>();
        try {
            const paperId = examObj?.finalPaperId || examObj?.paperId;
            if (paperId) {
                const PaperQuestion = mongoose.models.PaperQuestion || mongoose.models.paperquestion;
                if (PaperQuestion) {
                    const paperQs = await PaperQuestion.find({ paperId }).populate({
                        path: 'questionId',
                        populate: { path: 'subjectId', select: 'name subjectName' }
                    }).sort({ displayOrder: 1, _id: 1 }).lean() as any[];
                    let displayIdx = 0;
                    for (const pq of paperQs) {
                        displayIdx++;
                        const masterQ = pq.questionId || {};
                        const qIdStr = String(masterQ._id || pq.questionId);
                        const pqSubId = masterQ.subjectId?._id || masterQ.subjectId || pq.subjectId;
                        let mappedCfg = pqSubId ? examSubjectConfigMap.get(String(pqSubId)) : null;
                        if (!mappedCfg) {
                            const masterSubjName = (masterQ.subjectId && typeof masterQ.subjectId === 'object'
                                ? (masterQ.subjectId.name || masterQ.subjectId.subjectName || '')
                                : '').toLowerCase().trim();
                            for (const cfg of examSubjectConfigMap.values()) {
                                if (masterSubjName && String(cfg.subjectName).toLowerCase().trim() === masterSubjName) {
                                    mappedCfg = cfg;
                                    break;
                                }
                            }
                        }
                        if (pq._id) {
                            pqIdToMasterQForDetails.set(String(pq._id), masterQ);
                        }
                        
                        qIdToDisplayOrder.set(qIdStr, displayIdx);
                        if (pq._id) qIdToDisplayOrder.set(String(pq._id), displayIdx);

                        if (mappedCfg) {
                            qIdToSubjCfgForDetails.set(qIdStr, mappedCfg);
                            if (pq._id) {
                                qIdToSubjCfgForDetails.set(String(pq._id), mappedCfg);
                            }
                        }
                    }
                }
            }
        } catch (pqErr) {
            console.warn('[DETAILS] PaperQuestion map build failed:', pqErr);
        }

        // Helper: resolve subject config by questionId
        const getSubjCfg = (questionId: any, question: any) => {
            const qIdStr = String(questionId);
            let cfg = qIdToSubjCfgForDetails.get(qIdStr);
            if (!cfg && question?.subjectId) {
                const subIdStr = String((question.subjectId as any)?._id || question.subjectId);
                cfg = examSubjectConfigMap.get(subIdStr);
            }
            if (!cfg && examSubjectConfigMap.size > 0) {
                cfg = Array.from(examSubjectConfigMap.values())[0];
            }
            return cfg;
        };

        let useOldFormat = candidateAnswers.length > 0;
        // Prioritize candidateexamanswer (candAns) because that's what generateResults uses
        if (candAns && candAns.results && Array.isArray(candAns.results) && candAns.results.length > 0) {
            useOldFormat = false;
        } else if (candidateAnswers.length === 1 && (candidateAnswers[0] as any).results && Array.isArray((candidateAnswers[0] as any).results)) {
            useOldFormat = false;
        }
        
        if (useOldFormat) {
            const masterIds = candidateAnswers.map((ans: any) => {
                const pqMaster = pqIdToMasterQForDetails.get(String(ans.questionId));
                return pqMaster ? String(pqMaster._id) : String(ans.questionId);
            }).filter(Boolean);
            const questions = await Question.find({ _id: { $in: masterIds } }).populate('subjectId', 'name subjectName').lean();

            questionsDetails = candidateAnswers.map((answer: any) => {
                const pqMaster = pqIdToMasterQForDetails.get(String(answer.questionId));
                const masterId = pqMaster ? String(pqMaster._id) : String(answer.questionId);
                const question = questions.find(q => q._id.toString() === masterId);
                
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

                const subjectCfg = getSubjCfg(answer.questionId, question);
                // Derive isAnswered from actual answer content
                const actuallyAnswered = !!(answer.selectedOption || (answer.selectedOptions && answer.selectedOptions.length > 0) || answer.numericalAnswer !== undefined);
                
                const examLevelMarks = Number((examObj as any).marksPerQuestion) || Number((examObj as any).marks) || 1;
                const examLevelNeg = Number((examObj as any).negativeMarks) || 0;
                const configMarks = (subjectCfg?.marks !== undefined && subjectCfg?.marks !== null) ? Number(subjectCfg.marks) : examLevelMarks;
                const configNeg = (subjectCfg?.negativeMarks !== undefined && subjectCfg?.negativeMarks !== null) ? Number(subjectCfg.negativeMarks) : examLevelNeg;

                return {
                    questionId: answer.questionId,
                    questionText: question ? (question.question || 'Q_FOUND_BUT_EMPTY_TEXT') : ('DEBUG_Q_NOT_FOUND: pqMaster=' + !!pqMaster + ' masterId=' + masterId),
                    questionType: answer.questionType || (question as any)?.questionType,
                    isAnswered: actuallyAnswered,
                    selectedAnswer: selectedAnswerText,
                    correctAnswer: correctAnswerText,
                    isCorrect,
                    marks: isCorrect ? configMarks : 0,
                    negativeMarks: (!isCorrect && actuallyAnswered) ? configNeg : 0,
                    subjectName: subjectCfg?.subjectName || 'Unknown Subject',
                };
            });
        } else if (candAns && candAns.results && Array.isArray(candAns.results)) {
            // Resolve PaperQuestion IDs to master Question IDs
            const resultsData = candAns.results;
            const masterIds = resultsData.map((res: any) => {
                const pqMaster = pqIdToMasterQForDetails.get(String(res.questionId));
                return pqMaster ? String(pqMaster._id) : String(res.questionId);
            }).filter(Boolean);
            const questionsForPath2 = await Question.find({ _id: { $in: masterIds } }).populate('subjectId', 'name subjectName').lean();
            const questionDocMap2 = new Map<string, any>();
            for (const q of questionsForPath2) questionDocMap2.set(String(q._id), q);
            questionsDetails = resultsData.map((res: any) => {
                const pqMaster = pqIdToMasterQForDetails.get(String(res.questionId));
                const masterId = pqMaster ? String(pqMaster._id) : String(res.questionId);
                const question = questionDocMap2.get(masterId);
                
                const statusLower = (res.status || "").toLowerCase();
                const isAnswered = statusLower !== "not_visited" && statusLower !== "not visited" &&
                    res.candidateAnswer !== null && res.candidateAnswer !== undefined &&
                    !(Array.isArray(res.candidateAnswer) && res.candidateAnswer.length === 0);
                let isCorrect = false;
                let correctAnswerText = '';
                let selectedAnswerText = '';
                const qType = res.questionType || (question as any)?.questionType;

                if (res.options && Array.isArray(res.options)) {
                     const correctOptions = res.options.filter((opt: any) => opt.isCorrect);
                     correctAnswerText = correctOptions.map((opt: any) => {
                         const txt = opt.optionText || opt.text;
                         return txt ? `${opt.optionId} - ${txt.replace(/<[^>]*>?/gm, '')}` : opt.optionId;
                     }).join(', ');
                     
                     const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer : (res.candidateAnswer ? [res.candidateAnswer] : []);
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
                     correctAnswerText = (question as any).correctAnswer?.join(', ') || '';
                     const selectedOptions = Array.isArray(res.candidateAnswer) ? res.candidateAnswer.map(String) : (res.candidateAnswer ? [String(res.candidateAnswer)] : []);
                     selectedAnswerText = selectedOptions.join(', ');
                     if (qType === "SINGLE_CHOICE" || qType === "TRUE_FALSE") {
                          isCorrect = (question as any).correctAnswer?.includes(selectedOptions[0]) || false;
                     } else if (qType === "MULTIPLE_CHOICE") {
                          const correctAns = [...((question as any).correctAnswer || [])].sort().join(",");
                          const selectedAns = [...selectedOptions].sort().join(",");
                          isCorrect = correctAns === selectedAns && correctAns.length > 0;
                     }
                }

                // Use reliable PaperQuestion-based subject config lookup
                const subjectCfg = getSubjCfg(res.questionId, question);
                
                // IMPORTANT: In getDetails, the marks MUST be exactly what authoritativeEvaluate uses.
                // We do NOT use res.marks because it might be stale.
                const examLevelMarks = Number((examObj as any).marksPerQuestion) || Number((examObj as any).marks) || 1;
                const examLevelNeg = Number((examObj as any).negativeMarks) || 0;
                const configMarks = (subjectCfg?.marks !== undefined && subjectCfg?.marks !== null) ? Number(subjectCfg.marks) : examLevelMarks;
                const configNeg = (subjectCfg?.negativeMarks !== undefined && subjectCfg?.negativeMarks !== null) ? Number(subjectCfg.negativeMarks) : examLevelNeg;

                const marks = isCorrect ? configMarks : 0;
                const negativeMarks = (!isCorrect && isAnswered) ? configNeg : 0;
                const finalSubjectName = subjectCfg?.subjectName || res.subjectName || 'Unknown Subject';

                return {
                    questionId: res.questionId,
                    questionText: res.questionText || (question as any)?.question || 'Unknown Question',
                    questionType: qType,
                    isAnswered,
                    selectedAnswer: selectedAnswerText,
                    correctAnswer: correctAnswerText,
                    isCorrect,
                    marks,
                    negativeMarks,
                    subjectName: finalSubjectName,
                };
            });
        }

        // Fix the shuffle misalignment bug by enforcing the paper's original question order
        questionsDetails.sort((a, b) => {
            const orderA = qIdToDisplayOrder.get(String(a.questionId)) ?? 999999;
            const orderB = qIdToDisplayOrder.get(String(b.questionId)) ?? 999999;
            if (orderA !== orderB) return orderA - orderB;
            
            // Fallback grouping by subject, then question text
            const subjA = a.subjectName || '';
            const subjB = b.subjectName || '';
            if (subjA !== subjB) return subjA.localeCompare(subjB);
            
            const textA = a.questionText || '';
            const textB = b.questionText || '';
            return textA.localeCompare(textB);
        });

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
                negativeMarks: result.negativeMarks,
                correctMarks: (result as any).correctMarks
            },
            grade: result.percentage >= 90 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 70 ? 'B' : result.percentage >= 60 ? 'C' : 'D',
            status: result.resultStatus,
            subjectWiseBreakdown: result.subjectWiseBreakdown,
            partWiseBreakdown: result.partWiseBreakdown,
            sectionalCutoffApplied: result.sectionalCutoffApplied,
            partWiseCutoffApplied: result.partWiseCutoffApplied,
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
