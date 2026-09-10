import Plan from "./plan.model";
import { IPlan } from "./plan.types";
import { BaseRepository } from "../../common/base.repository";

class PlanRepository extends BaseRepository<IPlan> {
  constructor() {
    super(Plan, [], ["planName", "planCode"]);
  }

  async findByPlanCode(planCode: string) {
    return await Plan.findOne({
      planCode,
      isDeleted: false,
    });
  }
}

export default new PlanRepository();
