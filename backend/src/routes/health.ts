import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.status(200).json({
    service: "tuition-erp-api",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
