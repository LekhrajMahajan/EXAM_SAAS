import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import ApiError from "../../utils/ApiError";
import { CenterLocation } from "./centerLocation.model";
import Center from "./center.model";

const resolveCenterId = async (req: any): Promise<string> => {
  if (req.query.centerId && typeof req.query.centerId === "string") {
    return req.query.centerId;
  }
  if (req.params.centerId && typeof req.params.centerId === "string") {
    return req.params.centerId;
  }
  if (req.user?.centerId) {
    return req.user.centerId.toString();
  }
  if (req.user?.email) {
    const center = await Center.findOne({ email: req.user.email }).select("_id").lean();
    if (center) {
      return center._id.toString();
    }
  }
  return req.params.id as string;
};

export class CenterLocationController {
  static getLocation = asyncHandler(async (req: any, res: Response) => {
    const centerId = await resolveCenterId(req);
    if (!centerId) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found for this account.");
    }
    
    let location = await CenterLocation.findOne({ centerId });
    
    if (!location) {
      // Return empty default object if not found
      return sendResponse(res, HTTP_STATUS.OK, {
        success: true,
        message: "Center location fetched successfully.",
        data: {
          latitude: "",
          longitude: "",
          googleMapUrl: ""
        }
      });
    }

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center location fetched successfully.",
      data: location,
    });
  });

  static updateLocation = asyncHandler(async (req: any, res: Response) => {
    const centerId = await resolveCenterId(req);
    if (!centerId) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found for this account.");
    }
    
    const { latitude, longitude, googleMapUrl } = req.body;
    
    const location = await CenterLocation.findOneAndUpdate(
      { centerId },
      { latitude, longitude, googleMapUrl },
      { new: true, upsert: true }
    );
    
    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Center location saved successfully in CenterLocation collection.",
      data: location,
    });
  });
}
