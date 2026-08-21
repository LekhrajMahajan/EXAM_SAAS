import companyService from "../company/company.service";
import centerService from "../center/center.service";
import seatService from "../seat/seat.service";

import candidateRepository from "./candidate.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ICandidate } from "./candidate.types";
import { BaseService } from "../../common/base.service";

class CandidateService extends BaseService<ICandidate> {
  constructor() {
    super(candidateRepository, "Candidate");
  }
  /*
  |--------------------------------------------------------------------------
  | Create Candidate
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<ICandidate>) {
    await companyService.getActiveById(payload.companyId!.toString());
    await centerService.getActiveById(payload.centerId!.toString());

    const candidateCode = await candidateRepository.findByCandidateCode(
      payload.companyId!.toString(),
      payload.candidateCode!,
    );

    if (candidateCode) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Candidate code already exists.",
      );
    }

    const applicationNo = await candidateRepository.findByApplicationNo(
      payload.companyId!.toString(),
      payload.applicationNo!,
    );

    if (applicationNo) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Application number already exists.",
      );
    }

    const enrollmentNo = await candidateRepository.findByEnrollmentNo(
      payload.companyId!.toString(),
      payload.enrollmentNo!,
    );

    if (enrollmentNo) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Enrollment number already exists.",
      );
    }

    const email = await candidateRepository.findByEmail(
      payload.companyId!.toString(),
      payload.email!,
    );

    if (email) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists.");
    }

    const mobile = await candidateRepository.findByMobile(
      payload.companyId!.toString(),
      payload.mobile!,
    );

    if (mobile) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Mobile number already exists.");
    }

    return await super.create(payload);
  }



  /*
  |--------------------------------------------------------------------------
  | Assign Seat
  |--------------------------------------------------------------------------
  */

  async assignSeat(candidateId: string, seatId: string, examId?: string) {
    const candidate = await super.getById(candidateId);

    await seatService.getActiveById(seatId);

    return await candidateRepository.assignSeat(candidateId, seatId, examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Remove Seat
  |--------------------------------------------------------------------------
  */

  async removeSeat(candidateId: string) {
    const candidate = await super.getById(candidateId);

    return await candidateRepository.removeSeat(candidateId);
  }

  /*
  |--------------------------------------------------------------------------
  | Verification
  |--------------------------------------------------------------------------
  */

  async verify(candidateId: string, payload: Partial<ICandidate>) {
    const candidate = await super.getById(candidateId);

    return await candidateRepository.updateVerification(candidateId, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Generate Hall Ticket
  |--------------------------------------------------------------------------
  */

  async generateHallTicket(id: string) {
    const candidate = await super.getById(id);

    return await candidateRepository.generateHallTicket(id);
  }



  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    const totalCandidates = await candidateRepository.count(companyId);

    const verifiedCandidates =
      await candidateRepository.countVerified(companyId);

    return {
      totalCandidates,
      verifiedCandidates,
    };
  }
}

export default new CandidateService();
