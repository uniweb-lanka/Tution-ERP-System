import { Router } from "express";

import {
  AuthConflictError,
  AuthInvalidCredentialsError,
  loginInstituteUser,
  registerInstituteOwner,
} from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { db } from "../db/db.js";
import {
  AuthRefreshError,
  refreshAccessToken,
} from "./auth.refresh.js";


export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const result = await registerInstituteOwner(parsed.data);

    response.status(201).json({
      message: "Institute owner registered successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof AuthConflictError) {
      response.status(409).json({
        error: error.message,
      });
      return;
    }

    console.error("Registration failed:", error);

    response.status(500).json({
      error: "Unable to register institute owner",
    });
  }
});

authRouter.post("/login", async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const result = await loginInstituteUser(parsed.data);

    response.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.status(200).json({
      message: "Login successful",
      data: {
        user: result.user,
        institute: result.institute,
        membership: result.membership,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AuthInvalidCredentialsError) {
      response.status(401).json({
        error: error.message,
      });
      return;
    }

    console.error("Login failed:", error);

    response.status(500).json({
      error: "Unable to login",
    });
  }
});

authRouter.get("/me", authenticate, async (request, response) => {
  const auth = request.auth;

  if (!auth) {
    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  try {
    const user = await db.orm.public.User.first({
      id: auth.userId,
    });

    if (!user) {
      response.status(401).json({
        error: "User not found",
      });
      return;
    }

    const institute = await db.orm.public.Institute.first({
      id: auth.instituteId,
    });

    if (!institute) {
      response.status(401).json({
        error: "Institute not found",
      });
      return;
    }

    const membership = await db.orm.public.InstituteMembership.first({
      id: auth.membershipId,
      userId: auth.userId,
      instituteId: auth.instituteId,
      status: "active",
    });

    if (!membership) {
      response.status(403).json({
        error: "Active institute membership not found",
      });
      return;
    }

    response.status(200).json({
      data: {
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
      },
    });
  } catch (error) {
    console.error("Get current user failed:", error);

    response.status(500).json({
      error: "Unable to get current user",
    });
  }
});

authRouter.post("/refresh", async (request, response) => {
  try {
    const refreshToken = request.cookies.refresh_token;

    if (
      typeof refreshToken !== "string" ||
      refreshToken.length === 0
    ) {
      response.status(401).json({
        error: "Refresh token required",
      });
      return;
    }

    const result = await refreshAccessToken(refreshToken);

    response.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.status(200).json({
      message: "Token refreshed successfully",
      data: {
        user: result.user,
        institute: result.institute,
        membership: result.membership,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AuthRefreshError) {
      response.status(401).json({
        error: error.message,
      });
      return;
    }

    console.error("POST /api/auth/refresh error:", error);

    response.status(500).json({
      error: "Failed to refresh authentication",
    });
  }
});