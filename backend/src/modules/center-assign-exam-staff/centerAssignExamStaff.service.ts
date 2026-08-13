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
      this.sendAssignmentEmails(assignmentsToEmail, examName, reportingTime, examStartDate, examEndDate);
    }

    return assignment;
  }
  
  private async sendAssignmentEmails(assignments: any[], examName: string, reportingTime: string, examStartDate: string, examEndDate: string) {
    for (const assign of assignments) {
      if (assign.staffEmail) {
        let additionalHtml = "";
        let textContent = `Hello ${assign.staffName}, you have been assigned as ${assign.role} for ${examName}.`;

        if (assign.role === "Entry Checker") {
          try {
            const crypto = require("crypto");
            const CenterStaff = require("../center/centerStaff.model").default;
            const User = require("../auth/user.model").default;

            const staffDoc = await CenterStaff.findById(assign.staffId);
            if (staffDoc && staffDoc.email) {
              const userDoc = await User.findOne({ email: staffDoc.email });
              if (userDoc) {
                const temporaryPassword = `Emp@${crypto.randomBytes(4).toString("hex")}1!`;
                userDoc.password = temporaryPassword;
                userDoc.forcePasswordChange = true;
                await userDoc.save();

                additionalHtml = `
                  <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #0f172a;">
                    <h3 style="margin-top:0;">Entry Checker Dashboard Access</h3>
                    <p><b>Your login credentials are:</b><br/>
                    Email: ${staffDoc.email}<br/>
                    Staff ID: ${staffDoc.staffId}<br/>
                    Temporary Password: <strong>${temporaryPassword}</strong></p>
                    <p>Please log in to your Entry Checker Dashboard and update your password.</p>
                  </div>
                `;
              }
            }
          } catch (err) {
            console.error("Failed to generate/send credentials for Entry Checker:", err);
          }
        }

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Exam Duty Assignment</h2>
            <p>Hello ${assign.staffName},</p>
            <p>You have been assigned to an upcoming exam at the center. Please find the details below:</p>
            <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 15px;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Staff ID</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assign.staffId}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${examName}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Assigned Role</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assign.role}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Reporting Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${reportingTime || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Start Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${examStartDate || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam End Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${examEndDate || 'Not specified'}</td></tr>
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
