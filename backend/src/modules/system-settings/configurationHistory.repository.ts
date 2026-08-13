import { BaseRepository } from "../../common/base.repository";
import { ConfigurationHistory } from "./configurationHistory.model";
import { IConfigurationHistory, ConfigurationHistoryDocument } from "./configurationHistory.types";

class ConfigurationHistoryRepository extends BaseRepository<IConfigurationHistory> {
  constructor() {
    super(ConfigurationHistory);
  }

  async findWithFilters(filters: any, options: any = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    const query = this.model.find(filters);

    if (options.populate) {
      options.populate.forEach((pop: any) => query.populate(pop));
    }

    query.sort(sort).skip(skip).limit(limit);

    const [data, total] = await Promise.all([
      query.lean().exec(),
      this.model.countDocuments(filters),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLatestVersion(configurationName: string): Promise<number> {
    const latest = await this.model
      .findOne({ configurationName })
      .sort({ version: -1 })
      .select("version")
      .lean()
      .exec();

    return latest ? latest.version : 0;
  }
}

export default new ConfigurationHistoryRepository();
