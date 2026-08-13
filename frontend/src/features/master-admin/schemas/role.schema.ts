import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(3, "Role Name must be at least 3 characters").max(100),
  displayName: z.string().min(3, "Display Name must be at least 3 characters").max(100),
  roleCode: z.string().min(2, "Role Code must be at least 2 characters").max(50),
  description: z.string().max(500, "Description too long").optional(),
  parentRole: z.string().optional(),
  hierarchyLevel: z.number().min(0),
  roleType: z.string().optional(),
  category: z.string().optional(),
  priority: z.number().min(0).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  isSystem: z.boolean(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
