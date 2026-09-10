import { Schema, model, HydratedDocument, Types } from "mongoose";
import { BaseSchemaFields } from "../../shared/base.schema";

export interface ISidebarItem {
  title: string;
  icon: string;
  route: string;
  moduleKey?: string;
  permissionKey?: string;
  featureKey?: string;
  parent?: Types.ObjectId | null;
  parentId?: Types.ObjectId | null;
  badge?: string;
  category?: string;
  description?: string;
  status?: "ACTIVE" | "DISABLED" | "HIDDEN";
  order: number;
  isVisible: boolean;
  visible?: boolean;
  companyId?: Types.ObjectId | null;
  isSystem: boolean;
  systemItem?: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SidebarItemDocument = HydratedDocument<ISidebarItem>;

const SidebarItemSchema = new Schema<ISidebarItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "LayoutDashboard",
      trim: true,
    },
    route: {
      type: String,
      required: true,
      trim: true,
    },
    moduleKey: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
      index: true,
    },
    permissionKey: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },
    featureKey: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "SidebarItem",
      default: null,
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "SidebarItem",
      default: null,
      index: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Main",
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED", "HIDDEN"],
      default: "ACTIVE",
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
    visible: {
      type: Boolean,
      default: true,
      index: true,
    },
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
    systemItem: {
      type: Boolean,
      default: false,
      index: true,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "sidebar_items",
  }
);

SidebarItemSchema.index({ companyId: 1, order: 1 });
SidebarItemSchema.index({ companyId: 1, isVisible: 1, status: 1, isDeleted: 1 });

// Pre-save hook to synchronize parent/parentId and isVisible/visible, isSystem/systemItem for backward and forward compatibility
SidebarItemSchema.pre("save", function () {
  if (this.isModified("parentId") && this.parentId !== undefined) {
    this.parent = this.parentId;
  } else if (this.isModified("parent") && this.parent !== undefined) {
    this.parentId = this.parent;
  }
  if (this.isModified("visible") && this.visible !== undefined) {
    this.isVisible = this.visible;
  } else if (this.isModified("isVisible") && this.isVisible !== undefined) {
    this.visible = this.isVisible;
  }
  if (this.isModified("systemItem") && this.systemItem !== undefined) {
    this.isSystem = this.systemItem;
  } else if (this.isModified("isSystem") && this.isSystem !== undefined) {
    this.systemItem = this.isSystem;
  }
});

const SidebarItem = model<ISidebarItem>("SidebarItem", SidebarItemSchema);

// User preferences schema for favorites, recents, and collapsed mode
export interface IUserSidebarPreference {
  userId: Types.ObjectId;
  companyId?: Types.ObjectId | null;
  favorites: string[];
  recents: string[];
  collapsedMode: "expanded" | "collapsed" | "mini";
  customOrder?: Record<string, number>;
  userOverrides?: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSidebarPreferenceSchema = new Schema<IUserSidebarPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", default: null, index: true },
    favorites: [{ type: String, default: [] }],
    recents: [{ type: String, default: [] }],
    collapsedMode: { type: String, enum: ["expanded", "collapsed", "mini"], default: "expanded" },
    customOrder: { type: Schema.Types.Mixed, default: {} },
    userOverrides: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false, collection: "user_sidebar_preferences" }
);

export const UserSidebarPreference = model<IUserSidebarPreference>("UserSidebarPreference", UserSidebarPreferenceSchema);

// Analytics schema for menu usage tracking
export interface ISidebarAnalytics {
  companyId?: Types.ObjectId | null;
  itemId: string;
  itemRoute: string;
  itemTitle: string;
  openCount: number;
  lastOpenedAt: Date;
}

const SidebarAnalyticsSchema = new Schema<ISidebarAnalytics>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", default: null, index: true },
    itemId: { type: String, required: true, index: true },
    itemRoute: { type: String, required: true },
    itemTitle: { type: String, required: true },
    openCount: { type: Number, default: 0 },
    lastOpenedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false, collection: "sidebar_analytics" }
);

SidebarAnalyticsSchema.index({ companyId: 1, itemId: 1 }, { unique: true });
export const SidebarAnalytics = model<ISidebarAnalytics>("SidebarAnalytics", SidebarAnalyticsSchema);

export default SidebarItem;
