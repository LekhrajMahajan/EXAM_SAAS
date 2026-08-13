import { BaseRepository } from "../../common/base.repository";
import StaffAssignment from "./staffAssignment.model";
import { IStaffAssignment, AssignmentStatus } from "./staffAssignment.types";
import { Types } from "mongoose";

class StaffAssignmentRepository extends BaseRepository<IStaffAssignment> {
  constructor() {
    super(
      StaffAssignment,
      ["examId", "branchId", "centerId", "roomId", "shiftId", "employeeId"],
      ["role", "employeeCode", "employeeName", "building", "floor", "instructions", "rejectionReason"]
    );
  }

  async findActiveByEmployee(employeeId: string, companyId?: string) {
    const query: Record<string, any> = {
      employeeId,
      isDeleted: false,
      status: { $ne: AssignmentStatus.CANCELLED },
    };
    if (companyId) query.companyId = companyId;
    return await StaffAssignment.find(query).populate(this.defaultPopulate).exec();
  }

  async findByExamAndEmployee(examId: string, employeeId: string) {
    return await StaffAssignment.find({
      examId,
      employeeId,
      isDeleted: false,
      status: { $ne: AssignmentStatus.CANCELLED },
    }).exec();
  }

  async findByShiftAndCenter(shiftId: string, centerId?: string) {
    const query: Record<string, any> = {
      shiftId,
      isDeleted: false,
      status: { $ne: AssignmentStatus.CANCELLED },
    };
    if (centerId) query.centerId = centerId;
    return await StaffAssignment.find(query).populate(this.defaultPopulate).exec();
  }

  async findByRoomAndTime(roomId: string, scheduledDate?: Date, startTime?: string, endTime?: string) {
    const query: Record<string, any> = {
      roomId,
      isDeleted: false,
      status: { $ne: AssignmentStatus.CANCELLED },
    };
    if (scheduledDate) {
      const startOfDay = new Date(scheduledDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(scheduledDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
    }
    return await StaffAssignment.find(query).exec();
  }

  async getDashboardStats(companyId: string, branchId?: string, centerId?: string, employeeId?: string) {
    const match: Record<string, any> = {
      companyId: new Types.ObjectId(companyId),
      isDeleted: false,
    };
    if (branchId) match.branchId = new Types.ObjectId(branchId);
    if (centerId) match.centerId = new Types.ObjectId(centerId);
    if (employeeId) match.employeeId = new Types.ObjectId(employeeId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const stats = await StaffAssignment.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalAssignments: { $sum: 1 },
          todayAssignments: {
            $sum: {
              $cond: [
                { $and: [{ $gte: ["$scheduledDate", todayStart] }, { $lte: ["$scheduledDate", todayEnd] }] },
                1,
                0,
              ],
            },
          },
          pendingAssignments: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.PENDING] }, 1, 0] },
          },
          approvedAssignments: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.APPROVED] }, 1, 0] },
          },
          publishedAssignments: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.PUBLISHED] }, 1, 0] },
          },
          acceptedDuties: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.ACCEPTED] }, 1, 0] },
          },
          rejectedDuties: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.REJECTED] }, 1, 0] },
          },
          replacementRequests: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.REPLACEMENT_REQUESTED] }, 1, 0] },
          },
          confirmedDuties: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.CONFIRMED] }, 1, 0] },
          },
          totalWorkloadHours: { $sum: "$workloadHours" },
        },
      },
    ]);

    const roleBreakdown = await StaffAssignment.aggregate([
      { $match: match },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const statusBreakdown = await StaffAssignment.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result = stats[0] || {
      totalAssignments: 0,
      todayAssignments: 0,
      pendingAssignments: 0,
      approvedAssignments: 0,
      publishedAssignments: 0,
      acceptedDuties: 0,
      rejectedDuties: 0,
      replacementRequests: 0,
      confirmedDuties: 0,
      totalWorkloadHours: 0,
    };

    return {
      overview: result,
      byRole: roleBreakdown.map((r) => ({ role: r._id, count: r.count })),
      byStatus: statusBreakdown.map((s) => ({ status: s._id, count: s.count })),
    };
  }

  async getCalendarEvents(companyId: string, filter: Record<string, any>) {
    const query: Record<string, any> = {
      companyId,
      isDeleted: false,
      ...filter,
    };
    Object.keys(query).forEach((k) => query[k] === undefined && delete query[k]);
    return await StaffAssignment.find(query).populate(this.defaultPopulate).sort({ scheduledDate: 1 }).exec();
  }

  async getWorkloadReports(companyId: string, filter: Record<string, any> = {}) {
    const match: Record<string, any> = {
      companyId: new Types.ObjectId(companyId),
      isDeleted: false,
      status: { $ne: AssignmentStatus.CANCELLED },
      ...filter,
    };

    return await StaffAssignment.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$employeeId",
          employeeName: { $first: "$employeeName" },
          employeeCode: { $first: "$employeeCode" },
          totalAssignments: { $sum: 1 },
          totalHours: { $sum: "$workloadHours" },
          acceptedCount: {
            $sum: { $cond: [{ $in: ["$status", [AssignmentStatus.ACCEPTED, AssignmentStatus.CONFIRMED]] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", AssignmentStatus.REJECTED] }, 1, 0] },
          },
        },
      },
      { $sort: { totalHours: -1 } },
    ]);
  }

  async bulkUpdateStatus(ids: string[], status: string, updatedBy?: string, reason?: string) {
    const updateData: Record<string, any> = { status, updatedAt: new Date() };
    if (updatedBy) updateData.updatedBy = updatedBy;
    if (reason) {
      if (status === AssignmentStatus.REJECTED) updateData.rejectionReason = reason;
      if (status === AssignmentStatus.REPLACEMENT_REQUESTED) updateData.replacementReason = reason;
    }

    return await StaffAssignment.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: updateData }
    );
  }
}

export default new StaffAssignmentRepository();
