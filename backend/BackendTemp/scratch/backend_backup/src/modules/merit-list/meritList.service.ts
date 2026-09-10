import mongoose, { ClientSession } from "mongoose";
import crypto from "crypto";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import resultService from "../result/result.service";
import certificateService from "../certificate/certificate.service";

import meritListRepository, {
    MeritListQuery,
} from "./meritList.repository";

import {
    IMeritList,
    MeritStatus,
} from "./meritList.types";
import { BaseService } from "../../common/base.service";

class MeritListService extends BaseService<IMeritList> {
    constructor() {
        super(meritListRepository, "MeritList");
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Merit List
    |--------------------------------------------------------------------------
    */

    private async validateMeritList(
        meritId: string
    ) {

        const merit =
            await meritListRepository.findById(
                meritId
            );

        if (!merit) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "Merit list record not found."

            );

        }

        return merit;

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Result
    |--------------------------------------------------------------------------
    */

    private async validateResult(
        resultId: string
    ) {

        return resultService.getById(
            resultId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Certificate
    |--------------------------------------------------------------------------
    */

    private async validateCertificate(
        resultId: string
    ) {

        const certificate =
            await certificateService.getByResult(
                resultId
            );

        if (!certificate) {
            return null;
        }

        return certificate;

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Merit Number
    |--------------------------------------------------------------------------
    */

    private generateMeritNumber() {

        const year =
            new Date().getFullYear();

        const random =
            crypto

                .randomBytes(4)

                .toString("hex")

                .toUpperCase();

        return `MERIT-${year}-${random}`;

    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Tie Breaker
    |--------------------------------------------------------------------------
    */

    private calculateTieBreaker(
        result: any
    ) {

        return (

            ((result.correctAnswers || 0) * 1000000)

            +

            ((result.marksObtained || 0) * 10000)

            -

            ((result.negativeMarks || 0) * 100)

            -

            (result.wrongAnswers || 0)

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    async create(
        payload: Partial<IMeritList>
    ) {

        const result =
            await this.validateResult(
                payload.resultId!.toString()
            );

        const certificate =
            await this.validateCertificate(
                payload.resultId!.toString()
            );

        const session: ClientSession =
            await mongoose.startSession();

        session.startTransaction();

        try {

            const merit =
                await super.create(

                    {

                        ...payload,

                        meritNumber:
                            this.generateMeritNumber(),

                        marksObtained:
                            result.marksObtained,

                        percentage:
                            result.percentage,

                        correctAnswers:
                            result.correctAnswers,

                        wrongAnswers:
                            result.wrongAnswers,

                        negativeMarks:
                            result.negativeMarks,

                        tieBreakerScore:

                            this.calculateTieBreaker(
                                result
                            ),

                        certificateId:
                            certificate?._id ?? null,

                        meritStatus:
                            MeritStatus.DRAFT,

                    },

                    session

                );

            await session.commitTransaction();

            session.endSession();

            return merit;

        } catch (error) {

            await session.abortTransaction();

            session.endSession();

            throw error;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Apply Normalization
    |--------------------------------------------------------------------------
    */
    private async applyNormalization(examId: string) {
        const Exam = mongoose.models.Exam;
        const Result = mongoose.models.Result;

        const exam = await Exam.findById(examId);
        if (!exam?.normalizationEnabled || !exam?.hasMultipleShifts) {
            return;
        }

        const groupKey = exam.examGroupId;
        if (!groupKey) return;

        const shiftExams = await Exam.find({ examGroupId: groupKey });
        const shiftExamIds = shiftExams.map((e: any) => e._id);

        const allResults = await Result.find({ examId: { $in: shiftExamIds }, isDeleted: { $ne: true } });

        const byShift = new Map<string, any[]>();
        for (const r of allResults) {
            const key = String(r.examId);
            if (!byShift.has(key)) byShift.set(key, []);
            byShift.get(key)!.push(r);
        }

        for (const [, shiftResults] of byShift) {
            if (shiftResults.length === 0) continue;
            
            const scores = shiftResults.map((r) => r.marksObtained);
            const minScore = Math.min(...scores);
            const maxScore = Math.max(...scores);

            for (const r of shiftResults) {
                let normalized = r.marksObtained;

                if (exam.normalizationMethod === "PERCENTILE" && maxScore !== minScore) {
                    normalized = ((r.marksObtained - minScore) / (maxScore - minScore)) * 100;
                } else if (exam.normalizationMethod === "MEAN_EQUATING") {
                    // MEAN_EQUATING: Not yet implemented, fallback to marksObtained
                    console.warn(`MEAN_EQUATING not yet implemented for normalization. Using raw marks for result ${r._id}`);
                }

                await meritListRepository.updateMany(
                    { resultId: r._id },
                    { normalizedMarks: normalized, normalizationApplied: true } as any
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Create From Results
    |--------------------------------------------------------------------------
    */

    async bulkCreateFromResults(examId: string, generatedBy: string) {
        const Result = mongoose.models.Result;
        const results = await Result.find({ examId, isDeleted: { $ne: true } });

        if (!results.length) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "No results found for this exam. Generate results first.");
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const result of results) {
            const exists = await meritListRepository.findOne({ resultId: result._id });
            if (exists) {
                skippedCount++;
                continue;
            }

            await this.create({
                examId: result.examId,
                resultId: result._id,
                candidateId: result.candidateId,
                companyId: result.companyId,
                examCenterId: result.examCenterId,
                subjectId: result.subjectId,
                category: result.category || "GENERAL",
                gender: result.gender || "OTHER",
                marksObtained: result.marksObtained,
                percentage: result.percentage,
                createdBy: new mongoose.Types.ObjectId(generatedBy),
            } as any);

            createdCount++;
        }

        await this.applyNormalization(examId);

        // Reuse the existing sort + rank logic unchanged
        const ranked = await this.generate(examId);

        return { createdCount, skippedCount, totalResults: results.length, ranked };
    }

  /*
    |--------------------------------------------------------------------------
    | Get By Candidate
    |--------------------------------------------------------------------------
    */

    async getByCandidate(
        candidateId: string
    ) {

        return meritListRepository.findByCandidate(
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

        return meritListRepository.findByExam(
            examId
        );

    }

  /*
    |--------------------------------------------------------------------------
    | Generate Merit List
    |--------------------------------------------------------------------------
    */

    async generate(
        examId: string
    ) {

        const meritList =
            await meritListRepository.findByExam(
                examId
            );

        if (!meritList.length) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "No merit records found."

            );

        }

        const Exam = mongoose.models.Exam;
        const exam = await Exam.findById(examId);

        /*
        |--------------------------------------------------------------------------
        | Sort Using Tie Breaking Rules
        |--------------------------------------------------------------------------
        */

        const sorted = [...meritList].sort(

            (a, b) => {

                if (exam?.normalizationEnabled) {
                    const aScore = a.normalizedMarks ?? a.marksObtained;
                    const bScore = b.normalizedMarks ?? b.marksObtained;
                    if (bScore !== aScore) return bScore - aScore;
                }

                /*
                Higher Marks
                */

                if (

                    b.marksObtained !==
                    a.marksObtained

                ) {

                    return (

                        b.marksObtained -

                        a.marksObtained

                    );

                }

                /*
                Higher Percentage
                */

                if (

                    b.percentage !==
                    a.percentage

                ) {

                    return (

                        b.percentage -

                        a.percentage

                    );

                }

                /*
                Higher Correct Answers
                */

                if (

                    b.correctAnswers !==
                    a.correctAnswers

                ) {

                    return (

                        b.correctAnswers -

                        a.correctAnswers

                    );

                }

                /*
                Lower Negative Marks
                */

                if (

                    a.negativeMarks !==
                    b.negativeMarks

                ) {

                    return (

                        a.negativeMarks -

                        b.negativeMarks

                    );

                }

                /*
                Tie Break Score
                */

                return (

                    b.tieBreakerScore -

                    a.tieBreakerScore

                );

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Assign Ranks
        |--------------------------------------------------------------------------
        */

        let rank = 1;

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

                const sameRank =

                    previous.marksObtained ===
                        current.marksObtained

                    &&

                    previous.percentage ===
                        current.percentage

                    &&

                    previous.correctAnswers ===
                        current.correctAnswers

                    &&

                    previous.negativeMarks ===
                        current.negativeMarks;

                if (!sameRank) {

                    rank = index + 1;

                }

            }

            await meritListRepository.update(

                sorted[index]._id.toString(),

                {

                    rank,

                    overallRank: rank,

                    meritStatus:
                        MeritStatus.GENERATED,

                }

            );

        }

        return sorted;

    }

    /*
    |--------------------------------------------------------------------------
    | Publish Merit List
    |--------------------------------------------------------------------------
    */

    async publish(

        meritId: string,

        publishedBy: string

    ) {

        const merit =
            await this.validateMeritList(
                meritId
            );

        if (

            merit.meritStatus !==
            MeritStatus.GENERATED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Generate merit list first."

            );

        }

        return meritListRepository.update(

            meritId,

            {

                meritStatus:
                    MeritStatus.PUBLISHED,

                publishedBy: new mongoose.Types.ObjectId(publishedBy),

                publishedAt:
                    new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Merit List
    |--------------------------------------------------------------------------
    */

    async cancel(

        meritId: string,

        remarks: string

    ) {

        await this.validateMeritList(
            meritId
        );

        return meritListRepository.update(

            meritId,

            {

                meritStatus:
                    MeritStatus.CANCELLED,

                remarks,

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Top 10
    |--------------------------------------------------------------------------
    */

    async top10(
        examId: string
    ) {

        return meritListRepository.findTopRankers(
            examId,
            10
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Top 100
    |--------------------------------------------------------------------------
    */

    async top100(
        examId: string
    ) {

        return meritListRepository.findTopRankers(
            examId,
            100
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

            generated,

            published,

        ] = await Promise.all([

            meritListRepository.count(
                examId ? { examId } : undefined
            ),

            meritListRepository.countGenerated(
                examId
            ),

            meritListRepository.countPublished(
                examId
            ),

        ]);

        return {

            total,

            generated,

            published,

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

        const generationRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (

                            dashboard.generated /

                            dashboard.total

                        ) * 100

                    ).toFixed(2)

                );

        const publishRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (

                            dashboard.published /

                            dashboard.total

                        ) * 100

                    ).toFixed(2)

                );

        return {

            ...dashboard,

            generationRate,

            publishRate,

        };

    }

  /*
    |--------------------------------------------------------------------------
    | Unpublish Merit List
    |--------------------------------------------------------------------------
    */

    async unpublish(meritId: string) {

        const merit = await this.validateMeritList(meritId);

        if (merit.meritStatus !== MeritStatus.PUBLISHED) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Merit list is not published."
            );
        }

        return meritListRepository.update(meritId, {
            meritStatus: MeritStatus.GENERATED,
        });

    }

    /*
    |--------------------------------------------------------------------------
    | Lock Merit List
    |--------------------------------------------------------------------------
    */

    async lock(meritId: string, lockedBy: string) {

        const merit = await this.validateMeritList(meritId);

        if (merit.meritStatus !== MeritStatus.PUBLISHED) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Only published merit lists can be locked."
            );
        }

        return meritListRepository.update(meritId, {
            meritStatus: MeritStatus.LOCKED,
            updatedBy: new mongoose.Types.ObjectId(lockedBy),
        });

    }

    /*
    |--------------------------------------------------------------------------
    | Unlock Merit List
    |--------------------------------------------------------------------------
    */

    async unlock(meritId: string) {

        const merit = await this.validateMeritList(meritId);

        if (merit.meritStatus !== MeritStatus.LOCKED) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Merit list is not locked."
            );
        }

        return meritListRepository.update(meritId, {
            meritStatus: MeritStatus.PUBLISHED,
        });

    }

    /*
    |--------------------------------------------------------------------------
    | Regenerate Merit List
    |--------------------------------------------------------------------------
    */

    async regenerate(examId: string, userId?: string) {

        const meritList = await meritListRepository.findByExam(examId);

        if (!meritList.length) {
            if (userId) {
                return this.bulkCreateFromResults(examId, userId);
            }
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "No merit records found for this exam."
            );
        }

        // Reset all records back to GENERATED status
        for (const merit of meritList) {
            await meritListRepository.update(merit._id.toString(), {
                meritStatus: MeritStatus.GENERATED,
                rank: 0,
                overallRank: 0,
            });
        }

        // Re-run the generate (sorting + ranking) flow
        return this.generate(examId);

    }

    /*
    |--------------------------------------------------------------------------
    | Archive Merit List
    |--------------------------------------------------------------------------
    */

    async archive(meritId: string) {

        await this.validateMeritList(meritId);

        return meritListRepository.update(meritId, {
            meritStatus: MeritStatus.ARCHIVED,
        });

    }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    async permanentDelete(
        meritId: string
    ) {

        await this.validateMeritList(
            meritId
        );

        return meritListRepository.permanentDelete(
            meritId
        );

    }

}

export default new MeritListService();
