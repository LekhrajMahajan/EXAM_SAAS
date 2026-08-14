import { Request, Response } from "express";
import CenterStaff from "./centerStaff.model";
import Center from "./center.model";
import User from "../auth/user.model";
import { UserRole } from "../../constants/roles";
import emailService from "../email/email.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Get All Center Staff Roster from Database
|--------------------------------------------------------------------------
*/
export const getCenterStaffs = asyncHandler(async (req: Request, res: Response) => {
  const query: any = {};
  if (req.user?.role === "CENTER_MANAGER" && req.user.centerId) {
    query.centerId = req.user.centerId;
  } else if (req.user?.role === "COMPANY_ADMIN") {
    if (req.query.centerId) {
      query.centerId = req.query.centerId;
    } else if (req.user.companyId) {
      const centers = await Center.find({ companyId: req.user.companyId }).select('_id');
      query.centerId = { $in: centers.map((c: any) => c._id) };
    }
  }

  const staffDocs = await CenterStaff.find(query).sort({ createdAt: -1 });

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
    message: "Center staff fetched successfully",
    data: formattedStaff,
  });
});

/*
|--------------------------------------------------------------------------
| Create New Center Staff in Database
|--------------------------------------------------------------------------
*/
export const createCenterStaff = asyncHandler(async (req: Request, res: Response) => {
  const { name, role, aadharNumber, mobileNumber, email, status, otpVerified } = req.body;
  const cleanMobile = mobileNumber ? String(mobileNumber).trim() : "";

  if (!cleanMobile) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Mobile number is required.",
    });
  }

  // Check unique mobile number constraint in MongoDB
  const existingMobile = await CenterStaff.findOne({ mobileNumber: cleanMobile });
  if (existingMobile) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: `Mobile number ${cleanMobile} is already registered with staff member ${existingMobile.name} (ID: ${existingMobile.staffId})! Duplicate mobile numbers are not allowed.`,
    });
  }

  // Determine staff ID (from request or auto-generate)
  let staffId = req.body.staffId || req.body.id;
  if (!staffId || (await CenterStaff.findOne({ staffId }))) {
    // Generate unique suffix using center code and 3 unique digits
    let prefix = "CTR"; // Fallback prefix
    if (req.user?.centerId) {
      const center = await Center.findById(req.user.centerId);
      if (center && center.centerCode) {
        prefix = center.centerCode;
      }
    }

    let attempts = 0;
    // Generate 3 digit number, padded with zeros if necessary (though 100-999 is always 3 digits)
    let uniqueNum = Math.floor(100 + Math.random() * 900);
    staffId = `${prefix}${uniqueNum}`;
    while ((await CenterStaff.findOne({ staffId })) && attempts < 50) {
      uniqueNum = Math.floor(100 + Math.random() * 900);
      staffId = `${prefix}${uniqueNum}`;
      attempts++;
    }
  }

  const newStaff = await CenterStaff.create({
    staffId,
    name,
    role,
    aadharNumber,
    mobileNumber: cleanMobile,
    email: email ? String(email).trim() : "",
    otpVerified: Boolean(otpVerified),
    status: status || "Active",
    centerId: req.user?.centerId || req.body.centerId || null,
  });

  if (newStaff.email) {
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "Staff";
    
    let mappedRole = UserRole.OBSERVER;
    if (role === "Entry Checker") mappedRole = UserRole.ENTRY_CHECKER;
    else if (role === "Supervisor" || role === "Center Superintendent") mappedRole = UserRole.CENTER_MANAGER;
    else if (role === "Invigilator") mappedRole = UserRole.INVIGILATOR;
    else if (role === "Biometric Coordinator") mappedRole = UserRole.BIOMETRIC_VERIFIER;
    else if (role === "Security Lead" || role === "Technical Support") mappedRole = UserRole.TECHNICAL_MANAGER;

    let userDoc = await User.findOne({ email: newStaff.email });
    if (!userDoc) {
      await User.create({
        firstName,
        lastName,
        email: newStaff.email,
        phone: cleanMobile,
        password: "placeholder", // will be updated when assigned
        role: mappedRole,
        centerId: newStaff.centerId,
        isEmailVerified: true,
        isPhoneVerified: true
      });
    } else {
       userDoc.role = mappedRole;
       userDoc.centerId = newStaff.centerId;
       await userDoc.save();
    }
  }

  // Send email to staff with their new Staff ID
  if (newStaff.email) {
    try {
      let authHtml = "";

      await emailService.send({
        to: newStaff.email,
        subject: "ExamGuard: Your Staff Registration is Complete",
        html: `
          <h3>Welcome, ${newStaff.name}!</h3>
          <p>You have been successfully registered as a <strong>${newStaff.role}</strong>.</p>
          <p><strong>Your unique Staff ID is: ${newStaff.staffId}</strong></p>
          <p>Please keep this ID safe as it will be used for your center activities.</p>
          ${authHtml}
        `,
      });
    } catch (emailError) {
      console.error("Failed to send staff registration email:", emailError);
    }
  }

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Center staff member registered successfully in MongoDB database.",
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
| Update Existing Center Staff in Database
|--------------------------------------------------------------------------
*/
export const updateCenterStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // If mobile is being updated, verify it doesn't clash with others
  if (updateData.mobileNumber) {
    const existing = await CenterStaff.findOne({
      mobileNumber: updateData.mobileNumber,
      staffId: { $ne: id },
    });
    if (existing) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: `Cannot update: Mobile number ${updateData.mobileNumber} belongs to another staff member.`,
      });
    }
  }

  const updatedStaff = await CenterStaff.findOneAndUpdate(
    { staffId: id },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedStaff) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: `Center staff with ID ${id} not found in database.`,
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center staff details updated successfully.",
    data: {
      id: updatedStaff.staffId,
      _id: updatedStaff._id,
      staffId: updatedStaff.staffId,
      name: updatedStaff.name,
      role: updatedStaff.role,
      aadharNumber: updatedStaff.aadharNumber,
      mobileNumber: updatedStaff.mobileNumber,
      email: updatedStaff.email,
      otpVerified: updatedStaff.otpVerified,
      status: updatedStaff.status,
    },
  });
});

/*
|--------------------------------------------------------------------------
| Delete Center Staff from Database
|--------------------------------------------------------------------------
*/
export const deleteCenterStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedStaff = await CenterStaff.findOneAndDelete({ staffId: id });

  if (!deletedStaff) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: `Center staff with ID ${id} not found in database.`,
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center staff removed successfully.",
    data: { id },
  });
});

/*
|--------------------------------------------------------------------------
| Verify Center Staff Mobile OTP in Database
|--------------------------------------------------------------------------
*/
export const verifyCenterStaffOtp = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { otp } = req.body;

  if (!otp) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "OTP is required for verification.",
    });
  }

  // Update DB flag natively
  const updatedStaff = await CenterStaff.findOneAndUpdate(
    { staffId: id },
    { $set: { otpVerified: true } },
    { new: true }
  );

  if (!updatedStaff) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: `Center staff with ID ${id} not found in database.`,
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: `Mobile OTP (${otp}) verified and database updated successfully for staff ${id}.`,
    data: { id: updatedStaff.staffId, otpVerified: updatedStaff.otpVerified },
  });
});
