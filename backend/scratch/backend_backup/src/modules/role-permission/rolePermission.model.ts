import { Schema, model, HydratedDocument, Types } from "mongoose";
import { BaseSchemaFields } from "../../shared/base.schema";

export enum RolePermissionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IRolePermission {
  roleId: Types.ObjectId;
  permissionId: Types.ObjectId;
  companyId?: Types.ObjectId | null;
  allowed: boolean;
  status: RolePermissionStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RolePermissionDocument = HydratedDocument<IRolePermission>;

const RolePermissionSchema = new Schema<IRolePermission>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(RolePermissionStatus),
      default: RolePermissionStatus.ACTIVE,
      index: true,
    },
    allowed: {
      type: Boolean,
      default: true,
      index: true,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "role_permissions",
  }
);

// Prevent duplicate assignment of the same permission to the exact same role in the same company
RolePermissionSchema.index(
  { roleId: 1, permissionId: 1, companyId: 1 },
  { unique: true }
);

const RolePermission = model<IRolePermission>("RolePermission", RolePermissionSchema);

export default RolePermission;
