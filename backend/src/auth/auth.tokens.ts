import crypto from "node:crypto";

import jwt, { type SignOptions } from "jsonwebtoken";
import { Temporal } from "temporal-polyfill";

import { env } from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  instituteId: string;
  membershipId: string;
  role: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  sessionId: string;
  type: "refresh";
};

function durationToMilliseconds(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);

  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return amount * 1_000;
    case "m":
      return amount * 60_000;
    case "h":
      return amount * 3_600_000;
    case "d":
      return amount * 86_400_000;
    default:
      throw new Error(`Unsupported duration unit: ${unit}`);
  }
}

function durationToSeconds(value: string): number {
  return Math.floor(durationToMilliseconds(value) / 1_000);
}

export function createAccessToken(
  payload: Omit<AccessTokenPayload, "type">,
) {
  const options: SignOptions = {
    expiresIn: durationToSeconds(env.JWT_ACCESS_EXPIRES_IN),
    issuer: "tuition-erp-api",
    audience: "tuition-erp-web",
  };

  return jwt.sign(
    {
      ...payload,
      type: "access",
    },
    env.JWT_ACCESS_SECRET,
    options,
  );
}

export function createRefreshToken(
  userId: string,
  sessionId: string,
) {
  const options: SignOptions = {
    expiresIn: durationToSeconds(env.JWT_REFRESH_EXPIRES_IN),
    issuer: "tuition-erp-api",
    audience: "tuition-erp-web",
  };

  return jwt.sign(
    {
      sub: userId,
      sessionId,
      type: "refresh",
    } satisfies RefreshTokenPayload,
    env.JWT_REFRESH_SECRET,
    options,
  );
}

export function hashRefreshToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export function getRefreshTokenExpiry() {
  const milliseconds = durationToMilliseconds(
    env.JWT_REFRESH_EXPIRES_IN,
  );

  return Temporal.Instant.fromEpochMilliseconds(
    Date.now() + milliseconds,
  );
}