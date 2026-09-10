import { Request, Response } from "express";

import authService from "./auth.service";
import authRepository from "./auth.repository";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction } from "../audit-log/auditLog.types";

/** Parse browser name from User-Agent string */
function parseBrowser(ua: string): string {
  if (!ua) return "Unknown";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  return "Unknown";
}

/** Parse OS from User-Agent string */
function parseOS(ua: string): string {
  if (!ua) return "Unknown";
  if (ua.includes("Windows NT 10")) return "Windows 10/11";
  if (ua.includes("Windows NT 6")) return "Windows Vista/7/8";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown";
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "User Registered Successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const userAgent = req.get("user-agent") || "";
  const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "Unknown";
  const browser = parseBrowser(userAgent);
  const operatingSystem = parseOS(userAgent);
  const loginAt = new Date();

  let result: Awaited<ReturnType<typeof authService.login>>;

  try {
    result = await authService.login(email, password);
  } catch (err) {
    // Record FAILED login attempt — find user first by email only
    try {
      const userDoc = await authRepository.findByEmailOnly(email);
      if (userDoc) {
        await authRepository.addLoginHistory(String(userDoc._id), {
          ipAddress,
          browser,
          operatingSystem,
          loginAt,
          successful: false,
        });
      }
    } catch (_e) {
      // Non-critical – don't block the error response
    }
    throw err; // Re-throw original error so the global handler returns 401
  }

  // Record SUCCESSFUL login attempt
  await authRepository.addLoginHistory(result.user.id, {
    ipAddress,
    browser,
    operatingSystem,
    loginAt,
    successful: true,
  });

  await auditLogService.createActionLog(
    "Auth",
    AuditAction.LOGIN,
    "User logged in successfully",
    result.user.id,
    { ipAddress, userAgent }
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Login Successful",
    data: result,
  });
});


export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Token Refreshed Successfully",
      data: result,
    });
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logout(req.user!.userId);

  await auditLogService.createActionLog(
    "Auth",
    AuditAction.LOGOUT,
    "User logged out successfully",
    req.user!.userId,
    { ipAddress: req.ip, userAgent: req.get("user-agent") }
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Logout Successful",
    data: result,
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.getProfile(req.user!.userId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user!.userId,
      oldPassword,
      newPassword,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Password reset link sent to your email",
      data: result,
    });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Password has been reset successfully",
      data: result,
    });
  },
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const result = await authService.verifyEmail(email, otp);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  },
);
