import { ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as any;

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) Object.defineProperty(req, "params", { value: parsed.params, writable: true });
      if (parsed.query) Object.defineProperty(req, "query", { value: parsed.query, writable: true });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // DEBUG: Print validation error details so we can fix them
        console.error(`[Validation Failed] ${req.method} ${req.originalUrl}`);
        console.error(JSON.stringify(error.issues, null, 2));
        
        return res.status(400).json({
          success: false,
          message: "Validation Failed",
          errors: error.issues,
        });
      }

      next(error);
    }
  };
