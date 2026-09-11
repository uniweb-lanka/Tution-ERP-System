import type {
  NextFunction,
  Request,
  Response,
} from "express";

export function requireTenant(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.auth) {
    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  if (!request.auth.instituteId) {
    response.status(403).json({
      error: "Institute context is required",
    });
    return;
  }

  next();
}