import { z } from "zod";
import { StaffAssignmentRole, AssignmentStatus, AssignmentType } from "./staffAssignment.types";

const objectId = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createAssignmentSchema = z.object({
  body: z.object({
    companyId: objectId.optional(),
    examId: objectId,
    centerId: objectId.optional().nullable(),
    roomId: objectId.optional().nullable(),
    shiftId: objectId.optional().nullable(),
    building: z.string().optional(),
    floor: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    employeeId: objectId,
    assignmentType: z.string().optional(),
    status: z.string().optional(),
    scheduledDate: z.string().or(z.date()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    instructions: z.string().optional(),
    reportingTime: z.string().optional(),
  }),
});

export const autoAssignmentSchema = z.object({
  body: z.object({
    companyId: objectId.optional(),
    examId: objectId,
    role: z.string().min(1, "Role is required"),
    requiredCount: z.coerce.number().min(1).default(1),
    shiftId: objectId.optional(),
    centerId: objectId.optional(),
    roomId: objectId.optional(),
    scheduledDate: z.string().or(z.date()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const bulkAssignmentSchema = z.object({
  body: z.object({
    companyId: objectId.optional(),
    assignments: z.array(z.record(z.string(), z.any())).min(1, "At least one assignment is required for bulk operation"),
  }),
});

export const replaceAssignmentSchema = z.object({
  body: z.object({
    id: objectId.optional(),
    replacedByEmployeeId: objectId.optional(),
    newEmployeeId: objectId.optional(),
    reason: z.string().optional(),
  }),
});

export const statusUpdateSchema = z.object({
  body: z.object({
    id: objectId.optional(),
    reason: z.string().optional(),
  }),
});
