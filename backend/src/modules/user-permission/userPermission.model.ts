import { Schema, model, HydratedDocument, Types } from "mongoose";
import { BaseSchemaFields } from "../../shared/base.schema";

export enum UserPermissionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUserPermission {
  userId: Types.ObjectId;
  permissionId: Types.ObjectId;
  companyId?: Types.ObjectId | null;
  isGranted: boolean;
  allowed: boolean;
  source: string;
  effectiveFrom?: Date | null;
  effectiveUntil?: Date | null;
  expiresAt?: Date | null;
  reason?: string;
  status: UserPermissionStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPermissionDocument = HydratedDocument<IUserPermission>;

const UserPermissionSchema = new Schema<IUserPermission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    isGranted: {
      type: Boolean,
      default: true,
    },
    allowed: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ["OVERRIDE", "TEMPORARY_GRANT", "TEMPORARY_DENY", "PERMANENT_GRANT", "PERMANENT_DENY", "SYSTEM", "ADMIN"],
      default: "OVERRIDE",
      index: true,
    },
    effectiveFrom: {
      type: Date,
      default: null,
      index: true,
    },
    effectiveUntil: {
      type: Date,
      default: null,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(UserPermissionStatus),
      default: UserPermissionStatus.ACTIVE,
      index: true,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "user_permissions",
  }
);

UserPermissionSchema.index(
  { userId: 1, permissionId: 1, companyId: 1 },
  { unique: true }
);

const UserPermission = model<IUserPermission>("UserPermission", UserPermissionSchema);

export default UserPermission;
