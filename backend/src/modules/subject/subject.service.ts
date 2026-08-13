import companyService from "../company/company.service";
import subjectRepository from "./subject.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ISubject, SubjectStatus } from "./subject.types";
import { BaseService } from "../../common/base.service";

class SubjectService extends BaseService<ISubject> {
  constructor() {
    super(subjectRepository, "Subject");
  }

  /*
  |--------------------------------------------------------------------------
  | Create Subject
  |--------------------------------------------------------------------------
  */
  async create(payload: Partial<ISubject>) {
    await companyService.getActiveById(payload.companyId!.toString());

    const existingCode = await subjectRepository.findBySubjectCode(
      payload.companyId!.toString(),
      payload.subjectCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Subject code already exists.");
    }

    const existingName = await subjectRepository.findBySubjectName(
      payload.companyId!.toString(),
      payload.subjectName!,
    );

    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Subject name already exists.");
    }

    const existingShortName = await subjectRepository.findByShortName(
      payload.companyId!.toString(),
      payload.subjectShortName!,
    );

    if (existingShortName) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Subject short name already exists.",
      );
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Subjects
  |--------------------------------------------------------------------------
  */
  async getAll(query: any) {
    const result = await super.getAll(query);
    return {
      subjects: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Subject
  |--------------------------------------------------------------------------
  */
  async update(id: string, payload: Partial<ISubject>) {
    const subject = await subjectRepository.findById(id);

    if (!subject) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subject not found.");
    }

    const companyIdStr = (payload.companyId || (subject.companyId as any)._id || subject.companyId).toString();

    if (payload.subjectCode && payload.subjectCode !== subject.subjectCode) {
      const existing = await subjectRepository.findBySubjectCode(
        companyIdStr,
        payload.subjectCode,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Subject code already exists.",
        );
      }
    }

    if (payload.subjectName && payload.subjectName !== subject.subjectName) {
      const existing = await subjectRepository.findBySubjectName(
        companyIdStr,
        payload.subjectName,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Subject name already exists.",
        );
      }
    }

    if (
      payload.subjectShortName &&
      payload.subjectShortName !== subject.subjectShortName
    ) {
      const existing = await subjectRepository.findByShortName(
        companyIdStr,
        payload.subjectShortName,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Subject short name already exists.",
        );
      }
    }

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */
  async statistics(companyId?: string) {
    const totalSubjects = await subjectRepository.count(companyId ? { companyId } : undefined);

    const activeSubjects = await subjectRepository.countByStatus(
      SubjectStatus.ACTIVE,
      companyId,
    );

    const inactiveSubjects = await subjectRepository.countByStatus(
      SubjectStatus.INACTIVE,
      companyId,
    );

    const archivedSubjects = await subjectRepository.countByStatus(
      SubjectStatus.ARCHIVED,
      companyId,
    );

    return {
      totalSubjects,
      activeSubjects,
      inactiveSubjects,
      archivedSubjects,
    };
  }
}

export default new SubjectService();
