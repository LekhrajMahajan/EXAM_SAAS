import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/asyncHandler";
import { CenterPayment } from "./centerPayment.model";
import { ApiResponse } from "../../core/utils/ApiResponse";
import mongoose from "mongoose";

export const getCompanyCenterPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const companyId = user.id || user._id || "6870ab12cd34ef5678901234"; // Default for testing if undefined

    const payments = await CenterPayment.find({ companyId })
      .populate("centerId", "centerName centerCode profileExtension.upiId")
      .populate("examId", "examTitle examCode shift examDate")
      .sort({ createdAt: -1 });

    const formattedPayments = payments.map((p: any) => ({
      _id: p._id,
      centerName: p.centerId?.centerName || "Unknown",
      centerCode: p.centerId?.centerCode || "",
      upiId: p.upiId || p.centerId?.profileExtension?.upiId || "",
      examTitle: p.examId?.examTitle || "Unknown",
      examCode: p.examId?.examCode || "",
      examDate: p.examId?.examDate,
      shift: p.shift,
      amount: p.amount,
      status: p.status,
      paymentDate: p.paymentDate,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, formattedPayments, "Center payments fetched successfully"));
  }
);

// Dummy verification endpoint to simulate Razorpay
export const verifyCenterPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { paymentId, razorpayPaymentId, razorpayOrderId } = req.body;
    
    const payment = await CenterPayment.findById(paymentId);
    
    if (!payment) {
        return res.status(404).json(new ApiResponse(404, null, "Payment not found"));
    }

    payment.status = "PAID" as any;
    payment.razorpayPaymentId = razorpayPaymentId || "pay_mock_" + Math.random().toString(36).substring(7);
    payment.razorpayOrderId = razorpayOrderId || "order_mock_" + Math.random().toString(36).substring(7);
    payment.paymentDate = new Date();
    
    await payment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, payment, "Payment verified and updated successfully"));
  }
);
