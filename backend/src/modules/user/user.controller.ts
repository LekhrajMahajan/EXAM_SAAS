import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import userService from "./user.service";

/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.getProfile(req.user!.userId as string);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Profile fetched successfully.",

    data: profile,
  });
});

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await userService.updateProfile(
      req.user!.userId as string,

      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Profile updated successfully.",

      data: profile,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await userService.changePassword(
      req.user!.userId as string,

      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Password changed successfully.",

      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Profile Image
|--------------------------------------------------------------------------
*/

export const updateProfileImage = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await userService.updateProfileImage(
      req.user!.userId as string,

      req.body.profileImage,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Profile image updated successfully.",

      data: profile,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Sessions
|--------------------------------------------------------------------------
*/

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await userService.getSessions(req.user!.userId as string);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Sessions fetched successfully.",

    data: sessions,
  });
});

export const removeSession = asyncHandler(
  async (req: Request, res: Response) => {
    await userService.removeSession(
      req.user!.userId as string,

      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Session removed successfully.",

      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Devices
|--------------------------------------------------------------------------
*/

export const getDevices = asyncHandler(async (req: Request, res: Response) => {
  const devices = await userService.getDevices(req.user!.userId as string);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Devices fetched successfully.",

    data: devices,
  });
});

export const trustDevice = asyncHandler(async (req: Request, res: Response) => {
  const device = await userService.trustDevice(
    req.user!.userId as string,

    req.params.id as string,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Device trusted successfully.",

    data: device,
  });
});

export const removeDevice = asyncHandler(
  async (req: Request, res: Response) => {
    await userService.removeDevice(
      req.user!.userId as string,

      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Device removed successfully.",

      data: null,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Preferences
|--------------------------------------------------------------------------
*/

export const updatePreferences = asyncHandler(
  async (req: Request, res: Response) => {
    const preferences = await userService.updatePreferences(
      req.user!.userId as string,

      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Preferences updated successfully.",

      data: preferences,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await userService.getDashboard(
      req.user!.userId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Dashboard fetched successfully.",

      data: dashboard,
    });
  },
);
