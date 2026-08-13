import CenterPayments from "./centerPayments.model";

export class CenterPaymentsService {
  async getCenterPayments(centerId: string, filter: any = {}) {
    return await CenterPayments.find({ centerId, isDeleted: false, ...filter })
      .populate("shiftId")
      .populate("examId")
      .sort({ createdAt: -1 });
  }

  // A method for creating payments (could be used by company admin)
  async createPayment(data: any) {
    return await CenterPayments.create(data);
  }
}

export default new CenterPaymentsService();
