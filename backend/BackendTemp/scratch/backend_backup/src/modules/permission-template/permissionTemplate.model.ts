import { Schema, model, HydratedDocument, Types } from "mongoose";
import { BaseSchemaFields } from "../../shared/base.schema";

export interface IPermissionTemplate {
  templateName: string;
  templateCode: string;
  targetRoleCode?: string;
  description?: string;
  permissionKeys: string[];
  isSystem: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PermissionTemplateDocument = HydratedDocument<IPermissionTemplate>;

const PermissionTemplateSchema = new Schema<IPermissionTemplate>(
  {
    templateName: {
      type: String,
      required: true,
      trim: true,
    },
    templateCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    targetRoleCode: {
      type: String,
      uppercase: true,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    permissionKeys: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isSystem: {
      type: Boolean,
      default: true,
      index: true,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "permission_templates",
  }
);

const PermissionTemplate = model<IPermissionTemplate>("PermissionTemplate", PermissionTemplateSchema);

export default PermissionTemplate;
