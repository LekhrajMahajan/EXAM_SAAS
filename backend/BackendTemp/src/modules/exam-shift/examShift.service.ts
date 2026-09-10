import examRepository from "../exam/exam.repository";
import examShiftRepository from "./examShift.repository";

import ApiError from "../../utils/ApiError";

import { HTTP_STATUS } from "../../constants/httpStatus";

import { ExamApprovalStatus } from "../exam/exam.types";

import { ExamShiftStatus, IExamShift } from "./examShift.types";

class ExamShiftService {
  /*
  |--------------------------------------------------------------------------
  | Create Shift
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExamShift>) {
    const exam = await examRepository.findById(payload.examId!.toString());

    if (!exam) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found.");
    }

    // if (exam.approvalStatus !== ExamApprovalStatus.PUBLISHED) {
    //   throw new ApiError(
    //     HTTP_STATUS.BAD_REQUEST,
    //     "Only published exams can have shifts.",
    //   );
    // }

    const existingCode = await examShiftRepository.findByShiftCode(
      payload.examId!.toString(),
      payload.shiftCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Shift code already exists.");
    }

    const existingNumber = await examShiftRepository.findByShiftNumber(
      payload.examId!.toString(),
      payload.shiftNumber!,
    );

    if (existingNumber) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Shift number already exists.");
    }

    const shifts = await examShiftRepository.findByExamId(
      payload.examId!.toString(),
    );

    for (const shift of shifts) {
      const getMins = (time: string) => {
        const parts = time.split(":");
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      };

      const newStart = getMins(payload.startTime!);

      const newEnd = getMins(payload.endTime!);

      const oldStart = getMins(shift.startTime);

      const oldEnd = getMins(shift.endTime);

      if (newStart < oldEnd && newEnd > oldStart) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Shift timing overlaps with another shift.",
        );
      }
    }

    return await examShiftRepository.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All
  |--------------------------------------------------------------------------
  */

  async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    examId?: string;
    status?: ExamShiftStatus;
  }) {
    return await examShiftRepository.findAll(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Id
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    const shift = await examShiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found.");
    }

    return shift;
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Exam
  |--------------------------------------------------------------------------
  */

  async getByExam(examId: string) {
    return await examShiftRepository.findByExamId(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IExamShift>) {
    const shift = await examShiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found.");
    }

    return await examShiftRepository.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamShiftStatus) {
    const shift = await examShiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found.");
    }

    return await examShiftRepository.updateStatus(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async delete(id: string) {
    const shift = await examShiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found.");
    }

    return await examShiftRepository.softDelete(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(id: string) {
    const shift = await examShiftRepository.findById(id);

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Shift not found.");
    }

    return await examShiftRepository.restore(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(examId?: string) {
    const totalShifts = await examShiftRepository.count(examId);

    const activeShifts = await examShiftRepository.countByStatus(
      ExamShiftStatus.ACTIVE,
      examId,
    );

    const inactiveShifts = await examShiftRepository.countByStatus(
      ExamShiftStatus.INACTIVE,
      examId,
    );

    const cancelledShifts = await examShiftRepository.countByStatus(
      ExamShiftStatus.CANCELLED,
      examId,
    );

    return {
      totalShifts,
      activeShifts,
      inactiveShifts,
      cancelledShifts,
    };
  }
}

export default new ExamShiftService();
