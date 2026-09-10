import { Request, Response, NextFunction } from "express";
import settingsCache from "../modules/system-settings/settingsCache.service";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";

const clientRequests = new Map<string, { count: number; resetTime: number }>();

// Simple in-memory rate limiter based on dynamic settings
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const isRateLimitEnabled = settingsCache.get("API_RATE_LIMIT_ENABLED", "true") === "true";
    if (!isRateLimitEnabled) return next();

    const limit = Number(settingsCache.get("API_RATE_LIMIT_MAX", 2000)); // Default 2000 req for concurrent users
    const windowMinutes = Number(settingsCache.get("API_RATE_LIMIT_WINDOW", 1)); // Default 1 minute
    const windowMs = windowMinutes * 60 * 1000;

    // Prefer user ID to avoid blocking an entire center sharing the same IP
    const clientId = (req as any).user?._id?.toString() || (req as any).user?.id || req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();

    const record = clientRequests.get(clientId);
    
    // Clean up old records periodically (simple heuristic to avoid memory leak)
    if (Math.random() < 0.01) {
        for (const [key, val] of clientRequests.entries()) {
            if (val.resetTime < now) clientRequests.delete(key);
        }
    }

    if (!record || record.resetTime < now) {
        clientRequests.set(clientId, { count: 1, resetTime: now + windowMs });
        return next();
    }

    if (record.count >= limit) {
        return next(new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, "Too many requests, please try again later."));
    }

    record.count++;
    next();
};
