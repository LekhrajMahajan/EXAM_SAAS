import mongoose from "mongoose";
import Admin from "../admin/admin.model";
import Manager from "../manager/manager.model";
import Candidate from "../candidate/candidate.model";
import User from "./user.model";
import { IUser } from "./user.types";
import { BaseRepository } from "../../common/base.repository";
import { UserRole } from "../../constants/roles";

class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(Admin as any, []);
  }

  private getModelByRole(role: string) {
    if (["MASTER_ADMIN", "COMPANY_ADMIN", "ADMIN"].includes(role)) return Admin;
    if (role === "CANDIDATE") return Candidate;
    return Manager;
  }

  async create(payload: Partial<IUser>, session?: import("mongoose").ClientSession) {
    const Model = this.getModelByRole(payload.role as string);
    const doc = new Model(payload);
    return await doc.save({ session });
  }

  async hardDelete(id: string, session?: import("mongoose").ClientSession) {
    let deleted = await Admin.findByIdAndDelete(id, { session });
    if (!deleted) deleted = await Manager.findByIdAndDelete(id, { session });
    if (!deleted) deleted = await Candidate.findByIdAndDelete(id, { session });
    if (!deleted) deleted = await User.findByIdAndDelete(id, { session });
    return deleted;
  }

  async update(id: string, payload: Partial<IUser>, populateFields?: string[], session?: import("mongoose").ClientSession) {
    const options = { new: true, runValidators: true, session };
    
    let ModelToUpdate: any = Admin;
    let userDoc = await Admin.findById(id).select("_id");
    
    if (!userDoc) {
      userDoc = await Manager.findById(id).select("_id");
      ModelToUpdate = Manager;
    }
    
    if (!userDoc) {
      userDoc = await Candidate.findById(id).select("_id");
      ModelToUpdate = Candidate;
    }

    if (!userDoc) {
      userDoc = await User.findById(id).select("_id");
      ModelToUpdate = User;
    }

    if (!userDoc) return null;

    return await ModelToUpdate.findByIdAndUpdate(id, payload, options);
  }

  async findByEmail(email: string) {
    let user = await Admin.findOne({ email });
    if (!user) user = await Manager.findOne({ email });
    if (!user) user = await Candidate.findOne({ email });
    if (!user) user = await User.findOne({ email });
    return user;
  }

  async findByEmailWithPassword(email: string) {
    let user = await Admin.findOne({ email }).select("+password +refreshToken");
    if (!user) user = await Manager.findOne({ email }).select("+password +refreshToken");
    if (!user) user = await Candidate.findOne({ email }).select("+password +refreshToken");
    if (!user) user = await User.findOne({ email }).select("+password +refreshToken");
    return user;
  }

  async findById(id: string, populateFields?: string[]) {
    let user = await Admin.findOne({ _id: id, isDeleted: false });
    if (!user) user = await Manager.findOne({ _id: id, isDeleted: false });
    if (!user) user = await Candidate.findOne({ _id: id, isDeleted: false });
    if (!user) user = await User.findOne({ _id: id, isDeleted: false });
    return user;
  }

  async findByIdWithPassword(id: string) {
    let user = await Admin.findById(id).select("+password +refreshToken");
    if (!user) user = await Manager.findById(id).select("+password +refreshToken");
    if (!user) user = await Candidate.findById(id).select("+password +refreshToken");
    if (!user) user = await User.findById(id).select("+password +refreshToken");
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const options = { new: true };
    
    let ModelToUpdate: any = Admin;
    let userDoc = await Admin.findById(userId).select("_id");
    
    if (!userDoc) {
      userDoc = await Manager.findById(userId).select("_id");
      ModelToUpdate = Manager;
    }
    
    if (!userDoc) {
      userDoc = await Candidate.findById(userId).select("_id");
      ModelToUpdate = Candidate;
    }

    if (!userDoc) {
      userDoc = await User.findById(userId).select("_id");
      ModelToUpdate = User;
    }

    if (!userDoc) return null;

    return await ModelToUpdate.findByIdAndUpdate(userId, { refreshToken }, options);
  }

  async updateLastLogin(userId: string) {
    const options = { new: true };
    let user = await Admin.findByIdAndUpdate(userId, { lastLogin: new Date() }, options);
    if (!user) user = await Manager.findByIdAndUpdate(userId, { lastLogin: new Date() }, options);
    if (!user) user = await Candidate.findByIdAndUpdate(userId, { lastLogin: new Date() }, options);
    if (!user) user = await User.findByIdAndUpdate(userId, { lastLogin: new Date() }, options);
    return user;
  }

  async exists(email: string) {
    return (
      (await Admin.exists({ email })) ||
      (await Manager.exists({ email })) ||
      (await Candidate.exists({ email })) ||
      (await User.exists({ email }))
    );
  }

  async findByRefreshToken(refreshToken: string) {
    let user = await Admin.findOne({ refreshToken }).select("+refreshToken");
    if (!user) user = await Manager.findOne({ refreshToken }).select("+refreshToken");
    if (!user) user = await Candidate.findOne({ refreshToken }).select("+refreshToken");
    if (!user) user = await User.findOne({ refreshToken }).select("+refreshToken");
    return user;
  }

  async clearRefreshToken(userId: string) {
    const options = { new: true };
    let user = await Admin.findByIdAndUpdate(userId, { refreshToken: null }, options);
    if (!user) user = await Manager.findByIdAndUpdate(userId, { refreshToken: null }, options);
    if (!user) user = await Candidate.findByIdAndUpdate(userId, { refreshToken: null }, options);
    if (!user) user = await User.findByIdAndUpdate(userId, { refreshToken: null }, options);
    return user;
  }

  async addLoginHistory(
    userId: string,
    entry: {
      ipAddress?: string;
      browser?: string;
      operatingSystem?: string;
      location?: string;
      loginAt: Date;
      successful: boolean;
    }
  ) {
    const update = {
      $push: {
        loginHistory: {
          $each: [entry],
          $position: 0,
          $slice: 200,
        },
      },
      ...(entry.successful ? { lastLoginAt: entry.loginAt } : {}),
    };
    const options = { new: true };

    let user = await Admin.findByIdAndUpdate(userId, update, options);
    if (!user) user = await Manager.findByIdAndUpdate(userId, update, options);
    if (!user) user = await Candidate.findByIdAndUpdate(userId, update, options);
    if (!user) user = await User.findByIdAndUpdate(userId, update, options);
    return user;
  }

  async findByEmailOnly(email: string) {
    let user = await Admin.findOne({ email }).select("_id");
    if (!user) user = await Manager.findOne({ email }).select("_id");
    if (!user) user = await Candidate.findOne({ email }).select("_id");
    if (!user) user = await User.findOne({ email }).select("_id");
    return user;
  }
}

export default new AuthRepository();
