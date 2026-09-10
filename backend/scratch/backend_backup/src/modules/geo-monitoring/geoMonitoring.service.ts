import GeoMonitoringRepository from "./geoMonitoring.repository";
import { IGeoMonitoring, GeoEntityType } from "./geoMonitoring.types";
import { BaseService } from "../../common/base.service";
import Center from "../center/center.model";

// Geofence radius in meters
const GEOFENCE_RADIUS_METERS = 500;

class GeoMonitoringService extends BaseService<IGeoMonitoring> {
  constructor() {
    super(GeoMonitoringRepository, "GeoMonitoring");
  }

  // Haversine formula to calculate distance in meters
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180;
    const dl = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dp / 2) * Math.sin(dp / 2) +
      Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async recordLocation(payload: Partial<IGeoMonitoring>, centerId?: string) {
    let outOfGeofence = false;

    // Perform geofence check if centerId is provided (or fetch centerId based on entity if needed)
    if (centerId && payload.latitude != null && payload.longitude != null) {
      const center = await Center.findById(centerId);
      if (center && center.latitude != null && center.longitude != null) {
        const distance = this.calculateDistance(
          payload.latitude,
          payload.longitude,
          center.latitude,
          center.longitude
        );
        outOfGeofence = distance > GEOFENCE_RADIUS_METERS;
      }
    }

    const record = await super.create({
      ...payload,
      outOfGeofence,
      recordedAt: new Date(),
    });

    return record;
  }

  async getLatestLocation(examId: string, entityId: string) {
    return GeoMonitoringRepository.getLatestLocation(examId, entityId);
  }

  async getAllLatestLocationsForExam(examId: string) {
    return GeoMonitoringRepository.getAllLatestLocationsForExam(examId);
  }
}

export default new GeoMonitoringService();
