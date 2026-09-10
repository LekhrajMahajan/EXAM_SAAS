import express, { Router } from "express";
import { handleRazorpayWebhook } from "./webhook.controller";

const router = Router();

// We must use express.raw to preserve the raw body for signature verification
// This route is typically mounted BEFORE express.json() in the main app,
// OR if mounted after, the global body parser should have an exclusion logic.
// By using express.raw() here, we ensure it parses as a Buffer if the global
// parser hasn't already consumed the stream. We'll also instruct the user
// on how to mount this safely in app.ts.
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook
);

export default router;
