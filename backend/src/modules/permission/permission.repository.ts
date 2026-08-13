import Permission from "./permission.model";
import { IPermission, PermissionDocument } from "./permission.types";
import { BaseRepository } from "../../common/base.repository";

class PermissionRepository extends BaseRepository<IPermission> {
  constructor() {
    super(Permission, [], ["displayName", "description", "permissionKey", "resource"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Name
  |--------------------------------------------------------------------------
  */

  async findByName(name: string, companyId?: string | null) {
    return await Permission.findOne({
      name: name.toLowerCase(),
      companyId: companyId ?? null,
      isDeleted: false,
    }) as PermissionDocument | null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Permission Key
  |--------------------------------------------------------------------------
  */

  async findByPermissionKey(permissionKey: string, companyId?: string | null) {
    return await Permission.findOne({
      permissionKey: permissionKey.toLowerCase(),
      companyId: companyId ?? null,
      isDeleted: false,
    }) as PermissionDocument | null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find With Deleted By Id
  |--------------------------------------------------------------------------
  */

  async findWithDeletedById(id: string) {
    return await Permission.findOne({ _id: id } as any) as PermissionDocument | null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Display Name
  |--------------------------------------------------------------------------
  */

  async findByDisplayName(displayName: string, companyId?: string | null) {
    return await Permission.findOne({
      displayName: { $regex: new RegExp(`^${displayName}$`, "i") },
      companyId: companyId ?? null,
      isDeleted: false,
    }) as PermissionDocument | null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Module & Action
  |--------------------------------------------------------------------------
  */

  async findByModuleAction(permModule: string, action: string, companyId?: string | null) {
    const filter: Record<string, unknown> = {
      module: permModule.toUpperCase(),
      action: action.toUpperCase(),
      companyId: companyId ?? null,
      isDeleted: false,
    };
    return await Permission.findOne(filter) as PermissionDocument | null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Group
  |--------------------------------------------------------------------------
  */

  async findByGroup(group: string, companyId?: string | null) {
    const filter: Record<string, unknown> = {
      group: { $regex: new RegExp(`^${group}$`, "i") },
      isDeleted: false,
    };
    if (companyId !== undefined) {
      filter.$or = [{ companyId: null }, { companyId }];
    }
    return await Permission.find(filter).sort({ sortOrder: 1, displayName: 1 }) as PermissionDocument[];
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Module
  |--------------------------------------------------------------------------
  */

  async findByModule(moduleName: string, companyId?: string | null) {
    const filter: Record<string, unknown> = {
      module: moduleName.toUpperCase(),
      isDeleted: false,
    };
    if (companyId !== undefined) {
      filter.$or = [{ companyId: null }, { companyId }];
    }
    return await Permission.find(filter).sort({ sortOrder: 1, displayName: 1 }) as PermissionDocument[];
  }

  /*
  |--------------------------------------------------------------------------
  | Advanced Search & Filter
  |--------------------------------------------------------------------------
  */

  async searchPermissions(params: {
    page?: number;
    limit?: number;
    keyword?: string;
    search?: string;
    companyId?: string | null;
    module?: string;
    group?: string;
    action?: string;
    resource?: string;
    category?: string;
    status?: string;
    isSystem?: boolean;
    isSystemPermission?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 50;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { isDeleted: false };

    if (params.companyId !== undefined) {
      filter.$or = [{ companyId: null }, { companyId: params.companyId }];
    }
    if (params.module) filter.module = params.module.toUpperCase();
    if (params.group) filter.group = { $regex: new RegExp(`^${params.group}$`, "i") };
    if (params.action) filter.action = params.action.toUpperCase();
    if (params.resource) filter.resource = params.resource.toLowerCase();
    if (params.category) filter.category = params.category.toUpperCase();
    if (params.status) filter.status = params.status;
    if (params.isSystem !== undefined) filter.isSystem = params.isSystem;
    if (params.isSystemPermission !== undefined) filter.isSystemPermission = params.isSystemPermission;

    const searchTerm = params.keyword || params.search;
    if (searchTerm) {
      filter.$or = [
        { displayName: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { permissionKey: { $regex: searchTerm, $options: "i" } },
        { resource: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } }
      ];
    }

    const sortField = params.sortBy || "sortOrder";
    const sortDir = params.sortOrder === "desc" ? -1 : 1;
    const sortConfig: Record<string, 1 | -1> = { [sortField]: sortDir, displayName: 1 };

    const [data, total] = await Promise.all([
      Permission.find(filter).sort(sortConfig).skip(skip).limit(limit),
      Permission.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Count with Filter
  |--------------------------------------------------------------------------
  */

  async countByFilter(filter: Record<string, unknown>) {
    return await Permission.countDocuments({ ...filter, isDeleted: false });
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk & Active Queries for RBAC Matrix
  |--------------------------------------------------------------------------
  */

  async findByIds(ids: string[]) {
    return await Permission.find({
      _id: { $in: ids },
      isDeleted: false,
    });
  }

  async findAllActive(companyId?: string | null) {
    const filter: Record<string, any> = { isDeleted: false };
    if (companyId) {
      filter.$or = [{ companyId }, { companyId: null }];
    } else {
      filter.companyId = null;
    }
    return await Permission.find(filter).sort({ category: 1, sortOrder: 1, displayName: 1 }).lean();
  }
}

export default new PermissionRepository();
