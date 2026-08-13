import TrustScoreRepository from "./trustScore.repository";
import { EntityTrustType, FraudRating, ITrustScore, IViolationBreakdown } from "./trustScore.types";
import { BaseService } from "../../common/base.service";
import LiveMonitoring from "../live-monitoring/liveMonitoring.model";
import FaceVerification from "../face-verification/faceVerification.model";
import { FaceVerificationStatus, SpoofDetectionStatus } from "../face-verification/faceVerification.types";

export const SCORING_WEIGHTS = {
  tabSwitch: 2,
  fullscreenExit: 5,
  copyPaste: 10,
  devToolsOpen: 20,
  networkDisconnect: 1,
  faceMismatch: 15,
  spoofDetection: 30,
};

class TrustScoreService extends BaseService<ITrustScore> {
  constructor() {
    super(TrustScoreRepository, "TrustScore");
  }

  private mapScoreToFraudRating(score: number): FraudRating {
    if (score >= 80) return FraudRating.LOW;
    if (score >= 60) return FraudRating.MEDIUM;
    if (score >= 40) return FraudRating.HIGH;
    return FraudRating.CRITICAL;
  }

  async calculateCandidateScore(candidateId: string, examId: string): Promise<ITrustScore> {
    // 1. Fetch violation counts from LiveMonitoring
    const monitoring = await LiveMonitoring.findOne({ candidateId, examId });
    const tabSwitches = monitoring?.tabSwitchCount || 0;
    const fullscreenExits = monitoring?.fullscreenExitCount || 0;
    const copyPastes = monitoring?.copyPasteCount || 0;
    const devToolsOpens = monitoring?.devToolsOpenCount || 0;
    const networkDisconnects = monitoring?.networkDisconnectCount || 0;

    // 2. Fetch face verification mismatch and spoof data
    const faceVerifications = await FaceVerification.find({ candidateId, examId });
    
    let faceMismatches = 0;
    let spoofDetections = 0;

    for (const fv of faceVerifications) {
      if (fv.verificationStatus === FaceVerificationStatus.FAILED) {
        faceMismatches++;
      }
      if (fv.spoofDetection === SpoofDetectionStatus.SPOOF) {
        spoofDetections++;
      }
    }

    const breakdown: IViolationBreakdown = {
      tabSwitches,
      fullscreenExits,
      copyPastes,
      devToolsOpens,
      networkDisconnects,
      faceMismatches,
      spoofDetections,
    };

    // 3. Apply formula
    let score = 100;
    score -= tabSwitches * SCORING_WEIGHTS.tabSwitch;
    score -= fullscreenExits * SCORING_WEIGHTS.fullscreenExit;
    score -= copyPastes * SCORING_WEIGHTS.copyPaste;
    score -= devToolsOpens * SCORING_WEIGHTS.devToolsOpen;
    score -= networkDisconnects * SCORING_WEIGHTS.networkDisconnect;
    score -= faceMismatches * SCORING_WEIGHTS.faceMismatch;
    score -= spoofDetections * SCORING_WEIGHTS.spoofDetection;

    if (score < 0) score = 0;

    const fraudRating = this.mapScoreToFraudRating(score);

    // 4. Store the result
    const result = await super.create({
      entityType: EntityTrustType.CANDIDATE,
      entityId: candidateId,
      examId,
      score,
      violationBreakdown: breakdown,
      fraudRating,
      calculatedAt: new Date(),
    }) as unknown as ITrustScore;

    return result;
  }

  async calculateCenterTrustScore(centerId: string, examId: string) {
    const aggregate = await TrustScoreRepository.getCenterAggregateScore(examId, centerId);
    
    if (!aggregate) {
      return null;
    }

    const avgScore = aggregate.averageScore;
    const fraudRating = this.mapScoreToFraudRating(avgScore);

    // Store the center's aggregated score
    const result = await super.create({
      entityType: EntityTrustType.CENTER,
      entityId: centerId,
      examId,
      score: avgScore,
      violationBreakdown: {
        tabSwitches: 0,
        fullscreenExits: 0,
        copyPastes: 0,
        devToolsOpens: 0,
        networkDisconnects: 0,
        faceMismatches: 0,
        spoofDetections: 0,
      },
      fraudRating,
      calculatedAt: new Date(),
    }) as unknown as ITrustScore;

    return result;
  }
}

export default new TrustScoreService();
