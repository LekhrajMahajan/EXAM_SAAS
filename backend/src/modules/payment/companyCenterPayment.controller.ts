import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import CompanyCenterPayment, { PaymentStatus } from "./companyCenterPayment.model";
import Center from "../center/center.model";
import { createRazorpayOrder as createRzpOrder, verifyRazorpaySignature } from "../center-payments/razorpay.service";

// Fetch center payment details for a given center
export const getCenterPaymentDetails = asyncHandler(async (req: Request, res: Response) => {
  const { centerId } = req.params;
  
  const center = await Center.findById(centerId).select("paymentDetails centerName centerCode").lean();
  
  if (!center) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: "Center not found",
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center payment details fetched",
    data: center,
  });
});

// Create a new payment record (before razorpay checkout or direct bank transfer logging)
export const createPaymentRecord = asyncHandler(async (req: any, res: Response) => {
  const { centerId, amount, paymentMode, paymentDetailsSnapshot, notes } = req.body;
  const companyId = req.user.companyId || req.user.userId; // assuming the logged-in user is the company admin

  const payment = new CompanyCenterPayment({
    companyId,
    centerId,
    amount,
    paymentMode,
    status: PaymentStatus.PENDING,
    paymentDetailsSnapshot,
    notes,
    createdBy: req.user.userId
  });

  await payment.save();

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Payment record created",
    data: payment,
  });
});

// Verify payment success
export const verifyPayment = asyncHandler(async (req: any, res: Response) => {
  const { paymentId } = req.params;
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, status } = req.body;

  const payment = await CompanyCenterPayment.findById(paymentId);
  if (!payment) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: "Payment not found",
    });
  }

  // Real razorpay signature verification
  if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        success: false,
        message: "Invalid payment signature",
      });
    }
  }
  
  payment.status = status || PaymentStatus.COMPLETED;
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpayOrderId = razorpayOrderId;
  payment.razorpaySignature = razorpaySignature;
  payment.paymentDate = new Date();
  
  await payment.save();

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Payment verified successfully",
    data: payment,
  });
});

export const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const payment = await CompanyCenterPayment.findById(paymentId);
  
  if (!payment) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, { success: false, message: "Payment not found" });
  }

  const order = await createRzpOrder(payment.amount, payment._id.toString());
      return res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID as string,
        },
      });
});

// Get all payments for a company
export const getCompanyPayments = asyncHandler(async (req: any, res: Response) => {
  const payments = await CompanyCenterPayment.find({ 
    $or: [
      { companyId: req.user.companyId },
      { companyId: req.user.userId }
    ]
  })
    .populate("centerId", "centerName centerCode paymentDetails upiId")
    .populate("examId", "examTitle examCode shift examDate")
    .sort({ createdAt: -1 });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Company payments fetched",
    data: payments,
  });
});
