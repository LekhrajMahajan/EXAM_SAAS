import Center from "./center.model";
import { ICenter } from "./center.types";
import { BaseRepository } from "../../common/base.repository";

class CenterRepository extends BaseRepository<ICenter> {
  constructor() {
    super(
      Center,
      ["companyId", "branchId"],
      ["centerCode", "centerName", "city"]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Center Code
  |--------------------------------------------------------------------------
  */
  async findByCenterCode(
    companyId: string,
    branchId: string,
    centerCode: string,
  ) {
    return await Center.findOne({
      companyId,
      branchId,
      centerCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Center Name
  |--------------------------------------------------------------------------
  */
  async findByCenterName(
    companyId: string,
    branchId: string,
    centerName: string,
  ) {
    return await Center.findOne({
      companyId,
      branchId,
      centerName,
      isDeleted: false,
    });
  }
  /*
  |--------------------------------------------------------------------------
  | Find Pending Verifications
  |--------------------------------------------------------------------------
  */
  async findPendingVerifications(companyId?: string, branchId?: string) {
    const query: any = {
      isDeleted: false,
      setupStatus: "PENDING_VERIFICATION",
    };
    if (companyId && companyId.trim() !== "" && companyId !== "undefined") {
      query.companyId = companyId;
    }
    if (branchId && branchId.trim() !== "" && branchId !== "undefined") {
      query.branchId = branchId;
    }
    return await Center.find(query)
      .select(
        "centerName centerCode email phone city state country setupStatus setupCurrentStep readinessScore complianceScore adminReviewRemarks createdAt"
      )
      .lean();
  }

  /*
  |--------------------------------------------------------------------------
  | Get Dashboard Stats via Aggregation Pipeline
  |--------------------------------------------------------------------------
  */
  async getDashboardStats(centerId: string) {
    const mongoose = require("mongoose");
    const docId = new mongoose.Types.ObjectId(centerId.toString());

    const pipeline = [
      { $match: { _id: docId, isDeleted: false } },
      {
        $project: {
          centerName: 1,
          centerCode: 1,
          setupStatus: 1,
          completionPercentage: 1,
          readinessScore: 1,
          complianceScore: 1,
          totalLabs: {
            $size: {
              $filter: {
                input: { $ifNull: ["$infrastructureNodes", []] },
                as: "node",
                cond: { $eq: ["$$node.roomType", "Computer Lab"] },
              },
            },
          },
          totalSystems: {
            $reduce: {
              input: { $ifNull: ["$infrastructureNodes", []] },
              initialValue: 0,
              in: { $add: ["$$value", { $ifNull: ["$$this.computerCount", 0] }] },
            },
          },
          totalRegisteredStaff: { $size: { $ifNull: ["$staffList", []] } },
          totalUploadedDocuments: { $size: { $ifNull: ["$documents", []] } },
          pendingApprovedDocuments: {
            $size: {
              $filter: {
                input: { $ifNull: ["$documents", []] },
                as: "doc",
                cond: { $eq: ["$$doc.status", "APPROVED"] },
              },
            },
          },
          revenueForecast: {
            $reduce: {
              input: { $ifNull: ["$shiftPlans", []] },
              initialValue: 0,
              in: { $add: ["$$value", { $ifNull: ["$$this.expectedRevenue", 0] }] },
            },
          },
        },
      },
    ];

    const results = await Center.aggregate(pipeline);
    if (!results || results.length === 0) {
      return null;
    }
    const data = results[0];
    const centerHealthScore = Math.round(
      ((data.readinessScore || 0) * 0.5 + (data.complianceScore || 0) * 0.5)
    );

    return {
      centerCompletionPercentage: data.completionPercentage || 0,
      verificationStatus: data.setupStatus || "DRAFT",
      readinessScore: data.readinessScore || 0,
      complianceScore: data.complianceScore || 0,
      totalLabs: data.totalLabs || 0,
      totalSystems: data.totalSystems || 0,
      totalRegisteredStaff: data.totalRegisteredStaff || 0,
      totalUploadedDocuments: data.totalUploadedDocuments || 0,
      pendingApprovedDocuments: data.pendingApprovedDocuments || 0,
      revenueForecast: data.revenueForecast || 0,
      centerHealthScore,
    };
  }
}

export default new CenterRepository();
