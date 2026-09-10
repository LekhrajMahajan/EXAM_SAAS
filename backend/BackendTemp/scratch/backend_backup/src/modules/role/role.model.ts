import { Schema, model } from "mongoose";

import { IRole, RoleStatus, RoleType, RoleCategory } from "./role.types";
import { BaseSchemaFields } from "../../shared/base.schema";

const RoleSchema = new Schema<IRole>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    roleName: {
      type: String,
      trim: true,
    },

    roleCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    roleType: {
      type: String,
      default: "CUSTOM",
      index: true,
    },

    category: {
      type: String,
      default: "CUSTOM",
      index: true,
    },

    parentRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },

    hierarchyLevel: {
      type: Number,
      default: 0,
    },

    priority: {
      type: Number,
      default: 50,
      index: true,
    },

    color: {
      type: String,
      default: "#3b82f6",
      trim: true,
    },

    icon: {
      type: String,
      default: "ShieldCheck",
      trim: true,
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

    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },

    systemRole: {
      type: Boolean,
      default: false,
    },

    defaultRole: {
      type: Boolean,
      default: false,
      index: true,
    },

    isCustom: {
      type: Boolean,
      default: false,
      index: true,
    },

    clonedFrom: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(RoleStatus),
      default: RoleStatus.ACTIVE,
      index: true,
    },

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Hooks & Virtuals
|--------------------------------------------------------------------------
*/

RoleSchema.pre("save", function () {
  if (!this.roleName) {
    this.roleName = this.displayName || this.name;
  }
  if (this.isSystem !== undefined && this.systemRole === undefined) {
    this.systemRole = this.isSystem;
  }
});

RoleSchema.virtual("permissionCount").get(function () {
  return this.permissions?.length || 0;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Prevent duplicate role names and codes within the same company
RoleSchema.index(
  {
    companyId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

RoleSchema.index(
  {
    companyId: 1,
    roleCode: 1,
  },
  {
    unique: true,
  },
);

// Search optimization
RoleSchema.index({
  companyId: 1,
  displayName: 1,
});

RoleSchema.index({
  companyId: 1,
  status: 1,
});

RoleSchema.index({
  companyId: 1,
  isDeleted: 1,
});


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Role = model<IRole>("Role", RoleSchema);

export default Role;
