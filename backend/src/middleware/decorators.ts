import { Request, Response, NextFunction } from "express";
import { requirePermission } from "./permission";
import { requireFeature, requireUsageLimit, requireSubscription } from "./subscription.middleware";
import { authorize } from "./authorize";
import { requireCompanyStatus } from "./companyStatus.middleware";

type ControllerMethod = (req: Request, res: Response, next?: NextFunction) => any;

/**
 * Helper to wrap Express middleware into a TS method decorator
 */
function wrapMiddleware(middlewareFactory: (...args: any[]) => any, ...middlewareArgs: any[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod: ControllerMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const middleware = typeof middlewareFactory === "function" ? middlewareFactory(...middlewareArgs) : middlewareFactory;
      
      return new Promise<void>((resolve, reject) => {
        middleware(req, res, (err?: any) => {
          if (err) {
            if (next) return next(err);
            return reject(err);
          }
          try {
            const result = originalMethod.apply(this, [req, res, next]);
            resolve(result);
          } catch (execError) {
            if (next) next(execError);
            else reject(execError);
          }
        });
      });
    };

    // Store metadata for inspection by tooling/routers
    const metadataKey = `metadata:auth_${propertyKey}`;
    if (!target[metadataKey]) target[metadataKey] = [];
    target[metadataKey].push({ type: middlewareFactory.name || "CustomMiddleware", args: middlewareArgs });

    return descriptor;
  };
}

/**
 * Decorator to enforce required permissions on a controller endpoint
 */
export function RequirePermission(...permissions: string[]) {
  return wrapMiddleware(requirePermission, ...permissions);
}

/**
 * Decorator to enforce that an enterprise feature flag is enabled in user's plan
 */
export function RequireFeature(featureKey: string) {
  return wrapMiddleware(requireFeature as any, featureKey);
}

/**
 * Decorator to enforce that tenant has an active, valid subscription
 */
export function RequireSubscription() {
  return wrapMiddleware(() => requireSubscription);
}

/**
 * Decorator to enforce plan usage limit checking before resource creation
 */
export function RequireUsageLimit(limitKey: string, checkValueFn: (req: Request) => Promise<number>) {
  return wrapMiddleware(requireUsageLimit as any, limitKey, checkValueFn);
}

/**
 * Decorator to enforce role-based access control
 */
export function RequireRole(...roles: string[]) {
  return wrapMiddleware(authorize, ...roles);
}

/**
 * Decorator to enforce tenant operational status (rejects 423 Locked if inactive)
 */
export function RequireCompanyStatus() {
  return wrapMiddleware(() => requireCompanyStatus);
}
