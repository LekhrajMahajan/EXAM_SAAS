import { Types } from "mongoose";
import { OrganizationInitialization } from "./organizationSeeder.model";
import { IOrganizationInitialization, SeederStepLog } from "./organizationSeeder.types";

export class OrganizationSeederRepository {
  async findByCompanyId(companyId: string): Promise<IOrganizationInitialization | null> {
    return OrganizationInitialization.findOne({ companyId: new Types.ObjectId(companyId) }).exec();
  }

  async upsertInitializationRecord(
    companyId: string,
    updateData: Partial<IOrganizationInitialization>,
    actorId?: string
  ): Promise<IOrganizationInitialization | null> {
    const compId = new Types.ObjectId(companyId);
    const userId = actorId && actorId !== "system" ? new Types.ObjectId(actorId) : null;

    const existing = await this.findByCompanyId(companyId);
    if (!existing) {
      updateData.createdBy = userId as any;
    }
    updateData.updatedBy = userId as any;

    return OrganizationInitialization.findOneAndUpdate(
      { companyId: compId },
      { $set: updateData },
      { upsert: true, new: true }
    ).exec();
  }

  async appendStepLog(companyId: string, logEntry: SeederStepLog): Promise<void> {
    const compId = new Types.ObjectId(companyId);
    await OrganizationInitialization.findOneAndUpdate(
      { companyId: compId },
      { $push: { stepLogs: logEntry } },
      { upsert: true }
    ).exec();
  }

  async updateStatus(
    companyId: string,
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "RESEEDED"
  ): Promise<void> {
    await OrganizationInitialization.findOneAndUpdate(
      { companyId: new Types.ObjectId(companyId) },
      { $set: { status, ...(status === "RESEEDED" ? { reseededAt: new Date() } : {}) } }
    ).exec();
  }
}

export default new OrganizationSeederRepository();
