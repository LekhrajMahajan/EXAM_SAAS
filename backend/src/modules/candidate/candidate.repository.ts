import { BaseRepository } from "../../common/base.repository";
import Candidate from "./candidate.model";
import { ICandidate } from "./candidate.types";

class CandidateRepository extends BaseRepository<ICandidate> {
  constructor() {
    super(Candidate, ["companyId", "centerId", "seatId"]);
  }


  /*
  |--------------------------------------------------------------------------
  | Bulk Import Candidates
  |--------------------------------------------------------------------------
  */

  async createMany(payload: Partial<ICandidate>[]) {
    return await Candidate.insertMany(payload, {
      ordered: false,
    });
  }



  /*
  |--------------------------------------------------------------------------
  | Find By Candidate Code
  |--------------------------------------------------------------------------
  */

  async findByCandidateCode(companyId: string, candidateCode: string) {
    return await Candidate.findOne({
      companyId,
      candidateCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Application Number
  |--------------------------------------------------------------------------
  */

  async findByApplicationNo(companyId: string, applicationNo: string) {
    return await Candidate.findOne({
      companyId,
      applicationNo,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Enrollment Number
  |--------------------------------------------------------------------------
  */

  async findByEnrollmentNo(companyId: string, enrollmentNo: string) {
    return await Candidate.findOne({
      companyId,
      enrollmentNo,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Email
  |--------------------------------------------------------------------------
  */

  async findByEmail(companyId: string, email: string) {
    return await Candidate.findOne({
      companyId,
      email,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Mobile
  |--------------------------------------------------------------------------
  */

  async findByMobile(companyId: string, mobile: string) {
    return await Candidate.findOne({
      companyId,
      mobile,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find All
  |--------------------------------------------------------------------------
  */

  async findAll(filters: {
    page?: number;
    limit?: number;
    search?: string;
    companyId?: string;

    centerId?: string;
    examId?: string;
    seatId?: string;
    gender?: string;
    category?: string;
    status?: string;
    biometricVerified?: boolean;
    faceVerified?: boolean;
    hallTicketGenerated?: boolean;
    [key: string]: any; // To satisfy BaseRepository signature
  }): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      companyId,

      centerId,
      examId,
      seatId,
      gender,
      category,
      status,
      biometricVerified,
      faceVerified,
      hallTicketGenerated,
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (companyId) query.companyId = companyId;

    if (centerId) query.centerId = centerId;
    if (examId) query.examId = examId;
    if (seatId) query.seatId = seatId;
    if (gender) query.gender = gender;
    if (category) query.category = category;
    if (status) query.status = status;

    if (typeof biometricVerified === "boolean") {
      query.biometricVerified = biometricVerified;
    }

    if (typeof faceVerified === "boolean") {
      query.faceVerified = faceVerified;
    }

    if (typeof hallTicketGenerated === "boolean") {
      query.hallTicketGenerated = hallTicketGenerated;
    }

    if (search) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          candidateCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          applicationNo: {
            $regex: search,
            $options: "i",
          },
        },
        {
          enrollmentNo: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      Candidate.find(query)
        .populate("companyId")

        .populate("centerId")
        .populate("seatId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Candidate.countDocuments(query),
    ]);

    return {
      candidates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }



  /*
  |--------------------------------------------------------------------------
  | Assign Seat
  |--------------------------------------------------------------------------
  */

  async assignSeat(id: string, seatId: string, examId?: string) {
    const updatePayload: any = { seatId };
    if (examId) {
      updatePayload.examId = examId;
    }
    
    return await Candidate.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Remove Seat
  |--------------------------------------------------------------------------
  */

  async removeSeat(id: string) {
    return await Candidate.findByIdAndUpdate(
      id,
      {
        seatId: null,
        examId: null,
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Verification
  |--------------------------------------------------------------------------
  */

  async updateVerification(id: string, payload: Partial<ICandidate>) {
    return await Candidate.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Generate Hall Ticket
  |--------------------------------------------------------------------------
  */

  async generateHallTicket(id: string) {
    return await Candidate.findByIdAndUpdate(
      id,
      {
        hallTicketGenerated: true,
      },
      {
        new: true,
      },
    );
  }



  /*
  |--------------------------------------------------------------------------
  | Count
  |--------------------------------------------------------------------------
  */

  async count(companyId?: any): Promise<number> {
    if (typeof companyId === 'object') {
      return super.count(companyId);
    }
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Candidate.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count Verified Candidates
  |--------------------------------------------------------------------------
  */

  async countVerified(companyId?: string) {
    const query: Record<string, unknown> = {
      isDeleted: false,
      biometricVerified: true,
      faceVerified: true,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Candidate.countDocuments(query);
  }
}

export default new CandidateRepository();
