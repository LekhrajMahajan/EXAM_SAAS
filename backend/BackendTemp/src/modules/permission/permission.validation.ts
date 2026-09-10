import { z } from "zod";
import {
  PermissionAction,
  PermissionModule,
  PermissionStatus,
  PermissionCategory,
  PermissionGroup,
} from "./permission.types";

/*
|--------------------------------------------------------------------------
| Mongo ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Permission Schema
|--------------------------------------------------------------------------
*/

export const createPermissionSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === "object") {
      const data = { ...val };
      if (data.name && !data.displayName) {
        data.displayName = data.name;
        delete data.name;
      }
      if (data.slug && !data.action) {
        const parts = data.slug.split(':');
        data.action = parts.length > 1 ? parts[1].toUpperCase() : data.slug.toUpperCase();
        delete data.slug;
      } else if (data.slug) {
        delete data.slug;
      }
      if (data.module && typeof data.module === "string") {
        data.module = data.module.toUpperCase();
      }
      if (data.category && typeof data.category === "string") {
        data.category = data.category.toUpperCase();
      }
      if (data.action && typeof data.action === "string") {
        data.action = data.action.toUpperCase();
      }
      if (data.permissionKey && !data.name) {
        data.name = data.permissionKey.toLowerCase();
      }
      return data;
    }
    return val;
  }, z.object({
    companyId: objectId.optional().nullable(),
    permissionKey: z.string().trim().min(3).max(150).toLowerCase().optional(),
    module: z.string().trim().min(2),
    group: z.string().trim().min(2).optional(),
    action: z.string().trim().min(2),
    resource: z.string().trim().min(2).optional(),
    category: z.string().trim().min(2).default("FEATURE"),
    name: z.string().trim().min(3).max(150).transform((value) => value.toLowerCase()).optional(),
    displayName: z.string().trim().min(3).max(150),
    description: z.string().trim().max(500).optional(),
    apiEndpoint: z.string().trim().optional(),
    httpMethod: z.string().trim().toUpperCase().optional(),
    frontendRoute: z.string().trim().optional(),
    icon: z.string().trim().optional(),
    sortOrder: z.coerce.number().int().optional(),
    isSystem: z.boolean().optional(),
    isSystemPermission: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    status: z.nativeEnum(PermissionStatus).optional(),
  }))
});

/*
|--------------------------------------------------------------------------
| Update Permission Schema
|--------------------------------------------------------------------------
*/

export const updatePermissionSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess((val: any) => {
    if (val && typeof val === "object") {
      const data = { ...val };
      if (data.module && typeof data.module === "string") {
        data.module = data.module.toUpperCase();
      }
      if (data.category && typeof data.category === "string") {
        data.category = data.category.toUpperCase();
      }
      if (data.action && typeof data.action === "string") {
        data.action = data.action.toUpperCase();
      }
      return data;
    }
    return val;
  }, z.object({
    companyId: objectId.optional().nullable(),
    permissionKey: z.string().trim().min(3).max(150).toLowerCase().optional(),
    module: z.string().trim().min(2).optional(),
    group: z.string().trim().min(2).optional(),
    action: z.string().trim().min(2).optional(),
    resource: z.string().trim().min(2).optional(),
    category: z.string().trim().min(2).optional(),
    name: z.string().trim().min(3).max(150).transform((value) => value.toLowerCase()).optional(),
    displayName: z.string().trim().min(3).max(150).optional(),
    description: z.string().trim().max(500).optional(),
    apiEndpoint: z.string().trim().optional(),
    httpMethod: z.string().trim().toUpperCase().optional(),
    frontendRoute: z.string().trim().optional(),
    icon: z.string().trim().optional(),
    sortOrder: z.coerce.number().int().optional(),
    isVisible: z.boolean().optional(),
    status: z.nativeEnum(PermissionStatus).optional(),
  }).strict())
});

/*
|--------------------------------------------------------------------------
| Update Status Schema
|--------------------------------------------------------------------------
*/

export const updatePermissionStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(PermissionStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params Schemas
|--------------------------------------------------------------------------
*/

export const permissionIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const permissionGroupSchema = z.object({
  params: z.object({
    group: z.string().trim().min(1),
  }),
});

export const permissionModuleSchema = z.object({
  params: z.object({
    module: z.string().trim().min(1),
  }),
});

/*
|--------------------------------------------------------------------------
| Query Schema
|--------------------------------------------------------------------------
*/

export const permissionQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(500).default(50),
    search: z.string().trim().optional(),
    keyword: z.string().trim().optional(),
    companyId: objectId.optional(),
    module: z.string().trim().optional(),
    group: z.string().trim().optional(),
    action: z.string().trim().optional(),
    resource: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.nativeEnum(PermissionStatus).optional(),
    isSystem: z.coerce.boolean().optional(),
    isSystemPermission: z.coerce.boolean().optional(),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
