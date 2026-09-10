import CenterPayments from "./centerPayments.model";

export class CenterPaymentsService {
  async getCenterPayments(centerId: string, filter: any = {}) {
    const mongoose = require("mongoose");
    const payments = await CenterPayments.find({ centerId, isDeleted: false, ...filter })
      .populate("shiftId", "shiftName startTime endTime")
      .populate("examId", "examTitle")
      .sort({ createdAt: -1 })
      .lean();

    for (const p of payments as any[]) {
      if (!p.shiftId && p.examId) {
        let shift = await mongoose.model("Shift").findOne({ examId: p.examId._id || p.examId }).select("shiftName startTime endTime").lean();
        if (!shift) {
            // Create dummy shift for test data backwards compatibility
            shift = await mongoose.model("Shift").create({
                examId: p.examId._id || p.examId,
                shiftName: "Morning Shift (Test)",
                shiftCode: "SH-TEST-01",
                startTime: "09:00",
                endTime: "12:00",
                reportingTime: "08:00",
                gateClosingTime: "08:45",
                date: new Date(),
                companyId: p.companyId || (p.examId && p.examId.companyId) || new mongoose.Types.ObjectId(),
                centerId: p.centerId._id || p.centerId,
                centerCapacity: []
            });
        }
        if (shift) p.shiftId = shift;
      }
    }
    return payments;
  }

  async getCompanyCenterPayments(companyId: string, filter: any = {}) {
    const mongoose = require("mongoose");
    const payments = await CenterPayments.find({ companyId, isDeleted: false, ...filter })
      .populate("shiftId", "shiftName startTime endTime")
      .populate("examId", "examTitle")
      .populate("centerId", "centerName centerCode email phone upiId")
      .sort({ createdAt: -1 })
      .lean();

    for (const p of payments as any[]) {
      if (!p.shiftId && p.examId) {
        let shift = await mongoose.model("Shift").findOne({ examId: p.examId._id || p.examId }).select("shiftName startTime endTime").lean();
        if (!shift) {
            // Create dummy shift for test data backwards compatibility
            shift = await mongoose.model("Shift").create({
                examId: p.examId._id || p.examId,
                shiftName: "Morning Shift (Test)",
                shiftCode: "SH-TEST-01",
                startTime: "09:00",
                endTime: "12:00",
                reportingTime: "08:00",
                gateClosingTime: "08:45",
                date: new Date(),
                companyId: p.companyId || (p.examId && p.examId.companyId) || new mongoose.Types.ObjectId(),
                centerId: p.centerId._id || p.centerId,
                centerCapacity: []
            });
        }
        if (shift) p.shiftId = shift;
      }
    }
    return payments;
  }

  // A method for creating payments (could be used by company admin)
  async createPayment(data: any) {
    return await CenterPayments.create(data);
  }

  // Generate pending payments for an exam when it is completed
  async generatePaymentsForExam(examId: string, companyId: string) {
    const mongoose = require("mongoose");
    const Exam = mongoose.model("Exam");
    const Shift = mongoose.model("Shift");

    const exam = await Exam.findById(examId).lean();
    if (!exam) return;

    // Find all shifts for this exam
    const shifts = await Shift.find({ examId }).lean();
    
    // We group by centerId and create one payment per center per shift
    // For simplicity, we just assign a flat rate of 1000 INR per shift per center if not specified
    const ratePerShift = 1000;

    for (const shift of shifts) {
      if (shift.centerId) {
        const centerId = shift.centerId;
        
        // Check if payment already exists for this center and shift
        const existing = await CenterPayments.findOne({
          examId,
          shiftId: shift._id,
          centerId
        });

        if (!existing) {
          await CenterPayments.create({
            companyId,
            centerId,
            shiftId: shift._id,
            examId,
            amount: ratePerShift,
            status: "Pending"
          });
        }
      }
    }

    // Optional: Send notification to company admin
    const Notification = mongoose.model("Notification");
    if (Notification) {
      await Notification.create({
        companyId,
        title: "Center Payments Pending",
        message: `Payments for exam ${exam.examName} are ready to be processed.`,
        type: "BILLING",
        role: "COMPANY_ADMIN"
      }).catch(() => {});
    }
  }
}

export default new CenterPaymentsService();
