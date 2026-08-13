import { Request, Response } from "express";
import BranchStaff from "./branchStaff.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Get All Branch Staff Roster from Database
|--------------------------------------------------------------------------
*/
export const getBranchStaffs = asyncHandler(async (req: Request, res: Response) => {
  const staffDocs = await BranchStaff.find().sort({ createdAt: -1 });

  const formattedStaff = staffDocs.map((doc) => ({
    id: doc.staffId || doc._id.toString(),
    _id: doc._id,
    staffId: doc.staffId,
    name: doc.name,
    role: doc.role,
    aadharNumber: doc.aadharNumber,
    mobileNumber: doc.mobileNumber,
    email: doc.email || "",
    otpVerified: doc.otpVerified,
    status: doc.status || "Active",
    createdAt: doc.createdAt ? doc.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  }));

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch staff fetched successfully",
    data: formattedStaff,
  });
});

/*
|--------------------------------------------------------------------------
| Create New Branch Staff in Database
|--------------------------------------------------------------------------
*/
export const createBranchStaff = asyncHandler(async (req: Request, res: Response) => {
  const { name, role, aadharNumber, mobileNumber, email, status, otpVerified } = req.body;
  const cleanMobile = mobileNumber ? String(mobileNumber).trim() : "";

  if (!cleanMobile) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Mobile number is required.",
    });
  }

  // Check unique mobile number constraint in MongoDB
  const existingMobile = await BranchStaff.findOne({ mobileNumber: cleanMobile });
  if (existingMobile) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: `Mobile number ${cleanMobile} is already registered with staff member ${existingMobile.name} (ID: ${existingMobile.staffId})! Duplicate mobile numbers are not allowed.`,
    });
  }

  // Determine staff ID (from request or auto-generate)
  let staffId = req.body.staffId || req.body.id;
  if (!staffId || (await BranchStaff.findOne({ staffId }))) {
    // Generate unique suffix if not provided or if duplicate exists in DB
    const prefix = "BR-101";
    let attempts = 0;
    let uniqueNum = Math.floor(100 + Math.random() * 900);
    staffId = `${prefix}-${uniqueNum}`;
    while ((await BranchStaff.findOne({ staffId })) && attempts < 50) {
      uniqueNum = Math.floor(100 + Math.random() * 900);
      staffId = `${prefix}-${uniqueNum}`;
      attempts++;
    }
  }

  const newStaff = await BranchStaff.create({
    staffId,
    name,
    role,
    aadharNumber,
    mobileNumber: cleanMobile,
    email: email ? String(email).trim() : "",
    otpVerified: Boolean(otpVerified),
    status: status || "Active",
  });

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Branch staff member registered successfully in MongoDB database.",
    data: {
      id: newStaff.staffId,
      _id: newStaff._id,
      staffId: newStaff.staffId,
      name: newStaff.name,
      role: newStaff.role,
      aadharNumber: newStaff.aadharNumber,
      mobileNumber: newStaff.mobileNumber,
      email: newStaff.email,
      otpVerified: newStaff.otpVerified,
      status: newStaff.status,
      createdAt: newStaff.createdAt.toISOString().split("T")[0],
    },
  });
});

/*
|--------------------------------------------------------------------------
| Update Branch Staff details in Database
|--------------------------------------------------------------------------
*/
export const updateBranchStaff = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { $or: [{ _id: id }, { staffId: id }] }
    : { staffId: id };

  const existing = await BranchStaff.findOne(query);
  if (!existing) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: "Staff member not found in database.",
    });
  }

  if (req.body.mobileNumber && req.body.mobileNumber.trim() !== existing.mobileNumber) {
    const mobileCheck = await BranchStaff.findOne({ mobileNumber: req.body.mobileNumber.trim(), _id: { $ne: existing._id } });
    if (mobileCheck) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: `Mobile number ${req.body.mobileNumber} is already taken by another staff member!`,
      });
    }
  }

  const updated = await BranchStaff.findOneAndUpdate(query, req.body, { new: true });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch staff updated successfully.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Branch Staff from Database
|--------------------------------------------------------------------------
*/
export const deleteBranchStaff = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { $or: [{ _id: id }, { staffId: id }] }
    : { staffId: id };

  const deleted = await BranchStaff.findOneAndDelete(query);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch staff removed from database successfully.",
    data: deleted,
  });
});

/*
|--------------------------------------------------------------------------
| Verify Staff Mobile OTP Status in Database
|--------------------------------------------------------------------------
*/
export const verifyBranchStaffOtp = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { $or: [{ _id: id }, { staffId: id }] }
    : { staffId: id };

  const updated = await BranchStaff.findOneAndUpdate(
    query,
    { otpVerified: true },
    { new: true }
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "OTP verification confirmed in database.",
    data: updated,
  });
});
