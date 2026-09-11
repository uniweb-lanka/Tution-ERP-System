import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { requireTenant } from "../../middleware/tenant.middleware.js";

import {
  createEducationLevel,
  EducationLevelConflictError,
  EducationLevelNotFoundError,
  getEducationLevel,
  listEducationLevels,
  updateEducationLevel,
} from "./academic.service.js";

import {
  createEducationLevelSchema,
  updateEducationLevelSchema,
} from "./academic.schema.js";

export const academicRouter = Router();

/*
 * GET /api/academic/education-levels
 */
academicRouter.get(
  "/education-levels",
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

      const educationLevels = await listEducationLevels(auth.instituteId);

      response.status(200).json({
        data: {
          educationLevels,
        },
      });
    } catch (error) {
      console.error("GET /api/academic/education-levels error:", error);

      response.status(500).json({
        error: "Failed to load education levels",
      });
    }
  },
);

/*
 * GET /api/academic/education-levels/:id
 */
academicRouter.get(
  "/education-levels/:id",
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

      const educationLevelId = request.params.id;

      if (typeof educationLevelId !== "string") {
        response.status(400).json({
          error: "Education level ID is required",
        });
        return;
      }

      const educationLevel = await getEducationLevel(
        auth.instituteId,
        educationLevelId,
      );

      response.status(200).json({
        data: {
          educationLevel,
        },
      });
    } catch (error) {
      if (error instanceof EducationLevelNotFoundError) {
        response.status(404).json({
          error: error.message,
        });
        return;
      }

      console.error("GET /api/academic/education-levels/:id error:", error);

      response.status(500).json({
        error: "Failed to load education level",
      });
    }
  },
);

/*
 * POST /api/academic/education-levels
 */
academicRouter.post(
  "/education-levels",
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

      const parsed = createEducationLevelSchema.safeParse(request.body);

      if (!parsed.success) {
        response.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
        return;
      }

      const educationLevel = await createEducationLevel(
        auth.instituteId,
        parsed.data,
      );

      response.status(201).json({
        message: "Education level created successfully",
        data: {
          educationLevel,
        },
      });
    } catch (error) {
      if (error instanceof EducationLevelConflictError) {
        response.status(409).json({
          error: error.message,
        });
        return;
      }

      console.error("POST /api/academic/education-levels error:", error);

      response.status(500).json({
        error: "Failed to create education level",
      });
    }
  },
);

/*
 * PATCH /api/academic/education-levels/:id
 */
academicRouter.patch(
  "/education-levels/:id",
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

      const parsed = updateEducationLevelSchema.safeParse(request.body);

      if (!parsed.success) {
        response.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
        return;
      }

      const educationLevelId = request.params.id;

      if (typeof educationLevelId !== "string") {
        response.status(400).json({
          error: "Education level ID is required",
        });
        return;
      }

      const educationLevel = await updateEducationLevel(
        auth.instituteId,
        educationLevelId,
        parsed.data,
      );

      response.status(200).json({
        message: "Education level updated successfully",
        data: {
          educationLevel,
        },
      });
    } catch (error) {
      if (error instanceof EducationLevelNotFoundError) {
        response.status(404).json({
          error: error.message,
        });
        return;
      }

      if (error instanceof EducationLevelConflictError) {
        response.status(409).json({
          error: error.message,
        });
        return;
      }

      console.error("PATCH /api/academic/education-levels/:id error:", error);

      response.status(500).json({
        error: "Failed to update education level",
      });
    }
  },
);
