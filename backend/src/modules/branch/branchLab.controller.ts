import { Request, Response } from "express";
import BranchLab from "./branchLab.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Get All Branch Labs from Database
|--------------------------------------------------------------------------
*/
export const getBranchLabs = asyncHandler(async (req: Request, res: Response) => {
  const labDocs = await BranchLab.find().sort({ createdAt: -1 });

  const formattedLabs = labDocs.map((doc) => ({
    id: doc.labId || doc._id.toString(),
    _id: doc._id,
    labId: doc.labId,
    labName: doc.labName,
    labCode: doc.labCode,
    roomFloor: doc.roomFloor || "",
    centerName: doc.centerName || "",
    seatingCapacity: doc.seatingCapacity || 0,
    totalComputers: doc.totalComputers || 0,
    assignedSupervisor: doc.assignedSupervisor || "Unassigned",
    facilities: doc.facilities || [],
    status: doc.status || "Exam Ready",
    notes: doc.notes || "",
    createdAt: doc.createdAt ? doc.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  }));

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch labs fetched successfully",
    data: formattedLabs,
  });
});

/*
|--------------------------------------------------------------------------
| Create New Branch Lab in Database
|--------------------------------------------------------------------------
*/
export const createBranchLab = asyncHandler(async (req: Request, res: Response) => {
  const {
    labName,
    labCode,
    roomFloor,
    centerName,
    seatingCapacity,
    totalComputers,
    assignedSupervisor,
    facilities,
    status,
    notes,
  } = req.body;

  if (!labName) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Lab name is required.",
    });
  }

  let labId = req.body.labId || req.body.id;
  if (!labId || (await BranchLab.findOne({ labId }))) {
    labId = `lab-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const newLab = await BranchLab.create({
    labId,
    labName: String(labName).trim(),
    labCode: labCode ? String(labCode).trim() : `LAB-${Math.floor(100 + Math.random() * 899)}`,
    roomFloor: roomFloor || "",
    centerName: centerName || "",
    seatingCapacity: Number(seatingCapacity) || 0,
    totalComputers: Number(totalComputers) || 0,
    assignedSupervisor: assignedSupervisor || "Unassigned",
    facilities: Array.isArray(facilities) ? facilities : [],
    status: status || "Exam Ready",
    notes: notes || "",
  });

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Branch lab registered successfully in MongoDB database.",
    data: {
      id: newLab.labId,
      _id: newLab._id,
      labId: newLab.labId,
      labName: newLab.labName,
      labCode: newLab.labCode,
      roomFloor: newLab.roomFloor,
      centerName: newLab.centerName,
      seatingCapacity: newLab.seatingCapacity,
      totalComputers: newLab.totalComputers,
      assignedSupervisor: newLab.assignedSupervisor,
      facilities: newLab.facilities,
      status: newLab.status,
      notes: newLab.notes,
      createdAt: newLab.createdAt.toISOString().split("T")[0],
    },
  });
});

/*
|--------------------------------------------------------------------------
| Update Branch Lab details in Database
|--------------------------------------------------------------------------
*/
export const updateBranchLab = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { $or: [{ _id: id }, { labId: id }] }
    : { labId: id };

  const existing = await BranchLab.findOne(query);
  if (!existing) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: "Lab not found in database.",
    });
  }

  const updated = await BranchLab.findOneAndUpdate(query, req.body, { new: true });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch lab updated successfully.",
    data: updated,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Branch Lab from Database
|--------------------------------------------------------------------------
*/
export const deleteBranchLab = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { $or: [{ _id: id }, { labId: id }] }
    : { labId: id };

  const deleted = await BranchLab.findOneAndDelete(query);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Branch lab removed from database successfully.",
    data: deleted,
  });
});
