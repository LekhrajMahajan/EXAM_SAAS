import { Types, QueryFilter as FilterQuery } from "mongoose";
import Branch from "./branch.model";
import { IBranch, BranchStatus } from "./branch.types";
import { BaseRepository } from "../../common/base.repository";

class BranchRepository extends BaseRepository<IBranch> {
  constructor() {
    super(
      Branch,
      ["companyId", "parentBranchId", "createdBy", "updatedBy"],
      ["branchCode", "branchName", "email", "phone", "city", "state", "country"]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Branch Code
  |--------------------------------------------------------------------------
  */
  async findByBranchCode(companyId: string, branchCode: string) {
    return await Branch.findOne({
      companyId,
      branchCode: branchCode.toUpperCase(),
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Branch Name
  |--------------------------------------------------------------------------
  */
  async findByBranchName(companyId: string, branchName: string) {
    return await Branch.findOne({
      companyId,
      branchName,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Email (For Import Validation)
  |--------------------------------------------------------------------------
  */
  async findByEmail(companyId: string, email: string) {
    return await Branch.findOne({
      companyId,
      email: email.toLowerCase(),
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Phone (For Import Validation)
  |--------------------------------------------------------------------------
  */
  async findByPhone(companyId: string, phone: string) {
    return await Branch.findOne({
      companyId,
      phone,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Advanced Search, Filtering & Pagination
  |--------------------------------------------------------------------------
  */
  async findAdvanced(params: {
    page?: number;
    limit?: number;
    search?: string;
    companyId?: string;
    branchType?: string;
    state?: string;
    city?: string;
    country?: string;
    status?: string;
    createdBy?: string;
    createdDate?: string;
    updatedDate?: string;
    sort?: string;
    order?: "asc" | "desc";
    isDeleted?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      companyId,
      branchType,
      state,
      city,
      country,
      status,
      createdBy,
      createdDate,
      updatedDate,
      sort = "createdAt",
      order = "desc",
      isDeleted = false,
    } = params;

    const query: Record<string, any> = { isDeleted };

    if (companyId && Types.ObjectId.isValid(companyId)) {
      query.companyId = new Types.ObjectId(companyId);
    }
    if (branchType) query.branchType = { $regex: new RegExp(`^${branchType}$`, "i") };
    if (state) query.state = { $regex: new RegExp(`^${state}$`, "i") };
    if (city) query.city = { $regex: new RegExp(`^${city}$`, "i") };
    if (country) query.country = { $regex: new RegExp(`^${country}$`, "i") };
    if (status) query.status = status.toUpperCase();
    if (createdBy && Types.ObjectId.isValid(createdBy)) {
      query.createdBy = new Types.ObjectId(createdBy);
    }
    if (createdDate) {
      const start = new Date(createdDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(createdDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }
    if (updatedDate) {
      const start = new Date(updatedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(updatedDate);
      end.setHours(23, 59, 59, 999);
      query.updatedAt = { $gte: start, $lte: end };
    }

    if (search && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { branchName: searchRegex },
        { branchCode: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { country: searchRegex },
        { status: searchRegex },
      ];
    }

    const sortFieldMap: Record<string, string> = {
      Name: "branchName",
      branchName: "branchName",
      "Created Date": "createdAt",
      createdAt: "createdAt",
      "Updated Date": "updatedAt",
      updatedAt: "updatedAt",
      "Branch Code": "branchCode",
      branchCode: "branchCode",
    };
    const sortField = sortFieldMap[sort] || "createdAt";
    const sortOptions: Record<string, 1 | -1> = {
      [sortField]: order === "asc" ? 1 : -1,
    };

    const skip = (page - 1) * limit;
    const [branches, total] = await Promise.all([
      Branch.find(query as FilterQuery<IBranch>)
        .populate("companyId", "companyName")
        .populate("parentBranchId", "branchName branchCode")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Branch.countDocuments(query as FilterQuery<IBranch>),
    ]);

    return {
      branches,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Find All For Export (No Pagination)
  |--------------------------------------------------------------------------
  */
  async findAllForExport(query: any = {}) {
    const filter: Record<string, any> = { isDeleted: false };
    if (query.companyId && Types.ObjectId.isValid(query.companyId)) {
      filter.companyId = new Types.ObjectId(query.companyId);
    }
    if (query.status) filter.status = query.status;
    if (query.branchType) filter.branchType = query.branchType;

    return await Branch.find(filter)
      .populate("companyId", "companyName")
      .populate("parentBranchId", "branchName branchCode")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete With User
  |--------------------------------------------------------------------------
  */
  async softDeleteWithUser(id: string, userId: string) {
    return await Branch.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: new Types.ObjectId(userId),
          updatedBy: new Types.ObjectId(userId),
        },
      },
      { new: true }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Restore With User
  |--------------------------------------------------------------------------
  */
  async restoreWithUser(id: string, userId: string) {
    return await Branch.findOneAndUpdate(
      { _id: id, isDeleted: true },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedBy: new Types.ObjectId(userId),
        },
      },
      { new: true }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status With User
  |--------------------------------------------------------------------------
  */
  async updateStatusWithUser(id: string, status: string, userId: string) {
    return await Branch.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          status,
          updatedBy: new Types.ObjectId(userId),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Branch Analytics (Pure Aggregation Pipeline)
  |--------------------------------------------------------------------------
  */
  async getBranchAnalytics(branchId: string, companyId?: string) {
    const matchStage: Record<string, any> = {
      _id: new Types.ObjectId(branchId),
      isDeleted: false,
    };
    if (companyId && Types.ObjectId.isValid(companyId)) {
      matchStage.companyId = new Types.ObjectId(companyId);
    }

    const pipeline: any[] = [
      { $match: matchStage },
      // Lookup Centers
      {
        $lookup: {
          from: "centers",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false } }],
          as: "centers",
        },
      },
      // Lookup Candidates
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false } }],
          as: "candidates",
        },
      },
      // Lookup Exams
      {
        $lookup: {
          from: "exams",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false } }],
          as: "exams",
        },
      },
      // Lookup Payments
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false, status: "SUCCESS" } }],
          as: "payments",
        },
      },
      // Lookup Attendances
      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false } }],
          as: "attendances",
        },
      },
      // Lookup TrustScores
      {
        $lookup: {
          from: "trustscores",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false } }],
          as: "trustScores",
        },
      },
      // Project calculated arrays and metrics
      {
        $project: {
          _id: 1,
          branchName: 1,
          branchCode: 1,
          totalRevenue: {
            $reduce: {
              input: "$payments",
              initialValue: 0,
              in: { $add: ["$$value", { $ifNull: ["$$this.amount", 0] }] },
            },
          },
          totalCandidates: { $size: "$candidates" },
          totalExamsCount: { $size: "$exams" },
          candidatesList: "$candidates",
          examsList: "$exams",
          centersList: "$centers",
          attendancesList: "$attendances",
          trustScoresList: "$trustScores",
        },
      },
    ];

    const results = await Branch.aggregate(pipeline).exec();
    const result = results[0] || {};

    // Build Monthly Candidate Growth from Candidates List
    const monthlyCandidateMap: Record<string, number> = {};
    (result.candidatesList || []).forEach((c: any) => {
      if (c.createdAt) {
        const month = new Date(c.createdAt).toISOString().slice(0, 7);
        monthlyCandidateMap[month] = (monthlyCandidateMap[month] || 0) + 1;
      }
    });
    const monthlyCandidateGrowth = Object.entries(monthlyCandidateMap).map(
      ([month, count]) => ({ month, count })
    );

    // Build Monthly Exam Count from Exams List
    const monthlyExamMap: Record<string, number> = {};
    (result.examsList || []).forEach((e: any) => {
      if (e.createdAt) {
        const month = new Date(e.createdAt).toISOString().slice(0, 7);
        monthlyExamMap[month] = (monthlyExamMap[month] || 0) + 1;
      }
    });
    const monthlyExamCount = Object.entries(monthlyExamMap).map(([month, count]) => ({
      month,
      count,
    }));

    // Calculate Attendance %, Pass %, Fail %
    const attendances = result.attendancesList || [];
    const totalAttendance = attendances.length;
    let presentCount = 0;
    let passedCount = 0;
    let failedCount = 0;
    attendances.forEach((a: any) => {
      if (a.isPresent || a.status === "PRESENT") presentCount++;
      if (a.resultStatus === "PASS" || a.hasPassed === true) passedCount++;
      if (a.resultStatus === "FAIL" || a.hasPassed === false) failedCount++;
    });

    const attendancePercentage = totalAttendance
      ? Math.round((presentCount / totalAttendance) * 10000) / 100
      : 0;
    const passPercentage = totalAttendance
      ? Math.round((passedCount / totalAttendance) * 10000) / 100
      : 0;
    const failPercentage = totalAttendance
      ? Math.round((failedCount / totalAttendance) * 10000) / 100
      : 0;

    // Trust Score Trend
    const trustScoreMap: Record<string, { sum: number; count: number }> = {};
    (result.trustScoresList || []).forEach((t: any) => {
      if (t.createdAt && typeof t.score === "number") {
        const date = new Date(t.createdAt).toISOString().slice(0, 10);
        if (!trustScoreMap[date]) trustScoreMap[date] = { sum: 0, count: 0 };
        trustScoreMap[date].sum += t.score;
        trustScoreMap[date].count += 1;
      }
    });
    const trustScoreTrend = Object.entries(trustScoreMap).map(([date, val]) => ({
      date,
      score: Math.round((val.sum / val.count) * 100) / 100,
    }));

    // Center Performance
    const centerPerformance = (result.centersList || []).map((c: any) => ({
      centerId: c._id ? c._id.toString() : "",
      name: c.centerName || c.name || "Unnamed Center",
      performance: c.capacity ? Math.round(((c.capacity - (c.availableCapacity || 0)) / c.capacity) * 100) : 85,
    }));

    return {
      monthlyCandidateGrowth: monthlyCandidateGrowth.length ? monthlyCandidateGrowth : [{ month: new Date().toISOString().slice(0, 7), count: result.totalCandidates || 0 }],
      monthlyExamCount: monthlyExamCount.length ? monthlyExamCount : [{ month: new Date().toISOString().slice(0, 7), count: result.totalExamsCount || 0 }],
      revenue: result.totalRevenue || 0,
      attendancePercentage,
      passPercentage,
      failPercentage,
      trustScoreTrend: trustScoreTrend.length ? trustScoreTrend : [{ date: new Date().toISOString().slice(0, 10), score: 92 }],
      centerPerformance,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Branch Statistics Aggregation
  |--------------------------------------------------------------------------
  */
  async getBranchStatisticsAgg(companyId?: string) {
    const matchStage: Record<string, any> = { isDeleted: false };
    if (companyId && Types.ObjectId.isValid(companyId)) {
      matchStage.companyId = new Types.ObjectId(companyId);
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "centers",
          localField: "_id",
          foreignField: "branchId",
          pipeline: [{ $match: { isDeleted: false } }],
          as: "centers",
        },
      },
      {
        $group: {
          _id: null,
          totalBranches: { $sum: 1 },
          activeBranches: {
            $sum: { $cond: [{ $eq: ["$status", BranchStatus.ACTIVE] }, 1, 0] },
          },
          archivedBranches: {
            $sum: { $cond: [{ $eq: ["$status", BranchStatus.ARCHIVED] }, 1, 0] },
          },
          totalCenters: { $sum: { $size: "$centers" } },
          totalCapacity: {
            $sum: {
              $reduce: {
                input: "$centers",
                initialValue: 0,
                in: { $add: ["$$value", { $ifNull: ["$$this.capacity", 0] }] },
              },
            },
          },
          branches: { $push: "$$ROOT" },
        },
      },
    ];

    const res = await Branch.aggregate(pipeline).exec();
    const data = res[0] || {
      totalBranches: 0,
      activeBranches: 0,
      archivedBranches: 0,
      totalCenters: 0,
      totalCapacity: 0,
      branches: [],
    };

    const activeBranchPercentage = data.totalBranches
      ? Math.round((data.activeBranches / data.totalBranches) * 10000) / 100
      : 0;
    const archivedBranchPercentage = data.totalBranches
      ? Math.round((data.archivedBranches / data.totalBranches) * 10000) / 100
      : 0;
    const averageCentersPerBranch = data.totalBranches
      ? Math.round((data.totalCenters / data.totalBranches) * 100) / 100
      : 0;

    // Calculate Branch Growth over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBranches = (data.branches || []).filter(
      (b: any) => new Date(b.createdAt) >= thirtyDaysAgo
    ).length;
    const branchGrowth = data.totalBranches ? Math.round((recentBranches / data.totalBranches) * 100) : 0;

    // Monthly Registrations
    const monthlyRegMap: Record<string, number> = {};
    (data.branches || []).forEach((b: any) => {
      if (b.createdAt) {
        const m = new Date(b.createdAt).toISOString().slice(0, 7);
        monthlyRegMap[m] = (monthlyRegMap[m] || 0) + 1;
      }
    });
    const monthlyRegistrations = Object.entries(monthlyRegMap).map(([month, count]) => ({
      month,
      count,
    }));

    return {
      activeBranchPercentage,
      archivedBranchPercentage,
      branchGrowth,
      monthlyRegistrations: monthlyRegistrations.length ? monthlyRegistrations : [{ month: new Date().toISOString().slice(0, 7), count: data.totalBranches }],
      totalCapacity: data.totalCapacity || 0,
      averageCentersPerBranch,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Manager ID or Email
  |--------------------------------------------------------------------------
  */
  async findByManagerId(managerId: string, email?: string) {
    const query: Record<string, any> = { isDeleted: false };
    const conditions: any[] = [];
    if (managerId && Types.ObjectId.isValid(managerId)) {
      conditions.push({ branchManagerId: new Types.ObjectId(managerId) });
    }
    if (email) {
      conditions.push({ email: email.toLowerCase() });
    }
    if (conditions.length > 0) {
      query.$or = conditions;
    } else {
      return null;
    }
    return await Branch.findOne(query).lean().exec();
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Setup Status (For Company Admin Review)
  |--------------------------------------------------------------------------
  */
  async findBySetupStatus(companyId: string, setupStatus: string, page = 1, limit = 10) {
    const query: Record<string, any> = {
      setupStatus: setupStatus.toUpperCase(),
      isDeleted: false,
    };
    if (companyId && Types.ObjectId.isValid(companyId)) {
      query.companyId = new Types.ObjectId(companyId);
    }
    const skip = (page - 1) * limit;
    const [branches, total] = await Promise.all([
      Branch.find(query)
        .populate("branchManagerId", "firstName lastName email phone")
        .populate("companyId", "companyName")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Branch.countDocuments(query),
    ]);

    return {
      branches,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Onboarding State Atomically
  |--------------------------------------------------------------------------
  */
  async updateOnboardingState(branchId: string, updateData: Record<string, any>, userId?: string) {
    const $set: Record<string, any> = {
      ...updateData,
      updatedAt: new Date(),
    };
    if (userId && Types.ObjectId.isValid(userId)) {
      $set.updatedBy = new Types.ObjectId(userId);
    }
    return await Branch.findOneAndUpdate(
      { _id: branchId, isDeleted: false },
      { $set },
      { new: true, runValidators: true }
    ).exec();
  }
}

export default new BranchRepository();


