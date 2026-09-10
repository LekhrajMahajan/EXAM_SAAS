import examRepository from "../exam/exam.repository";
import examShiftRepository from "../exam-shift/examShift.repository";
import centerRepository from "../center/center.repository";

import examCenterRepository from "./examCenter.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ExamApprovalStatus } from "../exam/exam.types";

import { CenterStatus } from "../center/center.types";

import { ExamCenterStatus, IExamCenter } from "./examCenter.types";

class ExamCenterService {
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExamCenter>) {
    const exam = await examRepository.findById(payload.examId!.toString());

    if (!exam) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found.");
    }

    // if (exam.approvalStatus !== ExamApprovalStatus.PUBLISHED) {
    //   throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Exam is not published.");
    // }

    // const shift = await examShiftRepository.findById(
    //   payload.shiftId!.toString(),
    // );

    // if (!shift) {
    //   throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam shift not found.");
    // }

    // if (shift.examId.toString() !== payload.examId!.toString()) {
    //   throw new ApiError(
    //     HTTP_STATUS.BAD_REQUEST,
    //     "Shift does not belong to selected exam.",
    //   );
    // }

    // const center = await centerRepository.findById(
    //   payload.centerId!.toString(),
    // );

    // if (!center) {
    //   throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found.");
    // }

    // if (center.status !== CenterStatus.ACTIVE) {
    //   throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Center is inactive.");
    // }

    const exists = await examCenterRepository.findExisting(
      payload.shiftId!.toString(),
      payload.centerId!.toString(),
    );

    if (exists) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Center already mapped to this shift.",
      );
    }

    return await examCenterRepository.create(payload);
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
    shiftId?: string;
    centerId?: string;
    status?: ExamCenterStatus;
  }) {
    return await examCenterRepository.findAll(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Id
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    const examCenter = await examCenterRepository.findById(id);

    if (!examCenter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    }

    return examCenter;
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Shift
  |--------------------------------------------------------------------------
  */

  async getByShift(shiftId: string) {
    return await examCenterRepository.findByShift(shiftId);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Exam
  |--------------------------------------------------------------------------
  */

  async getByExam(examId: string) {
    return await examCenterRepository.findByExam(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IExamCenter>) {
    const examCenter = await examCenterRepository.findById(id);

    if (!examCenter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    }

    return await examCenterRepository.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamCenterStatus) {
    const examCenter = await examCenterRepository.findById(id);

    if (!examCenter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    }

    return await examCenterRepository.updateStatus(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async delete(id: string) {
    const examCenter = await examCenterRepository.findById(id);

    if (!examCenter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    }

    return await examCenterRepository.softDelete(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(id: string) {
    const examCenter = await examCenterRepository.findById(id);

    if (!examCenter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    }

    return await examCenterRepository.restore(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(examId?: string) {
    const totalCenters = await examCenterRepository.count(examId);

    const activeCenters = await examCenterRepository.countByStatus(
      ExamCenterStatus.ACTIVE,
      examId,
    );

    const inactiveCenters = await examCenterRepository.countByStatus(
      ExamCenterStatus.INACTIVE,
      examId,
    );

    const closedCenters = await examCenterRepository.countByStatus(
      ExamCenterStatus.CLOSED,
      examId,
    );

    return {
      totalCenters,
      activeCenters,
      inactiveCenters,
      closedCenters,
    };
  }
}

export default new ExamCenterService();
