import SidebarItem, {
  ISidebarItem,
  UserSidebarPreference,
  IUserSidebarPreference,
  SidebarAnalytics,
  ISidebarAnalytics,
} from "./sidebar.model";
import { Types } from "mongoose";

class SidebarRepository {
  /**
   * Fetch active, non-deleted sidebar items for system default and company specific
   */
  async findActiveItems(companyId?: string) {
    const query: any = {
      isDeleted: false,
      status: { $ne: "DISABLED" },
      $or: [{ isVisible: true }, { visible: true }],
    };
    if (companyId) {
      query.$or = [
        { companyId: null, isVisible: true },
        { companyId, isVisible: true },
        { companyId: null, visible: true },
        { companyId, visible: true },
      ];
    } else {
      query.companyId = null;
    }

    return await SidebarItem.find(query).sort({ order: 1 }).lean();
  }

  async findAll(companyId?: string) {
    const query: any = { isDeleted: false };
    if (companyId && companyId !== "null" && companyId !== "undefined") {
      query.$or = [{ companyId: null }, { companyId }];
    } else {
      query.companyId = null;
    }
    return await SidebarItem.find(query).sort({ order: 1 }).lean();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await SidebarItem.findOne({ _id: id, isDeleted: false });
  }

  async create(payload: Partial<ISidebarItem>) {
    if (payload.parent) payload.parentId = payload.parent;
    if (payload.parentId) payload.parent = payload.parentId;
    if (payload.isVisible !== undefined) payload.visible = payload.isVisible;
    if (payload.visible !== undefined) payload.isVisible = payload.visible;
    if (payload.isSystem !== undefined) payload.systemItem = payload.isSystem;
    if (payload.systemItem !== undefined) payload.isSystem = payload.systemItem;

    return await SidebarItem.create(payload);
  }

  async update(id: string, payload: Partial<ISidebarItem>) {
    if (!Types.ObjectId.isValid(id)) return null;
    if (payload.parent) payload.parentId = payload.parent;
    if (payload.parentId) payload.parent = payload.parentId;
    if (payload.isVisible !== undefined) payload.visible = payload.isVisible;
    if (payload.visible !== undefined) payload.isVisible = payload.visible;

    return await SidebarItem.findOneAndUpdate({ _id: id, isDeleted: false }, payload, {
      returnDocument: "after",
      new: true,
    });
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await SidebarItem.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, status: "DISABLED" },
      { returnDocument: "after", new: true }
    );
  }

  async updateOrder(id: string, order: number) {
    if (!Types.ObjectId.isValid(id)) return null;
    return await SidebarItem.findByIdAndUpdate(id, { order });
  }

  async getUserPreferences(userId: string | Types.ObjectId) {
    if (!userId) return null;
    return await UserSidebarPreference.findOne({ userId }).lean();
  }

  async upsertUserPreferences(
    userId: string | Types.ObjectId,
    update: Partial<IUserSidebarPreference> & Record<string, any>,
    companyId?: string | Types.ObjectId | null
  ) {
    return await UserSidebarPreference.findOneAndUpdate(
      { userId },
      { $set: { ...update, ...(companyId ? { companyId } : {}) } },
      { upsert: true, returnDocument: "after", new: true }
    );
  }

  async recordMenuOpen(itemId: string, itemRoute: string, itemTitle: string, companyId?: string | Types.ObjectId | null) {
    const query = { itemId, companyId: companyId || null };
    return await SidebarAnalytics.findOneAndUpdate(
      query,
      {
        $set: { itemRoute, itemTitle, lastOpenedAt: new Date() },
        $inc: { openCount: 1 },
      },
      { upsert: true, returnDocument: "after", new: true }
    );
  }

  async getAnalytics(companyId?: string | null) {
    const query: any = {};
    if (companyId) query.companyId = companyId;
    const analytics = await SidebarAnalytics.find(query).sort({ openCount: -1 }).lean();
    if (!analytics.length) {
      return {
        mostOpened: null,
        leastUsed: null,
        favoriteMenu: null,
        averageClickCount: 0,
        items: [],
      };
    }
    const totalClicks = analytics.reduce((acc, curr) => acc + (curr.openCount || 0), 0);
    return {
      mostOpened: analytics[0],
      leastUsed: analytics[analytics.length - 1],
      favoriteMenu: analytics[0], // proxy by high usage or tied to user favorites count
      averageClickCount: Math.round(totalClicks / analytics.length),
      items: analytics,
    };
  }
}

export default new SidebarRepository();
