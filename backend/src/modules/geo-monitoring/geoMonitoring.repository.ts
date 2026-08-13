import GeoMonitoring from "./geoMonitoring.model";
import { IGeoMonitoring } from "./geoMonitoring.types";
import { BaseRepository } from "../../common/base.repository";

class GeoMonitoringRepository extends BaseRepository<IGeoMonitoring> {
  constructor() {
    super(GeoMonitoring);
  }

  async getLatestLocation(examId: string, entityId: string) {
    return GeoMonitoring.findOne({ examId, entityId })
      .sort({ recordedAt: -1 })
      .limit(1);
  }

  async getAllLatestLocationsForExam(examId: string) {
    return GeoMonitoring.aggregate([
      { $match: { examId } },
      { $sort: { recordedAt: -1 } },
      {
        $group: {
          _id: "$entityId",
          latestRecord: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latestRecord" } },
    ]);
  }
}

export default new GeoMonitoringRepository();
