import paymentService from "../payment/payment.service";
import companyService from "../company/company.service";
import paymentRepository from "../payment/payment.repository";
import { PaymentStatus } from "../payment/payment.types";

class WebhookService {
  async processRazorpayWebhook(event: any) {
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      
      // In a real scenario, the webhook signature is verified by the controller.
      // We retrieve the payment by orderId
      const payment = await paymentRepository.findByOrderId(orderId);
      
      if (!payment) {
        console.error("Payment not found for order:", orderId);
        return;
      }

      // We mark payment as SUCCESS
      payment.status = PaymentStatus.SUCCESS;
      payment.razorpayPaymentId = paymentId;
      await paymentRepository.update(payment.id, payment);

      // Activate the company's subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 1); // 1 year subscription

      await companyService.update(payment.companyId, {
        subscriptionPlan: payment.planId as any,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      });
    }
  }
}

export default new WebhookService();
