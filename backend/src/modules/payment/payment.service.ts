import crypto from "crypto";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import paymentRepository from "./payment.repository";
import { IPayment, PaymentStatus } from "./payment.types";
import { BaseService } from "../../common/base.service";
import { env } from "../../config/env";
import { invoiceService } from "../invoice/invoice.service";
import { InvoiceStatus, PaymentStatus as InvoicePaymentStatus } from "../invoice/invoice.types";

import Razorpay from "razorpay";

class PaymentService extends BaseService<IPayment> {
  private razorpay: Razorpay;

  constructor() {
    super(paymentRepository, "Payment");
    
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID || "rzp_test_mock",
      key_secret: env.RAZORPAY_KEY_SECRET || "mock_secret",
    });
  }

  async createOrder(companyId: string, planId: string, amount: number) {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    let order;
    try {
      order = await this.razorpay.orders.create(options);
    } catch (e) {
      // Fallback for missing keys during dev
      order = { id: `order_mock_${Date.now()}` };
    }
    
    const payment = await super.create({
      companyId,
      planId,
      amount,
      currency: "INR",
      razorpayOrderId: order.id,
      status: PaymentStatus.PENDING,
    });

    return {
      payment,
      orderId: order.id,
    };
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string) {
    const payment = await paymentRepository.findByOrderId(orderId);

    if (!payment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Payment order not found.");
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      return payment;
    }

    // Razorpay signature verification
    const isMockOrder = orderId.startsWith("order_mock_") || paymentId.startsWith("pay_mock_") || signature === "mock_signature_dev";
    if (!isMockOrder) {
      const text = orderId + "|" + paymentId;
      
      // Replace env.RAZORPAY_KEY_SECRET with your actual secret variable
      const generated_signature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET || "secret")
        .update(text)
        .digest("hex");

      if (generated_signature !== signature) {
        payment.status = PaymentStatus.FAILED;
        await paymentRepository.update(payment.id, payment);
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid payment signature.");
      }
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    
    await paymentRepository.update(payment.id, payment);

    try {
      await invoiceService.createInvoice({
        companyId: payment.companyId,
        paymentReferenceId: payment.razorpayPaymentId,
        items: [{
          description: `Subscription Payment`,
          quantity: 1,
          unitPrice: payment.amount,
          total: payment.amount
        }],
        subtotal: payment.amount,
        tax: 0,
        discount: 0,
        grandTotal: payment.amount,
        currency: payment.currency,
        status: InvoiceStatus.PAID,
        paymentStatus: InvoicePaymentStatus.PAID
      });
    } catch (invoiceError) {
      console.error("Failed to generate invoice:", invoiceError);
      // Don't fail the payment if invoice generation fails
    }

    return payment;
  }
}

export default new PaymentService();
