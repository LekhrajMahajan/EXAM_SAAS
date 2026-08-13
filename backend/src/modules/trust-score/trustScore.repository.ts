import TrustScore from "./trustScore.model";
import { EntityTrustType, ITrustScore } from "./trustScore.types";
import { BaseRepository } from "../../common/base.repository";
class TrustScoreRepository extends BaseRepository<ITrustScore> {
  constructor() {
    super(TrustScore);
  }

  async getLatestCandidateScore(examId: string, candidateId: string) {
    return TrustScore.findOne({ 
      examId, 
      entityId: candidateId, 
      entityType: EntityTrustType.CANDIDATE 
    })
      .sort({ calculatedAt: -1 })
      .limit(1);
  }

  async getCandidateScoreHistory(examId: string, candidateId: string, skip: number, limit: number) {
    const query = {
      examId,
      entityId: candidateId,
      entityType: EntityTrustType.CANDIDATE
    };

    const [data, total] = await Promise.all([
      TrustScore.find(query)
        .sort({ calculatedAt: -1 })
        .skip(skip)
        .limit(limit),
      TrustScore.countDocuments(query)
    ]);

    return { data, total };
  }

  async getCenterAggregateScore(examId: string, centerId: string) {
    // Mocked implementation since candidate-assignment was removed
    return {
      averageScore: 85 + Math.random() * 10,
      totalCandidatesEvaluated: Math.floor(Math.random() * 500) + 50
    };
  }
}

export default new TrustScoreRepository();
