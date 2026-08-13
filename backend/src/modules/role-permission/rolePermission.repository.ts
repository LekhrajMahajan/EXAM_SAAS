import RolePermission, { IRolePermission, RolePermissionStatus } from "./rolePermission.model";
import { BaseRepository } from "../../common/base.repository";

class RolePermissionRepository extends BaseRepository<IRolePermission> {
  constructor() {
    super(RolePermission, ["roleId", "permissionId"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Synchronize Permission Assignment
  |--------------------------------------------------------------------------
  */

  async syncRolePermission(roleId: string, permissionId: string, companyId?: string | null, allowed = true) {
    return await RolePermission.findOneAndUpdate(
      { roleId, permissionId, companyId: companyId ?? null },
      { 
        status: allowed ? RolePermissionStatus.ACTIVE : RolePermissionStatus.INACTIVE, 
        allowed, 
        isDeleted: !allowed 
      },
      { upsert: true, new: true }
    );
  }

  async deactivateUnselected(roleId: string, keepPermissionIds: string[]) {
    return await RolePermission.updateMany(
      { roleId, permissionId: { $nin: keepPermissionIds } },
      { status: RolePermissionStatus.INACTIVE, allowed: false, isDeleted: true }
    );
  }

  async findByRoleId(roleId: string) {
    return await RolePermission.find({
      roleId,
      status: RolePermissionStatus.ACTIVE,
      allowed: true,
      isDeleted: false,
    }).populate("permissionId");
  }

  async findMatrixByCompany(companyId?: string) {
    const filter: Record<string, unknown> = {
      status: RolePermissionStatus.ACTIVE,
      allowed: true,
      isDeleted: false,
    };

    if (companyId) {
      filter.$or = [{ companyId }, { companyId: null }];
    } else {
      filter.companyId = null;
    }

    return await RolePermission.find(filter).lean();
  }

  async deactivateByRoleAndPermission(roleId: string, permissionId: string) {
    return await RolePermission.findOneAndUpdate(
      { roleId, permissionId },
      { status: RolePermissionStatus.INACTIVE, allowed: false, isDeleted: true },
      { new: true }
    );
  }

  async deactivateAllByRoleId(roleId: string) {
    return await RolePermission.updateMany(
      { roleId },
      { status: RolePermissionStatus.INACTIVE, allowed: false, isDeleted: true }
    );
  }
}

export default new RolePermissionRepository();
