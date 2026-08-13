import { BaseRepository } from "../../common/base.repository";
import { SubscriptionModel, SubscriptionHistoryModel } from "./subscription.model";
import { ISubscription, ISubscriptionHistory } from "./subscription.types";
import { Types, ClientSession } from "mongoose";

class SubscriptionRepository extends BaseRepository<ISubscription> {
  constructor() {
    super(SubscriptionModel);
  }

  async createHistory(data: Partial<ISubscriptionHistory>, session?: ClientSession) {
    const history = new SubscriptionHistoryModel(data);
    return history.save({ session });
  }

  async getHistoryBySubscription(subscriptionId: string | Types.ObjectId) {
    return SubscriptionHistoryModel.find({ subscriptionId })
      .populate("performedBy", "firstName lastName email")
      .populate("previousPlanId", "planName planCode")
      .populate("newPlanId", "planName planCode")
      .sort({ createdAt: -1 })
      .exec();
  }

  async countActiveSubscriptions(companyId: string | Types.ObjectId): Promise<number> {
    return this.model.countDocuments({
      companyId,
      status: "ACTIVE",
      isDeleted: false,
    } as any);
  }

  async findWithDetails(filter: any, options: any = {}) {
    let query = this.model.find(filter);
    
    if (options.populate) {
      options.populate.forEach((pop: any) => {
        query = query.populate(pop);
      });
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip !== undefined) {
      query = query.skip(options.skip);
    }

    if (options.limit !== undefined) {
      query = query.limit(options.limit);
    }

    return query.exec();
  }

  async generateSubscriptionId(): Promise<string> {
    const count = await this.model.countDocuments();
    const dateStr = new Date().toISOString().slice(2, 7).replace("-", ""); // YYMM
    return `SUB-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;
  }

  async getDashboardStats() {
    const total = await this.model.countDocuments({ isDeleted: false });
    const active = await this.model.countDocuments({ status: "ACTIVE", isDeleted: false } as any);
    const expired = await this.model.countDocuments({ status: "EXPIRED", isDeleted: false } as any);

    const mrrPipeline = [
      { $match: { status: "ACTIVE", isDeleted: false } },
      { $lookup: { from: "plans", localField: "planId", foreignField: "_id", as: "plan" } },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          mrr: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ["$billingCycle", "MONTHLY"] }, then: "$plan.pricing.monthlyPrice" },
                  { case: { $eq: ["$billingCycle", "QUARTERLY"] }, then: { $divide: ["$plan.pricing.quarterlyPrice", 3] } },
                  { case: { $eq: ["$billingCycle", "HALF_YEARLY"] }, then: { $divide: ["$plan.pricing.halfYearlyPrice", 6] } },
                  { case: { $eq: ["$billingCycle", "YEARLY"] }, then: { $divide: ["$plan.pricing.yearlyPrice", 12] } },
                ],
                default: 0
              }
            }
          }
        }
      }
    ];

    const mrrResult = await this.model.aggregate(mrrPipeline);
    const mrr = mrrResult.length > 0 ? Math.round(mrrResult[0].mrr) : 0;

    return { total, active, expired, mrr };
  }
}

export const subscriptionRepository = new SubscriptionRepository();
