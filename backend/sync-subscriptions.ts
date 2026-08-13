import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "./src/modules/company/company.model";
import Plan from "./src/modules/plan/plan.model";
import { SubscriptionModel, SubscriptionHistoryModel } from "./src/modules/subscription/subscription.model";
import { SubscriptionStatus, BillingCycle } from "./src/modules/subscription/subscription.types";
import User from "./src/modules/user/user.model";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/exam_saas?retryWrites=false";

async function generateSubscriptionId() {
  const count = await SubscriptionModel.countDocuments();
  const dateStr = new Date().toISOString().slice(2, 7).replace("-", ""); // YYMM
  return `SUB-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;
}

async function sync() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const masterAdmin = await User.findOne({ role: "MASTER_ADMIN" });
    if (!masterAdmin) {
      console.log("No master admin found to set as performedBy. Please create one first.");
      process.exit(1);
    }

    const companies = await Company.find({ isDeleted: false, status: true });
    
    let count = 0;
    for (const company of companies) {
      if (!company.subscriptionPlan) continue;

      const plan = await Plan.findOne({ planCode: company.subscriptionPlan });
      if (!plan) continue;

      const activeCount = await SubscriptionModel.countDocuments({ companyId: company._id, status: SubscriptionStatus.ACTIVE, isDeleted: false } as any);
      if (activeCount > 0) continue; // Already has a subscription

      console.log(`Creating subscription for ${company.companyName} (${company.companyCode})`);

      const start = company.subscriptionStartDate || new Date();
      const end = company.subscriptionEndDate || new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);

      const subId = await generateSubscriptionId();
      
      const subscription = await SubscriptionModel.create({
        subscriptionId: subId,
        companyId: company._id,
        planId: plan._id,
        billingCycle: BillingCycle.YEARLY, 
        startDate: start,
        endDate: end,
        status: SubscriptionStatus.ACTIVE,
        autoRenewal: false,
        maxBranches: company.maxBranches || plan.usageLimits?.maxBranches,
        maxCenters: company.maxCenters || plan.usageLimits?.maxCenters,
        maxEmployees: company.maxEmployees || plan.usageLimits?.maxEmployees,
        maxCandidates: company.maxCandidates || plan.usageLimits?.maxCandidates,
      });

      await SubscriptionHistoryModel.create({
        subscriptionId: subscription._id,
        action: "CREATED",
        newPlanId: plan._id,
        newEndDate: end,
        performedBy: masterAdmin._id,
        notes: "Auto-generated subscription during backfill sync",
      });
      count++;
    }

    console.log(`Sync complete. Created ${count} missing subscriptions.`);
    process.exit(0);
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
}

sync();
