import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    if (err.statusCode >= 400) {
      console.error(`[API ERROR ${err.statusCode}]: ${err.message}`, err.errors ? JSON.stringify(err.errors) : "");
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  // Handle MongoDB Duplicate Key Error (E11000)
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const value = (err as any).keyValue[field];
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} ('${value}') already exists. Please use a different one.`,
    });
  }

  console.error(err);
  require('fs').writeFileSync('d:/COMPANY PORJTECS/Practice exam saas/backend/error_log.txt', JSON.stringify(err, null, 2) + '\n' + err.stack);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};