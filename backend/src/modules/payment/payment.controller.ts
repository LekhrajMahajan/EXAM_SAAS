import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import paymentService from "./payment.service";

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    // Populate companyId to get company name
    const result = await paymentService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 100,
    }, ["companyId"]);
    
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Payments fetched successfully",
      data: result.data,
    });
  }
);

export const createOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, planId, amount } = req.body;

    const data = await paymentService.createOrder(companyId, planId, amount);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Payment order created successfully",
      data,
    });
  }
);

export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const payment = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Payment verified successfully",
      data: payment,
    });
  }
);
