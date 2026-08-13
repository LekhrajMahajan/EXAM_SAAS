import { ClientSession, QueryFilter } from "mongoose";

import AdmitCard from "./admitCard.model";

import { IAdmitCard, AdmitCardStatus } from "./admitCard.types";
import { BaseRepository } from "../../common/base.repository";

class AdmitCardRepository extends BaseRepository<IAdmitCard> {
  constructor() {
    super(AdmitCard, [
      "candidateAssignmentId",
      "candidateId",
      "examId",
      "shiftId",
      "examCenterId",
      "examRoomId",
      "seatAllocationId",
    ]);
  }

  /*
    |--------------------------------------------------------------------------
    | Bulk Create
    |--------------------------------------------------------------------------
    */

  async bulkCreate(payload: Partial<IAdmitCard>[], session?: ClientSession) {
    return AdmitCard.insertMany(payload, {
      session,
      ordered: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return AdmitCard.findOne({
      _id: id,
      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Assignment
    |--------------------------------------------------------------------------
    */

  async findByAssignment(candidateAssignmentId: string) {
    return AdmitCard.findOne({
      candidateAssignmentId,
      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return AdmitCard.find({
      candidateId,
      isDeleted: false,
    })
      .populate("examId")
      .populate("shiftId")
      .populate("examCenterId")
      .populate("examRoomId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Exam
    |--------------------------------------------------------------------------
    */

  async findByExam(examId: string) {
    return AdmitCard.find({
      examId,
      isDeleted: false,
    })
      .populate("candidateId")
      .populate("candidateAssignmentId");
  }

  /*
    |--------------------------------------------------------------------------
    | Verify Admit Card
    |--------------------------------------------------------------------------
    */

  async verify(admitCardNumber: string) {
    return AdmitCard.findOne({
      admitCardNumber,
      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Increase Download Count
    |--------------------------------------------------------------------------
    */

  async increaseDownloadCount(id: string, session?: ClientSession) {
    return AdmitCard.findByIdAndUpdate(
      id,
      {
        $inc: {
          downloadCount: 1,
        },
        lastDownloadedAt: new Date(),
      },
      {
        new: true,
        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Increase Print Count
    |--------------------------------------------------------------------------
    */

  async increasePrintCount(id: string, session?: ClientSession) {
    return AdmitCard.findByIdAndUpdate(
      id,
      {
        $inc: {
          printCount: 1,
        },
        lastPrintedAt: new Date(),
      },
      {
        new: true,
        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Count By Status
    |--------------------------------------------------------------------------
    */

  async countByStatus(status: AdmitCardStatus, examId?: string) {
    const query: any = {
      status,

      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return AdmitCard.countDocuments(query);
  }
}

export default new AdmitCardRepository();
