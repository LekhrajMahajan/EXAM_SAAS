import Payment from "./payment.model";
import { IPayment } from "./payment.types";
import { BaseRepository } from "../../common/base.repository";

class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(Payment);
  }

  async findByOrderId(orderId: string) {
    return Payment.findOne({ razorpayOrderId: orderId });
  }

  async findByCompanyId(companyId: string) {
    return Payment.find({ companyId });
  }
}

export default new PaymentRepository();
