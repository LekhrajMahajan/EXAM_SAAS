import { Schema, model } from "mongoose";

import {
  IPermission,
  PermissionDocument,
  PermissionStatus,
} from "./permission.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const PermissionSchema = new Schema<IPermission>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },

    module: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    group: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    resource: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
      default: "FEATURE",
    },

    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    permissionKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    apiEndpoint: {
      type: String,
      default: "",
      trim: true,
    },

    httpMethod: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    frontendRoute: {
      type: String,
      default: "",
      trim: true,
    },

    icon: {
      type: String,
      default: "ShieldCheck",
      trim: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },

    isSystemPermission: {
      type: Boolean,
      default: false,
      index: true,
    },

    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PermissionStatus),
      default: PermissionStatus.ACTIVE,
      index: true,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
| Compound Unique Indexes
|--------------------------------------------------------------------------
|
| Same permission cannot exist twice within the same company scope
|
*/

PermissionSchema.index(
  {
    companyId: 1,
    module: 1,
    action: 1,
  },
  {
    unique: true,
  },
);

PermissionSchema.index(
  {
    companyId: 1,
    permissionKey: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Search Indexes
|--------------------------------------------------------------------------
*/

PermissionSchema.index({
  group: 1,
  module: 1,
  sortOrder: 1,
});

PermissionSchema.index({
  companyId: 1,
  status: 1,
});

PermissionSchema.index({
  companyId: 1,
  isDeleted: 1,
});

PermissionSchema.index({
  displayName: "text",
  description: "text",
  permissionKey: "text",
  resource: "text",
});

/*
|--------------------------------------------------------------------------
| Pre-validate Hook & Compatibility Synchronization
|--------------------------------------------------------------------------
*/

PermissionSchema.pre("validate", function () {
  if (!this.permissionKey && this.name) {
    this.permissionKey = this.name.toLowerCase();
  }
  if (!this.name && this.permissionKey) {
    this.name = this.permissionKey.toLowerCase();
  }
  if (!this.resource && this.permissionKey) {
    this.resource = this.permissionKey.split(".")[0] || "system";
  }
  if (!this.group && this.module) {
    this.group = this.module.charAt(0) + this.module.slice(1).toLowerCase().replace(/_/g, " ");
  }
  // Keep isSystem and isSystemPermission completely in sync
  if (this.isSystemPermission !== undefined && this.isSystem === false && this.isSystemPermission === true) {
    this.isSystem = true;
  } else if (this.isSystem !== undefined && this.isSystemPermission === false && this.isSystem === true) {
    this.isSystemPermission = true;
  }
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Permission = model<IPermission>("Permission", PermissionSchema);

export default Permission;
