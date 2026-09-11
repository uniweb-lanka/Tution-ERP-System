import bcrypt from "bcryptjs";
import { Temporal } from "temporal-polyfill";

import { db } from "../../db/db.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "./auth.tokens.js";

export class AuthConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConflictError";
  }
}

export class AuthInvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email, password, or institute");
    this.name = "AuthInvalidCredentialsError";
  }
}

export async function registerInstituteOwner(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, 12);

  const result = await db.transaction(async (tx) => {
    const existingUser = await tx.orm.public.User.first({
      email: input.email,
    });

    if (existingUser) {
      throw new AuthConflictError("An account with this email already exists");
    }

    const existingInstitute = await tx.orm.public.Institute.first({
      slug: input.instituteSlug,
    });

    if (existingInstitute) {
      throw new AuthConflictError("An institute with this slug already exists");
    }

    const user = await tx.orm.public.User.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      isPlatformAdmin: false,
    });

    const institute = await tx.orm.public.Institute.create({
      name: input.instituteName,
      slug: input.instituteSlug,
      ...(input.instituteEmail !== undefined
        ? { email: input.instituteEmail }
        : {}),
      ...(input.institutePhone !== undefined
        ? { phone: input.institutePhone }
        : {}),
      timezone: "Asia/Colombo",
      currency: "LKR",
      status: "trial",
    });

    const membership = await tx.orm.public.InstituteMembership.create({
      instituteId: institute.id,
      userId: user.id,
      role: "owner",
      status: "active",
      joinedAt: Temporal.Now.instant(),
    });

    return {
      user,
      institute,
      membership,
    };
  });

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      phone: result.user.phone,
    },
    institute: {
      id: result.institute.id,
      name: result.institute.name,
      slug: result.institute.slug,
      email: result.institute.email,
      phone: result.institute.phone,
      timezone: result.institute.timezone,
      currency: result.institute.currency,
      status: result.institute.status,
    },
    membership: {
      id: result.membership.id,
      role: result.membership.role,
      status: result.membership.status,
      joinedAt: result.membership.joinedAt,
    },
  };
}

export async function loginInstituteUser(input: LoginInput) {
  const user = await db.orm.public.User.first({
    email: input.email,
  });

  if (!user || !user.passwordHash) {
    throw new AuthInvalidCredentialsError();
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AuthInvalidCredentialsError();
  }

  const institute = await db.orm.public.Institute.first({
    slug: input.instituteSlug,
  });

  if (
    !institute ||
    institute.status === "inactive" ||
    institute.status === "suspended"
  ) {
    throw new AuthInvalidCredentialsError();
  }

  const membership = await db.orm.public.InstituteMembership.first({
    userId: user.id,
    instituteId: institute.id,
    status: "active",
  });

  if (!membership) {
    throw new AuthInvalidCredentialsError();
  }

  const result = await db.transaction(async (tx) => {
    const session = await tx.orm.public.AuthSession.create({
      userId: user.id,
      refreshTokenHash: "pending",
      expiresAt: getRefreshTokenExpiry(),
    });

    const accessToken = createAccessToken({
      sub: user.id,
      instituteId: institute.id,
      membershipId: membership.id,
      role: membership.role,
    });

    const refreshToken = createRefreshToken(user.id, session.id, institute.id);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    await tx.orm.public.AuthSession.where({ id: session.id }).update({
      refreshTokenHash,
    });

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
    };
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
    institute: {
      id: institute.id,
      name: institute.name,
      slug: institute.slug,
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
