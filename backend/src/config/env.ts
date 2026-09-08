import "dotenv/config";

import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
});

export const env = environmentSchema.parse(process.env);
