import { Request, Response } from "express";
import crypto from "crypto";
import httpStatus from "http-status";
import { env } from "../../config/env";
import webhookService from "./webhook.service";

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing Razorpay signature",
      });
    }

    // req.body should be a Buffer because of express.raw() in the route
    const rawBody = req.body;
    const secret = env.RAZORPAY_WEBHOOK_SECRET || "default_webhook_secret";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    // Parse the JSON body now that it's verified
    const event = JSON.parse(rawBody.toString("utf8"));

    // Process the event asynchronously (don't block the response)
    webhookService.processRazorpayWebhook(event).catch((err) => {
      console.error("Error processing webhook:", err);
    });

    // Acknowledge the webhook quickly
    res.status(httpStatus.OK).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};
