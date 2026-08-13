import bcrypt from "bcryptjs";
import { BaseRepository } from "../../common/base.repository";
import Admin from "../admin/admin.model";
import Manager from "../manager/manager.model";
import Candidate from "../candidate/candidate.model";
import { IUpdateProfile } from "./user.types";

class UserRepository extends BaseRepository<any> {
  constructor() {
    super(Admin as any);
  }

  private async getModelForUser(userId: string): Promise<any> {
    if (await Admin.exists({ _id: userId })) return Admin;
    if (await Manager.exists({ _id: userId })) return Manager;
    if (await Candidate.exists({ _id: userId })) return Candidate;
    return Admin; // fallback
  }

  async getProfile(userId: string) {
    const Model = await this.getModelForUser(userId);
    return Model.findById(userId).select("-password");
  }

  async getUserWithPassword(userId: string) {
    const Model = await this.getModelForUser(userId);
    return Model.findById(userId).select("+password");
  }

  async updateProfile(userId: string, payload: Partial<IUpdateProfile>) {
    const Model = await this.getModelForUser(userId);
    return Model.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select("-password");
  }

  async changePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const Model = await this.getModelForUser(userId);
    return Model.findByIdAndUpdate(
      userId,
      { password: hashedPassword, passwordChangedAt: new Date() },
      { new: true }
    );
  }

  async updateProfileImage(userId: string, profileImage: string) {
    const Model = await this.getModelForUser(userId);
    return Model.findByIdAndUpdate(userId, { profileImage }, { new: true }).select("-password");
  }

  async getSessions(userId: string) {
    const Model = await this.getModelForUser(userId);
    const user = await Model.findById(userId).select("sessions");
    return user?.sessions ?? [];
  }

  async removeSession(userId: string, sessionId: string) {
    const Model = await this.getModelForUser(userId);
    return Model.findByIdAndUpdate(
      userId,
      { $pull: { sessions: { sessionId } } },
      { new: true }
    );
  }

  async getDevices(userId: string) {
    const Model = await this.getModelForUser(userId);
    const user = await Model.findById(userId).select("devices");
    return user?.devices ?? [];
  }

  async trustDevice(userId: string, deviceId: string) {
    const Model = await this.getModelForUser(userId);
    return Model.findOneAndUpdate(
      { _id: userId, "devices.deviceId": deviceId },
      { $set: { "devices.$.trusted": true } },
      { new: true }
    );
  }

  async removeDevice(userId: string, deviceId: string) {
    const Model = await this.getModelForUser(userId);
    return Model.findByIdAndUpdate(
      userId,
      { $pull: { devices: { deviceId } } },
      { new: true }
    );
  }

  async updatePreferences(userId: string, preferences: Record<string, unknown>) {
    const Model = await this.getModelForUser(userId);
    return Model.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true }
    ).select("-password");
  }

  async getDashboard(userId: string) {
    const Model = await this.getModelForUser(userId);
    const user = await Model.findById(userId).select("sessions devices loginHistory");
    return {
      totalSessions: user?.sessions.length ?? 0,
      trustedDevices: user?.devices.filter((device: any) => device.trusted).length ?? 0,
      loginHistory: user?.loginHistory.length ?? 0,
    };
  }
}

export default new UserRepository();
