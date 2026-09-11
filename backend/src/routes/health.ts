import { Router } from "express";

import { db } from "../db/db.js";

export const healthRouter = Router();

healthRouter.get("/", async (_request, response) => {
  try {
    const plan = db.sql.public.institute
      .select("id")
      .limit(1)
      .build();

    await db.runtime().execute(plan);

    response.status(200).json({
      service: "tuition-erp-api",
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    response.status(503).json({
      service: "tuition-erp-api",
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});
