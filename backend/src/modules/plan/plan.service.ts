import planRepository from "./plan.repository";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { IPlan, PlanStatus } from "./plan.types";
import { BaseService } from "../../common/base.service";

class PlanService extends BaseService<IPlan> {
  constructor() {
    super(planRepository);
  }

  async createPlan(data: Partial<IPlan>, createdBy: string) {
    // Ensure planCode is unique
    const existingPlan = await planRepository.findByPlanCode(data.planCode!);
    if (existingPlan) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Plan with this code already exists");
    }

    const newPlan = await planRepository.create({
      ...data,
      createdBy: createdBy as any,
    });

    return newPlan;
  }

  async updatePlan(id: string, data: Partial<IPlan>, updatedBy: string) {
    const plan = await planRepository.findById(id);
    if (!plan) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Plan not found");
    }

    // Check planCode uniqueness if updating planCode
    if (data.planCode && data.planCode !== plan.planCode) {
      const existingPlan = await planRepository.findByPlanCode(data.planCode);
      if (existingPlan && existingPlan._id.toString() !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Plan with this code already exists");
      }
    }

    const updatedPlan = await planRepository.update(id, {
      ...data,
      updatedBy: updatedBy as any,
    });

    return updatedPlan;
  }

  async clonePlan(id: string, createdBy: string) {
    const plan = await planRepository.findById(id);
    if (!plan) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Plan not found");
    }

    // Create a new unique plan code
    let cloneCode = `${plan.planCode}_CLONE`;
    let cloneCounter = 1;
    while (await planRepository.findByPlanCode(cloneCode)) {
      cloneCode = `${plan.planCode}_CLONE_${cloneCounter}`;
      cloneCounter++;
    }

    const clonedPlanData = {
      ...plan.toObject(),
      _id: undefined,
      planName: `${plan.planName} (Copy)`,
      planCode: cloneCode,
      status: PlanStatus.INACTIVE, // Default cloned to inactive
      createdBy: createdBy as any,
      activeCompaniesCount: 0,
      createdAt: undefined,
      updatedAt: undefined,
      updatedBy: undefined,
    };

    return await planRepository.create(clonedPlanData);
  }

  async toggleStatus(id: string, status: PlanStatus, updatedBy: string) {
    const plan = await planRepository.findById(id);
    if (!plan) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Plan not found");
    }

    return await planRepository.update(id, {
      status,
      updatedBy: updatedBy as any,
    });
  }

  async archivePlan(id: string, updatedBy: string) {
    return this.toggleStatus(id, PlanStatus.ARCHIVED, updatedBy);
  }
}

export default new PlanService();
