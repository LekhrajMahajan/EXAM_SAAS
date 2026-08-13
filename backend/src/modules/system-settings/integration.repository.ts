import { BaseRepository } from "../../common/base.repository";
import { Integration } from "./integration.model";
import { IIntegration, IntegrationCategory, IntegrationEnvironment, IntegrationStatus } from "./integration.types";

class IntegrationRepository extends BaseRepository<IIntegration> {
  constructor() {
    super(Integration);
  }

  async findByCategory(category: IntegrationCategory, environment?: IntegrationEnvironment) {
    const query: any = { category };
    if (environment) {
      query.environment = environment;
    }
    return this.model.find(query).sort({ priority: -1, createdAt: -1 });
  }

  async findActiveByCategory(category: IntegrationCategory, environment: IntegrationEnvironment = IntegrationEnvironment.PRODUCTION) {
    return this.model.find({ 
      category, 
      environment, 
      status: IntegrationStatus.ACTIVE 
    } as any).sort({ priority: -1, createdAt: -1 });
  }

  async findByProvider(provider: string, environment?: IntegrationEnvironment) {
    const query: any = { provider };
    if (environment) {
      query.environment = environment;
    }
    return this.model.findOne(query);
  }
}

export default new IntegrationRepository();
