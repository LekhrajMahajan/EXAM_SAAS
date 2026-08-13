import companyRepository from "./company.repository";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { ICompany } from "./company.types";
import { BaseService } from "../../common/base.service";
import paymentService from "../payment/payment.service";
import emailService from "../email/email.service";
import authService from "../auth/auth.service";
import { UserRole } from "../../constants/roles";
import bcrypt from "bcryptjs";
import CompanyAuditLog from "./company-audit.model";
import SystemSetting from "../system-settings/systemSettings.model";
import Admin from "../admin/admin.model";
import planRepository from "../plan/plan.repository";
import { subscriptionRepository } from "../subscription/subscription.repository";
import { SubscriptionStatus, BillingCycle } from "../subscription/subscription.types";
import { Types } from "mongoose";
import roleService from "../role/role.service";

const generateCredentialEmailHtml = (companyName: string, email: string, rawPassword: string, message: string, appName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media only screen and (max-width: 700px) {
          .email-container { width: 100% !important; border-radius: 0 !important; }
          .content-padding { padding: 20px !important; }
          .header-padding { padding: 20px !important; }
        }
        /* Force Gmail to inherit colors for links */
        .white-link, .white-link a { color: #ffffff !important; text-decoration: none !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Inter, Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 20px 10px;">
        <tr>
          <td align="center">
            <table class="email-container" width="700" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td class="header-padding" align="center" style="background-color: #2D3E2C; padding: 30px 40px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">${appName}</h1>
                </td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td class="content-padding" style="padding: 40px;">
                  <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Welcome, ${companyName}!</h2>
                  <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 30px;">${message}</p>
                  
                  <!-- Credentials Box -->
                  <div style="background-color: #2D3E2C; border-left: 4px solid #E4FD97; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                    <h3 style="margin-top: 0; color: #ffffff; font-size: 16px; margin-bottom: 15px;">Your Admin Credentials</h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; font-weight: 600; color: #cbd5e1; width: 100px;">Email:</td>
                        <td class="white-link" style="padding: 8px 0; color: #ffffff; font-weight: 500; word-break: break-all;">
                          <a href="mailto:${email}" style="color: #ffffff !important; text-decoration: none !important;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: 600; color: #cbd5e1; width: 100px;">Password:</td>
                        <td style="padding: 8px 0; color: #ffffff; font-weight: 500; font-family: monospace; font-size: 16px; letter-spacing: 1px;">${rawPassword}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 40px 0 20px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/login" style="background-color: #2D3E2C; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">Access Dashboard</a>
                  </div>

                  <p style="font-size: 14px; color: #64748b; margin-top: 30px; text-align: center; line-height: 1.5;">
                    For your security, please change your password immediately after logging in.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #f8fafc; padding: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 13px; color: #94a3b8;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

class CompanyService extends BaseService<ICompany> {
  constructor() {
    super(companyRepository, "Company");
  }

  private async getAppName(): Promise<string> {
    try {
      const setting = await SystemSetting.findOne({ key: 'APP_NAME' });
      return setting?.value || "ExamGuard Pro";
    } catch (error) {
      return "ExamGuard Pro";
    }
  }

  private async ensureSubscriptionExists(company: any, performedBy: string, startDate?: Date, endDate?: Date) {
    if (!company.subscriptionPlan) return;
    
    const plan = await planRepository.findByPlanCode(company.subscriptionPlan);
    if (!plan) return;

    const activeCount = await subscriptionRepository.countActiveSubscriptions((company._id as any).toString());
    if (activeCount > 0) return;

    const start = startDate || company.subscriptionStartDate || new Date();
    const end = endDate || company.subscriptionEndDate || new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);

    const subId = await subscriptionRepository.generateSubscriptionId();
    const subscription = await subscriptionRepository.create({
      subscriptionId: subId,
      companyId: new Types.ObjectId((company._id as any).toString()),
      planId: new Types.ObjectId((plan._id as any).toString()),
      billingCycle: BillingCycle.YEARLY, 
      startDate: start,
      endDate: end,
      status: SubscriptionStatus.ACTIVE,
      autoRenewal: false,
      maxBranches: company.maxBranches || plan.usageLimits?.maxBranches,
      maxCenters: company.maxCenters || plan.usageLimits?.maxCenters,
      maxEmployees: company.maxEmployees || plan.usageLimits?.maxEmployees,
      maxCandidates: company.maxCandidates || plan.usageLimits?.maxCandidates,
    });

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action: "CREATED",
      newPlanId: plan._id as Types.ObjectId,
      newEndDate: end,
      performedBy: new Types.ObjectId(performedBy),
      notes: "Auto-generated subscription on company activation",
    });
  }

  async create(payload: Partial<ICompany>) {
    const existingCode = await companyRepository.findByCompanyCode(
      payload.companyCode!,
    );

    if (existingCode) {
      if (existingCode.paymentStatus === "PENDING") {
        await companyRepository.hardDelete(existingCode.id);
        await Admin.deleteOne({ email: existingCode.email });
      } else {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Company code already exists");
      }
    }

    const existingEmail = await companyRepository.findByEmail(payload.email!);

    if (existingEmail) {
      if (existingEmail.paymentStatus === "PENDING") {
        await companyRepository.hardDelete(existingEmail.id);
        await Admin.deleteOne({ email: existingEmail.email });
      } else {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Company email already exists");
      }
    }

    const company = await super.create(payload);

    // Auto-set subscription dates if master admin is creating with a plan directly
    // (i.e., no Razorpay order needed - status set to true already by controller means direct creation)
    // We set dates if payload has subscriptionPlan but no subscriptionStartDate
    if (payload.subscriptionPlan && !payload.subscriptionStartDate) {
      const now = new Date();
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);
      await companyRepository.update((company._id as any).toString(), {
        subscriptionStartDate: now,
        subscriptionEndDate: end,
      });
    }

    // Create Company Admin User as INACTIVE immediately for tracking
    const rawPassword = Math.random().toString(36).slice(-8) + "A1!";
    const companyData = company as any;
    const [firstName, ...lastNameParts] = companyData.ownerName.split(" ");
    const lastName = lastNameParts.join(" ") || "Admin";

    try {
      await authService.createUser({
        firstName,
        lastName,
        email: companyData.email,
        phone: companyData.phone,
        password: rawPassword,
        role: UserRole.COMPANY_ADMIN,
        companyId: companyData._id,
        status: false, // Inactive
      } as any);
    } catch (e) {
      console.error("Failed to create INACTIVE user on company creation", e);
    }
    return company;
  }

  async verifyCompanyPayment(id: string, orderId: string, paymentId: string, signature: string) {
    const company = await companyRepository.findById(id);
    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");
    }

    if (company.paymentStatus === "SUCCESS") {
      return company; // Already verified
    }

    // Verify razorpay signature
    await paymentService.verifyPayment(orderId, paymentId, signature);

    // Update company status to active/paid
    company.paymentStatus = "SUCCESS";
    company.status = true; // Make active
    await companyRepository.update(id, company);
    await roleService.initializeCompanyDefaultRoles(id);

    await this.ensureSubscriptionExists(company, id);

    // Generate secure password
    const rawPassword = Math.random().toString(36).slice(-8) + "A1!";

    // Create Company Admin User
    const [firstName, ...lastNameParts] = company.ownerName.split(" ");
    const lastName = lastNameParts.join(" ") || "Admin";

    try {
      // Find if inactive admin already exists and update, or create new
      const existing = await authService.checkEmailExists(company.email);
      if (existing) {
        existing.status = true;
        existing.password = rawPassword;
        await existing.save();
      } else {
        await authService.createUser({
          firstName,
          lastName,
          email: company.email,
          phone: company.phone,
          password: rawPassword,
          role: UserRole.COMPANY_ADMIN,
          companyId: company._id,
          status: true,
        } as any);
      }

      // Send Email Credentials
      await emailService.sendCustom({
        to: company.email,
        subject: `Welcome to ${await this.getAppName()} - Your Company Admin Credentials`,
        html: generateCredentialEmailHtml(
          company.companyName,
          company.email,
          rawPassword,
          "Your company registration was successful and payment received.",
          await this.getAppName()
        ),
      });
    } catch (e) {
      // If user exists or email fails, log error but don't fail payment verification
      console.error("Failed to create user or send email", e);
    }

    return company;
  }

  async update(id: string, payload: Partial<ICompany>) {
    const company = await companyRepository.findById(id);

    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");
    }

    if (payload.companyCode && payload.companyCode !== company.companyCode) {
      const existing = await companyRepository.findByCompanyCode(
        payload.companyCode,
      );

      if (existing) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Company code already exists");
      }
    }

    if (payload.email && payload.email !== company.email) {
      const existing = await companyRepository.findByEmail(payload.email);

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Company email already exists",
        );
      }
    }

    return super.update(id, payload);
  }

  async updateStatus(id: string, status: string | boolean, populateFields?: string[], session?: import("mongoose").ClientSession) {
    const isActive = typeof status === 'string' ? status === 'true' : Boolean(status);
    
    const company = await companyRepository.findById(id);
    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");
    }

    const updatedCompany = await super.updateStatus(id, isActive as any, populateFields, session);
    if (isActive) {
      await roleService.initializeCompanyDefaultRoles(id);
    }

    // Manage User status based on company status
    let adminUser = await Admin.findOne({ companyId: id, role: UserRole.COMPANY_ADMIN });
    
    if (adminUser) {
      if (!isActive) {
        // Disconnect when inactive
        adminUser.status = false;
        await adminUser.save();
      } else {
        // Generate new credentials when activated again
        const rawPassword = Math.random().toString(36).slice(-8) + "A1!";
        
        adminUser.status = true;
        adminUser.password = rawPassword;
        await adminUser.save();

        // Send Email Credentials
        try {
          await emailService.sendCustom({
            to: adminUser.email,
            subject: "Your Company Admin Credentials (Activated)",
            html: generateCredentialEmailHtml(
              company.companyName,
              adminUser.email,
              rawPassword,
              "Your company account has been approved and activated.",
              await this.getAppName()
            ),
          });
        } catch(e) {
          console.error("Failed to send re-activation email", e);
        }
      }
    } else if (isActive) {
      // If adminUser doesn't exist (e.g., dummy company without payment), create it now!
      const rawPassword = Math.random().toString(36).slice(-8) + "A1!";

      const [firstName, ...lastNameParts] = company.ownerName.split(" ");
      const lastName = lastNameParts.join(" ") || "Admin";

      try {
        // Find if inactive admin already exists and update, or create new
        const existing = await authService.checkEmailExists(company.email);
        if (existing) {
          existing.status = true;
          existing.password = rawPassword;
          await existing.save();
        } else {
          await authService.createUser({
            firstName,
            lastName,
            email: company.email,
            phone: company.phone,
            password: rawPassword,
            role: UserRole.COMPANY_ADMIN,
            companyId: company._id,
            status: true,
          } as any);
        }

        // Send Email Credentials
        await emailService.sendCustom({
          to: company.email,
          subject: `Welcome to ${await this.getAppName()} - Your Company Admin Credentials`,
          html: generateCredentialEmailHtml(
            company.companyName,
            company.email,
            rawPassword,
            "Your company account has been created and payment verified.",
            await this.getAppName()
          ),
        });
      } catch (e) {
        console.error("Failed to create user or send activation email", e);
      }
    }

    return updatedCompany;
  }

  async logAudit(companyId: string, action: import("./company-audit.types").ICompanyAuditLog["action"], performedBy: string, details?: string) {
    const isSystem = performedBy === "SYSTEM";
    await CompanyAuditLog.create({
      companyId,
      action,
      performedBy: isSystem ? null : performedBy,
      isSystem,
      details,
    });
  }

  async getApprovalStatistics() {
    const [pending, underReview, approvedToday, rejectedToday] = await Promise.all([
      companyRepository.count({ approvalStatus: "PENDING" }),
      companyRepository.count({ approvalStatus: "UNDER_REVIEW" }),
      companyRepository.count({
        approvalStatus: "APPROVED",
        approvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      companyRepository.count({
        approvalStatus: "REJECTED",
        rejectedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      })
    ]);

    return {
      pending,
      underReview,
      approvedToday,
      rejectedToday,
      expiredRequests: 0,
      avgApprovalTime: "24h",
    };
  }

  async assignReviewer(id: string, reviewerId: string, performedBy: string) {
    const company = await companyRepository.findById(id);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");

    const updated = await companyRepository.update(id, {
      reviewerId,
      approvalStatus: "UNDER_REVIEW"
    } as any);

    await this.logAudit(id, "REVIEWER_ASSIGNED", performedBy, `Assigned to ${reviewerId}`);
    return updated;
  }

  async approveCompany(id: string, performedBy: string) {
    const company = await companyRepository.findById(id);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");

    const updated = await this.updateStatus(id, true);
    
    // We deliberately do not create a subscription automatically so the Company Admin
    // can choose and pay for one on their first login.
    const subscriptionUpdate: Record<string, any> = {
      approvalStatus: "APPROVED",
      approvedAt: new Date(),
    };

    const finalUpdate = await companyRepository.update(id, subscriptionUpdate as any);
    await roleService.initializeCompanyDefaultRoles(id);

    await this.logAudit(id, "APPROVED", performedBy, "Company was approved and activated");
    return finalUpdate;
  }

  async rejectCompany(id: string, reason: string, remarks: string, performedBy: string) {
    const company = await companyRepository.findById(id);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");

    const updated = await this.updateStatus(id, false);
    
    const finalUpdate = await companyRepository.update(id, {
      approvalStatus: "REJECTED",
      rejectionReason: reason,
      rejectionRemarks: remarks,
      rejectedAt: new Date()
    } as any);

    await this.logAudit(id, "REJECTED", performedBy, `Reason: ${reason}`);
    return finalUpdate;
  }

  async statistics() {
    const totalCompanies = await companyRepository.count();

    return {
      totalCompanies,
    };
  }
}

export default new CompanyService();
