import { z } from "zod";
import { RoleStatus } from "./role.types";

/*
|--------------------------------------------------------------------------
| Mongo ObjectId Validation
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export const createRoleSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === "object") {
      const data = { ...val };
      if (data.name && !data.displayName) {
        data.displayName = data.name;
        delete data.name;
      }
      if (data.slug && !data.name) {
        data.name = data.slug.toUpperCase();
        delete data.slug;
      } else if (data.slug) {
        delete data.slug;
      }
      return data;
    }
    return val;
  }, z.object({
    companyId: objectId.optional(),
    name: z.string().trim().min(3, "Role name is required").max(100).transform((value) => value.toUpperCase()),
    displayName: z.string().trim().min(3).max(100),
    roleName: z.string().trim().optional(),
    roleCode: z.string().trim().min(2, "Role code is required").max(50).transform((value) => value.toUpperCase()),
    roleType: z.string().trim().optional(),
    category: z.string().trim().optional(),
    parentRole: objectId.optional(),
    hierarchyLevel: z.number().int().min(0).optional().default(0),
    priority: z.number().int().optional(),
    color: z.string().trim().optional(),
    icon: z.string().trim().optional(),
    description: z.string().trim().max(500).optional(),
    permissions: z.array(objectId).default([]),
    isSystem: z.boolean().optional(),
    systemRole: z.boolean().optional(),
    defaultRole: z.boolean().optional(),
    isCustom: z.boolean().optional(),
    status: z.nativeEnum(RoleStatus).optional(),
  }))
});

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export const updateRoleSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess((val: any) => {
    if (val && typeof val === "object") {
      const data = { ...val };
      if (data.name && !data.displayName) {
        data.displayName = data.name;
        delete data.name;
      }
      if (data.slug && !data.name) {
        data.name = data.slug.toUpperCase();
        delete data.slug;
      } else if (data.slug) {
        delete data.slug;
      }
      return data;
    }
    return val;
  }, z.object({
    companyId: objectId.optional(),
    name: z.string().trim().min(3).max(100).transform((value) => value.toUpperCase()).optional(),
    displayName: z.string().trim().min(3).max(100).optional(),
    roleName: z.string().trim().optional(),
    roleCode: z.string().trim().min(2).max(50).transform((value) => value.toUpperCase()).optional(),
    roleType: z.string().trim().optional(),
    category: z.string().trim().optional(),
    parentRole: objectId.optional().nullable(),
    hierarchyLevel: z.number().int().min(0).optional(),
    priority: z.number().int().optional(),
    color: z.string().trim().optional(),
    icon: z.string().trim().optional(),
    description: z.string().trim().max(500).optional(),
    permissions: z.array(objectId).optional(),
    isSystem: z.boolean().optional(),
    systemRole: z.boolean().optional(),
    defaultRole: z.boolean().optional(),
    isCustom: z.boolean().optional(),
    clonedFrom: objectId.optional().nullable(),
    status: z.nativeEnum(RoleStatus).optional(),
  }).strict())
});


/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateRoleStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(RoleStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Assign Permissions
|--------------------------------------------------------------------------
*/

export const assignPermissionsSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess((val: any) => {
    if (val && typeof val === "object") {
      const data = { ...val };
      if (data.permissionIds && !data.permissions) {
        data.permissions = data.permissionIds;
        delete data.permissionIds;
      }
      return data;
    }
    return val;
  }, z.object({
    permissions: z.array(objectId).min(1, "Select at least one permission"),
  })),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const roleIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const roleQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    companyId: objectId.optional(),
    status: z.nativeEnum(RoleStatus).optional(),
    isSystem: z.coerce.boolean().optional(),
    roleType: z.string().trim().optional(),
    category: z.string().trim().optional(),
    defaultRole: z.coerce.boolean().optional(),
  }),
});
