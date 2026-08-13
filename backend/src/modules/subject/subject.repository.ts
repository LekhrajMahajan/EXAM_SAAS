import Subject from "./subject.model";
import { ISubject, SubjectStatus } from "./subject.types";
import { BaseRepository } from "../../common/base.repository";

class SubjectRepository extends BaseRepository<ISubject> {
  constructor() {
    super(
      Subject,
      ["companyId"],
      ["subjectCode", "subjectName", "subjectShortName"]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Subject Code
  |--------------------------------------------------------------------------
  */
  async findBySubjectCode(companyId: string, subjectCode: string) {
    return await Subject.findOne({
      companyId,
      subjectCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Subject Name
  |--------------------------------------------------------------------------
  */
  async findBySubjectName(companyId: string, subjectName: string) {
    return await Subject.findOne({
      companyId,
      subjectName,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Short Name
  |--------------------------------------------------------------------------
  */
  async findByShortName(companyId: string, subjectShortName: string) {
    return await Subject.findOne({
      companyId,
      subjectShortName,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */
  async countByStatus(status: SubjectStatus, companyId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Subject.countDocuments(query);
  }
}

export default new SubjectRepository();
