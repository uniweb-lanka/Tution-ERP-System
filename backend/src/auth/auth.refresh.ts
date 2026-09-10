import crypto from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Temporal } from "temporal-polyfill";

import { db } from "../db/db.js";
import { env } from "../config/env.js";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "./auth.tokens.js";

export class AuthRefreshError extends Error {
  constructor() {
    super("Invalid or expired refresh token");
    this.name = "AuthRefreshError";
  }
}

type ValidRefreshPayload = JwtPayload & {
  sub: string;
  sessionId: string;
  instituteId: string;
  type: "refresh";
};

function isRefreshTokenPayload(
  payload: string | JwtPayload,
): payload is ValidRefreshPayload {
  return (
    typeof payload !== "string" &&
    typeof payload.sub === "string" &&
    typeof payload.sessionId === "string" &&
    typeof payload.instituteId === "string" &&
    payload.type === "refresh"
  );
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: string | JwtPayload;

  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, {
      issuer: "tuition-erp-api",
      audience: "tuition-erp-web",
    });
  } catch {
    throw new AuthRefreshError();
  }

  if (!isRefreshTokenPayload(payload)) {
    throw new AuthRefreshError();
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const session = await db.orm.public.AuthSession.first({
    id: payload.sessionId,
    userId: payload.sub,
  });

  if (!session) {
    throw new AuthRefreshError();
  }

  if (session.revokedAt) {
    throw new AuthRefreshError();
  }

  if (session.expiresAt.epochMilliseconds <= Date.now()) {
    throw new AuthRefreshError();
  }

  if (session.refreshTokenHash !== tokenHash) {
    throw new AuthRefreshError();
  }

  const user = await db.orm.public.User.first({
    id: payload.sub,
  });

  if (!user || user.deletedAt) {
    throw new AuthRefreshError();
  }

  const institute = await db.orm.public.Institute.first({
    id: payload.instituteId,
  });

  if (
    !institute ||
    institute.status === "inactive" ||
    institute.status === "suspended"
  ) {
    throw new AuthRefreshError();
  }

  const membership = await db.orm.public.InstituteMembership.first({
    userId: payload.sub,
    instituteId: payload.instituteId,
    status: "active",
  });

  if (!membership) {
    throw new AuthRefreshError();
  }

  const result = await db.transaction(async (tx) => {
    /*
     * Revoke the old refresh session.
     */
    await tx.orm.public.AuthSession.where({
      id: session.id,
    }).update({
      revokedAt: Temporal.Now.instant(),
    });

    /*
     * Generate a new session ID before creating the
     * refresh token so we never need a "pending" hash.
     */
    const newSessionId = crypto.randomUUID();

    const newRefreshToken = createRefreshToken(
      user.id,
      newSessionId,
      institute.id,
    );

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    /*
     * Create the rotated refresh session.
     */
    await tx.orm.public.AuthSession.create({
      id: newSessionId,
      userId: user.id,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    /*
     * Generate a new short-lived access token.
     */
    const newAccessToken = createAccessToken({
      sub: user.id,
      instituteId: institute.id,
      membershipId: membership.id,
      role: membership.role,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isPlatformAdmin: user.isPlatformAdmin,
    },
    institute: {
      id: institute.id,
      name: institute.name,
      slug: institute.slug,
      email: institute.email,
      phone: institute.phone,
      timezone: institute.timezone,
      currency: institute.currency,
      status: institute.status,
    },
    membership: {
      id: membership.id,
      role: membership.role,
      status: membership.status,
    },
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
}

export async function logoutUser(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);

  const session = await db.orm.public.AuthSession.first({
    refreshTokenHash: tokenHash,
  });

  if (!session) {
    return;
  }

  if (session.revokedAt) {
    return;
  }

  await db.orm.public.AuthSession
    .where({
      id: session.id,
    })
    .update({
      revokedAt: Temporal.Now.instant(),
    });
}