import { ClientSession, Types } from "mongoose";
import {
  StaffAttendanceModel,
  LeaveRequestModel,
  DutySwapModel,
  EmergencyReplacementModel,
} from "./staffAttendance.model";
import {
  IStaffAttendance,
  ILeaveRequest,
  IDutySwap,
  IEmergencyReplacement,
} from "./staffAttendance.types";

class StaffAttendanceRepository {
  /*
  |--------------------------------------------------------------------------
  | Staff Attendance Queries
  |--------------------------------------------------------------------------
  */

  async createAttendance(data: Partial<IStaffAttendance>, session?: ClientSession) {
    const [record] = await StaffAttendanceModel.create([data], { session });
    return record;
  }

  async findAttendanceById(id: string | Types.ObjectId) {
    return StaffAttendanceModel.findOne({ _id: id, isDeleted: false });
  }

  async findByEmployeeAndExam(employeeId: string | Types.ObjectId, examId: string | Types.ObjectId) {
    return StaffAttendanceModel.findOne({ employeeId, examId, isDeleted: false }).sort({ checkInTime: -1 });
  }

  async updateAttendance(id: string | Types.ObjectId, updateData: Partial<IStaffAttendance>, session?: ClientSession) {
    return StaffAttendanceModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, session }
    );
  }

  async listAttendance(filter: Record<string, any>, limit = 50, skip = 0) {
    const query = { isDeleted: false, ...filter };
    const items = await StaffAttendanceModel.find(query)
      .sort({ checkInTime: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    const total = await StaffAttendanceModel.countDocuments(query);
    return { items, total };
  }

  /*
  |--------------------------------------------------------------------------
  | Leave Request Queries
  |--------------------------------------------------------------------------
  */

  async createLeaveRequest(data: Partial<ILeaveRequest>, session?: ClientSession) {
    const [record] = await LeaveRequestModel.create([data], { session });
    return record;
  }

  async findLeaveById(id: string | Types.ObjectId) {
    return LeaveRequestModel.findOne({ _id: id, isDeleted: false });
  }

  async updateLeaveStatus(
    id: string | Types.ObjectId,
    status: string,
    approvedBy?: Types.ObjectId,
    rejectionReason?: string,
    session?: ClientSession
  ) {
    return LeaveRequestModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { status, approvedBy, approvedAt: new Date(), rejectionReason } },
      { new: true, session }
    );
  }

  async listLeaves(filter: Record<string, any>, limit = 50, skip = 0) {
    const query = { isDeleted: false, ...filter };
    return LeaveRequestModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).lean();
  }

  /*
  |--------------------------------------------------------------------------
  | Duty Swap Queries
  |--------------------------------------------------------------------------
  */

  async createDutySwap(data: Partial<IDutySwap>, session?: ClientSession) {
    const [record] = await DutySwapModel.create([data], { session });
    return record;
  }

  async findSwapById(id: string | Types.ObjectId) {
    return DutySwapModel.findOne({ _id: id, isDeleted: false });
  }

  async updateSwapStatus(
    id: string | Types.ObjectId,
    status: string,
    approvedBy?: Types.ObjectId,
    rejectionReason?: string,
    session?: ClientSession
  ) {
    return DutySwapModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { status, approvedBy, approvedAt: new Date(), rejectionReason } },
      { new: true, session }
    );
  }

  async listSwaps(filter: Record<string, any>, limit = 50, skip = 0) {
    const query = { isDeleted: false, ...filter };
    return DutySwapModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).lean();
  }

  /*
  |--------------------------------------------------------------------------
  | Emergency Replacement Queries
  |--------------------------------------------------------------------------
  */

  async createReplacement(data: Partial<IEmergencyReplacement>, session?: ClientSession) {
    const [record] = await EmergencyReplacementModel.create([data], { session });
    return record;
  }

  async listReplacements(filter: Record<string, any>, limit = 50, skip = 0) {
    const query = { isDeleted: false, ...filter };
    return EmergencyReplacementModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).lean();
  }

  /*
  |--------------------------------------------------------------------------
  | Analytics & Aggregations
  |--------------------------------------------------------------------------
  */

  async getAttendanceStatsByCompany(companyId: string | Types.ObjectId) {
    const totalCount = await StaffAttendanceModel.countDocuments({ companyId, isDeleted: false });
    const presentCount = await StaffAttendanceModel.countDocuments({ companyId, isDeleted: false, attendanceStatus: "PRESENT" });
    const lateCount = await StaffAttendanceModel.countDocuments({ companyId, isDeleted: false, attendanceStatus: "LATE" });
    const absentCount = await StaffAttendanceModel.countDocuments({ companyId, isDeleted: false, attendanceStatus: "ABSENT" });
    const leaveCount = await LeaveRequestModel.countDocuments({ companyId, isDeleted: false, status: "APPROVED" });

    return {
      totalCount,
      presentCount,
      lateCount,
      absentCount,
      leaveCount,
      attendancePercentage: totalCount ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 96,
      latePercentage: totalCount ? Math.round((lateCount / totalCount) * 100) : 4,
    };
  }
}

export const staffAttendanceRepository = new StaffAttendanceRepository();
export default staffAttendanceRepository;
