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
    let companyObjId: any = companyId;
    try { companyObjId = new mongoose.Types.ObjectId(companyId); } catch (_) {}

    // Only show payments for centers that belong to THIS company admin
    const Center = mongoose.model("Center");
    const companyCenters = await Center.find({ companyId: companyObjId }).select('_id').lean();
    const companyCenterIds = (companyCenters as any[]).map((c: any) => c._id);

    const payments = await CenterPayments.find({ 
      centerId: { $in: companyCenterIds },
      isDeleted: { $ne: true }, 
      ...filter 
    })
      .populate("shiftId", "shiftName startTime endTime")
      .populate("examId", "examTitle examCode")
      .populate("centerId", "centerName centerCode email phone upiId paymentDetails")
      .sort({ createdAt: -1 })
      .lean();

    for (const p of payments as any[]) {
      if (!p.shiftId && p.examId) {
        let shift = await mongoose.model("Shift").findOne({ examId: p.examId._id || p.examId }).select("shiftName startTime endTime").lean();
        if (!shift) {
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
    const Center = mongoose.model("Center");
    const Candidate = mongoose.model("Candidate");

    const exam = await Exam.findById(examId).lean();
    if (!exam) return;

    const centerId = (exam as any).centerId;
    const shiftId = (exam as any).shiftId;
    // Attempt to get shift details if populated or stored as shiftName
    let shiftName = (exam as any).shiftName || (exam as any).shiftType || (exam as any).shift || null;
    
    // If we don't have an explicit shift name, infer it from the start time 
    // Usually 9am is Morning, 2pm (14:00) is Afternoon
    if (!shiftName && (exam as any).startTime) {
       const startHour = parseInt((exam as any).startTime.split(':')[0], 10);
       if (startHour < 12) {
           shiftName = "Morning Shift";
       } else if (startHour >= 12 && startHour < 16) {
           shiftName = "Afternoon Shift";
       } else {
           shiftName = "Evening Shift";
       }
    }

    const ImportCandidate = mongoose.models.ImportCandidate || mongoose.model("ImportCandidate", new mongoose.Schema({}, { strict: false, collection: 'importcandidate' }));
    let candidates = await Candidate.find({ examId });
    if (!candidates || candidates.length === 0) {
        candidates = await ImportCandidate.find({ examId });
    }
    
    const centerIds = [...new Set(candidates.map((c: any) => c.centerId?.toString()).filter(Boolean))];

    for (const currentCenterId of centerIds) {
      const count = candidates.filter((c: any) => c.centerId?.toString() === currentCenterId).length;

      // Check if payment already exists for this center and exam
      const existing = await CenterPayments.findOne({
        examId,
        centerId: currentCenterId,
      });

      if (!existing) {
        // Calculate amount based on commercial agreement shift price
        let amount = 0;
        const center = await Center.findById(currentCenterId).lean();
        
        if (center && center.commercialAgreement && Array.isArray(center.commercialAgreement)) {
          // Find matching shift rate
          const shiftRateObj = center.commercialAgreement.find((ca: any) => 
            (ca.shiftName && ca.shiftName.toUpperCase() === shiftName?.toUpperCase()) || 
            (ca.name && ca.name.toUpperCase() === shiftName?.toUpperCase()) ||
            (ca.shiftId && ca.shiftId.toString() === shiftId?.toString()) ||
            (ca.shiftName && shiftId && ca.shiftName.toString() === shiftId.toString()) ||
            (ca.name && shiftId && ca.name.toString() === shiftId.toString())
          );
          
          const ratePerSeat = shiftRateObj ? Number(shiftRateObj.pricePerCandidate || shiftRateObj.price || 0) : 0;
          
          amount = ratePerSeat * count;
        } else if (center && center.shifts && Array.isArray(center.shifts)) {
            const shiftRateObj = center.shifts.find((ca: any) => 
                (ca.shiftName && ca.shiftName.toUpperCase() === shiftName?.toUpperCase()) || 
                (ca.name && ca.name.toUpperCase() === shiftName?.toUpperCase())
            );
            const ratePerSeat = shiftRateObj ? Number(shiftRateObj.pricePerCandidate || shiftRateObj.price || 0) : 0;
            amount = ratePerSeat * count;
        }

        // Fallback to 1000 flat if no rate is found and amount is 0
        if (amount === 0) {
           amount = 1000;
        }

        await CenterPayments.create({
          companyId,
          centerId: currentCenterId,
          shiftId: shiftId || null,
          examId,
          amount,
          status: "Pending"
        });
      }
    }

    // Optional: Send notification to company admin
    const Notification = mongoose.model("Notification");
    if (Notification) {
      await Notification.create({
        companyId,
        title: "Center Payments Pending",
        message: `Payments for exam ${(exam as any).examTitle || (exam as any).examName} are ready to be processed.`,
        type: "BILLING",
        role: "COMPANY_ADMIN"
      }).catch(() => {});
    }
  }
}

export default new CenterPaymentsService();
