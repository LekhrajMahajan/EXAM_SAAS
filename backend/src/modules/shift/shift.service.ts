import { Request } from "express";
import shiftRepository from "./shift.repository";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

class ShiftService {
  /*
  |--------------------------------------------------------------------------
  | Create Shift
  |--------------------------------------------------------------------------
  */
  async createShift(req: Request) {
    const data = req.body;

    const existing = await shiftRepository.findByCode(
      data.centerId,
      data.shiftCode,
    );
    if (existing) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Shift code already exists for this center",
      );
    }

    data.createdBy = (req.user as any)?.id;

    const shift = await shiftRepository.create(data);
    return shift;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Shifts
  |--------------------------------------------------------------------------
  */
  async getShifts(req: Request) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const centerId = req.query.centerId as string;
    const branchId = req.query.branchId as string;
    const companyId = req.query.companyId as string;
    const status = req.query.status as string;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (centerId) filter.centerId = centerId;
    if (branchId) filter.branchId = branchId;
    if (companyId) filter.companyId = companyId;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const { data, total } = await shiftRepository.findAll(filter, skip, limit);

    return {
      shifts: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get Shift By Id
  |--------------------------------------------------------------------------
  */
  async getShiftById(req: Request) {
    const id = req.params.id as string;

    const shift = await shiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found");
    }

    return shift;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Shift
  |--------------------------------------------------------------------------
  */
  async updateShift(req: Request) {
    const id = req.params.id as string;
    const data = req.body;

    const shift = await shiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found");
    }

    if (data.shiftCode && data.shiftCode !== shift.shiftCode) {
      const existing = await shiftRepository.findByCode(
        shift.centerId.toString(),
        data.shiftCode,
      );
      if (existing) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Shift code already exists for this center",
        );
      }
    }

    data.updatedBy = (req.user as any)?.id;

    const updatedShift = await shiftRepository.update(id, data);
    return updatedShift;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */
  async updateStatus(req: Request) {
    const id = req.params.id as string;
    const { status } = req.body;

    const shift = await shiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found");
    }

    const updatedShift = await shiftRepository.update(id, {
      status,
      updatedBy: (req.user as any)?.id,
    });

    return updatedShift;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Shift
  |--------------------------------------------------------------------------
  */
  async deleteShift(req: Request) {
    const id = req.params.id as string;

    const shift = await shiftRepository.softDelete(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found");
    }

    return shift;
  }
}

export default new ShiftService();
