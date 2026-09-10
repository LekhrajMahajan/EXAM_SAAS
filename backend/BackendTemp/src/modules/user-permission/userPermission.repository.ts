import mongoose, { Types } from "mongoose";
import UserPermission, { IUserPermission, UserPermissionStatus } from "./userPermission.model";

class UserPermissionRepository {
  /**
   * Find all currently active and unexpired overrides for a specific user and company
   */
  async findActiveOverrides(userId: string, companyId?: string | null): Promise<any[]> {
    const now = new Date();
    const query: any = {
      userId: new Types.ObjectId(userId),
      status: UserPermissionStatus.ACTIVE,
      isDeleted: false,
      $and: [
        { $or: [{ effectiveFrom: null }, { effectiveFrom: { $lte: now } }] },
        { $or: [{ effectiveUntil: null }, { effectiveUntil: { $gt: now } }, { expiresAt: null }, { expiresAt: { $gt: now } }] }
      ]
    };

    if (companyId) {
      query.companyId = new Types.ObjectId(companyId);
    }

    return UserPermission.find(query).populate("permissionId").lean();
  }

  /**
   * Find all overrides (including expired or inactive) for UI difference view and audit history
   */
  async findAllByUser(userId: string, companyId?: string | null): Promise<any[]> {
    const query: any = {
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = new Types.ObjectId(companyId);
    }

    return UserPermission.find(query).populate("permissionId").sort({ updatedAt: -1 }).lean();
  }

  /**
   * Upsert a single permission override for a user
   */
  async upsertOverride(data: {
    userId: string;
    permissionId: string;
    companyId?: string | null;
    allowed: boolean;
    source: string;
    reason: string;
    effectiveFrom?: Date | null;
    effectiveUntil?: Date | null;
    createdBy?: string;
  }): Promise<any> {
    const filter = {
      userId: new Types.ObjectId(data.userId),
      permissionId: new Types.ObjectId(data.permissionId),
      companyId: data.companyId ? new Types.ObjectId(data.companyId) : null,
    };

    const update = {
      ...filter,
      isGranted: data.allowed,
      allowed: data.allowed,
      source: data.source,
      reason: data.reason || "",
      effectiveFrom: data.effectiveFrom || null,
      effectiveUntil: data.effectiveUntil || null,
      expiresAt: data.effectiveUntil || null,
      status: UserPermissionStatus.ACTIVE,
      isDeleted: false,
      deletedAt: null,
      updatedAt: new Date(),
      ...(data.createdBy ? { updatedBy: new Types.ObjectId(data.createdBy) } : {}),
    };

    return UserPermission.findOneAndUpdate(
      filter,
      { $set: update, $setOnInsert: { createdAt: new Date(), createdBy: data.createdBy ? new Types.ObjectId(data.createdBy) : null } },
      { upsert: true, returnDocument: "after" }
    ).lean();
  }

  /**
   * Bulk upsert overrides for multiple permissions
   */
  async bulkUpsertOverrides(
    userId: string,
    permissionIds: string[],
    data: {
      companyId?: string | null;
      allowed: boolean;
      source: string;
      reason: string;
      effectiveFrom?: Date | null;
      effectiveUntil?: Date | null;
      createdBy?: string;
    }
  ): Promise<any> {
    const operations = permissionIds.map((permId) => {
      const filter = {
        userId: new Types.ObjectId(userId),
        permissionId: new Types.ObjectId(permId),
        companyId: data.companyId ? new Types.ObjectId(data.companyId) : null,
      };

      const update = {
        ...filter,
        isGranted: data.allowed,
        allowed: data.allowed,
        source: data.source,
        reason: data.reason || "",
        effectiveFrom: data.effectiveFrom || null,
        effectiveUntil: data.effectiveUntil || null,
        expiresAt: data.effectiveUntil || null,
        status: UserPermissionStatus.ACTIVE,
        isDeleted: false,
        deletedAt: null,
        updatedAt: new Date(),
        ...(data.createdBy ? { updatedBy: new Types.ObjectId(data.createdBy) } : {}),
      };

      return {
        updateOne: {
          filter,
          update: { $set: update, $setOnInsert: { createdAt: new Date(), createdBy: data.createdBy ? new Types.ObjectId(data.createdBy) : null } },
          upsert: true,
        },
      };
    });

    if (operations.length === 0) return { modifiedCount: 0 };
    return UserPermission.bulkWrite(operations);
  }

  /**
   * Revoke (delete/revert to inherited role default) user overrides
   */
  async removeOverrides(userId: string, permissionIds: string[], companyId?: string | null): Promise<any> {
    const query: any = {
      userId: new Types.ObjectId(userId),
      permissionId: { $in: permissionIds.map((id) => new Types.ObjectId(id)) },
    };

    if (companyId) {
      query.companyId = new Types.ObjectId(companyId);
    }

    return UserPermission.updateMany(query, {
      $set: { isDeleted: true, deletedAt: new Date(), status: UserPermissionStatus.INACTIVE },
    });
  }

  /**
   * Bulk remove all overrides for a user within a company
   */
  async clearAllOverrides(userId: string, companyId?: string | null): Promise<any> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (companyId) query.companyId = new Types.ObjectId(companyId);
    return UserPermission.updateMany(query, {
      $set: { isDeleted: true, deletedAt: new Date(), status: UserPermissionStatus.INACTIVE },
    });
  }
}

export default new UserPermissionRepository();
