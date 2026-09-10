import { Router } from "express";

import { AuthConflictError, registerInstituteOwner } from "./auth.service.js";
import { registerSchema } from "./auth.schema.js";

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
