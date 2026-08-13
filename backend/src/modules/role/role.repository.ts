import Role from "./role.model";
import { IRole } from "./role.types";
import { BaseRepository } from "../../common/base.repository";

class RoleRepository extends BaseRepository<IRole> {
  constructor() {
    super(Role, []);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Name
  |--------------------------------------------------------------------------
  */

  async findByName(name: string, companyId?: string) {
    return await Role.findOne({
      name,
      companyId: companyId ?? null,
      isDeleted: false,
    });
  }

  async findByCode(roleCode: string, companyId?: string) {
    return await Role.findOne({
      roleCode,
      companyId: companyId ?? null,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Assign Permissions
  |--------------------------------------------------------------------------
  */

  async assignPermissions(id: string, permissions: string[]) {
    return await Role.findByIdAndUpdate(
      id,
      {
        permissions,
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find System & Custom Roles (Phase 4.2)
  |--------------------------------------------------------------------------
  */

  async findSystemRoles() {
    return await Role.find({
      $or: [{ isSystem: true }, { systemRole: true }],
      isDeleted: false,
    }).sort({ priority: 1, hierarchyLevel: 1 });
  }

  async findCustomRoles(companyId?: string) {
    const filter: Record<string, unknown> = {
      isCustom: true,
      isDeleted: false,
    };
    if (companyId) {
      filter.companyId = companyId;
    }
    return await Role.find(filter).sort({ priority: 1, name: 1 });
  }

  async findByCompanyId(companyId: string) {
    return await Role.find({
      $or: [
        { companyId },
        { isSystem: true, companyId: null },
        { systemRole: true, companyId: null }
      ],
      isDeleted: false,
    }).sort({ priority: 1, hierarchyLevel: 1, name: 1 });
  }

  async findAllActive(companyId?: string | null) {
    const filter: Record<string, unknown> = { isDeleted: false, status: "ACTIVE" };
    if (companyId) {
      filter.$or = [
        { companyId },
        { isSystem: true, companyId: null },
        { systemRole: true, companyId: null }
      ];
    }
    return await Role.find(filter).sort({ priority: 1, hierarchyLevel: 1, name: 1 }).lean();
  }
}

export default new RoleRepository();
