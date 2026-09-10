import { Router } from "express";
import {
  getMyNavigation,
  getSidebarTree,
  getSidebarItems,
  createSidebarItem,
  updateSidebarItem,
  deleteSidebarItem,
  reorderSidebarItems,
  toggleFavorite,
  addRecent,
  updateCollapse,
  customizeMenu,
  getSidebarAnalytics,
} from "./sidebar.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

// Phase 4.4 Primary Dynamic Navigation Routes
router.get("/", authenticate, getMyNavigation);
router.get("/my-navigation", authenticate, getMyNavigation);
router.get("/tree", authenticate, getSidebarTree);
router.get("/analytics", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), getSidebarAnalytics);

// Phase 4.4 State & Personalization Routes
router.patch("/order", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), reorderSidebarItems);
router.patch("/reorder", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), reorderSidebarItems);
router.patch("/favorite", authenticate, toggleFavorite);
router.patch("/recent", authenticate, addRecent);
router.patch("/collapse", authenticate, updateCollapse);
router.patch("/custom", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), customizeMenu);

// Admin & UI Management compatibility routes
router.get("/admin/items", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), getSidebarItems);
router.post("/admin/items", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), createSidebarItem);
router.put("/admin/items/reorder", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), reorderSidebarItems);
router.put("/admin/items/:id", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), updateSidebarItem);

// Standard item CRUD
router.post("/", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), createSidebarItem);
router.patch("/:id", authenticate, authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN), updateSidebarItem);
router.delete("/:id", authenticate, authorize(UserRole.MASTER_ADMIN), deleteSidebarItem);

export default router;
