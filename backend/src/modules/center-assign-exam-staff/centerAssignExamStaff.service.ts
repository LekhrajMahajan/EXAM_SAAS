import CenterAssignExamStaff from "./centerAssignExamStaff.model";
import mongoose from "mongoose";
import emailService from "../email/email.service";

export class CenterAssignExamStaffService {
  async getAssignments(filter: any) {
    return await CenterAssignExamStaff.find(filter)
      .populate("examId")
      .populate("assignments.staffId")
      .sort({ createdAt: -1 });
  }

  async createOrUpdateAssignment(data: any) {
    const { companyId, centerId, examId, examName, reportingTime, examStartDate, examEndDate, assignments, createdBy } = data;
    
    let assignment = await CenterAssignExamStaff.findOne({
      centerId,
      examId,
      isDeleted: false,
    });

    let assignmentsToEmail = assignments;

    if (assignment) {
      const existingAssignments = new Set(assignment.assignments.map((a: any) => `${a.staffId.toString()}_${a.role}`));
      assignmentsToEmail = assignments.filter((a: any) => !existingAssignments.has(`${a.staffId.toString()}_${a.role}`));

      assignment.assignments = assignments;
      if (examName) assignment.examName = examName;
      if (reportingTime) assignment.reportingTime = reportingTime;
      await assignment.save();
    } else {
      assignment = await CenterAssignExamStaff.create({
        companyId,
        centerId,
        examId,
        examName,
        reportingTime,
        assignments,
        createdBy,
      });
    }

    // Send emails to assigned staff
    if (assignmentsToEmail.length > 0) {
      this.sendAssignmentEmails(assignmentsToEmail, examName, reportingTime, examStartDate, examEndDate, centerId);
    }

    return assignment;
  }
  
  private async sendAssignmentEmails(assignments: any[], examName: string, reportingTime: string, examStartDate: string, examEndDate: string, centerId: string) {
    const Center = require("../center/center.model").default;
    let centerCode = "CTR";
    let centerNameStr = "the center";
    try {
      const centerDoc = await Center.findById(centerId);
      if (centerDoc) {
        centerCode = centerDoc.centerCode || "CTR";
        centerNameStr = centerDoc.centerName || centerDoc.name || "the center";
      }
    } catch (err) {
      console.error("Failed to fetch center for email", err);
    }

    const groupedAssignments: Record<string, any> = {};
    for (const a of assignments) {
      if (!a.staffEmail) continue;
      const key = `${a.staffId.toString()}_${a.role}`;
      if (!groupedAssignments[key]) {
        groupedAssignments[key] = {
          ...a,
          labNames: a.labName ? [a.labName] : []
        };
      } else {
        if (a.labName && !groupedAssignments[key].labNames.includes(a.labName)) {
          groupedAssignments[key].labNames.push(a.labName);
        }
      }
    }

    for (const key in groupedAssignments) {
      const assign = groupedAssignments[key];
      let additionalHtml = "";
      
      const staffIdStr = assign.staffId.toString();
      const customStaffId = `${centerCode}-${staffIdStr.slice(-3).toUpperCase()}`;
      const combinedLabNames = assign.labNames.length > 0 ? assign.labNames.join(", ") : null;

      if (assign.role && assign.role.toLowerCase().replace(/_/g, " ") === "entry checker") {
        try {
          const crypto = require("crypto");
          const CenterStaff = require("../center/centerStaff.model").default;
          const CenterEntryChecker = require("../center-entry-checker/centerEntryChecker.model").default;

          const staffDoc = await CenterStaff.findById(assign.staffId);
          if (staffDoc && staffDoc.email) {
            let entryCheckerDoc = await CenterEntryChecker.findOne({ email: staffDoc.email });
            const temporaryPassword = `Emp@${crypto.randomBytes(4).toString("hex")}1!`;
            
            if (entryCheckerDoc) {
              entryCheckerDoc.password = temporaryPassword;
              entryCheckerDoc.forcePasswordChange = true;
              await entryCheckerDoc.save();
            } else {
              entryCheckerDoc = await CenterEntryChecker.create({
                companyId: staffDoc.companyId,
                centerId: staffDoc.centerId,
                staffId: staffDoc._id,
                firstName: (staffDoc.name || "Staff").split(" ")[0],
                lastName: (staffDoc.name || "Staff").split(" ").slice(1).join(" ") || "Staff",
                email: staffDoc.email,
                phone: staffDoc.mobileNumber || "N/A",
                password: temporaryPassword,
                role: "ENTRY_CHECKER",
                forcePasswordChange: true,
              });
            }

            additionalHtml = `
              <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #0f172a;">
                <h3 style="margin-top:0;">Entry Checker Dashboard Access</h3>
                <p><b>Your login credentials are:</b><br/>
                Email: ${staffDoc.email}<br/>
                Staff ID: ${staffDoc.staffId || customStaffId}<br/>
                Temporary Password: <strong>${temporaryPassword}</strong></p>
                <p>Please log in to your Entry Checker Dashboard and update your password.</p>
              </div>
            `;
          }
        } catch (err) {
          console.error("Failed to generate/send credentials for Entry Checker:", err);
        }
      }

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Exam Duty Assignment</h2>
          <p>Hello ${assign.staffName},</p>
          <p>You have been assigned to an upcoming exam at <strong>${centerNameStr}</strong>. Please find the details below:</p>
          <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Staff ID</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${customStaffId}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${examName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Assigned Role</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assign.role}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Reporting Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${reportingTime || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Start Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${examStartDate || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam End Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${examEndDate || 'Not specified'}</td></tr>
            ${combinedLabNames ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Assigned Lab(s)</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${combinedLabNames}</td></tr>` : ''}
          </table>
          ${additionalHtml}
          <p style="margin-top: 20px;">Please ensure you report on time. If you have any questions, contact your center manager.</p>
        </div>
      `;
        
      emailService.sendCustom({
        to: assign.staffEmail,
        subject: `Exam Duty Assignment: ${examName}`,
        html: emailHtml
      }).catch(err => console.error("Failed to send staff assignment email", err));
    }
  }

  async deleteAssignment(id: string) {
    return await CenterAssignExamStaff.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

export default new CenterAssignExamStaffService();
