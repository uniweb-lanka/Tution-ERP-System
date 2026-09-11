import type { NextFunction, Request, Response } from "express";

export type UserRole = "owner" | "staff" | "teacher" | "student";

export function authorize(...allowedRoles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const auth = request.auth;

    if (!auth) {
      response.status(401).json({
        error: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(auth.role as UserRole)) {
      response.status(403).json({
        error: "You do not have permission to perform this action",
      });
      return;
    }

    next();
  };
}
