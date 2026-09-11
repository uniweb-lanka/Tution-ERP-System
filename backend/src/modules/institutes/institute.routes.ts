import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { requireTenant } from "../../middleware/tenant.middleware.js";

import {
  InstituteNotFoundError,
  getInstituteById,
  updateInstitute,
} from "./institute.service.js";

import { updateInstituteSchema } from "./institute.schema.js";

export const instituteRouter = Router();

instituteRouter.get(
  "/me",
  authenticate,
  requireTenant,
  async (request, response) => {
    try {
      const auth = request.auth;

      if (!auth) {
        response.status(401).json({
          error: "Authentication required",
        });
        return;
      }

      const institute = await getInstituteById(auth.instituteId);

      response.status(200).json({
        data: {
          institute,
        },
      });
    } catch (error) {
      if (error instanceof InstituteNotFoundError) {
        response.status(404).json({
          error: error.message,
        });
        return;
      }

      console.error("GET /api/institute/me error:", error);

      response.status(500).json({
        error: "Failed to load institute",
      });
    }
  },
);

instituteRouter.patch(
  "/me",
  authenticate,
  requireTenant,
  authorize("owner"),
  async (request, response) => {
    try {
      const auth = request.auth;

      if (!auth) {
        response.status(401).json({
          error: "Authentication required",
        });
        return;
      }

      const parsed = updateInstituteSchema.safeParse(request.body);

      if (!parsed.success) {
        response.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
        return;
      }

      const institute = await updateInstitute(auth.instituteId, parsed.data);

      response.status(200).json({
        message: "Institute updated successfully",
        data: {
          institute,
        },
      });
    } catch (error) {
      if (error instanceof InstituteNotFoundError) {
        response.status(404).json({
          error: error.message,
        });
        return;
      }

      console.error("PATCH /api/institute/me error:", error);

      response.status(500).json({
        error: "Failed to update institute",
      });
    }
  },
);
