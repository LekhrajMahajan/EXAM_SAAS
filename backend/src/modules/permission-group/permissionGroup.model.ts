import { Schema, model, HydratedDocument, Types } from "mongoose";
import { BaseSchemaFields } from "../../shared/base.schema";

export interface IPermissionGroup {
  groupName: string;
  groupCode: string;
  description?: string;
  permissions: Types.ObjectId[];
  companyId?: Types.ObjectId | null;
  isSystem: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PermissionGroupDocument = HydratedDocument<IPermissionGroup>;

const PermissionGroupSchema = new Schema<IPermissionGroup>(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "permission_groups",
  }
);

PermissionGroupSchema.index(
  { companyId: 1, groupCode: 1 },
  { unique: true }
);

const PermissionGroup = model<IPermissionGroup>("PermissionGroup", PermissionGroupSchema);

export default PermissionGroup;
