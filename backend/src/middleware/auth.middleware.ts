import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "../config/env.js";

export type AuthContext = {
  userId: string;
  instituteId: string;
  membershipId: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

function isAccessTokenPayload(
  payload: string | JwtPayload,
): payload is JwtPayload & {
  sub: string;
  instituteId: string;
  membershipId: string;
  role: string;
  type: "access";
} {
  return (
    typeof payload !== "string" &&
    typeof payload.sub === "string" &&
    typeof payload.instituteId === "string" &&
    typeof payload.membershipId === "string" &&
    typeof payload.role === "string" &&
    payload.type === "access"
  );
}

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
      {
        issuer: "tuition-erp-api",
        audience: "tuition-erp-web",
      },
    );

    if (!isAccessTokenPayload(payload)) {
      response.status(401).json({
        error: "Invalid access token",
      });
      return;
    }

    request.auth = {
      userId: payload.sub,
      instituteId: payload.instituteId,
      membershipId: payload.membershipId,
      role: payload.role,
    };

    next();
  } catch {
    response.status(401).json({
      error: "Invalid or expired access token",
    });
  }
}