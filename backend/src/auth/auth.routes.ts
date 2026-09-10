import { Router } from "express";

import {
  AuthConflictError,
  AuthInvalidCredentialsError,
  loginInstituteUser,
  registerInstituteOwner,
} from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

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