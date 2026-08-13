import CenterAssignCandidateAttendance from "./centerAssignCandidateAttendance.model";

export class CenterAssignCandidateAttendanceService {
  async getAllocatedExams(filter: any) {
    return await CenterAssignCandidateAttendance.find(filter)
      .populate("examId")
      .sort({ createdAt: -1 });
  }

  async allocateExam(data: any) {
    const { companyId, centerId, examId, allocatedBy } = data;
    
    let allocation = await CenterAssignCandidateAttendance.findOne({
      centerId,
      examId,
      isDeleted: false,
    });

    if (allocation) {
      return allocation; // Already allocated
    }

    allocation = await CenterAssignCandidateAttendance.create({
      companyId,
      centerId,
      examId,
      allocatedBy,
    });

    return allocation;
  }

  async removeAllocation(id: string) {
    return await CenterAssignCandidateAttendance.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

export default new CenterAssignCandidateAttendanceService();
