import { Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { BaseService } from "../../common/base.service";
import staffAssignmentRepository from "./staffAssignment.repository";
import { IStaffAssignment, AssignmentStatus, AssignmentType, StaffAssignmentRole, ConflictDetectionResult } from "./staffAssignment.types";
import employeeRepository from "../employee/employee.repository";
import examRepository from "../exam/exam.repository";
import notificationService from "../notification/notification.service";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction, AuditSeverity, AuditStatus } from "../audit-log/auditLog.types";
import { NotificationStatus, NotificationPriority } from "../notification/notification.types";
import Paper from "../paper/paper.model";
import { PaperApprovalStatus, PaperStatus } from "../paper/paper.types";

class StaffAssignmentService extends BaseService<IStaffAssignment> {
  constructor() {
    super(staffAssignmentRepository, "Staff assignment");
  }

  /*
  |--------------------------------------------------------------------------
  | Conflict Detection Engine
  |--------------------------------------------------------------------------
  */
  async detectConflicts(payload: {
    employeeId: string;
    examId?: string;
    role?: string;
    scheduledDate?: Date | string;
    startTime?: string;
    endTime?: string;
    shiftId?: string;
    centerId?: string;
    roomId?: string;
    currentAssignmentId?: string;
  }): Promise<ConflictDetectionResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!payload.employeeId) {
      return { isValid: true, errors, warnings };
    }

    const activeDuties = await staffAssignmentRepository.findActiveByEmployee(payload.employeeId);
    const existingDuties = payload.currentAssignmentId
      ? activeDuties.filter((d) => d._id?.toString() !== payload.currentAssignmentId)
      : activeDuties;

    const reqDateStr = payload.scheduledDate ? new Date(payload.scheduledDate).toISOString().split("T")[0] : null;

    for (const duty of existingDuties) {
      const dutyDateStr = duty.scheduledDate ? new Date(duty.scheduledDate).toISOString().split("T")[0] : null;
      const sameDate = reqDateStr && dutyDateStr && reqDateStr === dutyDateStr;
      const sameShift = payload.shiftId && duty.shiftId && payload.shiftId.toString() === duty.shiftId.toString();

      // Rule 1: Same Employee -> Multiple Exams Same Time / Shift -> Reject
      if (payload.examId && duty.examId && payload.examId.toString() !== duty.examId.toString()) {
        if (sameShift || sameDate) {
          errors.push(`Conflict: Employee is already assigned to another exam (${duty.examId}) during this time or shift.`);
        }
      }

      // Rule 2: Same Shift -> Multiple Centers -> Reject
      if (sameShift || sameDate) {
        if (payload.centerId && duty.centerId && payload.centerId.toString() !== duty.centerId.toString()) {
          errors.push(`Conflict: Employee cannot be assigned to multiple examination centers during the same shift.`);
        }
      }

      // Rule 3: Observer assigned as Invigilator in same exam -> Reject
      if (payload.examId && duty.examId && payload.examId.toString() === duty.examId.toString()) {
        if (payload.role === StaffAssignmentRole.INVIGILATOR && (duty.role === StaffAssignmentRole.OBSERVER || duty.role === StaffAssignmentRole.CHIEF_OBSERVER)) {
          errors.push(`Role Conflict: An Observer or Chief Observer cannot be assigned as an Invigilator in the same exam.`);
        }
        if ((payload.role === StaffAssignmentRole.OBSERVER || payload.role === StaffAssignmentRole.CHIEF_OBSERVER) && duty.role === StaffAssignmentRole.INVIGILATOR) {
          errors.push(`Role Conflict: An Invigilator cannot be assigned as an Observer in the same exam.`);
        }

        // Rule 4: Biometric Verifier assigned to two rooms simultaneously -> Reject
        if (payload.role === StaffAssignmentRole.BIOMETRIC_VERIFIER && duty.role === StaffAssignmentRole.BIOMETRIC_VERIFIER) {
          if ((sameShift || sameDate) && payload.roomId && duty.roomId && payload.roomId.toString() !== duty.roomId.toString()) {
            errors.push(`Conflict: Biometric Verifier cannot cover multiple rooms simultaneously during the same shift.`);
          }
        }

        // Rule 5: Paper Setter assigned to exam duty for same confidential paper -> Warning / Block
        if (duty.role === StaffAssignmentRole.PAPER_SETTER && payload.role !== StaffAssignmentRole.PAPER_SETTER) {
          warnings.push(`Confidentiality Warning: Employee served as a Paper Setter for this examination. Verify organizational security policy before deploying to active field duty.`);
        }

        // Rule 6: Prevent duplicate Paper Setter assignment for the same exam
        if (payload.role === StaffAssignmentRole.PAPER_SETTER && duty.role === StaffAssignmentRole.PAPER_SETTER) {
          errors.push(`Conflict: Employee is already assigned as a Paper Setter for this exam.`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Smart Eligibility Validation
  |--------------------------------------------------------------------------
  */
  private async validateEmployeeEligibility(employeeId: string, centerId?: string, role?: string) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `Employee not found (${employeeId}).`);
    }

    // Validate Employee Active
    if ((employee as any).status && (employee as any).status !== "ACTIVE" && (employee as any).status !== "VERIFIED") {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Eligibility Verification Failed: Employee is neither ACTIVE nor VERIFIED (Current Status: ${(employee as any).status}). Cannot assign suspended or inactive staff.`);
    }

    return employee;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Assignment
  |--------------------------------------------------------------------------
  */
  async createAssignment(payload: Record<string, any>, userId?: string) {
    // 1. Validate eligibility
    const employee = await this.validateEmployeeEligibility(payload.employeeId, payload.centerId, payload.role);

    // 1.5. Validate max paper setters per exam
    if (payload.role === StaffAssignmentRole.PAPER_SETTER && payload.examId) {
      const existingPaperSetters = await this.repository.count({
        examId: payload.examId,
        role: StaffAssignmentRole.PAPER_SETTER,
        status: { $ne: AssignmentStatus.CANCELLED },
      });

      if (existingPaperSetters >= 5) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Already 5 paper sets have been created for this exam.");
      }
    }

    // 2. Conflict Detection Engine
    const conflicts = await this.detectConflicts({
      employeeId: payload.employeeId,
      examId: payload.examId,
      role: payload.role,
      scheduledDate: payload.scheduledDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      shiftId: payload.shiftId,
      centerId: payload.centerId,
      roomId: payload.roomId,
    });

    if (!conflicts.isValid) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Staff Assignment Conflict Detected: ${conflicts.errors.join("; ")}`);
    }

    const uniqueId = new Types.ObjectId().toString().slice(-6).toUpperCase();
    const assignmentData = {
      ...payload,
      employeeCode: employee.employeeCode,
      employeeName: `${employee.firstName || ""} ${employee.lastName || ""}`.trim(),
      status: payload.status || AssignmentStatus.PENDING,
      assignmentType: payload.assignmentType || AssignmentType.MANUAL,
      qrCheckInCode: `STAFF-IN-${employee.employeeCode || "EMP"}-${uniqueId}`,
      qrCheckOutCode: `STAFF-OUT-${employee.employeeCode || "EMP"}-${uniqueId}`,
      conflictWarnings: conflicts.warnings || [],
      createdBy: userId,
      updatedBy: userId,
    };

    const created = await super.create(assignmentData as any);

    // If role is PAPER_SETTER and examId is provided, auto-create a Paper document
    if (payload.role === StaffAssignmentRole.PAPER_SETTER && payload.examId) {
      try {
        const exam = await examRepository.findById(payload.examId);
        
        if (exam) {
          const uniquePaperCode = `PAPER-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
          
          await Paper.create({
            companyId: payload.companyId || (employee as any).companyId,
            examId: payload.examId,
            assignedTo: employee._id,
            paperCode: uniquePaperCode,
            paperName: `${exam.examTitle || exam.examCode} - Default Paper Set`,
            duration: exam.duration || 60,
            totalQuestions: exam.subjects?.reduce((acc: number, sub: any) => acc + (sub.questions || 0), 0) || 100,
            totalMarks: exam.totalMarks || 100,
            passingMarks: exam.passingMarks || 40,
            approvalStatus: PaperApprovalStatus.DRAFT,
            status: PaperStatus.ACTIVE,
          });
        }
      } catch (err) {
        console.error("Failed to auto-create Paper for Paper Setter:", err);
      }

      // Send Email Notification for Paper Setter Assignment
      try {
        const emailService = require("../email/email.service").default;
        const Exam = require("../exam/exam.model").default;
        const exam = await Exam.findById(payload.examId);
        if (exam) {
          const title = exam.examTitle || exam.examCode;
          const examHtml = `<p><b>Assigned Exam:</b> ${title}</p>`;
          const examText = ` You have been assigned to the exam: ${title}.`;
          
          await emailService.sendCustom({
            to: employee.email,
            subject: "New Exam Assignment - ExamGuard Pro Enterprise",
            html: `<p>Hello ${employee.firstName} ${employee.lastName},</p><p>You have been assigned as a Paper Setter for a new examination in ExamGuard Pro.</p>${examHtml}<p>Please log in using your existing credentials to access and configure the paper setter module for this exam.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
            text: `Hello ${employee.firstName}, you have been assigned as a Paper Setter for a new examination.${examText} Please log in using your existing credentials to access it.`,
          });
        }
      } catch (err) {
        console.error("Failed to send email notification to Paper Setter:", err);
      }
    }

    // Handle Entry Checker Credentials Generation on Assignment
    if (payload.role === StaffAssignmentRole.ENTRY_CHECKER) {
      try {
        const Manager = require("../manager/manager.model").default;
        const emailService = require("../email/email.service").default;
        const crypto = require("crypto");

        const userDoc = await Manager.findById(employee.userId);
        if (userDoc) {
          const temporaryPassword = `Emp@${crypto.randomBytes(4).toString("hex")}1!`;
          userDoc.password = temporaryPassword;
          userDoc.forcePasswordChange = true;
          await userDoc.save();

          let examText = "";
          let examHtml = "";

          if (payload.examId) {
            try {
              const Exam = require("../exam/exam.model").default;
              const exam = await Exam.findById(payload.examId);
              if (exam) {
                const title = exam.examTitle || exam.examCode;
                examText = ` You have been assigned to the exam: ${title}.`;
                examHtml = `<p><b>Assigned Exam:</b> ${title}</p>`;
              }
            } catch (e) {
              console.error("Failed to fetch exam details for email:", e);
            }
          }

          await emailService.sendCustom({
            to: employee.email,
            subject: "Welcome to ExamGuard Pro Enterprise - Login Credentials",
            html: `<p>Hello ${employee.firstName} ${employee.lastName},</p><p>You have been assigned as an ENTRY_CHECKER in ExamGuard Pro.</p>${examHtml}<p><b>Your login credentials are:</b><br/>Email: ${employee.email}<br/>Employee Code: ${employee.employeeCode}<br/>Temporary Password: ${temporaryPassword}</p><p>Upon your first login, you will be required to update your password and complete your biometric and document verification.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
            text: `Hello ${employee.firstName}, your login credentials are Email: ${employee.email}, Code: ${employee.employeeCode}, Password: ${temporaryPassword}.${examText}`,
          });
          
          this.logAudit("GENERATE_CREDENTIALS", created._id ? created._id.toString() : "", payload.companyId, userId, `Generated login credentials for Entry Checker ${employee.employeeCode}`);
        }
      } catch (err) {
        console.error("Failed to generate/send credentials for Entry Checker:", err);
      }
    }

    // Audit and Notification Integration
    this.logAudit("CREATE_STAFF_ASSIGNMENT", created._id ? created._id.toString() : "", payload.companyId, userId, `Assigned employee ${employee.employeeCode} as ${payload.role}`);
    this.sendNotification(
      payload.companyId,
      employee.userId ? employee.userId.toString() : "",
      "New Examination Duty Assignment",
      `You have been scheduled for exam duty as ${payload.role}. Please review your schedule and accept the assignment.`,
      "ASSIGNMENT_CREATED"
    );

    return created;
  }

  /*
  |--------------------------------------------------------------------------
  | Auto Assignment Engine
  |--------------------------------------------------------------------------
  */
  async autoAssign(payload: {
    companyId: string;
    examId: string;
    role: string;
    requiredCount: number;
    shiftId?: string;
    centerId?: string;

    roomId?: string;
    scheduledDate?: Date;
    startTime?: string;
    endTime?: string;
    createdBy?: string;
  }) {
    const { companyId, examId, role, requiredCount = 1, shiftId, centerId, roomId, scheduledDate, startTime, endTime, createdBy } = payload;

    // Load available active employees in company / center
    const query: Record<string, any> = {
      companyId: new Types.ObjectId(companyId),
      limit: 1000,
    };

    if (centerId) query.centerId = new Types.ObjectId(centerId);

    const empResult = await employeeRepository.findAll(query);
    const allEmployees = empResult.data || [];

    // Filter eligible and non-conflicted employees
    const eligibleList: any[] = [];
    for (const emp of allEmployees) {
      if ((emp as any).status !== "ACTIVE" && (emp as any).status !== "VERIFIED") continue;

      const conflicts = await this.detectConflicts({
        employeeId: (emp as any)._id.toString(),
        examId,
        role,
        scheduledDate,
        startTime,
        endTime,
        shiftId,
        centerId,
        roomId,
      });

      if (conflicts.isValid) {
        eligibleList.push({
          employee: emp,
          warnings: conflicts.warnings,
          trustScore: (emp as any).trustScore || 100,
        });
      }
    }

    // Sort by fair workload and trust score
    const workloadReport = await staffAssignmentRepository.getWorkloadReports(companyId);
    const workloadMap = new Map(workloadReport.map((w: any) => [w._id?.toString(), w.totalHours || 0]));

    eligibleList.sort((a, b) => {
      const hoursA = workloadMap.get((a.employee as any)._id.toString()) || 0;
      const hoursB = workloadMap.get((b.employee as any)._id.toString()) || 0;
      if (hoursA !== hoursB) return hoursA - hoursB; // Lowest workload first for fair distribution
      return b.trustScore - a.trustScore; // Highest trust score as secondary sort
    });

    const selected = eligibleList.slice(0, requiredCount);
    const createdAssignments: any[] = [];

    for (const item of selected) {
      const emp = item.employee as any;
      const uniqueId = new Types.ObjectId().toString().slice(-6).toUpperCase();
      const newAssign = await super.create({
        companyId: new Types.ObjectId(companyId),
        examId: new Types.ObjectId(examId),
        centerId: centerId ? new Types.ObjectId(centerId) : null,
        roomId: roomId ? new Types.ObjectId(roomId) : null,
        shiftId: shiftId ? new Types.ObjectId(shiftId) : null,
        role,
        employeeId: emp._id,
        employeeCode: emp.employeeCode,
        employeeName: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
        assignmentType: AssignmentType.AUTO,
        status: AssignmentStatus.PENDING,
        scheduledDate,
        startTime,
        endTime,
        qrCheckInCode: `AUTO-IN-${emp.employeeCode || "EMP"}-${uniqueId}`,
        qrCheckOutCode: `AUTO-OUT-${emp.employeeCode || "EMP"}-${uniqueId}`,
        conflictWarnings: item.warnings,
        createdBy: createdBy ? new Types.ObjectId(createdBy) : null,
      } as any);

      createdAssignments.push(newAssign);

      this.logAudit("AUTO_ASSIGN_STAFF", newAssign._id ? newAssign._id.toString() : "", companyId, createdBy, `Auto-assigned ${emp.employeeCode} to ${role}`);
      if (emp.userId) {
        this.sendNotification(companyId, emp.userId.toString(), "Auto-Assigned Examination Duty", `You have been auto-assigned for duty as ${role}. Please view details and confirm.`, "AUTO_ASSIGNMENT");
      }
    }

    return {
      success: true,
      requestedCount: requiredCount,
      assignedCount: createdAssignments.length,
      assignments: createdAssignments,
      unassignedRemaining: Math.max(0, requiredCount - createdAssignments.length),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Assign
  |--------------------------------------------------------------------------
  */
  async bulkAssign(payload: { companyId: string; assignments: any[]; createdBy?: string }) {
    const { companyId, assignments, createdBy } = payload;
    const results: any[] = [];
    const errors: any[] = [];

    for (const item of assignments) {
      try {
        const res = await this.createAssignment({ ...item, companyId, assignmentType: AssignmentType.BULK }, createdBy);
        results.push(res);
      } catch (err: any) {
        errors.push({ employeeId: item.employeeId, role: item.role, error: err.message || "Failed to assign" });
      }
    }

    this.logAudit("BULK_ASSIGN_STAFF", "BULK", companyId, createdBy, `Completed bulk assignment: ${results.length} assigned, ${errors.length} failed`);
    return { assignedCount: results.length, failedCount: errors.length, results, errors };
  }

  /*
  |--------------------------------------------------------------------------
  | Approval & Workflow Transitions
  |--------------------------------------------------------------------------
  */
  async updateAssignmentStatus(id: string, newStatus: string, updatedBy?: string, reason?: string) {
    const assign = await super.getById(id);
    const updatePayload: Record<string, any> = { status: newStatus, updatedBy };

    if (reason) {
      if (newStatus === AssignmentStatus.REJECTED) updatePayload.rejectionReason = reason;
      if (newStatus === AssignmentStatus.REPLACEMENT_REQUESTED) updatePayload.replacementReason = reason;
    }

    if (newStatus === AssignmentStatus.APPROVED || newStatus === AssignmentStatus.PUBLISHED) {
      updatePayload.attendancePrepared = true; // Automatically prepare attendance once approved/published
    }

    const updated = await super.update(id, updatePayload);

    console.log(`[updateAssignmentStatus] id: ${id}, newStatus: ${newStatus}, updatedBy: ${updatedBy}`);
    console.log(`[updateAssignmentStatus] assign.employeeId:`, (assign as any).employeeId);

    this.logAudit("UPDATE_ASSIGNMENT_STATUS", id, (assign as any).companyId?.toString() || "", updatedBy, `Status changed from ${(assign as any).status} to ${newStatus}`);
    if ((assign as any).employeeId) {
      const empIdStr = typeof (assign as any).employeeId === "string" ? (assign as any).employeeId : (assign as any).employeeId._id?.toString() || (assign as any).employeeId.toString();
      console.log(`[updateAssignmentStatus] empIdStr: ${empIdStr}`);
      const emp = await employeeRepository.findById(empIdStr);
      
      const rawUserId = emp ? ((emp as any).userId || (assign as any).employeeId.userId) : null;
      console.log(`[updateAssignmentStatus] emp found:`, !!emp, `rawUserId:`, rawUserId);

      if (emp) {
        if (rawUserId) {
          this.sendNotification((assign as any).companyId?.toString() || "", rawUserId.toString(), `Duty Status Updated: ${newStatus}`, `Your staff assignment status has been updated to ${newStatus}.`, "STATUS_UPDATE");
        }

        // Exam-Based Isolation logic for Paper Setters
        if ((assign as any).role === "PAPER_SETTER") {
          console.log(`[updateAssignmentStatus] Handling PAPER_SETTER logic for newStatus=${newStatus}`);
          const authRepo = require("../auth/auth.repository").default;
          const emailService = require("../email/email.service").default;
          const Exam = require("../exam/exam.model").default;
          
          let examName = "your exam";
          if ((assign as any).examId) {
            const exam = await Exam.findById((assign as any).examId);
            if (exam) examName = exam.examTitle || exam.examCode;
          }

          const authUserId = typeof rawUserId === "object" && rawUserId !== null && "_id" in rawUserId 
            ? rawUserId._id.toString() 
            : rawUserId?.toString();

          if (newStatus === "INACTIVE") {
            console.log(`[updateAssignmentStatus] Deactivating employee and auth`);
            await employeeRepository.update(emp._id.toString(), { status: "INACTIVE" } as any);
            if (authUserId) await authRepo.update(authUserId, { status: "INACTIVE" } as any);

            try {
              console.log(`[updateAssignmentStatus] Sending DEACTIVATION email to ${(emp as any).email}`);
              await emailService.sendCustom({
                to: (emp as any).email,
                subject: `Access Revoked - ${examName}`,
                html: `<p>Hello ${(emp as any).firstName},</p><p>Your paper setter access for <b>${examName}</b> has been deactivated.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
                text: `Hello ${(emp as any).firstName}, your paper setter access for ${examName} has been deactivated.`,
              });
            } catch (e) {
              console.error("Failed to send deactivation email", e);
            }
          } else if (newStatus === "APPROVED" || newStatus === "PUBLISHED" || newStatus === "ACTIVE") {
            console.log(`[updateAssignmentStatus] Activating employee and auth`);
            await employeeRepository.update(emp._id.toString(), { status: "ACTIVE" } as any);
            if (authUserId) await authRepo.update(authUserId, { status: "ACTIVE" } as any);

            try {
              const crypto = require("crypto");
              const targetPassword = `Emp@${crypto.randomBytes(4).toString("hex")}1!`;
              const authService = require("../auth/auth.service").default;
              
              if (authUserId) {
                await authService.adminResetPassword(authUserId, targetPassword);
              }

              await emailService.sendCustom({
                to: (emp as any).email,
                subject: `Access Activated - ${examName}`,
                html: `<p>Hello ${(emp as any).firstName},</p><p>Your paper setter access for <b>${examName}</b> has been activated.</p><p><b>Your login credentials are:</b><br/>Email: ${(emp as any).email}<br/>Password: ${targetPassword}</p><p>Please log in with these credentials to access your assignment.</p><p>Regards,<br/>ExamGuard Pro Administration</p>`,
                text: `Hello ${(emp as any).firstName}, your paper setter access for ${examName} has been activated. Email: ${(emp as any).email}, Password: ${targetPassword}`,
              });
            } catch (e) {
              console.error("Failed to send activation email", e);
            }
          }
        }
      }
    }

    return updated;
  }

  async replaceAssignment(payload: {
    id: string;
    replacedByEmployeeId: string;
    updatedBy?: string;
    reason?: string;
  }) {
    const { id, replacedByEmployeeId, updatedBy, reason = "Staff replacement requested" } = payload;
    const oldAssign = (await super.getById(id)) as any;

    // Create replacement duty for new employee
    const newDuty = await this.createAssignment(
      {
        companyId: oldAssign.companyId,
        examId: oldAssign.examId,
        centerId: oldAssign.centerId,
        building: oldAssign.building,
        floor: oldAssign.floor,
        roomId: oldAssign.roomId,
        shiftId: oldAssign.shiftId,
        role: oldAssign.role,
        employeeId: replacedByEmployeeId,
        assignmentType: AssignmentType.REPLACEMENT,
        status: AssignmentStatus.APPROVED,
        scheduledDate: oldAssign.scheduledDate,
        startTime: oldAssign.startTime,
        endTime: oldAssign.endTime,
        instructions: oldAssign.instructions || "Replacement duty assignment",
      },
      updatedBy
    );

    // Update old assignment
    await super.update(id, {
      status: AssignmentStatus.CANCELLED,
      replacementReason: reason,
      replacedByAssignmentId: (newDuty as any)._id,
      updatedBy: updatedBy ? new Types.ObjectId(updatedBy) : null,
    });

    this.logAudit("REPLACE_ASSIGNMENT", id, oldAssign.companyId?.toString() || "", updatedBy, `Replaced employee ${oldAssign.employeeCode} with new assignment ${(newDuty as any)._id}`);
    return { previousAssignmentId: id, replacementAssignment: newDuty };
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboards & Reporting
  |--------------------------------------------------------------------------
  */
  async getDashboard(companyId: string, query: { centerId?: string; employeeId?: string }) {
    return await staffAssignmentRepository.getDashboardStats(companyId, query.centerId, query.employeeId);
  }

  async getCalendar(companyId: string, filter: Record<string, any>) {
    return await staffAssignmentRepository.getCalendarEvents(companyId, filter);
  }

  async getWorkload(companyId: string, filter: Record<string, any>) {
    return await staffAssignmentRepository.getWorkloadReports(companyId, filter);
  }

  async getConflictsList(companyId: string, filter: Record<string, any> = {}) {
    const all = await staffAssignmentRepository.findAll({ companyId, limit: 1000, ...filter });
    const conflicted: any[] = [];
    for (const item of all.data || []) {
      if (item.conflictWarnings && item.conflictWarnings.length > 0) {
        conflicted.push(item);
      }
    }
    return { count: conflicted.length, conflicts: conflicted };
  }

  async exportAssignmentsData(companyId: string, filter: Record<string, any>) {
    const data = await staffAssignmentRepository.findAll({ companyId, limit: 5000, ...filter });
    return {
      exportTimestamp: new Date(),
      totalRecords: (data.data || []).length,
      records: data.data || [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Helper: Cross-Module Audit Log & Notification
  |--------------------------------------------------------------------------
  */
  private logAudit(actionName: string, entityId: string, companyId: string, performedBy?: string, details?: string) {
    try {
      let mappedAction = AuditAction.CREATE;
      if (actionName.includes("UPDATE") || actionName.includes("REPLACE")) mappedAction = AuditAction.UPDATE;
      if (actionName.includes("DELETE") || actionName.includes("CANCEL")) mappedAction = AuditAction.DELETE;

      auditLogService.log({
        action: mappedAction,
        module: "STAFF_ASSIGNMENT",
        entityId: entityId ? new Types.ObjectId(entityId) : undefined,
        companyId: companyId ? new Types.ObjectId(companyId) : undefined,
        performedBy: performedBy && Types.ObjectId.isValid(performedBy) ? new Types.ObjectId(performedBy) : undefined,
        severity: AuditSeverity.MEDIUM,
        status: AuditStatus.SUCCESS,
        description: details || `Staff assignment operation ${actionName}`,
      } as any);
    } catch (e) {
      console.error("Audit logging error in staff assignment:", e);
    }
  }
  private sendNotification(companyId: string, userId: string, title: string, message: string, type: string) {
    try {
      if (!userId || !Types.ObjectId.isValid(userId)) return;
      
      const safeType = ["STATUS_UPDATE", "AUTO_ASSIGNMENT"].includes(type) ? "SYSTEM" : type;
      
      notificationService.create({
        companyId: companyId ? new Types.ObjectId(companyId) : undefined,
        recipientId: new Types.ObjectId(userId),
        title,
        message,
        type: safeType as any,
        channel: "IN_APP" as any,
        priority: "MEDIUM" as any,
        status: "PENDING" as any,
      } as any).catch(e => console.error("Notification creation failed async:", e));
    } catch (e) {
      console.error("Notification trigger error in staff assignment:", e);
    }
  }
}

export default new StaffAssignmentService();
